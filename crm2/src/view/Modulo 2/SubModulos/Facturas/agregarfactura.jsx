import React from "react";
import { ScrollView, StyleSheet, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Importamos el futuro componente de formulario
import FacturaFormView from "./facturasform"; 
// Importamos el hook de lógica que acabamos de crear
import { useAgregarFacturaLogic } from "../../../../controller/Modulo 2/SubModulos/Facturas/agregarfactura";

export default function AgregarFacturaView() {

  // Usamos el nuevo hook para obtener el estado y las funciones
  const { factura, clientesList, onChange, onGuardar } = useAgregarFacturaLogic();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2b3042" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            // Asumo la ruta del logo basado en la jerarquía
            source={require("../../../../../assets/LOGO_BLANCO.png")} 
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Agregar Factura</Text>
        </View>

        <View style={styles.divider} />

        {/* Formulario */}
        <View style={{ flex: 1 }}>
          <FacturaFormView
            factura={factura}
            modo="crear"
            onChange={onChange}
            onGuardar={onGuardar}
            clientes={clientesList} // Pasamos la lista de clientes al formulario
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
// (Copiados de agregarproyecto.jsx para mantener consistencia)
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
    backgroundColor: "#d92a1c", // Color de acento
    marginVertical: 10,
  },
});