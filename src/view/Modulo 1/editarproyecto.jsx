import React from "react";
import { ScrollView, StyleSheet, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EditarProyectoForm from "../../controller/Modulo 1/editarproyecto";

export default function EditarProyectoView({ route }) {
  const proyectoInicial = route?.params?.proyecto || null;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Image
            source={require("../../../assets/1.png")}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Editar Proyecto</Text>
        </View>

        <View style={styles.divider} />

        {/* Formulario de edición, recibe proyecto opcional */}
        <EditarProyectoForm proyectoInicial={proyectoInicial} />
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
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
    marginLeft: 15,
  },
  divider: {
    height: 1,
    backgroundColor: "#BDC3C7",
    marginHorizontal: 20,
    marginVertical: 10,
  },
});
