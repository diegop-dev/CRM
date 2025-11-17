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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- CONSTANTES DE DATOS ---
const METODO_PAGO_DATA = ["Efectivo", "Tarjeta", "Transferencia"];

// --- Componentes reutilizables (Sin cambios) ---
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

// --- Componente de Lista Simple (Sin cambios) ---
const SimplePickerList = ({ data, onSelect, currentValue }) => {
  const isObjectList = (typeof data[0] === 'object' && data[0] !== null);
  
  return (
    <ScrollView style={styles.simplePickerContainer}>
      {data.map((item, index) => {
        const label = isObjectList ? item.label : item;
        const isSelected = currentValue === label;

        return (
          <TouchableOpacity
            key={index}
            style={[styles.simplePickerItem, isSelected && styles.simplePickerItemSelected]}
            onPress={() => onSelect(item)} 
          >
            <Text style={[
              styles.simplePickerItemText, 
              isSelected && styles.simplePickerItemSelectedText
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

// --- Formateador de Moneda (Sin cambios) ---
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

// --- Componentes "Paso1" y "Paso2" eliminados ---


// --- Componente Principal ---
export default function FacturaFormView({
  factura = {},
  modo = "crear",
  onChange,
  onGuardar,
  onRegresar, // <-- NUEVA PROP
  clientes = [] 
}) {
  
  // --- 'step' state eliminado ---
  const editable = modo !== "consultar";

  // --- Estados de los Modales ---
  const [showEmisionModal, setShowEmisionModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showMetodoPagoModal, setShowMetodoPagoModal] = useState(false);

  // --- Estados Temporales de Fecha ---
  const [tempDiaEmision, setTempDiaEmision] = useState('');
  const [tempMesEmision, setTempMesEmision] = useState('');
  const [tempAñoEmision, setTempAñoEmision] = useState('');

  // --- Datos para Pickers ---
  const CLIENTE_DATA = clientes.map(cli => ({
    label: `${cli.nombres} ${cli.apellido_paterno} (${cli.rfc})`, 
    value: cli.id_cliente
  }));

  // --- Funciones para Abrir Modales ---
  const openEmisionModal = () => {
    setTempDiaEmision(factura.diaEmision || '');
    setTempMesEmision(factura.mesEmision || '');
    setTempAñoEmision(factura.añoEmision || '');
    setShowEmisionModal(true);
  };
  const openMetodoPagoModal = () => setShowMetodoPagoModal(true);
  const openClienteModal = () => setShowClienteModal(true);

  // --- Lógica de formato de monto (Sin cambios) ---
  const [displayMonto, setDisplayMonto] = useState(formatCurrency(factura.montoTotal).display);
  const handleMontoChange = (text) => {
    const { display, numeric } = formatCurrency(text);
    setDisplayMonto(display);
    onChange('montoTotal', numeric);
  };
  const handleMontoBlur = () => {
    setDisplayMonto(formatCurrency(factura.montoTotal).display);
  };

  // --- Lógica de Archivo (Sin cambios) ---
  const handleSubirArchivo = () => {
    Alert.alert("Subir Archivo", "Aquí se abriría la librería de archivos 📁");
  };

  // --- Funciones de Validación de Fecha ---
  const handleDiaChange = (text, setter) => {
    const numericText = text.replace(/[^0-9]/g, ''); 
    if (numericText === '') { setter(''); return; }
    if (numericText === '0' || numericText === '00') { setter(numericText); return; }
    const value = parseInt(numericText, 10);
    if (value > 31) { setter('31'); } else { setter(numericText); }
  };
  const handleMesChange = (text, setter) => {
    const numericText = text.replace(/[^0-9]/g, ''); 
    if (numericText === '') { setter(''); return; }
    if (numericText === '0' || numericText === '00') { setter(numericText); return; }
    const value = parseInt(numericText, 10);
    if (value > 12) { setter('12'); } else { setter(numericText); }
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContainer}
      >
        
        {/* --- NUEVO LAYOUT DE 2 COLUMNAS --- */}
        <View style={styles.columnsContainer}>

          {/* --- Columna Izquierda --- */}
          <View style={styles.leftColumn}>
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
              maxLength={12}
              placeholder="123456789012"
            />
            <SelectInput
              label="Fecha de Emisión"
              value={
                factura.diaEmision && factura.mesEmision && factura.añoEmision
                  ? `${factura.diaEmision}/${factura.mesEmision}/${factura.añoEmision}`
                  : ""
              }
              onPress={openEmisionModal} // <-- Modal flotante de fecha
              editable={editable}
            />
            <SelectInput 
              label="Cliente / Proveedor + RFC" 
              value={factura.clienteNombre || ""}
              onPress={openClienteModal} // <-- Modal flotante de lista
              editable={editable} 
            />
            <FormInput
              label="Monto Total"
              value={displayMonto} 
              onChangeText={handleMontoChange} 
              onBlur={handleMontoBlur} 
              editable={editable}
              keyboardType="numeric"
              placeholder="$ 0.00 MXN"
            />
            <SelectInput 
              label="Método de Pago" 
              value={factura.metodoPago} 
              onPress={openMetodoPagoModal} // <-- Modal flotante de lista
              editable={editable} 
            />
          </View>

          {/* --- Columna Derecha --- */}
          <View style={styles.rightColumn}>
            <FormInput 
              label="Responsable de Registro" 
              value={factura.responsableRegistro} 
              onChangeText={(val) => onChange('responsableRegistro', val)} 
              editable={editable} 
              placeholder="Nombre Apellido"
            />
            <Text style={styles.inputLabel}>Subir Archivo</Text>
            <TouchableOpacity 
              style={styles.fileButton} 
              onPress={handleSubirArchivo}
              disabled={!editable}
            >
              <Text style={styles.fileButtonText}>📁</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* --- NUEVA FILA DE BOTONES FINALES --- */}
        {editable && (
          <View style={styles.finalButtonRow}>
            <TouchableOpacity
              style={[styles.finalButton, styles.regresarButton]}
              onPress={onRegresar}
            >
              <Text style={styles.finalButtonText}>Regresar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.finalButton, styles.guardarButton]}
              onPress={onGuardar}
            >
              <Text style={styles.finalButtonText}>
                {modo === "editar" ? "Guardar Cambios" : "Guardar Factura"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* --- MODALES --- */}

      {/* --- MODALES DE LISTA SIMPLE (FLOTANTES) --- */}
      <Modal visible={showMetodoPagoModal} animationType="fade" transparent={true} onRequestClose={() => setShowMetodoPagoModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowMetodoPagoModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={METODO_PAGO_DATA}
            currentValue={factura.metodoPago}
            onSelect={(selectedItem) => {
              onChange('metodoPago', selectedItem); 
              setShowMetodoPagoModal(false); 
            }}
          />
        </View>
      </Modal>

      <Modal visible={showClienteModal} animationType="fade" transparent={true} onRequestClose={() => setShowClienteModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowClienteModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={CLIENTE_DATA}
            currentValue={factura.clienteNombre}
            onSelect={(selectedItem) => {
              onChange('idCliente', selectedItem.value);
              onChange('clienteNombre', selectedItem.label);
              setShowClienteModal(false);
            }}
          />
        </View>
      </Modal>

      {/* --- MODAL DE FECHA (FLOTANTE) --- */}
      <Modal visible={showEmisionModal} animationType="fade" transparent={true} onRequestClose={() => setShowEmisionModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowEmisionModal(false)} />
        <View style={styles.datePickerModal}>
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
          <View style={styles.dateModalContainer}>
            <View style={styles.dateInputColumn}>
              <Text style={styles.inputLabel}>Día</Text>
              <TextInput
                style={styles.dateInput}
                value={tempDiaEmision}
                onChangeText={(text) => handleDiaChange(text, setTempDiaEmision)}
                keyboardType="numeric"
                maxLength={2}
                placeholder="DD"
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.dateInputColumn}>
              <Text style={styles.inputLabel}>Mes</Text>
              <TextInput
                style={styles.dateInput}
                value={tempMesEmision}
                onChangeText={(text) => handleMesChange(text, setTempMesEmision)}
                keyboardType="numeric"
                maxLength={2}
                placeholder="MM"
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.dateInputColumn}>
              <Text style={styles.inputLabel}>Año</Text>
              <TextInput
                style={styles.dateInput}
                value={tempAñoEmision}
                onChangeText={(text) => onChange('añoEmision', text.replace(/[^0-9]/g, ''))} // Solo números
                keyboardType="numeric"
                maxLength={4}
                placeholder="AAAA"
                placeholderTextColor="#999"
              />
            </View>
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
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftColumn: {
    width: '48%',
  },
  rightColumn: {
    width: '48%',
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
    backgroundColor: "#e6e6e6"
  },
  multilineInput: { 
    height: 100,
    textAlignVertical: 'top'
  },
  finalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    marginTop: 30,
    marginBottom: 40,
  },
  finalButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginLeft: 10, 
    alignItems: 'center',
  },
  regresarButton: {
    backgroundColor: '#6c757d', 
  },
  guardarButton: {
    backgroundColor: '#77a7ab', 
  },
  finalButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
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
  pickerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  // --- ESTILOS DE LISTA SIMPLE FLOTANTE ---
  listPickerModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -175 }, { translateY: -150 }], 
    width: 350, 
    backgroundColor: '#2b3042',
    borderRadius: 20,
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    overflow: 'hidden', 
  },
  simplePickerContainer: {
    maxHeight: 300, 
    paddingVertical: 10, 
  },
  simplePickerItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3f50', 
  },
  simplePickerItemText: {
    color: '#f0f0f0', 
    fontSize: 17,
    textAlign: 'center',
  },
  simplePickerItemSelected: {
    backgroundColor: '#3a3f50', 
  },
  simplePickerItemSelectedText: {
    color: '#77a7ab', 
    fontWeight: '600',
  },

  // --- ESTILOS DE FECHA FLOTANTE ---
  datePickerModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -175 }, { translateY: -125 }], 
    width: 350, 
    backgroundColor: '#2b3042', 
    borderRadius: 20,
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    overflow: 'hidden', 
  },
  pickerHeader: { 
    backgroundColor: '#3a3f50', 
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#5a5f70', 
    alignItems: 'flex-end',
  },
  pickerButtonText: { 
    fontSize: 16,
    color: "#77a7ab", 
    fontWeight: "600",
  },
  dateModalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 20, 
  },
  dateInputColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  dateInput: {
    backgroundColor: '#3a3f50', 
    color: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#5a5f70',
  },
});