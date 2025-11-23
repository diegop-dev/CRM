import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Pressable,
  Alert,
  Linking
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// --- IMPORTACIONES ---
import FacturaFormView from "../../../../view/Modulo 2/SubModulos/Facturas/facturasform";
import { useConsultarFacturaLogic } from "../../../../controller/Modulo 2/SubModulos/Facturas/consultarfactura"; 
import { API_URL } from "../../../../config/apiConfig"; 

export default function ConsultarFacturaView() {
  
  const navigation = useNavigation();
  
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    factura,            
    clientesList,       
    facturasRecientes,  
    isLoading,
    handleBuscarFactura,
    handleLimpiar,
    navegarAEditar,     
    onChange,           
  } = useConsultarFacturaLogic();

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1);

  const handleModalCancel = () => setModalVisible(false);
  const handleModalConfirmStep1 = () => setModalStep(2);
  const handleModalConfirmStep2 = () => {
    setModalVisible(false);
    navegarAEditar(); 
  };
  
  const handleTouchDisabled = () => {
    if (!factura) return;
    setModalStep(1);
    setModalVisible(true);
  };

  const handleLogoPress = () => {
    Alert.alert(
      "Confirmar Navegación",
      "¿Desea salir del módulo y volver al menú principal?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Sí, Volver", onPress: () => navigation.navigate("MenuPrincipal") },
      ],
      { cancelable: true }
    );
  };

  const handleViewFile = async (fileUrl) => {
    if (!fileUrl) {
      Alert.alert("Aviso", "Esta factura no tiene un archivo adjunto.");
      return;
    }
    const fullUrl = `${API_URL}${fileUrl}`;

    Alert.alert(
        "Visualizar Factura", 
        `Se abrirá el archivo externamente.`,
        [
            { text: "Cancelar", style: "cancel" },
            { 
                text: "Abrir", 
                onPress: async () => {
                    const supported = await Linking.canOpenURL(fullUrl);
                    if (supported) await Linking.openURL(fullUrl);
                    else Alert.alert("Error", "No se puede abrir el archivo.");
                }
            }
        ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Encabezado */}
        <View style={styles.header}>
            <TouchableOpacity onPress={handleLogoPress}>
              <Image
                source={require("../../../../../assets/LOGO_BLANCO.png")}
                style={styles.headerIcon}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Consultar Factura</Text>
        </View>
        <View style={styles.divider} />

        {/* Contenedor Principal para limitar el ancho */}
        <View style={styles.mainContent}>

            {/* --- BARRA DE BÚSQUEDA (Siempre Visible) --- */}
            <View>
                <Text style={styles.label}>Buscar por Número de Folio:</Text>
                <View style={styles.searchBox}>
                  <TextInput
                    style={styles.input}
                    placeholder="Ej: F-001..."
                    placeholderTextColor="#999"
                    value={terminoBusqueda}
                    onChangeText={setTerminoBusqueda}
                    // Si hay factura, bloqueamos la edición manual para obligar a limpiar primero, o permitimos editar para nueva búsqueda
                    // Aquí permitimos editar para nueva búsqueda fluida
                  />
                  
                  {/* Botón Dinámico: Buscar o Limpiar */}
                  {factura ? (
                    <TouchableOpacity
                        style={[styles.button, styles.limpiarButton]}
                        onPress={handleLimpiar}
                    >
                        <Text style={styles.buttonText}>Limpiar</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                        style={[styles.button, isLoading && { opacity: 0.6 }]}
                        onPress={() => handleBuscarFactura()}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                        <ActivityIndicator color="#fff" />
                        ) : (
                        <Text style={styles.buttonText}>Buscar</Text>
                        )}
                    </TouchableOpacity>
                  )}
                </View>
            </View>

            {/* Loader Global */}
            {isLoading && !factura && (
                <ActivityIndicator size="large" color="#77a7ab" style={{ marginVertical: 20 }} />
            )}

            {/* --- FORMULARIO DE DETALLE (Si hay factura seleccionada) --- */}
            {factura && !isLoading && (
            <View style={styles.resultContainer}>
                <Text style={styles.resultTitle}>Detalle de Factura</Text>

                <FacturaFormView
                factura={factura}
                modo="consultar" 
                onChange={onChange} 
                onGuardar={() => {}} 
                clientes={clientesList}
                onViewFile={handleViewFile}
                onTouchDisabled={handleTouchDisabled}
                />
            </View>
            )}

            {/* --- LISTA DE RECIENTES (Solo si no hay selección) --- */}
            {!factura && !isLoading && (
                <View style={styles.recientesContainer}>
                <Text style={styles.recientesTitle}>
                    {facturasRecientes.length > 0 ? "Facturas Recientes" : "No hay facturas recientes"}
                </Text>
                {facturasRecientes.map(f => (
                    <TouchableOpacity
                    key={f.id_factura}
                    style={styles.recienteItem}
                    onPress={() => {
                        setTerminoBusqueda(f.numero_factura);
                        handleBuscarFactura(f.numero_factura);
                    }}
                    >
                    <Text style={styles.recienteItemText}>{`Folio: ${f.numero_factura}`}</Text>
                    <Text style={styles.recienteItemSubText}>{`Monto: $${f.monto_total}`}</Text>
                    </TouchableOpacity>
                ))}
                </View>
            )}
        </View>
      </ScrollView>

      {/* --- MODAL DE CONFIRMACIÓN --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleModalCancel}
      >
        <Pressable style={styles.pickerBackdrop} onPress={handleModalCancel} />
        <View style={styles.alertModalContainer}>
          {modalStep === 1 ? (
            <>
              <Text style={styles.modalTitle}>Modo consulta</Text>
              <Text style={styles.modalMessage}>¿Desea editar esta factura?</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={handleModalCancel}>
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonConfirm]} onPress={handleModalConfirmStep1}>
                  <Text style={styles.modalButtonText}>Sí</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.modalTitle}>Área segura</Text>
              <Text style={styles.modalMessage}>Será dirigido al área segura de edición. ¿Continuar?</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonCancel]} onPress={handleModalCancel}>
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.modalButtonConfirm]} onPress={handleModalConfirmStep2}>
                  <Text style={styles.modalButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>

      {/* Botón Flotante Regresar */}
      

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  container: { flex: 1 },
  scrollContainer: { paddingVertical: 20 },
  
  // Contenedor principal para centrar y limitar ancho en tablets/PC
  mainContent: {
      width: '100%',
      maxWidth: 800, // Limita el ancho máximo
      alignSelf: 'center',
      paddingHorizontal: 15,
  },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 10, paddingHorizontal: 15 },
  headerIcon: { width: 60, height: 80, resizeMode: "contain", tintColor: "#ffffff" },
  headerTitle: { fontSize: 25, fontWeight: "700", marginLeft: 15, color: "#ffffff" },
  divider: { height: 3, backgroundColor: "#d92a1c", marginVertical: 10, marginBottom: 20 },
  
  label: { fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 10 },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D0D3D4",
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 12,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#006480",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 100,
  },
  limpiarButton: {
    backgroundColor: "#E74C3C", // Rojo para limpiar
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  
  // Estilos de Lista Recientes
  recientesContainer: { backgroundColor: "#3a3f50", borderRadius: 12, padding: 15, marginTop: 10 },
  recientesTitle: { fontSize: 18, fontWeight: "600", color: "#FFFFFF", marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#5a5f70" },
  recienteItem: { backgroundColor: "#2b3042", paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8, marginBottom: 10 },
  recienteItemText: { color: "#f0f0f0", fontSize: 16, fontWeight: "500" },
  recienteItemSubText: { color: "#bdc3c7", fontSize: 14, marginTop: 2 },

  // Estilos Resultado
  resultContainer: {
    backgroundColor: "",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15, color: "#ffffffff", textAlign: 'center' },
  regresarButton: { marginBottom: 15, alignSelf: "flex-start" },
  regresarButtonText: { fontSize: 16, color: "#007AFF", fontWeight: "500",  },
  
  // Botón flotante
  backButton: { position: 'absolute', bottom: 30, right: 20, backgroundColor: '#77a7ab', paddingVertical: 12, paddingHorizontal: 25, borderRadius: 25, elevation: 8 },
  backButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#2b3042" },
  loadingText: { color: "#fff", marginTop: 10 },

  // Estilos Modal
  pickerBackdrop: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.4)" },
  alertModalContainer: { position: 'absolute', top: '40%', alignSelf: 'center', width: '80%', maxWidth: 400, backgroundColor: '#2b3042', borderRadius: 20, padding: 20, elevation: 15, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#f0f0f0', marginBottom: 10 },
  modalMessage: { fontSize: 16, color: '#f0f0f0', textAlign: 'center', marginBottom: 25 },
  modalButtonContainer: { flexDirection: 'row', justifyContent: 'space-between', width: '100%' },
  modalButton: { borderRadius: 10, paddingVertical: 10, width: '45%', alignItems: 'center' },
  modalButtonCancel: { backgroundColor: '#6c757d' },
  modalButtonConfirm: { backgroundColor: '#77a7ab' },
  modalButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});