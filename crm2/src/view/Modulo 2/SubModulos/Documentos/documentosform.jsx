import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- CONSTANTES ---
const CATEGORIA_DATA = ["Acta de Nacimiento", "RFC", "Curp", "NSS", "Contrato", "Otro"];
const ESTADO_DATA = ["VIGENTE", "VENCIDO", "ARCHIVADO", "Actualizado", "No Actualizado"];

// Ajustes de altura para web
const ITEM_HEIGHT = 40;
const CONTAINER_HEIGHT = 160;
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
            !editable && styles.lockedInput,
          ]}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          pointerEvents={!editable ? 'none' : 'auto'} 
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
          !editable && styles.lockedInput,
        ]}
      >
        <Text style={value ? styles.textInput_value : styles.textInput_placeholder}>
          {value || "Seleccione..."}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
));

// ------------------ COMPONENTE FILEINPUT (OPTIMIZADO) ------------------

const FileInput = React.memo(
  ({ label, fileName, fileUrl, editable, modo, onSelectFile, onTouchDisabled, onViewFile }) => {
    const isFilePresent = !!(fileName || fileUrl);
    
    // Permitimos subir/reemplazar en 'agregar' o 'editar'
    const showUploadButton = (modo === 'agregar' || modo === 'editar'); 

    let displayValue = "Sin archivo adjunto";
    if (fileName) displayValue = fileName; // Archivo local nuevo
    else if (fileUrl) displayValue = "Archivo Guardado (Click para ver)"; // Archivo remoto
    else if (showUploadButton) displayValue = "Seleccionar PDF...";

    // Acción Visualizar
    const handleViewPress = () => {
      if (onViewFile) {
        onViewFile(fileUrl || null); // null indica archivo local
      }
    };

    // Acción Subir
    const handleSelectPress = () => {
        onSelectFile();
    };

    // Anchos responsivos
    let inputWidth = '100%';
    
    if (isFilePresent && showUploadButton) {
        inputWidth = '38%'; 
    } else if (isFilePresent) {
        inputWidth = '65%'; 
    } else if (showUploadButton) {
        inputWidth = '68%'; 
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
              !editable && { width: "100%" }
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

          {/* 1. BOTÓN VISUALIZAR */}
          {isFilePresent && (
            <TouchableOpacity style={[styles.fileButton, styles.viewButton]} onPress={handleViewPress}>
              <Text style={styles.fileButtonText}>Ver</Text>
            </TouchableOpacity>
          )}

          {/* 2. BOTÓN SUBIR/REEMPLAZAR */}
          {showUploadButton && (
            <TouchableOpacity
              style={[
                styles.fileButton,
                isFilePresent ? styles.replaceButton : styles.uploadButton,
              ]}
              onPress={handleSelectPress}
            >
              <Text style={styles.fileButtonText}>
                {isFilePresent ? "Cambiar" : "Subir"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);

// ------------------ PICKER JS (WEB FRIENDLY) ------------------

const JSPickerItem = ({ label, onPress, active }) => (
  <TouchableOpacity 
    style={styles.pickerItem} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[
      styles.pickerItemText, 
      active && styles.pickerItemTextActive
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const TumblerWheel = ({ data, onValueChange, value }) => {
  const ref = useRef(null);
  let index = data.indexOf(value);
  if (index < 0) index = 0;
  
  useEffect(() => {
    if (ref.current) {
        setTimeout(() => {
            ref.current.scrollTo({ y: index * ITEM_HEIGHT, animated: false });
        }, 100);
    }
  }, []);

  const handleScroll = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    const i = Math.round(y / ITEM_HEIGHT);
    if (i >= 0 && i < data.length) {
        const newValue = data[i];
        if (newValue !== value) onValueChange(newValue);
    }
  };

  const handleItemPress = (item, idx) => {
    onValueChange(item);
    if (ref.current) {
      ref.current.scrollTo({ y: idx * ITEM_HEIGHT, animated: true });
    }
  };

  return (
    <View style={styles.wheelContainer}>
        <ScrollView
        ref={ref}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScroll}
        onScrollEndDrag={handleScroll}
        contentContainerStyle={{ paddingTop: WHEEL_PADDING, paddingBottom: WHEEL_PADDING }}
        style={styles.jsDatePickerColumn}
        >
        {data.map((item, idx) => (
            <JSPickerItem 
                key={idx} 
                label={item} 
                active={item === value}
                onPress={() => handleItemPress(item, idx)}
            />
        ))}
        </ScrollView>
    </View>
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

  // Variables temporales
  const [tempCategoria, setTempCategoria] = useState("");
  const [tempEstado, setTempEstado] = useState("");
  const [tempEmpleadoLabel, setTempEmpleadoLabel] = useState("");

  // Funciones para abrir modales
  const openCategoriaModal = () => {
    setTempCategoria(documento.tipoDocumento || CATEGORIA_DATA[0]);
    setShowCategoriaModal(true);
  };

  const openEstadoModal = () => {
    setTempEstado(documento.estado || ESTADO_DATA[0]);
    setShowEstadoModal(true);
  };

  const openEmpleadoModal = () => {
    const currentLabel = documento.responsableNombre || (EMPLEADO_LABELS.length > 0 ? EMPLEADO_LABELS[0] : "");
    setTempEmpleadoLabel(currentLabel); 
    setShowEmpleadoModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        
        <FormInput
          label="Identificador Único / Nombre"
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

      {/* --- MODALES (TARJETAS FLOTANTES) --- */}
      
      {/* CATEGORIA */}
      <Modal visible={showCategoriaModal} animationType="fade" transparent onRequestClose={() => setShowCategoriaModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowCategoriaModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Tipo de Documento</Text>
                    <TouchableOpacity onPress={() => { onChange("tipoDocumento", tempCategoria); setShowCategoriaModal(false); }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsPickerContainer}>
                    <TumblerWheel data={CATEGORIA_DATA} value={tempCategoria} onValueChange={setTempCategoria} />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
      </Modal>

      {/* ESTADO */}
      <Modal visible={showEstadoModal} animationType="fade" transparent onRequestClose={() => setShowEstadoModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowEstadoModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Estado</Text>
                    <TouchableOpacity onPress={() => { onChange("estado", tempEstado); setShowEstadoModal(false); }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsPickerContainer}>
                    <TumblerWheel data={ESTADO_DATA} value={tempEstado} onValueChange={setTempEstado} />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
      </Modal>

      {/* EMPLEADO */}
      <Modal visible={showEmpleadoModal} animationType="fade" transparent onRequestClose={() => setShowEmpleadoModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowEmpleadoModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Responsable</Text>
                    <TouchableOpacity onPress={() => {
                        const selected = EMPLEADO_DATA.find((r) => r.label === tempEmpleadoLabel) || EMPLEADO_DATA[0];
                        if (selected) {
                            onChange("idResponsable", selected.value);
                            onChange("responsableNombre", selected.label);
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
            </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: { marginBottom: 15 },
  inputLabel: { fontSize: 14, fontWeight: "bold", color: "#ffffffff", marginBottom: 5 },
  textInput: { backgroundColor: "#FFF", padding: 12, borderRadius: 10, borderColor: "#CCC", borderWidth: 1, color: "#333", fontSize: 15 },
  textInput_value: { color: "#333", fontSize: 15 },
  textInput_placeholder: { color: "#999", fontSize: 15 },
  lockedInput: { backgroundColor: "#e6e6e6" },
  multilineInput: { height: 100, textAlignVertical: 'top' },
  
  saveButton: {
    marginTop: 20,
    backgroundColor: "#006480",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  saveButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 16 },

  // FileInput Styles
  fileInputRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  fileDisplay: { flex: 1, justifyContent: "center", paddingHorizontal: 15, height: 50 },
  fileTextActive: { color: "#006480", fontSize: 14, fontWeight: "500" },
  
  fileButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
  },
  fileButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 12 },
  
  // Colores de botones
  viewButton: { backgroundColor: "#0080ff", width: '28%' },
  replaceButton: { backgroundColor: "#d92a1c", width: '28%' },
  uploadButton: { backgroundColor: "#77a7ab", width: '28%' },

  // --- ESTILOS PICKER (Tarjeta Flotante) ---
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: '90%',
    maxWidth: 400, // Límite ancho para PC
    paddingBottom: 20,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    overflow: 'hidden'
  },
  pickerHeader: {
    backgroundColor: '#F8F9FA',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderColor: '#EEEEEE',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#006480",
    fontWeight: "bold",
  },
  
  jsPickerContainer: {
    height: CONTAINER_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  wheelContainer: { flex: 1 },
  jsDatePickerColumn: { flex: 1, height: CONTAINER_HEIGHT },
  
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: 16,
    color: "#999",
  },
  pickerItemTextActive: {
    color: "#000",
    fontWeight: "600",
    fontSize: 17,
  },
  pickerHighlight: {
    position: 'absolute',
    top: '50%',
    left: 15,
    right: 15,
    height: ITEM_HEIGHT,
    marginTop: -ITEM_HEIGHT / 2,
    backgroundColor: 'rgba(119, 167, 171, 0.15)',
    borderRadius: 8,
    pointerEvents: 'none',
  },
});
