import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useFormLogic } from "../../controller/Modulo 3/agregarcliente"; // Importamos la lógica

// --- Componente de Input Reutilizable ---
const FormInput = ({ label, value, onChangeText, placeholder, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={styles.textInput}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder || label}
      placeholderTextColor="#999"
      {...props}
    />
  </View>
);

// --- Componente de Input Bloqueado Reutilizable (Modificado) ---
const LockedInput = ({ label, value }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.lockedInputView}>
      <TextInput
        style={styles.lockedTextInput}
        value={value}
        editable={false}
      />
      <Image
        source={require("../../../assets/1.png")} // <-- Reemplaza con tu imagen de candado
        style={styles.lockIcon}
      />
    </View>
  </View>
);

// --- Componente de Dropdown (Picker) Reutilizable ---
const FormPicker = ({ label, selectedValue, onValueChange, items }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.pickerContainer}>
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.picker}
      >
        <Picker.Item label="Seleccione..." value="" />
        {items.map((item) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  </View>
);

// --- Componente Principal de la Pantalla ---
export default function AgregarClienteView() {
  // Obtenemos toda la lógica y estados desde el hook
  const {
    nombre,
    setNombre,
    apellidoPaterno,
    setApellidoPaterno,
    apellidoMaterno,
    setApellidoMaterno,
    tipo,
    setTipo,
    estadoCliente,
    setEstadoCliente,
    sexo,
    setSexo,
    correo,
    setCorreo,
    telefono,
    setTelefono,
    calle,
    setCalle,
    colonia,
    setColonia,
    ciudad,
    setCiudad,
    estado,
    setEstado,
    pais,
    setPais,
    codigoPostal,
    setCodigoPostal,
    descripcion,
    setDescripcion,
    idCliente,
    creadoEn,
    creadoPor,
    actualizadoEn,
    actualizadoPor,
    isConfirmVisible,
    isSuccessVisible,
    handleGuardarPress,
    handleCancelarGuardado,
    handleConfirmarGuardado,
    handleCerrarExito,
  } = useFormLogic();

  return (
    <View style={styles.container}>
      {/* --- Encabezado --- */}
      <View style={styles.header}>
        <Image
          source={require("../../../assets/1.png")} // Reusa el icono
          style={styles.headerIcon}
        />
        <View>
          <Text style={styles.headerTitle}>Gestión de Clientes</Text>
          <Text style={styles.headerSubtitle}>Agregar Cliente</Text>
        </View>
      </View>
      <View style={styles.divider} />

      {/* --- Formulario con Scroll --- */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* ... (El formulario no cambia) ... */}
        <LockedInput label="ID de Cliente:" value={idCliente} />
        <FormInput
          label="Nombre del Cliente:"
          value={nombre}
          onChangeText={setNombre}
        />
        <FormInput
          label="Apellido Paterno:"
          value={apellidoPaterno}
          onChangeText={setApellidoPaterno}
        />
        <FormInput
          label="Apellido Materno:"
          value={apellidoMaterno}
          onChangeText={setApellidoMaterno}
        />
        <FormPicker
          label="Tipo:"
          selectedValue={tipo}
          onValueChange={setTipo}
          items={[
            { label: "Persona", value: "Persona" },
            { label: "Empresa", value: "Empresa" },
          ]}
        />
        <FormPicker
          label="Estado del Cliente:"
          selectedValue={estadoCliente}
          onValueChange={setEstadoCliente}
          items={[
            { label: "Activo", value: "Activo" },
            { label: "Inactivo", value: "Inactivo" },
            { label: "Potencial", value: "Potencial" },
          ]}
        />
        <FormPicker
          label="Sexo:"
          selectedValue={sexo}
          onValueChange={setSexo}
          items={[
            { label: "Hombre", value: "Hombre" },
            { label: "Mujer", value: "Mujer" },
          ]}
        />
        <FormInput
          label="Correo Electrónico:"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <FormInput
          label="Teléfono:"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />
        <FormInput label="Calle:" value={calle} onChangeText={setCalle} />
        <FormInput label="Colonia:" value={colonia} onChangeText={setColonia} />
        <FormInput label="Ciudad:" value={ciudad} onChangeText={setCiudad} />
        <FormInput label="Estado:" value={estado} onChangeText={setEstado} />
        <FormInput label="País:" value={pais} onChangeText={setPais} />
        <FormInput
          label="Código Postal:"
          value={codigoPostal}
          onChangeText={setCodigoPostal}
          keyboardType="numeric"
        />
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Descripción:</Text>
          <TextInput
            style={[styles.textInput, styles.multilineInput]}
            value={descripcion}
            onChangeText={setDescripcion}
            placeholder="Breve descripción del cliente..."
            multiline
            numberOfLines={4}
          />
        </View>
        <LockedInput label="Creado el:" value={creadoEn} />
        <LockedInput label="Creado por:" value={creadoPor} />
        <LockedInput label="Actualizado el:" value={actualizadoEn} />
        <LockedInput label="Actualizado por:" value={actualizadoPor} />

        {/* --- Botón de Guardar --- */}
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleGuardarPress}
        >
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* --- Modal de Confirmación (Modificado) --- */}
      <Modal visible={isConfirmVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              ¿Está seguro que desea agregar al cliente?
            </Text>
            <View style={styles.modalButtonRow}>
              <TouchableOpacity
                style={[
                  // <-- CAMBIO AQUÍ
                  styles.modalButtonBase,
                  styles.modalButtonRowItem,
                  styles.modalButtonCancel,
                ]}
                onPress={handleCancelarGuardado}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  // <-- CAMBIO AQUÍ
                  styles.modalButtonBase,
                  styles.modalButtonRowItem,
                  styles.modalButtonConfirm,
                ]}
                onPress={handleConfirmarGuardado}
              >
                <Text style={styles.modalButtonTextConfirm}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --- Modal de Éxito (Modificado) --- */}
      <Modal visible={isSuccessVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Image
              source={require("../../../assets/1.png")}
              style={styles.successIcon}
            />
            <Text style={[styles.modalText, { marginTop: 15 }]}>
              Cliente agregado correctamente.
            </Text>
            <TouchableOpacity
              style={[
                // <-- CAMBIO AQUÍ
                styles.modalButtonBase,
                styles.modalButtonWide,
                styles.modalButtonConfirm,
              ]}
              onPress={handleCerrarExito}
            >
              <Text style={styles.modalButtonTextConfirm}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    paddingTop: 60,
  },
  // --- Header ---
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 20,
  },
  headerIcon: {
    width: 48,
    height: 48,
    resizeMode: "contain",
    tintColor: "#3498DB",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2C3E50",
    marginLeft: 15,
  },
  headerSubtitle: {
    fontSize: 18,
    fontWeight: "400",
    color: "#555",
    marginLeft: 15,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#BDC3C7",
    marginTop: 15,
    marginBottom: 10,
  },
  // --- Formulario ---
  scrollContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  inputContainer: {
    width: "100%",
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34495E",
    marginBottom: 6,
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  multilineInput: {
    height: 100,
    textAlignVertical: "top",
  },
  // --- Inputs Bloqueados ---
  lockedInputView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
  },
  lockedTextInput: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  lockIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    tintColor: "#777",
    marginHorizontal: 15,
  },
  // --- Picker (Dropdown) ---
  pickerContainer: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
    justifyContent: "center",
  },
  picker: {
    height: 50,
    width: "100%",
    color: "#333",
  },
  // --- Botón Guardar ---
  saveButton: {
    backgroundColor: "#3498DB",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  // --- Estilos de Modales ---
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    width: "85%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 18,
    fontWeight: "500",
    textAlign: "center",
    marginBottom: 25,
  },
  successIcon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  // --- ESTILOS DE BOTONES DE MODAL CORREGIDOS ---
  modalButtonBase: {
    // Estilo base para todos los botones de modal
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
  },
  modalButtonRowItem: {
    // Para los botones que están en fila (Confirmar/Cancelar)
    flex: 1,
    marginHorizontal: 5,
  },
  modalButtonWide: {
    // Para el botón de 'Aceptar' que ocupa todo el ancho
    width: "100%",
  },
  modalButtonCancel: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#E74C3C",
  },
  modalButtonTextCancel: {
    color: "#E74C3C",
    fontWeight: "bold",
  },
  modalButtonConfirm: {
    backgroundColor: "#27AE60",
  },
  modalButtonTextConfirm: {
    color: "white",
    fontWeight: "bold",
  },
});
