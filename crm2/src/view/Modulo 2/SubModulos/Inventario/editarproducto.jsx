import React, { useEffect, useState } from "react"; 
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
  Modal, 
  Pressable, 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import ProductosFormView from "../Inventario/productosform"; 
import { useEditarProductoLogic } from "../../../../controller/Modulo 2/SubModulos/Inventario/editarproducto"; 

export default function EditarProductoView() {
  const route = useRoute();
  const navigation = useNavigation();
  const productoDesdeConsulta = route.params?.producto || null;

  const {
    terminoBusqueda,
    setTerminoBusqueda,
    productos, 
    productoSeleccionado, 
    setProductoSeleccionado, 
    setProductoDesdeNavegacion, 
    empleadosList, 
    loading,
    buscarProducto, 
    seleccionarProducto, 
    guardarCambios,
    deseleccionarProducto,
    modalInfo, 
    closeModal, 
 } = useEditarProductoLogic();

 useEffect(() => {
    if (productoDesdeConsulta) {
      setProductoDesdeNavegacion(productoDesdeConsulta); 
    }
  }, [productoDesdeConsulta]);

  const handleInputChange = (campo, valor) => {
    setProductoSeleccionado({ ...productoSeleccionado, [campo]: valor });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        nestedScrollEnabled 
        style={styles.container}
        contentContainerStyle={styles.scrollContainer}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../../../assets/LOGO_BLANCO.png")} 
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Editar Producto</Text>
        </View>

        <View style={styles.divider} />

        {/* Contenedor principal para centrar */}
        <View style={styles.mainContentArea}>

          {!productoDesdeConsulta && !productoSeleccionado && (
            <>
              <Text style={styles.label}>Buscar producto:</Text>
              <View style={styles.searchBox}>
                <TextInput
                  style={styles.searchInput} 
                  placeholder="Ejemplo: Cámara de video"
                  placeholderTextColor="#999" 
                  value={terminoBusqueda}
                  onChangeText={setTerminoBusqueda}
                />
                <TouchableOpacity
                  style={[styles.searchButton, loading && { opacity: 0.6 }]} 
                  onPress={buscarProducto}
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

          {/* Lista de productos */}
          {productos.length > 0 && !productoSeleccionado && (
            <View style={styles.recientesContainer}> 
              <Text style={styles.recientesTitle}>Resultados de la Búsqueda</Text>
                <FlatList
                  data={productos}
                  keyExtractor={(item, index) =>
                    item.id_producto
                      ? item.id_producto.toString()
                      : `producto-${index}`
                  }
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.recienteItem} 
                      onPress={() => seleccionarProducto(item)} >
                      <Text style={styles.recienteItemText}>
                        {item.nombre_producto || item.nombre}
                      </Text>
                    </TouchableOpacity>
                  )}
                  ListEmptyComponent={() => (
                    <Text style={{ color: "#fff", textAlign: "center", marginTop: 10 }}>
                      No hay productos para mostrar.
                    </Text>
                  )}
                  scrollEnabled={false}
                />
            </View>
          )}

          {/* Formulario */}
          {productoSeleccionado && (
            <View style={styles.resultContainer}>
              {!productoDesdeConsulta && (
                <TouchableOpacity
                  onPress={deseleccionarProducto}
                  style={styles.regresarButton}
                >
                  <Text style={styles.regresarButtonText}>{"< Volver a la lista"}</Text>
                </TouchableOpacity>
              )}
              <Text style={styles.resultTitle}>
                Editar datos de{" "}
                {productoSeleccionado.nombre ||
                  productoSeleccionado.nombre_producto ||
                "Producto"}
              </Text>

              <ProductosFormView
                modo="editar"
                producto={productoSeleccionado}
                editable
                onChange={handleInputChange}
                onGuardar={guardarCambios}
                empleados={empleadosList} 
                onRegresar={() => navigation.goBack()} 
              />
            </View>
          )}
        </View>
      </ScrollView>

      {/* --- MODAL DE ALERTA --- */}
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
    fontSize: 23,
    fontWeight: "700",
    marginLeft: 15, 
    color: "#ffffff",
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
    marginBottom: 10 
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
  // --- ESTILOS DEL BOTÓN CORREGIDOS ---
  searchButton: { // <-- RENOMBRADO
    backgroundColor: "#77a7ab",
    borderRadius: 12,
    paddingVertical: 12, // <-- AJUSTADO
    paddingHorizontal: 15, // <-- AJUSTADO
  },
  searchButtonText: { color: "#fff", fontWeight: "600" }, // <-- RENOMBRADO
  // --- FIN DE CORRECCIÓN ---
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
    justifyContent: 'center', 
  },
  modalButton: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    alignItems: 'center',
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