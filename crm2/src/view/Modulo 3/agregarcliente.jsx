import React, { useState } from "react";
import { 
  ScrollView, 
  StyleSheet, 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  Modal 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Importamos el formulario reutilizable
import ClientesFormView from "../../view/Modulo 3/clientesform";
// Importamos el hook de lógica actualizado
import { useAgregarClienteLogic } from "../../controller/Modulo 3/agregarcliente";
import { useNavigation } from "@react-navigation/native";

export default function AgregarClienteView() {

  const navigation = useNavigation();

  // Usamos el hook para obtener el estado y las funciones
  const { 
    cliente, 
    onChange, 
    onGuardar, 
    feedbackModal,      // <--- Estado del modal de lógica
    closeFeedbackModal  // <--- Función para cerrar
  } = useAgregarClienteLogic();

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
      setNavModalStep(2); // Pasar a "Área Segura"
    } else {
      setNavModalVisible(false);
      navigation.navigate("MenuPrincipal");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2b3042" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
            <Image
              source={require("../../../assets/LOGO_BLANCO.png")} 
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Agregar Cliente</Text>

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
          <ClientesFormView
            cliente={cliente}
            modo="agregar" 
            onChange={onChange}
            onGuardar={onGuardar}
          />
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
                ? "¿Desea salir de Agregar Clientes y volver al menú principal?" 
                : "Será redirigido al Menú Principal, los datos ingresados no serán guardados."}
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
      {feedbackModal.visible && (
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
                {/* Si hay acción de confirmación (pregunta), mostramos 2 botones */}
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
                  /* Si es solo informativo, 1 botón */
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

// --- Estilos ---
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    width: "100%",
  },
  container: {
    flex: 1,
    backgroundColor: "#2b3042",
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  headerIcon: {
    width: 60,
    height: 80,
    resizeMode: "contain",
    tintColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginLeft: 15,
    color: "#f7f3f3ff",
  },
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
  divider: {
    height: 3,
    backgroundColor: "#d92a1c",
    marginVertical: 10,
  },

  // --- Contenedor Web ---
  mainContentContainer: {
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
  },

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
