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
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";

// --- IMPORTACIONES ADAPTADAS ---
import DocumentosFormView from "./documentosform";
import { useEditarDocumentoLogic } from "../../../../controller/Modulo 2/SubModulos/Documentos/editardocumento";


export default function EditarDocumentoView() {
  const route = useRoute();
  const navigation = useNavigation();

  // Se busca 'documento' en los parámetros de navegación
  const documentoDesdeConsulta = route.params?.documento || null;

  const {
    terminoBusqueda,
    setTerminoBusqueda,
    documentos, // Cambiado de servicios
    documentoSeleccionado, // Cambiado de servicioSeleccionado
    setDocumentoDesdeNavegacion, // Cambiado de setServicioDesdeNavegacion
    empleadosList,
    loading,
    buscarDocumento, // Cambiado de buscarServicio
    seleccionarDocumento, // Cambiado de seleccionarServicio
    guardarCambios,
    deseleccionarDocumento, // Cambiado de deseleccionarServicio
    onChange: handleInputChange,
    onFileSelect,
    onViewFile
  } = useEditarDocumentoLogic(); // Hook adaptado

  useEffect(() => {
    if (documentoDesdeConsulta) {
      setDocumentoDesdeNavegacion(documentoDesdeConsulta);
    }
  }, [documentoDesdeConsulta, setDocumentoDesdeNavegacion]);

  const handleLogoPress = () => {
    Alert.alert(
      "Confirmar Navegación",
      // Texto adaptado
      "¿Desea salir del módulo de Gestión de Documentos y volver al menú principal?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Volver",
          onPress: () => navigation.navigate("MenuPrincipal"),
        },
      ],
      { cancelable: true }
    );
  }

  // Lógica de botones adaptada
  const buttonAction = documentoSeleccionado ? deseleccionarDocumento : buscarDocumento;
  const buttonText = documentoSeleccionado ? "Limpiar" : "Buscar";
  const isButtonDisabled = loading || (!documentoSeleccionado && !terminoBusqueda.trim());

  const isConsultarMode = !!documentoDesdeConsulta && !!documentoSeleccionado;
  const showSearchArea = !isConsultarMode && !documentoSeleccionado;

  if (loading && !documentoSeleccionado) {
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
        <View style={styles.header}>
          <TouchableOpacity onPress={handleLogoPress}>
            <Image
              source={require("../../../../../assets/LOGO_BLANCO.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Editar Documento</Text>
        </View>

        <View style={styles.divider} />

        {showSearchArea && (
          <>
            <Text style={styles.label}>Buscar documento por identificador:</Text>
            <View style={styles.searchBox}>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: CURP, RFC, NSS..."
                value={terminoBusqueda}
                onChangeText={setTerminoBusqueda}
              />
              <TouchableOpacity
                style={[styles.button, isButtonDisabled && { opacity: 0.6 }]}
                onPress={buttonAction}
                disabled={isButtonDisabled}
              >
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>{buttonText}</Text>}
              </TouchableOpacity>
            </View>

            {/* Resultados de búsqueda adaptados */}
            {documentos.length > 0 && !documentoSeleccionado && (
              <FlatList
                data={documentos}
                keyExtractor={(item) => item.id_documento.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => seleccionarDocumento(item)} >
                    <Text style={styles.listText}>
                      {/* Mostramos el identificador y el ID */}
                      {item.indentificador_unico || item.indentificadorUnico} (ID: {item.id_documento})
                    </Text>
                  </TouchableOpacity>
                )}
                scrollEnabled={false}
              />
            )}
          </>
        )}

        {/* Formulario de edición adaptado */}
        {documentoSeleccionado && (
          <View style={styles.resultContainer}>
            {!documentoDesdeConsulta && (
              <TouchableOpacity onPress={deseleccionarDocumento} style={styles.regresarButton}>
                <Text style={styles.regresarButtonText}>{"🔙 Buscar otro documento"}</Text>
              </TouchableOpacity>
            )}

            <Text style={styles.resultTitle}>
              Editando: {documentoSeleccionado.indentificadorUnico || "Documento"} (ID: {documentoSeleccionado.id_documento})
            </Text>

            {/* Componente de Formulario adaptado */}
            <DocumentosFormView
              modo="editar"
              documento={documentoSeleccionado} // Prop adaptada
              editable={true}
              onChange={handleInputChange}
              onGuardar={guardarCambios}
              onFileSelect={onFileSelect}
              onViewFile={onViewFile}
              empleados={empleadosList}
            />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}


// =========================
// ESTILOS (Sin cambios)
// =========================
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  scrollContainer: { padding: 20, flexGrow: 1 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerIcon: { width: 60, height: 80, resizeMode: "contain", tintColor: "#ffffff" },
  backButton: { paddingHorizontal: 10, justifyContent: "center", alignItems: "center" },
  backButtonText: { color: "#ffffff", fontSize: 28, fontWeight: "bold" },
  headerTitle: { fontSize: 23, fontWeight: "700", marginLeft: 5, color: "#ffffff" },
  divider: { height: 3, backgroundColor: "#d92a1c", marginVertical: 5 },
  label: { fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 10 },
  searchBox: { flexDirection: "row", alignItems: "center", gap: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: "#D0D3D4", borderRadius: 10, backgroundColor: "#fff", padding: 10 },
  button: { backgroundColor: "#77a7ab", paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10 },
  buttonText: { color: "#fff", fontWeight: "600" },
  listItem: { backgroundColor: "#fff", padding: 15, borderRadius: 8, marginTop: 8, borderWidth: 1, borderColor: "#E0E0E0" },
  listText: { fontSize: 16, fontWeight: "500", color: "#2C3E50" },
  resultContainer: { backgroundColor: "#fff", padding: 20, borderRadius: 12, marginTop: 20, elevation: 2 },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  regresarButton: { marginBottom: 15, alignSelf: 'flex-start' },
  regresarButtonText: { fontSize: 18, color: "#2b3042", fontWeight: '500' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: "#2b3042" },
  loadingText: { color: '#fff', marginTop: 10 },
  errorText: { color: '#d92a1c', fontSize: 16, textAlign: 'center', marginBottom: 20 }
});
