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
const CATEGORIA_DATA = ["Consultoría", "Marketing", "Ingeniería"];
const MONEDA_DATA = ["MXN", "USD"];
const ESTADO_DATA = ["Activo", "Inactivo"];

// --- Componentes reutilizables (con `onTouchDisabled` y estilo oscuro) ---
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
export default function ServiciosFormView({ 
  servicio = {}, 
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
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);
  const [showMonedaModal, setShowMonedaModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [showResponsableModal, setShowResponsableModal] = useState(false); 

  // --- Estados 'temp' eliminados ---

  // --- LÓGICA DEL PICKER DE RESPONSABLE ---
  const RESPONSABLE_DATA = empleados.map(emp => ({
    label: `${emp.nombres} ${emp.apellido_paterno}`, 
    value: emp.id_empleado
  }));
  
  // --- Funciones para Abrir Modales (simplificadas) ---
  const openCategoriaModal = () => setShowCategoriaModal(true);
  const openMonedaModal = () => setShowMonedaModal(true);
  const openEstadoModal = () => setShowEstadoModal(true);
  const openResponsableModal = () => setShowResponsableModal(true);

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
            {servicio.id_servicio && (
               <FormInput label="ID de Servicio" value={servicio.id_servicio.toString()} editable={false} />
            )}
            <FormInput 
              label="Nombre del Servicio" 
              value={servicio.nombreServicio} 
              onChangeText={(val) => onChange('nombreServicio', val)} 
              editable={editable} 
              onTouchDisabled={onTouchDisabled} 
            />
            <SelectInput 
              label="Categoría" 
              value={servicio.categoria} 
              onPress={openCategoriaModal} 
              editable={editable} 
              onTouchDisabled={onTouchDisabled} 
            />
            <FormInput 
              label="Precio" 
              value={servicio.precio} 
              onChangeText={(val) => onChange('precio', val)} 
              editable={editable} 
              onTouchDisabled={onTouchDisabled} 
              keyboardType="numeric"
            />
             <SelectInput 
              label="Moneda" 
              value={servicio.moneda} 
              onPress={openMonedaModal} 
              editable={editable} 
              onTouchDisabled={onTouchDisabled} 
            />
            <FormInput 
              label="Duración Estimada" 
              value={servicio.duracionEstimada} 
              onChangeText={(val) => onChange('duracionEstimada', val)} 
              editable={editable} 
              onTouchDisabled={onTouchDisabled} 
            />
          </View>

          {/* --- Columna Derecha --- */}
          <View style={styles.rightColumn}>
            <SelectInput 
              label="Estado" 
              value={servicio.estado} 
              onPress={openEstadoModal} 
              editable={editable} 
              onTouchDisabled={onTouchDisabled} 
            />
            <SelectInput 
              label="ID de Responsable" 
              value={servicio.responsableNombre || ""} // Mostramos nombre
              onPress={openResponsableModal} 
              editable={editable} 
              onTouchDisabled={onTouchDisabled} 
            />
            <FormInput 
              label="Descripción" 
              value={servicio.descripcion} 
              onChangeText={(val) => onChange('descripcion', val)} 
              editable={editable} 
              onTouchDisabled={onTouchDisabled} 
              multiline 
              style={[styles.textInput, styles.multilineInput, { height: 120 }]}
            />
            <FormInput 
              label="Notas Internas" 
              value={servicio.notasInternas} 
              onChangeText={(val) => onChange('notasInternas', val)} 
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
                {modo === "editar" ? "Guardar Cambios" : "Guardar Servicio"}
              </Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* --- MODALES FLOTANTES --- */}
      
      {/* Modal de Categoria */}
      <Modal
        visible={showCategoriaModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowCategoriaModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowCategoriaModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={CATEGORIA_DATA}
            currentValue={servicio.categoria}
            onSelect={(selectedItem) => {
              onChange('categoria', selectedItem);
              setShowCategoriaModal(false);
            }}
          />
        </View>
      </Modal>

      {/* Modal de Moneda */}
      <Modal
        visible={showMonedaModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowMonedaModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowMonedaModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={MONEDA_DATA}
            currentValue={servicio.moneda}
            onSelect={(selectedItem) => {
              onChange('moneda', selectedItem);
              setShowMonedaModal(false);
            }}
          />
        </View>
      </Modal>

      {/* Modal de Estado */}
      <Modal
        visible={showEstadoModal}
        animationType="fade"
        transparent={true}
        onRequestClose={() => setShowEstadoModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowEstadoModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={ESTADO_DATA}
            currentValue={servicio.estado}
            onSelect={(selectedItem) => {
              onChange('estado', selectedItem);
              setShowEstadoModal(false);
            }}
          />
        </View>
      </Modal>
      
      {/* Modal de Responsable */}
      <Modal 
        visible={showResponsableModal} 
        animationType="fade" 
        transparent={true} 
        onRequestClose={() => setShowResponsableModal(false)}
      >
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowResponsableModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={RESPONSABLE_DATA}
            currentValue={servicio.responsableNombre}
            onSelect={(selectedItem) => {
              onChange('idResponsable', selectedItem.value);
              onChange('responsableNombre', selectedItem.label);
              setShowResponsableModal(false);
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