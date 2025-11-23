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
import EmpleadosFormView from "../Empleados/empleadosform";
import { useConsultarEmpleadoLogic } from "../../../../controller/Modulo 2/SubModulos/Empleados/consultarempleado";

export default function ConsultarEmpleadoView() {
  const navigation = useNavigation();

  const {
    nombreUsuario,
    setNombreUsuario,
    empleado,
    loading,
    editable,
    buscarEmpleado,
    deseleccionarEmpleado,
  } = useConsultarEmpleadoLogic();

  const handleLogoPress = () => {
    Alert.alert(
      "Confirmar Navegación",
      "¿Desea salir de la pantalla de consultar empleado y volver al menú de empleados?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Volver",
          onPress: () => {
            Alert.alert(
              "Área Segura",
              "Será redirigido al Menú de Empleados.",
              [
                { text: "Permanecer", style: "cancel" },
                {
                  text: "Confirmar",
                  onPress: () => {
                    navigation.navigate("MenuPrincipal");
                  },
                },
              ]
            );
          },
        },
      ],
      { cancelable: true }
    );
  };

  // --- FUNCIÓN: Maneja el toque en el formulario en modo consulta ---
  const handleTouchDisabled = () => {
    if (!editable && empleado) {
      Alert.alert(
        "Modo consulta",
        "¿Desea editar este empleado?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Sí",
            onPress: () => {
              Alert.alert(
                "Área segura",
                "¿Desea ser dirigido al área segura para editar empleado?",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Confirmar",
                    onPress: () => {
                      // Redirige al formulario de edición con los datos del empleado actual
                      navigation.navigate("EditarEmpleado", { empleado });
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
        {/*  Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
            <Image
              source={require("../../../../../assets/LOGO_BLANCO.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Consultar Empleado</Text>
        </View>

        <View style={styles.divider} />

        {/*  ÁREA DE BÚSQUEDA SIEMPRE VISIBLE */}
        <Text style={styles.label}>Buscar por nombre de usuario:</Text>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="Ejemplo: Herdia1"
            value={nombreUsuario}
            onChangeText={setNombreUsuario}
          />
          
          {/* 🔹 CAMBIO 2: BOTÓN CON DOBLE FUNCIÓN (Buscar / Limpiar) */}
          <TouchableOpacity
            style={[
              styles.button, 
              loading && { opacity: 0.6 },
              empleado && { backgroundColor: "#d92a1c" } // Rojo si es Limpiar
            ]}
            // Si hay empleado -> Limpiar (deseleccionar), si no -> Buscar
            onPress={empleado ? deseleccionarEmpleado : buscarEmpleado}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>
                {empleado ? "Limpiar" : "Buscar"}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 🔹 Mostrar resultados */}
        {empleado && (
          <View style={styles.resultContainer}>
            
            <Text style={styles.resultTitle}>Datos del Empleado</Text>

            {/* Formulario en modo consulta */}
            <EmpleadosFormView
              modo="consultar"
              empleado={empleado}
              onTouchDisabled={handleTouchDisabled}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos 
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
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  resultContainer: {
    backgroundColor: "",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    elevation: 2,
  },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color:"white", textAlign:"center" },
});