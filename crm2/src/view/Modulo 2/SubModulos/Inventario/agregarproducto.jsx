import React from "react";
import { ScrollView, StyleSheet, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// CAMBIO: Se importa el formulario de Productos
import ProductosFormView from "../Inventario/productosform"; // Ajusta esta ruta
// CAMBIO: Importamos el hook de lógica para agregar producto
import { useAgregarProductoLogic } from "../../../../controller/Modulo 2/SubModulos/Inventario/agregarproducto"; // Ajusta esta ruta

// CAMBIO: Renombrado a 'AgregarProductoView'
export default function AgregarProductoView() {

  // CAMBIO: Usamos el nuevo hook y 'producto'
  // 'empleadosList' se mantiene porque 'ProductosFormView' lo usa.
  const { producto, empleadosList, onChange, onGuardar } = useAgregarProductoLogic();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2b3042" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../../../assets/LOGO_BLANCO.png")} // Asumo la ruta
            style={styles.headerIcon}
          />
          {/* CAMBIO: Título actualizado (basado en el wireframe "Agregar Producto") */}
          <Text style={styles.headerTitle}>Agregar Producto</Text>
        </View>

        <View style={styles.divider} />

        {/* Formulario */}
        <View style={{ flex: 1 }}>
          {/* CAMBIO: Se usa 'ProductosFormView' */}
          <ProductosFormView
            // CAMBIO: 'articulo' -> 'producto'
            producto={producto}
            modo="agregar"
            onChange={onChange}
            onGuardar={onGuardar}
            empleados={empleadosList} // Pasamos la lista de empleados al formulario
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
