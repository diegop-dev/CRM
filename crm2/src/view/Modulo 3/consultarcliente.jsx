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
  FlatList,
  Modal // <--- Importamos Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

// Importamos el formulario reutilizable
import ClientesFormView from "../../view/Modulo 3/clientesform"; 
// Importamos el hook de lógica actualizado
import { useConsultarClienteLogic } from "../../controller/Modulo 3/consultarcliente";

export default function ConsultarClienteView() {
  // Desestructuramos la lógica
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    cliente,
    clientesAleatorios,
    loading,
    buscarCliente,
    handleRequestEdit,
    limpiarBusqueda,
    feedbackModal,      // <--- Estado del modal de lógica
    closeFeedbackModal  // <--- Función para cerrar
  } = useConsultarClienteLogic();

  const navigation = useNavigation(); 

  // --- ESTADOS PARA MODALES LOCALES ---
  // 1. Navegación (Salir)
  const [navModalVisible, setNavModalVisible] = useState(false);
  const [navModalStep, setNavModalStep] = useState(1);

  // 2. Edición (Ir a Editar)
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editStep, setEditStep] = useState(1);

  // --- FUNCIÓN: Inicia el proceso de salida (Logo) ---
  const handleLogoPress = () => {
    setNavModalStep(1);
    setNavModalVisible(true);
  };

  // --- FUNCIÓN: Confirmación del Modal de Navegación ---
  const handleNavModalConfirm = () => {
    if (navModalStep === 1) {
      setNavModalStep(2);
    } else {
      setNavModalVisible(false);
      navigation.navigate("MenuPrincipal");
    }
  };

  // --- FUNCIÓN: Manejar toque en formulario (Ir a Editar) ---
  // Esta función reemplaza al handleRequestEdit del hook si queremos controlar los pasos aquí
  // O podemos usar el del hook si este solo muestra el modal de pregunta.
  // Para mantener consistencia visual con los otros módulos, implementamos la lógica de 2 pasos aquí:
  
  const onTouchForm = () => {
      setEditStep(1);
      setEditModalVisible(true);
  };

  const handleEditModalConfirm = () => {
    if (editStep === 1) {
      setEditStep(2); // Pasar a confirmación de área segura
    } else {
      setEditModalVisible(false);
      // Navegar a editar enviando el cliente actual
      navigation.navigate("EditarCliente", { cliente });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        nestedScrollEnabled
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled"
      >
        
        {/* --- ENCABEZADO --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
            <Image
              source={require("../../../assets/LOGO_BLANCO.png")} 
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Consultar Cliente</Text>

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
          <Text style={styles.label}>Buscar cliente:</Text>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.input}
              placeholder="Nombre, Apellido..."
              placeholderTextColor="#999"
              value={terminoBusqueda}
              onChangeText={setTerminoBusqueda}
              editable={!cliente} // Bloqueo lógico si hay cliente
            />
            
            {/* Lógica del Botón: Cambia entre Buscar y Limpiar */}
            <TouchableOpacity 
              style={[
                  styles.button, 
                  loading && { opacity: 0.6 },
                  cliente && { backgroundColor: "#d92a1c" } // Rojo si es Limpiar
              ]}
              onPress={cliente ? limpiarBusqueda : () => buscarCliente()} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>
                    {cliente ? "Limpiar" : "Buscar"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* --- LISTA DE SUGERENCIAS --- */}
          {!cliente && !loading && (
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>
                {clientesAleatorios.length > 0 ? "Resultados / Sugeridos:" : "No hay sugerencias disponibles"}
              </Text>
              
              <FlatList
                data={clientesAleatorios}
                keyExtractor={(c) => c.id_cliente ? c.id_cliente.toString() : Math.random().toString()}
                scrollEnabled={false}
                renderItem={({ item: c }) => (
                  <TouchableOpacity 
                    style={styles.listItem}
                    onPress={() => {
                      setTerminoBusqueda(c.nombreCliente);
                      buscarCliente(c.nombreCliente);
                    }}
                  >
                    <Text style={styles.listTextName}>
                      {c.nombreCliente} {c.apellidoPaterno}
                    </Text>
                    <Text style={styles.listTextType}>
                      {c.tipoCliente} - {c.estadoCliente}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* --- FORMULARIO DE DETALLE --- */}
          {cliente && (
            <View style={styles.formContainer}>
                <Text style={styles.formTitle}>
                Visualizando a: {cliente.nombreCliente}
              </Text>
              
              {/* Texto informativo */}
              <Text style={{ textAlign: "center", color: "#ffffffff", marginBottom: 10, fontStyle: "italic" }}>
                ℹ️ Toca un campo para editar
              </Text>

              <ClientesFormView
                modo="consultar"
                cliente={cliente}
                // Usamos nuestra función local que abre el modal de 2 pasos
                onTouchDisabled={onTouchForm} 
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
                ? "¿Desea salir de Consultar Clientes y volver al menú principal?" 
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
                ? "Este formulario es de solo lectura. ¿Desea editar este cliente?" 
                : "Será dirigido al área segura de edición. ¿Continuar?"}
            </Text>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]} 
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>
                    {editStep === 1 ? "Cancelar" : "Cancelar"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonSuccess]} 
                onPress={handleEditModalConfirm}
              >
                <Text style={styles.modalButtonTextConfirm}>
                    {editStep === 1 ? "Sí, Editar" : "Confirmar"}
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

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  scrollContainer: { padding: 20, paddingBottom: 50, flexGrow: 1 },
  
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerIcon: { width: 50, height: 50, resizeMode: "contain", tintColor: "#ffffff", marginRight: 10 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#ffffff" },
  
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

  divider: { height: 2, backgroundColor: "#d92a1c", marginBottom: 20 },
  
  // --- Contenedor Web ---
  mainContentContainer: {
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
  },

  label: { fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 5 },
  searchBox: { flexDirection: "row", gap: 10, marginBottom: 20 },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc"
  },
  button: {
    backgroundColor: "#77a7ab",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 20,
    height: 50
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },

  // Estilo específico para Consultar (Limpiar)
  limpiarButton: {
    backgroundColor: "#E74C3C", 
  },

  listContainer: { marginTop: 10 },
  listTitle: { color: "#ccc", fontSize: 14, marginBottom: 10, fontStyle: "italic" },
  listItem: {
    backgroundColor: "#3E4C5E",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#77a7ab"
  },
  listTextName: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  listTextType: { color: "#ccc", fontSize: 14 },

  formContainer: {
    backgroundColor: "",
    borderRadius: 15,
    padding: 15,
    marginTop: 10
  },
  formTitle: {
    fontStyle: "italic",
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffffff",
    textAlign: "center",
    marginBottom: 15
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
