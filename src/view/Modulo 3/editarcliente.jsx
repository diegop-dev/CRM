// Importamos 'memo' de React
import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
// Asegúrate que esta ruta sea correcta para tu proyecto
import { useFormLogic } from "../../controller/Modulo 3/editarcliente";

// --- Componente de Input Reutilizable (Optimizado y con candado) ---
const FormInput = memo(
  ({ label, value, onChangeText, placeholder, ...props }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View
        style={[styles.inputWrapper, !props.editable && styles.disabledInput]}
      >
        <TextInput
          style={styles.textInputInternal}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder || label}
          placeholderTextColor="#999"
          {...props}
        />
        {!props.editable && (
          <Image
            source={require("../../../assets/1.png")} // Asumiendo que 1.png es tu candado
            style={styles.lockIcon}
          />
        )}
      </View>
    </View>
  )
);

// --- Componente de Input Bloqueado (Optimizado) ---
const LockedInput = memo(({ label, value }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.lockedInputView}>
      <TextInput
        style={styles.lockedTextInput}
        value={value}
        editable={false}
      />
      <Image
        source={require("../../../assets/1.png")} // Asumiendo que 1.png es tu candado
        style={styles.lockIcon}
      />
    </View>
  </View>
));

// --- Componente de Dropdown (Picker) (Optimizado y con candado) ---
const FormPicker = memo(
  ({ label, selectedValue, onValueChange, items, enabled }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.pickerContainer, !enabled && styles.disabledInput]}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
          enabled={enabled}
        >
          <Picker.Item label="Seleccione..." value="" />
          {items.map((item) => (
            <Picker.Item
              key={item.value}
              label={item.label}
              value={item.value}
            />
          ))}
        </Picker>
        {!enabled && (
          <Image
            source={require("../../../assets/1.png")} // Asumiendo que 1.png es tu candado
            style={styles.lockIcon}
          />
        )}
      </View>
    </View>
  )
);

// --- Componente de la Barra de Búsqueda (Optimizado) ---
const SearchBar = memo(({ value, onChangeText, onSearchPress }) => (
  <View style={styles.searchContainer}>
    <TextInput
      style={styles.searchInput}
      value={value}
      onChangeText={onChangeText}
      placeholder="Buscar por ID de Cliente..."
      placeholderTextColor="#777"
    />
    <TouchableOpacity style={styles.searchButton} onPress={onSearchPress}>
      <Image
        source={require("../../../assets/1.png")} // Asumiendo que 1.png es tu icono de búsqueda
        style={styles.searchIcon}
      />
    </TouchableOpacity>
  </View>
));

// --- Componente Principal de la Pantalla ---
export default function EditarClienteView() {
  const {
    searchQuery,
    setSearchQuery,
    isFormLocked,
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
    // Estados y manejadores de modal eliminados
    handleBuscarCliente,
    handleGuardarPress,
  } = useFormLogic();

  return (
    <View style={styles.container}>
      {/* --- Encabezado --- */}
      <View style={styles.header}>
        <Image
          source={require("../../../assets/1.png")} // Icono de header
          style={styles.headerIcon}
        />
        <View>
          <Text style={styles.headerTitle}>Gestión de Clientes</Text>
          <Text style={styles.headerSubtitle}>Editar Cliente</Text>
        </View>
      </View>
      <View style={styles.divider} />

      {/* --- Barra de Búsqueda --- */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSearchPress={handleBuscarCliente}
      />

      {/* --- Formulario con Scroll --- */}
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        // Scroll siempre habilitado
      >
        {/* --- ID (Bloqueado) --- */}
        <LockedInput label="ID de Cliente:" value={idCliente} />

        {/* --- Datos Principales --- */}
        <FormInput
          label="Nombre del Cliente:"
          value={nombre}
          onChangeText={setNombre}
          editable={!isFormLocked}
        />
        <FormInput
          label="Apellido Paterno:"
          value={apellidoPaterno}
          onChangeText={setApellidoPaterno}
          editable={!isFormLocked}
        />
        <FormInput
          label="Apellido Materno:"
          value={apellidoMaterno}
          onChangeText={setApellidoMaterno}
          editable={!isFormLocked}
        />

        <FormPicker
          label="Tipo:"
          selectedValue={tipo}
          onValueChange={setTipo}
          enabled={!isFormLocked}
          items={[
            { label: "Persona", value: "Persona" },
            { label: "Empresa", value: "Empresa" },
          ]}
        />
        <FormPicker
          label="Estado del Cliente:"
          selectedValue={estadoCliente}
          onValueChange={setEstadoCliente}
          enabled={!isFormLocked}
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
          enabled={!isFormLocked}
          items={[
            { label: "Hombre", value: "Hombre" },
            { label: "Mujer", value: "Mujer" },
          ]}
        />

        {/* --- Datos de Contacto --- */}
        <FormInput
          label="Correo Electrónico:"
          value={correo}
          onChangeText={setCorreo}
          keyboardType="email-address"
          autoCapitalize="none"
          editable={!isFormLocked}
        />
        <FormInput
          label="Teléfono:"
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
          editable={!isFormLocked}
        />

        {/* --- Datos de Dirección --- */}
        <FormInput
          label="Calle:"
          value={calle}
          onChangeText={setCalle}
          editable={!isFormLocked}
        />
        <FormInput
          label="Colonia:"
          value={colonia}
          onChangeText={setColonia}
          editable={!isFormLocked}
        />
        <FormInput
          label="Ciudad:"
          value={ciudad}
          onChangeText={setCiudad}
          editable={!isFormLocked}
        />
        <FormInput
          label="Estado:"
          value={estado}
          onChangeText={setEstado}
          editable={!isFormLocked}
        />
        <FormInput
          label="País:"
          value={pais}
          onChangeText={setPais}
          editable={!isFormLocked}
        />
        <FormInput
          label="Código Postal:"
          value={codigoPostal}
          onChangeText={setCodigoPostal}
          keyboardType="numeric"
          editable={!isFormLocked}
        />

        {/* --- Descripción (con candado) --- */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Descripción:</Text>
          <View
            style={[
              styles.multilineInputWrapper,
              isFormLocked && styles.disabledInput,
            ]}
          >
            <TextInput
              style={styles.multilineInput}
              value={descripcion}
              onChangeText={setDescripcion}
              placeholder="Breve descripción del cliente..."
              multiline
              numberOfLines={4}
              editable={!isFormLocked}
            />
            {isFormLocked && (
              <Image
                source={require("../../../assets/1.png")} // Asumiendo que 1.png es tu candado
                style={styles.multilineLockIcon}
              />
            )}
          </View>
        </View>

        {/* --- Campos de Auditoría (No editables) --- */}
        <LockedInput label="Creado el:" value={creadoEn} />
        <LockedInput label="Creado por:" value={creadoPor} />
        <LockedInput label="Actualizado el:" value={actualizadoEn} />
        <LockedInput label="Actualizado por:" value={actualizadoPor} />

        {/* --- Botón de Guardar --- */}
        <TouchableOpacity
          style={[styles.saveButton, isFormLocked && styles.saveButtonDisabled]}
          onPress={handleGuardarPress}
          disabled={isFormLocked}
        >
          <Text style={styles.saveButtonText}>Guardar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    paddingTop: 60, // <-- Valor original
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
  // --- Divider ---
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#BDC3C7",
    marginTop: 15,
  },
  // --- Search Bar ---
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
    height: 50, // <-- Altura normalizada
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 15, // <-- paddingVertical eliminado
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    padding: 10,
  },
  searchIcon: {
    width: 22,
    height: 22,
    resizeMode: "contain",
    tintColor: "#555",
  },
  // --- Form ---
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
  // --- Input Styles (Normalizados) ---
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
    height: 50, // <-- Altura normalizada
  },
  textInputInternal: {
    flex: 1,
    paddingHorizontal: 15, // <-- paddingVertical eliminado
    fontSize: 16,
    color: "#333",
  },
  disabledInput: {
    backgroundColor: "#E0E0E0",
    color: "#777",
  },
  // --- Multiline Styles ---
  multilineInputWrapper: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
    height: 100,
  },
  multilineInput: {
    height: "100%",
    textAlignVertical: "top",
    padding: 15,
    fontSize: 16,
    color: "#333",
  },
  multilineLockIcon: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 20,
    height: 20,
    resizeMode: "contain",
    tintColor: "#777",
  },
  // --- Locked Input Styles ---
  lockedInputView: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0E0E0",
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
    height: 50, // <-- Altura normalizada
  },
  lockedTextInput: {
    flex: 1,
    paddingHorizontal: 15, // <-- paddingVertical eliminado
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
  // --- Picker Styles ---
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
    justifyContent: "center",
    height: 50, // <-- Altura normalizada
  },
  picker: {
    flex: 1,
    // height: 50, <-- Eliminado
    color: "#333",
  },
  // --- Save Button ---
  saveButton: {
    backgroundColor: "#3498DB",
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  saveButtonDisabled: {
    backgroundColor: "#A9A9A9",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});
