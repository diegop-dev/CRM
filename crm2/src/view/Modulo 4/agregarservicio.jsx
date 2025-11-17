import React from "react";
import { ScrollView, StyleSheet, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// CAMBIO: Se importa el formulario de Servicios
import ServiciosFormView from "../../view/Modulo 4/serviciosform"; // Ajusta esta ruta
// CAMBIO: Importamos el (futuro) hook de lógica para agregar servicio
import { useAgregarServicioLogic } from "../../controller/Modulo 4/agregarservicio"; // Ajusta esta ruta

// CAMBIO: Renombrado a 'AgregarServicioView'
// --- 1. RECIBE { navigation } ---
export default function AgregarServicioView({ navigation }) {

  // CAMBIO: Usamos el nuevo hook.
  // Nota: Mantenemos 'empleadosList' porque 'ServiciosFormView' 
  // lo necesita para el dropdown de "ID de Responsable".
  const { servicio, empleadosList, onChange, onGuardar } = useAgregarServicioLogic();

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
          {/* CAMBIO: Título actualizado */}
          <Text style={styles.headerTitle}>Agregar Servicio</Text>
        </View>

        <View style={styles.divider} />

        {/* Formulario */}
        <View style={{ flex: 1 }}>
          {/* CAMBIO: Se usa 'ServiciosFormView' */}
          <ServiciosFormView
            // CAMBIO: 'proyecto' -> 'servicio'
            servicio={servicio}
            modo="agregar" // 'crear' -> 'agregar'
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
// (Sin cambios)
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  container: {
    flex: 1,
    backgroundColor: "#2b3042",
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
    backgroundColor: "#d92a1c",
    marginVertical: 10,
  },
});