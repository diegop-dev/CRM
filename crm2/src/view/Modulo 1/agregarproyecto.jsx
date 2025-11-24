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
import ProyectoFormView from "../../view/Modulo 1/proyectoform"; 
import { useNavigation } from "@react-navigation/native"; 
import { useAgregarProyectoLogic } from "../../controller/Modulo 1/agregarproyecto";

export default function AgregarProyectoView() {
  
  const navigation = useNavigation(); 
  // 1. Extraemos los nuevos estados para el modal de feedback
  const { 
    proyecto, 
    empleadosList, 
    onChange, 
    onGuardar, 
    feedbackModal,      // <--- Estado del mensaje (título, mensaje, tipo)
    closeFeedbackModal  // <--- Función para cerrar
  } = useAgregarProyectoLogic();

  // --- ESTADOS PARA EL MODAL DE NAVEGACIÓN (Salida) ---
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
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
            <Image
              source={require("../../../assets/LOGO_BLANCO.png")} 
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Agregar Proyecto</Text>

          {/* Botón Volver */}
          <TouchableOpacity 
            style={styles.backButtonHeader} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Formulario */}
        <View style={styles.formContainer}>
          <ProyectoFormView
            proyecto={proyecto}
            modo="crear"
            onChange={onChange}
            onGuardar={onGuardar}
            empleados={empleadosList} 
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
                ? "¿Desea salir de Agregar Proyectos y volver al menú principal?" 
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
      {/* --- MODAL 2: FEEDBACK DE OPERACIÓN (Desde Logic) --- */}
      {/* --------------------------------------------------------- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={feedbackModal.visible}
        onRequestClose={closeFeedbackModal}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Título (Cambiamos color según error/éxito) */}
            <Text style={[
              styles.modalTitle, 
              { color: feedbackModal.type === 'error' ? '#d92a1c' : '#34495E' }
            ]}>
              {feedbackModal.title}
            </Text>
            
            <Text style={styles.modalMessage}>
              {feedbackModal.message}
            </Text>
            
            <View style={{ width: '100%', alignItems: 'center' }}>
              <TouchableOpacity 
                style={[
                  styles.modalButton, 
                  styles.largeModalButton, // Botón ancho para mensajes informativos
                  feedbackModal.type === 'error' ? styles.modalButtonConfirm : styles.modalButtonSuccess
                ]} 
                onPress={closeFeedbackModal}
              >
                <Text style={styles.modalButtonTextConfirm}>Entendido</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2b3042", 
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
    width: "100%",
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
    color: "#FFFFFF",
  },
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
  formContainer: {
    flex: 1,
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
  },

  // --- Estilos Generales de Modal ---
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
  },
  modalButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '45%',
    alignItems: 'center',
  },
  largeModalButton: {
    width: '60%', // Para el botón único de "Entendido"
  },
  modalButtonCancel: {
    backgroundColor: '#f0f0f0',
  },
  modalButtonConfirm: {
    backgroundColor: '#d92a1c', // Rojo para acciones destructivas o errores
  },
  modalButtonSuccess: {
    backgroundColor: '#77a7ab', // Teal para éxito
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
