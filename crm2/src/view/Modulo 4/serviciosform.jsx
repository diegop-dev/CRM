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
const CATEGORIA_DATA = ["Consultoría", "Marketing", "Ingeniería", "Soporte", "Desarrollo"];
const MONEDA_DATA = ["MXN", "USD"];
const ESTADO_DATA = ["Activo", "Inactivo"];

// Ajustes para Web
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

// ------------------ COMPONENTE FILEINPUT ------------------

const FileInput = React.memo(
  ({ label, fileName, fileUrl, editable, modo, onSelectFile, onTouchDisabled, onViewFile }) => {
    const isFilePresent = !!(fileName || fileUrl);
    
    let displayValue = "Sin archivo adjunto";
    if (fileName) displayValue = fileName;
    else if (fileUrl) displayValue = "Archivo Subido (Click para ver)";
    else if (editable) displayValue = "Seleccionar PDF...";

    // ACCIÓN DEL BOTÓN SUBIR / REEMPLAZAR
    const handleSelectPress = () => {
      if (modo === "editar") {
          // En lugar de Alert, podríamos usar un callback para mostrar el modal global,
          // pero como este componente es "tonto", simplemente deshabilitamos la acción visualmente o no hacemos nada.
          // Si quieres mostrar el mensaje, deberías pasar una función `onError` desde el padre.
          return; 
      }
      if (!editable) return onTouchDisabled();
      onSelectFile();
    };

    // VISUALIZAR PDF
    const handleViewPress = () => {
      if (onViewFile) {
        onViewFile(fileUrl || null);
      }
    };

    // Anchos responsivos
    let inputWidth = '100%';
    // Nota: En modo editar no se permite reemplazar, así que solo mostramos Ver si existe.
    const canUpload = editable && modo !== "editar";

    if (isFilePresent && canUpload) inputWidth = '38%';
    else if (isFilePresent) inputWidth = '65%';
    else if (canUpload) inputWidth = '68%';

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>

        <View style={styles.fileInputRow}>
          {/* Nombre del archivo */}
          <View
            style={[
              styles.textInput,
              styles.fileDisplay,
              { width: inputWidth },
              !editable && { width: "100%" },
            ]}
          >
            <Text
              numberOfLines={1}
              onPress={(!editable && onTouchDisabled) ? onTouchDisabled : (isFilePresent ? handleViewPress : undefined)}
              style={isFilePresent ? styles.fileTextActive : styles.textInput_placeholder}
            >
              {displayValue}
            </Text>
          </View>

          {/* VISUALIZAR */}
          {isFilePresent && (
            <TouchableOpacity style={[styles.fileButton, styles.viewButton]} onPress={handleViewPress}>
              <Text style={styles.fileButtonText}>Ver</Text>
            </TouchableOpacity>
          )}

          {/* SUBIR (Solo en Agregar) */}
          {canUpload && (
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

// ------------------ PASOS DEL FORMULARIO ------------------

const Paso1 = React.memo(
  ({ servicio, onChange, editable, onTouchDisabled, onCategoriaPress }) => (
    <>
      <FormInput
        label="Nombre del Servicio"
        value={servicio.nombreServicio}
        onChangeText={(v) => onChange("nombreServicio", v)}
        editable={editable}
        onTouchDisabled={onTouchDisabled}
      />

      <FormInput
        label="Descripción"
        value={servicio.descripcion}
        onChangeText={(v) => onChange("descripcion", v)}
        editable={editable}
        onTouchDisabled={onTouchDisabled}
        multiline
      />

      <SelectInput
        label="Categoría"
        value={servicio.categoria}
        onPress={onCategoriaPress}
        editable={editable}
        onTouchDisabled={onTouchDisabled}
      />

      <FormInput
        label="Precio"
        value={servicio.precio ? String(servicio.precio) : ""}
        onChangeText={(v) => onChange("precio", v)}
        keyboardType="numeric"
        editable={editable}
        onTouchDisabled={onTouchDisabled}
      />
    </>
  )
);

const Paso2 = React.memo(
  ({
    servicio,
    onChange,
    onGuardar,
    editable,
    modo,
    onTouchDisabled,
    onMonedaPress,
    onEstadoPress,
    onResponsablePress,
    onFileSelect,
    onViewFile,
  }) => (
    <>
      <SelectInput
        label="Moneda"
        value={servicio.moneda}
        onPress={onMonedaPress}
        editable={editable}
        onTouchDisabled={onTouchDisabled}
      />

      <FormInput
        label="Duración Estimada"
        value={servicio.duracionEstimada}
        onChangeText={(v) => onChange("duracionEstimada", v)}
        editable={editable}
        onTouchDisabled={onTouchDisabled}
      />

      <SelectInput
        label="Estado"
        value={servicio.estado}
        onPress={onEstadoPress}
        editable={editable}
        onTouchDisabled={onTouchDisabled}
      />

      <SelectInput
        label="Responsable"
        value={servicio.responsableNombre}
        onPress={onResponsablePress}
        editable={editable}
        onTouchDisabled={onTouchDisabled}
      />

      <FormInput
        label="Notas Internas"
        value={servicio.notasInternas}
        onChangeText={(v) => onChange("notasInternas", v)}
        editable={editable}
        onTouchDisabled={onTouchDisabled}
        multiline
      />

      {/* ARCHIVO */}
      <FileInput
        label="Documento (PDF)"
        fileName={servicio.archivo?.name}
        fileUrl={typeof servicio.archivo === "string" ? servicio.archivo : null}
        editable={editable}
        modo={modo}
        onSelectFile={onFileSelect}
        onTouchDisabled={onTouchDisabled}
        onViewFile={onViewFile}
      />

      {editable && (
        <TouchableOpacity style={styles.saveButton} onPress={onGuardar}>
          <Text style={styles.saveButtonText}>
            {modo === "editar" ? "Guardar Cambios" : "Guardar Servicio"}
          </Text>
        </TouchableOpacity>
      )}
    </>
  )
);


// ------------------ COMPONENTE PRINCIPAL ------------------

export default function ServiciosFormView({
  servicio = {},
  modo = "agregar",
  onTouchDisabled,
  onChange,
  onGuardar,
  empleados = [],
  onFileSelect,
  onViewFile,
}) {
  const [step, setStep] = useState(1);
  const editable = modo !== "consultar";

  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showMonedaModal, setShowMonedaModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [showResponsableModal, setShowResponsableModal] = useState(false);

  // Mapeo de empleados
  const RESPONSABLE_DATA = empleados.map((emp) => ({
    label: `${emp.nombres} ${emp.apellido_paterno}`,
    value: emp.id_empleado,
  }));
  const RESPONSABLE_LABELS = RESPONSABLE_DATA.map((r) => r.label);

  // Estados temporales
  const [tempCategoria, setTempCategoria] = useState("");
  const [tempMoneda, setTempMoneda] = useState("");
  const [tempEstado, setTempEstado] = useState("");
  const [tempResponsableLabel, setTempResponsableLabel] = useState("");

  // Funciones de apertura
  const openCategoriaModal = () => {
    setTempCategoria(servicio.categoria || CATEGORIA_DATA[0]);
    setShowCategoriaModal(true);
  };

  const openMonedaModal = () => {
    setTempMoneda(servicio.moneda || MONEDA_DATA[0]);
    setShowMonedaModal(true);
  };

  const openEstadoModal = () => {
    setTempEstado(servicio.estado || ESTADO_DATA[0]);
    setShowEstadoModal(true);
  };

  const openResponsableModal = () => {
    const currentLabel = servicio.responsableNombre || (RESPONSABLE_LABELS.length > 0 ? RESPONSABLE_LABELS[0] : "");
    setTempResponsableLabel(currentLabel);
    setShowResponsableModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView 
        contentContainerStyle={{ paddingHorizontal: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        {step === 1 && (
          <Paso1
            servicio={servicio}
            onChange={onChange}
            editable={editable}
            onTouchDisabled={onTouchDisabled}
            onCategoriaPress={() =>
              editable ? openCategoriaModal() : onTouchDisabled()
            }
          />
        )}

        {step === 2 && (
          <Paso2
            servicio={servicio}
            onChange={onChange}
            onGuardar={onGuardar}
            editable={editable}
            modo={modo}
            onTouchDisabled={onTouchDisabled}
            onMonedaPress={() => (editable ? openMonedaModal() : onTouchDisabled())}
            onEstadoPress={() => (editable ? openEstadoModal() : onTouchDisabled())}
            onResponsablePress={() =>
              editable ? openResponsableModal() : onTouchDisabled()
            }
            onFileSelect={onFileSelect}
            onViewFile={onViewFile}
          />
        )}

        <View style={styles.buttonRow}>
          {step > 1 && (
            <TouchableOpacity
              style={[styles.navButton, styles.backButton]}
              onPress={() => setStep(step - 1)}
            >
              <Text style={styles.navButtonText}>Regresar</Text>
            </TouchableOpacity>
          )}

          {step < 2 && (
            <TouchableOpacity
              style={[styles.navButton, styles.nextButton]}
              onPress={() => setStep(step + 1)}
            >
              <Text style={styles.navButtonText}>Continuar</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* ------------ MODALES (TARJETAS FLOTANTES) ------------ */}

      {/* CATEGORIA */}
      <Modal visible={showCategoriaModal} animationType="fade" transparent onRequestClose={() => setShowCategoriaModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowCategoriaModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Categoría</Text>
                    <TouchableOpacity onPress={() => { onChange("categoria", tempCategoria); setShowCategoriaModal(false); }}>
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

      {/* MONEDA */}
      <Modal visible={showMonedaModal} animationType="fade" transparent onRequestClose={() => setShowMonedaModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowMonedaModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Moneda</Text>
                    <TouchableOpacity onPress={() => { onChange("moneda", tempMoneda); setShowMonedaModal(false); }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsPickerContainer}>
                    <TumblerWheel data={MONEDA_DATA} value={tempMoneda} onValueChange={setTempMoneda} />
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

      {/* RESPONSABLE */}
      <Modal visible={showResponsableModal} animationType="fade" transparent onRequestClose={() => setShowResponsableModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowResponsableModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Responsable</Text>
                    <TouchableOpacity onPress={() => {
                        const selected = RESPONSABLE_DATA.find((r) => r.label === tempResponsableLabel) || RESPONSABLE_DATA[0];
                        if (selected) {
                            onChange("idResponsable", selected.value);
                            onChange("responsableNombre", selected.label);
                        }
                        setShowResponsableModal(false);
                    }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsPickerContainer}>
                    <TumblerWheel data={RESPONSABLE_LABELS} value={tempResponsableLabel} onValueChange={setTempResponsableLabel} />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

// ------------------ ESTILOS ------------------

const styles = StyleSheet.create({
  inputContainer: { marginBottom: 15 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#ffffffff", marginBottom: 5 },

  textInput: {
    width: "100%",
    backgroundColor: "#FFF",
    borderColor: "#CCC",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    fontSize: 15,
    color: "#333",
  },

  textInput_value: { color: "#333", fontSize: 15 },
  textInput_placeholder: { color: "#999", fontSize: 15 },
  lockedInput: { backgroundColor: "#e6e6e6" },
  multilineInput: { height: 100, textAlignVertical: 'top' },

  // botones navegación:
  buttonRow: { flexDirection: "row", marginTop: 20, marginBottom: 40 },
  navButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
    marginHorizontal: 5,
  },
  nextButton: { backgroundColor: "#006480" },
  backButton: { backgroundColor: "#77a7ab" },
  navButtonText: { color: "#FFF", fontWeight: "600" },

  saveButton: {
    marginTop: 20,
    backgroundColor: "#006480",
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: "center",
  },
  saveButtonText: { color: "#FFF", fontSize: 16, fontWeight: "600" },

  // FileInput
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
  viewButton: { backgroundColor: "#0080ff", width: '28%' },
  uploadButton: { backgroundColor: "#77a7ab", width: '28%' },
  replaceButton: { backgroundColor: "#d92a1c", width: '28%' },
  fileButtonText: { color: "#FFF", fontSize: 12, fontWeight: "bold" },

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
    maxWidth: 400,
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
