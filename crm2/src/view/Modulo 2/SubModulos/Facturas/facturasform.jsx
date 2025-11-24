import React, { useState, useEffect } from "react";
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Modal, 
  Pressable 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const METODO_PAGO_DATA = ["Efectivo", "Tarjeta", "Transferencia", "Cheque", "Por definir"];

// --- Componentes Reutilizables ---

const FormInput = React.memo(({ label, value, onChangeText, editable = true, multiline = false, onFocus, onBlur, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.inputLabel}>{label}</Text>
    <TouchableOpacity activeOpacity={editable ? 1 : 0.8} onPress={!editable ? props.onTouchStart : undefined}>
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
          onFocus={onFocus} 
          onBlur={onBlur} 
          placeholderTextColor="#999" 
          textAlignVertical={multiline ? "top" : "center"} 
          pointerEvents={!editable ? 'none' : 'auto'}
          {...props}
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

// COMPONENTE FILE INPUT
const FileInput = React.memo(({ label, fileName, fileUrl, editable, onSelectFile, onViewFile }) => {
    const isFilePresent = !!(fileName || fileUrl);
    const showUploadButton = editable; 
    
    let displayValue = "Sin archivo adjunto";
    if (fileName) displayValue = fileName;
    else if (fileUrl) displayValue = "Archivo Guardado (Click para ver)";
    else if (showUploadButton) displayValue = "Seleccionar PDF...";

    const handleViewPress = () => {
      if (onViewFile) {
          // Pasamos la URL o null si es local (el padre decidirá qué mensaje mostrar)
          onViewFile(fileUrl || null);
      }
    };

    // Cálculo de anchos
    let inputWidth = '100%';
    if (isFilePresent && showUploadButton) inputWidth = '38%'; 
    else if (isFilePresent) inputWidth = '65%'; 
    else if (showUploadButton) inputWidth = '68%'; 

    return (
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>{label}</Text>
        <View style={{ flexDirection: 'row', gap: 8, alignItems: 'center' }}>
          
          {/* Texto del archivo */}
          <View style={[styles.textInput, styles.fileDisplay, { width: inputWidth }, !editable && { width: "100%" }]}>
            <Text 
                numberOfLines={1} 
                onPress={isFilePresent ? handleViewPress : undefined} 
                style={isFilePresent ? styles.fileTextActive : styles.textInput_placeholder}
            >
              {displayValue}
            </Text>
          </View>

          {/* Botón VER */}
          {isFilePresent && (
            <TouchableOpacity style={[styles.fileButton, styles.viewButton]} onPress={handleViewPress}>
              <Text style={styles.fileButtonText}>Ver</Text>
            </TouchableOpacity>
          )}

          {/* Botón SUBIR */}
          {showUploadButton && (
            <TouchableOpacity style={[styles.fileButton, isFilePresent ? styles.replaceButton : styles.uploadButton]} onPress={onSelectFile}>
              <Text style={styles.fileButtonText}>{isFilePresent ? "Cambiar" : "Subir"}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
});

// --- Componente Lista Simple (Para Modales) ---
const SimplePickerList = ({ data, onSelect, currentValue }) => (
  <ScrollView style={{ width: '100%', maxHeight: 250 }}>
    {data.map((item, index) => {
      const label = typeof item === 'object' ? item.label : item;
      const isSelected = currentValue === label;
      return (
        <TouchableOpacity 
            key={index} 
            style={[styles.simplePickerItem, isSelected && styles.simplePickerItemSelected]} 
            onPress={() => onSelect(item)}
        >
          <Text style={[styles.simplePickerItemText, isSelected && styles.simplePickerItemSelectedText]}>
            {label}
          </Text>
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
  clientes = [], 
  onFileSelect, 
  onViewFile,
  onTouchDisabled 
}) {
  const editable = modo !== "consultar";
  
  const [showEmisionModal, setShowEmisionModal] = useState(false);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showMetodoPagoModal, setShowMetodoPagoModal] = useState(false);
  
  const [tempDia, setTempDia] = useState('');
  const [tempMes, setTempMes] = useState('');
  const [tempAño, setTempAño] = useState('');

  // Formateo de Clientes
  const CLIENTE_DATA = clientes.map(cli => ({
    label: `${cli.nombre || cli.nombres || ''} ${cli.apellido_paterno || ''} ${cli.apellido_materno || ''} ${cli.rfc ? `(${cli.rfc})` : ''}`.trim(), 
    value: cli.id_cliente 
  }));

  const openEmisionModal = () => {
    setTempDia(factura.diaEmision || ''); 
    setTempMes(factura.mesEmision || ''); 
    setTempAño(factura.añoEmision || '');
    setShowEmisionModal(true);
  };

  const [displayMonto, setDisplayMonto] = useState(formatCurrency(factura.montoTotal).display);

  useEffect(() => {
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
      <Pressable style={{ flex: 1 }} onPress={handleContainerPress}>
        <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
          
          <View style={styles.columnsContainer}>
            {/* Columna Izquierda */}
            <View style={styles.leftColumn}>
              <FormInput 
                label="Folio" 
                value={factura.numeroFolio} 
                onChangeText={(v) => onChange('numeroFolio', v)} 
                editable={editable} 
                placeholder="A-001" 
                onTouchStart={!editable ? onTouchDisabled : undefined} 
              />
              
              <SelectInput 
                label="Fecha Emisión" 
                value={factura.diaEmision ? `${factura.diaEmision}/${factura.mesEmision}/${factura.añoEmision}` : ""} 
                onPress={openEmisionModal} 
                editable={editable} 
              />
              
              <SelectInput 
                label="Cliente" 
                value={factura.clienteNombre} 
                onPress={() => setShowClienteModal(true)} 
                editable={editable} 
              />
              
              <FormInput 
                  label="Monto Total" 
                  value={displayMonto} 
                  onChangeText={(t) => { 
                      const num = t.replace(/[^0-9.]/g, ''); 
                      setDisplayMonto(num); 
                      onChange('montoTotal', num); 
                  }} 
                  onBlur={() => setDisplayMonto(formatCurrency(factura.montoTotal).display)}
                  onFocus={() => setDisplayMonto(factura.montoTotal)}
                  editable={editable} 
                  keyboardType="numeric" 
                  onTouchStart={!editable ? onTouchDisabled : undefined}
              />
              
              <SelectInput 
                label="Método Pago" 
                value={factura.metodoPago} 
                onPress={() => setShowMetodoPagoModal(true)} 
                editable={editable} 
              />
            </View>

            {/* Columna Derecha */}
            <View style={styles.rightColumn}>
              <FormInput label="Responsable" value={factura.responsableRegistro} editable={false} placeholder="Auto-asignado" />
              
              {/* FILE INPUT */}
              <FileInput 
                  label="Archivo Factura (PDF/XML)"
                  fileName={factura.archivo?.name}
                  fileUrl={typeof factura.archivo === 'string' ? factura.archivo : null}
                  editable={editable}
                  onSelectFile={onFileSelect}
                  onViewFile={onViewFile}
              />
            </View>
          </View>

          {editable && (
            <View style={styles.finalButtonRow}>
              <TouchableOpacity style={[styles.finalButton, styles.guardarButton]} onPress={onGuardar}>
                <Text style={styles.finalButtonText}>
                    {modo === "editar" ? "Guardar Cambios" : "Guardar Factura"}
                </Text>
              </TouchableOpacity>
            </View>
          )}

        </ScrollView>
      </Pressable>

      {/* --- MODALES ESTILO TARJETA (Web Friendly) --- */}

      {/* Modal Método Pago */}
      <Modal visible={showMetodoPagoModal} transparent animationType="fade" onRequestClose={() => setShowMetodoPagoModal(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setShowMetodoPagoModal(false)}>
            <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Método de Pago</Text>
                </View>
                <SimplePickerList 
                    data={METODO_PAGO_DATA} 
                    currentValue={factura.metodoPago} 
                    onSelect={(v) => { onChange('metodoPago', v); setShowMetodoPagoModal(false); }} 
                />
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowMetodoPagoModal(false)}>
                    <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                </TouchableOpacity>
            </View>
          </Pressable>
      </Modal>
      
      {/* Modal Cliente */}
      <Modal visible={showClienteModal} transparent animationType="fade" onRequestClose={() => setShowClienteModal(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setShowClienteModal(false)}>
            <View style={styles.modalCard}>
                <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>Seleccionar Cliente</Text>
                </View>
                <SimplePickerList 
                    data={CLIENTE_DATA} 
                    currentValue={factura.clienteNombre} 
                    onSelect={(v) => { onChange('idCliente', v.value); onChange('clienteNombre', v.label); setShowClienteModal(false); }} 
                />
                <TouchableOpacity style={styles.modalCloseButton} onPress={() => setShowClienteModal(false)}>
                    <Text style={styles.modalCloseButtonText}>Cerrar</Text>
                </TouchableOpacity>
            </View>
          </Pressable>
      </Modal>
      
      {/* Modal Fecha (Manual Entry mejorado) */}
      <Modal visible={showEmisionModal} transparent animationType="fade" onRequestClose={() => setShowEmisionModal(false)}>
         <Pressable style={styles.modalOverlay} onPress={() => setShowEmisionModal(false)}>
            <Pressable style={styles.modalCard} onPress={(e) => e.stopPropagation()}>
               <View style={styles.modalHeader}>
                   <Text style={styles.modalTitle}>Fecha de Emisión</Text>
                   <TouchableOpacity onPress={() => { onChange('diaEmision', tempDia); onChange('mesEmision', tempMes); onChange('añoEmision', tempAño); setShowEmisionModal(false); }}>
                       <Text style={styles.modalConfirmText}>Hecho</Text>
                   </TouchableOpacity>
               </View>
               <View style={styles.dateModalContainer}>
                   <View style={styles.dateInputGroup}>
                        <Text style={styles.dateLabel}>Día</Text>
                        <TextInput style={styles.dateInput} value={tempDia} onChangeText={setTempDia} placeholder="DD" keyboardType="numeric" maxLength={2}/>
                   </View>
                   <View style={styles.dateInputGroup}>
                        <Text style={styles.dateLabel}>Mes</Text>
                        <TextInput style={styles.dateInput} value={tempMes} onChangeText={setTempMes} placeholder="MM" keyboardType="numeric" maxLength={2}/>
                   </View>
                   <View style={styles.dateInputGroup}>
                        <Text style={styles.dateLabel}>Año</Text>
                        <TextInput style={styles.dateInput} value={tempAño} onChangeText={setTempAño} placeholder="AAAA" keyboardType="numeric" maxLength={4}/>
                   </View>
               </View>
            </Pressable>
         </Pressable>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 10 },
  columnsContainer: { flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', },
  leftColumn: { width: '48%', minWidth: 300, marginBottom: 20 }, 
  rightColumn: { width: '48%', minWidth: 300 },
  
  inputContainer: { marginBottom: 18 },
  inputLabel: { fontSize: 14, fontWeight: "600", color: "#ffffff", marginBottom: 8 },
  textInput: { backgroundColor: "#FFFFFF", borderColor: "#BDC3C7", borderWidth: 1, borderRadius: 12, padding: 12, color: "#333", fontSize: 15 },
  textInput_value: { color: '#333', fontSize: 15 },
  textInput_placeholder: { color: '#999', fontSize: 15 },
  lockedInput: { backgroundColor: "#e6e6e6" },
  multilineInput: { height: 80, textAlignVertical: 'top' },

  // Estilos FileInput
  fileDisplay: { justifyContent: 'center', height: 50 },
  fileTextActive: { color: "#006480", fontWeight: "500", fontSize: 14 },
  fileButton: { padding: 10, borderRadius: 12, justifyContent: 'center', alignItems: 'center', height: 50 },
  viewButton: { backgroundColor: "#0080ff", width: '30%' },
  replaceButton: { backgroundColor: "#d92a1c", width: '30%' },
  uploadButton: { backgroundColor: "green", width: '30%' },
  fileButtonText: { color: "#FFF", fontWeight: "bold", fontSize: 12 },

  finalButtonRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20, marginBottom: 40, width: '100%' },
  finalButton: { paddingVertical: 12, paddingHorizontal: 30, borderRadius: 25, marginLeft: 10, alignItems: 'center' },
  guardarButton: { backgroundColor: '#77a7ab' },
  finalButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  
  // --- ESTILOS MODAL TARJETA (WEB FRIENDLY) ---
  modalOverlay: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)", justifyContent: 'center', alignItems: 'center' },
  modalCard: { 
      backgroundColor: '#FFFFFF', 
      width: '90%', 
      maxWidth: 400, 
      borderRadius: 20, 
      padding: 0, 
      elevation: 10,
      shadowColor: '#000', shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 5,
      overflow: 'hidden'
  },
  modalHeader: { 
      backgroundColor: '#F8F9FA', 
      padding: 15, 
      borderBottomWidth: 1, 
      borderColor: '#EEE', 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'center' 
  },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  modalConfirmText: { color: '#006480', fontWeight: 'bold', fontSize: 16 },
  
  // Items del Picker
  simplePickerItem: { padding: 15, borderBottomWidth: 1, borderColor: '#F0F0F0' },
  simplePickerItemText: { color: '#333', textAlign: 'center', fontSize: 16 },
  simplePickerItemSelected: { backgroundColor: '#EEF2F3' },
  simplePickerItemSelectedText: { fontWeight: 'bold', color: '#006480' },
  
  modalCloseButton: { padding: 15, alignItems: 'center', borderTopWidth: 1, borderColor: '#EEE' },
  modalCloseButtonText: { color: '#d92a1c', fontSize: 16, fontWeight: '600' },

  // Date Picker Internals
  dateModalContainer: { flexDirection: 'row', justifyContent: 'space-around', padding: 20 },
  dateInputGroup: { alignItems: 'center', width: '30%' },
  dateLabel: { marginBottom: 5, color: '#555', fontWeight: '600' },
  dateInput: { 
      backgroundColor: '#FFF', 
      borderWidth: 1, 
      borderColor: '#CCC', 
      borderRadius: 8, 
      padding: 10, 
      width: '100%', 
      textAlign: 'center', 
      fontSize: 18, 
      color: '#333' 
  }
});
