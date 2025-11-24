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
  Modal 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FacturaFormView from "../../../../view/Modulo 2/SubModulos/Facturas/facturasform"; 
import { useEditarFacturaLogic } from "../../../../controller/Modulo 2/SubModulos/Facturas/editarfactura"; 

export default function EditarFacturaView({ navigation }) {

  const {
    terminoBusqueda,
    setTerminoBusqueda,
    factura,
    clientesList,
    facturasRecientes,
    isLoading,
    handleBuscarFactura,
    onChange,
    onGuardar,
    handleLimpiar,
    onFileSelect, 
    onViewFile,
    feedbackModal,      // <--- Estado del modal de lógica
    closeFeedbackModal  // <--- Función para cerrar
  } = useEditarFacturaLogic();

  // --- ESTADOS PARA EL MODAL DE NAVEGACIÓN (Local) ---
  const [navModalVisible, setNavModalVisible] = useState(false);
  const [navModalStep, setNavModalStep] = useState(1);

  // --- FUNCIÓN: Inicia el proceso de salida (Logo) ---
  const handleLogoPress = () => {
    setNavModalStep(1);
    setNavModalVisible(true);
  };

  // --- FUNCIÓN: Lógica del Modal de Navegación ---
  const handleNavModalConfirm = () => {
    if (navModalStep === 1) {
      setNavModalStep(2); 
    } else {
      setNavModalVisible(false);
      navigation.navigate("MenuPrincipal");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2b3042" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 80 }}
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
            <Text style={styles.headerTitle}>Editar Factura</Text>

            {/* --- BOTÓN DE RETROCEDER (Estilo Sólido) --- */}
            <TouchableOpacity 
                style={styles.backButtonHeader} 
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>Volver</Text>
            </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* --- CONTENEDOR CENTRALIZADO (WEB) --- */}
        <View style={styles.mainContentContainer}>

            {/* --- Barra de Búsqueda --- */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar por Folio..."
                    placeholderTextColor="#999"
                    value={terminoBusqueda}
                    onChangeText={setTerminoBusqueda}
                    editable={!factura} 
                />

                {/* Botón dinámico: Buscar o Limpiar */}
                {factura ? (
                    <TouchableOpacity
                    style={[styles.searchButton, styles.limpiarButton]}
                    onPress={handleLimpiar}
                    >
                    <Text style={styles.searchButtonText}>Limpiar</Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                    style={styles.searchButton}
                    onPress={() => handleBuscarFactura()}
                    >
                    <Text style={styles.searchButtonText}>Buscar</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* --- Loader --- */}
            {isLoading && (
                <ActivityIndicator size="large" color="#77a7ab" style={{ marginVertical: 20 }} />
            )}

            {/* --- FORMULARIO DE EDICIÓN --- */}
            {factura && !isLoading && (
                <View style={{ flex: 1, marginTop: 20, backgroundColor: '', borderRadius: 12, padding: 10 }}>
                    <Text style={{ textAlign: 'center', fontSize: 18, fontWeight: 'bold', marginBottom: 10, color: '#ffffffff'}}>
                        Editando Factura: {factura.numeroFolio}
                    </Text>
                    
                    <FacturaFormView
                        factura={factura}
                        modo="editar" 
                        onChange={onChange}
                        onGuardar={onGuardar}
                        clientes={clientesList} 
                        onRegresar={handleLimpiar} 
                        onFileSelect={onFileSelect} 
                        onViewFile={onViewFile}     
                    />
                </View>
            )}

            {/* --- LISTA DE RECIENTES --- */}
            {!factura && !isLoading && facturasRecientes.length > 0 && (
                <View style={styles.recientesContainer}>
                    <Text style={styles.recientesTitle}>Facturas Recientes</Text>
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

      {/* --------------------------------------------------------- */}
      {/* --- MODAL 1: SEGURIDAD DE NAVEGACIÓN (Local) --- */}
      {/* --------------------------------------------------------- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={navModalVisible}
        onRequestClose={() => setNavModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {navModalStep === 1 ? "Confirmar Navegación" : "Área Segura"}
            </Text>
            
            <Text style={styles.modalMessage}>
              {navModalStep === 1 
                ? "¿Desea salir de editar factura y volver al menú principal?" 
                : "Será redirigido al Menú Principal."}
            </Text>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]} 
                onPress={() => setNavModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>
                  {navModalStep === 1 ? "Cancelar" : "Permanecer"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonConfirm]} 
                onPress={handleNavModalConfirm}
              >
                <Text style={styles.modalButtonTextConfirm}>
                  {navModalStep === 1 ? "Sí, Volver" : "Confirmar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --------------------------------------------------------- */}
      {/* --- MODAL 2: FEEDBACK DE LÓGICA (Dinámico) --- */}
      {/* --------------------------------------------------------- */}
      {feedbackModal && feedbackModal.visible && (
        <Modal
          animationType="fade"
          transparent={true}
          visible={feedbackModal.visible}
          onRequestClose={closeFeedbackModal}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <Text style={[
                styles.modalTitle, 
                { color: feedbackModal.type === 'error' || feedbackModal.type === 'warning' ? '#d92a1c' : '#34495E' }
              ]}>
                {feedbackModal.title}
              </Text>
              
              <Text style={styles.modalMessage}>
                {feedbackModal.message}
              </Text>
              
              <View style={styles.modalButtonContainer}>
                {/* SI HAY callback (onConfirm), mostramos 2 botones */}
                {feedbackModal.onConfirm ? (
                  <>
                    <TouchableOpacity 
                      style={[styles.modalButton, styles.modalButtonCancel]} 
                      onPress={closeFeedbackModal}
                    >
                      <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      style={[styles.modalButton, styles.modalButtonSuccess]} 
                      onPress={feedbackModal.onConfirm}
                    >
                      <Text style={styles.modalButtonTextConfirm}>Confirmar</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  /* SI NO HAY callback, mostramos solo 1 botón (Entendido) */
                  <View style={{ width: '100%', alignItems: 'center' }}>
                     <TouchableOpacity 
                      style={[
                        styles.modalButton, 
                        styles.largeModalButton,
                        feedbackModal.type === 'error' ? styles.modalButtonConfirm : styles.modalButtonSuccess
                      ]} 
                      onPress={closeFeedbackModal}
                    >
                      <Text style={styles.modalButtonTextConfirm}>Entendido</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </Modal>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#2b3042", paddingHorizontal: 15, paddingTop: 5 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  headerIcon: { width: 60, height: 80, resizeMode: "contain", tintColor: "#FFFFFF" },
  headerTitle: { fontSize: 26, fontWeight: "700", marginLeft: 15, color: "#f7f3f3ff" },
  
  // --- Botón Volver ---
  backButtonHeader: {
    marginLeft: 'auto', 
    backgroundColor: "#77a7ab",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },

  divider: { height: 3, backgroundColor: "#d92a1c", marginVertical: 10, marginBottom: 20 },
  
  // --- Contenedor Web ---
  mainContentContainer: {
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
  },

  searchContainer: { flexDirection: "row", alignItems: "center", marginBottom: 10, },
  searchInput: { flex: 1, backgroundColor: "#FFFFFF", borderRadius: 12, paddingVertical: 10, paddingHorizontal: 15, fontSize: 15, color: "#333" },
  searchButton: { backgroundColor: "#77a7ab", borderRadius: 12, paddingVertical: 12, paddingHorizontal: 15, marginLeft: 10 },
  limpiarButton: { backgroundColor: "#E74C3C" },
  searchButtonText: { color: "#FFFFFF", fontSize: 15, fontWeight: "600" },
  
  recientesContainer: { marginHorizontal: 0, marginTop: 20, backgroundColor: "#3a3f50", borderRadius: 12, padding: 15 },
  recientesTitle: { fontSize: 18, fontWeight: "600", color: "#FFFFFF", marginBottom: 10, paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: "#5a5f70" },
  recienteItem: { backgroundColor: "#2b3042", paddingVertical: 12, paddingHorizontal: 15, borderRadius: 8, marginBottom: 10 },
  recienteItemText: { color: "#f0f0f0", fontSize: 16, fontWeight: "500" },
  recienteItemSubText: { color: "#bdc3c7", fontSize: 14, marginTop: 2 },

  // --- Estilos del Modal ---
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: 300,
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#34495E',
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 10,
  },
  modalButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '45%',
    alignItems: 'center',
  },
  largeModalButton: {
    width: '60%', 
  },
  modalButtonCancel: {
    backgroundColor: '#f0f0f0',
  },
  modalButtonConfirm: {
    backgroundColor: '#d92a1c', // Rojo
  },
  modalButtonSuccess: {
    backgroundColor: '#77a7ab', // Teal
  },
  modalButtonTextCancel: {
    color: '#333',
    fontWeight: 'bold',
  },
  modalButtonTextConfirm: {
    color: 'white',
    fontWeight: 'bold',
  },
});
