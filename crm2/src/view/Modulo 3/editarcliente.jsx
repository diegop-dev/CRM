import React from "react";
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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";

// Importamos el FORMULARIO REUTILIZABLE
import ClientesFormView from "../../view/Modulo 3/clientesform";

// Importamos la LÓGICA
import { useEditarClienteLogic } from "../../controller/Modulo 3/editarcliente";

export default function EditarClienteView() {
  const route = useRoute();
  const navigation = useNavigation();
  
  // 1. RECIBIR EL CLIENTE: Si venimos de "Consultar", aquí estará el cliente.
  const clienteDesdeConsulta = route.params?.cliente || null;

  // 2. INICIALIZAR LÓGICA
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    clientes, // Lista de resultados o aleatorios
    clienteSeleccionado, // El cliente que se está editando
    setClienteSeleccionado, 
    loading,
    buscarCliente,
    seleccionarCliente,
    guardarCambios,
    deseleccionarCliente,
  } = useEditarClienteLogic(clienteDesdeConsulta);

  // Manejo de inputs
  const handleInputChange = (campo, valor) => {
    setClienteSeleccionado((prevState) => ({
      ...prevState,
      [campo]: valor,
    }));
  };

const handleLogoPress = () => {
    Alert.alert(
      "Confirmar Navegación",
      "¿Desea salir de la Editar cliente y volver al menú principal?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Volver",
          onPress: () => {
            Alert.alert(
              "Área Segura",
              "Será redirigido al Menú Principal, los datos ingresados no seran guardados.",
              [
                { text: "Permanecer", style: "cancel" },
                {
                  text: "Confirmar",
                  onPress: () => {
                    // Ahora 'navigation' está disponible
                    navigation.navigate("MenuPrincipal"); 
                  },
                },
              ]
            );
          },
        },
      ],
      { cancelable: true }
    );
  }

  // Lógica dinámica para el botón
  const buttonAction = clienteSeleccionado ? deseleccionarCliente : buscarCliente;
  const buttonText = clienteSeleccionado ? "Limpiar" : "Buscar";

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        nestedScrollEnabled 
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled"
      >
        
        {/* --- ENCABEZADO --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
          <Image
            source={require("../../../assets/LOGO_BLANCO.png")} 
            style={styles.headerIcon}
          />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Cliente</Text>
        </View>

        <View style={styles.divider} />

        {/* ================================================= */}
        {/* VISTA 1: ÁREA DE BÚSQUEDA (SIEMPRE VISIBLE)       */}
        {/* ================================================= */}
        <Text style={styles.label}>Buscar cliente:</Text>
        <View style={styles.searchBox}>
            <TextInput
            style={styles.input}
            placeholder="Nombre, Apellido..."
            placeholderTextColor="#999"
            value={terminoBusqueda}
            onChangeText={setTerminoBusqueda}
            />
            
            {/* BOTÓN CON DOBLE FUNCIÓN: BUSCAR / LIMPIAR */}
            <TouchableOpacity
            style={[
                styles.button, 
                loading && { opacity: 0.6 },
                clienteSeleccionado && { backgroundColor: "#d92a1c" } // Rojo si es Limpiar
            ]}
            onPress={buttonAction}
            disabled={loading}
            >
            {loading ? (
                <ActivityIndicator color="#fff" size="small" />
            ) : (
                <Text style={styles.buttonText}>{buttonText}</Text>
            )}
            </TouchableOpacity>
        </View>


        {/* ================================================= */}
        {/* LISTA DE RESULTADOS (Solo si NO hay selección)    */}
        {/* ================================================= */}
        {!clienteSeleccionado && (
          <>
            {clientes.length > 0 && (
              <View style={styles.listContainer}>
                <Text style={styles.listTitle}>Resultados / Sugeridos:</Text>
                <FlatList
                  data={clientes}
                  keyExtractor={(item) => 
                    item.id_cliente ? item.id_cliente.toString() : Math.random().toString()
                  }
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.listItem}
                      onPress={() => seleccionarCliente(item)}
                    >
                      <Text style={styles.listTextName}>
                        {item.nombre || item.nombreCliente} {item.apellido_paterno || item.apellidoPaterno}
                      </Text>
                      <Text style={styles.listTextType}>
                        {item.tipo || item.tipoCliente} - {item.estado_cliente || item.estadoCliente}
                      </Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            {/* Mensaje Vacío */}
            {clientes.length === 0 && !loading && (
               <Text style={{ color: "#ccc", textAlign: "center", marginTop: 20 }}>
                 No hay clientes para mostrar.
               </Text>
            )}
          </>
        )}

        {/* ================================================= */}
        {/* VISTA 2: FORMULARIO (Solo si HAY selección)       */}
        {/* ================================================= */}
        {clienteSeleccionado && (
          <View style={styles.formContainer}>
            
            <Text style={styles.formTitle}>
              Editando a: {clienteSeleccionado.nombreCliente}
            </Text>

            <ClientesFormView
              modo="editar"
              cliente={clienteSeleccionado}
              editable={true}
              onChange={handleInputChange} 
              onGuardar={guardarCambios} 
            />
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  scrollContainer: { padding: 20, paddingBottom: 50, flexGrow: 1 },
  
  // Header
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerIcon: { width: 50, height: 50, resizeMode: "contain", tintColor: "#ffffff", marginRight: 10 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#ffffff" },
  
  // Estilos extras para botones
  backButton: { marginRight: 10, padding: 5 },
  backButtonText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  cancelButton: { alignSelf: "flex-start", padding: 5, marginBottom: 10 },
  cancelButtonText: { color: "#ff0000ff", fontWeight: "600", fontStyle: "italic" },

  divider: { height: 2, backgroundColor: "#d92a1c", marginBottom: 20 },
  
  // Buscador
  label: { fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 5 },
  searchBox: { flexDirection: "row", gap: 10, marginBottom: 20 },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    height: 50,
    fontSize: 16,
    color: "#333",
    borderWidth: 1,
    borderColor: "#ccc"
  },
  button: {
    backgroundColor: "#77a7ab",
    borderRadius: 10,
    justifyContent: "center",
    paddingHorizontal: 20,
    height: 50
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  
  // Lista
  listContainer: { marginTop: 10 },
  listTitle: { color: "#ccc", fontSize: 14, marginBottom: 10, fontStyle: "italic" },
  listItem: {
    backgroundColor: "#3E4C5E",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#77a7ab"
  },
  listTextName: { color: "#fff", fontSize: 16, fontWeight: "bold" },
  listTextType: { color: "#ccc", fontSize: 14 },

  // Formulario
  formContainer: {
    backgroundColor: "",
    borderRadius: 15,
    padding: 15,
    marginTop: 10
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffffff",
    textAlign: "center",
    marginBottom: 15
  },
});