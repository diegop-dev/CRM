import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
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
    Alert.alert("Redirigiendo", "Serás redirigido al apartado de edición", [
      {
        text: "Aceptar",
        onPress: () => {
          navigation.navigate("EditarProyecto", {
            proyecto: proyectoEncontrado,
          });
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Campo de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar proyecto por nombre o ID"
          placeholderTextColor="#95A5A6"
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleBuscar}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {/* Formulario en solo lectura */}
      {proyectoEncontrado && (
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nombre del proyecto:</Text>
          <TextInput
            style={styles.formInput}
            value={proyectoLogic.nombreProyecto}
            editable={false}
          />

          <Text style={styles.label}>Tipo de proyecto:</Text>
          <TextInput
            style={styles.formInput}
            value={proyectoLogic.tipoProyecto}
            editable={false}
          />

          <Text style={styles.label}>Fecha de inicio:</Text>
          <TextInput
            style={styles.formInput}
            value={proyectoLogic.fechaInicio}
            editable={false}
          />

          <Text style={styles.label}>Fecha de fin:</Text>
          <TextInput
            style={styles.formInput}
            value={proyectoLogic.fechaFin}
            editable={false}
          />

          <Text style={styles.label}>Responsable:</Text>
          <TextInput
            style={styles.formInput}
            value={proyectoLogic.responsable}
            editable={false}
          />

          <Text style={styles.label}>Estado:</Text>
          <TextInput
            style={styles.formInput}
            value={proyectoLogic.estado}
            editable={false}
          />

          <Text style={styles.label}>Prioridad:</Text>
          <TextInput
            style={styles.formInput}
            value={proyectoLogic.prioridad}
            editable={false}
          />

          <Text style={styles.label}>Descripción:</Text>
          <TextInput
            style={[styles.formInput, { height: 112 }]}
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

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  searchContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffffff",
    borderColor: "#BDC3C7",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#3498DB",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    marginLeft: 10,
  },
  searchButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
  formContainer: {
    backgroundColor: "#ffffffff",
    borderColor: "#BDC3C7",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  formInput: {
    flex: 1,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#BDC3C7",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: "#333",
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34495E",
    marginTop: 6,
    marginBottom: 6,
  },
  editButton: {
    backgroundColor: "#F39C12",
    marginTop: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
  },
  editButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
});
