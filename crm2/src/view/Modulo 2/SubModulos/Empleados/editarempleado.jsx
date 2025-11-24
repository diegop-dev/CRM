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
  Modal // <--- Importamos Modal
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
import EmpleadosFormView from "../Empleados/empleadosform";
// Importamos el hook actualizado
import { useEditarEmpleadoLogic } from "../../../../controller/Modulo 2/SubModulos/Empleados/editarempleado";

export default function EditarEmpleadoView() {
  const route = useRoute();
  const navigation = useNavigation();
  const empleadoDesdeConsulta = route.params?.empleado || null;

  // --- ESTADOS PARA EL MODAL DE NAVEGACIÓN (Local) ---
  const [navModalVisible, setNavModalVisible] = useState(false);
  const [navModalStep, setNavModalStep] = useState(1);

  // Traemos las funciones del hook (Incluyendo el feedbackModal)
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    empleados,
    empleadoSeleccionado,
    setEmpleadoSeleccionado,
    setEmpleadoDesdeNavegacion, // Si tu hook usa esto para inicializar
    loading,
    buscarEmpleado,
    seleccionarEmpleado,
    guardarCambios,
    deseleccionarEmpleado,
    feedbackModal,      // <--- Estado del modal de lógica
    closeFeedbackModal  // <--- Función para cerrar
  } = useEditarEmpleadoLogic();

  // Inicialización si viene de consulta
  useEffect(() => {
    if (empleadoDesdeConsulta) {
      // Usamos la función del hook para formatear y setear
      setEmpleadoDesdeNavegacion(empleadoDesdeConsulta);
    }
  }, [empleadoDesdeConsulta]);

  // Manejador local para inputs (actualiza el estado del hook)
  const handleInputChange = (campo, valor) => {
    setEmpleadoSeleccionado({ ...empleadoSeleccionado, [campo]: valor });
  };

  // --- FUNCIÓN: Inicia el proceso de salida (Logo) ---
  const handleLogoPress = () => {
    setNavModalStep(1);
    setNavModalVisible(true);
  };

  // --- FUNCIÓN: Confirmación del Modal de Navegación ---
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
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
            <Image
              source={require("../../../../../assets/LOGO_BLANCO.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Editar Empleado</Text>

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

          {/* ÁREA DE BÚSQUEDA */}
          <Text style={styles.label}>Buscar empleado:</Text>
          <View style={styles.searchBox}>
            <TextInput
              style={styles.input}
              placeholder="Ejemplo: Juan Pérez"
              value={terminoBusqueda}
              onChangeText={setTerminoBusqueda}
              // Deshabilitamos si hay alguien seleccionado para evitar confusiones
              editable={!empleadoSeleccionado} 
            />
            {/* BOTÓN DINÁMICO (Buscar / Limpiar) */}
            <TouchableOpacity
              style={[
                styles.button, 
                loading && { opacity: 0.6 },
                empleadoSeleccionado && { backgroundColor: "#d92a1c" } // Rojo si es Limpiar
              ]}
              onPress={empleadoSeleccionado ? deseleccionarEmpleado : buscarEmpleado}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>
                  {empleadoSeleccionado ? "Limpiar" : "Buscar"}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Lista de empleados (Solo si NO hay selección) */}
          {empleados.length > 0 && !empleadoSeleccionado && (
            <FlatList
              data={empleados}
              keyExtractor={(item, index) =>
                item.id_empleado
                  ? item.id_empleado.toString()
                  : item.idEmpleado
                    ? item.idEmpleado.toString()
                    : `empleado-${index}`
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.listItem}
                  onPress={() => seleccionarEmpleado(item)} >
                  <Text style={styles.listText}>
                    {item.nombres || item.nombre}{" "}
                    {item.apellido_paterno || item.apellidoPaterno}{" "}
                    {item.apellido_materno || item.apellidoMaterno}
                  </Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={() => (
                <Text style={{ color: "#fff", textAlign: "center", marginTop: 10 }}>
                  No hay empleados para mostrar.
                </Text>
              )}
              scrollEnabled={false}
            />
          )}

          {/* Formulario (Solo si HAY selección) */}
          {empleadoSeleccionado && (
            <View style={styles.resultContainer}>
              <Text style={styles.resultTitle}>
                Editar datos de{" "}
                {empleadoSeleccionado.nombres || "Empleado"}
              </Text>

              <EmpleadosFormView
                modo="editar"
                empleado={empleadoSeleccionado}
                editable
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
                ? "¿Desea salir de la pantalla de editar empleado y volver al menú de empleados?" 
                : "Será redirigido al Menú de Empleados."}
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
                // Si es error o advertencia, título oscuro o rojo, etc.
                { color: feedbackModal.type === 'error' || feedbackModal.type === 'warning' ? '#d92a1c' : '#34495E' }
              ]}>
                {feedbackModal.title}
              </Text>
              
              <Text style={styles.modalMessage}>
                {feedbackModal.message}
              </Text>
              
              <View style={styles.modalButtonContainer}>
                {/* SI HAY callback (onConfirm), mostramos 2 botones */}
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
                  /* SI NO HAY callback, mostramos solo 1 botón (Entendido) */
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

// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  scrollContainer: { padding: 20, flexGrow: 1 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerIcon: { width: 60, height: 80, resizeMode: "contain", tintColor: "#ffffff" },
  headerTitle: {
    fontSize: 23,
    fontWeight: "700",
    marginLeft: 5,
    color: "#ffffff",
  },
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
  divider: { height: 3, backgroundColor: "#d92a1c", marginVertical: 5 },

  // --- Contenedor Web ---
  mainContentContainer: {
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
  },

  label: { fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 10 },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 10 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#D0D3D4",
    borderRadius: 10,
    backgroundColor: "#fff",
    padding: 10,
  },
  button: {
    backgroundColor: "#77a7ab",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  listItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  listText: { fontSize: 16, fontWeight: "500", color: "#2C3E50" },
  resultContainer: {
    backgroundColor: "",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    elevation: 2,
  },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color:"white", textAlign:"center"},

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
