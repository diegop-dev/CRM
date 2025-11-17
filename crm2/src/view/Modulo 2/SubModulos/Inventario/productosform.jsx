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
const UNIDAD_MEDIDA_DATA = ["Pieza", "Kilogramo", "Litro", "Metro", "Caja", "Paquete"];
const ESTADO_PRODUCTO_DATA = ["Excelente", "Bueno", "Regular", "Deteriorado", "En Reparación"];
// (Constantes de Rueda eliminadas)

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
            !editable && styles.lockedInput,
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

// --- Componente de Lista Simple ---
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
export default function ProductosFormView({ 
  producto = {}, 
  modo = "agregar", 
  onTouchDisabled, 
  onChange, 
  onGuardar,
  onRegresar, // <-- NUEVA PROP
  empleados = [] 
}) {
  // --- 'step' state eliminado ---
  const editable = modo !== "consultar";

  // --- Estados de los Modales ---
  const [showResponsableModal, setShowResponsableModal] = useState(false);
  const [showFechaIngresoModal, setShowFechaIngresoModal] = useState(false);
  const [showUnidadMedidaModal, setShowUnidadMedidaModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);

  // --- Estados Temporales de Fecha ---
  const [tempDia, setTempDia] = useState('');
  const [tempMes, setTempMes] = useState('');
  const [tempAño, setTempAño] = useState('');

  // --- LÓGICA DEL PICKER DE RESPONSABLE ---
  const RESPONSABLE_DATA = empleados.map(emp => ({
    label: `${emp.nombres} ${emp.apellido_paterno}`, 
    value: emp.id_empleado
  }));

  // --- Funciones para Abrir Modales ---
  const openResponsableModal = () => setShowResponsableModal(true);
  const openUnidadMedidaModal = () => setShowUnidadMedidaModal(true);
  const openEstadoModal = () => setShowEstadoModal(true);
  
  const openFechaIngresoModal = () => {
    setTempDia(producto.diaIngreso || '');
    setTempMes(producto.mesIngreso || '');
    setTempAño(producto.añoIngreso || '');
    setShowFechaIngresoModal(true);
  };
  
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

          {/* --- Columna Izquierda --- */}
          <View style={styles.leftColumn}>
            {producto.id_producto && (
              <FormInput label="ID Producto" value={producto.id_producto.toString()} editable={false} />
            )}
            <FormInput label="Nombre" value={producto.nombre} onChangeText={(val) => onChange('nombre', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Código Interno" value={producto.codigoInterno} onChangeText={(val) => onChange('codigoInterno', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <FormInput label="Categoría" value={producto.categoria} onChangeText={(val) => onChange('categoria', val)} editable={editable} onTouchDisabled={onTouchDisabled} />
            <SelectInput 
              label="Unidad de Medida" 
              value={producto.unidadMedida} 
              onPress={openUnidadMedidaModal} 
              editable={editable} 
              onTouchDisabled={onTouchDisabled} 
            />
          </View>

          {/* --- Columna Derecha --- */}
          <View style={styles.rightColumn}>
             <FormInput 
              label="Cantidad" 
              value={producto.cantidad} 
              onChangeText={(val) => onChange('cantidad', val)} 
              editable={editable} 
              onTouchDisabled={onTouchDisabled} 
              keyboardType="numeric"
            />
            <SelectInput 
              label="Estado" 
              value={producto.estado} 
              onPress={openEstadoModal} 
              editable={editable} 
              onTouchDisabled={onTouchDisabled} 
            />
            <SelectInput 
              label="Responsable de Registro" 
              value={producto.responsableNombre || ""}
              onPress={openResponsableModal} 
              editable={editable} 
              onTouchDisabled={onTouchDisabled} 
            />
            <SelectInput
              label="Fecha de Ingreso"
              value={
                producto.diaIngreso && producto.mesIngreso && producto.añoIngreso
                  ? `${producto.diaIngreso}/${producto.mesIngreso}/${producto.añoIngreso}`
                  : ""
              }
              onPress={openFechaIngresoModal}
              editable={editable}
              onTouchDisabled={onTouchDisabled}
            />
            <FormInput 
              label="Descripción" 
              value={producto.descripcion} 
              onChangeText={(val) => onChange('descripcion', val)} 
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
                {modo === "editar" ? "Guardar Cambios" : "Guardar"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* --- MODALES FLOTANTES --- */}

      {/* --- MODAL FECHA INGRESO (Mini-Form) --- */}
      <Modal
        visible={showFechaIngresoModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowFechaIngresoModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowFechaIngresoModal(false)} />
        <View style={styles.datePickerModal}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => {
              onChange('diaIngreso', tempDia);
              onChange('mesIngreso', tempMes);
              onChange('añoIngreso', tempAño);
              setShowFechaIngresoModal(false);
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

      {/* --- MODAL RESPONSABLE (Lista) --- */}
      <Modal visible={showResponsableModal} animationType="fade" transparent={true} onRequestClose={() => setShowResponsableModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowResponsableModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={RESPONSABLE_DATA}
            currentValue={producto.responsableNombre}
            onSelect={(selectedItem) => {
              onChange('idResponsable', selectedItem.value); 
              onChange('responsableNombre', selectedItem.label); 
              setShowResponsableModal(false);
            }}
          />
        </View>
      </Modal>

      {/* --- MODAL UNIDAD DE MEDIDA (Lista) --- */}
      <Modal
        visible={showUnidadMedidaModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowUnidadMedidaModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowUnidadMedidaModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={UNIDAD_MEDIDA_DATA}
            currentValue={producto.unidadMedida}
            onSelect={(selectedItem) => {
              onChange('unidadMedida', selectedItem);
              setShowUnidadMedidaModal(false);
            }}
          />
        </View>
      </Modal>

      {/* --- MODAL ESTADO (Lista) --- */}
      <Modal
        visible={showEstadoModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowEstadoModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowEstadoModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={ESTADO_PRODUCTO_DATA}
            currentValue={producto.estado}
            onSelect={(selectedItem) => {
              onChange('estado', selectedItem);
              setShowEstadoModal(false);
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