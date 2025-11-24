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

// Importaciones de componentes y lógica
import UsuariosFormView from "../../view/Modulo 5/usuariosform"; 
import { useAdministradoresLogic } from "../../controller/Modulo 5/administradores";

export default function AdministradoresView() {
  const navigation = useNavigation();
   
  // Desestructuramos toda la lógica necesaria del hook
  const {
    terminoBusqueda, 
    setTerminoBusqueda, 
    listaUsuarios, 
    usuarioSeleccionado,
    loading, 
    buscarUsuarios, 
    seleccionarUsuario, 
    deseleccionarUsuario,
    formLogic, 
    feedbackModal,      // <--- Estado del modal de lógica
    closeFeedbackModal  // <--- Función para cerrar
  } = useAdministradoresLogic();

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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView nestedScrollEnabled contentContainerStyle={styles.scrollContainer}>
        
        {/* ENCABEZADO */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
            <Image 
              source={require("../../../assets/LOGO_BLANCO.png")} 
              style={styles.headerIcon} 
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Administradores</Text>

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

            {/* CAMBIO 1: ÁREA DE BÚSQUEDA SIEMPRE VISIBLE */}
            <Text style={styles.label}>Buscar Administrador:</Text>
            <View style={styles.searchBox}>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre, Usuario..."
                    placeholderTextColor="#999"
                    value={terminoBusqueda}
                    onChangeText={setTerminoBusqueda}
                    // Bloquear si hay selección
                    editable={!usuarioSeleccionado}
                />
                {/* CAMBIO 2: BOTÓN CON DOBLE FUNCIÓN */}
                <TouchableOpacity 
                    style={[
                        styles.button, 
                        loading && { opacity: 0.6 },
                        usuarioSeleccionado && { backgroundColor: "#d92a1c" } // Rojo si es Limpiar
                    ]} 
                    onPress={usuarioSeleccionado ? deseleccionarUsuario : buscarUsuarios} 
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>
                            {usuarioSeleccionado ? "Limpiar" : "Buscar"}
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            {/* 1. LISTA DE RESULTADOS */}
            {!usuarioSeleccionado && (
                <>
                <FlatList
                    data={listaUsuarios}
                    keyExtractor={(item) => item.id_usuario.toString()}
                    renderItem={({ item }) => (
                    <TouchableOpacity style={styles.listItem} onPress={() => seleccionarUsuario(item)}>
                        <Text style={styles.listText}>
                        {item.nombres} {item.apellido_paterno}
                        </Text>
                        <Text style={styles.listSubText}>Usuario: {item.nombre_usuario}</Text>
                        <Text style={styles.listSubText}>Estado: {item.estado_usuario}</Text>
                    </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                    !loading && (
                        <Text style={styles.emptyText}>
                        No hay resultados. Busque por nombre o usuario.
                        </Text>
                    )
                    }
                    scrollEnabled={false}
                />
                </>
            )}

            {/* 2. FORMULARIO DE EDICIÓN */}
            {usuarioSeleccionado && (
                <View style={styles.resultContainer}>

                <Text style={styles.resultTitle}>
                    Editando permisos de: {usuarioSeleccionado.nombres}
                </Text>

                <UsuariosFormView 
                    usuarioData={formLogic} 
                    modo="editar"
                    onGuardar={formLogic.guardarCambios}
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
                ? "¿Desea salir y volver al menú principal?" 
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

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  scrollContainer: { padding: 20, flexGrow: 1 },
   
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerIcon: { width: 60, height: 80, resizeMode: "contain", tintColor: "#ffffff" },
  headerTitle: { fontSize: 26, fontWeight: "700", marginLeft: 10, color: "#ffffff" },
  
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

  divider: { height: 3, backgroundColor: "#d92a1c", marginVertical: 5, marginBottom: 20 },
   
  // --- Contenedor Web ---
  mainContentContainer: {
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
  },

  label: { fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 10 },
  searchBox: { flexDirection: "row", gap: 10, marginBottom: 10 },
   
  input: { 
    flex: 1, 
    backgroundColor: "#fff", 
    borderRadius: 10, 
    padding: 12, 
    fontSize: 16, 
    color: "#333" 
  },
   
  button: { 
    backgroundColor: "#77a7ab", 
    padding: 12, 
    borderRadius: 10, 
    justifyContent: 'center', 
    minWidth: 80, 
    alignItems: 'center' 
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 15 },
   
  listItem: { 
    backgroundColor: "#fff", 
    padding: 15, 
    borderRadius: 8, 
    marginTop: 8, 
    elevation: 2 
  },
  listText: { fontSize: 16, fontWeight: "bold", color: "#2C3E50" },
  listSubText: { fontSize: 14, color: "#666", marginTop: 2 },
  emptyText: { color: "#FFF", textAlign: "center", marginTop: 20, opacity: 0.8 },
   
  resultContainer: { 
    backgroundColor: "", 
    padding: 20, 
    borderRadius: 12, 
    marginTop: 10 
  },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15, color: "#ffffffff", textAlign: 'center' },
   
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
