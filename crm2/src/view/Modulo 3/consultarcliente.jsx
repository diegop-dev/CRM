import React, { useState } from "react"; // <-- Importamos useState
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal, // <-- Importamos Modal
  Pressable, // <-- Importamos Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ClientesFormView from "../../view/Modulo 3/clientesform";
import { useConsultarClienteLogic } from "../../controller/Modulo 3/consultarcliente";

export default function ConsultarClienteView() {
  const navigation = useNavigation();

  const {
    terminoBusqueda, 
    setTerminoBusqueda, 
    cliente, 
    loading,
    editable,
    buscarCliente, 
    deseleccionarCliente,
    modalInfo, // <-- Obtenemos el estado del modal
    closeModal, // <-- Obtenemos la función de cierre
  } = useConsultarClienteLogic();

  // --- Estados del Modal de Navegación ---
  const [isNavModalVisible, setNavModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1); 

  // --- Handlers del Modal de Navegación ---
  const handleModalCancel = () => {
    setNavModalVisible(false);
  };
  const handleModalConfirmStep1 = () => {
    setModalStep(2); 
  };
  const handleModalConfirmStep2 = () => {
    navigation.navigate("EditarCliente", { cliente });
    setNavModalVisible(false);
  };

  const handleTouchDisabled = () => {
    if (!editable && cliente) {
      // --- CAMBIO: Abre el modal de navegación ---
      setModalStep(1);
      setNavModalVisible(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* 🔹 Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/LOGO_BLANCO.png")}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Consultar Cliente</Text>
        </View>

        <View style={styles.divider} />

        {/* 🔹 Contenedor principal para centrar */}
        <View style={styles.mainContentArea}>

          {!cliente && (
            <>
              <Text style={styles.label}>Buscar por nombre de cliente:</Text>
              <View style={styles.searchBox}>
                <TextInput
                  style={styles.searchInput} // <-- ESTILO ACTUALIZADO
                  placeholder="Ejemplo: Juan Pérez"
                  placeholderTextColor="#999" // <-- Placeholder
                  value={terminoBusqueda}
                  onChangeText={setTerminoBusqueda}
                />
                <TouchableOpacity
                  style={[styles.searchButton, loading && { opacity: 0.6 }]} // <-- ESTILO ACTUALIZADO
                  onPress={buscarCliente}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" />
                  ) : (
                    <Text style={styles.searchButtonText}>Buscar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}

          {cliente && (
            <View style={styles.resultContainer}> {/* <-- ESTILO ACTUALIZADO */}
              <TouchableOpacity
                onPress={deseleccionarCliente}
                style={styles.regresarButton}
              >
                <Text style={styles.regresarButtonText}>{"< Volver a la búsqueda"}</Text>
              </TouchableOpacity>
              <Text style={styles.resultTitle}>Datos del Cliente</Text>
              <ClientesFormView
                modo="consultar"
                cliente={cliente}
                onTouchDisabled={handleTouchDisabled}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* --- MODAL DE ALERTA DE BÚSQUEDA --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalInfo.visible}
        onRequestClose={closeModal}
      >
        <Pressable style={styles.pickerBackdrop} onPress={closeModal} />
        <View style={styles.alertModalContainer}>
          <Text style={styles.modalTitle}>{modalInfo.title}</Text>
          <Text style={styles.modalMessage}>{modalInfo.message}</Text>
          <View style={styles.modalButtonContainer}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonConfirm, { width: '100%' }]}
              onPress={closeModal}
            >
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* --- MODAL DE NAVEGACIÓN A EDITAR --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isNavModalVisible}
        onRequestClose={handleModalCancel}
      >
        <Pressable style={styles.pickerBackdrop} onPress={handleModalCancel} />
        <View style={styles.alertModalContainer}>
          {modalStep === 1 ? (
            <>
              <Text style={styles.modalTitle}>Modo consulta</Text>
              <Text style={styles.modalMessage}>¿Desea editar este cliente?</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={handleModalCancel}
                >
                  <Text style={styles.modalButtonText}>No</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={handleModalConfirmStep1}
                >
                  <Text style={styles.modalButtonText}>Sí</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.modalTitle}>Área segura</Text>
              <Text style={styles.modalMessage}>¿Desea ser dirigido al área segura para editar cliente?</Text>
              <View style={styles.modalButtonContainer}>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonCancel]}
                  onPress={handleModalCancel}
                >
                  <Text style={styles.modalButtonText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalButtonConfirm]}
                  onPress={handleModalConfirmStep2}
                >
                  <Text style={styles.modalButtonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </Modal>

      {/* --- BOTÓN FLOTANTE DE REGRESO --- */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

// Estilos 
// ... (código de importaciones y componente ConsultarClienteView) ...

// --- ESTILOS ACTUALIZADOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  container: {
    flex: 1,
  },
  scrollContainer: { 
    paddingTop: 5,
    paddingBottom: 80, 
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  headerIcon: { 
    width: 60, 
    height: 80, 
    resizeMode: "contain", 
    tintColor: "#ffffff" 
  },
  headerTitle: { 
    fontSize: 25, 
    fontWeight: "700", 
    marginLeft: 15, 
    color: "#ffffff" 
  },
  divider: { 
    height: 3, 
    backgroundColor: "#d92a1c", 
    marginVertical: 1,
    marginBottom: 30, // <-- Mantener este margen
  },
  mainContentArea: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    paddingHorizontal: 15,
    // Eliminamos el padding vertical aquí ya que el label se moverá al searchBox
  },
  // --- CAMBIOS CLAVE AQUÍ PARA EL DISEÑO DE BÚSQUEDA ---
  label: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#ffffff", 
    // marginBottom: 10, // <-- ELIMINAMOS O REDUCIMOS ESTE MARGEN
    marginRight: 10, // <-- AÑADIMOS MARGEN A LA DERECHA PARA SEPARAR DEL INPUT
  },
  searchBox: { 
    flexDirection: "row", 
    alignItems: "center", // <-- Asegura que todos los elementos estén centrados verticalmente
    // gap: 10, // <-- Esto está bien, o puedes usar justifyContent: 'space-between' / 'flex-start'
    marginBottom: 20, // <-- Añadimos un margen inferior a la caja de búsqueda
  },
  searchInput: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderColor: "#BDC3C7",
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#333",
  },
  searchButton: {
    backgroundColor: "#77a7ab",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginLeft: 10, // <-- Un pequeño margen a la izquierda del botón
  },
  searchButtonText: { color: "#fff", fontWeight: "600" },
  // --- FIN DE CAMBIOS DE BÚSQUEDA ---

  recientesContainer: {
    marginHorizontal: 0, 
    marginTop: 20,
    backgroundColor: "#3a3f50", 
    borderRadius: 12,
    padding: 15,
  },
  recientesTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#5a5f70",
  },
  recienteItem: {
    backgroundColor: "#2b3042",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  recienteItemText: {
    color: "#f0f0f0",
    fontSize: 16,
  },
  resultContainer: {
    backgroundColor: "#3a3f50", 
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    elevation: 2,
  },
  resultTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    marginBottom: 10,
    color: "#ffffff", 
  },
  regresarButton: {
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  regresarButtonText: {
    fontSize: 16,
    color: "#77a7ab", 
    fontWeight: '500',
  },
  backButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#77a7ab', 
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25, 
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  pickerBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  alertModalContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -175 }, { translateY: -125 }], 
    width: 350, 
    backgroundColor: '#2b3042', 
    borderRadius: 20,
    padding: 20,
    elevation: 15,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: '#f0f0f0',
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    width: '48%',
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#6c757d', 
  },
  modalButtonConfirm: {
    backgroundColor: '#77a7ab', 
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});