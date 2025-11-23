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


// --- CONSTANTES ---
const DIAS_DATA = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const MESES_DATA = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const AÑOS_DATA = Array.from({ length: 100 }, (_, i) => (1950 + i).toString());
const SEXO_DATA = ["Masculino", "Femenino"];
const ROL_DATA = ["Super Administrador", "Administrador", "Empleado"];
const ESTADO_DATA = ["Activo", "Inactivo"];

const ITEM_HEIGHT = 44;
const CONTAINER_HEIGHT = 220;
const WHEEL_PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;


// --- Componentes reutilizables ---
// (No necesitan cambios)
const FormInput = React.memo(
  ({ label, value, onChangeText, editable = true, multiline = false, onTouchDisabled }) => (
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

// (Componente LockedInput no es necesario si el ID no se muestra, pero lo dejamos por si acaso)
// const LockedInput = ...

// --- Paso 1 ---
const Paso1 = React.memo(({ empleado, onChange, editable, onTouchDisabled, onFechaPress, onSexoPress }) => (
  <>
    {/* <LockedInput label="ID de Empleado" value={empleado.id_empleado} /> */}
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

// --- Paso 2 ---
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

// --- Paso 3 ---
const Paso3 = React.memo(({ empleado, onChange, onGuardar, editable, modo, onTouchDisabled, onRolPress, onEstadoPress }) => (
  <>
    <SelectInput label="Rol" value={empleado.rol} onPress={onRolPress} editable={editable} onTouchDisabled={onTouchDisabled} />
    <SelectInput label="Estado del Empleado" value={empleado.estadoEmpleado} onPress={onEstadoPress} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Nombre de Usuario" value={empleado.nombreUsuario} onChangeText={(val) => onChange('nombreUsuario', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Contraseña" value={empleado.contraseña} onChangeText={(val) => onChange('contraseña', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Observaciones" value={empleado.observaciones} onChangeText={(val) => onChange('observaciones', val)} editable={editable} onTouchDisabled={onTouchDisabled} multiline />

    {editable && (
      // 👇 CAMBIO: Llama a onGuardar (del prop) en lugar de handleGuardar (interno)
      <TouchableOpacity style={styles.saveButton} onPress={onGuardar}>
        <Text style={styles.saveButtonText}>
          {modo === "editar" ? "Guardar Cambios" : "Guardar Empleado"}
        </Text>
      </TouchableOpacity>
    )}
  </>
));

// --- Componente de Picker en JS ---
const JSPickerItem = ({ label }) => (
  <View style={styles.pickerItem}>
    <Text style={styles.pickerItemText}>
      {label}
    </Text>
  </View>
);

// --- Componente de Rueda Selectora ---
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
// 👇 CAMBIO: El componente ahora acepta 'onChange' y 'onGuardar'
export default function EmpleadosFormView({ 
  empleado = {}, 
  modo = "agregar", 
  onTouchDisabled, 
  onChange, 
  onGuardar 
}) {
  // const logic = useEmpleadoLogic(empleado); 
  const [step, setStep] = useState(1);
  const editable = modo !== "consultar";
  // const esEdicion = modo === "editar"; 

  const [showSexoModal, setShowSexoModal] = useState(false);
  const [showFechaModal, setShowFechaModal] = useState(false);
  const [showRolModal, setShowRolModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [alertInfo, setAlertInfo] = useState({ visible: false, title: "", message: "" });

  const [tempDia, setTempDia] = useState('');
  const [tempMes, setTempMes] = useState('');
  const [tempAño, setTempAño] = useState('');
  const [tempSexo, setTempSexo] = useState('');
  const [tempRol, setTempRol] = useState('');
  const [tempEstado, setTempEstado] = useState('');

 
  // La lógica de guardado ahora la maneja 100% la pantalla 'editarempleado.jsx'
  // y su hook 'useEditarEmpleadoLogic'.

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
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start", paddingHorizontal: 20 }}
      >
        {step === 1 && (
          <Paso1
            empleado={empleado} // CAMBIO: Pasa 'empleado' (prop)
            onChange={onChange} // CAMBIO: Pasa 'onChange' (prop)
            editable={editable}
            onTouchDisabled={onTouchDisabled}
            onFechaPress={() => (editable ? openFechaModal() : onTouchDisabled())}
            onSexoPress={() => (editable ? openSexoModal() : onTouchDisabled())}
          />
        )}

        {step === 2 && (
          <Paso2 
            empleado={empleado} //  CAMBIO: Pasa 'empleado' (prop)
            onChange={onChange} //  CAMBIO: Pasa 'onChange' (prop)
            editable={editable} 
            onTouchDisabled={onTouchDisabled} 
          />
        )}

        {step === 3 && (
          <Paso3
            empleado={empleado} //  CAMBIO: Pasa 'empleado' (prop)
            onChange={onChange} //  CAMBIO: Pasa 'onChange' (prop)
            onGuardar={onGuardar} //  CAMBIO: Pasa 'onGuardar' (prop)
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

      {/* --- MODAL DE ALERTA TIPO iOS --- */}
      {/*  ELIMINADO: El modal de alerta se quitó
          porque los 'Alert.alert()' ahora se manejan
          en 'useEditarEmpleadoLogic' */}

      {/* --- MODALES DE PICKER TIPO iOS (Bottom Sheet) --- */}
      {/* Modal de Fecha de Nacimiento */}
      <Modal
        visible={showFechaModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowFechaModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowFechaModal(false)} />
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => {
              //  CAMBIO: Llama a 'onChange' (prop)
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
        </View>
      </Modal>

      {/* Modal de Sexo */}
      <Modal
        visible={showSexoModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSexoModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowSexoModal(false)} />
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => {
              //  CAMBIO: Llama a 'onChange' (prop)
              onChange('sexo', tempSexo);
              setShowSexoModal(false);
            }}>
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jsPickerContainer}>
            <TumblerWheel data={SEXO_DATA} onValueChange={setTempSexo} value={tempSexo} />
            <View style={styles.pickerHighlight} pointerEvents="none" />
          </View>
        </View>
      </Modal>

      {/* Modal de Rol */}
      <Modal
        visible={showRolModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowRolModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowRolModal(false)} />
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => {
              //  CAMBIO: Llama a 'onChange' (prop)
              onChange('rol', tempRol);
              setShowRolModal(false);
            }}>
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jsPickerContainer}>
            <TumblerWheel data={ROL_DATA} onValueChange={setTempRol} value={tempRol} />
            <View style={styles.pickerHighlight} pointerEvents="none" />
          </View>
        </View>
      </Modal>

      {/* Modal de Estado de Empleado */}
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
              //  CAMBIO: Llama a 'onChange' (prop)
              onChange('estadoEmpleado', tempEstado);
              setShowEstadoModal(false);
            }}>
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jsPickerContainer}>
            <TumblerWheel data={ESTADO_DATA} onValueChange={setTempEstado} value={tempEstado} />
            <View style={styles.pickerHighlight} pointerEvents="none" />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// --- Estilos ---
// (Tus estilos se quedan igual)
const styles = StyleSheet.create({
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 15, fontWeight: "600", color: "#ffffffff", marginBottom: 10 },
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
  alertBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    backgroundColor: "#FFFFFF",
    width: "75%",
    maxWidth: 300,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 5,
  },
  alertMessage: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    color: "#000",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  alertButtonContainer: {
    borderTopWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.3)",
    flexDirection: 'row',
  },
  alertButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertButtonText: {
    fontSize: 17,
    color: "#007AFF",
    fontWeight: "600",
  },
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
