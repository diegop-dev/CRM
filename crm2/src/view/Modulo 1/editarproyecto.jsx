import React from "react";
import { ScrollView, StyleSheet, View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Importamos el FORMULARIO "TONTO"
import ProyectoFormView from "../../view/Modulo 1/proyectoform"; // Ajusta esta ruta a tu proyectoform.jsx
// Importamos el NUEVO HOOK de lógica
import { useEditarProyectoLogic } from "../../controller/Modulo 1/editarproyecto"; // Ajusta esta ruta a tu useEditarProyectoLogic.js

export default function EditarProyectoView({ route }) {

  // Usamos el nuevo hook para toda la lógica
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    proyecto,
    empleadosList,
    proyectosRecientes, // <-- OBTENEMOS LA NUEVA LISTA
    isLoading,
    handleBuscarProyecto,
    onChange,
    onGuardar,
    handleLimpiar   // <-- OBTENEMOS LA NUEVA FUNCIÓN
  } = useEditarProyectoLogic();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2b3042" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/LOGO_BLANCO.png")} // Ajusta esta ruta
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Editar Proyecto</Text>
        </View>
        <View style={styles.divider} />

        {/* --- Barra de Búsqueda --- */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar por nombre de proyecto..."
            placeholderTextColor="#999"
            value={terminoBusqueda}
            onChangeText={setTerminoBusqueda}
            editable={!proyecto} // No se puede editar si ya hay un proyecto cargado
          />

          {/* Botón cambia entre "Buscar" y "Limpiar" */}
          {proyecto ? (
            <TouchableOpacity
              style={[styles.searchButton, styles.limpiarButton]}
              onPress={handleLimpiar}
            >
              <Text style={styles.searchButtonText}>Limpiar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.searchButton}
              onPress={() => handleBuscarProyecto()}
            >
              <Text style={styles.searchButtonText}>Buscar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* --- Indicador de Carga --- */}
        {isLoading && (
          <ActivityIndicator size="large" color="#77a7ab" style={{ marginVertical: 20 }} />
        )}

        {/* --- Formulario (SOLO SI SE ENCONTRÓ UN PROYECTO) --- */}
        {proyecto && !isLoading && (
          <View style={{ flex: 1, marginTop: 20 }}>
            <ProyectoFormView
              proyecto={proyecto}
              modo="editar" // <-- ¡AQUÍ ESTÁ LA MAGIA!
              onChange={onChange}
              onGuardar={onGuardar}
              empleados={empleadosList}
            />
          </View>
        )}

        {/* --- Lista de Proyectos Recientes (NUEVO) --- */}
        {/* Se muestra solo si NO hay un proyecto buscado y NO está cargando */}
        {!proyecto && !isLoading && (
          <View style={styles.recientesContainer}>
            <Text style={styles.recientesTitle}>
              {proyectosRecientes.length > 0 ? "Proyectos Recientes" : "No hay proyectos recientes"}
            </Text>
            {proyectosRecientes.map(p => (
              <TouchableOpacity
                key={p.id_proyecto}
                style={styles.recienteItem}
                onPress={() => {
                  // Al hacer clic, poblamos la barra de búsqueda Y buscamos
                  setTerminoBusqueda(p.nombre_proyecto);
                  handleBuscarProyecto(p.nombre_proyecto);
                }}
              >
                <Text style={styles.recienteItemText}>{p.nombre_proyecto}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2b3042",
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  headerIcon: {
    width: 60,
    height: 80,
    resizeMode: "contain",
    tintColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginLeft: 15,
    color: "#f7f3f3ff",
  },
  divider: {
    height: 3,
    backgroundColor: "#d92a1c",
    marginVertical: 10,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#BDC3C7",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#77a7ab",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  limpiarButton: { // <-- NUEVO ESTILO
    backgroundColor: "#E74C3C", // Un color rojo para "Limpiar"
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  // --- NUEVOS ESTILOS ---
  recientesContainer: {
    marginHorizontal: 0, // Ajustado para que ocupe el ancho
    marginTop: 20,
    backgroundColor: "#3a3f50", // Un fondo ligeramente más claro
    borderRadius: 12,
    padding: 15,
  },
  recientesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#5a5f70",
  },
  recienteItem: {
    backgroundColor: "#2b3042",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  recienteItemText: {
    color: "#f0f0f0",
    fontSize: 16,
  },
  // --- FIN DE NUEVOS ESTILOS ---
});
