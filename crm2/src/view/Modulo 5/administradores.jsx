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
  Modal,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { useAdministradoresLogic } from "../../controller/Modulo 5/administradores"; 

export default function AdministradoresView() {
  const navigation = useNavigation();

  const {
    terminoBusqueda,
    setTerminoBusqueda,
    usuarios,
    loading,
    buscarUsuarios,
    modalInfo,
    closeModal,
  } = useAdministradoresLogic();

  // Esta función nos llevará a la pantalla de permisos
  const handleSelectUsuario = (usuario) => {
    // Navegamos a la (futura) pantalla de permisos
    // navigation.navigate('EditarPermisos', { userId: usuario.id_usuario });
    Alert.alert("Próximamente", `Se cargarán los permisos para ${usuario.nombre_completo}`);
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
            source={require("../../../assets/LOGO_BLANCO.png")}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Administradores</Text>
        </View>

        <View style={styles.divider} />

        {/* Contenedor principal */}
        <View style={styles.mainContentArea}>
          <>
            <Text style={styles.label}>Buscar Administrador:</Text>
            <View style={styles.searchBox}>
              <TextInput
                style={styles.searchInput} 
                placeholder="Buscar por nombre o usuario..."
                  placeholderTextColor="#999"
                value={terminoBusqueda}
                onChangeText={setTerminoBusqueda}
              />
              <TouchableOpacity
                style={[styles.searchButton, loading && { opacity: 0.6 }]} 
                onPress={buscarUsuarios}
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

          {/* Lista de Usuarios */}
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>
              {loading ? "Cargando..." : "Resultados"}
            </Text>
              <FlatList
                data={usuarios}
                keyExtractor={(item) => item.id_usuario.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem} 
                    onPress={() => handleSelectUsuario(item)} >
                    <Text style={styles.listItemText}>
                      {item.nombre_completo}
                    </Text>
                    <Text style={styles.listItemSubText}>
                      Usuario: {item.nombre_usuario}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  !loading && (
                    <Text style={styles.emptyListText}>
                      No se encontraron administradores.
                    </Text>
                  )
                )}
                scrollEnabled={false}
              />
          </View>
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

// --- Estilos ---
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
    gap: 10,
    marginBottom: 20, 
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
  // Estilos de Lista
  listContainer: {
    marginHorizontal: 0, 
    marginTop: 10,
    backgroundColor: "#3a3f50", 
    borderRadius: 12,
    padding: 15,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#5a5f70",
  },
  listItem: {
    backgroundColor: "#2b3042",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 10,
  },
  listItemText: {
    color: "#f0f0f0",
    fontSize: 16,
    fontWeight: '500',
  },
  listItemSubText: {
    color: "#bdc3c7",
    fontSize: 14,
    marginTop: 2,
  },
  emptyListText: {
    color: "#bdc3c7",
    textAlign: "center",
    marginTop: 10,
    fontSize: 15,
  },
  // --- BOTÓN FLOTANTE ---
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

  // --- MODAL DE ALERTA ---
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