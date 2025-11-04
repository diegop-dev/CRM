import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EmpleadosFormView from "../Empleados/empleadosform";

export default function ConsultarEmpleadoView() {
  const [nombre, setNombre] = useState("");
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(false);

  const buscarEmpleado = async () => {
    if (!nombre.trim()) {
      Alert.alert("Atención", "Ingrese un nombre para buscar.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://192.168.1.112:3000/empleados/buscar?termino=${encodeURIComponent(nombre)}`);
      if (!response.ok) throw new Error("Empleado no encontrado");
      const data = await response.json();
      setEmpleado(data);
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudo obtener el empleado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start",
          paddingHorizontal: 15,
          paddingTop: 5,
        }}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../../../assets/1.png")}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Consultar Empleado</Text>
        </View>

        <View style={styles.divider} />

        {/* Buscador */}
        <Text style={styles.label}>Buscar por nombre:</Text>
        <TextInput
          style={styles.input}
          placeholder="Ejemplo: Juan Pérez"
          value={nombre}
          onChangeText={setNombre}
        />
        <Button title="Buscar" onPress={buscarEmpleado} disabled={loading} />

        {/* Resultado */}
        {empleado && (
          <View style={{ marginTop: 20 }}>
            <EmpleadosFormView empleado={empleado} mode="ver" />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
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
    marginVertical: 10,
  },
  label: {
    fontWeight: "600",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    marginBottom: 10,
  },
});
