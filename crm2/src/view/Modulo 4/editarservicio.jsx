// src/view/Modulo_X/editarservicio.jsx
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
// CAMBIO: Se importa el formulario de Servicios
import ServiciosFormView from "../../view/Modulo 4/serviciosform"; // Ajusta esta ruta
// CAMBIO: Se importa el (futuro) hook de lógica para editar servicio
import { useEditarServicioLogic } from "../../controller/Modulo 4/editarservicio"; // Ajusta esta ruta

// CAMBIO: Renombrado el componente
export default function EditarServicioView() {
  const route = useRoute();
  const navigation = useNavigation();
  // CAMBIO: 'empleado' -> 'servicio'
  const servicioDesdeConsulta = route.params?.servicio || null;

  // CAMBIO: Se desestructuran las variables del nuevo hook
  // (Incluyendo 'empleadosList' de la lógica de proyecto)
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    servicios, // La lista de resultados de búsqueda
    servicioSeleccionado, // El servicio que se está editando
    setServicioSeleccionado,
    setServicioDesdeNavegacion, // Para el useEffect
    empleadosList, // <-- LÓGICA DE 'editarproyecto.jsx'
    loading,
    buscarServicio,
    seleccionarServicio,
    guardarCambios,
    deseleccionarServicio,
  } = useEditarServicioLogic();

  // CAMBIO: Se usa la función de formateo para 'servicio'
  useEffect(() => {
    if (servicioDesdeConsulta) {
      // Asumiendo que el hook 'useEditarServicioLogic'
      // expondrá una función de seteo que formatea el objeto.
      // Si no, lo seteamos directamente.
      setServicioSeleccionado(servicioDesdeConsulta); 
    }
  }, [servicioDesdeConsulta]);

  // CAMBIO: Esta función actualiza el 'servicioSeleccionado'
  const handleInputChange = (campo, valor) => {
    setServicioSeleccionado({ ...servicioSeleccionado, [campo]: valor });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView nestedScrollEnabled contentContainerStyle={styles.scrollContainer}>
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/LOGO_BLANCO.png")} // Ajusta la ruta
            style={styles.headerIcon}
          />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>{"<"}</Text>
          </TouchableOpacity>
          {/* CAMBIO: Título actualizado */}
          <Text style={styles.headerTitle}>Editar Servicio</Text>
        </View>

        <View style={styles.divider} />

        {/* Campo de búsqueda (solo si no venimos desde consulta) */}
        {/* CAMBIO: Lógica de UI de 'editarempleado.jsx' */}
        {!servicioDesdeConsulta && !servicioSeleccionado && (
          <>
            {/* CAMBIO: Texto actualizado */}
            <Text style={styles.label}>Buscar servicio:</Text>
            <View style={styles.searchBox}>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: Consultoría de Marketing"
                value={terminoBusqueda}
                onChangeText={setTerminoBusqueda}
              />
              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                // CAMBIO: 'buscarServicio'
                onPress={buscarServicio}
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

        {/* Lista de servicios */}
        {/* CAMBIO: 'servicios' y 'servicioSeleccionado' */}
        {servicios.length > 0 && !servicioSeleccionado && (
          <FlatList
            data={servicios}
            keyExtractor={(item, index) =>
              item.id_servicio
                ? item.id_servicio.toString()
                : `servicio-${index}`
            }
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                // CAMBIO: 'seleccionarServicio'
                onPress={() => seleccionarServicio(item)} >
                <Text style={styles.listText}>
                  {/* CAMBIO: Campos de servicio */}
                  {item.nombre_servicio || item.nombreServicio}
                </Text>
              </TouchableOpacity>
            )}
            ListEmptyComponent={() => (
              <Text style={{ color: "#fff", textAlign: "center", marginTop: 10 }}>
                {/* CAMBIO: Texto actualizado */}
                No hay servicios para mostrar.
              </Text>
            )}
            scrollEnabled={false}
          />
        )}

        {/* Formulario */}
        {/* CAMBIO: 'servicioSeleccionado' */}
        {servicioSeleccionado && (
          <View style={styles.resultContainer}>

            {/* Botón/texto de regreso */}
            {!servicioDesdeConsulta && (
              <TouchableOpacity
                // CAMBIO: 'deseleccionarServicio'
                onPress={deseleccionarServicio}
                style={styles.regresarButton}
              >
                <Text style={styles.regresarButtonText}>{"🔙 Volver a la lista"}</Text>
              </TouchableOpacity>
            )}

            {/* Título del formulario */}
            <Text style={styles.resultTitle}>
              Editar datos de{" "}
              {/* CAMBIO: Campos de servicio */}
              {servicioSeleccionado.nombreServicio ||
               servicioSeleccionado.nombre_servicio ||
                "Servicio"}
            </Text>

            {/* CAMBIO: Se usa 'ServiciosFormView' */}
            <ServiciosFormView
              modo="editar"
              servicio={servicioSeleccionado}
              editable
              onChange={handleInputChange}
              onGuardar={guardarCambios}
              // --- COMBINACIÓN CLAVE ---
              // (Pasamos la lista de empleados de la lógica de 'proyecto')
              empleados={empleadosList} 
              // --- FIN DE COMBINACIÓN ---
            />

          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
// (Usamos los estilos de 'editarempleado.jsx' ya que el layout es idéntico)
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
