import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";
import { useProyectoLogic } from "../../controller/Modulo 1/proyectoform";

// --- Componentes reutilizables ---
const FormInput = React.memo(({ label, value, onChangeText, editable = true, multiline = false }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[styles.textInput, multiline && styles.multilineInput]}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      multiline={multiline}
      textAlignVertical={multiline ? "top" : "center"}
      blurOnSubmit={false}
    />
  </View>
));

const SelectInput = React.memo(({ label, value, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.textInput, { justifyContent: "center" }]}>
        <Text>{value || "Seleccione..."}</Text>
      </View>
    </View>
  </TouchableOpacity>
));

const LockedInput = React.memo(({ label, value }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={[styles.textInput, { backgroundColor: "#e6e6e6" }]}>
      <Text>{value}</Text>
    </View>
  </View>
));

// --- Paso 1 ---
const Paso1 = React.memo(({ logic, dias, meses, años, showTipo, setShowTipo, showFechaInicio, setShowFechaInicio, showFechaFin, setShowFechaFin }) => (
  <>
    <LockedInput label="ID de Proyecto" value={logic.idProyecto} />
    <FormInput label="Nombre del Proyecto" value={logic.nombreProyecto} onChangeText={logic.setNombreProyecto} />

    <SelectInput label="Tipo de Proyecto" value={logic.tipoProyecto} onPress={() => setShowTipo(!showTipo)} />
    {showTipo && (
      <View style={styles.pickerContainer}>
        <Picker selectedValue={logic.tipoProyecto} onValueChange={(v) => { logic.setTipoProyecto(v); setShowTipo(false); }}>
          <Picker.Item label="Software" value="Software" />
          <Picker.Item label="Marketing" value="Marketing" />
        </Picker>
      </View>
    )}

    <SelectInput
      label="Fecha de Inicio"
      value={logic.diaInicio && logic.mesInicio && logic.añoInicio ? `${logic.diaInicio}/${logic.mesInicio}/${logic.añoInicio}` : ""}
      onPress={() => setShowFechaInicio(!showFechaInicio)}
    />
    {showFechaInicio && (
      <View style={styles.dateRow}>
        <Picker selectedValue={logic.diaInicio} onValueChange={logic.setDiaInicio} style={styles.datePicker}>
          <Picker.Item label="Día" value="" />
          {dias.map((d) => <Picker.Item key={d} label={d} value={d} />)}
        </Picker>
        <Picker selectedValue={logic.mesInicio} onValueChange={logic.setMesInicio} style={styles.datePicker}>
          <Picker.Item label="Mes" value="" />
          {meses.map((m) => <Picker.Item key={m} label={m} value={m} />)}
        </Picker>
        <Picker selectedValue={logic.añoInicio} onValueChange={logic.setAñoInicio} style={styles.datePicker}>
          <Picker.Item label="Año" value="" />
          {años.map((a) => <Picker.Item key={a} label={a} value={a} />)}
        </Picker>
      </View>
    )}

    <SelectInput
      label="Fecha de Fin"
      value={logic.diaFin && logic.mesFin && logic.añoFin ? `${logic.diaFin}/${logic.mesFin}/${logic.añoFin}` : ""}
      onPress={() => setShowFechaFin(!showFechaFin)}
    />
    {showFechaFin && (
      <View style={styles.dateRow}>
        <Picker selectedValue={logic.diaFin} onValueChange={logic.setDiaFin} style={styles.datePicker}>
          <Picker.Item label="Día" value="" />
          {dias.map((d) => <Picker.Item key={d} label={d} value={d} />)}
        </Picker>
        <Picker selectedValue={logic.mesFin} onValueChange={logic.setMesFin} style={styles.datePicker}>
          <Picker.Item label="Mes" value="" />
          {meses.map((m) => <Picker.Item key={m} label={m} value={m} />)}
        </Picker>
        <Picker selectedValue={logic.añoFin} onValueChange={logic.setAñoFin} style={styles.datePicker}>
          <Picker.Item label="Año" value="" />
          {años.map((a) => <Picker.Item key={a} label={a} value={a} />)}
        </Picker>
      </View>
    )}

    <FormInput label="Descripción" value={logic.Descripcion} onChangeText={logic.setDescripcion} multiline />
  </>
));

// --- Paso 2 ---
const Paso2 = React.memo(({ logic, editable, showEstado, setShowEstado, showPrioridad, setShowPrioridad, handleGuardar }) => (
  <>
    <FormInput label="Responsable / Encargado" value={logic.responsable} onChangeText={logic.setResponsable} />
    <SelectInput label="Estado" value={logic.estado} onPress={() => setShowEstado(!showEstado)} />
    {showEstado && (
      <View style={styles.pickerContainer}>
        <Picker selectedValue={logic.estado} onValueChange={(v) => { logic.setEstado(v); setShowEstado(false); }}>
          <Picker.Item label="Iniciado" value="Iniciado" />
          <Picker.Item label="En Progreso" value="En Progreso" />
          <Picker.Item label="Completado" value="Completado" />
        </Picker>
      </View>
    )}

    <SelectInput label="Prioridad" value={logic.prioridad} onPress={() => setShowPrioridad(!showPrioridad)} />
    {showPrioridad && (
      <View style={styles.pickerContainer}>
        <Picker selectedValue={logic.prioridad} onValueChange={(v) => { logic.setPrioridad(v); setShowPrioridad(false); }}>
          <Picker.Item label="Baja" value="Baja" />
          <Picker.Item label="Media" value="Media" />
          <Picker.Item label="Alta" value="Alta" />
        </Picker>
      </View>
    )}

    <FormInput
      label="Recursos"
      value={Array.isArray(logic.RecursosList) ? logic.RecursosList.join("\n") : logic.RecursosList}
      onChangeText={(text) => logic.setRecursosList(text.split("\n").filter((r) => r.trim() !== ""))}
      multiline
    />

    <LockedInput label="Auditoría" value={logic.Auditoria} />
    {editable && (
      <TouchableOpacity style={styles.saveButton} onPress={handleGuardar}>
        <Text style={styles.saveButtonText}>Guardar Proyecto</Text>
      </TouchableOpacity>
    )}
  </>
));

// --- Principal ---
export default function ProyectoFormView({ proyecto = {}, mode = "crear" }) {
  const logic = useProyectoLogic(proyecto);
  const editable = mode !== "consultar";
  const [step, setStep] = useState(1);

  const handleGuardar = useCallback(() => {
    logic.handleGuardar();
  }, [logic]);

  const [showTipo, setShowTipo] = useState(false);
  const [showEstado, setShowEstado] = useState(false);
  const [showPrioridad, setShowPrioridad] = useState(false);
  const [showFechaInicio, setShowFechaInicio] = useState(false);
  const [showFechaFin, setShowFechaFin] = useState(false);

  const dias = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
  const meses = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
  const años = Array.from({ length: 6 }, (_, i) => (2024 + i).toString());

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "flex-start",
          paddingTop: 10,
          paddingHorizontal: 20,
        }}
      >
        {step === 1 ? (
          <Paso1
            logic={logic}
            dias={dias}
            meses={meses}
            años={años}
            showTipo={showTipo}
            setShowTipo={setShowTipo}
            showFechaInicio={showFechaInicio}
            setShowFechaInicio={setShowFechaInicio}
            showFechaFin={showFechaFin}
            setShowFechaFin={setShowFechaFin}
          />
        ) : (
          <Paso2
            logic={logic}
            editable={editable}
            showEstado={showEstado}
            setShowEstado={setShowEstado}
            showPrioridad={showPrioridad}
            setShowPrioridad={setShowPrioridad}
            handleGuardar={handleGuardar}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#34495E", marginBottom: 10 },
  textInput: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderColor: "#BDC3C7",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#333",
  },
  multilineInput: { height: 100 },
  pickerContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#BDC3C7",
    overflow: "hidden",
  },
  dateRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  datePicker: { flex: 1, marginHorizontal: 3, backgroundColor: "#fff", borderRadius: 10 },
  navButton: { flex: 1, borderRadius: 25, paddingVertical: 12, alignItems: "center", marginHorizontal: 5 },
  backButton: { backgroundColor: "#95A5A6" },
  nextButton: { backgroundColor: "#3498DB" },
  navButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  buttonRow: { flexDirection: "row", marginTop: 25 },
  saveButton: { backgroundColor: "#2ECC71", borderRadius: 25, paddingVertical: 12, alignItems: "center", marginTop: 25 },
  saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
});
