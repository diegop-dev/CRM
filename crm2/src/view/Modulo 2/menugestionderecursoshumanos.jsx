import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal, // <--- Importamos Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native"; 
import { useMenuLogic } from "../../controller/Modulo 2/menugestionderecursoshumanos";

export default function MenuGestionDeRecursosHumanosView() { 
  const { menuItems, handleNavigation } = useMenuLogic();
  const navigation = useNavigation();

  // --- ESTADOS PARA EL MODAL ---
  const [modalVisible, setModalVisible] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: Confirmar Salida, 2: Área Segura

  // --- FUNCIÓN: Inicia el proceso de salida (Logo) ---
  const handleLogoPress = () => {
    setModalStep(1); 
    setModalVisible(true);
  };

  // --- FUNCIÓN: Lógica del Modal ---
  const handleModalConfirm = () => {
    if (modalStep === 1) {
      setModalStep(2);
    } else {
      setModalVisible(false);
      navigation.navigate("MenuPrincipal");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2b3042' }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          {/* Logo con lógica de seguridad */}
          <TouchableOpacity onPress={handleLogoPress}>
            <Image
              source={require("../../../assets/LOGO_BLANCO.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Gestión De RRHH</Text>

          {/* --- BOTÓN DE RETROCEDER (Estilo Sólido) --- */}
          <TouchableOpacity 
            style={styles.backButtonHeader} 
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>
        </View>

        {/* Línea divisora */}
        <View style={styles.divider} />

        {/* Renderizado dinámico de botones (Grid Controlado para Web) */}
        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                // Si quieres que el último ocupe todo el ancho si es impar:
                // index === menuItems.length - 1 && menuItems.length % 2 !== 0 && styles.largeButton,
              ]} 
              onPress={() => handleNavigation(item.screen)}
            >
              <Image
                source={
                  item.image ? item.image : require("../../../assets/1.png") 
                }
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* --- MODAL DE SEGURIDAD --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>
              {modalStep === 1 ? "Confirmar Navegación" : "Área Segura"}
            </Text>
            
            <Text style={styles.modalMessage}>
              {modalStep === 1 
                ? "¿Desea salir de la Gestión de RRHH y volver al menú principal?" 
                : "Será redirigido al Menú Principal."}
            </Text>
            
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonCancel]} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalButtonTextCancel}>
                  {modalStep === 1 ? "Cancelar" : "Permanecer"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalButton, styles.modalButtonConfirm]} 
                onPress={handleModalConfirm}
              >
                <Text style={styles.modalButtonTextConfirm}>
                  {modalStep === 1 ? "Sí, Volver" : "Confirmar"}
                </Text>
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
    width: "100%",
  },
  headerIcon: {
    width: 60,
    height: 80,
    resizeMode: "contain",
    tintColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginLeft: 15,
    color: "#ffffffff",
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
    width: "100%",
    height: 3,
    backgroundColor: "#d92a1c",
    marginTop: 5,
    marginBottom: 30,
  },
  // --- Grid Controlado ---
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "100%",      
    maxWidth: 600,      // Control de ancho para Web
    alignSelf: "center"
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderColor: "#BDC3C7",
    borderRadius: 20, // Ajustado a 20
    paddingVertical: 10,
    paddingHorizontal: 10,
    padding: 10,
    width: "48%",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 130, // Altura reducida
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
    width: 40, // Icono más pequeño
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
  },
  modalButton: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '45%',
    alignItems: 'center',
  },
  modalButtonCancel: {
    backgroundColor: '#f0f0f0',
  },
  modalButtonConfirm: {
    backgroundColor: '#d92a1c',
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
