import React, { memo } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  // Platform, // <-- Eliminado
} from "react-native";
// No se importa Modal ni Picker
import { useFormLogic } from "../../controller/Modulo 3/consultarcliente";

// --- Componente de Input Bloqueado Reutilizable (Optimizado) ---
const LockedInput = memo(({ label, value, multiline = false }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    {/* Ajuste para que el contenedor tenga la altura correcta */}
    <View
      style={[
        styles.lockedInputView,
        multiline && styles.lockedInputViewMultiline,
      ]}
    >
      <TextInput
        style={[
          styles.lockedTextInput,
          multiline && styles.lockedTextInputMultiline,
        ]}
        value={value}
        editable={false}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
      />
      <Image
        source={require("../../../assets/1.png")} // Asumiendo que 1.png es tu candado
        style={[styles.lockIcon, multiline && styles.lockIconMultiline]} // Estilo condicional para multilinea
      />
    </View>
  </View>
));

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
export default function ConsultarClienteView() {
  const {
    searchQuery,
    setSearchQuery,
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    tipo,
    estadoCliente,
    sexo,
    correo,
    telefono,
    calle,
    colonia,
    ciudad,
    estado,
    pais,
    codigoPostal,
    descripcion,
    idCliente,
    creadoEn,
    creadoPor,
    actualizadoEn,
    actualizadoPor,
    handleBuscarCliente,
  } = useFormLogic();

  return (
    <View style={styles.container}>
      {/* --- Encabezado --- */}
      <View style={styles.header}>
        <Image
          source={require("../../../assets/1.png")}
          style={styles.headerIcon}
        />
        <View>
          <Text style={styles.headerTitle}>Gestión de Clientes</Text>
          <Text style={styles.headerSubtitle}>Consultar Cliente</Text>
        </View>
      </View>
      <View style={styles.divider} />

      {/* --- Barra de Búsqueda --- */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        onSearchPress={handleBuscarCliente}
      />

      {/* --- Formulario de Solo Lectura --- */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <>
          {/* --- ID --- */}
          <LockedInput label="ID de Cliente:" value={idCliente} />

          {/* --- Datos Principales --- */}
          <LockedInput label="Nombre del Cliente:" value={nombre} />
          <LockedInput label="Apellido Paterno:" value={apellidoPaterno} />
          <LockedInput label="Apellido Materno:" value={apellidoMaterno} />
          <LockedInput label="Tipo:" value={tipo} />
          <LockedInput label="Estado del Cliente:" value={estadoCliente} />
          <LockedInput label="Sexo:" value={sexo} />

          {/* --- Datos de Contacto --- */}
          <LockedInput label="Correo Electrónico:" value={correo} />
          <LockedInput label="Teléfono:" value={telefono} />

          {/* --- Datos de Dirección --- */}
          <LockedInput label="Calle:" value={calle} />
          <LockedInput label="Colonia:" value={colonia} />
          <LockedInput label="Ciudad:" value={ciudad} />
          <LockedInput label="Estado:" value={estado} />
          <LockedInput label="País:" value={pais} />
          <LockedInput label="Código Postal:" value={codigoPostal} />

          {/* --- Descripción --- */}
          <LockedInput
            label="Descripción:"
            value={descripcion}
            multiline={true}
          />

          {/* --- Campos de Auditoría --- */}
          <LockedInput label="Creado el:" value={creadoEn} />
          <LockedInput label="Creado por:" value={creadoPor} />
          <LockedInput label="Actualizado el:" value={actualizadoEn} />
          <LockedInput label="Actualizado por:" value={actualizadoPor} />
        </>
      </ScrollView>
    </View>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    // Ajuste multiplataforma
    paddingTop: 60, // <-- REVERTIDO A TU VALOR ORIGINAL
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
  },
  // --- Barra de Búsqueda (Normalizada) ---
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
  // --- Inputs Bloqueados (Normalizados) ---
  lockedInputView: {
    flexDirection: "row",
    alignItems: "center", // <-- Cambiado a center para los inputs normales
    backgroundColor: "#E0E0E0",
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
    height: 50, // <-- Altura normalizada
  },
  lockedInputViewMultiline: {
    // Estilo específico para multilinea
    height: 100,
    alignItems: "flex-start", // Alinear candado arriba
  },
  lockedTextInput: {
    flex: 1,
    paddingHorizontal: 15, // <-- paddingVertical eliminado
    fontSize: 16,
    color: "#555",
    fontWeight: "600",
  },
  lockedTextInputMultiline: {
    height: "100%", // <-- Ajustado para ocupar el contenedor
    textAlignVertical: "top",
    paddingTop: 12, // Añadir padding superior
  },
  lockIcon: {
    width: 20,
    height: 20,
    resizeMode: "contain",
    tintColor: "#777",
    marginHorizontal: 15,
  },
  lockIconMultiline: {
    // Estilo específico para el candado multilinea
    marginTop: 12, // Mantener el margen superior
  },
});
