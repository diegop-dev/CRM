import React from "react";
import { ScrollView, StyleSheet, View, Text, Image, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmpleadosFormView from "../Empleados/empleadosform";
import { useNavigation } from "@react-navigation/native";
// Importamos el NUEVO hook de lógica
import { useAgregarEmpleadoLogic } from "../../../../controller/Modulo 2/SubModulos/Empleados/agregarempleado";

export default function AgregarEmpleadoView() {

  const { empleado, onChange, onGuardar } = useAgregarEmpleadoLogic();
  const navigation = useNavigation();

const handleLogoPress = () => {
  Alert.alert(
    "Confirmar Navegación",
    "¿Desea salir de la pantalla de agregar empleado y volver al menú de empleados?",
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
}


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2b3042" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
          <Image
            source={require("../../../../../assets/LOGO_BLANCO.png")}
            style={styles.headerIcon}
          />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agregar Empleado</Text>
          
        </View>

        <View style={styles.divider} />

        {/* Formulario */}
        <View style={{ flex: 1 }}>
          {/* Ahora le pasamos los props al formulario "tonto",
            igual que en la pantalla de Editar.
          */}
          <EmpleadosFormView
            empleado={empleado}
            modo="crear" // 'crear' es lo mismo que 'editar' en términos de funcionalidad
            onChange={onChange} // La función handleEmpleadoChange del hook
            onGuardar={onGuardar} // La función guardarNuevoEmpleado del hook
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
// (Tus estilos no cambian)
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
