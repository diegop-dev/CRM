import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  RefreshControl,
  Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMenuLogic } from "../../controller/Inicio/menuprincipal";

export default function MenuPrincipalView() {
  // Desestructuramos feedbackModal y closeFeedbackModal del hook
  const { 
    menuItems, 
    handleNavigation, 
    handleLogout, 
    loading,
    feedbackModal,      // <--- Estado del modal de permisos/errores
    closeFeedbackModal  // <--- Función para cerrar
  } = useMenuLogic();

  const [refreshing, setRefreshing] = useState(false);
  
  // --- Estado para el Modal LOCAL de Cerrar Sesión ---
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // Aquí podrías llamar a una función de recarga real si existiera en el hook
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  // --- Funciones para el Modal de Logout ---
  const confirmLogout = () => {
    setLogoutModalVisible(true);
  };

  const executeLogout = () => {
    setLogoutModalVisible(false);
    handleLogout();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2b3042'}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#d92a1c"]}
            tintColor={"#d92a1c"}
            title="Actualizando menú..."
            titleColor="#fff"
          />
        }
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/LOGO_BLANCO.png")}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Menú Principal</Text>
        </View>

        {/* Línea divisora */}
        <View style={styles.divider} />

        {/* Renderizado dinámico de botones */}
        {/* Grid controlado para Web */}
        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                index === menuItems.length - 1 && styles.largeButton,
              ]}
              onPress={() => handleNavigation(item)}
            >
              <Image
                source={
                  item.image ? item.image : require("../../../assets/LOGO_BLANCO.png")
                }
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
        
        {/* --- Botón de Cerrar Sesión --- */}
        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* --------------------------------------------------------- */}
      {/* --- MODAL 1: CONFIRMACIÓN DE CERRAR SESIÓN (LOCAL) --- */}
      {/* --------------------------------------------------------- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={logoutModalVisible}
        onRequestClose={() => setLogoutModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cerrar sesión</Text>
            <Text style={styles.modalMessage}>¿Estás seguro de que deseas cerrar sesión?</Text>
            
            <View style={styles.modalButtonContainer}>
              {/* Botón Cancelar */}
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]} 
                onPress={() => setLogoutModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>Cancelar</Text>
              </TouchableOpacity>

              {/* Botón Confirmar */}
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonConfirm]} 
                onPress={executeLogout}
              >
                <Text style={styles.modalButtonTextConfirm}>Salir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* --------------------------------------------------------- */}
      {/* --- MODAL 2: FEEDBACK (Permisos/Errores del Hook) --- */}
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
    width: "100%",
  },
  headerIcon: {
    width: 60,
    height: 80,
    resizeMode: "contain",
    tintColor: "#f7f3f3ff",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginLeft: 15,
    color: "#f7f3f3ff",
  },
  divider: {
    width: "100%",
    height: 3,
    backgroundColor: "#fa0505ff",
    marginTop: 5,
    marginBottom: 30,
  },
  // --- Grid Controlado ---
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",      
    maxWidth: 600,      
    alignSelf: "center" 
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderColor: "#77a7ab",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 10,
    padding: 10,
    width: "48%", 
    alignItems: "center",
    justifyContent: "center",
    minHeight: 130,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  largeButton: {
    width: "100%",
  },
  buttonIcon: {
    width: 40,
    height: 40,
    resizeMode: "contain",
    tintColor: "#77a7ab",
    marginBottom: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#34495E",
    textAlign: "center",
    marginTop: 2,
  },
  logoutButton: {
    backgroundColor: "#77a7ab",
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    alignSelf: 'center',
    width: '50%',
    maxWidth: 250,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
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
