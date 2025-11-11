import React from "react";
import { ScrollView, StyleSheet, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// CAMBIO: Se importa el formulario de Clientes
import ClientesFormView from "../../view/Modulo 3/clientesform";
// CAMBIO: Se importa el (futuro) hook de lógica para agregar cliente
import { useAgregarClienteLogic } from "../../controller/Modulo 3/agregarcliente";

// CAMBIO: Renombrado el componente
export default function AgregarClienteView() {

  // CAMBIO: Se usa el nuevo hook y se desestructura 'cliente'
  const { cliente, onChange, onGuardar } = useAgregarClienteLogic();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2b3042" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/LOGO_BLANCO.png")}
            style={styles.headerIcon}
          />
          {/* CAMBIO: Título actualizado */}
          <Text style={styles.headerTitle}>Agregar Cliente</Text>
        </View>

        <View style={styles.divider} />

        {/* Formulario */}
        <View style={{ flex: 1 }}>
          {/* CAMBIO: 
            - Se usa ClientesFormView.
            - Se pasa 'cliente' en lugar de 'empleado'.
            - Se usa modo="agregar" (que es el default en el nuevo form).
          */}
          <ClientesFormView
            cliente={cliente}
            modo="agregar" 
            onChange={onChange} // La función handleClienteChange del hook
            onGuardar={onGuardar} // La función guardarNuevoCliente del hook
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
