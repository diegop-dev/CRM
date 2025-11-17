import React, { useState } from "react"; // <-- 1. IMPORTAMOS useState
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Modal, // <-- 1. IMPORTAMOS Modal
  Pressable, // <-- 1. IMPORTAMOS Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native"; // Importamos useNavigation
import FacturaFormView from "./facturasform"; 
import { useConsultarFacturaLogic } from "../../../../controller/Modulo 2/SubModulos/Facturas/consultarfactura"; 

export default function ConsultarFacturaView() { // Quitamos { navigation }
  
  const navigation = useNavigation(); // <-- Usamos el hook
  
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    factura,
    clientesList,
    facturasRecientes,
    isLoading,
    handleBuscarFactura,
    onChange, // El form lo necesita, aunque esté deshabilitado
    handleLimpiar,
  } = useConsultarFacturaLogic(); // <-- Quitamos navigation de aquí

  // --- 2. ESTADOS DEL MODAL ---
  const [isModalVisible, setModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: "Modo consulta", 2: "Área segura"

  // --- 3. HANDLERS DEL MODAL ---
  const handleModalCancel = () => {
    setModalVisible(false);
  };
  
  const handleModalConfirmStep1 = () => {
    setModalStep(2); 
  };
  
  const handleModalConfirmStep2 = () => {
    // Navega y cierra el modal
    navigation.navigate('EditarFactura', { 
      terminoBusqueda: factura.numeroFolio 
    });
    setModalVisible(false);
  };
  
  // --- 4. FUNCIÓN 'handleNavegarEditar' ACTUALIZADA ---
  const handleNavegarEditar = () => {
    if (!factura) return;
    setModalStep(1); // Resetea al paso 1
    setModalVisible(true); // Abre el modal
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
          <Text style={styles.headerTitle}>Consultar Factura</Text>
        </View>
        <View style={styles.divider} />

        {/* Contenedor principal */}
        <View style={styles.mainContentArea}>
          {/* Barra de Búsqueda */}
          {!factura && (
            <View style={styles.searchContainer}>
              <TextInput
                style={styles.searchInput}
                placeholder="Buscar por Número de Folio..."
                placeholderTextColor="#999"
                value={terminoBusqueda}
                onChangeText={setTerminoBusqueda}
                editable={!factura} 
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={[styles.searchButton, isLoading && { opacity: 0.6 }]}
                onPress={() => handleBuscarFactura()}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.searchButtonText}>Buscar</Text>
                )}
              </TouchableOpacity>
            </View>
          )}

          {/* Indicador de Carga */}
          {isLoading && (
            <ActivityIndicator size="large" color="#77a7ab" style={{ marginVertical: 20 }} />
          )}

          {/* Formulario (Resultados) */}
          {factura && !isLoading && (
            <View style={styles.resultContainer}>
              <TouchableOpacity
                onPress={handleLimpiar} // <-- Usamos handleLimpiar
                style={styles.regresarButton}
              >
                <Text style={styles.regresarButtonText}>{"< Volver a la búsqueda"}</Text>
              </TouchableOpacity>
              
              <FacturaFormView
                factura={factura}
                modo="consultar" 
                onChange={onChange} // Lo pasamos
                onGuardar={() => {}} 
                clientes={clientesList}
                // Hacemos que al tocar el form (en modo consulta) se active el modal
                onTouchDisabled={handleNavegarEditar} 
              />

              {/* Botón para navegar a Editar */}
              <TouchableOpacity 
                style={styles.navegarButton} 
                onPress={handleNavegarEditar} // <-- Llama al modal
              >
                <Text style={styles.navegarButtonText}>Ir a Editar Factura</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Lista de Facturas Recientes */}
          {!factura && !isLoading && (
            <View style={styles.recientesContainer}>
              <Text style={styles.recientesTitle}>
                {facturasRecientes.length > 0 ? "Facturas Recientes" : "No hay facturas recientes"}
              </Text>
              {facturasRecientes.map(f => (
                <TouchableOpacity
                  key={f.id_factura}
                  style={styles.recienteItem}
                  onPress={() => {
                    setTerminoBusqueda(f.numero_folio);
                    handleBuscarFactura(f.numero_folio);
                  }}
                >
                  <Text style={styles.recienteItemText}>{`Folio: ${f.numero_folio}`}</Text>
                  <Text style={styles.recienteItemSubText}>{`Monto: $${f.monto_total}`}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* --- 5. MODAL JSX AÑADIDO --- */}
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
              <Text style={styles.modalMessage}>¿Desea editar esta factura?</Text>
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
              <Text style={styles.modalMessage}>¿Desea ser dirigido al área segura para editar factura?</Text>
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

// --- 6. ESTILOS DEL MODAL AÑADIDOS ---
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
  searchContainer: { 
    flexDirection: "row", 
    alignItems: "center", 
    marginBottom: 10,
    gap: 10, // Alternativa a marginLeft en el botón
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
  regresarButton: {
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  regresarButtonText: {
    fontSize: 16,
    color: "#77a7ab", 
    fontWeight: '500',
  },
  navegarButton: {
    backgroundColor: "#f39c12", 
    borderRadius: 25, 
    paddingVertical: 12, 
    alignItems: "center", 
    marginTop: 25,
    marginHorizontal: 5,
  },
  navegarButtonText: {
    color: "#FFFFFF", 
    fontSize: 16, 
    fontWeight: "700"
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
    color: "#f0f0f0",
    fontSize: 16,
    fontWeight: "500",
  },
  recienteItemSubText: {
    color: "#bdc3c7",
    fontSize: 14,
    marginTop: 2,
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

  // --- ESTILOS DEL MODAL FLOTANTE ---
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