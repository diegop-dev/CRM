import React, { useState } from "react"; 
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ActivityIndicator,
  Modal, 
  Pressable, 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import EmpleadosFormView from "../Empleados/empleadosform";
// Esta es la única importación que haces al controlador
import { useConsultarEmpleadoLogic } from "../../../../controller/Modulo 2/SubModulos/Empleados/consultarempleado";

export default function ConsultarEmpleadoView() {
  const navigation = useNavigation();

  const {
    nombreUsuario,
    setNombreUsuario,
    empleado,
    loading,
    editable,
    buscarEmpleado,
    deseleccionarEmpleado,
  } = useConsultarEmpleadoLogic(); // <-- Se llama al hook

  // Estados del Modal
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1); 

  // Handlers del Modal
  const handleModalCancel = () => {
    setModalVisible(false);
  };
  const handleModalConfirmStep1 = () => {
    setModalStep(2); 
  };
  const handleModalConfirmStep2 = () => {
    navigation.navigate("EditarEmpleado", { empleado });
    setModalVisible(false);
  };

  // Función 'handleTouchDisabled' actualizada
  const handleTouchDisabled = () => {
    if (!editable && empleado) {
      setModalStep(1); 
      setModalVisible(true); 
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.scrollContainer} 
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../../../assets/LOGO_BLANCO.png")}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Consultar Empleado</Text>
        </View>

        <View style={styles.divider} />

        {/* Contenedor principal */}
        <View style={styles.mainContentArea}>
          {!empleado && (
            <>
              <Text style={styles.label}>Buscar por nombre de usuario:</Text>
              <View style={styles.searchBox}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Ejemplo: Herdia1"
                  placeholderTextColor="#999"
                  value={nombreUsuario} 
                  onChangeText={setNombreUsuario} 
                />
                <TouchableOpacity
                  style={[styles.searchButton, loading && { opacity: 0.6 }]}
                  onPress={buscarEmpleado}
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

          {/* Mostrar resultados */}
          {empleado && (
            <View style={styles.resultContainer}>
              <TouchableOpacity
                onPress={deseleccionarEmpleado}
                style={styles.regresarButton}
              >
                <Text style={styles.regresarButtonText}>{"< Volver a la búsqueda"}</Text>
              </TouchableOpacity>

              <Text style={styles.resultTitle}>Datos del Empleado</Text>

              <EmpleadosFormView
                modo="consultar"
                empleado={empleado}
                onTouchDisabled={handleTouchDisabled}
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal de Alerta */}
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
              <Text style={styles.modalMessage}>¿Desea editar este empleado?</Text>
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
              <Text style={styles.modalMessage}>¿Desea ser dirigido al área segura para editar empleado?</Text>
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

      {/* Botón flotante de regreso */}
      <TouchableOpacity 
        style={styles.backButton} 
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
}

// --- ESTILOS COMPLETOS ---
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
    marginBottom: 30,
  },
  mainContentArea: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    paddingHorizontal: 15,
  },
  label: { 
    fontSize: 16, 
    fontWeight: "600", 
    color: "#ffffff", 
    marginBottom: 10,
  },
  searchBox: { 
    flexDirection: "row", 
    alignItems: "center", 
    gap: 10 
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
  },
  searchButtonText: { color: "#fff", fontWeight: "600" },
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