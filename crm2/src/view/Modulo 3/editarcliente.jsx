// src/view/Modulo1/editarcliente.jsx
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
// CAMBIO: Se importa el formulario de Clientes
import ClientesFormView from "../../view/Modulo 3/clientesform";
// CAMBIO: Se importa el (futuro) hook de lógica para editar cliente
import { useEditarClienteLogic } from "../../controller/Modulo 3/editarcliente";

// CAMBIO: Renombrado el componente
export default function EditarClienteView() {
  const route = useRoute();
  const navigation = useNavigation();
  // CAMBIO: 'empleado' -> 'cliente'
  const clienteDesdeConsulta = route.params?.cliente || null;

  // CAMBIO: Se desestructuran las variables renombradas del nuevo hook
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    clientes, // 'empleados' -> 'clientes'
    clienteSeleccionado, // 'empleadoSeleccionado' -> 'clienteSeleccionado'
    setClienteSeleccionado, // 'setEmpleadoSeleccionado' -> 'setClienteSeleccionado'
    loading,
    buscarCliente, // 'buscarEmpleado' -> 'buscarCliente'
    seleccionarCliente, // 'seleccionarEmpleado' -> 'seleccionarCliente'
    guardarCambios,
    deseleccionarCliente, // 'deseleccionarEmpleado' -> 'deseleccionarCliente'
  } = useEditarClienteLogic();

  // CAMBIO: Se actualiza el useEffect para 'cliente'
  useEffect(() => {
    if (clienteDesdeConsulta) {
      setClienteSeleccionado(clienteDesdeConsulta);
    }
  }, [clienteDesdeConsulta]);

  // CAMBIO: Esta función actualiza el estado 'clienteSeleccionado'
  const handleInputChange = (campo, valor) => {
    setClienteSeleccionado({ ...clienteSeleccionado, [campo]: valor });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView nestedScrollEnabled contentContainerStyle={styles.scrollContainer}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/LOGO_BLANCO.png")}
            style={styles.headerIcon}
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>{"<"}</Text>
          </TouchableOpacity>
          {/* CAMBIO: Título actualizado */}
          <Text style={styles.headerTitle}>Editar Cliente</Text>
        </View>

        <View style={styles.divider} />

        {/* Campo de búsqueda (solo si no venimos desde consulta) */}
        {/* CAMBIO: Condición actualizada a 'cliente' */}
        {!clienteDesdeConsulta && !clienteSeleccionado && (
          <>
            {/* CAMBIO: Texto actualizado */}
            <Text style={styles.label}>Buscar cliente:</Text>
            <View style={styles.searchBox}>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: Juan Pérez"
                value={terminoBusqueda}
                onChangeText={setTerminoBusqueda}
              />
              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                // CAMBIO: 'buscarEmpleado' -> 'buscarCliente'
                onPress={buscarCliente}
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

        {/* Lista de clientes */}
        {/* CAMBIO: 'empleados' -> 'clientes', 'empleadoSeleccionado' -> 'clienteSeleccionado' */}
        {clientes.length > 0 && !clienteSeleccionado && (
          <FlatList
            // CAMBIO: 'empleados' -> 'clientes'
            data={clientes}
            keyExtractor={(item, index) =>
              // CAMBIO: 'id_empleado' -> 'id_cliente', 'idEmpleado' -> 'idCliente'
              item.id_cliente
                ? item.id_cliente.toString()
                : item.idCliente
                  ? item.idCliente.toString()
                  : `cliente-${index}` // 'empleado-' -> 'cliente-'
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                // CAMBIO: 'seleccionarEmpleado' -> 'seleccionarCliente'
                onPress={() => seleccionarCliente(item)} >
                <Text style={styles.listText}>
                  {/* CAMBIO: Campos actualizados a los del cliente */}
                  {item.nombre_cliente || item.nombreCliente}{" "}
                  {item.apellido_paterno || item.apellidoPaterno}{" "}
                  {item.apellido_materno || item.apellidoMaterno}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              // CAMBIO: Texto actualizado
              <Text style={{ color: "#fff", textAlign: "center", marginTop: 10 }}>
                No hay clientes para mostrar.
              </Text>
            )}
            scrollEnabled={false}
          />
        )}

        {/* Formulario */}
        {/* CAMBIO: 'empleadoSeleccionado' -> 'clienteSeleccionado' */}
        {clienteSeleccionado && (
          <View style={styles.resultContainer}>

            {/* CAMBIO: Condición actualizada a 'cliente' */}
            {!clienteDesdeConsulta && (
              <TouchableOpacity
                // CAMBIO: 'deseleccionarEmpleado' -> 'deseleccionarCliente'
                onPress={deseleccionarCliente}
                style={styles.regresarButton}
              >
                <Text style={styles.regresarButtonText}>{"🔙 Volver a la lista"}</Text>
              </TouchableOpacity>
            )}

            {/* CAMBIO: Título y campo actualizado */}
            <Text style={styles.resultTitle}>
              Editar datos de{" "}
              {clienteSeleccionado.nombreCliente ||
                clienteSeleccionado.nombre_cliente || // Añadida verificación por si viene de API
                "Cliente"}
            </Text>

            {/* CAMBIO: Se usa ClientesFormView */}
            <ClientesFormView
              modo="editar"
              // CAMBIO: 'empleado' -> 'cliente'
              cliente={clienteSeleccionado}
              editable
              onChange={handleInputChange}
              onGuardar={guardarCambios}
            />

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
// (Sin cambios, según la instrucción)
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
