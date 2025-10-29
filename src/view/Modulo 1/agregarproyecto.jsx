import React from "react";
import { ScrollView, StyleSheet, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProyectoForm } from "../../controller/Modulo 1/agregarproyecto";

export default function AgregarProyectoView() {
  const formulario = getProyectoForm({}, "crear");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/1.png")}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Agregar Proyecto</Text>
        </View>

        <View style={styles.divider} />

        {/* Formulario */}
        {formulario}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { paddingTop: 20 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 5,
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
    height: 1,
    backgroundColor: "#BDC3C7",
    marginHorizontal: 20,
    marginVertical: 10,
  },
});
