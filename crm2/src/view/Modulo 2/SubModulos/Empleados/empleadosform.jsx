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
const ROL_DATA = ["Super Administrador", "Administrador", "Empleado"];
const ESTADO_DATA = ["Activo", "Inactivo"];

// --- Componentes reutilizables ---
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
            !editable && styles.lockedInput, // Estilo oscuro
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
          !editable && styles.lockedInput, // Estilo oscuro
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
export default function EmpleadosFormView({ 
  empleado = {}, 
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
  const [showFechaModal, setShowFechaModal] = useState(false);
  const [showRolModal, setShowRolModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);

  // --- Estados Temporales de Fecha ---
  const [tempDia, setTempDia] = useState('');
  const [tempMes, setTempMes] = useState('');
  const [tempAño, setTempAño] = useState('');
  // --- Estados 'temp' de selectores (Sexo, Rol, Estado) eliminados ---
  
  // --- Funciones para Abrir Modales ---
  const openFechaModal = () => {
    setTempDia(empleado.diaNacimiento || '');
    setTempMes(empleado.mesNacimiento || '');
    setTempAño(empleado.añoNacimiento || '');
    setShowFechaModal(true);
  };
  const openSexoModal = () => setShowSexoModal(true);
  const openRolModal = () => setShowRolModal(true);
  const openEstadoModal = () => setShowEstadoModal(true);

  // --- Funciones de Validación de Fecha ---
  const handleDiaChange = (text, setter) => {
    const numericText = text.replace(/[^0-9]/g, ''); 
    if (numericText === '') { setter(''); return; }
    if (numericText === '0' || numericText === '00') { setter(numericText); return; }
    const value = parseInt(numericText, 10);
    if (value > 31) { setter('31'); } else { setter(numericText); }
  };

  const handleMesChange = (text, setter) => {
    const numericText = text.replace(/[^0-9]/g, ''); 
    if (numericText === '') { setter(''); return; }
     if (numericText === '0' || numericText === '00') { setter(numericText); return; }
    const value = parseInt(numericText, 10);
    if (value > 12) { setter('12'); } else { setter(numericText); }
  };

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
            {/* ID Empleado Oculto (o visible si lo necesitas) */}
            {/* {empleado.id_empleado && (
              <FormInput label="ID Empleado" value={empleado.id_empleado.toString()} editable={false} />
            )} */}
            <FormInput label="Nombres" value={empleado.nombres} onChangeText={(val) => onChange('nombres', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Apellido Paterno" value={empleado.apellidoPaterno} onChangeText={(val) => onChange('apellidoPaterno', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Apellido Materno" value={empleado.apellidoMaterno} onChangeText={(val) => onChange('apellidoMaterno', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <SelectInput
              label="Fecha de Nacimiento"
              value={
                empleado.diaNacimiento && empleado.mesNacimiento && empleado.añoNacimiento
                  ? `${empleado.diaNacimiento}/${empleado.mesNacimiento}/${empleado.añoNacimiento}`
                  : ""
              }
              onPress={openFechaModal}
              editable={editable}
              onTouchDisabled={onTouchDisabled}
            />
            <SelectInput label="Sexo" value={empleado.sexo} onPress={openSexoModal} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="RFC" value={empleado.rfc} onChangeText={(val) => onChange('rfc', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="CURP" value={empleado.curp} onChangeText={(val) => onChange('curp', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="NSS" value={empleado.nss} onChangeText={(val) => onChange('nss', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Nombre de Usuario" value={empleado.nombreUsuario} onChangeText={(val) => onChange('nombreUsuario', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Contraseña" value={empleado.contraseña} onChangeText={(val) => onChange('contraseña', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
          </View>

          {/* --- Columna Derecha (Contacto y Dirección) --- */}
          <View style={styles.rightColumn}>
            <FormInput label="Teléfono" value={empleado.telefono} onChangeText={(val) => onChange('telefono', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Correo Electrónico" value={empleado.correoElectronico} onChangeText={(val) => onChange('correoElectronico', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Calle" value={empleado.calle} onChangeText={(val) => onChange('calle', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Colonia" value={empleado.colonia} onChangeText={(val) => onChange('colonia', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Ciudad" value={empleado.ciudad} onChangeText={(val) => onChange('ciudad', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Estado" value={empleado.estado} onChangeText={(val) => onChange('estado', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Código Postal" value={empleado.codigoPostal} onChangeText={(val) => onChange('codigoPostal', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <SelectInput label="Rol" value={empleado.rol} onPress={openRolModal} editable={editable} onTouchDisabled={onTouchDisabled} />
            <SelectInput label="Estado del Empleado" value={empleado.estadoEmpleado} onPress={openEstadoModal} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput 
              label="Observaciones" 
              value={empleado.observaciones} 
              onChangeText={(val) => onChange('observaciones', val)} 
              editable={editable} 
              onTouchDisabled={onTouchDisabled} 
              multiline 
              style={[styles.textInput, styles.multilineInput, { height: 120 }]}
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
                {modo === "editar" ? "Guardar Cambios" : "Guardar Empleado"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* --- MODALES FLOTANTES --- */}
      
      {/* Modal de Sexo */}
      <Modal visible={showSexoModal} animationType="fade" transparent={true} onRequestClose={() => setShowSexoModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowSexoModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={SEXO_DATA}
            currentValue={empleado.sexo}
            onSelect={(selectedItem) => {
              onChange('sexo', selectedItem);
              setShowSexoModal(false);
            }}
          />
        </View>
      </Modal>

      {/* Modal de Rol */}
      <Modal visible={showRolModal} animationType="fade" transparent={true} onRequestClose={() => setShowRolModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowRolModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={ROL_DATA}
            currentValue={empleado.rol}
            onSelect={(selectedItem) => {
              onChange('rol', selectedItem);
              setShowRolModal(false);
            }}
          />
        </View>
      </Modal>

      {/* Modal de Estado de Empleado */}
      <Modal visible={showEstadoModal} animationType="fade" transparent={true} onRequestClose={() => setShowEstadoModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowEstadoModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={ESTADO_DATA}
            currentValue={empleado.estadoEmpleado}
            onSelect={(selectedItem) => {
              onChange('estadoEmpleado', selectedItem);
              setShowEstadoModal(false);
            }}
          />
        </View>
      </Modal>

      {/* Modal de Fecha de Nacimiento (Mini-Form) */}
      <Modal visible={showFechaModal} animationType="fade" transparent={true} onRequestClose={() => setShowFechaModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowFechaModal(false)} />
        <View style={styles.datePickerModal}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => {
              onChange('diaNacimiento', tempDia);
              onChange('mesNacimiento', tempMes);
              onChange('añoNacimiento', tempAño);
              setShowFechaModal(false);
            }}>
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dateModalContainer}>
            <View style={styles.dateInputColumn}>
              <Text style={styles.inputLabel}>Día</Text>
              <TextInput
                style={styles.dateInput}
                value={tempDia}
                onChangeText={(text) => handleDiaChange(text, setTempDia)}
                keyboardType="numeric"
                maxLength={2}
                placeholder="DD"
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.dateInputColumn}>
              <Text style={styles.inputLabel}>Mes</Text>
              <TextInput
                style={styles.dateInput}
                value={tempMes}
                onChangeText={(text) => handleMesChange(text, setTempMes)}
                keyboardType="numeric"
                maxLength={2}
                placeholder="MM"
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.dateInputColumn}>
              <Text style={styles.inputLabel}>Año</Text>
              <TextInput
                style={styles.dateInput}
                value={tempAño}
                onChangeText={setTempAño}
                keyboardType="numeric"
                maxLength={4}
                placeholder="AAAA"
                placeholderTextColor="#999"
              />
            </View>
          </View>
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

  // --- ESTILOS DE FECHA FLOTANTE ---
  datePickerModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -175 }, { translateY: -125 }], 
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
  pickerHeader: { 
    backgroundColor: '#3a3f50', 
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#5a5f70', 
    alignItems: 'flex-end',
  },
  pickerButtonText: { 
    fontSize: 16,
    color: "#77a7ab", 
    fontWeight: "600",
  },
  dateModalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    paddingTop: 10,
    paddingBottom: 20, 
  },
  dateInputColumn: {
    flex: 1,
    paddingHorizontal: 8,
  },
  dateInput: {
    backgroundColor: '#3a3f50', 
    color: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 10,
    textAlign: 'center',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#5a5f70',
  },
});