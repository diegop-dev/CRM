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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- CONSTANTES ---
// A- Se eliminan DÍAS, MESES, AÑOS y ROL.
// B- Se añade TIPO_CLIENTE_DATA.
// C- Se actualiza ESTADO_DATA.
const SEXO_DATA = ["Masculino", "Femenino"];
const TIPO_CLIENTE_DATA = ["Persona", "Empresa"];
const ESTADO_CLIENTE_DATA = ["Activo", "Inactivo", "Potencial"]; // Actualizado

const ITEM_HEIGHT = 44;
const CONTAINER_HEIGHT = 220;
const WHEEL_PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;


// --- Componentes reutilizables ---
// (No necesitan cambios)
const FormInput = React.memo(
  ({ label, value, onChangeText, editable = true, multiline = false, onTouchDisabled }) => (
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
          blurOnSubmit={false}
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

// --- Paso 1 ---
// CAMBIOS:
// - 'empleado' -> 'cliente'
// - Se elimina ID Cliente, Fecha Nac, Sexo, RFC, CURP, NSS.
// - Se cambia "Nombres" a "Nombre del Cliente".
// - Se añade "Tipo" y "Estado del Cliente".
const Paso1 = React.memo(({ cliente, onChange, editable, onTouchDisabled, onTipoClientePress, onEstadoClientePress }) => (
  <>
    {/* ID de Cliente eliminado según instrucción */}
    <FormInput label="Nombre del Cliente" value={cliente.nombreCliente} onChangeText={(val) => onChange('nombreCliente', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Apellido Paterno" value={cliente.apellidoPaterno} onChangeText={(val) => onChange('apellidoPaterno', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Apellido Materno" value={cliente.apellidoMaterno} onChangeText={(val) => onChange('apellidoMaterno', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <SelectInput label="Tipo" value={cliente.tipoCliente} onPress={onTipoClientePress} editable={editable} onTouchDisabled={onTouchDisabled} />
    <SelectInput label="Estado del Cliente" value={cliente.estadoCliente} onPress={onEstadoClientePress} editable={editable} onTouchDisabled={onTouchDisabled} />
  </>
));

// --- Paso 2 ---
// CAMBIOS:
// - 'empleado' -> 'cliente'
// - Se añade "Sexo" (movido de Paso 1).
// - "Sexo" SÓLO aparece si cliente.tipoCliente NO es "Empresa".
// - Se elimina "Estado" y "Código Postal" (movidos a Paso 3).
const Paso2 = React.memo(({ cliente, onChange, editable, onTouchDisabled, onSexoPress }) => (
  <>
    {/* LÓGICA CONDICIONAL: "Sexo" desaparece si es "Empresa" */}
    {cliente.tipoCliente !== 'Empresa' && (
      <SelectInput label="Sexo" value={cliente.sexo} onPress={onSexoPress} editable={editable} onTouchDisabled={onTouchDisabled} />
    )}
    <FormInput label="Correo Electrónico" value={cliente.correoElectronico} onChangeText={(val) => onChange('correoElectronico', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Teléfono" value={cliente.telefono} onChangeText={(val) => onChange('telefono', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Calle" value={cliente.calle} onChangeText={(val) => onChange('calle', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Colonia" value={cliente.colonia} onChangeText={(val) => onChange('colonia', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Ciudad" value={cliente.ciudad} onChangeText={(val) => onChange('ciudad', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
  </>
));

// --- Paso 3 ---
// CAMBIOS:
// - 'empleado' -> 'cliente'
// - Se eliminan Rol, Estado del Empleado, Usuario y Contraseña.
// - Se añade "Estado" y "Código Postal" (movidos de Paso 2).
// - Se añade "País".
// - Se cambia "Observaciones" a "Descripción".
const Paso3 = React.memo(({ cliente, onChange, onGuardar, editable, modo, onTouchDisabled }) => (
  <>
    <FormInput label="Estado" value={cliente.estado} onChangeText={(val) => onChange('estado', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="País" value={cliente.pais} onChangeText={(val) => onChange('pais', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Código Postal" value={cliente.codigoPostal} onChangeText={(val) => onChange('codigoPostal', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Descripción" value={cliente.descripcion} onChangeText={(val) => onChange('descripcion', val)} editable={editable} onTouchDisabled={onTouchDisabled} multiline />

    {editable && (
      <TouchableOpacity style={styles.saveButton} onPress={onGuardar}>
        <Text style={styles.saveButtonText}>
          {modo === "editar" ? "Guardar Cambios" : "Guardar Cliente"}
        </Text>
      </TouchableOpacity>
    )}
  </>
));

// --- Componente de Picker en JS ---
const JSPickerItem = ({ label }) => (
  <View style={styles.pickerItem}>
    <Text style={styles.pickerItemText}>
      {label}
    </Text>
  </View>
);

// --- Componente de Rueda Selectora ---
const TumblerWheel = ({ data, onValueChange, value }) => {
  const ref = React.useRef(null);
  let initialIndex = data.indexOf(value);
  if (initialIndex < 0) initialIndex = 0;
  const initialOffset = initialIndex * ITEM_HEIGHT;

  const handleScrollEnd = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < data.length) {
      const newValue = data[index];
      onValueChange(newValue);
    }
  };

  return (
    <ScrollView
      ref={ref}
      style={styles.jsDatePickerColumn}
      showsVerticalScrollIndicator={false}
      snapToInterval={ITEM_HEIGHT}
      decelerationRate="fast"
      contentOffset={{ y: initialOffset }}
      contentContainerStyle={{ 
        paddingTop: WHEEL_PADDING, 
        paddingBottom: WHEEL_PADDING
      }}
      onMomentumScrollEnd={handleScrollEnd}
      onScrollEndDrag={handleScrollEnd}
    >
      {data.map((item, index) => <JSPickerItem key={`${item}_${index}`} label={item} />)}
    </ScrollView>
  );
};


// --- Principal ---
// CAMBIOS:
// - Renombrado a 'ClientesFormView'.
// - Prop 'empleado' -> 'cliente'.
// - Se eliminan estados y modales de Fecha y Rol.
// - Se añade estado y modal para "Tipo de Cliente".
// - Se renombra estado y modal de "Estado Empleado" a "Estado Cliente".
export default function ClientesFormView({ 
  cliente = {}, 
  modo = "agregar", 
  onTouchDisabled, 
  onChange, 
  onGuardar 
}) {
  const [step, setStep] = useState(1);
  const editable = modo !== "consultar";

  const [showSexoModal, setShowSexoModal] = useState(false);
  const [showTipoClienteModal, setShowTipoClienteModal] = useState(false);
  const [showEstadoClienteModal, setShowEstadoClienteModal] = useState(false);
  
  // Se eliminan temps de fecha
  const [tempSexo, setTempSexo] = useState('');
  const [tempTipoCliente, setTempTipoCliente] = useState('');
  const [tempEstadoCliente, setTempEstadoCliente] = useState('');

  // Se elimina openFechaModal y openRolModal
  
  const openSexoModal = () => {
    setTempSexo(cliente.sexo || SEXO_DATA[0]);
    setShowSexoModal(true);
  };
  
  const openTipoClienteModal = () => {
    setTempTipoCliente(cliente.tipoCliente || TIPO_CLIENTE_DATA[0]);
    setShowTipoClienteModal(true);
  };

  const openEstadoClienteModal = () => {
    setTempEstadoCliente(cliente.estadoCliente || ESTADO_CLIENTE_DATA[0]);
    setShowEstadoClienteModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-start", paddingHorizontal: 20 }}
      >
        {step === 1 && (
          <Paso1
            cliente={cliente}
            onChange={onChange}
            editable={editable}
            onTouchDisabled={onTouchDisabled}
            onTipoClientePress={() => (editable ? openTipoClienteModal() : onTouchDisabled())}
            onEstadoClientePress={() => (editable ? openEstadoClienteModal() : onTouchDisabled())}
          />
        )}

        {step === 2 && (
          <Paso2 
            cliente={cliente}
            onChange={onChange}
            editable={editable} 
            onTouchDisabled={onTouchDisabled} 
            onSexoPress={() => (editable ? openSexoModal() : onTouchDisabled())}
          />
        )}

        {step === 3 && (
          <Paso3
            cliente={cliente}
            onChange={onChange}
            onGuardar={onGuardar}
            editable={editable}
            modo={modo}
            onTouchDisabled={onTouchDisabled}
            // Se eliminan onRolPress y onEstadoPress
          />
        )}

        <View style={styles.buttonRow}>
          {step > 1 && (
            <TouchableOpacity style={[styles.navButton, styles.backButton]} onPress={() => setStep(step - 1)}>
              <Text style={styles.navButtonText}>Regresar</Text>
            </TouchableOpacity>
          )}
          {step < 3 && (
            <TouchableOpacity style={[styles.navButton, styles.nextButton]} onPress={() => setStep(step + 1)}>
              <Text style={styles.navButtonText}>Continuar</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      {/* --- MODAL DE ALERTA TIPO iOS --- */}
      {/* (Eliminado, se maneja en el hook superior) */}

      {/* --- MODALES DE PICKER TIPO iOS (Bottom Sheet) --- */}
      
      {/* Modal de Fecha de Nacimiento (ELIMINADO) */}

      {/* Modal de Sexo (MANTENIDO) */}
      <Modal
        visible={showSexoModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowSexoModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowSexoModal(false)} />
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => {
              onChange('sexo', tempSexo);
              setShowSexoModal(false);
            }}>
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jsPickerContainer}>
            <TumblerWheel data={SEXO_DATA} onValueChange={setTempSexo} value={tempSexo} />
            <View style={styles.pickerHighlight} pointerEvents="none" />
          </View>
        </View>
      </Modal>

      {/* Modal de Rol (ELIMINADO) */}

      {/* Modal de Tipo de Cliente (AÑADIDO) */}
      <Modal
        visible={showTipoClienteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowTipoClienteModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowTipoClienteModal(false)} />
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => {
              onChange('tipoCliente', tempTipoCliente);
              setShowTipoClienteModal(false);
            }}>
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jsPickerContainer}>
            <TumblerWheel data={TIPO_CLIENTE_DATA} onValueChange={setTempTipoCliente} value={tempTipoCliente} />
            <View style={styles.pickerHighlight} pointerEvents="none" />
          </View>
        </View>
      </Modal>

      {/* Modal de Estado de Cliente (RENOMBRADO) */}
      <Modal
        visible={showEstadoClienteModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowEstadoClienteModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowEstadoClienteModal(false)} />
        <View style={styles.pickerSheet}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => {
              onChange('estadoCliente', tempEstadoCliente);
              setShowEstadoClienteModal(false);
            }}>
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.jsPickerContainer}>
            <TumblerWheel data={ESTADO_CLIENTE_DATA} onValueChange={setTempEstadoCliente} value={tempEstadoCliente} />
            <View style={styles.pickerHighlight} pointerEvents="none" />
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// --- Estilos ---
// (Tus estilos se quedan igual)
const styles = StyleSheet.create({
  inputContainer: { marginBottom: 20 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#ffffffff", marginBottom: 10 },
  textInput: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderColor: "#BDC3C7",
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    fontSize: 16,
    color: '#333',
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  textInput_value: {
    color: '#333',
    fontSize: 16,
  },
  textInput_placeholder: {
    color: '#999',
    fontSize: 16,
  },
  multilineInput: { 
    height: 100,
    textAlignVertical: 'top',
  },
  navButton: {
    flex: 1,
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: "center",
    marginHorizontal: 5,
  },
  backButton: { backgroundColor: "#77a7ab" },
  nextButton: { backgroundColor: "#006480" },
  navButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  buttonRow: { flexDirection: "row", marginTop: 15, marginBottom: 30 },
  saveButton: { backgroundColor: "#006480", borderRadius: 25, paddingVertical: 12, paddingHorizontal: 15, alignItems: "center", marginTop: 10 },
  saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  alertBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  alertContainer: {
    backgroundColor: "#FFFFFF",
    width: "75%",
    maxWidth: 300,
    borderRadius: 14,
    overflow: 'hidden',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
    color: "#000",
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 5,
  },
  alertMessage: {
    fontSize: 14,
    fontWeight: "400",
    textAlign: "center",
    color: "#000",
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  alertButtonContainer: {
    borderTopWidth: 0.5,
    borderColor: "rgba(0, 0, 0, 0.3)",
    flexDirection: 'row',
  },
  alertButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertButtonText: {
    fontSize: 17,
    color: "#007AFF",
    fontWeight: "600",
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  pickerSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 30,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: -3 },
    shadowRadius: 5,
  },
  pickerHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#CCC',
    alignItems: 'flex-end',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
  },
  jsPickerContainer: {
    height: CONTAINER_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
  },
  jsDatePickerContainer: {
    flexDirection: "row",
    height: CONTAINER_HEIGHT,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
  jsDatePickerColumn: {
    flex: 1,
    height: CONTAINER_HEIGHT,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerItemText: {
    fontSize: 16,
    color: "#333",
  },
  pickerHighlight: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 20,
    position: 'absolute',
    top: '50%',
    left: 10,
    right: 10,
    height: ITEM_HEIGHT,
    marginTop: -ITEM_HEIGHT / 2,
    backgroundColor: 'rgba(77, 77, 77, 0.05)',
  },
});
