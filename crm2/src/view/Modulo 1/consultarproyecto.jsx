// src/view/Modulo 1/ConsultarProyectoView.jsx
import React from "react";
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  Alert // ¡Importante! Añadir Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// Importamos el FORMULARIO "TONTO"
// 🚨 ¡REVISA ESTA RUTA! Debe apuntar a tu 'proyectoform.jsx' (Archivo 3)
import ProyectoFormView from "../../view/Modulo 1/proyectoform"; 
import { useNavigation } from "@react-navigation/native";

// Importamos el NUEVO HOOK de lógica
// 🚨 ¡REVISA ESTA RUTA! Debe apuntar a 'useConsultarProyectoLogic.js' (Archivo 4)
import { useConsultarProyectoLogic } from "../../controller/Modulo 1/consultarproyecto"; 

export default function ConsultarProyectoView({ navigation }) {
  
  const navigationHook = useNavigation();
  const handleLogoPress = () => {
    Alert.alert(
      "Confirmar Navegación",
      "¿Desea salir de la Consulta de Proyectos y volver al menú principal?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Volver",
          onPress: () => {
            Alert.alert(
              "Área Segura",
              "Será redirigido al Menú Principal.",
              [
                { text: "Permanecer", style: "cancel" },
                {
                  text: "Confirmar",
                  onPress: () => {
                    navigationHook.navigate("MenuPrincipal");
                  },
                },
              ]
            );
          },
        },
      ],
      { cancelable: true }
    );
  }
  // Usamos el nuevo hook para toda la lógica
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    proyecto,
    empleadosList,
    proyectosAleatorios, // <-- Obtenemos la nueva lista
    isLoading,
    isInitialLoading,  // <-- Obtenemos el loading inicial
    handleBuscarProyecto,
    handleLimpiarBusqueda, // <-- Obtenemos la nueva función
    onChange,
    // onGuardar no se usa aquí, usamos la alerta
  } = useConsultarProyectoLogic(); // Pasamos navigation

  // Función que se activa cuando se toca el formulario en modo "consultar"
  const handleRequestEdit = () => {
    Alert.alert(
      "¿Desea Editar?",
      "Este proyecto está en modo de solo lectura. ¿Desea ir a la pantalla de edición?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, Editar", 
          onPress: () => {
            // Navegamos a "Editar" y le pasamos el proyecto que ya tenemos cargado
            navigation.navigate("EditarProyecto", { proyecto: proyecto });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2b3042" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
          <Image
            source={require("../../../assets/LOGO_BLANCO.png")} 
            style={styles.headerIcon}
          />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Consultar Proyecto</Text>
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
          />
          {/* Mostramos "Buscar" o "Limpiar" */}
          {proyecto ? (
             <TouchableOpacity style={[styles.searchButton, styles.clearButton]} onPress={handleLimpiarBusqueda}>
               <Text style={styles.searchButtonText}>Limpiar</Text>
             </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.searchButton} onPress={() => handleBuscarProyecto()}>
              <Text style={styles.searchButtonText}>Buscar</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* --- Indicador de Carga (para búsqueda) --- */}
        {isLoading && (
          <ActivityIndicator size="large" color="#77a7ab" style={{ marginVertical: 20 }} />
        )}

        {/* --- Formulario (SOLO SI SE ENCONTRÓ UN PROYECTO) --- */}
        {proyecto && !isLoading && (
          <View style={{ flex: 1, marginTop: 20 }}>
            <ProyectoFormView
              proyecto={proyecto}
              modo="consultar" // <-- ¡MODO SOLO LECTURA!
              onChange={onChange} // No hace nada, pero lo pasamos
              onGuardar={() => {}} // No hace nada
              empleados={empleadosList}
              onTouchDisabled={handleRequestEdit} // <-- ¡AQUÍ ESTÁ LA MAGIA!
            />
          </View>
        )}

        {/* --- Lista de Proyectos Aleatorios (NUEVO) --- */}
        {/* Se muestra solo si NO hay un proyecto buscado y NO está cargando */}
        {!proyecto && (
          <View style={styles.recientesContainer}>
            <Text style={styles.recientesTitle}>
              {isInitialLoading ? "Cargando..." : (proyectosAleatorios.length > 0 ? "Sugerencias de Proyectos" : "No hay proyectos")}
            </Text>
            {isInitialLoading ? (
              <ActivityIndicator size="small" color="#77a7ab" />
            ) : (
              proyectosAleatorios.map(p => (
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
              ))
            )}
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
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
  clearButton: {
    backgroundColor: "#E74C3C", // Color diferente para "Limpiar"
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
  // --- NUEVOS ESTILOS ---
  recientesContainer: {
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
});