import React from "react";
import { ScrollView, StyleSheet, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProyectoFormView from "../../view/Modulo 1/proyectoform"; // Asumo la ruta
// Importamos el NUEVO hook de lógica
import { useAgregarProyectoLogic } from "../../controller/Modulo 1/agregarproyecto";

// --- 1. RECIBE { navigation } ---
export default function AgregarProyectoView({ navigation }) {

  // Usamos el nuevo hook para obtener el estado y las funciones
  const { proyecto, empleadosList, onChange, onGuardar } = useAgregarProyectoLogic();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2b3042" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/LOGO_BLANCO.png")} // Asumo la ruta
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Agregar Proyecto</Text>
        </View>

        <View style={styles.divider} />

        {/* Formulario */}
        <View style={{ flex: 1 }}>
          <ProyectoFormView
            proyecto={proyecto}
            modo="crear"
            onChange={onChange}
            onGuardar={onGuardar}
            empleados={empleadosList} // Pasamos la lista de empleados al formulario
            // --- 2. PASA LA FUNCIÓN DE NAVEGACIÓN ---
            onRegresar={() => navigation.goBack()} 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#2b3042", // Asumo fondo oscuro
    paddingHorizontal: 15,
    paddingTop: 5,
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
    backgroundColor: "#d92a1c", // Color de acento
    marginVertical: 10,
  },
});