import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- CONSTANTES ---
const DIAS_DATA = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const MESES_DATA = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const AÑOS_DATA = Array.from({ length: 10 }, (_, i) => (new Date().getFullYear() - i).toString());

const UNIDAD_MEDIDA_DATA = ["Pieza", "Kilogramo", "Litro", "Metro", "Caja", "Paquete"];
const ESTADO_PRODUCTO_DATA = ["Excelente", "Bueno", "Regular", "Deteriorado", "En Reparación"];

// Altura ajustada para web
const ITEM_HEIGHT = 40;
const CONTAINER_HEIGHT = 160;
const WHEEL_PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;


// --- Componentes reutilizables ---

// Input de Texto
const FormInput = React.memo(
  ({ label, value, onChangeText, editable = true, multiline = false, onTouchDisabled, ...props }) => (
    <TouchableOpacity 
        onPress={!editable ? onTouchDisabled : undefined}
        activeOpacity={1}
    >
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <TextInput
          style={[
            styles.textInput,
            multiline && styles.multilineInput,
            !editable && styles.lockedInput,
          ]}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          blurOnSubmit={false}
          pointerEvents={!editable ? 'none' : 'auto'}
          {...props}
        />
      </View>
    </TouchableOpacity>
  )
);

// Selector (Simula input)
const SelectInput = React.memo(({ label, value, onPress, editable = true, onTouchDisabled }) => (
  <TouchableOpacity onPress={editable ? onPress : onTouchDisabled} activeOpacity={editable ? 0.8 : 1}>
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


// --- Componentes del Picker Modal (Optimizado para Web) ---

const JSPickerItem = ({ label, onPress, active }) => (
  <TouchableOpacity 
    style={styles.pickerItem} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[
      styles.pickerItemText, 
      active && styles.pickerItemTextActive
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// Rueda Selectora "Inteligente" (Click + Scroll)
const TumblerWheel = ({ data, onValueChange, value }) => {
  const ref = useRef(null);
  let initialIndex = data.indexOf(value);
  if (initialIndex < 0) initialIndex = 0;

  // Scroll inicial al abrir
  useEffect(() => {
    if (ref.current) {
        setTimeout(() => {
            ref.current.scrollTo({ y: initialIndex * ITEM_HEIGHT, animated: false });
        }, 100);
    }
  }, []);

  const handleScrollEnd = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < data.length) {
      const newValue = data[index];
      if (newValue !== value) onValueChange(newValue);
    }
  };

  // Selección por clic
  const handleItemPress = (item, index) => {
    onValueChange(item);
    if (ref.current) {
      ref.current.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
    }
  };

  return (
    <View style={styles.wheelContainer}>
      <ScrollView
        ref={ref}
        style={styles.jsDatePickerColumn}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{
          paddingTop: WHEEL_PADDING,
          paddingBottom: WHEEL_PADDING
        }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
      >
        {data.map((item, index) => (
          <JSPickerItem 
            key={`${item}_${index}`} 
            label={item} 
            active={item === value}
            onPress={() => handleItemPress(item, index)}
          />
        ))}
      </ScrollView>
    </View>
  );
};


// --- Pasos del Formulario ---

const Paso1 = React.memo(({ producto, onChange, editable, onTouchDisabled, onResponsablePress, onFechaIngresoPress, onUnidadMedidaPress }) => (
  <>
    <FormInput label="Nombre" value={producto.nombre} onChangeText={(val) => onChange('nombre', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput
      label="Código Interno"
      value={producto.codigoInterno}
      onChangeText={(val) => onChange('codigoInterno', val)}
      editable={editable}
      onTouchDisabled={onTouchDisabled}
    />
    <FormInput label="Categoría" value={producto.categoria} onChangeText={(val) => onChange('categoria', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <SelectInput
      label="Unidad de Medida"
      value={producto.unidadMedida}
      onPress={onUnidadMedidaPress}
      editable={editable}
      onTouchDisabled={onTouchDisabled}
    />
    <SelectInput
      label="Responsable de Registro"
      value={producto.responsableNombre || ""}
      onPress={onResponsablePress}
      editable={editable}
      onTouchDisabled={onTouchDisabled}
    />
    <SelectInput
      label="Fecha de Ingreso"
      value={
        producto.diaIngreso && producto.mesIngreso && producto.añoIngreso
          ? `${producto.diaIngreso}/${producto.mesIngreso}/${producto.añoIngreso}`
          : ""
      }
      onPress={onFechaIngresoPress}
      editable={editable}
      onTouchDisabled={onTouchDisabled}
    />
  </>
));

const Paso2 = React.memo(({ producto, onChange, onGuardar, editable, modo, onTouchDisabled, onEstadoPress }) => (
  <>
    <FormInput
      label="Cantidad"
      value={producto.cantidad}
      onChangeText={(val) => onChange('cantidad', val)}
      editable={editable}
      onTouchDisabled={onTouchDisabled}
      keyboardType="numeric"
    />
    <SelectInput
      label="Estado"
      value={producto.estado}
      onPress={onEstadoPress}
      editable={editable}
      onTouchDisabled={onTouchDisabled}
    />
    <FormInput
      label="Descripción"
      value={producto.descripcion}
      onChangeText={(val) => onChange('descripcion', val)}
      editable={editable}
      onTouchDisabled={onTouchDisabled}
      multiline
    />

    {editable && (
      <TouchableOpacity style={styles.saveButton} onPress={onGuardar}>
        <Text style={styles.saveButtonText}>
          {modo === "editar" ? "Guardar Cambios" : "Guardar Producto"}
        </Text>
      </TouchableOpacity>
    )}
  </>
));


// --- Componente Principal ---
export default function ProductosFormView({
  producto = {},
  modo = "agregar",
  onTouchDisabled,
  onChange,
  onGuardar,
  empleados = []
}) {
  const [step, setStep] = useState(1);
  const editable = modo !== "consultar";

  // Estados de visibilidad de modales
  const [showResponsableModal, setShowResponsableModal] = useState(false);
  const [showFechaIngresoModal, setShowFechaIngresoModal] = useState(false);
  const [showUnidadMedidaModal, setShowUnidadMedidaModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);

  // Estados temporales
  const [tempResponsable, setTempResponsable] = useState(null);
  const [tempDia, setTempDia] = useState('');
  const [tempMes, setTempMes] = useState('');
  const [tempAño, setTempAño] = useState('');
  const [tempUnidadMedida, setTempUnidadMedida] = useState('');
  const [tempEstado, setTempEstado] = useState('');

  // Lógica de datos de Responsable
  const RESPONSABLE_DATA = empleados.map(emp => ({
    label: `${emp.nombres} ${emp.apellido_paterno}`,
    value: emp.id_empleado
  }));
  const RESPONSABLE_LABELS = RESPONSABLE_DATA.map(r => r.label);

  // Funciones de apertura
  const openResponsableModal = () => {
    const currentLabel = producto.responsableNombre || (RESPONSABLE_LABELS.length > 0 ? RESPONSABLE_LABELS[0] : '');
    const currentValue = producto.idResponsable || (RESPONSABLE_DATA.length > 0 ? RESPONSABLE_DATA[0].value : '');
    setTempResponsable({ label: currentLabel, value: currentValue });
    setShowResponsableModal(true);
  };

  const openFechaIngresoModal = () => {
    setTempDia(producto.diaIngreso || DIAS_DATA[0]);
    setTempMes(producto.mesIngreso || MESES_DATA[0]);
    setTempAño(producto.añoIngreso || AÑOS_DATA[0]);
    setShowFechaIngresoModal(true);
  };

  const openUnidadMedidaModal = () => {
    setTempUnidadMedida(producto.unidadMedida || UNIDAD_MEDIDA_DATA[0]);
    setShowUnidadMedidaModal(true);
  };

  const openEstadoModal = () => {
    setTempEstado(producto.estado || ESTADO_PRODUCTO_DATA[0]);
    setShowEstadoModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContainer}
      >
        {step === 1 && (
          <Paso1
            producto={producto}
            onChange={onChange}
            editable={editable}
            onTouchDisabled={onTouchDisabled}
            onResponsablePress={() => (editable ? openResponsableModal() : onTouchDisabled())}
            onFechaIngresoPress={() => (editable ? openFechaIngresoModal() : onTouchDisabled())}
            onUnidadMedidaPress={() => (editable ? openUnidadMedidaModal() : onTouchDisabled())}
          />
        )}

        {step === 2 && (
          <Paso2
            producto={producto}
            onChange={onChange}
            onGuardar={onGuardar}
            editable={editable}
            modo={modo}
            onTouchDisabled={onTouchDisabled}
            onEstadoPress={() => (editable ? openEstadoModal() : onTouchDisabled())}
          />
        )}

        <View style={styles.buttonRow}>
          {step > 1 && (
            <TouchableOpacity style={[styles.navButton, styles.backButton]} onPress={() => setStep(step - 1)}>
              <Text style={styles.navButtonText}>Regresar</Text>
            </TouchableOpacity>
          )}
          {step < 2 && (
            <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={() => setStep(step + 1)}>
              <Text style={styles.navButtonText}>Continuar</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* --- MODALES DE SELECCIÓN (TARJETAS FLOTANTES) --- */}

      {/* Modal Fecha Ingreso */}
      <Modal visible={showFechaIngresoModal} animationType="fade" transparent={true} onRequestClose={() => setShowFechaIngresoModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowFechaIngresoModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Fecha de Ingreso</Text>
                    <TouchableOpacity onPress={() => {
                        onChange('diaIngreso', tempDia);
                        onChange('mesIngreso', tempMes);
                        onChange('añoIngreso', tempAño);
                        setShowFechaIngresoModal(false);
                    }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsDatePickerContainer}>
                    <TumblerWheel data={DIAS_DATA} onValueChange={setTempDia} value={tempDia} />
                    <TumblerWheel data={MESES_DATA} onValueChange={setTempMes} value={tempMes} />
                    <TumblerWheel data={AÑOS_DATA} onValueChange={setTempAño} value={tempAño} />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
      </Modal>

      {/* Modal Responsable */}
      <Modal visible={showResponsableModal} animationType="fade" transparent={true} onRequestClose={() => setShowResponsableModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowResponsableModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Responsable</Text>
                    <TouchableOpacity onPress={() => {
                        const selectedLabel = tempResponsable ? tempResponsable.label : RESPONSABLE_LABELS[0];
                        const selectedData = RESPONSABLE_DATA.find(r => r.label === selectedLabel) || (RESPONSABLE_DATA.length > 0 ? RESPONSABLE_DATA[0] : { value: '', label: '' });
                        onChange('idResponsable', selectedData.value);
                        onChange('responsableNombre', selectedData.label);
                        setShowResponsableModal(false);
                    }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsPickerContainer}>
                    <TumblerWheel
                        data={RESPONSABLE_LABELS}
                        onValueChange={(label) => setTempResponsable({ ...tempResponsable, label })}
                        value={tempResponsable ? tempResponsable.label : ''}
                    />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
      </Modal>

      {/* Modal Unidad de Medida */}
      <Modal visible={showUnidadMedidaModal} animationType="fade" transparent={true} onRequestClose={() => setShowUnidadMedidaModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowUnidadMedidaModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Unidad de Medida</Text>
                    <TouchableOpacity onPress={() => {
                        onChange('unidadMedida', tempUnidadMedida);
                        setShowUnidadMedidaModal(false);
                    }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsPickerContainer}>
                    <TumblerWheel data={UNIDAD_MEDIDA_DATA} onValueChange={setTempUnidadMedida} value={tempUnidadMedida} />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
      </Modal>

      {/* Modal Estado */}
      <Modal visible={showEstadoModal} animationType="fade" transparent={true} onRequestClose={() => setShowEstadoModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowEstadoModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Estado</Text>
                    <TouchableOpacity onPress={() => {
                        onChange('estado', tempEstado);
                        setShowEstadoModal(false);
                    }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsPickerContainer}>
                    <TumblerWheel data={ESTADO_PRODUCTO_DATA} onValueChange={setTempEstado} value={tempEstado} />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  inputContainer: { marginBottom: 18 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 },
  textInput: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderColor: "#BDC3C7",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#333',
  },
  textInput_value: { color: '#333', fontSize: 15 },
  textInput_placeholder: { color: '#999', fontSize: 15 },
  lockedInput: { backgroundColor: "#e6e6e6" },
  multilineInput: { height: 100, textAlignVertical: 'top' },
  
  // Botones
  navButton: {
    flex: 1,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  backButton: { backgroundColor: "#006480" },
  nextButton: { backgroundColor: "#77a7ab" },
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

  // --- NUEVOS ESTILOS PICKER (Tarjeta Flotante) ---
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: '90%',
    maxWidth: 400, // Limita ancho en Web
    paddingBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    overflow: 'hidden'
  },
  pickerHeader: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#006480",
    fontWeight: "bold",
  },
  
  jsPickerContainer: {
    height: CONTAINER_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  jsDatePickerContainer: {
    flexDirection: "row",
    height: CONTAINER_HEIGHT,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
  wheelContainer: { flex: 1 },
  jsDatePickerColumn: { flex: 1, height: CONTAINER_HEIGHT },
  
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: 16,
    color: "#999",
  },
  pickerItemTextActive: {
    color: "#000",
    fontWeight: "600",
    fontSize: 17,
  },
  pickerHighlight: {
    position: 'absolute',
    top: '50%',
    left: 15,
    right: 15,
    height: ITEM_HEIGHT,
    marginTop: -ITEM_HEIGHT / 2,
    backgroundColor: 'rgba(119, 167, 171, 0.15)',
    borderRadius: 8,
    pointerEvents: 'none',
  },
});
