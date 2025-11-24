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
import ProyectoFormView from "../../view/Modulo 1/proyectoform"; 
import { useEditarProyectoLogic } from "../../controller/Modulo 1/editarproyecto"; 
import { useNavigation } from "@react-navigation/native";

export default function EditarProyectoView({ route }) {

  // 1. Recuperamos el proyecto si viene de "Consultar"
  const proyectoInicial = route?.params?.proyecto;
  const navigation = useNavigation();

  // 2. SE LO PASAMOS AL HOOK
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    proyecto,
    empleadosList,
    proyectosRecientes,
    isLoading,
    handleBuscarProyecto,
    onChange,
    onGuardar,
    handleLimpiar,
    // --- IMPORTANTE: Asegúrate de que tu hook logic exporte esto ahora ---
    feedbackModal,     
    closeFeedbackModal 
  } = useEditarProyectoLogic(proyectoInicial);

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
          
          <Text style={styles.headerTitle}>Editar Proyecto</Text>

          {/* --- BOTÓN DE RETROCEDER (Estilo Sólido) --- */}
          <TouchableOpacity 
            style={styles.backButtonHeader} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* --- CONTENEDOR CENTRALIZADO (Para Web) --- */}
        <View style={styles.mainContentContainer}>

          {/* --- Barra de Búsqueda --- */}
          <View style={styles.searchContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Buscar por nombre de proyecto..."
              placeholderTextColor="#999"
              value={terminoBusqueda}
              onChangeText={setTerminoBusqueda}
              editable={!proyecto} 
            />

            {/* Botón cambia entre "Buscar" y "Limpiar" */}
            {proyecto ? (
              <TouchableOpacity
                style={[styles.searchButton, styles.limpiarButton]}
                onPress={handleLimpiar}
              >
                <Text style={styles.searchButtonText}>Limpiar</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => handleBuscarProyecto()}
              >
                <Text style={styles.searchButtonText}>Buscar</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* --- Indicador de Carga --- */}
          {isLoading && (
            <ActivityIndicator size="large" color="#77a7ab" style={{ marginVertical: 20 }} />
          )}

          {/* --- Formulario (SOLO SI SE ENCONTRÓ UN PROYECTO) --- */}
          {proyecto && !isLoading && (
            <View style={{ flex: 1, marginTop: 20 }}>
              <ProyectoFormView
                proyecto={proyecto}
                modo="editar"
                onChange={onChange}
                onGuardar={onGuardar}
                empleados={empleadosList}
              />
            </View>
          )}

          {/* --- Lista de Proyectos Recientes --- */}
          {!proyecto && !isLoading && (
            <View style={styles.recientesContainer}>
              <Text style={styles.recientesTitle}>
                {proyectosRecientes.length > 0 ? "Proyectos Recientes" : "No hay proyectos recientes"}
              </Text>
              {proyectosRecientes.map(p => (
                <TouchableOpacity
                  key={p.id_proyecto}
                  style={styles.recienteItem}
                  onPress={() => {
                    setTerminoBusqueda(p.nombre_proyecto);
                    handleBuscarProyecto(p.nombre_proyecto);
                  }}
                >
                  <Text style={styles.recienteItemText}>{p.nombre_proyecto}</Text>
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
                ? "¿Desea salir de la Gestión de Proyectos y volver al menú principal?" 
                : "Será redirigido al Menú Principal, los datos editados no serán guardados."}
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
      {/* --- MODAL 2: FEEDBACK DE OPERACIÓN (Si existe en Logic) --- */}
      {/* --------------------------------------------------------- */}
      {feedbackModal && (
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
                    styles.largeModalButton, 
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
      )}

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
    color: "#f7f3f3ff",
  },
  // --- Botón Volver Consistente ---
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
    marginBottom: 20,
  },
  
  // --- Contenedor Principal para Web ---
  mainContentContainer: {
    width: "100%",
    maxWidth: 800, // Evita que se estire
    alignSelf: "center",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
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
    marginLeft: 10,
  },
  limpiarButton: { 
    backgroundColor: "#E74C3C", 
  },
  searchButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

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
    color: "#FFFFFF",
    fontSize: 16,
  },

  // --- Estilos de Modal (Reutilizados) ---
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
    width: '60%', 
  },
  modalButtonCancel: {
    backgroundColor: '#f0f0f0',
  },
  modalButtonConfirm: {
    backgroundColor: '#d92a1c', 
  },
  modalButtonSuccess: {
    backgroundColor: '#77a7ab', 
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
