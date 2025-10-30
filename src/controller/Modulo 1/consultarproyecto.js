// 📂 src/controller/Modulo 1/ConsultarProyecto.js
import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useProyectoLogic } from "./proyectoform";

export default function ConsultarProyecto({ navigation }) {
  const [busqueda, setBusqueda] = useState("");
  const [proyectoEncontrado, setProyectoEncontrado] = useState(null);

  const proyectoLogic = useProyectoLogic({});

  
  useEffect(() => {
    if (proyectoEncontrado) {
      proyectoLogic.setNombreProyecto(proyectoEncontrado.nombreProyecto);
      proyectoLogic.setTipoProyecto(proyectoEncontrado.tipoProyecto);
      proyectoLogic.setFechaInicio(proyectoEncontrado.fechaInicio);
      proyectoLogic.setFechaFin(proyectoEncontrado.fechaFin);
      proyectoLogic.setResponsable(proyectoEncontrado.responsable);
      proyectoLogic.setEstado(proyectoEncontrado.estado);
      proyectoLogic.setPrioridad(proyectoEncontrado.prioridad);
      proyectoLogic.setDescripcion(proyectoEncontrado.Descripcion);
      proyectoLogic.setRecursosList(proyectoEncontrado.RecursosList);
    }
  }, [proyectoEncontrado]);

  const handleBuscar = () => {
    if (!busqueda.trim()) {
      Alert.alert("Búsqueda vacía", "Ingresa el nombre o ID del proyecto.");
      return;
    }

    
    const datosSimulados = {
      idProyecto: "P001",
      nombreProyecto: "CRM Empresarial",
      tipoProyecto: "Software",
      fechaInicio: "2025-01-10",
      fechaFin: "2025-12-31",
      responsable: "Alejandro Mex",
      estado: "En progreso",
      prioridad: "Alta",
      RecursosList: ["PC", "Servidor", "Licencias"],
      Auditoria: "Auditoría inicial completada",
      Descripcion: "Sistema de gestión de clientes y ventas",
    };

    setProyectoEncontrado(datosSimulados);
  };

  const handleEditar = () => {
    Alert.alert(
      "Redirigiendo",
      "Serás redirigido al apartado de edición",
      [
        {
          text: "Aceptar",
          onPress: () => {
            
            navigation.navigate("EditarProyecto", { proyecto: proyectoEncontrado });
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
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

      {/* 🔹 Formulario en solo lectura */}
      {proyectoEncontrado && (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nombre del proyecto:</Text>
          <TextInput style={styles.input} value={proyectoLogic.nombreProyecto} editable={false} />

          <Text style={styles.label}>Tipo de proyecto:</Text>
          <TextInput style={styles.input} value={proyectoLogic.tipoProyecto} editable={false} />

          <Text style={styles.label}>Fecha de inicio:</Text>
          <TextInput style={styles.input} value={proyectoLogic.fechaInicio} editable={false} />

          <Text style={styles.label}>Fecha de fin:</Text>
          <TextInput style={styles.input} value={proyectoLogic.fechaFin} editable={false} />

          <Text style={styles.label}>Responsable:</Text>
          <TextInput style={styles.input} value={proyectoLogic.responsable} editable={false} />

          <Text style={styles.label}>Estado:</Text>
          <TextInput style={styles.input} value={proyectoLogic.estado} editable={false} />

          <Text style={styles.label}>Prioridad:</Text>
          <TextInput style={styles.input} value={proyectoLogic.prioridad} editable={false} />

          <Text style={styles.label}>Descripción:</Text>
          <TextInput
            style={[styles.input, { height: 80 }]}
            value={proyectoLogic.Descripcion}
            editable={false}
            multiline
          />

          {/* Botón Editar */}
          <TouchableOpacity style={styles.editButton} onPress={handleEditar}>
            <Text style={styles.editButtonText}>Editar Proyecto</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#F0F2F5" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECF0F1",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 20,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#2C3E50",
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 8,
    padding: 8,
    marginTop: 5,
  },
  searchButton: {
    backgroundColor: "#3498DB",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginLeft: 10,
  },
  searchButtonText: { color: "#fff", fontWeight: "600" },
  formContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  label: { fontWeight: "700", marginTop: 10, color: "#2C3E50" },
  editButton: {
    backgroundColor: "#F39C12",
    marginTop: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 15,
  },
});
