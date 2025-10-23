import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { useNavigation } from "@react-navigation/native"; // Para navegar

// Importa las funciones de lógica
import {
  handleAgregarCliente,
  handleEditarCliente,
  handleConsultarCliente,
} from "../../controller/Modulo 3/menugestiondeclientes";

export default function MenuGestionDeClientesView() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Encabezado: Icono y texto en la misma fila */}
      <View style={styles.header}>
        <Image
          source={require("../../../assets/1.png")} // Asumiendo que 1.png es tu icono de header
          style={styles.headerIcon}
        />
        <Text style={styles.headerTitle}>Gestión de Clientes</Text>
      </View>

      {/* Línea divisora */}
      <View style={styles.divider} />

      {/* Fila 1 de Botones: Agregar y Editar */}
      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => handleAgregarCliente(navigation)}
        >
          <Image
            source={require("../../../assets/1.png")} // Reemplaza con tu icono de "Agregar"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Agregar Cliente</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => handleEditarCliente(navigation)}
        >
          <Image
            source={require("../../../assets/1.png")} // Reemplaza con tu icono de "Editar"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Editar Cliente</Text>
        </TouchableOpacity>
      </View>

      {/* Fila 2 de Botones: Consultar (Centrado y Ancho) */}
      <View style={styles.centeredRow}>
        <TouchableOpacity
          // Aplicamos ambos estilos: el base y el de botón grande
          style={[styles.button, styles.largeButton]}
          onPress={() => handleConsultarCliente(navigation)}
        >
          <Image
            source={require("../../../assets/1.png")} // Reemplaza con tu icono de "Consultar"
            style={styles.buttonIcon}
          />
          <Text style={styles.buttonText}>Consultar Cliente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// --- ESTILOS CORREGIDOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F2F5",
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    // Eliminamos el marginBottom para que la línea divisora controle el espacio
  },
  headerIcon: {
    width: 48,
    height: 48,
    resizeMode: "contain",
    tintColor: "#3498DB",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#2C3E50",
    marginLeft: 15,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#BDC3C7",
    marginTop: 15, // Espacio reducido después del header
    marginBottom: 30, // Espacio antes de los botones
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginBottom: 30,
  },
  centeredRow: {
    width: "100%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 15,
    width: "46%", // Ancho para los botones superiores
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  // --- ESTILO AÑADIDO ---
  largeButton: {
    width: "95%", // Ancho específico para el botón de "Consultar"
  },
  buttonIcon: {
    width: 65,
    height: 65,
    resizeMode: "contain",
    tintColor: "#3498DB",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#34495E",
    textAlign: "center",
    marginTop: 5,
  },
});
