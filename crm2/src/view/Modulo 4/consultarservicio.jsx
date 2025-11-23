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
  FlatList,
  Linking,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import ServiciosFormView from "../../view/Modulo 4/serviciosform";
import { useConsultarServicioLogic } from "../../controller/Modulo 4/consultarservicio";

export default function ConsultarServicioView() {
  const navigation = useNavigation();
  const handleLogoPress = () => {
    Alert.alert(
      "Confirmar Navegación",
      "¿Desea salir del módulo de Consultar Servicio y volver al menú principal?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Volver",
          onPress: () => {
            Alert.alert(
              "Área Segura",
              "Será redirigido al Menú Principal.",
              [
                { text: "Permanecer", style: "cancel" },
                {
                  text: "Confirmar",
                  onPress: () => {
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
  };

  const {
    terminoBusqueda,
    setTerminoBusqueda,
    servicios,
    servicio,
    empleadosList,
    loading,
    buscarServicio,
    seleccionarServicio,
    deseleccionarServicio,
  } = useConsultarServicioLogic();

  const handleTouchDisabled = () => {
    if (servicio) {
      Alert.alert(
        "Modo consulta",
        "¿Desea editar este servicio?",
        [
          { text: "No", style: "cancel" },
          {
            text: "Sí",
            onPress: () => {
              Alert.alert(
                "Área segura",
                "¿Desea ser dirigido al área segura para editar servicio?",
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Confirmar",
                    onPress: () => {
                      navigation.navigate("EditarServicio", { servicio });
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

  // ---------------------------
  // Nueva función: abrir PDF
  // ---------------------------
  const handleViewFile = async (url) => {
    if (!url) {
      Alert.alert("Archivo no disponible", "No se encontró la URL del archivo.");
      return;
    }

    // Si es una ruta relativa sin protocolo, avisar al usuario
    const isHttp = /^https?:\/\//i.test(url);

    try {
      if (isHttp) {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          // En Android/iOS raramente ocurre, pero avisamos
          Alert.alert("No se puede abrir el enlace", "No se pudo abrir la URL del archivo.");
        }
      } else {
        // No es una URL http(s) — puede ser base64 / ruta local o vacío
        // Si es base64: indicarlo al usuario (necesitaría manejo distinto)
        if (url.startsWith("data:application/pdf;base64,")) {
          Alert.alert(
            "Archivo en Base64",
            "El archivo está en Base64. Actualmente la vista previa no está implementada para Base64 en esta pantalla."
          );
        } else {
          Alert.alert(
            "Formato no soportado",
            "La ruta del archivo no es una URL pública. Si es un archivo local, debe descargarse o abrirse con un viewer específico."
          );
        }
      }
    } catch (error) {
      console.error("Error al abrir archivo:", error);
      Alert.alert("Error", "No se pudo abrir el archivo. Intente desde otro dispositivo o verifique la URL.");
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContainer} nestedScrollEnabled>
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
            <Image
              source={require("../../../assets/LOGO_BLANCO.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Consultar Servicio</Text>
        </View>

        <View style={styles.divider} />

        {/* CAMBIO 1: ÁREA DE BÚSQUEDA SIEMPRE VISIBLE */}
        <Text style={styles.label}>Buscar por nombre de servicio:</Text>
        <View style={styles.searchBox}>
            <TextInput
            style={styles.input}
            placeholder="Ejemplo: Consultoría"
            value={terminoBusqueda}
            onChangeText={setTerminoBusqueda}
            />
            {/* CAMBIO 2: BOTÓN CON DOBLE FUNCIÓN (Buscar / Limpiar) */}
            <TouchableOpacity
            style={[
                styles.button, 
                loading && { opacity: 0.6 },
                servicio && { backgroundColor: "#d92a1c" } // Color rojo si es Limpiar
            ]}
            onPress={servicio ? deseleccionarServicio : buscarServicio}
            disabled={loading}
            >
            {loading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text style={styles.buttonText}>
                    {servicio ? "Limpiar" : "Buscar"}
                </Text>
            )}
            </TouchableOpacity>
        </View>

        {/* LISTA DE RESULTADOS (Solo visible si NO hay servicio seleccionado) */}
        {!servicio && (
          <>
            {loading && !servicios.length ? (
              <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 20 }} />
            ) : (
              <FlatList
                data={servicios}
                keyExtractor={(item, index) =>
                  item.id_servicio ? item.id_servicio.toString() : `srv-${index}`
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => seleccionarServicio(item)}
                  >
                    <Text style={styles.listText}>
                      {item.nombre_servicio || item.nombreServicio}
                    </Text>
                    <Text style={styles.listSubText}>
                      Categoría: {item.categoria || "N/A"}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  !loading && (
                    <Text style={styles.emptyListText}>
                      {terminoBusqueda ? "No se encontraron resultados." : "No hay servicios para mostrar."}
                    </Text>
                  )
                )}
                scrollEnabled={false}
              />
            )}
          </>
        )}

        {/* VISTA DEL SERVICIO SELECCIONADO */}
        {servicio && (
          <View style={styles.resultContainer}>
            

            <Text style={styles.resultTitle}>Datos del Servicio</Text>

            {/* ---- AQUÍ PASAMOS onViewFile AL FORM ---- */}
            <ServiciosFormView
              modo="consultar"
              servicio={servicio}
              empleados={empleadosList}
              onTouchDisabled={handleTouchDisabled}
              onViewFile={handleViewFile} // <-- función pasada correctamente
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos (mantengo exactamente los tuyos)
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  scrollContainer: { padding: 20, flexGrow: 1, paddingHorizontal: 15, paddingTop: 5 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerIcon: { width: 60, height: 80, resizeMode: "contain", tintColor: "#ffffff" },
  headerTitle: { fontSize: 25, fontWeight: "700", marginLeft: 15, color: "#ffffff" },
  divider: { height: 3, backgroundColor: "#d92a1c", marginVertical: 1 },
  label: { fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 15 },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 20 },
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
    backgroundColor: "",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    elevation: 2,
  },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, fontStyle: "italic", color:"white" },
  regresarButton: {
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  regresarButtonText: {
    fontSize: 16,
    color: "#ff0000ff",
    fontWeight: "500",
    fontStyle: "italic",
  },
  listItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  listText: { fontSize: 16, fontWeight: "500", color: "#2C3E50" },
  listSubText: { fontSize: 14, color: "#555", marginTop: 4 },
  emptyListText: {
    color: "#fff",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    opacity: 0.8,
  },
});