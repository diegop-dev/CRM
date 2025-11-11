import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
// CAMBIO: Se importa el formulario de Clientes
import ClientesFormView from "../../view/Modulo 3/clientesform";
// CAMBIO: Se importa el (futuro) hook de lógica para consultar cliente
import { useConsultarClienteLogic } from "../../controller/Modulo 3/consultarcliente";

// CAMBIO: Renombrado el componente
export default function ConsultarClienteView() {
  const navigation = useNavigation();

  // CAMBIO: Variables desestructuradas del nuevo hook
  const {
    terminoBusqueda,     // 'nombreUsuario' -> 'terminoBusqueda' (para ser consistentes)
    setTerminoBusqueda,  // 'setNombreUsuario' -> 'setTerminoBusqueda'
    cliente,             // 'empleado' -> 'cliente'
    loading,
    editable,
    buscarCliente,         // 'buscarEmpleado' -> 'buscarCliente'
    deseleccionarCliente,  // 'deseleccionarEmpleado' -> 'deseleccionarCliente'
  } = useConsultarClienteLogic();


  const handleTouchDisabled = () => {
    // CAMBIO: Verificación de 'cliente'
    if (!editable && cliente) {
      Alert.alert(
        "Modo consulta",
        // CAMBIO: Texto actualizado
        "¿Desea editar este cliente?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Sí",
            onPress: () => {
              Alert.alert(
                "Área segura",
                // CAMBIO: Texto actualizado
                "¿Desea ser dirigido al área segura para editar cliente?",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Confirmar",
                    onPress: () => {
                      // CAMBIO: Navegación a 'EditarCliente' pasando 'cliente'
                      navigation.navigate("EditarCliente", { cliente });
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
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 🔹 Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/LOGO_BLANCO.png")}
            style={styles.headerIcon}
          />
          {/* CAMBIO: Título actualizado */}
          <Text style={styles.headerTitle}>Consultar Cliente</Text>
        </View>

        <View style={styles.divider} />

        {/* 🔹 Ocultamos búsqueda si ya hay cliente */}
        {/* CAMBIO: 'empleado' -> 'cliente' */}
        {!cliente && (
          <>
            {/* CAMBIO: Texto actualizado */}
            <Text style={styles.label}>Buscar por nombre de cliente:</Text>
            <View style={styles.searchBox}>
              <TextInput
                style={styles.input}
                // CAMBIO: Placeholder actualizado
                placeholder="Ejemplo: Juan Pérez"
                // CAMBIO: Estado actualizado
                value={terminoBusqueda}
                onChangeText={setTerminoBusqueda}
              />
              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                // CAMBIO: 'buscarEmpleado' -> 'buscarCliente'
                onPress={buscarCliente}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Buscar</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* 🔹 Mostrar resultados */}
        {/* CAMBIO: 'empleado' -> 'cliente' */}
        {cliente && (
          <View style={styles.resultContainer}>

            {/* --- Botón Volver --- */}
            <TouchableOpacity
              // CAMBIO: 'deseleccionarEmpleado' -> 'deseleccionarCliente'
              onPress={deseleccionarCliente}
              style={styles.regresarButton}
            >
              <Text style={styles.regresarButtonText}>{"< Volver a la búsqueda"}</Text>
            </TouchableOpacity>
            {/* --- FIN BOTÓN VOLVER --- */}

            {/* CAMBIO: Título actualizado */}
            <Text style={styles.resultTitle}>Datos del Cliente</Text>

            {/* CAMBIO: Se usa ClientesFormView */}
            <ClientesFormView
              modo="consultar"
              // CAMBIO: 'empleado' -> 'cliente'
              cliente={cliente}
              onTouchDisabled={handleTouchDisabled}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos 
// (Sin cambios)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  scrollContainer: { padding: 20, flexGrow: 1, paddingHorizontal: 15, paddingTop: 5 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerIcon: { width: 60, height: 80, resizeMode: "contain", tintColor: "#ffffff" },
  headerTitle: { fontSize: 25, fontWeight: "700", marginLeft: 15, color: "#ffffff" },
  divider: { height: 3, backgroundColor: "#d92a1c", marginVertical: 1 },
  label: { fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 15 },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D0D3D4",
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
  },
  button: {
    backgroundColor: "#006480",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  resultContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    elevation: 2,
  },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  regresarButton: {
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  regresarButtonText: {
    fontSize: 16,
    color: "#007AFF", // Azul tipo "link"
    fontWeight: '500',
  },
});
