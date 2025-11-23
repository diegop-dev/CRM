import React from "react";
import { ScrollView, StyleSheet, View, Text, Image, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ProyectoFormView from "../../view/Modulo 1/proyectoform"; 
import { useNavigation } from "@react-navigation/native"; 
import { useAgregarProyectoLogic } from "../../controller/Modulo 1/agregarproyecto";

export default function AgregarProyectoView() {
  
  // 1. Obtener la navegación
  const navigation = useNavigation(); 

  // 2. Usamos el hook para obtener el estado y las funciones (en una sola llamada)
  const { proyecto, empleadosList, onChange, onGuardar } = useAgregarProyectoLogic();
  
  const handleLogoPress = () => {
    
    Alert.alert(
      "Confirmar Navegación",
      "¿Desea salir de la Agregar Proyectos y volver al menú principal?",
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
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
          <Image
            source={require("../../../assets/LOGO_BLANCO.png")} 
            style={styles.headerIcon}
          />
          </TouchableOpacity>
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
            empleados={empleadosList} 
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
    color: "#FFFFFF",
  },
  divider: {
    height: 3,
    backgroundColor: "#d92a1c", 
    marginVertical: 10,
  },
});
