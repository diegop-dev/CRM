import React from "react";
import { ScrollView, StyleSheet, View, Text, Image, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Importamos el formulario reutilizable (Asegúrate de que la ruta sea correcta)
import ClientesFormView from "../../view/Modulo 3/clientesform";
// Importamos el hook de lógica
import { useAgregarClienteLogic } from "../../controller/Modulo 3/agregarcliente";
import { useNavigation } from "@react-navigation/native";

export default function AgregarClienteView() {

  // Usamos el hook para obtener el estado y las funciones
  const { cliente, onChange, onGuardar } = useAgregarClienteLogic();
  const navigation = useNavigation(); 
    const handleLogoPress = () => {
      Alert.alert(
        "Confirmar Navegación",
        "¿Desea salir de Agregar Clientes y volver al menú principal?",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Sí, Volver",
            onPress: () => {
              Alert.alert(
                "Área Segura",
                "Será redirigido al Menú Principal, los datos ingresado no seran guardados.",
                [
                  { text: "Permanecer", style: "cancel" },
                  {
                    text: "Confirmar",
                    onPress: () => {
                      // Ahora 'navigation' está disponible
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
        keyboardShouldPersistTaps="handled"
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
          <Image
            source={require("../../../assets/LOGO_BLANCO.png")} // Ajusta esta ruta si es necesario
            style={styles.headerIcon}
          />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agregar Cliente</Text>
        </View>

        <View style={styles.divider} />

        {/* Formulario */}
        <View style={{ flex: 1 }}>
          <ClientesFormView
            cliente={cliente}
            modo="agregar" 
            onChange={onChange}
            onGuardar={onGuardar}
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
