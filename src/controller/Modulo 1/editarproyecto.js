// 📂 src/controller/Modulo 1/editarproyecto.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

/**
 * Controlador del formulario de edición de proyectos.
 * Por ahora incluye búsqueda simulada; luego se conectará con Firebase o API.
 */
export const getProyectoForm = (initialData = {}, modo = "editar") => {
  const [busqueda, setBusqueda] = useState("");
  const [proyecto, setProyecto] = useState(null);

  // 🔍 Buscar proyecto (por ahora simulado)
  const handleBuscar = () => {
    if (!busqueda.trim()) {
      Alert.alert("Búsqueda vacía", "Por favor ingresa el nombre o ID del proyecto.");
      return;
    }

    console.log("Buscando proyecto:", busqueda);

    // 🔸 Ejemplo de resultado simulado
    setProyecto({
      nombre: "CRM Empresarial",
      descripcion: "Sistema de gestión de clientes",
      estado: "En progreso",
    });
  };

  return (
    <View style={styles.formContainer}>
      {/* 🔹 Campo de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Buscar proyecto por nombre o ID"
          placeholderTextColor="#95A5A6"
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleBuscar}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Resultado del proyecto */}
      {proyecto && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultTitle}>Proyecto encontrado:</Text>
          <Text style={styles.resultText}>📘 Nombre: {proyecto.nombre}</Text>
          <Text style={styles.resultText}>📝 Descripción: {proyecto.descripcion}</Text>
          <Text style={styles.resultText}>⚙️ Estado: {proyecto.estado}</Text>

          {/* 🔹 Aquí más adelante se podrá editar los campos */}
          <TouchableOpacity
            style={styles.editButton}
          >
            <Text style={styles.editButtonText}>Editar proyecto</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    marginHorizontal: 20,
    marginTop: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECF0F1",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2C3E50",
  },
  searchButton: {
    backgroundColor: "#3498DB",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  resultContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    marginTop: 20,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  resultTitle: {
    fontWeight: "700",
    fontSize: 18,
    color: "#2C3E50",
    marginBottom: 8,
  },
  resultText: {
    fontSize: 15,
    color: "#34495E",
    marginBottom: 4,
  },
  editButton: {
    backgroundColor: "#2ECC71",
    marginTop: 15,
    paddingVertical: 10,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 15,
  },
});
