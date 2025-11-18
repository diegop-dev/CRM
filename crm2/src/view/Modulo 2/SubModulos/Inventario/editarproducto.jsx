// src/view/Modulo 2/SubModulos/Inventario/editarproducto.jsx
import React, { useEffect, useState, useCallback } from "react";
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
import ProductosFormView from "../Inventario/productosform";
import { useEditarProductoLogic } from "../../../../controller/Modulo 2/SubModulos/Inventario/editarproducto";

// ===================================
// 🔑 SOLUCIÓN: LA DEFINICIÓN DE ESTILOS VA AQUÍ
// ===================================
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#2b3042",
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
  },
  errorText: {
    color: '#d92a1c',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  }
});


export default function EditarProductoView() {
  const route = useRoute();
  const navigation = useNavigation();

  const productoDesdeConsulta = route.params?.producto || null;

  const {
    terminoBusqueda,
    setTerminoBusqueda,
    productos,
    productoSeleccionado,
    setProductoDesdeNavegacion,
    empleadosList,
    loading,
    buscarProducto,
    seleccionarProducto,
    guardarCambios,
    deseleccionarProducto,
    setProductoSeleccionado: handleFormChange
  } = useEditarProductoLogic();

  // Efecto para cargar el producto si viene pre-seleccionado desde otra vista (e.g., Consultar)
  useEffect(() => {
    if (productoDesdeConsulta) {
      setProductoDesdeNavegacion(productoDesdeConsulta);
    }
  }, [productoDesdeConsulta, setProductoDesdeNavegacion]);


  // 🔑 Handler que mapea snake_case (Form) a camelCase (Hook Logic)
  const handleInputChange = useCallback((campo, valor) => {
    let key;
    // Mapeamos los nombres que usa la vista/formulario a las claves que el hook de lógica espera
    if (campo === 'codigo_interno') key = 'codigoInterno';
    else if (campo === 'unidad_medida') key = 'unidadMedida';
    else key = campo;

    // Llamamos al handler del hook con la clave corregida (camelCase)
    handleFormChange(key, valor);
  }, [handleFormChange]);


  // Determina la acción y texto del botón de búsqueda
  const buttonAction = productoSeleccionado ? deseleccionarProducto : buscarProducto;
  const buttonText = productoSeleccionado ? "Limpiar" : "Buscar";
  const isButtonDisabled = loading || (!productoSeleccionado && !terminoBusqueda.trim());


  // Si venimos desde consulta, mostramos el formulario directamente
  const isConsultarMode = !!productoDesdeConsulta && !!productoSeleccionado;
  const showSearchArea = !isConsultarMode && !productoSeleccionado;

  // Loader de pantalla completa
  if (loading && !productoSeleccionado) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d92a1c" />
        <Text style={styles.loadingText}>Cargando datos iniciales...</Text>
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
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Producto</Text>
        </View>

        <View style={styles.divider} />

        {/* Área de Búsqueda y Lista */}
        {showSearchArea && (
          <>
            <Text style={styles.label}>Buscar producto por nombre o código:</Text>
            <View style={styles.searchBox}>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: Cámara de video o CÓD-123"
                value={terminoBusqueda}
                onChangeText={setTerminoBusqueda}
              />
              <TouchableOpacity
                style={[styles.button, isButtonDisabled && { opacity: 0.6 }]}
                onPress={buttonAction}
                disabled={isButtonDisabled}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>{buttonText}</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Lista de resultados de búsqueda */}
            {productos.length > 0 && (
              <FlatList
                data={productos}
                keyExtractor={(item) => item.id_producto.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => seleccionarProducto(item)} >
                    <Text style={styles.listText}>
                      {item.nombre} (ID: {item.id_producto})
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  <Text style={{ color: "#fff", textAlign: "center", marginTop: 10 }}>
                    No hay productos para mostrar.
                  </Text>
                )}
                scrollEnabled={false}
              />
            )}
          </>
        )}

        {/* Formulario de Edición */}
        {productoSeleccionado && (
          <View style={styles.resultContainer}>

            {/* Botón de Regreso (solo si no venimos de consulta) */}
            {!isConsultarMode && (
              <TouchableOpacity
                onPress={deseleccionarProducto}
                style={styles.regresarButton}
              >
                <Text style={styles.regresarButtonText}>{"🔙 Buscar otro producto"}</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.resultTitle}>
              Editando: {productoSeleccionado.nombre} (ID: {productoSeleccionado.id_producto})
            </Text>

            <ProductosFormView
              modo="editar"
              producto={productoSeleccionado}
              editable
              onChange={handleInputChange} // Usa el setter del hook
              onGuardar={guardarCambios}
              empleados={empleadosList}
            />

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}