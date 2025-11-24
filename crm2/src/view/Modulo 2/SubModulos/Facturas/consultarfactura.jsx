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
  Modal // <--- Importamos Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// --- IMPORTACIONES ---
import FacturaFormView from "../../../../view/Modulo 2/SubModulos/Facturas/facturasform";
import { useConsultarFacturaLogic } from "../../../../controller/Modulo 2/SubModulos/Facturas/consultarfactura"; 

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
    handleViewFile, // Traemos la función para ver archivos
    feedbackModal,      // <--- Estado del modal de lógica
    closeFeedbackModal  // <--- Función para cerrar           
  } = useConsultarFacturaLogic();

  // --- ESTADOS LOCALES PARA MODALES ---
  // 1. Navegación (Salir)
  const [navModalVisible, setNavModalVisible] = useState(false);
  const [navModalStep, setNavModalStep] = useState(1);

  // 2. Edición (Ir a Editar)
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editStep, setEditStep] = useState(1);

  // --- LOGO PRESS (Salir) ---
  const handleLogoPress = () => {
    setNavModalStep(1);
    setNavModalVisible(true);
  };

  const handleNavModalConfirm = () => {
    if (navModalStep === 1) {
      setNavModalStep(2);
    } else {
      setNavModalVisible(false);
      navigation.navigate("MenuPrincipal");
    }
  };

  // --- TOUCH DISABLED (Ir a Editar) ---
  const handleTouchDisabled = () => {
    if (factura) {
      setEditStep(1);
      setEditModalVisible(true);
    }
  };

  const handleEditModalConfirm = () => {
    if (editStep === 1) {
      setEditStep(2); 
    } else {
      setEditModalVisible(false);
      navegarAEditar();
    }
  };

  // Loader inicial
  if (isLoading && !factura && (!facturasRecientes || facturasRecientes.length === 0)) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d92a1c" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </SafeAreaView>
    );
  }

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

            {/* --- BARRA DE BÚSQUEDA --- */}
            <Text style={styles.label}>Buscar por Número de Folio:</Text>
            <View style={styles.searchBox}>
                <TextInput
                style={styles.input}
                placeholder="Ej: F-001..."
                placeholderTextColor="#999"
                value={terminoBusqueda}
                onChangeText={setTerminoBusqueda}
                />
                
                {/* Botón Dinámico */}
                <TouchableOpacity
                    style={[
                        styles.button, 
                        isLoading && { opacity: 0.6 },
                        factura && { backgroundColor: "#d92a1c" } // Rojo si es Limpiar
                    ]}
                    onPress={factura ? handleLimpiar : () => handleBuscarFactura()}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>
                            {factura ? "Limpiar" : "Buscar"}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* --- LISTA DE RECIENTES --- */}
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

            {/* --- DETALLE DE FACTURA --- */}
            {factura && !isLoading && (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>Detalle de Factura</Text>

                    <FacturaFormView
                        factura={factura}
                        modo="consultar" 
                        onChange={onChange} 
                        onGuardar={() => {}} 
                        clientes={clientesList}
                        onViewFile={handleViewFile} // Pasa la función para ver archivo
                        onTouchDisabled={handleTouchDisabled} // Activa modal de edición
                    />
                </View>
            )}

        </View>
      </ScrollView>

      {/* --------------------------------------------------------- */}
      {/* --- MODAL 1: SEGURIDAD DE NAVEGACIÓN (Salir) --- */}
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
                ? "¿Desea salir del módulo y volver al menú principal?" 
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
      {/* --- MODAL 2: CONFIRMACIÓN DE EDICIÓN (Ir a Editar) --- */}
      {/* --------------------------------------------------------- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {editStep === 1 ? "Modo Consulta" : "Área Segura"}
            </Text>
            
            <Text style={styles.modalMessage}>
              {editStep === 1 
                ? "¿Desea editar esta factura?" 
                : "Será dirigido al área segura de edición. ¿Continuar?"}
            </Text>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]} 
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>
                    {editStep === 1 ? "No" : "Cancelar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSuccess]} 
                onPress={handleEditModalConfirm}
              >
                <Text style={styles.modalButtonTextConfirm}>
                    {editStep === 1 ? "Sí" : "Confirmar"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --------------------------------------------------------- */}
      {/* --- MODAL 3: FEEDBACK (Errores/Info de Logic) --- */}
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
              
              <View style={{ width: '100%', alignItems: 'center' }}>
                
                {/* Si el modal tiene callback (onConfirm), mostramos 2 botones (ej. abrir archivo) */}
                {feedbackModal.onConfirm ? (
                    <View style={styles.modalButtonContainer}>
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
                            <Text style={styles.modalButtonTextConfirm}>Aceptar</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
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
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  container: { flex: 1 },
  scrollContainer: { paddingVertical: 20 },
  
  // Contenedor principal para centrar y limitar ancho en tablets/PC
  mainContentContainer: {
      width: '100%',
      maxWidth: 800, // Limita el ancho máximo
      alignSelf: 'center',
      paddingHorizontal: 15,
  },

  header: { flexDirection: "row", alignItems: "center", marginBottom: 10, paddingHorizontal: 15 },
  headerIcon: { width: 60, height: 80, resizeMode: "contain", tintColor: "#ffffff" },
  headerTitle: { fontSize: 25, fontWeight: "700", marginLeft: 15, color: "#ffffff" },
  
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
  
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#2b3042" },
  loadingText: { color: "#fff", marginTop: 10 },

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
