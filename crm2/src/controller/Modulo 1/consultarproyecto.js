import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from "react-native";
import { useProyectoLogic } from "./proyectoform";

export default function ConsultarProyecto({ navigation }) {
  const [busqueda, setBusqueda] = useState("");
  const [proyectoEncontrado, setProyectoEncontrado] = useState(null);

  const proyectoLogic = useProyectoLogic({});

  // ... (Toda tu lógica de useEffect, handleBuscar, handleEditar no cambia) ...
  
  // ---------------------------
  // Cuando se carga el proyecto encontrado
  // ---------------------------
  useEffect(() => {
    if (proyectoEncontrado) {
      proyectoLogic.setNombreProyecto(proyectoEncontrado.nombreProyecto);
      proyectoLogic.setTipoProyecto(proyectoEncontrado.tipoProyecto);

      // Fecha inicio
      if (proyectoEncontrado.fechaInicio) {
        const [año, mes, dia] = proyectoEncontrado.fechaInicio.split("-");
        proyectoLogic.setAñoInicio(año);
        proyectoLogic.setMesInicio(mes);
        proyectoLogic.setDiaInicio(dia);
      }

      // Fecha fin
      if (proyectoEncontrado.fechaFin) {
        const [año, mes, dia] = proyectoEncontrado.fechaFin.split("-");
        proyectoLogic.setAñoFin(año);
        proyectoLogic.setMesFin(mes);
        proyectoLogic.setDiaFin(dia);
      }

      proyectoLogic.setResponsable(proyectoEncontrado.responsable);
      proyectoLogic.setEstado(proyectoEncontrado.estado);
      proyectoLogic.setPrioridad(proyectoEncontrado.prioridad);
      proyectoLogic.setDescripcion(proyectoEncontrado.Descripcion);
      proyectoLogic.setRecursosList(proyectoEncontrado.RecursosList);
    }
  }, [proyectoEncontrado]);

  // ---------------------------
  // Simulación de búsqueda
  // ---------------------------
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

  // ---------------------------
  // Construir fecha para mostrar
  // ---------------------------
  const fechaInicio = proyectoLogic.diaInicio && proyectoLogic.mesInicio && proyectoLogic.añoInicio
    ? `${proyectoLogic.añoInicio}-${proyectoLogic.mesInicio.padStart(2,"0")}-${proyectoLogic.diaInicio.padStart(2,"0")}`
    : "";

  const fechaFin = proyectoLogic.diaFin && proyectoLogic.mesFin && proyectoLogic.añoFin
    ? `${proyectoLogic.añoFin}-${proyectoLogic.mesFin.padStart(2,"0")}-${proyectoLogic.diaFin.padStart(2,"0")}`
    : "";


  return (
    // Quitamos el ScrollView y el 'style.container' de aquí
    // Usamos el 'mainContentArea' para centrar
    <View style={styles.mainContentArea}>
      {/* 🔹 Campo de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput} // <-- Estilo actualizado
          placeholder="Buscar proyecto por nombre o ID"
          placeholderTextColor="#999" // <-- Color de placeholder
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
          <TextInput style={styles.input} value={fechaInicio} editable={false} />

          <Text style={styles.label}>Fecha de fin:</Text>
          <TextInput style={styles.input} value={fechaFin} editable={false} />

          <Text style={styles.label}>Responsable:</Text>
          <TextInput style={styles.input} value={proyectoLogic.responsable} editable={false} />

          <Text style={styles.label}>Estado:</Text>
          <TextInput style={styles.input} value={proyectoLogic.estado} editable={false} />

          <Text style={styles.label}>Prioridad:</Text>
          <TextInput style={styles.input} value={proyectoLogic.prioridad} editable={false} />

          <Text style={styles.label}>Descripción:</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]} // <-- Estilo multilinea
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
    </View>
  );
}

// --- ESTILOS ACTUALIZADOS AL TEMA OSCURO ---
const styles = StyleSheet.create({
  mainContentArea: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    paddingHorizontal: 15,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#BDC3C7",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#77a7ab", // Color de acento
    borderRadius: 12,
    paddingVertical: 12, // Ajustado para misma altura
    paddingHorizontal: 15,
    marginLeft: 10,
  },
  searchButtonText: { color: "#fff", fontWeight: "600" },
  formContainer: {
    backgroundColor: "#3a3f50", // Fondo de tarjeta oscuro
    borderRadius: 12,
    padding: 15,
  },
  label: { 
    fontWeight: "600", 
    marginTop: 10, 
    color: "#ffffff", // Label blanco
    marginBottom: 5,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderColor: "#BDC3C7",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#333",
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top'
  },
  editButton: {
    backgroundColor: "#f39c12", // Color naranja
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