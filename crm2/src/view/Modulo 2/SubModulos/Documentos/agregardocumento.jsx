import React from "react";
import { ScrollView, StyleSheet, View, Text, Image, Alert, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
// Apuntamos al formulario en 'views' (Asegúrate de que documentosform.jsx esté en la misma carpeta)
import DocumentosFormView from "./documentosform"; 
// Apuntamos a la lógica en 'controllers'
import { useAgregarDocumentoLogic } from "../../../../controller/Modulo 2/SubModulos/Documentos/agregardocumento";

export default function AgregarDocumentoView() {

  // Desestructuramos del hook de lógica
  const { 
    documento, 
    empleadosList, 
    onChange, 
    onGuardar, 
    onFileSelect, 
    onViewFile //Importante para manejar el botón "Ver" (aunque sea local)
  } = useAgregarDocumentoLogic();
  
  const navigation = useNavigation();

  const handleLogoPress = () => {
    Alert.alert(
      "Confirmar Navegación",
      "¿Desea salir del módulo de Gestión de Documentos y volver al menú principal?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Volver",
          onPress: () => {
            Alert.alert(
              "Área Segura",
              "Será redirigido al Menú Principal.",
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
          <Text style={styles.headerTitle}>Agregar Documento</Text>
        </View>

        <View style={styles.divider} />

        {/* Formulario */}
        <View style={{ flex: 1 }}>
          <DocumentosFormView
            documento={documento}
            modo="agregar" // Define que se muestren los botones de subir/reemplazar
            onChange={onChange}
            onGuardar={onGuardar}
            empleados={empleadosList}
            onFileSelect={onFileSelect}
            onViewFile={onViewFile} 
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
    paddingHorizontal: 15, // Añadido para mejor alineación
  },
  container: {
    flex: 1,
    backgroundColor: "#2b3042",
    paddingTop: 10,
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
    marginHorizontal: 15, // Alineación con el contenedor
  },
});