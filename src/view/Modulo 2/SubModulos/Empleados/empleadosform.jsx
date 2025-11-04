import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { useEmpleadoLogic } from "../../../../controller/Modulo 2/SubModulos/Empleados/empleadosform";


// --- Componentes reutilizables ---
const FormInput = React.memo(({ label, value, onChangeText, editable = true, multiline = false }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.textInput, multiline && styles.multilineInput]}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      multiline={multiline}
      textAlignVertical={multiline ? "top" : "center"}
      blurOnSubmit={false}
    />
  </View>
));

const SelectInput = React.memo(({ label, value, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.textInput, { justifyContent: "center" }]}>
        <Text>{value || "Seleccione..."}</Text>
      </View>
    </View>
  </TouchableOpacity>
));

const LockedInput = React.memo(({ label, value }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={[styles.textInput, { backgroundColor: "#e6e6e6" }]}>
      <Text>{value}</Text>
    </View>
  </View>
));

// --- Paso 1: Datos Personales ---
const Paso1 = React.memo(({ logic, dias, meses, años, showSexo, setShowSexo, showFechaNacimiento, setShowFechaNacimiento }) => (
  <>
    <LockedInput label="ID de Empleado" value={logic.idEmpleado} />
    <FormInput label="Nombres" value={logic.nombres} onChangeText={logic.setNombres} />
    <FormInput label="Apellido Paterno" value={logic.apellidoPaterno} onChangeText={logic.setApellidoPaterno} />
    <FormInput label="Apellido Materno" value={logic.apellidoMaterno} onChangeText={logic.setApellidoMaterno} />

    <SelectInput
      label="Fecha de Nacimiento"
      value={logic.diaNacimiento && logic.mesNacimiento && logic.añoNacimiento ? `${logic.diaNacimiento}/${logic.mesNacimiento}/${logic.añoNacimiento}` : ""}
      onPress={() => setShowFechaNacimiento(!showFechaNacimiento)}
    />
    {showFechaNacimiento && (
      <View style={styles.dateRow}>
        <Picker selectedValue={logic.diaNacimiento} onValueChange={logic.setDiaNacimiento} style={styles.datePicker}>
          <Picker.Item label="Día" value="" />
          {dias.map((d) => <Picker.Item key={d} label={d} value={d} />)}
        </Picker>
        <Picker selectedValue={logic.mesNacimiento} onValueChange={logic.setMesNacimiento} style={styles.datePicker}>
          <Picker.Item label="Mes" value="" />
          {meses.map((m) => <Picker.Item key={m} label={m} value={m} />)}
        </Picker>
        <Picker selectedValue={logic.añoNacimiento} onValueChange={logic.setAñoNacimiento} style={styles.datePicker}>
          <Picker.Item label="Año" value="" />
          {años.map((a) => <Picker.Item key={a} label={a} value={a} />)}
        </Picker>
      </View>
    )}

    <SelectInput label="Sexo" value={logic.sexo} onPress={() => setShowSexo(!showSexo)} />
    {showSexo && (
      <View style={styles.pickerContainer}>
        <Picker selectedValue={logic.sexo} onValueChange={(v) => { logic.setSexo(v); setShowSexo(false); }}>
          <Picker.Item label="Masculino" value="Masculino" />
          <Picker.Item label="Femenino" value="Femenino" />
        </Picker>
      </View>
    )}

    <FormInput label="RFC" value={logic.rfc} onChangeText={logic.setRfc} />
    <FormInput label="CURP" value={logic.curp} onChangeText={logic.setCurp} />
    <FormInput label="NSS" value={logic.nss} onChangeText={logic.setNss} />
  </>
));

// --- Paso 2: Contacto y Dirección ---
const Paso2 = React.memo(({ logic }) => (
  <>
    <FormInput label="Teléfono" value={logic.telefono} onChangeText={logic.setTelefono} />
    <FormInput label="Correo Electrónico" value={logic.correoElectronico} onChangeText={logic.setCorreoElectronico} />
    <FormInput label="Calle" value={logic.calle} onChangeText={logic.setCalle} />
    <FormInput label="Colonia" value={logic.colonia} onChangeText={logic.setColonia} />
    <FormInput label="Ciudad" value={logic.ciudad} onChangeText={logic.setCiudad} />
    <FormInput label="Estado" value={logic.estado} onChangeText={logic.setEstado} />
    <FormInput label="Código Postal" value={logic.codigoPostal} onChangeText={logic.setCodigoPostal} />
  </>
));

// --- Paso 3: Datos Laborales y Acceso ---
const Paso3 = React.memo(({ logic, showRol, setShowRol, showEstadoEmpleado, setShowEstadoEmpleado, handleGuardar }) => (
  <>
    <SelectInput label="Rol" value={logic.rol} onPress={() => setShowRol(!showRol)} />
    {showRol && (
      <View style={styles.pickerContainer}>
        <Picker selectedValue={logic.rol} onValueChange={(v) => { logic.setRol(v); setShowRol(false); }}>
          <Picker.Item label="Super Administrador" value="Super Administrador" />
          <Picker.Item label="Administrador" value="Administrador" />
          <Picker.Item label="Empleado" value="Empleado" />
        </Picker>
      </View>
    )}

    <SelectInput label="Estado del Empleado" value={logic.estadoEmpleado} onPress={() => setShowEstadoEmpleado(!showEstadoEmpleado)} />
    {showEstadoEmpleado && (
      <View style={styles.pickerContainer}>
        <Picker selectedValue={logic.estadoEmpleado} onValueChange={(v) => { logic.setEstadoEmpleado(v); setShowEstadoEmpleado(false); }}>
          <Picker.Item label="ACTIVO" value="ACTIVO" />
          <Picker.Item label="INACTIVO" value="INACTIVO" />
        </Picker>
      </View>
    )}

    <FormInput label="Nombre de Usuario" value={logic.nombreUsuario} onChangeText={logic.setNombreUsuario} />
    <FormInput label="Contraseña" value={logic.contraseña} onChangeText={logic.setContraseña} />

    <FormInput label="Observaciones" value={logic.observaciones} onChangeText={logic.setObservaciones} multiline />

    <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
      <Text style={styles.saveButtonText}>Guardar Empleado</Text>
    </TouchableOpacity>
  </>
));

// --- Principal ---
export default function EmpleadosFormView({ empleado = {}, mode = "crear" }) {
  const logic = useEmpleadoLogic(empleado);
  const editable = mode !== "consultar";
  const [step, setStep] = useState(1);

  // 📄 useEmpleadoLogic.js (controlador lógico del formulario)
const handleGuardar = async () => {
  try {
    const empleadoData = {
      nombres: logic.nombres,
      apellidoPaterno: logic.apellidoPaterno,
      apellidoMaterno: logic.apellidoMaterno,
      diaNacimiento: logic.diaNacimiento,
      mesNacimiento: logic.mesNacimiento,
      añoNacimiento: logic.añoNacimiento,
      sexo: logic.sexo,
      rfc: logic.rfc,
      curp: logic.curp,
      nss: logic.nss,
      telefono: logic.telefono,
      correoElectronico: logic.correoElectronico,
      calle: logic.calle,
      colonia: logic.colonia,
      ciudad: logic.ciudad,
      estado: logic.estado,
      codigoPostal: logic.codigoPostal,
      rol: logic.rol,
      estadoEmpleado: logic.estadoEmpleado,
      nombreUsuario: logic.nombreUsuario,
      contraseña: logic.contraseña,
      observaciones: logic.observaciones,
    };

    const response = await fetch("http://192.168.1.112:3000/api/empleados/guardar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empleadoData),
    });

    const result = await response.json();

    if (response.ok) {
      alert(`Empleado guardado correctamente. ID generado: ${result.idEmpleado}`);
    } else {
      alert("Error: " + result.error);
    }
  } catch (error) {
    console.error("Error al guardar empleado:", error);
    alert("Error al guardar empleado");
  }
};


  const [showSexo, setShowSexo] = useState(false);
  const [showRol, setShowRol] = useState(false);
  const [showEstadoEmpleado, setShowEstadoEmpleado] = useState(false);
  const [showFechaNacimiento, setShowFechaNacimiento] = useState(false);

  const dias = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const meses = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const años = Array.from({ length: 100 }, (_, i) => (1925 + i).toString());

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start", paddingTop: 10, paddingHorizontal: 20 }}
      >
        {step === 1 && <Paso1 logic={logic} dias={dias} meses={meses} años={años} showSexo={showSexo} setShowSexo={setShowSexo} showFechaNacimiento={showFechaNacimiento} setShowFechaNacimiento={setShowFechaNacimiento} />}
        {step === 2 && <Paso2 logic={logic} />}
        {step === 3 && <Paso3 logic={logic} showRol={showRol} setShowRol={setShowRol} showEstadoEmpleado={showEstadoEmpleado} setShowEstadoEmpleado={setShowEstadoEmpleado} handleGuardar={handleGuardar} />}

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#34495E", marginBottom: 10 },
  textInput: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderColor: "#BDC3C7",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#333",
  },
  multilineInput: { height: 100 },
  pickerContainer: { backgroundColor: "#fff", borderRadius: 20, borderWidth: 1, borderColor: "#BDC3C7", overflow: "hidden" },
  dateRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  datePicker: { flex: 1, marginHorizontal: 3, backgroundColor: "#fff", borderRadius: 10 },
  navButton: { flex: 1, borderRadius: 25, paddingVertical: 12, alignItems: "center", marginHorizontal: 5 },
  backButton: { backgroundColor: "#95A5A6" },
  nextButton: { backgroundColor: "#3498DB" },
  navButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  buttonRow: { flexDirection: "row", marginTop: 25 },
  saveButton: { backgroundColor: "#2ECC71", borderRadius: 25, paddingVertical: 12, alignItems: "center", marginTop: 25 },
  saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
