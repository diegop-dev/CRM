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
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Importamos el formulario reutilizable
import ClientesFormView from "../../view/Modulo 3/clientesform"; 
// Importamos el hook de lógica
import { useConsultarClienteLogic } from "../../controller/Modulo 3/consultarcliente";
import { useNavigation } from "@react-navigation/native";

export default function ConsultarClienteView() {
  // Desestructuramos la lógica
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    cliente,
    clientesAleatorios,
    loading,
    buscarCliente,
    handleRequestEdit,
    limpiarBusqueda
  } = useConsultarClienteLogic();

  const navigation = useNavigation(); 
  const handleLogoPress = () => {
    Alert.alert(
      "Confirmar Navegación",
      "¿Desea salir de la Consultar Clientes y volver al menú principal?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Volver",
          onPress: () => {
            Alert.alert(
              "Área Segura",
              "Será redirigido al Menú Principal, ¿desea continuar?",
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

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        nestedScrollEnabled
        contentContainerStyle={styles.scrollContainer} 
        keyboardShouldPersistTaps="handled"
      >
        
        {/* --- ENCABEZADO (Estilo idéntico a Editar) --- */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
          <Image
            source={require("../../../assets/LOGO_BLANCO.png")} 
            style={styles.headerIcon}
          />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Consultar Cliente</Text>
        </View>

        <View style={styles.divider} />

        {/* --- BARRA DE BÚSQUEDA (Estilo idéntico a Editar) --- */}
        <Text style={styles.label}>Buscar cliente:</Text>
        <View style={styles.searchBox}>
          <TextInput
            style={styles.input}
            placeholder="Nombre, Apellido..."
            placeholderTextColor="#999"
            value={terminoBusqueda}
            onChangeText={setTerminoBusqueda}
            editable={!cliente} // Bloqueo lógico si hay cliente
          />
          
          {/* Lógica del Botón: Cambia entre Buscar y Limpiar */}
          {cliente ? (
            <TouchableOpacity 
              style={[styles.button, styles.limpiarButton]} // Combina estilo base + rojo
              onPress={limpiarBusqueda}
            >
              <Text style={styles.buttonText}>Limpiar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={[styles.button, loading && { opacity: 0.6 }]}
              onPress={() => buscarCliente()} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonText}>Buscar</Text>
              )}
            </TouchableOpacity>
          )}
        </View>

        {/* --- OPCIÓN A: LISTA DE SUGERENCIAS (Estilo idéntico a Editar) --- */}
        {!cliente && !loading && (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>
              {clientesAleatorios.length > 0 ? "Resultados / Sugeridos:" : "No hay sugerencias disponibles"}
            </Text>
            
            {clientesAleatorios.map((c) => (
              <TouchableOpacity 
                key={c.id_cliente || Math.random()} 
                style={styles.listItem}
                onPress={() => {
                  setTerminoBusqueda(c.nombreCliente);
                  buscarCliente(c.nombreCliente);
                }}
              >
                <Text style={styles.listTextName}>
                  {c.nombreCliente} {c.apellidoPaterno}
                </Text>
                <Text style={styles.listTextType}>
                  {c.tipoCliente} - {c.estadoCliente}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* --- OPCIÓN B: FORMULARIO DE DETALLE (Estilo idéntico a Editar) --- */}
        {cliente && (
          <View style={styles.formContainer}>
             <Text style={styles.formTitle}>
              Visualizando a: {cliente.nombreCliente}
            </Text>
            
            {/* Texto informativo opcional, adaptado al estilo del contenedor */}
            <Text style={{ textAlign: "center", color: "#77a7ab", marginBottom: 10, fontStyle: "italic" }}>
              ℹ️ Toca un campo para editar
            </Text>

            <ClientesFormView
              modo="consultar"
              cliente={cliente}
              onTouchDisabled={handleRequestEdit} 
            />
          </View>
        )}

      </ScrollView>
    </SafeAreaView>
  );
}

// --- ESTILOS (Copiados exactamente de editarcliente.jsx + limpiarButton) ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  scrollContainer: { padding: 20, paddingBottom: 50, flexGrow: 1 },
  
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerIcon: { width: 50, height: 50, resizeMode: "contain", tintColor: "#ffffff", marginRight: 10 },
  headerTitle: { fontSize: 24, fontWeight: "700", color: "#ffffff" },
  // No hay backButton aquí por defecto, pero si lo agregas, usa el estilo de editar
  
  divider: { height: 2, backgroundColor: "#d92a1c", marginBottom: 20 },
  
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

  // Estilo específico para Consultar (Limpiar)
  limpiarButton: {
    backgroundColor: "#E74C3C", 
  },

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

  formContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 15,
    padding: 15,
    marginTop: 10
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2b3042",
    textAlign: "center",
    marginBottom: 15
  },
});
