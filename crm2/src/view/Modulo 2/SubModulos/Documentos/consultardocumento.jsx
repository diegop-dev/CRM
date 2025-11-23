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
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRoute, useNavigation } from "@react-navigation/native";

// --- IMPORTACIONES ---
import DocumentosFormView from "./documentosform";
import { useEditarDocumentoLogic } from "../../../../controller/Modulo 2/SubModulos/Documentos/editardocumento";

export default function EditarDocumentoView() {
  const route = useRoute();
  const navigation = useNavigation();

  // Verificamos si venimos de la pantalla de "Consultar" con un documento pre-cargado
   const { documentoSeleccionado: documentoDesdeConsulta } = route.params || {};

  // Desestructuramos toda la lógica del Hook
  const {
    terminoBusqueda,
    setTerminoBusqueda,
    documentos,            // Lista de resultados de búsqueda
    documentoSeleccionado, // El objeto que estamos editando
    setDocumentoDesdeNavegacion,
    empleadosList,
    loading,
    buscarDocumento,
    seleccionarDocumento,
    guardarCambios,
    deseleccionarDocumento,
    onChange: handleInputChange,
    onFileSelect, // Handler para subir archivo (si se habilita en el form)
    onViewFile    // Handler para visualizar el PDF existente
  } = useEditarDocumentoLogic();

  // Efecto: Si entramos con un documento desde otra pantalla, lo cargamos
  useEffect(() => {
    if (documentoDesdeConsulta) {
      setDocumentoDesdeNavegacion(documentoDesdeConsulta);
    }
  }, [documentoDesdeConsulta, setDocumentoDesdeNavegacion]);

  const handleLogoPress = () => {
    Alert.alert(
      "Confirmar Navegación",
      "¿Desea salir del módulo y volver al menú principal?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Volver",
          onPress: () => navigation.navigate("MenuPrincipal"),
        },
      ],
      { cancelable: true }
    );
  };

  // Configuración de la interfaz de búsqueda dinámica
  const buttonAction = documentoSeleccionado ? deseleccionarDocumento : buscarDocumento;
  const buttonText = documentoSeleccionado ? "Limpiar" : "Buscar";
  
  // El botón se deshabilita si carga O (si no hay selección Y no hay texto escrito)
  const isButtonDisabled = loading || (!documentoSeleccionado && !terminoBusqueda.trim());

  // Determinar si mostramos la barra de búsqueda (Solo la ocultamos si venimos de consulta externa)
  const showSearchArea = !documentoDesdeConsulta;

  // Loader
  if (loading && !documentoSeleccionado) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#d92a1c" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView nestedScrollEnabled contentContainerStyle={styles.scrollContainer}>
        
        {/* ENCABEZADO */}
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

        {/* ÁREA DE BÚSQUEDA (Siempre visible si no venimos de consulta) */}
        {showSearchArea && (
          <>
            <Text style={styles.label}>Buscar por identificador (RFC, CURP...):</Text>
            <View style={styles.searchBox}>
              <TextInput
                style={styles.input}
                placeholder="Ejemplo: ABCD123456..."
                value={terminoBusqueda}
                onChangeText={setTerminoBusqueda}
              />
              {/* BOTÓN CON DOBLE FUNCIÓN (Buscar / Limpiar) */}
              <TouchableOpacity
                style={[
                    styles.button, 
                    isButtonDisabled && { opacity: 0.6 },
                    documentoSeleccionado && { backgroundColor: "#d92a1c" } // Rojo si es Limpiar
                ]}
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

            {/* LISTA DE RESULTADOS (Solo visible si NO hay documento seleccionado) */}
            {documentos.length > 0 && !documentoSeleccionado && (
              <FlatList
                data={documentos}
                keyExtractor={(item) => item.id_documento.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.listItem}
                    onPress={() => seleccionarDocumento(item)}
                  >
                    <Text style={styles.listText}>
                      {item.indentificador_unico || item.nombre_documento} (ID: {item.id_documento})
                    </Text>
                    <Text style={{ fontSize: 12, color: '#666' }}>
                        {item.tipo_documento || item.categoria} - {item.empleado_nombre || "Sin Asignar"}
                    </Text>
                  </TouchableOpacity>
                )}
                scrollEnabled={false}
              />
            )}
          </>
        )}

        {/* FORMULARIO DE EDICIÓN (Visible al seleccionar) */}
        {documentoSeleccionado && (
          <View style={styles.resultContainer}>
            
            {/* Nota: Se eliminó el botón "REGRESAR" antiguo porque el botón "Limpiar" de arriba cumple esa función */}

            <Text style={styles.resultTitle}>
              Editando: {documentoSeleccionado.indentificadorUnico || "Documento"}
            </Text>

            <DocumentosFormView
              modo="editar" 
              documento={documentoSeleccionado}
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

// --- ESTILOS ---
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#2b3042" },
  scrollContainer: { padding: 20, flexGrow: 1 },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  headerIcon: { width: 60, height: 80, resizeMode: "contain", tintColor: "#ffffff" },
  headerTitle: { fontSize: 23, fontWeight: "700", marginLeft: 5, color: "#ffffff" },
  divider: { height: 3, backgroundColor: "#d92a1c", marginVertical: 5 },
  
  label: { fontSize: 16, fontWeight: "600", color: "#ffffff", marginBottom: 10 },
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
    backgroundColor: "#77a7ab",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
    justifyContent: 'center'
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
    backgroundColor: "",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    elevation: 2,
  },
  resultTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10, color: "#ffffffff", textAlign:"center" },
  
  regresarButton: { marginBottom: 15, alignSelf: 'flex-start' },
  regresarButtonText: { fontSize: 16, color: "#ff0000ff", fontWeight: 'bold' },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#2b3042",
  },
  loadingText: { color: '#fff', marginTop: 10 },
});