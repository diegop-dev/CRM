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
import { useRoute, useNavigation } from "@react-navigation/native";

// Importamos el FORMULARIO REUTILIZABLE
import ClientesFormView from "../../view/Modulo 3/clientesform";

// Importamos la LÓGICA
import { useEditarClienteLogic } from "../../controller/Modulo 3/editarcliente";

export default function EditarClienteView() {
  const route = useRoute();
  const navigation = useNavigation();
  
  // 1. RECIBIR EL CLIENTE: Si venimos de "Consultar"
  const clienteDesdeConsulta = route.params?.cliente || null;

  // 2. INICIALIZAR LÓGICA
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    clientes, 
    clienteSeleccionado, 
    setClienteSeleccionado, 
    loading,
    buscarCliente,
    seleccionarCliente,
    guardarCambios,
    deseleccionarCliente,
    feedbackModal,      // <--- Estado del modal de lógica
    closeFeedbackModal  // <--- Función para cerrar
  } = useEditarClienteLogic(clienteDesdeConsulta);

  // --- ESTADOS PARA EL MODAL DE NAVEGACIÓN (Local) ---
  const [navModalVisible, setNavModalVisible] = useState(false);
  const [navModalStep, setNavModalStep] = useState(1);

  // Manejo de inputs
  const handleInputChange = (campo, valor) => {
    setClienteSeleccionado((prevState) => ({
      ...prevState,
      [campo]: valor,
    }));
  };

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

  // Lógica dinámica para el botón
  const buttonAction = clienteSeleccionado ? deseleccionarCliente : buscarCliente;
  const buttonText = clienteSeleccionado ? "Limpiar" : "Buscar";

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
          <Text style={styles.headerTitle}>Editar Cliente</Text>

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

          {/* ================================================= */}
          {/* VISTA 1: ÁREA DE BÚSQUEDA (SIEMPRE VISIBLE)       */}
          {/* ================================================= */}
          <Text style={styles.label}>Buscar cliente:</Text>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.input}
              placeholder="Nombre, Apellido..."
              placeholderTextColor="#999"
              value={terminoBusqueda}
              onChangeText={setTerminoBusqueda}
              // Deshabilitar si hay selección
              editable={!clienteSeleccionado}
            />
            
            {/* BOTÓN CON DOBLE FUNCIÓN: BUSCAR / LIMPIAR */}
            <TouchableOpacity
              style={[
                  styles.button, 
                  loading && { opacity: 0.6 },
                  clienteSeleccionado && { backgroundColor: "#d92a1c" } // Rojo si es Limpiar
              ]}
              onPress={buttonAction}
              disabled={loading}
            >
              {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
              ) : (
                  <Text style={styles.buttonText}>{buttonText}</Text>
              )}
            </TouchableOpacity>
          </View>


          {/* ================================================= */}
          {/* LISTA DE RESULTADOS (Solo si NO hay selección)    */}
          {/* ================================================= */}
          {!clienteSeleccionado && (
            <>
              {clientes.length > 0 && (
                <View style={styles.listContainer}>
                  <Text style={styles.listTitle}>Resultados / Sugeridos:</Text>
                  <FlatList
                    data={clientes}
                    keyExtractor={(item) => 
                      item.id_cliente ? item.id_cliente.toString() : Math.random().toString()
                    }
                    scrollEnabled={false}
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={styles.listItem}
                        onPress={() => seleccionarCliente(item)}
                      >
                        <Text style={styles.listTextName}>
                          {item.nombre || item.nombreCliente} {item.apellido_paterno || item.apellidoPaterno}
                        </Text>
                        <Text style={styles.listTextType}>
                          {item.tipo || item.tipoCliente} - {item.estado_cliente || item.estadoCliente}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}

              {/* Mensaje Vacío */}
              {clientes.length === 0 && !loading && (
                 <Text style={{ color: "#ccc", textAlign: "center", marginTop: 20 }}>
                   No hay clientes para mostrar.
                 </Text>
              )}
            </>
          )}

          {/* ================================================= */}
          {/* VISTA 2: FORMULARIO (Solo si HAY selección)       */}
          {/* ================================================= */}
          {clienteSeleccionado && (
            <View style={styles.formContainer}>
              
              <Text style={styles.formTitle}>
                Editando a: {clienteSeleccionado.nombreCliente}
              </Text>

              <ClientesFormView
                modo="editar"
                cliente={clienteSeleccionado}
                editable={true}
                onChange={handleInputChange} 
                onGuardar={guardarCambios} 
              />
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
                ? "¿Desea salir de Editar cliente y volver al menú principal?" 
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

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  scrollContainer: { padding: 20, paddingBottom: 50, flexGrow: 1 },
  
  // Header
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

  // Buscador
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
  
  // Lista
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

  // Formulario
  formContainer: {
    backgroundColor: "",
    borderRadius: 15,
    padding: 15,
    marginTop: 10
  },
  formTitle: {
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
