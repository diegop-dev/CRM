import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  Alert, // <--- Importamos Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- CONSTANTES DE DATOS ---
const METODO_PAGO_DATA = ["Efectivo", "Tarjeta", "Transferencia"];
const DIAS_DATA = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const MESES_DATA = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const AÑOS_DATA = Array.from({ length: 10 }, (_, i) => (2024 + i).toString());

// --- CONSTANTES DE ESTILO DEL PICKER ---
const ITEM_HEIGHT = 44;
const CONTAINER_HEIGHT = 220;
const WHEEL_PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;


// --- Componentes reutilizables (Copiados de proyectoform.jsx) ---
// (Componente de Input de Texto)
const FormInput = React.memo(({ label, value, onChangeText, editable = true, multiline = false, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[
        styles.textInput,
        multiline && styles.multilineInput,
        !editable && styles.lockedInput
      ]}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      multiline={multiline}
      textAlignVertical={multiline ? "top" : "center"}
      blurOnSubmit={false}
      placeholderTextColor="#999"
      {...props}
    />
  </View>
));

// (Componente de Selector Táctil)
const SelectInput = React.memo(({ label, value, onPress, editable = true }) => (
  <TouchableOpacity onPress={editable ? onPress : undefined} activeOpacity={editable ? 0.8 : 1}>
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.textInput,
          { justifyContent: "center" },
          !editable && styles.lockedInput,
        ]}
      >
        <Text style={value ? styles.textInput_value : styles.textInput_placeholder}>
          {value || "Seleccione..."}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
));

// (Item individual del picker)
const JSPickerItem = ({ label }) => (
  <View style={styles.pickerItem}>
    <Text style={styles.pickerItemText}>
      {label}
    </Text>
  </View>
);

// (Rueda selectora)
const TumblerWheel = ({ data, onValueChange, value }) => {
  const ref = React.useRef(null);
  let initialIndex = data.indexOf(value);
  if (initialIndex < 0) initialIndex = 0;
  const initialOffset = initialIndex * ITEM_HEIGHT;

  const handleScrollEnd = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < data.length) {
      const newValue = data[index];
      onValueChange(newValue);
    }
  };

  return (
    <ScrollView
      ref={ref}
      style={styles.jsDatePickerColumn}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      contentOffset={{ y: initialOffset }}
      contentContainerStyle={{ 
        paddingTop: WHEEL_PADDING, 
        paddingBottom: WHEEL_PADDING
      }}
      onMomentumScrollEnd={handleScrollEnd}
      onScrollEndDrag={handleScrollEnd}
    >
      {data.map((item, index) => <JSPickerItem key={`${item}_${index}`} label={item} />)}
    </ScrollView>
  );
};

// --- Formateador de Moneda ---
// Función simple para formatear el monto
const formatCurrency = (value) => {
  const cleanValue = (value || "").toString().replace(/[^0-9.]/g, '');
  if (cleanValue === "" || cleanValue === ".") return { display: "$ 0.00 MXN", numeric: "" };
  
  const numericValue = parseFloat(cleanValue);
  if (isNaN(numericValue)) return { display: "$ 0.00 MXN", numeric: "" };

  const display = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(numericValue);

  return { display, numeric: cleanValue };
};


// --- Paso 1 ---
const Paso1 = ({ factura, onChange, editable, onEmisionPress, onClientePress, onMetodoPagoPress }) => {
  
  // Lógica de formato de monto
  const [displayMonto, setDisplayMonto] = useState(formatCurrency(factura.montoTotal).display);

  const handleMontoChange = (text) => {
    const { display, numeric } = formatCurrency(text);
    setDisplayMonto(display); // Actualiza la vista
    onChange('montoTotal', numeric); // Actualiza el estado
  };

  const handleMontoBlur = () => {
    // Al salir, formatea bonito el valor que está en el estado
    setDisplayMonto(formatCurrency(factura.montoTotal).display);
  };

  return (
    <>
      <FormInput 
        label="ID de Factura" 
        value="Autogenerado" 
        editable={false} 
      />
      <FormInput 
        label="Número de Folio" 
        value={factura.numeroFolio} 
        onChangeText={(val) => onChange('numeroFolio', val)} 
        editable={editable} 
        keyboardType="numeric"
        maxLength={12} // Como pediste 12 dígitos
        placeholder="123456789012"
      />
      <SelectInput
        label="Fecha de Emisión"
        value={
          factura.diaEmision && factura.mesEmision && factura.añoEmision
            ? `${factura.añoEmision}/${factura.mesEmision}/${factura.diaEmision}` // AAAA/MM/DD
            : ""
        }
        onPress={onEmisionPress}
        editable={editable}
      />
      <SelectInput 
        label="Cliente / Proveedor + RFC" 
        value={factura.clienteNombre || ""} // Mostramos el nombre
        onPress={onClientePress} 
        editable={editable} 
      />
      <FormInput
        label="Monto Total"
        value={displayMonto} // Usamos el valor formateado
        onChangeText={handleMontoChange} // Usamos el manejador especial
        onBlur={handleMontoBlur} // Formatea al salir
        editable={editable}
        keyboardType="numeric"
        placeholder="$ 0.00 MXN"
      />
      <SelectInput 
        label="Método de Pago" 
        value={factura.metodoPago} 
        onPress={onMetodoPagoPress} 
        editable={editable} 
      />
    </>
  );
};


// --- Paso 2 ---
const Paso2 = ({ factura, onChange, onGuardar, editable, modo }) => {
  
  const handleSubirArchivo = () => {
    // Por ahora, solo una alerta. Aquí iría la lógica de ImagePicker
    Alert.alert("Subir Archivo", "Aquí se abriría la librería de archivos 📁");
  };

  return (
    <>
      <FormInput 
        label="Responsable de Registro" 
        value={factura.responsableRegistro} 
        onChangeText={(val) => onChange('responsableRegistro', val)} 
        editable={editable} 
        placeholder="Nombre Apellido"
      />

      {/* Botón de Subir Archivo */}
      <Text style={styles.inputLabel}>Subir Archivo</Text>
      <TouchableOpacity 
        style={styles.fileButton} 
        onPress={handleSubirArchivo}
        disabled={!editable}
      >
        <Text style={styles.fileButtonText}>📁</Text>
      </TouchableOpacity>
  
      {editable && (
        <TouchableOpacity style={styles.saveButton} onPress={onGuardar}>
          <Text style={styles.saveButtonText}>
            {modo === "editar" ? "Guardar Cambios" : "Guardar Factura"}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};


// --- Componente Principal ---
export default function FacturaFormView({
  factura = {},
  modo = "crear",
  onChange,
  onGuardar,
  clientes = [] // Recibe la lista de clientes
}) {
  
  const [step, setStep] = useState(1);
  const editable = modo !== "consultar";

  // --- Estados de los Modales ---
  const [showEmisionModal, setShowEmisionModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showMetodoPagoModal, setShowMetodoPagoModal] = useState(false);

  // --- Estados Temporales de los Pickers ---
  const [tempDiaEmision, setTempDiaEmision] = useState('');
  const [tempMesEmision, setTempMesEmision] = useState('');
  const [tempAñoEmision, setTempAñoEmision] = useState('');
  const [tempCliente, setTempCliente] = useState(null); // { label, value }
  const [tempMetodoPago, setTempMetodoPago] = useState('');

  // --- Datos para Pickers ---
  // Formateamos los clientes para el picker
  const CLIENTE_DATA = clientes.map(cli => ({
    label: `${cli.nombres} ${cli.apellido_paterno} (${cli.rfc})`, // "Nombre Apellido (RFC)"
    value: cli.id_cliente
  }));
  const CLIENTE_LABELS = CLIENTE_DATA.map(r => r.label);

  // --- Funciones para Abrir Modales (con valores iniciales) ---
  const openEmisionModal = () => {
    setTempDiaEmision(factura.diaEmision || DIAS_DATA[0]);
    setTempMesEmision(factura.mesEmision || MESES_DATA[0]);
    setTempAñoEmision(factura.añoEmision || AÑOS_DATA[0]);
    setShowEmisionModal(true);
  };
  const openMetodoPagoModal = () => {
    setTempMetodoPago(factura.metodoPago || METODO_PAGO_DATA[0]);
    setShowMetodoPagoModal(true);
  };
  const openClienteModal = () => {
    const currentLabel = factura.clienteNombre || (CLIENTE_LABELS[0] || "");
    const currentValue = factura.idCliente || (CLIENTE_DATA[0] ? CLIENTE_DATA[0].value : '');
    setTempCliente({ label: currentLabel, value: currentValue });
    setShowClienteModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContainer}
      >
        {step === 1 ? (
          <Paso1
            factura={factura}
            onChange={onChange}
            editable={editable}
            onEmisionPress={openEmisionModal}
            onClientePress={openClienteModal}
            onMetodoPagoPress={openMetodoPagoModal}
          />
        ) : (
          <Paso2
            factura={factura}
            onChange={onChange}
            onGuardar={onGuardar}
            editable={editable}
            modo={modo}
          />
        )}

        <View style={styles.buttonRow}>
          {step > 1 && (
            <TouchableOpacity
              style={[styles.navButton, styles.backButton]}
              onPress={() => setStep(step - 1)}
            >
              <Text style={styles.navButtonText}>Regresar</Text>
            </TouchableOpacity>
          )}
          {step < 2 && (
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={() => setStep(step + 1)}
            >
              <Text style={styles.navButtonText}>Continuar</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* --- MODALES --- */}

      {/* Modal Método de Pago */}
      <Modal visible={showMetodoPagoModal} animationType="slide" transparent={true} onRequestClose={() => setShowMetodoPagoModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowMetodoPagoModal(false)} />
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => {
              onChange('metodoPago', tempMetodoPago);
              setShowMetodoPagoModal(false);
            }}>
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jsPickerContainer}>
            <TumblerWheel data={METODO_PAGO_DATA} onValueChange={setTempMetodoPago} value={tempMetodoPago} />
            <View style={styles.pickerHighlight} pointerEvents="none" />
          </View>
        </View>
      </Modal>

      {/* Modal Fecha Emisión */}
      <Modal visible={showEmisionModal} animationType="slide" transparent={true} onRequestClose={() => setShowEmisionModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowEmisionModal(false)} />
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => {
              onChange('diaEmision', tempDiaEmision);
              onChange('mesEmision', tempMesEmision);
              onChange('añoEmision', tempAñoEmision);
              setShowEmisionModal(false);
            }}>
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jsDatePickerContainer}>
            <TumblerWheel data={AÑOS_DATA} onValueChange={setTempAñoEmision} value={tempAñoEmision} />
            <TumblerWheel data={MESES_DATA} onValueChange={setTempMesEmision} value={tempMesEmision} />
            <TumblerWheel data={DIAS_DATA} onValueChange={setTempDiaEmision} value={tempDiaEmision} />
            <View style={styles.pickerHighlight} pointerEvents="none" />
          </View>
        </View>
      </Modal>

      {/* Modal Cliente */}
      <Modal visible={showClienteModal} animationType="slide" transparent={true} onRequestClose={() => setShowClienteModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowClienteModal(false)} />
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => {
              // Encontramos el objeto {label, value} basado en el label
              const selectedData = CLIENTE_DATA.find(r => r.label === (tempCliente ? tempCliente.label : '')) || CLIENTE_DATA[0];
              if (selectedData) {
                onChange('idCliente', selectedData.value);
                onChange('clienteNombre', selectedData.label);
              }
              setShowClienteModal(false);
            }}>
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jsPickerContainer}>
            <TumblerWheel 
              data={CLIENTE_LABELS} 
              onValueChange={(label) => setTempCliente({ ...tempCliente, label })} 
              value={tempCliente ? tempCliente.label : ''} 
            />
            <View style={styles.pickerHighlight} pointerEvents="none" />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// --- Estilos ---
// (Copiados de proyectoform.jsx para consistencia)
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  inputContainer: { marginBottom: 18 },
  inputLabel: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#ffffff",
    marginBottom: 8 
  },
  textInput: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderColor: "#BDC3C7",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#333",
  },
  textInput_value: {
    color: '#333',
    fontSize: 15,
  },
  textInput_placeholder: {
    color: '#999',
    fontSize: 15,
  },
  lockedInput: {
    backgroundColor: "#e6e6e6",
    color: "#555"
  },
  multilineInput: { 
    height: 100,
    textAlignVertical: 'top'
  },
  navButton: { 
    flex: 1, 
    borderRadius: 25, 
    paddingVertical: 12, 
    alignItems: "center", 
    marginHorizontal: 5 
  },
  backButton: { backgroundColor: "#006480" }, // Un color diferente para regresar
  nextButton: { backgroundColor: "#77a7ab" }, // Color principal
  navButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  buttonRow: { flexDirection: "row", marginTop: 25, marginBottom: 40 },
  saveButton: { 
    backgroundColor: "#77a7ab", 
    borderRadius: 25, 
    paddingVertical: 12, 
    alignItems: "center", 
    marginTop: 25 
  },
  saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },

  // Estilos para el botón de archivo
  fileButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#BDC3C7',
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },
  fileButtonText: {
    fontSize: 24, // Emoji más grande
  },

  // --- Estilos del Picker Modal ---
  pickerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  pickerSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30, // SafeArea para bottom
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 5,
  },
  pickerHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#CCC',
    alignItems: 'flex-end',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#007AFF", // Color iOS "Done"
    fontWeight: "500",
  },
  jsPickerContainer: {
    height: CONTAINER_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  jsDatePickerContainer: {
    flexDirection: "row",
    height: CONTAINER_HEIGHT,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
  jsDatePickerColumn: {
    flex: 1,
    height: CONTAINER_HEIGHT,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: 16,
    color: "#333",
  },
  pickerHighlight: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
    position: 'absolute',
    top: '50%',
    left: 10,
    right: 10,
    height: ITEM_HEIGHT,
    marginTop: -ITEM_HEIGHT / 2,
    backgroundColor: 'rgba(77, 77, 77, 0.05)',
  },
});