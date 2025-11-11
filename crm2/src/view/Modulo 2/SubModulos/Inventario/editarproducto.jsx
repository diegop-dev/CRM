// src/view/Modulo_X/editarproducto.jsx
import React, { useEffect } from "react";
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
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";
// CAMBIO: Se importa el formulario de Productos
import ProductosFormView from "../Inventario/productosform"; // Ajusta esta ruta
// CAMBIO: Se importa el hook de lógica para editar producto
import { useEditarProductoLogic } from "../../../../controller/Modulo 2/SubModulos/Inventario/editarproducto"; // Ajusta esta ruta

// CAMBIO: Renombrado el componente
export default function EditarProductoView() {
  const route = useRoute();
  const navigation = useNavigation();
  // CAMBIO: 'servicio' -> 'producto'
  const productoDesdeConsulta = route.params?.producto || null;

  // CAMBIO: Se desestructuran las variables del nuevo hook
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    productos, // 'servicios' -> 'productos'
    productoSeleccionado, // 'servicioSeleccionado' -> 'productoSeleccionado'
    setProductoSeleccionado, // 'setServicioSeleccionado' -> 'setProductoSeleccionado'
    setProductoDesdeNavegacion, // 'setServicioDesdeNavegacion' -> 'setProductoDesdeNavegacion'
    empleadosList, // (Se mantiene, es necesario para el form)
    loading,
    buscarProducto, // 'buscarServicio' -> 'buscarProducto'
    seleccionarProducto, // 'seleccionarServicio' -> 'seleccionarProducto'
    guardarCambios,
    deseleccionarProducto, // 'deseleccionarServicio' -> 'deseleccionarProducto'
  } = useEditarProductoLogic();

  // CAMBIO: Se usa la función de formateo para 'producto'
  useEffect(() => {
    if (productoDesdeConsulta) {
      // (Asumiendo que el hook 'useEditarProductoLogic' formatea)
      setProductoSeleccionado(productoDesdeConsulta); 
    }
  }, [productoDesdeConsulta]);

  // CAMBIO: Esta función actualiza el 'productoSeleccionado'
  const handleInputChange = (campo, valor) => {
    setProductoSeleccionado({ ...productoSeleccionado, [campo]: valor });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView nestedScrollEnabled contentContainerStyle={styles.scrollContainer}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../../../assets/LOGO_BLANCO.png")} // Ajusta la ruta
            style={styles.headerIcon}
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>{"<"}</Text>
          </TouchableOpacity>
          {/* CAMBIO: Título actualizado */}
          <Text style={styles.headerTitle}>Editar Producto</Text>
        </View>

        <View style={styles.divider} />

        {/* Campo de búsqueda (solo si no venimos desde consulta) */}
        {/* CAMBIO: Lógica de UI actualizada a 'producto' */}
        {!productoDesdeConsulta && !productoSeleccionado && (
          <>
            {/* CAMBIO: Texto actualizado */}
            <Text style={styles.label}>Buscar producto:</Text>
            <View style={styles.searchBox}>
              <TextInput
                style={styles.input}
                // CAMBIO: Placeholder actualizado
                placeholder="Ejemplo: Cámara de video"
                value={terminoBusqueda}
                onChangeText={setTerminoBusqueda}
              />
              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                // CAMBIO: 'buscarProducto'
                onPress={buscarProducto}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Buscar</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Lista de productos */}
        {/* CAMBIO: 'productos' y 'productoSeleccionado' */}
        {productos.length > 0 && !productoSeleccionado && (
          <FlatList
            data={productos}
            keyExtractor={(item, index) =>
              // CAMBIO: 'id_producto'
              item.id_producto
                ? item.id_producto.toString()
                : `producto-${index}`
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                // CAMBIO: 'seleccionarProducto'
                onPress={() => seleccionarProducto(item)} >
                <Text style={styles.listText}>
                  {/* CAMBIO: Campos de producto */}
                  {item.nombre_producto || item.nombre}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <Text style={{ color: "#fff", textAlign: "center", marginTop: 10 }}>
                {/* CAMBIO: Texto actualizado */}
                No hay productos para mostrar.
              </Text>
            )}
            scrollEnabled={false}
          />
        )}

        {/* Formulario */}
        {/* CAMBIO: 'productoSeleccionado' */}
        {productoSeleccionado && (
          <View style={styles.resultContainer}>

            {/* Botón/texto de regreso */}
            {!productoDesdeConsulta && (
              <TouchableOpacity
                // CAMBIO: 'deseleccionarProducto'
                onPress={deseleccionarProducto}
                style={styles.regresarButton}
              >
                <Text style={styles.regresarButtonText}>{"🔙 Volver a la lista"}</Text>
              </TouchableOpacity>
            )}

            {/* Título del formulario */}
            <Text style={styles.resultTitle}>
              Editar datos de{" "}
              {/* CAMBIO: Campos de producto */}
              {productoSeleccionado.nombre ||
               productoSeleccionado.nombre_producto ||
                "Producto"}
            </Text>

            {/* CAMBIO: Se usa 'ProductosFormView' */}
            <ProductosFormView
              modo="editar"
              // CAMBIO: 'servicio' -> 'producto'
              producto={productoSeleccionado}
              editable
              onChange={handleInputChange}
              onGuardar={guardarCambios}
              // (Se mantiene la lista de empleados para el dropdown)
              empleados={empleadosList} 
            />

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
// (Sin cambios)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  scrollContainer: { padding: 20, flexGrow: 1 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerIcon: { width: 60, height: 80, resizeMode: "contain", tintColor: "#ffffff" },
  backButton: {
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  backButtonText: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "bold",
  },
  headerTitle: {
    fontSize: 23,
    fontWeight: "700",
    marginLeft: 5,
    color: "#ffffff",
  },
  divider: { height: 3, backgroundColor: "#d92a1c", marginVertical: 5 },
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
    fontSize: 18,
    color: "#2b3042", 
    fontWeight: '500',
  },
});
