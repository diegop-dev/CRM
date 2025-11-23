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
const CATEGORIA_DATA = ["Acta de Nacimiento", "RFC", "Curp", "NSS", "Contrato", "Otro"];
const ESTADO_DATA = ["VIGENTE", "VENCIDO", "ARCHIVADO", "Actualizado", "No Actualizado"];

const ITEM_HEIGHT = 44;
const CONTAINER_HEIGHT = 220;
const WHEEL_PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;

// ------------------ INPUTS REUTILIZABLES ------------------

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

// ------------------ COMPONENTE FILEINPUT (CORREGIDO) ------------------

const FileInput = React.memo(
  ({ label, fileName, fileUrl, editable, modo, onSelectFile, onTouchDisabled, onViewFile }) => {
    const isFilePresent = !!(fileName || fileUrl);
    
    // Permitimos subir/reemplazar tanto en 'agregar' como en 'editar'.
    const showUploadButton = (modo === 'agregar' || modo === 'editar'); 

    let displayValue = "Sin archivo adjunto";
    if (fileName) displayValue = fileName; // Archivo local nuevo
    else if (fileUrl) displayValue = "Archivo Guardado (Click para ver)"; // Archivo remoto
    else if (showUploadButton) displayValue = "Seleccionar PDF...";

    // Acción Visualizar
    const handleViewPress = () => {
      if (fileUrl && onViewFile) {
        onViewFile(fileUrl);
      } else if (fileName) {
        Alert.alert("Info", "Este archivo es local. Debe guardarse para visualizarlo.");
      }
    };

    // Acción Subir
    const handleSelectPress = () => {
        onSelectFile();
    };

    // Calculamos anchos para estética
    let inputWidth = '100%';
    
    if (isFilePresent && showUploadButton) {
        // Hay archivo Y se puede reemplazar (Editar/Agregar) -> 2 botones
        inputWidth = '38%'; 
    } else if (isFilePresent) {
        // Solo ver -> 1 botón grande
        inputWidth = '65%'; 
    } else if (showUploadButton) {
        // No hay archivo, solo botón subir -> 1 botón grande
        inputWidth = '70%'; 
    }

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>

        <View style={styles.fileInputRow}>
          {/* Caja de Texto (Display) */}
          <View
            style={[
              styles.textInput,
              styles.fileDisplay,
              { width: inputWidth },
              !editable && { width: "100%", borderRightWidth: 0 }
            ]}
          >
            <Text
              numberOfLines={1}
              onPress={(isFilePresent) ? handleViewPress : undefined}
              style={isFilePresent ? styles.fileTextActive : styles.textInput_placeholder}
            >
              {displayValue}
            </Text>
          </View>

          {/* 1. BOTÓN VISUALIZAR (Siempre que haya archivo, local o remoto) */}
          {isFilePresent && (
            <TouchableOpacity style={[styles.fileButton, styles.viewButton]} onPress={handleViewPress}>
              <Text style={styles.fileButtonText}>Visualizar</Text>
            </TouchableOpacity>
          )}

          {/* 2. BOTÓN SUBIR/REEMPLAZAR (En Agregar o Editar) */}
          {showUploadButton && (
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

  // Mapeo de empleados
  const EMPLEADO_DATA = empleados.map((emp) => ({
    label: `${emp.nombres} ${emp.apellido_paterno}`,
    value: emp.id_empleado,
  }));
  const EMPLEADO_LABELS = EMPLEADO_DATA.map((r) => r.label);

  // Variables temporales para los modales
  const [tempCategoria, setTempCategoria] = useState("");
  const [tempEstado, setTempEstado] = useState("");
  const [tempEmpleadoLabel, setTempEmpleadoLabel] = useState("");

  // Funciones para abrir modales e inicializar valor temporal
  const openCategoriaModal = () => {
    setTempCategoria(documento.tipoDocumento || CATEGORIA_DATA[0]);
    setShowCategoriaModal(true);
  };

  const openEstadoModal = () => {
    setTempEstado(documento.estado || ESTADO_DATA[0]);
    setShowEstadoModal(true);
  };

  const openEmpleadoModal = () => {
    // Buscamos el nombre actual o el primero de la lista
    const currentLabel = documento.responsableNombre || (EMPLEADO_LABELS.length > 0 ? EMPLEADO_LABELS[0] : "");
    setTempEmpleadoLabel(currentLabel); 
    setShowEmpleadoModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}>
        
        <FormInput
          label="Identificador Único"
          value={documento.nombreDocumento} 
          onChangeText={(v) => onChange("nombreDocumento", v)} 
          editable={editable}
          onTouchDisabled={onTouchDisabled}
        />
 
        <SelectInput
          label="Tipo de Documento"
          value={documento.tipoDocumento} 
          onPress={() => editable ? openCategoriaModal() : onTouchDisabled()}
          editable={editable}
          onTouchDisabled={onTouchDisabled}
        />

        <FormInput
          label="Descripción"
          value={documento.descripcion}
          onChangeText={(v) => onChange("descripcion", v)}
          editable={editable}
          onTouchDisabled={onTouchDisabled}
          multiline
        />

        {/* SELECTOR DE RESPONSABLE */}
        <SelectInput
          label="Responsable"
          value={documento.responsableNombre}
          onPress={() => editable ? openEmpleadoModal() : onTouchDisabled()}
          editable={editable}
          onTouchDisabled={onTouchDisabled}
        />

        <SelectInput
          label="Estado"
          value={documento.estado}
          onPress={() => editable ? openEstadoModal() : onTouchDisabled()}
          editable={editable}
          onTouchDisabled={onTouchDisabled}
        />

        {/* FILE INPUT */}
        <FileInput
          label="Archivo Adjunto"
          fileName={documento.archivo?.name}
          fileUrl={typeof documento.archivo === "string" ? documento.archivo : null}
          editable={editable}
          modo={modo} 
          onSelectFile={onFileSelect}
          onTouchDisabled={onTouchDisabled}
          onViewFile={onViewFile}
        />

        {editable && (
          <TouchableOpacity style={styles.saveButton} onPress={onGuardar}>
            <Text style={styles.saveButtonText}>
              {modo === "editar" ? "Guardar Cambios" : "Guardar Documento"}
            </Text>
          </TouchableOpacity>
        )}

      </ScrollView>

      {/* --- MODALES --- */}
      
      {/* CATEGORIA */}
      <Modal visible={showCategoriaModal} transparent>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowCategoriaModal(false)} />
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => { onChange("tipoDocumento", tempCategoria); setShowCategoriaModal(false); }}>
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jsPickerContainer}>
            <TumblerWheel data={CATEGORIA_DATA} value={tempCategoria} onValueChange={setTempCategoria} />
            <View style={styles.pickerHighlight} pointerEvents="none" />
          </View>
        </View>
      </Modal>

      {/* ESTADO */}
      <Modal visible={showEstadoModal} transparent>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowEstadoModal(false)} />
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => { onChange("estado", tempEstado); setShowEstadoModal(false); }}>
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jsPickerContainer}>
            <TumblerWheel data={ESTADO_DATA} value={tempEstado} onValueChange={setTempEstado} />
            <View style={styles.pickerHighlight} pointerEvents="none" />
          </View>
        </View>
      </Modal>

      {/* EMPLEADO */}
      <Modal visible={showEmpleadoModal} transparent>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowEmpleadoModal(false)} />
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => {
                // Buscamos el objeto completo basado en el nombre seleccionado
                const selected = EMPLEADO_DATA.find((r) => r.label === tempEmpleadoLabel) || EMPLEADO_DATA[0];
                if (selected) {
                    onChange("idResponsable", selected.value); // Guardamos el ID
                    onChange("responsableNombre", selected.label); // Guardamos el Nombre
                }
                setShowEmpleadoModal(false);
              }}>
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jsPickerContainer}>
            <TumblerWheel 
                data={EMPLEADO_LABELS} 
                value={tempEmpleadoLabel} 
                onValueChange={setTempEmpleadoLabel} 
            />
            <View style={styles.pickerHighlight} pointerEvents="none" />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: { marginBottom: 15,  },
  inputLabel: { fontSize: 14, fontWeight: "bold", color: "#ffffffff", marginBottom: 5 },
  textInput: { backgroundColor: "#FFF", padding: 12, borderRadius: 10, borderColor: "#CCC", borderWidth: 1, color: "#333" },
  textInput_value: { color: "#333", fontSize: 16 },
  textInput_placeholder: { color: "#999", fontSize: 16 },
  multilineInput: { height: 100 },
  
  saveButton: {
    marginTop: 20,
    backgroundColor: "#006480",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  saveButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },

  // FileInput Styles
  fileInputRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  fileDisplay: { flex: 1, justifyContent: "center", paddingHorizontal: 15, height: 50 },
  fileTextActive: { color: "#006480", fontSize: 14, fontWeight: "500" },
  
  fileButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fileButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 12 },
  
  // Colores de botones
  viewButton: { backgroundColor: "#0080ff", width: '28%' },
  replaceButton: { backgroundColor: "#d92a1c", width: '28%' },
  uploadButton: { backgroundColor: "#77a7ab", width: '28%' },

  // Picker Styles
  pickerBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)" },
  pickerSheet: { position: "absolute", bottom: 0, left: 0, right: 0, backgroundColor: "#ffffff", borderTopLeftRadius: 20, borderTopRightRadius: 20, maxHeight: 300, paddingBottom: 20 },
  pickerHeader: { padding: 15, alignItems: "flex-end" },
  pickerButtonText: { color: "#006480", fontWeight: "bold", fontSize: 16 },
  jsPickerContainer: { height: CONTAINER_HEIGHT, overflow: "hidden" },
  jsDatePickerColumn: { width: "100%" },
  pickerItem: { height: ITEM_HEIGHT, justifyContent: "center", alignItems: "center" },
  pickerItemText: { fontSize: 20, color: "#333" },
  pickerHighlight: { position: "absolute", left: 0, right: 0, height: ITEM_HEIGHT, top: CONTAINER_HEIGHT / 2 - ITEM_HEIGHT / 2, borderTopWidth: 2, borderBottomWidth: 2, borderColor: "#006480" },
});