import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Modal, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const METODO_PAGO_DATA = ["Efectivo", "Tarjeta", "Transferencia", "Cheque", "Por definir"];
const ITEM_HEIGHT = 44;
const CONTAINER_HEIGHT = 220;

// --- Componentes Reutilizables ---

const FormInput = React.memo(({ label, value, onChangeText, editable = true, multiline = false, onFocus, onBlur, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TouchableOpacity activeOpacity={editable ? 1 : 0.8}>
        <TextInput
          style={[styles.textInput, multiline && styles.multilineInput, !editable && styles.lockedInput]}
          value={value} onChangeText={onChangeText} editable={editable} multiline={multiline}
          onFocus={onFocus} onBlur={onBlur} placeholderTextColor="#999" textAlignVertical={multiline ? "top" : "center"} {...props}
        />
    </TouchableOpacity>
  </View>
));

const SelectInput = React.memo(({ label, value, onPress, editable = true }) => (
  <TouchableOpacity onPress={editable ? onPress : undefined} activeOpacity={editable ? 0.8 : 1}>
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={[styles.textInput, { justifyContent: "center" }, !editable && styles.lockedInput]}>
        <Text style={value ? styles.textInput_value : styles.textInput_placeholder}>{value || "Seleccione..."}</Text>
      </View>
    </View>
  </TouchableOpacity>
));

//  COMPONENTE FILE INPUT
const FileInput = React.memo(({ label, fileName, fileUrl, editable, modo, onSelectFile, onViewFile }) => {
    const isFilePresent = !!(fileName || fileUrl);
    
    // Permitimos subir/reemplazar en 'crear', 'agregar' Y 'editar'.
    // Solo se oculta en modo 'consultar' (cuando editable es false).
    const showUploadButton = editable; 
    
    let displayValue = "Sin archivo adjunto";
    if (fileName) displayValue = fileName;
    else if (fileUrl) displayValue = "Archivo Guardado (Click para ver)";
    else if (showUploadButton) displayValue = "Seleccionar PDF...";

    const handleViewPress = () => {
      if (fileUrl && onViewFile) {
          onViewFile(fileUrl);
      } else if (fileName) {
          Alert.alert("Info", "Archivo local seleccionado. Guarde para visualizar.");
      }
    };

    // Cálculo de anchos para los botones
    let inputWidth = '100%';
    if (isFilePresent && showUploadButton) inputWidth = '38%'; // Ver + Cambiar
    else if (isFilePresent) inputWidth = '65%'; // Solo Ver
    else if (showUploadButton) inputWidth = '70%'; // Solo Subir

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
          
          {/* Texto del archivo (Clickeable si hay archivo) */}
          <View style={[styles.textInput, styles.fileDisplay, { width: inputWidth }, !editable && { width: "100%" }]}>
            <Text 
                numberOfLines={1} 
                onPress={isFilePresent ? handleViewPress : undefined} 
                style={isFilePresent ? styles.fileTextActive : styles.textInput_placeholder}
            >
              {displayValue}
            </Text>
          </View>

          {/* Botón VER (Siempre que haya archivo) */}
          {isFilePresent && (
            <TouchableOpacity style={[styles.fileButton, styles.viewButton]} onPress={handleViewPress}>
              <Text style={styles.fileButtonText}>Ver</Text>
            </TouchableOpacity>
          )}

          {/* Botón SUBIR (Si es editable) */}
          {showUploadButton && (
            <TouchableOpacity style={[styles.fileButton, isFilePresent ? styles.replaceButton : styles.uploadButton]} onPress={onSelectFile}>
              <Text style={styles.fileButtonText}>{isFilePresent ? "Reemplazar" : "Subir PDF"}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
});

// --- Componente Lista Simple ---
const SimplePickerList = ({ data, onSelect, currentValue }) => (
  <ScrollView style={styles.simplePickerContainer}>
    {data.map((item, index) => {
      const label = typeof item === 'object' ? item.label : item;
      const isSelected = currentValue === label;
      return (
        <TouchableOpacity key={index} style={[styles.simplePickerItem, isSelected && styles.simplePickerItemSelected]} onPress={() => onSelect(item)}>
          <Text style={[styles.simplePickerItemText, isSelected && styles.simplePickerItemSelectedText]}>{label}</Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

// --- Formateador de Moneda ---
const formatCurrency = (value) => {
  const clean = (value || "").toString().replace(/[^0-9.]/g, '');
  if (!clean) return { display: "$ 0.00 MXN", numeric: "" };
  const num = parseFloat(clean);
  return isNaN(num) ? { display: "$ 0.00 MXN", numeric: "" } : { display: new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(num), numeric: clean };
};

// --- COMPONENTE PRINCIPAL ---
export default function FacturaFormView({ 
  factura = {}, 
  modo = "crear", 
  onChange, 
  onGuardar, 
  onRegresar, 
  clientes = [], 
  onFileSelect, 
  onViewFile,
  onTouchDisabled // Para modo consulta
}) {
  const editable = modo !== "consultar";
  
  const [showEmisionModal, setShowEmisionModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showMetodoPagoModal, setShowMetodoPagoModal] = useState(false);
  
  const [tempDia, setTempDia] = useState('');
  const [tempMes, setTempMes] = useState('');
  const [tempAño, setTempAño] = useState('');

  //  Formateo de Clientes para el Selector
  // Soporta 'nombre' o 'nombres' según venga de la BD
  const CLIENTE_DATA = clientes.map(cli => ({
    label: `${cli.nombre || cli.nombres || ''} ${cli.apellido_paterno || ''} ${cli.apellido_materno || ''} ${cli.rfc ? `(${cli.rfc})` : ''}`.trim(), 
    value: cli.id_cliente 
  }));

  const openEmisionModal = () => {
    setTempDia(factura.diaEmision || ''); setTempMes(factura.mesEmision || ''); setTempAño(factura.añoEmision || '');
    setShowEmisionModal(true);
  };

  const [displayMonto, setDisplayMonto] = useState(formatCurrency(factura.montoTotal).display);

  // Efecto para actualizar el monto si la factura cambia externamente
  React.useEffect(() => {
    setDisplayMonto(formatCurrency(factura.montoTotal).display);
  }, [factura.montoTotal]);

  // Manejo de toques en modo consulta
  const handleContainerPress = () => {
    if (!editable && onTouchDisabled) {
      onTouchDisabled();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Envolver en Pressable para detectar toques en modo consulta */}
      <Pressable style={{ flex: 1 }} onPress={handleContainerPress}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          
          <View style={styles.columnsContainer}>
            {/* Columna Izquierda */}
            <View style={styles.leftColumn}>
              <FormInput label="Folio" value={factura.numeroFolio} onChangeText={(v) => onChange('numeroFolio', v)} editable={editable} placeholder="A-001" onTouchStart={!editable ? onTouchDisabled : undefined} />
              
              <SelectInput label="Fecha Emisión" value={factura.diaEmision ? `${factura.diaEmision}/${factura.mesEmision}/${factura.añoEmision}` : ""} onPress={openEmisionModal} editable={editable} />
              
              <SelectInput label="Cliente" value={factura.clienteNombre} onPress={() => setShowClienteModal(true)} editable={editable} />
              
              <FormInput label="Monto Total" value={displayMonto} 
                  onChangeText={(t) => { 
                      const num = t.replace(/[^0-9.]/g, ''); 
                      setDisplayMonto(num); 
                      onChange('montoTotal', num); 
                  }} 
                  onBlur={() => setDisplayMonto(formatCurrency(factura.montoTotal).display)}
                  onFocus={() => setDisplayMonto(factura.montoTotal)}
                  editable={editable} keyboardType="numeric" 
                  onTouchStart={!editable ? onTouchDisabled : undefined}
              />
              
              <SelectInput label="Método Pago" value={factura.metodoPago} onPress={() => setShowMetodoPagoModal(true)} editable={editable} />
            </View>

            {/* Columna Derecha */}
            <View style={styles.rightColumn}>
              <FormInput label="Responsable" value={factura.responsableRegistro} editable={false} placeholder="Auto-asignado" />
              
              {/*  FILE INPUT INTEGRADO */}
              <FileInput 
                  label="Archivo Factura (PDF/XML)"
                  fileName={factura.archivo?.name}
                  fileUrl={typeof factura.archivo === 'string' ? factura.archivo : null}
                  editable={editable}
                  modo={modo}
                  onSelectFile={onFileSelect}
                  onViewFile={onViewFile}
              />
            </View>
          </View>

          {editable && (
            <View style={styles.finalButtonRow}>
            
              <TouchableOpacity style={[styles.finalButton, styles.guardarButton]} onPress={onGuardar}><Text style={styles.finalButtonText}>Guardar</Text></TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </Pressable>

      {/* Modales */}
      <Modal visible={showMetodoPagoModal} transparent animationType="fade">
          <Pressable style={styles.pickerBackdrop} onPress={() => setShowMetodoPagoModal(false)} />
          <View style={styles.listPickerModal}>
              <SimplePickerList data={METODO_PAGO_DATA} currentValue={factura.metodoPago} onSelect={(v) => { onChange('metodoPago', v); setShowMetodoPagoModal(false); }} />
          </View>
      </Modal>
      
      <Modal visible={showClienteModal} transparent animationType="fade">
          <Pressable style={styles.pickerBackdrop} onPress={() => setShowClienteModal(false)} />
          <View style={styles.listPickerModal}>
              <SimplePickerList data={CLIENTE_DATA} currentValue={factura.clienteNombre} onSelect={(v) => { onChange('idCliente', v.value); onChange('clienteNombre', v.label); setShowClienteModal(false); }} />
          </View>
      </Modal>
      
      <Modal visible={showEmisionModal} transparent animationType="fade">
         <Pressable style={styles.pickerBackdrop} onPress={() => setShowEmisionModal(false)} />
         <View style={styles.datePickerModal}>
            <View style={styles.pickerHeader}><TouchableOpacity onPress={() => { onChange('diaEmision', tempDia); onChange('mesEmision', tempMes); onChange('añoEmision', tempAño); setShowEmisionModal(false); }}><Text style={styles.pickerButtonText}>Hecho</Text></TouchableOpacity></View>
            <View style={styles.dateModalContainer}>
                <TextInput style={styles.dateInput} value={tempDia} onChangeText={setTempDia} placeholder="DD" keyboardType="numeric" maxLength={2}/>
                <TextInput style={styles.dateInput} value={tempMes} onChangeText={setTempMes} placeholder="MM" keyboardType="numeric" maxLength={2}/>
                <TextInput style={styles.dateInput} value={tempAño} onChangeText={setTempAño} placeholder="AAAA" keyboardType="numeric" maxLength={4}/>
            </View>
         </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 10 },
  columnsContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', },
  leftColumn: { width: '48%', minWidth: 300, marginBottom: 20 }, 
  rightColumn: { width: '48%', minWidth: 300 },
  
  inputContainer: { marginBottom: 18,  },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 },
  textInput: { backgroundColor: "#FFFFFF", borderColor: "#BDC3C7", borderWidth: 1, borderRadius: 12, padding: 12, color: "#333" },
  textInput_value: { color: '#333' },
  textInput_placeholder: { color: '#999' },
  lockedInput: { backgroundColor: "#e6e6e6" },
  multilineInput: { height: 80, textAlignVertical: 'top' },

  // Estilos FileInput
  fileDisplay: { justifyContent: 'center', height: 50 },
  fileTextActive: { color: "#006480", fontWeight: "500" },
  fileButton: { padding: 10, borderRadius: 12, marginLeft: 5, justifyContent: 'center', alignItems: 'center' },
  viewButton: { backgroundColor: "#0080ff", width: '30%' },
  replaceButton: { backgroundColor: "#d92a1c", width: '30%' },
  uploadButton: { backgroundColor: "green", width: '30%' },
  fileButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 12 },

  finalButtonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 30, marginBottom: 40, width: '100%' },
  finalButton: { paddingVertical: 12, paddingHorizontal: 25, borderRadius: 8, marginLeft: 10, alignItems: 'center' },
  regresarButton: { backgroundColor: '#6c757d' },
  guardarButton: { backgroundColor: '#77a7ab' },
  finalButtonText: { color: '#FFFFFF', fontSize: 15, fontWeight: '600' },
  
  pickerBackdrop: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.4)" },
  listPickerModal: { position: 'absolute', top: '20%', left: '10%', width: '80%', maxHeight: '60%', backgroundColor: '#2b3042', borderRadius: 20, padding: 10, elevation: 15 },
  simplePickerItem: { padding: 15, borderBottomWidth: 1, borderColor: '#3a3f50' },
  simplePickerItemText: { color: '#f0f0f0', textAlign: 'center', fontSize: 16 },
  simplePickerItemSelected: { backgroundColor: '#3a3f50' },
  datePickerModal: { position: 'absolute', top: '40%', left: '10%', width: '80%', backgroundColor: '#2b3042', borderRadius: 20, padding: 10 },
  pickerHeader: { alignItems: 'flex-end', padding: 10, borderBottomWidth: 1, borderColor: '#555' },
  pickerButtonText: { color: '#77a7ab', fontWeight: 'bold', fontSize: 16 },
  dateModalContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 20 },
  dateInput: { backgroundColor: '#3a3f50', color: '#FFF', borderRadius: 8, padding: 10, width: '30%', textAlign: 'center' }
});