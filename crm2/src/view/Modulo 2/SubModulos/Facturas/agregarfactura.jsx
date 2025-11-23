import React from "react";
import { ScrollView, StyleSheet, View, Text, Image, Modal, Pressable, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import FacturaFormView from "../../../../view/Modulo 2/SubModulos/Facturas/facturasform"; 
import { useAgregarFacturaLogic } from "../../../../controller/Modulo 2/SubModulos/Facturas/agregarfactura";

export default function AgregarFacturaView({ navigation }) {

  const { 
      factura, 
      clientesList, 
      onChange, 
      onGuardar, 
      onFileSelect, 
      onViewFile,   
      modalInfo, 
      closeModal 
  } = useAgregarFacturaLogic();

  const handleLogoPress = () => {
      // ... (Tu lógica de alerta de salida existente)
      navigation.navigate("MenuPrincipal"); // Simplificado para el ejemplo
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2b3042" }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
            <Image source={require("../../../../../assets/LOGO_BLANCO.png")} style={styles.headerIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Agregar Factura</Text>
        </View>
        <View style={styles.divider} />

        <View style={{ flex: 1 }}>
          <FacturaFormView
            factura={factura}
            modo="crear" 
            onChange={onChange}
            onGuardar={onGuardar}
            clientes={clientesList} 
            onRegresar={() => navigation.goBack()}
            onFileSelect={onFileSelect} 
            onViewFile={onViewFile}     
          />
        </View>
      </ScrollView>

      {/* Modal de Alerta */}
      <Modal animationType="fade" transparent={true} visible={modalInfo.visible} onRequestClose={closeModal}>
        <Pressable style={styles.pickerBackdrop} onPress={closeModal} />
        <View style={styles.alertModalContainer}>
          <Text style={styles.modalTitle}>{modalInfo.title}</Text>
          <Text style={styles.modalMessage}>{modalInfo.message}</Text>
          <TouchableOpacity style={[styles.modalButton, styles.modalButtonConfirm]} onPress={closeModal}>
             <Text style={styles.modalButtonText}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  container: { flex: 1, backgroundColor: "#2b3042", paddingHorizontal: 15, paddingTop: 5 },
  headerIcon: { width: 60, height: 80, resizeMode: "contain", tintColor: "#FFFFFF" },
  headerTitle: { fontSize: 26, fontWeight: "700", marginLeft: 15, color: "#f7f3f3ff" },
  divider: { height: 3, backgroundColor: "#d92a1c", marginVertical: 10 },
  pickerBackdrop: { flex: 1, backgroundColor: "rgba(0, 0, 0, 0.4)" },
  alertModalContainer: { position: 'absolute', top: '40%', left: '10%', width: '80%', backgroundColor: '#2b3042', borderRadius: 20, padding: 20, elevation: 10, borderWidth: 1, borderColor: '#555' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#f0f0f0', textAlign: 'center', marginBottom: 10 },
  modalMessage: { fontSize: 16, color: '#f0f0f0', textAlign: 'center', marginBottom: 20 },
  modalButton: { borderRadius: 10, padding: 10, alignItems: 'center' },
  modalButtonConfirm: { backgroundColor: '#77a7ab' },
  modalButtonText: { color: '#FFFFFF', fontWeight: 'bold' }
});