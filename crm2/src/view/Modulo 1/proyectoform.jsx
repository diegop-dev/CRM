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
  Platform
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// --- CONSTANTES DE DATOS ---
const TIPO_DATA = ["Software", "Marketing", "Recursos Humanos", "Otro"];
const ESTADO_DATA = ["Iniciado", "En Progreso", "Completado", "Pausado"];
const PRIORIDAD_DATA = ["Baja", "Media", "Alta"];
const DIAS_DATA = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const MESES_DATA = Array.from({ length: 12 }, (_, i) => (i + 1).toString());
const AÑOS_DATA = Array.from({ length: 10 }, (_, i) => (2024 + i).toString());

// --- CONSTANTES DE ESTILO DEL PICKER ---
// Reducimos un poco la altura para que sea más "compacto" en web
const ITEM_HEIGHT = 40; 
const CONTAINER_HEIGHT = 160; 
const WHEEL_PADDING = (CONTAINER_HEIGHT - ITEM_HEIGHT) / 2;

// --- Componentes reutilizables ---

// (Componente de Input de Texto)
const FormInput = React.memo(({ label, value, onChangeText, editable = true, multiline = false, onTouchDisabled, ...props }) => (
  <TouchableOpacity onPress={!editable ? onTouchDisabled : undefined} activeOpacity={1}>
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
        pointerEvents={!editable ? 'none' : 'auto'}
        {...props}
      />
    </View>
  </TouchableOpacity>
));

// (Componente de Selector Táctil)
const SelectInput = React.memo(({ label, value, onPress, editable = true, onTouchDisabled }) => (
  <TouchableOpacity onPress={editable ? onPress : onTouchDisabled} activeOpacity={editable ? 0.8 : 1}>
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

// --- Componentes del Picker Modal ---

// (Item individual)
const JSPickerItem = ({ label, onPress, active }) => (
  <TouchableOpacity 
    style={styles.pickerItem} 
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[
      styles.pickerItemText, 
      active && styles.pickerItemTextActive // Resaltar si es el seleccionado
    ]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// (Rueda selectora INTELIGENTE)
const TumblerWheel = ({ data, onValueChange, value }) => {
  const ref = useRef(null);
  
  // Calcular índice inicial
  let initialIndex = data.indexOf(value);
  if (initialIndex < 0) initialIndex = 0;

  // Efecto para posicionar la lista al abrirse
  useEffect(() => {
    if (ref.current) {
        setTimeout(() => {
            ref.current.scrollTo({ y: initialIndex * ITEM_HEIGHT, animated: false });
        }, 100);
    }
  }, []);

  const handleScrollEnd = (e) => {
    const y = e.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < data.length) {
      const newValue = data[index];
      if (newValue !== value) {
        onValueChange(newValue);
      }
    }
  };

  // --- NUEVO: Función para seleccionar al hacer CLIC ---
  const handleItemPress = (item, index) => {
    onValueChange(item);
    if (ref.current) {
      ref.current.scrollTo({ y: index * ITEM_HEIGHT, animated: true });
    }
  };

  return (
    <View style={styles.wheelContainer}>
      <ScrollView
        ref={ref}
        style={styles.jsDatePickerColumn}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        contentContainerStyle={{ 
          paddingTop: WHEEL_PADDING, 
          paddingBottom: WHEEL_PADDING
        }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
      >
        {data.map((item, index) => (
          <JSPickerItem 
            key={`${item}_${index}`} 
            label={item} 
            active={item === value}
            onPress={() => handleItemPress(item, index)} 
          />
        ))}
      </ScrollView>
    </View>
  );
};


// --- Paso 1 ---
const Paso1 = ({ proyecto, onChange, editable, onTouchDisabled, onTipoPress, onInicioPress, onFinPress }) => (
  <>
    {proyecto.id_proyecto && (
      <FormInput 
        label="ID de Proyecto" 
        value={proyecto.id_proyecto.toString()} 
        editable={false} 
        onTouchDisabled={onTouchDisabled}
      />
    )}
    <FormInput
      label="Nombre del Proyecto"
      value={proyecto.nombreProyecto}
      onChangeText={(val) => onChange('nombreProyecto', val)}
      editable={editable}
      onTouchDisabled={onTouchDisabled}
    />
    <SelectInput
      label="Tipo de Proyecto"
      value={proyecto.tipoProyecto}
      onPress={onTipoPress}
      editable={editable}
      onTouchDisabled={onTouchDisabled}
    />
    <SelectInput
      label="Fecha de Inicio"
      value={
        proyecto.diaInicio && proyecto.mesInicio && proyecto.añoInicio
          ? `${proyecto.diaInicio}/${proyecto.mesInicio}/${proyecto.añoInicio}`
          : ""
      }
      onPress={onInicioPress}
      editable={editable}
      onTouchDisabled={onTouchDisabled}
    />
    <SelectInput
      label="Fecha de Fin"
      value={
        proyecto.diaFin && proyecto.mesFin && proyecto.añoFin
          ? `${proyecto.diaFin}/${proyecto.mesFin}/${proyecto.añoFin}`
          : ""
      }
      onPress={onFinPress}
      editable={editable}
      onTouchDisabled={onTouchDisabled}
    />
    <FormInput
      label="Descripción"
      value={proyecto.descripcion}
      onChangeText={(val) => onChange('descripcion', val)}
      multiline
      editable={editable}
      onTouchDisabled={onTouchDisabled}
    />
  </>
);

// --- Paso 2 ---
const Paso2 = ({ proyecto, onChange, onGuardar, editable, modo, onTouchDisabled, onResponsablePress, onEstadoPress, onPrioridadPress }) => (
  <>
    <SelectInput
      label="Responsable / Encargado"
      value={proyecto.responsableNombre || ""}
      onPress={onResponsablePress}
      editable={editable}
      onTouchDisabled={onTouchDisabled}
    />
    <SelectInput
      label="Estado"
      value={proyecto.estado}
      onPress={onEstadoPress}
      editable={editable}
      onTouchDisabled={onTouchDisabled}
    />
    <SelectInput
      label="Prioridad"
      value={proyecto.prioridad}
      onPress={onPrioridadPress}
      editable={editable}
      onTouchDisabled={onTouchDisabled}
    />
    <FormInput
      label="Recursos (uno por línea)"
      value={Array.isArray(proyecto.RecursosList) ? proyecto.RecursosList.join("\n") : ""}
      onChangeText={(text) => onChange('RecursosList', text.split("\n").filter(r => r.trim() !== ""))}
      multiline
      editable={editable}
      onTouchDisabled={onTouchDisabled}
    />
    {editable && (
      <TouchableOpacity style={styles.saveButton} onPress={onGuardar}>
        <Text style={styles.saveButtonText}>
          {modo === "editar" ? "Guardar Cambios" : "Guardar Proyecto"}
        </Text>
      </TouchableOpacity>
    )}
  </>
);

// --- Componente Principal ---
export default function ProyectoFormView({
  proyecto = {},
  modo = "crear",
  onChange,
  onGuardar,
  empleados = [],
  onTouchDisabled
}) {

  const [step, setStep] = useState(1);
  const editable = modo !== "consultar";

  // --- Estados de los Modales ---
  const [showTipoModal, setShowTipoModal] = useState(false);
  const [showInicioModal, setShowInicioModal] = useState(false);
  const [showFinModal, setShowFinModal] = useState(false);
  const [showResponsableModal, setShowResponsableModal] = useState(false);
  const [showEstadoModal, setShowEstadoModal] = useState(false);
  const [showPrioridadModal, setShowPrioridadModal] = useState(false);

  // --- Estados Temporales ---
  const [tempTipo, setTempTipo] = useState('');
  const [tempDiaInicio, setTempDiaInicio] = useState('');
  const [tempMesInicio, setTempMesInicio] = useState('');
  const [tempAñoInicio, setTempAñoInicio] = useState('');
  const [tempDiaFin, setTempDiaFin] = useState('');
  const [tempMesFin, setTempMesFin] = useState('');
  const [tempAñoFin, setTempAñoFin] = useState('');
  const [tempResponsable, setTempResponsable] = useState(null); 
  const [tempEstado, setTempEstado] = useState('');
  const [tempPrioridad, setTempPrioridad] = useState('');

  // --- Datos Responsable ---
  const RESPONSABLE_DATA = empleados.map(emp => ({
    label: `${emp.nombres} ${emp.apellido_paterno}`,
    value: emp.id_empleado
  }));
  const RESPONSABLE_LABELS = RESPONSABLE_DATA.map(r => r.label);

  // --- Funciones para Abrir Modales ---
  const openTipoModal = () => {
    setTempTipo(proyecto.tipoProyecto || TIPO_DATA[0]);
    setShowTipoModal(true);
  };
  const openEstadoModal = () => {
    setTempEstado(proyecto.estado || ESTADO_DATA[0]);
    setShowEstadoModal(true);
  };
  const openPrioridadModal = () => {
    setTempPrioridad(proyecto.prioridad || PRIORIDAD_DATA[0]);
    setShowPrioridadModal(true);
  };
  const openInicioModal = () => {
    setTempDiaInicio(proyecto.diaInicio || DIAS_DATA[0]);
    setTempMesInicio(proyecto.mesInicio || MESES_DATA[0]);
    setTempAñoInicio(proyecto.añoInicio || AÑOS_DATA[0]);
    setShowInicioModal(true);
  };
  const openFinModal = () => {
    setTempDiaFin(proyecto.diaFin || DIAS_DATA[0]);
    setTempMesFin(proyecto.mesFin || MESES_DATA[0]);
    setTempAñoFin(proyecto.añoFin || AÑOS_DATA[0]);
    setShowFinModal(true);
  };
  const openResponsableModal = () => {
    const currentLabel = proyecto.responsableNombre || (RESPONSABLE_LABELS.length > 0 ? RESPONSABLE_LABELS[0] : '');
    const currentValue = proyecto.idResponsable || (RESPONSABLE_DATA[0] ? RESPONSABLE_DATA[0].value : '');
    setTempResponsable({ label: currentLabel, value: currentValue });
    setShowResponsableModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.scrollContainer}
      >
        {step === 1 ? (
          <Paso1
            proyecto={proyecto}
            onChange={onChange}
            editable={editable}
            onTouchDisabled={onTouchDisabled}
            onTipoPress={editable ? openTipoModal : onTouchDisabled}
            onInicioPress={editable ? openInicioModal : onTouchDisabled}
            onFinPress={editable ? openFinModal : onTouchDisabled}
          />
        ) : (
          <Paso2
            proyecto={proyecto}
            onChange={onChange}
            onGuardar={onGuardar}
            editable={editable}
            modo={modo}
            onTouchDisabled={onTouchDisabled}
            onResponsablePress={editable ? openResponsableModal : onTouchDisabled}
            onEstadoPress={editable ? openEstadoModal : onTouchDisabled}
            onPrioridadPress={editable ? openPrioridadModal : onTouchDisabled}
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

      {/* --- MODALES OPTIMIZADOS --- */}
      
      {/* 1. Modal Tipo Proyecto */}
      <Modal visible={showTipoModal} animationType="fade" transparent={true} onRequestClose={() => setShowTipoModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowTipoModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Tipo de Proyecto</Text>
                    <TouchableOpacity onPress={() => { onChange('tipoProyecto', tempTipo); setShowTipoModal(false); }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsPickerContainer}>
                    <TumblerWheel data={TIPO_DATA} onValueChange={setTempTipo} value={tempTipo} />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
      </Modal>

      {/* 2. Modal Estado */}
      <Modal visible={showEstadoModal} animationType="fade" transparent={true} onRequestClose={() => setShowEstadoModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowEstadoModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Estado</Text>
                    <TouchableOpacity onPress={() => { onChange('estado', tempEstado); setShowEstadoModal(false); }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsPickerContainer}>
                    <TumblerWheel data={ESTADO_DATA} onValueChange={setTempEstado} value={tempEstado} />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
      </Modal>

      {/* 3. Modal Prioridad */}
      <Modal visible={showPrioridadModal} animationType="fade" transparent={true} onRequestClose={() => setShowPrioridadModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowPrioridadModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Prioridad</Text>
                    <TouchableOpacity onPress={() => { onChange('prioridad', tempPrioridad); setShowPrioridadModal(false); }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsPickerContainer}>
                    <TumblerWheel data={PRIORIDAD_DATA} onValueChange={setTempPrioridad} value={tempPrioridad} />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
      </Modal>

      {/* 4. Modal Fecha Inicio */}
      <Modal visible={showInicioModal} animationType="fade" transparent={true} onRequestClose={() => setShowInicioModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowInicioModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Fecha Inicio</Text>
                    <TouchableOpacity onPress={() => {
                        onChange('diaInicio', tempDiaInicio);
                        onChange('mesInicio', tempMesInicio);
                        onChange('añoInicio', tempAñoInicio);
                        setShowInicioModal(false);
                    }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsDatePickerContainer}>
                    <TumblerWheel data={DIAS_DATA} onValueChange={setTempDiaInicio} value={tempDiaInicio} />
                    <TumblerWheel data={MESES_DATA} onValueChange={setTempMesInicio} value={tempMesInicio} />
                    <TumblerWheel data={AÑOS_DATA} onValueChange={setTempAñoInicio} value={tempAñoInicio} />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
      </Modal>

      {/* 5. Modal Fecha Fin */}
      <Modal visible={showFinModal} animationType="fade" transparent={true} onRequestClose={() => setShowFinModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowFinModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Fecha Fin</Text>
                    <TouchableOpacity onPress={() => {
                        onChange('diaFin', tempDiaFin);
                        onChange('mesFin', tempMesFin);
                        onChange('añoFin', tempAñoFin);
                        setShowFinModal(false);
                    }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsDatePickerContainer}>
                    <TumblerWheel data={DIAS_DATA} onValueChange={setTempDiaFin} value={tempDiaFin} />
                    <TumblerWheel data={MESES_DATA} onValueChange={setTempMesFin} value={tempMesFin} />
                    <TumblerWheel data={AÑOS_DATA} onValueChange={setTempAñoFin} value={tempAñoFin} />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
      </Modal>

      {/* 6. Modal Responsable */}
      <Modal visible={showResponsableModal} animationType="fade" transparent={true} onRequestClose={() => setShowResponsableModal(false)}>
        <Pressable style={styles.pickerOverlay} onPress={() => setShowResponsableModal(false)}>
            <Pressable style={styles.pickerCard} onPress={(e) => e.stopPropagation()}>
                <View style={styles.pickerHeader}>
                    <Text style={styles.pickerTitle}>Responsable</Text>
                    <TouchableOpacity onPress={() => {
                        const selectedLabel = tempResponsable ? tempResponsable.label : RESPONSABLE_LABELS[0];
                        const selectedData = RESPONSABLE_DATA.find(r => r.label === selectedLabel) || RESPONSABLE_DATA[0];
                        if (selectedData) {
                            onChange('idResponsable', selectedData.value);
                            onChange('responsableNombre', selectedData.label);
                        }
                        setShowResponsableModal(false);
                    }}>
                        <Text style={styles.pickerButtonText}>Hecho</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.jsPickerContainer}>
                    <TumblerWheel
                        data={RESPONSABLE_LABELS}
                        onValueChange={(label) => setTempResponsable({ ...tempResponsable, label })}
                        value={tempResponsable ? tempResponsable.label : ''}
                    />
                    <View style={styles.pickerHighlight} pointerEvents="none" />
                </View>
            </Pressable>
        </Pressable>
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
  navButton: { 
    flex: 1, 
    borderRadius: 25, 
    paddingVertical: 12, 
    alignItems: "center", 
    marginHorizontal: 5 
  },
  backButton: { backgroundColor: "#006480" },
  nextButton: { backgroundColor: "#77a7ab" },
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

  // --- NUEVOS ESTILOS DEL PICKER OPTIMIZADOS PARA WEB ---
  
  // Overlay: Centra el contenido en lugar de pegarlo abajo
  pickerOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: 'center', // Centrado Vertical
    alignItems: 'center',     // Centrado Horizontal
  },
  
  // Card: Tarjeta flotante en lugar de Sheet completa
  pickerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    width: '90%',     // No ocupa todo el ancho
    maxWidth: 400,    // Límite para pantallas grandes (Web)
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
    justifyContent: 'space-between', // Título a la izq, Botón a la der
    alignItems: 'center',
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#006480", // Color acorde al tema
    fontWeight: "bold",
  },
  
  jsPickerContainer: {
    height: CONTAINER_HEIGHT,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    width: '100%',
  },
  jsDatePickerContainer: {
    flexDirection: "row",
    height: CONTAINER_HEIGHT,
    backgroundColor: '#FFFFFF',
    position: 'relative',
    overflow: 'hidden',
  },
  wheelContainer: {
    flex: 1,
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
    color: "#999", // Color por defecto apagado
  },
  pickerItemTextActive: {
    color: "#000", // Color activo oscuro
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
    backgroundColor: 'rgba(119, 167, 171, 0.15)', // Color tema muy suave
    borderRadius: 8,
    pointerEvents: 'none',
  },
});
