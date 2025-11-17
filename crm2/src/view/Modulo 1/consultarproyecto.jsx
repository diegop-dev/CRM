import React from "react";
import { ScrollView, StyleSheet, View, Text, Image, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ConsultarProyecto from "../../controller/Modulo 1/consultarproyecto";

export default function ConsultarProyectoView({ navigation }) {
  
  const handleGoBack = () => {
    navigation.goBack();
  };
  
  return (
    // --- CAMBIO: Fondo oscuro ---
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2b3042' }}> 
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../../../assets/LOGO_BLANCO.png")}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Consultar Proyecto</Text>
        </View>

        {/* --- CAMBIO: Estilo de línea --- */}
        <View style={styles.divider} />

        <ConsultarProyecto navigation={navigation} />
      </ScrollView>

      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    paddingTop: 20,
    backgroundColor: '#2b3042', // --- CAMBIO: Fondo oscuro ---
    paddingBottom: 80, 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 5,
  },
  headerIcon: {
    width: 60, // --- CAMBIO: Tamaño de logo estándar ---
    height: 80, // --- CAMBIO: Tamaño de logo estándar ---
    resizeMode: "contain",
    tintColor: "#ffffff", // --- CAMBIO: Título blanco ---
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#ffffff", // --- CAMBIO: Título blanco ---
    marginLeft: 15,
  },
  divider: {
    height: 3, // --- CAMBIO: Línea más gruesa ---
    backgroundColor: "#d92a1c", // --- CAMBIO: Línea roja ---
    marginHorizontal: 0, // --- CAMBIO: Ancho completo ---
    marginVertical: 10,
    marginBottom: 20,
  },
  backButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#77a7ab', 
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25, 
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});