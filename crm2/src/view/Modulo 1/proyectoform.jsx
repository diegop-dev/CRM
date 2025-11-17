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

// --- CONSTANTES DE DATOS (Sin cambios) ---
const TIPO_DATA = ["Software", "Marketing", "Recursos Humanos", "Otro"];
const ESTADO_DATA = ["Iniciado", "En Progreso", "Completado", "Pausado"];
const PRIORIDAD_DATA = ["Baja", "Media", "Alta"];

// --- Componentes reutilizables (Sin cambios) ---
const FormInput = React.memo(({ label, value, onChangeText, editable = true, multiline = false, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TextInput
      style={[
        styles.textInput,
        multiline && styles.multilineInput,
        !editable && styles.lockedInput
      ]}
      value={value}
      onChangeText={onChangeText}
      editable={editable}
      multiline={multiline}
      textAlignVertical={multiline ? "top" : "center"}
      blurOnSubmit={false}
      {...props}
    />
  </View>
));

const SelectInput = React.memo(({ label, value, onPress, editable = true }) => (
  <TouchableOpacity onPress={editable ? onPress : undefined} activeOpacity={editable ? 0.8 : 1}>
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

// --- Componente de Lista Simple (Sin cambios) ---
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
export default function ProyectoFormView({
  proyecto = {},
  modo = "crear",
  onChange,
  onGuardar,
  onRegresar,
  empleados = [] 
}) {
  
  const editable = modo !== "consultar";

  // --- Estados de los Modales (Sin cambios) ---
  const [showTipoModal, setShowTipoModal] = useState(false);
  const [showInicioModal, setShowInicioModal] = useState(false);
  const [showFinModal, setShowFinModal] = useState(false);
  const [showResponsableModal, setShowResponsableModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [showPrioridadModal, setShowPrioridadModal] = useState(false);

  // --- Estados Temporales de Fecha (Sin cambios) ---
  const [tempDiaInicio, setTempDiaInicio] = useState('');
  const [tempMesInicio, setTempMesInicio] = useState('');
  const [tempAñoInicio, setTempAñoInicio] = useState('');
  const [tempDiaFin, setTempDiaFin] = useState('');
  const [tempMesFin, setTempMesFin] = useState('');
  const [tempAñoFin, setTempAñoFin] = useState('');
  
  // --- Lógica de Props (Sin cambios) ---
  const RESPONSABLE_DATA = empleados.map(emp => ({
    label: `${emp.nombres} ${emp.apellido_paterno}`,
    value: emp.id_empleado
  }));
  const openTipoModal = () => setShowTipoModal(true);
  const openEstadoModal = () => setShowEstadoModal(true);
  const openPrioridadModal = () => setShowPrioridadModal(true);
  const openResponsableModal = () => setShowResponsableModal(true);
  const openInicioModal = () => {
    setTempDiaInicio(proyecto.diaInicio || '');
    setTempMesInicio(proyecto.mesInicio || '');
    setTempAñoInicio(proyecto.añoInicio || '');
    setShowInicioModal(true);
  };
  const openFinModal = () => {
    setTempDiaFin(proyecto.diaFin || '');
    setTempMesFin(proyecto.mesFin || '');
    setTempAñoFin(proyecto.añoFin || '');
    setShowFinModal(true);
  };

  // --- ¡NUEVAS FUNCIONES DE VALIDACIÓN! ---
  const handleDiaChange = (text, setter) => {
    const numericText = text.replace(/[^0-9]/g, ''); // Solo permite números
    if (numericText === '') {
      setter('');
      return;
    }
    if (numericText === '0' || numericText === '00') {
       setter(numericText); // Permite empezar con "0"
       return;
    }
    const value = parseInt(numericText, 10);
    if (value > 31) {
      setter('31'); // Si es mayor a 31, lo "clava" en 31
    } else {
      setter(numericText); // Guarda el texto numérico ("05" se queda como "05")
    }
  };

  const handleMesChange = (text, setter) => {
    const numericText = text.replace(/[^0-9]/g, ''); // Solo permite números
    if (numericText === '') {
      setter('');
      return;
    }
     if (numericText === '0' || numericText === '00') {
       setter(numericText); // Permite empezar con "0"
       return;
    }
    const value = parseInt(numericText, 10);
    if (value > 12) {
      setter('12'); // Si es mayor a 12, lo "clava" en 12
    } else {
      setter(numericText); // Guarda el texto numérico
    }
  };


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContainer}
      >
        
        {/* --- LAYOUT DE 2 COLUMNAS (Sin cambios) --- */}
        <View style={styles.columnsContainer}>
          {/* Columna Izquierda */}
          <View style={styles.leftColumn}>
            {proyecto.id_proyecto && (
              <FormInput label="ID de Proyecto" value={proyecto.id_proyecto.toString()} editable={false} />
            )}
            <FormInput 
              label="Nombre del Proyecto" 
              value={proyecto.nombreProyecto} 
              onChangeText={(val) => onChange('nombreProyecto', val)} 
              editable={editable} 
            />
            <SelectInput 
              label="Tipo de Proyecto" 
              value={proyecto.tipoProyecto} 
              onPress={openTipoModal}
              editable={editable} 
            />
            <SelectInput
              label="Fecha de Inicio"
              value={
                proyecto.diaInicio && proyecto.mesInicio && proyecto.añoInicio
                  ? `${proyecto.diaInicio}/${proyecto.mesInicio}/${proyecto.añoInicio}`
                  : ""
              }
              onPress={openInicioModal} 
              editable={editable}
            />
            <SelectInput
              label="Fecha de Fin"
              value={
                proyecto.diaFin && proyecto.mesFin && proyecto.añoFin
                  ? `${proyecto.diaFin}/${proyecto.mesFin}/${proyecto.añoFin}`
                  : ""
              }
              onPress={openFinModal} 
              editable={editable}
            />
            <SelectInput 
              label="Responsable / Encargado" 
              value={proyecto.responsableNombre || ""}
              onPress={openResponsableModal} 
              editable={editable} 
            />
          </View>

          {/* Columna Derecha */}
          <View style={styles.rightColumn}>
            <SelectInput 
              label="Estado" 
              value={proyecto.estado} 
              onPress={openEstadoModal}
              editable={editable} 
            />
            <SelectInput 
              label="Prioridad" 
              value={proyecto.prioridad} 
              onPress={openPrioridadModal}
              editable={editable} 
            />
            <FormInput
              label="Recursos (uno por línea)"
              value={Array.isArray(proyecto.RecursosList) ? proyecto.RecursosList.join("\n") : ""}
              onChangeText={(text) => onChange('RecursosList', text.split("\n").filter(r => r.trim() !== ""))}
              multiline
              editable={editable}
              style={[styles.textInput, styles.multilineInput, { height: 120 }]}
            />
            <FormInput 
              label="Descripción" 
              value={proyecto.descripcion} 
              onChangeText={(val) => onChange('descripcion', val)} 
              multiline 
              editable={editable} 
              style={[styles.textInput, styles.multilineInput, { height: 120 }]}
            />
          </View>
        </View>

        {/* --- BOTONES FINALES (Sin cambios) --- */}
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

      {/* --- MODALES --- */}

      {/* --- MODALES DE LISTA SIMPLE (Sin cambios) --- */}
      <Modal visible={showTipoModal} animationType="fade" transparent={true} onRequestClose={() => setShowTipoModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowTipoModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={TIPO_DATA}
            currentValue={proyecto.tipoProyecto}
            onSelect={(selectedItem) => {
              onChange('tipoProyecto', selectedItem); 
              setShowTipoModal(false); 
            }}
          />
        </View>
      </Modal>
      {/* ... (otros modales de lista simple: Estado, Prioridad, Responsable) ... */}
      <Modal visible={showEstadoModal} animationType="fade" transparent={true} onRequestClose={() => setShowEstadoModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowEstadoModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={ESTADO_DATA}
            currentValue={proyecto.estado}
            onSelect={(selectedItem) => {
              onChange('estado', selectedItem);
              setShowEstadoModal(false);
            }}
          />
        </View>
      </Modal>
      <Modal visible={showPrioridadModal} animationType="fade" transparent={true} onRequestClose={() => setShowPrioridadModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowPrioridadModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={PRIORIDAD_DATA}
            currentValue={proyecto.prioridad}
            onSelect={(selectedItem) => {
              onChange('prioridad', selectedItem);
              setShowPrioridadModal(false);
            }}
          />
        </View>
      </Modal>
      <Modal visible={showResponsableModal} animationType="fade" transparent={true} onRequestClose={() => setShowResponsableModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowResponsableModal(false)} />
        <View style={styles.listPickerModal}>
          <SimplePickerList
            data={RESPONSABLE_DATA}
            currentValue={proyecto.responsableNombre}
            onSelect={(selectedItem) => {
              onChange('idResponsable', selectedItem.value);
              onChange('responsableNombre', selectedItem.label);
              setShowResponsableModal(false);
            }}
          />
        </View>
      </Modal>


      {/* --- MODALES DE FECHA (CON VALIDACIÓN APLICADA) --- */}
      <Modal visible={showInicioModal} animationType="fade" transparent={true} onRequestClose={() => setShowInicioModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowInicioModal(false)} />
        <View style={styles.datePickerModal}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => {
              onChange('diaInicio', tempDiaInicio);
              onChange('mesInicio', tempMesInicio);
              onChange('añoInicio', tempAñoInicio);
              setShowInicioModal(false);
            }}>
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dateModalContainer}>
            <View style={styles.dateInputColumn}>
              <Text style={styles.inputLabel}>Día</Text>
              <TextInput
                style={styles.dateInput}
                value={tempDiaInicio}
                onChangeText={(text) => handleDiaChange(text, setTempDiaInicio)} // <-- VALIDACIÓN
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
                value={tempMesInicio}
                onChangeText={(text) => handleMesChange(text, setTempMesInicio)} // <-- VALIDACIÓN
                keyboardType="numeric"
                maxLength={2}
                placeholder="M"
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.dateInputColumn}>
              <Text style={styles.inputLabel}>Año</Text>
              <TextInput
                style={styles.dateInput}
                value={tempAñoInicio}
                onChangeText={setTempAñoInicio} // <-- Sin validación
                keyboardType="numeric"
                maxLength={4}
                placeholder="AAAA"
                placeholderTextColor="#999"
              />
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showFinModal} animationType="fade" transparent={true} onRequestClose={() => setShowFinModal(false)}>
        <Pressable style={styles.pickerBackdrop} onPress={() => setShowFinModal(false)} />
        <View style={styles.datePickerModal}>
          <View style={styles.pickerHeader}>
            <TouchableOpacity onPress={() => {
              onChange('diaFin', tempDiaFin);
              onChange('mesFin', tempMesFin);
              onChange('añoFin', tempAñoFin);
              setShowFinModal(false);
            }}>
              <Text style={styles.pickerButtonText}>Hecho</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.dateModalContainer}>
            <View style={styles.dateInputColumn}>
              <Text style={styles.inputLabel}>Día</Text>
              <TextInput
                style={styles.dateInput}
                value={tempDiaFin}
                onChangeText={(text) => handleDiaChange(text, setTempDiaFin)} // <-- VALIDACIÓN
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
                value={tempMesFin}
                onChangeText={(text) => handleMesChange(text, setTempMesFin)} // <-- VALIDACIÓN
                keyboardType="numeric"
                maxLength={2}
                placeholder="M"
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.dateInputColumn}>
              <Text style={styles.inputLabel}>Año</Text>
              <TextInput
                style={styles.dateInput}
                value={tempAñoFin}
                onChangeText={setTempAñoFin} // <-- Sin validación
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
    color: "#ffffff",
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
    backgroundColor: "#e6e6e6"
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