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
import { useNavigation } from "@react-navigation/native";
import ProductosFormView from "../Inventario/productosform";
import { useConsultarProductoLogic } from "../../../../controller/Modulo 2/SubModulos/Inventario/consultarproducto";


// ===================================
// ESTILOS (Ubicados al inicio para evitar ReferenceError)
// ===================================
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  scrollContainer: { padding: 20, flexGrow: 1, paddingHorizontal: 15, paddingTop: 5 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerIcon: { width: 60, height: 80, resizeMode: "contain", tintColor: "#ffffff" },
  headerTitle: { fontSize: 25, fontWeight: "700", marginLeft: 15, color: "#ffffff" },
  divider: { height: 3, backgroundColor: "#d92a1c", marginVertical: 1 },
  label: { fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 15 },
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
    backgroundColor: "#006480",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  resultContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    elevation: 2,
  },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  regresarButton: {
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  regresarButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#2b3042",
  },
  backButton: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});


export default function ConsultarProductoView() {
  const navigation = useNavigation();

  const {
    terminoBusqueda,
    setTerminoBusqueda,
    producto,
    empleadosList,
    loading,
    buscarProducto,
    deseleccionarProducto,
  } = useConsultarProductoLogic();


  // Lógica para el toque en campos deshabilitados (Redirigir a Editar)
  const handleTouchDisabled = () => {
    if (producto) {
      Alert.alert(
        "Modo Consulta",
        "¿Desea editar este producto?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Sí",
            onPress: () => {
              Alert.alert(
                "Área Segura",
                "¿Desea ser dirigido al área segura para editar producto?",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Confirmar",
                    onPress: () => {
                      // Navegación a 'EditarProducto' pasando el objeto completo
                      navigation.navigate("EditarProducto", { producto });
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
  };

  // Loader de pantalla completa
  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d92a1c" />
        <Text style={styles.headerTitle}>Buscando Producto...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* 🔹 Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../../../assets/LOGO_BLANCO.png")}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Consultar Producto</Text>
        </View>

        <View style={styles.divider} />

        {/* 🔹 Área de Búsqueda */}
        {!producto && (
          <>
            <Text style={styles.label}>Buscar por nombre o código de producto:</Text>
            <View style={styles.searchBox}>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: Cámara de video o CÓD-123"
                value={terminoBusqueda}
                onChangeText={setTerminoBusqueda}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={buscarProducto}
                disabled={loading}
              >
                <Text style={styles.buttonText}>Buscar</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* 🔹 Mostrar resultados */}
        {producto && (
          <View style={styles.resultContainer}>

            {/* --- Botón Volver --- */}
            <TouchableOpacity
              onPress={deseleccionarProducto}
              style={styles.regresarButton}
            >
              <Text style={styles.regresarButtonText}>{"< Volver a la búsqueda"}</Text>
            </TouchableOpacity>
            {/* --- FIN BOTÓN VOLVER --- */}

            <Text style={styles.resultTitle}>Datos del Producto</Text>

            {/* Formulario en modo CONSULTAR */}
            <ProductosFormView
              modo="consultar"
              producto={producto}
              onTouchDisabled={handleTouchDisabled}
              empleados={empleadosList}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}