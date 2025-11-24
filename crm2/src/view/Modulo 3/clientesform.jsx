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
const SEXO_DATA = ["Masculino", "Femenino"];
const TIPO_CLIENTE_DATA = ["Persona", "Empresa"];
const ESTADO_CLIENTE_DATA = ["Activo", "Inactivo", "Potencial"];

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

  // Scroll inicial
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

  // Selección por clic
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

const Paso1 = React.memo(({ cliente, onChange, editable, onTouchDisabled, onTipoClientePress, onEstadoClientePress }) => (
  <>
    <FormInput label="Nombre del Cliente" value={cliente.nombreCliente} onChangeText={(val) => onChange('nombreCliente', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Apellido Paterno" value={cliente.apellidoPaterno} onChangeText={(val) => onChange('apellidoPaterno', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <FormInput label="Apellido Materno" value={cliente.apellidoMaterno} onChangeText={(val) => onChange('apellidoMaterno', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
    <SelectInput label="Tipo" value={cliente.tipoCliente} onPress={onTipoClientePress} editable={editable} onTouchDisabled={onTouchDisabled} />
    <SelectInput label="Estado del Cliente" value={cliente.estadoCliente} onPress={onEstadoClientePress} editable={editable} onTouchDisabled={onTouchDisabled} />
  </>
));

const Paso2 = React.memo(({ cliente, onChange, editable, onTouchDisabled, onSexoPress }) => (
  <>
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

const Paso3 = React.memo(({ cliente, onChange, onGuardar, editable, modo, onTouchDisabled }) => (
  <>
    <FormInput label="Estado / Provincia" value={cliente.estado} onChangeText={(val) => onChange('estado', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
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


// ------------------ COMPONENTE PRINCIPAL ------------------

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
  
  // Temporales
  const [tempSexo, setTempSexo] = useState('');
  const [tempTipoCliente, setTempTipoCliente] = useState('');
  const [tempEstadoCliente, setTempEstadoCliente] = useState('');

  // Funciones apertura
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
        contentContainerStyle={styles.scrollContainer}
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

      {/* --- MODALES (TARJETAS FLOTANTES) --- */}
      
      {/* Modal Sexo */}
      <Modal visible={showSexoModal} animationType="fade" transparent onRequestClose={() => setShowSexoModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowSexoModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Sexo</Text>
                    <TouchableOpacity onPress={() => { onChange('sexo', tempSexo); setShowSexoModal(false); }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsPickerContainer}>
                    <TumblerWheel data={SEXO_DATA} onValueChange={setTempSexo} value={tempSexo} />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
      </Modal>

      {/* Modal Tipo Cliente */}
      <Modal visible={showTipoClienteModal} animationType="fade" transparent onRequestClose={() => setShowTipoClienteModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowTipoClienteModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Tipo de Cliente</Text>
                    <TouchableOpacity onPress={() => { onChange('tipoCliente', tempTipoCliente); setShowTipoClienteModal(false); }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsPickerContainer}>
                    <TumblerWheel data={TIPO_CLIENTE_DATA} onValueChange={setTempTipoCliente} value={tempTipoCliente} />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
      </Modal>

      {/* Modal Estado Cliente */}
      <Modal visible={showEstadoClienteModal} animationType="fade" transparent onRequestClose={() => setShowEstadoClienteModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowEstadoClienteModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Estado del Cliente</Text>
                    <TouchableOpacity onPress={() => { onChange('estadoCliente', tempEstadoCliente); setShowEstadoClienteModal(false); }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsPickerContainer}>
                    <TumblerWheel data={ESTADO_CLIENTE_DATA} onValueChange={setTempEstadoCliente} value={tempEstadoCliente} />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  inputContainer: { marginBottom: 18 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 },
  textInput: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderColor: "#BDC3C7",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#333',
  },
  textInput_value: { color: '#333', fontSize: 15 },
  textInput_placeholder: { color: '#999', fontSize: 15 },
  lockedInput: { backgroundColor: "#e6e6e6" },
  multilineInput: { height: 100, textAlignVertical: 'top' },
  
  // Botones
  navButton: {
    flex: 1,
    borderRadius: 25,
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 5,
  },
  backButton: { backgroundColor: "#77a7ab" },
  nextButton: { backgroundColor: "#006480" },
  navButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  buttonRow: { flexDirection: "row", marginTop: 25, marginBottom: 40 },
  saveButton: { 
    backgroundColor: "#77a7ab", 
    borderRadius: 25, 
    paddingVertical: 12, 
    alignItems: "center", 
    marginTop: 25 
  },
  saveButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },

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
