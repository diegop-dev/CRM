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
// --- IMPORTACIONES ADAPTADAS ---
import DocumentosFormView from "./documentosform";
import { useConsultarDocumentoLogic } from "../../../../controller/Modulo 2/SubModulos/Documentos/consultardocumento";

export default function ConsultarDocumentoView() {
  const navigation = useNavigation();
  const handleLogoPress = () => {
    Alert.alert(
      "Confirmar Navegación",
      "¿Desea salir del módulo de Consultar Documento y volver al menú principal?", // Adaptado
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

  // --- HOOK DE LÓGICA ADAPTADO ---
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    documentos, // Adaptado
    documento, // Adaptado
    empleadosList,
    loading,
    buscarDocumento, // Adaptado
    seleccionarDocumento, // Adaptado
    deseleccionarDocumento, // Adaptado
  } = useConsultarDocumentoLogic(); // Adaptado

  const handleTouchDisabled = () => {
    if (documento) { // Adaptado
      Alert.alert(
        "Modo consulta",
        "¿Desea editar este documento?", // Adaptado
        [
          { text: "No", style: "cancel" },
          {
            text: "Sí",
            onPress: () => {
              Alert.alert(
                "Área segura",
                "¿Desea ser dirigido al área segura para editar documento?", // Adaptado
                [
                  { text: "Cancelar", style: "cancel" },
                  {
                    text: "Confirmar",
                    onPress: () => {
                      // Navega a EditarDocumento con el documento
                      navigation.navigate("EditarDocumento", { documento }); // Adaptado
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
  // Función: abrir PDF (Se mantiene, es genérica)
  // ---------------------------
  const handleViewFile = async (url) => {
    if (!url) {
      Alert.alert("Archivo no disponible", "No se encontró la URL del archivo.");
      return;
    }
    const isHttp = /^https?:\/\//i.test(url);

    try {
      if (isHttp) {
        const supported = await Linking.canOpenURL(url);
        if (supported) {
          await Linking.openURL(url);
        } else {
          Alert.alert("No se puede abrir el enlace", "No se pudo abrir la URL del archivo.");
        }
      } else {
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
              source={require("../../../../../assets/LOGO_BLANCO.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Consultar Documento</Text> {/* Adaptado */}
        </View>

        <View style={styles.divider} />

        {/* --- ÁREA DE BÚSQUEDA --- */}
        {!documento && ( // Adaptado
          <>
            <Text style={styles.label}>Buscar por identificador (CURP, RFC...):</Text> {/* Adaptado */}
            <View style={styles.searchBox}>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: CURP, RFC..." // Adaptado
                value={terminoBusqueda}
                onChangeText={setTerminoBusqueda}
              />
              <TouchableOpacity
                style={[styles.button, loading && { opacity: 0.6 }]}
                onPress={buscarDocumento} // Adaptado
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Buscar</Text>
                )}
              </TouchableOpacity>
            </View>

            {loading && !documentos.length ? ( // Adaptado
              <ActivityIndicator size="large" color="#FFF" style={{ marginTop: 20 }} />
            ) : (
              // --- LISTA DE RESULTADOS ---
              <FlatList
                data={documentos} // Adaptado
                keyExtractor={(item, index) =>
                  item.id_documento ? item.id_documento.toString() : `doc-${index}` // Adaptado
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => seleccionarDocumento(item)} // Adaptado
                  >
                    <Text style={styles.listText}>
                      {item.indentificador_unico || item.indentificadorUnico} {/* Adaptado */}
                    </Text>
                    <Text style={styles.listSubText}>
                      Categoría: {item.categoria || "N/A"} {/* Adaptado */}
                    </Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={() => (
                  !loading && (
                    <Text style={styles.emptyListText}>
                      {terminoBusqueda ? "No se encontraron resultados." : "No hay documentos para mostrar."} {/* Adaptado */}
                    </Text>
                  )
                )}
                scrollEnabled={false}
              />
            )}
          </>
        )}

        {/* --- VISTA DE FORMULARIO EN MODO CONSULTA --- */}
        {documento && ( // Adaptado
          <View style={styles.resultContainer}>
            <TouchableOpacity onPress={deseleccionarDocumento} style={styles.regresarButton}> {/* Adaptado */}
              <Text style={styles.regresarButtonText}>{"< Volver a la búsqueda"}</Text>
            </TouchableOpacity>

            <Text style={styles.resultTitle}>Datos del Documento</Text> {/* Adaptado */}

            {/* ---- Componente de Formulario de Documento ---- */}
            <DocumentosFormView
              modo="consultar"
              documento={documento} // Adaptado
              empleados={empleadosList}
              onTouchDisabled={handleTouchDisabled}
              onViewFile={handleViewFile}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// Estilos (Se mantienen, son genéricos)
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
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    elevation: 2,
  },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  regresarButton: {
    marginBottom: 15,
    alignSelf: "flex-start",
  },
  regresarButtonText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "500",
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
