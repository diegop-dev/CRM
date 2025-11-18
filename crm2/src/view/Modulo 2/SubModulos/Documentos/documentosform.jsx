import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- CONSTANTES ---
const CATEGORIA_DATA = ["Acta de Nacimiento", "RFC", "Curp", "NSS"];
const ESTADO_DATA = ["Actualizado", "No Actualizado"];

const ITEM_HEIGHT = 44;
const CONTAINER_HEIGHT = 220;
const WHEEL_PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;

// ------------------ INPUTS ------------------

const FormInput = React.memo(
  ({ label, value, onChangeText, editable = true, multiline = false, onTouchDisabled, ...props }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>

      <TouchableOpacity
        activeOpacity={editable ? 1 : 0.8}
        onPress={!editable ? onTouchDisabled : undefined}
      >
        <TextInput
          style={[
            styles.textInput,
            multiline && styles.multilineInput,
            !editable && { backgroundColor: "#FFFFFF" },
          ]}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          {...props}
        />
      </TouchableOpacity>
    </View>
  )
);

const SelectInput = React.memo(({ label, value, onPress, editable = true, onTouchDisabled }) => (
  <TouchableOpacity onPress={editable ? onPress : onTouchDisabled} activeOpacity={editable ? 0.8 : 0.7}>
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>

      <View
        style={[
          styles.textInput,
          { justifyContent: "center" },
          !editable && { backgroundColor: "#FFFFFF" },
        ]}
      >
        <Text style={value ? styles.textInput_value : styles.textInput_placeholder}>
          {value || "Seleccione..."}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
));

// ------------------ COMPONENTE FILEINPUT (MODIFICADO) ------------------

const FileInput = React.memo(
  ({ label, fileName, fileUrl, editable, modo, onSelectFile, onTouchDisabled, onViewFile }) => {
    const isFilePresent = !!(fileName || fileUrl);
    const displayValue =
      fileName ||
      (fileUrl ? "Archivo Subido (Click para ver)" : "Seleccionar PDF...");

    // ACCIÓN DEL BOTÓN SUBIR / REEMPLAZAR
    const handleSelectPress = () => {
      // A diferencia de Servicios, aquí SÍ permitimos reemplazar el archivo en modo editar.
      if (!editable) return onTouchDisabled();
      onSelectFile();
    };

    // 🔹 VISUALIZAR PDF
    const handleViewPress = () => {
      if (fileUrl) {
        onViewFile(fileUrl);
      } else if (fileName) {
        Alert.alert("Atención", "Este archivo aún no está guardado en el servidor.");
      }
    };

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>

        <View style={styles.fileInputRow}>
          {/* Nombre del archivo */}
          <View
            style={[
              styles.textInput,
              styles.fileDisplay,
              editable && isFilePresent ? { width: "40%" } : { flex: 1 },
              !editable && { width: "100%" },
            ]}
          >
            <Text
              numberOfLines={1}
              onPress={!editable ? onTouchDisabled : undefined}
              style={isFilePresent ? styles.fileTextActive : styles.textInput_placeholder}
            >
              {displayValue}
            </Text>
          </View>

          {/* VISUALIZAR */}
          {isFilePresent && (
            <TouchableOpacity style={[styles.fileButton, styles.viewButton]} onPress={handleViewPress}>
              <Text style={styles.fileButtonText}>Visualizar</Text>
            </TouchableOpacity>
          )}

          {/* SUBIR / REEMPLAZAR */}
          {editable && (
            <TouchableOpacity
              style={[
                styles.fileButton,
                isFilePresent ? styles.replaceButton : styles.uploadButton,
              ]}
              onPress={handleSelectPress}
            >
              <Text style={styles.fileButtonText}>
                {isFilePresent ? "Reemplazar" : "Subir PDF"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);

// ------------------ PICKER JS ------------------

const JSPickerItem = ({ label }) => (
  <View style={styles.pickerItem}>
    <Text style={styles.pickerItemText}>{label}</Text>
  </View>
);

const TumblerWheel = ({ data, onValueChange, value }) => {
  const ref = React.useRef(null);
  let index = data.indexOf(value);
  if (index < 0) index = 0;

  const offset = index * ITEM_HEIGHT;

  const handleScroll = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    const i = Math.round(y / ITEM_HEIGHT);

    if (i >= 0 && i < data.length) {
      onValueChange(data[i]);
    }
  };

  return (
    <ScrollView
      ref={ref}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      onMomentumScrollEnd={handleScroll}
      contentOffset={{ y: offset }}
      contentContainerStyle={{ paddingTop: WHEEL_PADDING, paddingBottom: WHEEL_PADDING }}
      style={styles.jsDatePickerColumn}
    >
      {data.map((item, idx) => (
        <JSPickerItem key={idx} label={item} />
      ))}
    </ScrollView>
  );
};

// ------------------ PRINCIPAL ------------------

export default function DocumentosFormView({
  documento = {},
  modo = "agregar",
  onTouchDisabled,
  onChange,
  onGuardar,
  empleados = [],
  onFileSelect,
  onViewFile,
}) {
  const editable = modo !== "consultar";

  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [showEmpleadoModal, setShowEmpleadoModal] = useState(false);

  const EMPLEADO_DATA = empleados.map((emp) => ({
    label: `${emp.nombres} ${emp.apellido_paterno}`,
    value: emp.id_empleado,
  }));
  const EMPLEADO_LABELS = EMPLEADO_DATA.map((r) => r.label);

  const [tempCategoria, setTempCategoria] = useState("");
  const [tempEstado, setTempEstado] = useState("");
  const [tempEmpleado, setTempEmpleado] = useState(null);

  const openCategoriaModal = () => {
    setTempCategoria(documento.categoria || CATEGORIA_DATA[0]);
    setShowCategoriaModal(true);
  };

  const openEstadoModal = () => {
    setTempEstado(documento.estado || ESTADO_DATA[0]);
    setShowEstadoModal(true);
  };

  const openEmpleadoModal = () => {
    const label = documento.empleadoNombre || EMPLEADO_LABELS[0];
    const value =
      documento.id_empleado ||
      (EMPLEADO_DATA.length > 0 ? EMPLEADO_DATA[0].value : null);

    setTempEmpleado({ label, value });
    setShowEmpleadoModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        
        {/* CAMPOS DEL FORMULARIO DE DOCUMENTOS */}

        <FormInput
          label="Identificador Único"
          value={documento.indentificador_unico}
          onChangeText={(v) => onChange("indentificador_unico", v)}
          editable={editable}
          onTouchDisabled={onTouchDisabled}
        />

        <FormInput
          label="Descripción"
          value={documento.descripción}
          onChangeText={(v) => onChange("descripción", v)}
          editable={editable}
          onTouchDisabled={onTouchDisabled}
          multiline
        />

        <SelectInput
          label="Categoría"
          value={documento.categoria}
          onPress={() =>
            editable ? openCategoriaModal() : onTouchDisabled()
          }
          editable={editable}
          onTouchDisabled={onTouchDisabled}
        />

        <SelectInput
          label="Empleado"
          value={documento.empleadoNombre} // Asumimos que guardas el nombre para visualización
          onPress={() =>
            editable ? openEmpleadoModal() : onTouchDisabled()
          }
          editable={editable}
          onTouchDisabled={onTouchDisabled}
        />

        <SelectInput
          label="Estado"
          value={documento.estado}
          onPress={() => (editable ? openEstadoModal() : onTouchDisabled())}
          editable={editable}
          onTouchDisabled={onTouchDisabled}
        />

        {/* ARCHIVO */}
        <FileInput
          label="Archivo (PDF)"
          fileName={documento.archivo?.name}
          fileUrl={typeof documento.archivo === "string" ? documento.archivo : null}
          editable={editable}
          modo={modo}
          onSelectFile={onFileSelect}
          onTouchDisabled={onTouchDisabled}
          onViewFile={onViewFile}
        />

        {/* BOTÓN GUARDAR */}
        {editable && (
          <TouchableOpacity style={styles.saveButton} onPress={onGuardar}>
            <Text style={styles.saveButtonText}>
              {modo === "editar" ? "Guardar Cambios" : "Guardar Documento"}
            </Text>
          </TouchableOpacity>
        )}

      </ScrollView>

      {/* ------------ MODALES ------------ */}

      {/* CATEGORIA */}
      <Modal visible={showCategoriaModal} transparent>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowCategoriaModal(false)} />

        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity
              onPress={() => {
                onChange("categoria", tempCategoria);
                setShowCategoriaModal(false);
              }}
            >
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.jsPickerContainer}>
            <TumblerWheel
              data={CATEGORIA_DATA}
              value={tempCategoria}
              onValueChange={setTempCategoria}
            />

            <View style={styles.pickerHighlight} pointerEvents="none" />
          </View>
        </View>
      </Modal>


      {/* ESTADO */}
      <Modal visible={showEstadoModal} transparent>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowEstadoModal(false)} />

        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity
              onPress={() => {
                onChange("estado", tempEstado);
                setShowEstadoModal(false);
              }}
            >
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.jsPickerContainer}>
            <TumblerWheel
              data={ESTADO_DATA}
              value={tempEstado}
              onValueChange={setTempEstado}
            />

            <View style={styles.pickerHighlight} pointerEvents="none" />
          </View>
        </View>
      </Modal>

      {/* EMPLEADO */}
      <Modal visible={showEmpleadoModal} transparent>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowEmpleadoModal(false)} />

        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity
              onPress={() => {
                const selected =
                  EMPLEADO_DATA.find((r) => r.label === tempEmpleado?.label) ||
                  EMPLEADO_DATA[0];

                onChange("id_empleado", selected.value);
                onChange("empleadoNombre", selected.label); // Guardamos el nombre para mostrar

                setShowEmpleadoModal(false);
              }}
            >
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.jsPickerContainer}>
            <TumblerWheel
              data={EMPLEADO_LABELS}
              value={tempEmpleado?.label}
              onValueChange={(label) => setTempEmpleado({ ...tempEmpleado, label })}
            />

            <View style={styles.pickerHighlight} pointerEvents="none" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ------------------ ESTILOS ------------------

const styles = StyleSheet.create({
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#ec0c0cff", marginBottom: 10 },

  textInput: {
    width: "100%",
    backgroundColor: "#FFF",
    borderColor: "#AAA",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    fontSize: 16,
    color: "#333",
  },

  textInput_value: {
    color: "#333",
    fontSize: 16,
  },

  textInput_placeholder: {
    color: "#999",
    fontSize: 16,
  },

  multilineInput: { height: 100 },

  // botones navegación (ELIMINADOS)
  // buttonRow: { flexDirection: "row", marginTop: 20, marginBottom: 40 },
  // navButton: { ... },
  // nextButton: { ... },
  // backButton: { ... },
  // navButtonText: { ... },

  saveButton: {
    marginTop: 20,
    backgroundColor: "#006480",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },

  // FileInput
  fileInputRow: { flexDirection: "row", alignItems: "center" },
  fileDisplay: { paddingRight: 10 },
  fileTextActive: { color: "#333", fontSize: 15 },

  fileButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 8,
  },
  viewButton: { backgroundColor: "#0080ff" },
  uploadButton: { backgroundColor: "green" },
  replaceButton: { backgroundColor: "#f31212ff" },
  fileButtonText: { color: "#FFF", fontSize: 13 },

  // Picker
  pickerBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.2)" },
  pickerSheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    paddingBottom: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerHeader: {
    padding: 15,
    alignItems: "flex-end",
  },
  pickerButtonText: { color: "#006480", fontWeight: "bold", fontSize: 16 },

  jsPickerContainer: {
    height: CONTAINER_HEIGHT,
    overflow: "hidden",
  },
  jsDatePickerColumn: {
    width: "100%",
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  pickerItemText: {
    fontSize: 20,
    color: "#333",
  },
  pickerHighlight: {
    position: "absolute",
    left: 0,
    right: 0,
    height: ITEM_HEIGHT,
    top: CONTAINER_HEIGHT / 2 - ITEM_HEIGHT / 2,
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderColor: "#006480",
  },
});
