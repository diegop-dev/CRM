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
const CATEGORIA_DATA = ["Consultoría", "Marketing", "Ingeniería", "Soporte", "Desarrollo"];
const MONEDA_DATA = ["MXN", "USD"];
const ESTADO_DATA = ["Activo", "Inactivo"];

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

// ------------------ COMPONENTE FILEINPUT ------------------

const FileInput = React.memo(
  ({ label, fileName, fileUrl, editable, modo, onSelectFile, onTouchDisabled, onViewFile }) => {
    const isFilePresent = !!(fileName || fileUrl);
    const displayValue =
      fileName ||
      (fileUrl ? "Archivo Subido (Click para ver)" : "Seleccionar PDF...");

    // ACCIÓN DEL BOTÓN SUBIR / REEMPLAZAR
    const handleSelectPress = () => {
      //  Si estamos en editar → NO PERMITIR reemplazar
      if (modo === "editar") {
        Alert.alert(
          "Alerta",
          "Por seguridad de la empresa, no esta permitido remplazar el archivo de un servicio ya creado."
        );
        return;
      }

      //  Si estamos agregando → sí permite seleccionar archivo
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

// ------------------ PASO 1 ------------------

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

// ------------------ PASO 2 ------------------

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
        label="ID Responsable"
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

  const RESPONSABLE_DATA = empleados.map((emp) => ({
    label: `${emp.nombres} ${emp.apellido_paterno}`,
    value: emp.id_empleado,
  }));
  const RESPONSABLE_LABELS = RESPONSABLE_DATA.map((r) => r.label);

  const [tempCategoria, setTempCategoria] = useState("");
  const [tempMoneda, setTempMoneda] = useState("");
  const [tempEstado, setTempEstado] = useState("");
  const [tempResponsable, setTempResponsable] = useState(null);

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
    const label = servicio.responsableNombre || RESPONSABLE_LABELS[0];
    const value =
      servicio.idResponsable ||
      (RESPONSABLE_DATA.length > 0 ? RESPONSABLE_DATA[0].value : null);

    setTempResponsable({ label, value });
    setShowResponsableModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20 }}>
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

      {/* MONEDA */}
      <Modal visible={showMonedaModal} transparent>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowMonedaModal(false)} />

        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity
              onPress={() => {
                onChange("moneda", tempMoneda);
                setShowMonedaModal(false);
              }}
            >
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.jsPickerContainer}>
            <TumblerWheel
              data={MONEDA_DATA}
              value={tempMoneda}
              onValueChange={setTempMoneda}
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

      {/* RESPONSABLE */}
      <Modal visible={showResponsableModal} transparent>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowResponsableModal(false)} />

        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity
              onPress={() => {
                const selected =
                  RESPONSABLE_DATA.find((r) => r.label === tempResponsable?.label) ||
                  RESPONSABLE_DATA[0];

                onChange("idResponsable", selected.value);
                onChange("responsableNombre", selected.label);

                setShowResponsableModal(false);
              }}
            >
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.jsPickerContainer}>
            <TumblerWheel
              data={RESPONSABLE_LABELS}
              value={tempResponsable?.label}
              onValueChange={(label) => setTempResponsable({ ...tempResponsable, label })}
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
