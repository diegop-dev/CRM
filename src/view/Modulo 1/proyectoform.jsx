import React, { useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Importamos la lógica (hook personalizado)
import { useProyectoLogic } from "../../controller/Modulo 1/proyectoform";

// --- Componentes reutilizables ---
const FormInput = React.memo(
  ({
    label,
    value,
    onChangeText,
    editable = true,
    multiline = false,
    style,
  }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.textInput, multiline && styles.multilineInput, style]}
        value={value}
        onChangeText={onChangeText}
        editable={editable}
        multiline={multiline}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  )
);

const LockedInput = React.memo(({ label, value }) => (
  <FormInput
    label={label}
    value={value}
    editable={false}
    style={{ backgroundColor: "#e6e6e6" }}
  />
));

// --- Componente principal ---
export default function ProyectoFormView({ proyecto = {}, mode = "crear" }) {
  const logic = useProyectoLogic(proyecto);

  const editable = mode !== "consultar";

  const handleGuardar = useCallback(() => {
    logic.handleGuardar();
  }, [logic]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <LockedInput label="ID de Proyecto" value={logic.idProyecto} />

        <FormInput
          label="Nombre del Proyecto"
          value={logic.nombreProyecto}
          onChangeText={logic.setNombreProyecto}
          editable={editable}
        />
        <FormInput
          label="Tipo de Proyecto"
          value={logic.tipoProyecto}
          onChangeText={logic.setTipoProyecto}
          editable={editable}
        />
        <FormInput
          label="Fecha de Inicio"
          value={logic.fechaInicio}
          onChangeText={logic.setFechaInicio}
          editable={editable}
        />
        <FormInput
          label="Fecha de Fin"
          value={logic.fechaFin}
          onChangeText={logic.setFechaFin}
          editable={editable}
        />
        <FormInput
          label="Responsable / Encargado"
          value={logic.responsable}
          onChangeText={logic.setResponsable}
          editable={editable}
        />
        <FormInput
          label="Estado"
          value={logic.estado}
          onChangeText={logic.setEstado}
          editable={editable}
        />
        <FormInput
          label="Prioridad"
          value={logic.prioridad}
          onChangeText={logic.setPrioridad}
          editable={editable}
        />
        <FormInput
          label="Recursos"
          value={
            Array.isArray(logic.RecursosList)
              ? logic.RecursosList.join("\n")
              : logic.RecursosList
          }
          onChangeText={(text) =>
            logic.setRecursosList(
              text.split("\n").filter((r) => r.trim() !== "")
            )
          }
          editable={editable}
          multiline
        />
        <LockedInput label="Auditoría" value={logic.Auditoria} />
        <FormInput
          label="Descripción"
          value={logic.Descripcion}
          onChangeText={logic.setDescripcion}
          editable={editable}
          multiline
        />

        {editable && (
          <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
            <Text style={styles.saveButtonText}>Guardar Proyecto</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  scrollContainer: { paddingHorizontal: 20, paddingBottom: 100 },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginVertical: 15,
    color: "#2C3E50",
  },
  inputContainer: { marginBottom: 6 },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34495E",
    marginBottom: 6,
  },
  textInput: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderColor: "#BDC3C7",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    color: "#333",
  },
  multilineInput: { height: 112 },
  saveButton: {
    backgroundColor: "#3498DB",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 15,
  },
  saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
});
