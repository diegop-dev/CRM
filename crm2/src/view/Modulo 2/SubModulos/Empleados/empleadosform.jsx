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
const AÑOS_DATA = Array.from({ length: 100 }, (_, i) => (1950 + i).toString());
const SEXO_DATA = ["Masculino", "Femenino"];
const ROL_DATA = ["Super Administrador", "Administrador", "Empleado"];
const ESTADO_DATA = ["Activo", "Inactivo"];

// Ajustamos altura para web
const ITEM_HEIGHT = 40;
const CONTAINER_HEIGHT = 160;
const WHEEL_PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;


// --- Componentes reutilizables ---

// Input de Texto
const FormInput = React.memo(
  ({ label, value, onChangeText, editable = true, multiline = false, onTouchDisabled }) => (
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
          pointerEvents={!editable ? 'none' : 'auto'} // Evita teclado en solo lectura
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

// Rueda Selectora "Inteligente" (Soporta Click y Scroll)
const TumblerWheel = ({ data, onValueChange, value }) => {
  const ref = useRef(null);
  let initialIndex = data.indexOf(value);
  if (initialIndex < 0) initialIndex = 0;

  // Scroll inicial
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

  // Función para seleccionar al hacer clic (Mejora Web)
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

const Paso1 = React.memo(({ empleado, onChange, editable, onTouchDisabled, onFechaPress, onSexoPress }) => (
  <>
    <FormInput label="Nombres" value={empleado.nombres} onChangeText={(val) => onChange('nombres', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Apellido Paterno" value={empleado.apellidoPaterno} onChangeText={(val) => onChange('apellidoPaterno', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Apellido Materno" value={empleado.apellidoMaterno} onChangeText={(val) => onChange('apellidoMaterno', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <SelectInput
      label="Fecha de Nacimiento"
      value={
        empleado.diaNacimiento && empleado.mesNacimiento && empleado.añoNacimiento
          ? `${empleado.diaNacimiento}/${empleado.mesNacimiento}/${empleado.añoNacimiento}`
          : ""
      }
      onPress={onFechaPress}
      editable={editable}
      onTouchDisabled={onTouchDisabled}
    />
    <SelectInput label="Sexo" value={empleado.sexo} onPress={onSexoPress} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="RFC" value={empleado.rfc} onChangeText={(val) => onChange('rfc', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="CURP" value={empleado.curp} onChangeText={(val) => onChange('curp', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="NSS" value={empleado.nss} onChangeText={(val) => onChange('nss', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
  </>
));

const Paso2 = React.memo(({ empleado, onChange, editable, onTouchDisabled }) => (
  <>
    <FormInput label="Teléfono" value={empleado.telefono} onChangeText={(val) => onChange('telefono', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Correo Electrónico" value={empleado.correoElectronico} onChangeText={(val) => onChange('correoElectronico', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Calle" value={empleado.calle} onChangeText={(val) => onChange('calle', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Colonia" value={empleado.colonia} onChangeText={(val) => onChange('colonia', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Ciudad" value={empleado.ciudad} onChangeText={(val) => onChange('ciudad', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Estado" value={empleado.estado} onChangeText={(val) => onChange('estado', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Código Postal" value={empleado.codigoPostal} onChangeText={(val) => onChange('codigoPostal', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
  </>
));

const Paso3 = React.memo(({ empleado, onChange, onGuardar, editable, modo, onTouchDisabled, onRolPress, onEstadoPress }) => (
  <>
    <SelectInput label="Rol" value={empleado.rol} onPress={onRolPress} editable={editable} onTouchDisabled={onTouchDisabled} />
    <SelectInput label="Estado del Empleado" value={empleado.estadoEmpleado} onPress={onEstadoPress} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Nombre de Usuario" value={empleado.nombreUsuario} onChangeText={(val) => onChange('nombreUsuario', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Contraseña" value={empleado.contraseña} onChangeText={(val) => onChange('contraseña', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Observaciones" value={empleado.observaciones} onChangeText={(val) => onChange('observaciones', val)} editable={editable} onTouchDisabled={onTouchDisabled} multiline />

    {editable && (
      <TouchableOpacity style={styles.saveButton} onPress={onGuardar}>
        <Text style={styles.saveButtonText}>
          {modo === "editar" ? "Guardar Cambios" : "Guardar Empleado"}
        </Text>
      </TouchableOpacity>
    )}
  </>
));


// --- Componente Principal ---
export default function EmpleadosFormView({ 
  empleado = {}, 
  modo = "agregar", 
  onTouchDisabled, 
  onChange, 
  onGuardar 
}) {
  const [step, setStep] = useState(1);
  const editable = modo !== "consultar";

  const [showSexoModal, setShowSexoModal] = useState(false);
  const [showFechaModal, setShowFechaModal] = useState(false);
  const [showRolModal, setShowRolModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);

  // Estados temporales para los pickers
  const [tempDia, setTempDia] = useState('');
  const [tempMes, setTempMes] = useState('');
  const [tempAño, setTempAño] = useState('');
  const [tempSexo, setTempSexo] = useState('');
  const [tempRol, setTempRol] = useState('');
  const [tempEstado, setTempEstado] = useState('');

  // Funciones de apertura (cargan valor actual o defecto)
  const openFechaModal = () => {
    setTempDia(empleado.diaNacimiento || DIAS_DATA[0]);
    setTempMes(empleado.mesNacimiento || MESES_DATA[0]);
    setTempAño(empleado.añoNacimiento || AÑOS_DATA[0]);
    setShowFechaModal(true);
  };

  const openSexoModal = () => {
    setTempSexo(empleado.sexo || SEXO_DATA[0]);
    setShowSexoModal(true);
  };

  const openRolModal = () => {
    setTempRol(empleado.rol || ROL_DATA[0]);
    setShowRolModal(true);
  };

  const openEstadoModal = () => {
    setTempEstado(empleado.estadoEmpleado || ESTADO_DATA[0]);
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
            empleado={empleado}
            onChange={onChange}
            editable={editable}
            onTouchDisabled={onTouchDisabled}
            onFechaPress={() => (editable ? openFechaModal() : onTouchDisabled())}
            onSexoPress={() => (editable ? openSexoModal() : onTouchDisabled())}
          />
        )}

        {step === 2 && (
          <Paso2 
            empleado={empleado}
            onChange={onChange}
            editable={editable} 
            onTouchDisabled={onTouchDisabled} 
          />
        )}

        {step === 3 && (
          <Paso3
            empleado={empleado}
            onChange={onChange}
            onGuardar={onGuardar}
            editable={editable}
            modo={modo}
            onTouchDisabled={onTouchDisabled}
            onRolPress={() => (editable ? openRolModal() : onTouchDisabled())}
            onEstadoPress={() => (editable ? openEstadoModal() : onTouchDisabled())}
          />
        )}

        <View style={styles.buttonRow}>
          {step > 1 && (
            <TouchableOpacity style={[styles.navButton, styles.backButton]} onPress={() => setStep(step - 1)}>
              <Text style={styles.navButtonText}>Regresar</Text>
            </TouchableOpacity>
          )}
          {step < 3 && (
            <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={() => setStep(step + 1)}>
              <Text style={styles.navButtonText}>Continuar</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* --- MODALES DE PICKER (TIPO TARJETA FLOTANTE) --- */}
      
      {/* Modal de Fecha */}
      <Modal visible={showFechaModal} animationType="fade" transparent={true} onRequestClose={() => setShowFechaModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowFechaModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Fecha de Nacimiento</Text>
                    <TouchableOpacity onPress={() => {
                        onChange('diaNacimiento', tempDia);
                        onChange('mesNacimiento', tempMes);
                        onChange('añoNacimiento', tempAño);
                        setShowFechaModal(false);
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

      {/* Modal de Sexo */}
      <Modal visible={showSexoModal} animationType="fade" transparent={true} onRequestClose={() => setShowSexoModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowSexoModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Sexo</Text>
                    <TouchableOpacity onPress={() => { onChange('sexo', tempSexo); setShowSexoModal(false); }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsPickerContainer}>
                    <TumblerWheel data={SEXO_DATA} onValueChange={setTempSexo} value={tempSexo} />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
      </Modal>

      {/* Modal de Rol */}
      <Modal visible={showRolModal} animationType="fade" transparent={true} onRequestClose={() => setShowRolModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowRolModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Rol</Text>
                    <TouchableOpacity onPress={() => { onChange('rol', tempRol); setShowRolModal(false); }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsPickerContainer}>
                    <TumblerWheel data={ROL_DATA} onValueChange={setTempRol} value={tempRol} />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
      </Modal>

      {/* Modal de Estado */}
      <Modal visible={showEstadoModal} animationType="fade" transparent={true} onRequestClose={() => setShowEstadoModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowEstadoModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Estado</Text>
                    <TouchableOpacity onPress={() => { onChange('estadoEmpleado', tempEstado); setShowEstadoModal(false); }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsPickerContainer}>
                    <TumblerWheel data={ESTADO_DATA} onValueChange={setTempEstado} value={tempEstado} />
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
    maxWidth: 400, // Límite ancho para PC
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
