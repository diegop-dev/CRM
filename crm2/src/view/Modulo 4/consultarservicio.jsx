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
// CAMBIO: Se importa el formulario de Servicios
import ServiciosFormView from "../../view/Modulo 4/serviciosform"; // Ajusta esta ruta
// CAMBIO: Se importa el (futuro) hook de lógica para consultar servicio
import { useConsultarServicioLogic } from "../../controller/Modulo 4/consultarservicio"; // Ajusta esta ruta

// CAMBIO: Renombrado el componente
export default function ConsultarServicioView() {
  const navigation = useNavigation();

  // CAMBIO: Variables desestructuradas del nuevo hook
  const {
    terminoBusqueda,     // 'nombreUsuario' -> 'terminoBusqueda'
    setTerminoBusqueda,  // 'setNombreUsuario' -> 'setTerminoBusqueda'
    servicio,            // 'empleado' -> 'servicio'
    empleadosList,       // <-- AÑADIDO: Necesario para el dropdown de Responsable
    loading,
    editable,
    buscarServicio,        // 'buscarEmpleado' -> 'buscarServicio'
    deseleccionarServicio, // 'deseleccionarEmpleado' -> 'deseleccionarServicio'
  } = useConsultarServicioLogic();


  const handleTouchDisabled = () => {
    // CAMBIO: Verificación de 'servicio'
    if (!editable && servicio) {
      Alert.alert(
        "Modo consulta",
        // CAMBIO: Texto actualizado
        "¿Desea editar este servicio?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Sí",
            onPress: () => {
              Alert.alert(
                "Área segura",
                // CAMBIO: Texto actualizado
                "¿Desea ser dirigido al área segura para editar servicio?",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Confirmar",
                    onPress: () => {
                      // CAMBIO: Navegación a 'EditarServicio' pasando 'servicio'
                      navigation.navigate("EditarServicio", { servicio });
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
          <Text style={styles.headerTitle}>Consultar Servicio</Text>
        </View>

        <View style={styles.divider} />

        {/* 🔹 Ocultamos búsqueda si ya hay servicio */}
        {/* CAMBIO: 'empleado' -> 'servicio' */}
        {!servicio && (
          <>
            {/* CAMBIO: Texto actualizado */}
            <Text style={styles.label}>Buscar por nombre de servicio:</Text>
            <View style={styles.searchBox}>
              <TextInput
                style={styles.input}
                // CAMBIO: Placeholder actualizado
                placeholder="Ejemplo: Consultoría de Marketing"
                // CAMBIO: Estado actualizado
                value={terminoBusqueda}
                onChangeText={setTerminoBusqueda}
              />
              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                // CAMBIO: 'buscarEmpleado' -> 'buscarServicio'
                onPress={buscarServicio}
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
        {/* CAMBIO: 'empleado' -> 'servicio' */}
        {servicio && (
          <View style={styles.resultContainer}>

            {/* --- Botón Volver --- */}
            <TouchableOpacity
              // CAMBIO: 'deseleccionarEmpleado' -> 'deseleccionarServicio'
              onPress={deseleccionarServicio}
              style={styles.regresarButton}
            >
              <Text style={styles.regresarButtonText}>{"< Volver a la búsqueda"}</Text>
            </TouchableOpacity>
            {/* --- FIN BOTÓN VOLVER --- */}

            {/* CAMBIO: Título actualizado */}
            <Text style={styles.resultTitle}>Datos del Servicio</Text>

            {/* CAMBIO: Se usa ClientesFormView */}
            <ServiciosFormView
              modo="consultar"
              // CAMBIO: 'empleado' -> 'servicio'
              servicio={servicio}
              onTouchDisabled={handleTouchDisabled}
              // <-- ¡CLAVE! Se pasa la lista de empleados
              empleados={empleadosList} 
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
