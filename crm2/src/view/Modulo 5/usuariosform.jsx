import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from "react-native";

// --- Componente de Input Interno ---
const FormInput = ({ label, value, onChangeText, placeholder, secureTextEntry, editable = true }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.textInput, !editable && styles.disabledInput]}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#999"
      secureTextEntry={secureTextEntry}
      editable={editable}
    />
  </View>
);

// --- Fila de Permiso ---
const PermisoRow = ({ nombre, activo, onToggle }) => (
  <View style={styles.permisoRow}>
    <Text style={styles.permisoText}>{nombre}</Text>
    <Switch
      trackColor={{ false: "#767577", true: "#006480" }}
      thumbColor={activo ? "#f4f3f4" : "#f4f3f4"}
      onValueChange={onToggle}
      value={activo}
    />
  </View>
);

export default function UsuariosFormView({ usuarioData, modo = "editar", onGuardar }) {
  
  if (!usuarioData) {
      return <ActivityIndicator size="large" color="#006480" />;
  }

  const {
    nombreEmpleado,
    nombreUsuario, 
    contraseña, 
    listaPermisos, loadingPermisos, togglePermiso
  } = usuarioData;

  // Si estamos en modo edición, bloqueamos usuario y contraseña
  const isEditing = modo === "editar";

  return (
    <View style={styles.container}>
      
      <Text style={styles.sectionHeader}>Credenciales</Text>
      
      <FormInput
        label="Empleado"
        value={nombreEmpleado}
        editable={false}
      />

      {/*  CAMPO BLOQUEADO: NOMBRE DE USUARIO */}
      <FormInput
        label="Nombre de Usuario"
        value={nombreUsuario}
        editable={false} // Bloqueado
      />

      {/* CAMPO BLOQUEADO: CONTRASEÑA */}
      {/* En edición, mostramos un placeholder fijo o vacío, ya que no se debe editar */}
      <FormInput
        label="Contraseña"
        value="********" // Valor fijo visual
        editable={false} // Bloqueado
        secureTextEntry
      />

      <View style={styles.divider} />

      <Text style={styles.sectionHeader}>Permisos de Acceso</Text>
      <Text style={styles.helperText}>Active los módulos permitidos:</Text>

      <View style={styles.listContainer}>
        {loadingPermisos ? (
           <ActivityIndicator size="small" color="#006480" style={{ padding: 20 }} />
        ) : (
           listaPermisos.map((item) => (
             <PermisoRow
               key={item.id_modulo}
               nombre={item.nombre_modulo}
               activo={Boolean(item.activo)}
               onToggle={() => togglePermiso(item.id_modulo)}
             />
           ))
        )}
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={onGuardar}>
        <Text style={styles.saveButtonText}>Guardar Cambios</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  sectionHeader: { fontSize: 18, fontWeight: "bold", color: "#ffffffff", marginBottom: 10, marginTop: 10 },
  helperText: { fontSize: 16, color: "#ffffffff", marginBottom: 10 },
  
  inputContainer: { marginBottom: 15 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#ffffffff", marginBottom: 5 },
  textInput: { backgroundColor: "#FFF", borderColor: "#CCC", borderWidth: 1, borderRadius: 10, padding: 12, color: "#333" },
  
  // Estilo para campos bloqueados (Grisáceo)
  disabledInput: { backgroundColor: "#E0E0E0", color: "#555" },

  divider: { height: 1, backgroundColor: "#DDD", marginVertical: 15 },

  listContainer: { backgroundColor: "#FFF", borderRadius: 10, borderWidth: 1, borderColor: "#DDD", overflow: "hidden" },
  permisoRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 15, borderBottomWidth: 1, borderBottomColor: "#EEE" },
  permisoText: { fontSize: 15, color: "#333", flex: 1 },

  saveButton: { marginTop: 25, backgroundColor: "#006480", padding: 15, borderRadius: 25, alignItems: "center" },
  saveButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },
});