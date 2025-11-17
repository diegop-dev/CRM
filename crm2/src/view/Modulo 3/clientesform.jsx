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
const SEXO_DATA = ["Masculino", "Femenino"];
const TIPO_CLIENTE_DATA = ["Persona", "Empresa"];
const ESTADO_CLIENTE_DATA = ["Activo", "Inactivo", "Potencial"];

// --- Componentes reutilizables ---
// (Componentes del formulario del usuario, con `onTouchDisabled`)
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
            !editable && styles.lockedInput, // Usamos el estilo 'lockedInput' del nuevo tema
          ]}
          value={value}
          onChangeText={onChangeText}
          editable={editable}
          multiline={multiline}
          textAlignVertical={multiline ? "top" : "center"}
          blurOnSubmit={false}
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
          !editable && styles.lockedInput, // Usamos el estilo 'lockedInput'
        ]}
      >
        <Text style={value ? styles.textInput_value : styles.textInput_placeholder}>
          {value || "Seleccione..."}
        </Text>
      </View>
    </View>
  </TouchableOpacity>
));


// --- Componente de Lista Simple (Copiado de proyectoform) ---
const SimplePickerList = ({ data, onSelect, currentValue }) => {
  const isObjectList = (typeof data[0] === 'object' && data[0] !== null);
  
  return (
    <ScrollView style={styles.simplePickerContainer}>
      {data.map((item, index) => {
        const label = isObjectList ? item.label : item;
        const isSelected = currentValue === label;

        return (
          <TouchableOpacity
            key={index}
            style={[styles.simplePickerItem, isSelected && styles.simplePickerItemSelected]}
            onPress={() => onSelect(item)} 
          >
            <Text style={[
              styles.simplePickerItemText, 
              isSelected && styles.simplePickerItemSelectedText
            ]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};


// --- Componente Principal ---
export default function ClientesFormView({ 
  cliente = {}, 
  modo = "agregar", 
  onTouchDisabled, 
  onChange, 
  onGuardar,
  onRegresar // <-- NUEVA PROP
}) {
  // --- 'step' state eliminado ---
  const editable = modo !== "consultar";

  // --- Estados de los Modales ---
  const [showSexoModal, setShowSexoModal] = useState(false);
  const [showTipoClienteModal, setShowTipoClienteModal] = useState(false);
  const [showEstadoClienteModal, setShowEstadoClienteModal] = useState(false);
  
  // --- Estados 'temp' eliminados ---

  // --- Funciones para Abrir Modales (simplificadas) ---
  const openSexoModal = () => setShowSexoModal(true);
  const openTipoClienteModal = () => setShowTipoClienteModal(true);
  const openEstadoClienteModal = () => setShowEstadoClienteModal(true);


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContainer}
      >
        
        {/* --- NUEVO LAYOUT DE 2 COLUMNAS --- */}
        <View style={styles.columnsContainer}>

          {/* --- Columna Izquierda (Info Personal) --- */}
          <View style={styles.leftColumn}>
            {cliente.id_cliente && (
              <FormInput label="ID de Cliente" value={cliente.id_cliente.toString()} editable={false} />
            )}
            <FormInput label="Nombre del Cliente" value={cliente.nombreCliente} onChangeText={(val) => onChange('nombreCliente', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Apellido Paterno" value={cliente.apellidoPaterno} onChangeText={(val) => onChange('apellidoPaterno', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Apellido Materno" value={cliente.apellidoMaterno} onChangeText={(val) => onChange('apellidoMaterno', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <SelectInput label="Tipo" value={cliente.tipoCliente} onPress={openTipoClienteModal} editable={editable} onTouchDisabled={onTouchDisabled} />
            <SelectInput label="Estado del Cliente" value={cliente.estadoCliente} onPress={openEstadoClienteModal} editable={editable} onTouchDisabled={onTouchDisabled} />
            {/* LÓGICA CONDICIONAL: "Sexo" desaparece si es "Empresa" */}
            {cliente.tipoCliente !== 'Empresa' && (
              <SelectInput label="Sexo" value={cliente.sexo} onPress={openSexoModal} editable={editable} onTouchDisabled={onTouchDisabled} />
            )}
          </View>

          {/* --- Columna Derecha (Contacto y Dirección) --- */}
          <View style={styles.rightColumn}>
            <FormInput label="Correo Electrónico" value={cliente.correoElectronico} onChangeText={(val) => onChange('correoElectronico', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Teléfono" value={cliente.telefono} onChangeText={(val) => onChange('telefono', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Calle" value={cliente.calle} onChangeText={(val) => onChange('calle', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Colonia" value={cliente.colonia} onChangeText={(val) => onChange('colonia', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Ciudad" value={cliente.ciudad} onChangeText={(val) => onChange('ciudad', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Estado" value={cliente.estado} onChangeText={(val) => onChange('estado', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="País" value={cliente.pais} onChangeText={(val) => onChange('pais', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Código Postal" value={cliente.codigoPostal} onChangeText={(val) => onChange('codigoPostal', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput 
              label="Descripción" 
              value={cliente.descripcion} 
              onChangeText={(val) => onChange('descripcion', val)} 
              editable={editable} 
              onTouchDisabled={onTouchDisabled} 
              multiline 
              style={[styles.textInput, styles.multilineInput, { height: 120 }]} // Hacemos Descripción más alta
            />
          </View>
        </View>

        {/* --- NUEVA FILA DE BOTONES FINALES --- */}
        {editable && (
          <View style={styles.finalButtonRow}>
            <TouchableOpacity
              style={[styles.finalButton, styles.regresarButton]}
              onPress={onRegresar}
            >
              <Text style={styles.finalButtonText}>Regresar</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.finalButton, styles.guardarButton]}
              onPress={onGuardar}
            >
              <Text style={styles.finalButtonText}>
                {modo === "editar" ? "Guardar Cambios" : "Guardar Cliente"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* --- MODALES FLOTANTES --- */}
      
      {/* Modal de Sexo */}
      <Modal
        visible={showSexoModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowSexoModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowSexoModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={SEXO_DATA}
            currentValue={cliente.sexo}
            onSelect={(selectedItem) => {
              onChange('sexo', selectedItem);
              setShowSexoModal(false);
            }}
          />
        </View>
      </Modal>

      {/* Modal de Tipo de Cliente */}
      <Modal
        visible={showTipoClienteModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowTipoClienteModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowTipoClienteModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={TIPO_CLIENTE_DATA}
            currentValue={cliente.tipoCliente}
            onSelect={(selectedItem) => {
              onChange('tipoCliente', selectedItem);
              setShowTipoClienteModal(false);
            }}
          />
        </View>
      </Modal>

      {/* Modal de Estado de Cliente */}
      <Modal
        visible={showEstadoClienteModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowEstadoClienteModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowEstadoClienteModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={ESTADO_CLIENTE_DATA}
            currentValue={cliente.estadoCliente}
            onSelect={(selectedItem) => {
              onChange('estadoCliente', selectedItem);
              setShowEstadoClienteModal(false);
            }}
          />
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// --- Estilos ---
// ¡NUEVO STYLESHEET! Copiado de proyectoform.jsx para unificar el diseño.
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  columnsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  leftColumn: {
    width: '48%',
  },
  rightColumn: {
    width: '48%',
  },
  inputContainer: { marginBottom: 18 },
  inputLabel: { 
    fontSize: 14, 
    fontWeight: "600", 
    color: "#ffffff", // Label blanco
    marginBottom: 8 
  },
  textInput: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderColor: "#BDC3C7",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#333",
  },
  textInput_value: {
    color: '#333',
    fontSize: 15,
  },
  textInput_placeholder: {
    color: '#999',
    fontSize: 15,
  },
  lockedInput: {
    backgroundColor: "#e6e6e6" // Color para campos no editables
  },
  multilineInput: { 
    height: 100,
    textAlignVertical: 'top'
  },
  finalButtonRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end', 
    marginTop: 30,
    marginBottom: 40,
  },
  finalButton: {
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginLeft: 10, 
    alignItems: 'center',
  },
  regresarButton: {
    backgroundColor: '#6c757d', 
  },
  guardarButton: {
    backgroundColor: '#77a7ab', 
  },
  finalButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },

  // --- ESTILOS DE LISTA SIMPLE FLOTANTE ---
  listPickerModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -175 }, { translateY: -150 }], 
    width: 350, 
    backgroundColor: '#2b3042',
    borderRadius: 20,
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    overflow: 'hidden', 
  },
  simplePickerContainer: {
    maxHeight: 300, 
    paddingVertical: 10, 
  },
  simplePickerItem: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3f50', 
  },
  simplePickerItemText: {
    color: '#f0f0f0', 
    fontSize: 17,
    textAlign: 'center',
  },
  simplePickerItemSelected: {
    backgroundColor: '#3a3f50', 
  },
  simplePickerItemSelectedText: {
    color: '#77a7ab', 
    fontWeight: '600',
  },
});