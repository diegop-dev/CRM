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
  FlatList // <--- 1. IMPORTANTE: Asegúrate de importar FlatList
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ProductosFormView from "../Inventario/productosform";
import { useConsultarProductoLogic } from "../../../../controller/Modulo 2/SubModulos/Inventario/consultarproducto";

export default function ConsultarProductoView() {
  const navigation = useNavigation();

  const {
    terminoBusqueda,
    setTerminoBusqueda,
    producto,
    productos, // <--- 2. RECUPERAMOS LA LISTA DE PRODUCTOS
    empleadosList,
    loading,
    buscarProducto,
    seleccionarProducto, // <--- 3. RECUPERAMOS LA FUNCIÓN PARA SELECCIONAR
    deseleccionarProducto,
  } = useConsultarProductoLogic();

  // Lógica para el toque en campos deshabilitados
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

  // Loader: Solo se muestra si carga y NO hay ni producto seleccionado ni lista para mostrar
  // Esto evita que parpadee si ya hay una lista cargada.
  if (loading && !producto && (!productos || productos.length === 0)) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d92a1c" />
        <Text style={[styles.headerTitle, {marginTop: 10}]}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView nestedScrollEnabled contentContainerStyle={styles.scrollContainer}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../../../assets/LOGO_BLANCO.png")}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Consultar Producto</Text>
        </View>

        <View style={styles.divider} />

        {/* Área de Búsqueda (Siempre visible) */}
        <Text style={styles.label}>Buscar por nombre o código de producto:</Text>
        <View style={styles.searchBox}>
            <TextInput
            style={styles.input}
            placeholder="Ejemplo: Cámara de video o CÓD-123"
            value={terminoBusqueda}
            onChangeText={setTerminoBusqueda}
            />
            
            <TouchableOpacity
            style={[
                styles.button, 
                loading && { opacity: 0.6 },
                producto && { backgroundColor: "#d92a1c" } // Rojo si es Limpiar
            ]}
            // Si hay producto seleccionado, el botón limpia. Si no, busca.
            onPress={producto ? deseleccionarProducto : buscarProducto}
            disabled={loading}
            >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.buttonText}>
                    {producto ? "Limpiar" : "Buscar"}
                </Text>
            )}
            </TouchableOpacity>
        </View>

        {/* 4. LISTA DE RESULTADOS / ALEATORIOS (Esto es lo que te faltaba) */}
        {/* Solo se muestra si NO hay un producto seleccionado */}
        {!producto && (
          <FlatList
            data={productos} // La lista que viene del hook
            // Generamos una key única (id si existe, sino random para evitar errores)
            keyExtractor={(item) => item.id_producto ? item.id_producto.toString() : Math.random().toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => seleccionarProducto(item)} 
              >
                <Text style={styles.listText}>
                  {item.nombre} (ID: {item.id_producto})
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              !loading && (
                <Text style={{ color: "#fff", textAlign: "center", marginTop: 10 }}>
                  No hay productos para mostrar.
                </Text>
              )
            )}
            scrollEnabled={false} // Importante porque está dentro de un ScrollView
          />
        )}

        {/* Detalle del Producto Seleccionado */}
        {producto && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Datos del Producto</Text>

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

// Estilos
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  scrollContainer: { padding: 20, flexGrow: 1, paddingHorizontal: 15, paddingTop: 5 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerIcon: { width: 60, height: 80, resizeMode: "contain", tintColor: "#ffffff" },
  headerTitle: { fontSize: 25, fontWeight: "700", marginLeft: 15, color: "#ffffff" },
  divider: { height: 3, backgroundColor: "#d92a1c", marginVertical: 1 },
  label: { fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 15 },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
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
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: { color: "#fff", fontWeight: "600" },
  resultContainer: {
    backgroundColor: "",
    padding: 20,
    borderRadius: 12,
    marginTop: 10,
    elevation: 2,
  },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color:"white", textAlign:"center"},
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#2b3042",
  },
  // Estilos para la lista (IMPORTANTE AGREGARLOS)
  listItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  listText: { fontSize: 16, fontWeight: "500", color: "#2C3E50" },
});