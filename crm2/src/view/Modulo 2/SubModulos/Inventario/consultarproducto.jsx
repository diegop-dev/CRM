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
  FlatList, // <--- Importante
  Modal // <--- Importamos Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ProductosFormView from "../Inventario/productosform";
import { useConsultarProductoLogic } from "../../../../controller/Modulo 2/SubModulos/Inventario/consultarproducto";

export default function ConsultarProductoView() {
  const navigation = useNavigation();

  const {
    terminoBusqueda,
    setTerminoBusqueda,
    producto,
    productos,
    empleadosList,
    loading,
    buscarProducto,
    seleccionarProducto,
    deseleccionarProducto,
    feedbackModal,      // <--- Estado del modal de lógica
    closeFeedbackModal  // <--- Función para cerrar
  } = useConsultarProductoLogic();

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
    if (producto) {
      setEditStep(1);
      setEditModalVisible(true);
    }
  };

  const handleEditModalConfirm = () => {
    if (editStep === 1) {
      setEditStep(2); 
    } else {
      setEditModalVisible(false);
      // Navegar a editar enviando el producto actual
      navigation.navigate("EditarProducto", { producto });
    }
  };

  // Loader inicial (si carga y no hay nada visible)
  if (loading && !producto && (!productos || productos.length === 0)) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d92a1c" />
        <Text style={[styles.headerTitle, {marginTop: 10}]}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView nestedScrollEnabled contentContainerStyle={styles.scrollContainer}>
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
            <Image
              source={require("../../../../../assets/LOGO_BLANCO.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Consultar Producto</Text>

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

          {/* Área de Búsqueda */}
          <Text style={styles.label}>Buscar por nombre o código de producto:</Text>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.input}
              placeholder="Ejemplo: Cámara de video o CÓD-123"
              value={terminoBusqueda}
              onChangeText={setTerminoBusqueda}
            />
            
            <TouchableOpacity
              style={[
                styles.button, 
                loading && { opacity: 0.6 },
                producto && { backgroundColor: "#d92a1c" } // Rojo si es Limpiar
              ]}
              onPress={producto ? deseleccionarProducto : buscarProducto}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {producto ? "Limpiar" : "Buscar"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* LISTA DE RESULTADOS */}
          {!producto && (
            <FlatList
              data={productos}
              keyExtractor={(item) => item.id_producto ? item.id_producto.toString() : Math.random().toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => seleccionarProducto(item)} 
                >
                  <Text style={styles.listText}>
                    {item.nombre} (ID: {item.id_producto})
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                !loading && (
                  <Text style={{ color: "#fff", textAlign: "center", marginTop: 10 }}>
                    No hay productos para mostrar.
                  </Text>
                )
              )}
              scrollEnabled={false}
            />
          )}

          {/* DETALLE DEL PRODUCTO */}
          {producto && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>Datos del Producto</Text>

              <ProductosFormView
                modo="consultar"
                producto={producto}
                onTouchDisabled={handleTouchDisabled} // Activa modal de edición
                empleados={empleadosList}
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
                ? "¿Desea salir de la pantalla de consultar producto y volver al menú principal?" 
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
                ? "¿Desea editar este producto?" 
                : "¿Desea ser dirigido al área segura para editar producto?"}
            </Text>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]} 
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
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

// Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  scrollContainer: { padding: 20, flexGrow: 1, paddingHorizontal: 15, paddingTop: 5 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
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

  divider: { height: 3, backgroundColor: "#d92a1c", marginVertical: 1 },

  // --- Contenedor Web ---
  mainContentContainer: {
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
  },

  label: { fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 15 },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D0D3D4",
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
  },
  button: {
    backgroundColor: "#006480",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  
  resultContainer: {
    backgroundColor: "",
    padding: 20,
    borderRadius: 12,
    marginTop: 10,
    elevation: 2,
  },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color:"white", textAlign:"center"},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#2b3042",
  },
  
  // Estilos para la lista
  listItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  listText: { fontSize: 16, fontWeight: "500", color: "#2C3E50" },

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
