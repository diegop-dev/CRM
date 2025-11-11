import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal, 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMenuLogic } from "../../controller/Inicio/menuprincipal";

export default function MenuPrincipalView() {
  const { menuItems, handleNavigation, handleLogout } = useMenuLogic();
  
  const [isModalVisible, setModalVisible] = useState(false);

  const confirmLogout = () => setModalVisible(true);
  const handleCancel = () => setModalVisible(false);
  const handleConfirmLogout = () => {
    handleLogout();
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2b3042'}}>
      
      {/* Encabezado Fijo */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Image
            source={require("../../../assets/LOGO_BLANCO.png")}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Menú Principal</Text>
        </View>

        <TouchableOpacity style={styles.headerLogoutButton} onPress={confirmLogout}>
          <Text style={styles.headerLogoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40, paddingTop: 15 }}>
        {/* CONTENEDOR PRINCIPAL DEL CONTENIDO */}
        <View style={styles.mainContentArea}> 
          
          {/* --- LÍNEA DIVISORA ELIMINADA --- */}

          {/* Renderizado dinámico de botones */}
          <View style={styles.grid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                  index === menuItems.length - 1 && styles.largeButton,
                ]}
                onPress={() => handleNavigation(item.screen)}
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
        </View>
      </ScrollView>

      {/* --- Modal de Confirmación de Cierre de Sesión --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={handleCancel}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Cerrar sesión</Text>
            <Text style={styles.modalMessage}>
              ¿Estás seguro de que deseas cerrar sesión?
            </Text>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonCancel]}
                onPress={handleCancel}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonConfirm]}
                onPress={handleConfirmLogout}
              >
                <Text style={styles.modalButtonText}>Cerrar sesión</Text>
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
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", 
    width: "100%",
    paddingTop: 10,
    paddingBottom: 5,
    backgroundColor: "#2b3042",
  },
  headerLeft: { 
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15, 
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
  mainContentArea: {
    width: "100%",
    maxWidth: 960, 
    alignSelf: "center", 
    paddingHorizontal: 15, 
  },
  
  // --- ESTILO 'divider' ELIMINADO ---

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 30, // <--- AÑADIDO: Para dar espacio después del header
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderColor: "#77a7ab", 
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 15,
    padding: 15,
    width: "48%", 
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  largeButton: {
    width: "100%", 
  },
  buttonIcon: {
    width: 48,
    height: 48,
    resizeMode: "contain",
    tintColor: "#77a7ab", 
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#34495E",
    textAlign: "center",
    marginTop: 5,
  },
  headerLogoutButton: {
    backgroundColor: "transparent", 
    borderColor: "#77a7ab", 
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15, 
  },
  headerLogoutButtonText: { 
    color: "#77a7ab", 
    fontSize: 14,
    fontWeight: "600",
  },
  
  // --- Estilos del Modal ---
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)", 
  },
  modalContainer: {
    width: "90%",
    maxWidth: 500, 
    backgroundColor: "#2b3042", 
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#77a7ab", 
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#f7f3f3ff", 
    marginBottom: 10,
  },
  modalMessage: {
    fontSize: 16,
    color: "#f7f3f3ff", 
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 22,
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  modalButton: {
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    width: "48%",
    alignItems: "center",
  },
  modalButtonCancel: {
    backgroundColor: "#77a7ab", 
  },
  modalButtonConfirm: {
    backgroundColor: "#fa0505ff", 
  },
  modalButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});