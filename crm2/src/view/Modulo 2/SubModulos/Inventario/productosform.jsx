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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- CONSTANTES (omito por brevedad) ---
const DIAS_DATA = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const MESES_DATA = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const AÑOS_DATA = Array.from({ length: 5 }, (_, i) => (new Date().getFullYear() - i).toString());

const UNIDAD_MEDIDA_DATA = ["Pieza", "Kilogramo", "Litro", "Metro", "Caja", "Paquete"];
const ESTADO_PRODUCTO_DATA = ["Excelente", "Bueno", "Regular", "Deteriorado", "En Reparación"];

const ITEM_HEIGHT = 44;
const CONTAINER_HEIGHT = 220;
const WHEEL_PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;


// --- Componentes reutilizables (omito por brevedad) ---
const FormInput = React.memo(
  ({ label, value, onChangeText, editable = true, multiline = false, onTouchDisabled, ...props }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TouchableOpacity
        activeOpacity={editable ? 1 : 0.8}
        onPress={!editable ? onTouchDisabled : undefined}
      >
        <TextInput
          style={[
            styles.textInput,
            multiline && styles.multilineInput,
            !editable && { backgroundColor: "#FFFFFF" },
          ]}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          blurOnSubmit={false}
          {...props}
        />
      </TouchableOpacity>
    </View>
  )
);

const SelectInput = React.memo(({ label, value, onPress, editable = true, onTouchDisabled }) => (
  <TouchableOpacity onPress={editable ? onPress : onTouchDisabled} activeOpacity={editable ? 0.8 : 0.7}>
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[
          styles.textInput,
          { justifyContent: "center" },
          !editable && { backgroundColor: "#FFFFFF" },
        ]}
      >
        <Text style={value ? styles.textInput_value : styles.textInput_placeholder}>
          {value || "Seleccione..."}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
));


// --- Paso 1 ---
const Paso1 = React.memo(({ producto, onChange, editable, onTouchDisabled, onResponsablePress, onFechaIngresoPress, onUnidadMedidaPress }) => (
  <>
    <FormInput label="Nombre" value={producto.nombre} onChangeText={(val) => onChange('nombre', val)} editable={editable} onTouchDisabled={onTouchDisabled} />

    {/* CORRECCIÓN: Usamos codigoInterno (camelCase) */}
    <FormInput
      label="Código Interno"
      value={producto.codigoInterno} // 👈 CORREGIDO: Lectura en camelCase
      onChangeText={(val) => onChange('codigoInterno', val)} // 👈 CORREGIDO: Escritura en camelCase
      editable={editable}
      onTouchDisabled={onTouchDisabled}
    />
    <FormInput label="Categoría" value={producto.categoria} onChangeText={(val) => onChange('categoria', val)} editable={editable} onTouchDisabled={onTouchDisabled} />

    {/* CORRECCIÓN: Usamos unidadMedida (camelCase) */}
    <SelectInput
      label="Unidad de Medida"
      value={producto.unidadMedida} // 👈 CORREGIDO: Lectura en camelCase
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

// --- Paso 2 ---
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

    {/* CORRECCIÓN: Usamos estado (camelCase) */}
    <SelectInput
      label="Estado"
      value={producto.estado} // Lectura en camelCase
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
          {modo === "editar" ? "Guardar Cambios" : "Guardar"}
        </Text>
      </TouchableOpacity>
    )}
  </>
));

// --- Componente de Picker en JS (sin cambios) ---
const JSPickerItem = ({ label }) => (
  <View style={styles.pickerItem}>
    <Text style={styles.pickerItemText}>
      {label}
    </Text>
  </View>
);

// --- Componente de Rueda Selectora (sin cambios) ---
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


// --- Principal ---
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

  const [showResponsableModal, setShowResponsableModal] = useState(false);
  const [showFechaIngresoModal, setShowFechaIngresoModal] = useState(false);

  const [showUnidadMedidaModal, setShowUnidadMedidaModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);

  const [tempResponsable, setTempResponsable] = useState(null);
  const [tempDia, setTempDia] = useState('');
  const [tempMes, setTempMes] = useState('');
  const [tempAño, setTempAño] = useState('');

  const [tempUnidadMedida, setTempUnidadMedida] = useState('');
  const [tempEstado, setTempEstado] = useState('');


  // --- LÓGICA DEL PICKER DE RESPONSABLE (Mantenida) ---
  const RESPONSABLE_DATA = empleados.map(emp => ({
    label: `${emp.nombres} ${emp.apellido_paterno}`,
    value: emp.id_empleado
  }));
  const RESPONSABLE_LABELS = RESPONSABLE_DATA.map(r => r.label);
  // --- FIN LÓGICA RESPONSABLE ---


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

  // --- FUNCIONES AÑADIDAS ---
  const openUnidadMedidaModal = () => {
    // CORRECCIÓN: Lee la propiedad en camelCase
    setTempUnidadMedida(producto.unidadMedida || UNIDAD_MEDIDA_DATA[0]);
    setShowUnidadMedidaModal(true);
  };

  const openEstadoModal = () => {
    setTempEstado(producto.estado || ESTADO_PRODUCTO_DATA[0]);
    setShowEstadoModal(true);
  };
  // --- FIN FUNCIONES AÑADIDAS ---

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start", paddingHorizontal: 20 }}
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

      {/* --- MODALES --- */}

      {/* --- MODAL FECHA INGRESO --- */}
      <Modal
        visible={showFechaIngresoModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFechaIngresoModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowFechaIngresoModal(false)} />
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
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
        </View>
      </Modal>

      {/* --- MODAL RESPONSABLE --- */}
      <Modal visible={showResponsableModal} animationType="slide" transparent={true} onRequestClose={() => setShowResponsableModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowResponsableModal(false)} />
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
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
        </View>
      </Modal>

      {/* --- MODAL UNIDAD DE MEDIDA (AÑADIDO) --- */}
      <Modal
        visible={showUnidadMedidaModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowUnidadMedidaModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowUnidadMedidaModal(false)} />
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => {
              onChange('unidadMedida', tempUnidadMedida); // 👈 CORREGIDO: Usamos camelCase en onChange
              setShowUnidadMedidaModal(false);
            }}>
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jsPickerContainer}>
            <TumblerWheel data={UNIDAD_MEDIDA_DATA} onValueChange={setTempUnidadMedida} value={tempUnidadMedida} />
            <View style={styles.pickerHighlight} pointerEvents="none" />
          </View>
        </View>
      </Modal>

      {/* --- MODAL ESTADO (AÑADIDO) --- */}
      <Modal
        visible={showEstadoModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEstadoModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowEstadoModal(false)} />
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
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
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#ec0c0cff", marginBottom: 10 },
  textInput: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderColor: "#BDC3C7",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    fontSize: 16,
    color: '#333',
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  textInput_value: {
    color: '#333',
    fontSize: 16,
  },
  textInput_placeholder: {
    color: '#999',
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  navButton: {
    flex: 1,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: "center",
    marginHorizontal: 5,
  },
  backButton: { backgroundColor: "#77a7ab" },
  nextButton: { backgroundColor: "#006480" },
  navButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  buttonRow: { flexDirection: "row", marginTop: 15, marginBottom: 30 },
  saveButton: { backgroundColor: "#006480", borderRadius: 25, paddingVertical: 12, paddingHorizontal: 15, alignItems: "center", marginTop: 10 },
  saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  pickerSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
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
    color: "#007AFF",
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