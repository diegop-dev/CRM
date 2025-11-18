import { useState, useEffect, useCallback } from "react";
import { Alert, Linking } from "react-native";
import { API_URL } from "../../../../config/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from "expo-document-picker";
import { useNavigation, useRoute } from "@react-navigation/native";

// =========================
//     DOCUMENTO VACÍO
// =========================
const DOCUMENTO_VACIO = {
  id_documento: null,
  indentificadorUnico: "",
  descripcion: "",
  categoria: "",
  idEmpleado: "",
  empleadoNombre: "",
  estado: "actualizado",
  archivo: null,
};

// =========================
//  FORMATEAR DOCUMENTO
// =========================
function formatearDocumento(d) {
  if (!d) return DOCUMENTO_VACIO;

  return {
    id_documento: d.id_documento || d.idDocumento,

    indentificadorUnico: (d.indentificador_unico || d.indentificadorUnico || "").trim(),
    descripcion: (d.descripción || d.descripcion || "").trim(), // Lee la clave con tilde
    categoria: (d.categoria || "").trim(),
    estado: (d.estado || "").trim(),

    idEmpleado: d.id_empleado
      ? d.id_empleado.toString()
      : (d.idEmpleado || ""),

    empleadoNombre: d.empleadoNombre || d.empleado_nombre || "",
    archivo: (d.archivo || "").trim(),
  };
}

// =========================
//  DETECTAR CAMBIOS
// =========================
function hasChanges(original, current) {
  if (!original || !current) return false;

  for (const key of Object.keys(original)) {
    if (key === "id_documento") continue; // Clave de ID adaptada

    if (key === "archivo") {
      // Si el archivo actual es un objeto (nuevo archivo seleccionado)
      if (typeof current[key] === "object" && current[key] !== null) return true;
      // Si la URL del archivo cambió (aunque no debería, por si acaso)
      if ((original[key] || "").trim() !== (current[key] || "").trim()) return true;
      continue;
    }

    if ((original[key] || "").toString().trim() !== (current[key] || "").toString().trim()) {
      return true;
    }
  }
  return false;
}

// ======================================================
//           HOOK PRINCIPAL: useEditarDocumentoLogic
// ======================================================
export function useEditarDocumentoLogic() {
  const navigation = useNavigation();
  const route = useRoute();
  const documentoDesdeRuta = route.params?.documento; // Adaptado

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [documentos, setDocumentos] = useState([]); // Adaptado
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null); // Adaptado
  const [originalDocumento, setOriginalDocumento] = useState(null); // Adaptado

  const [empleadosList, setEmpleadosList] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  //  CAMBIAR VALOR DEL FORM
  // =========================
  const handleDocumentoChange = useCallback((key, value) => { // Adaptado
    setDocumentoSeleccionado(prev => ({ ...prev, [key]: value }));
  }, []);

  // =========================
  //  CARGAR ALEATORIOS
  // =========================
  const cargarDocumentosAleatorios = useCallback(async () => { // Adaptado
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/documentos/aleatorios`); // Endpoint
      const data = await response.json();
      setDocumentos(data.success ? data.documentos : []); // Adaptado
    } catch {
      Alert.alert("Error", "No se pudieron cargar los documentos iniciales."); // Mensaje
    }
    setLoading(false);
  }, []);

  // =========================
  //  BUSCAR DOCUMENTO
  // =========================
  const buscarDocumento = useCallback(async () => { // Adaptado
    if (!terminoBusqueda.trim()) return cargarDocumentosAleatorios();

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/documentos/buscar?termino=${encodeURIComponent(terminoBusqueda)}`); // Endpoint
      const data = await response.json();

      if (data.success && data.documentos.length) { // Adaptado
        setDocumentos(data.documentos); // Adaptado
      } else {
        setDocumentos([]); // Adaptado
        Alert.alert("Sin resultados", "No se encontró ningún documento."); // Mensaje
      }

    } catch {
      Alert.alert("Error", "No se pudo realizar la búsqueda.");
    }
    setLoading(false);
  }, [terminoBusqueda, cargarDocumentosAleatorios]);

  // ======================================================
  //       SELECCIONAR DOCUMENTO DESDE LA LISTA
  // ======================================================
  const seleccionarDocumento = useCallback(async (d) => { // Adaptado
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/documentos/${d.id_documento || d.idDocumento}`); // Endpoint
      const data = await response.json();

      if (data.success) {
        const formateado = formatearDocumento(data.documento); // Adaptado
        setDocumentoSeleccionado(formateado); // Adaptado
        setOriginalDocumento(formateado); // Adaptado
        setDocumentos([]); // Adaptado
      }

    } catch {
      Alert.alert("Error", "No se pudo obtener el documento."); // Mensaje
    }
    setLoading(false);
  }, []);

  // ======================================================
  //        RECIBIR DOCUMENTO DESDE CONSULTAR JSX
  // ======================================================
  const setDocumentoDesdeNavegacion = useCallback((raw) => { // Adaptado
    const f = raw.idEmpleado ? raw : formatearDocumento(raw); // Check con idEmpleado
    setDocumentoSeleccionado(f);
    setOriginalDocumento(f);
  }, []);

  // =========================
  //  DESELECCIONAR
  // =========================
  const deseleccionarDocumento = useCallback(() => { // Adaptado
    setDocumentoSeleccionado(null);
    setOriginalDocumento(null);
    cargarDocumentosAleatorios();
  }, [cargarDocumentosAleatorios]);

  // ======================================================
  //             ABRIR ARCHIVO PDF (Genérico - Sin cambios)
  // ======================================================
  const handleViewFile = useCallback(async (fileUrl) => {
    if (!fileUrl) return Alert.alert("Error", "No hay archivo adjunto.");
    const fullUrl = `${API_URL}${fileUrl}`;
    const supported = await Linking.canOpenURL(fullUrl);
    if (!supported) {
      return Alert.alert(
        "Error",
        "Este archivo no se puede abrir.\nVerifica que Express sirva /uploads correctamente."
      );
    }
    await Linking.openURL(fullUrl);
  }, []);

  // ======================================================
  //     SELECCIONAR PDF DEL DISPOSITIVO
  // ======================================================
  const handleFileSelect = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        const asset = result.assets[0];
        handleDocumentoChange("archivo", asset); // Handler adaptado
        Alert.alert("Archivo seleccionado", asset.name);
      }
    } catch {
      Alert.alert("Error", "No se pudo abrir el selector de documentos.");
    }
  }, [handleDocumentoChange]);

  // ======================================================
  //           GUARDAR DOCUMENTO (PUT)
  // ======================================================
  const _proceedToSave = async () => {
    const isFileChanged = typeof documentoSeleccionado.archivo === "object";

    const idUsuarioString = await AsyncStorage.getItem("id_usuario");
    const idUsuario = idUsuarioString ? parseInt(idUsuarioString) : null;
    if (!idUsuario) return Alert.alert("Error", "Sesión expirada.");

    const url = `${API_URL}/documentos/${documentoSeleccionado.id_documento}`; // Endpoint

    let body;
    let headers = {};

    if (isFileChanged) {
      // --- Si el archivo cambió, usamos FormData ---
      body = new FormData();

      // Campos del documento
      body.append("indentificador_unico", documentoSeleccionado.indentificadorUnico);
      body.append("descripción", documentoSeleccionado.descripcion); // Clave con tilde
      body.append("categoria", documentoSeleccionado.categoria);
      body.append("estado", documentoSeleccionado.estado);
      body.append("id_empleado", documentoSeleccionado.idEmpleado);
      body.append("updated_by", idUsuario);

      // Archivo
      body.append("archivo_pdf", {
        uri: documentoSeleccionado.archivo.uri,
        type: "application/pdf",
        name: documentoSeleccionado.archivo.name,
      });

    } else {
      // --- Si no cambió el archivo, usamos JSON ---
      const data = {
        indentificador_unico: documentoSeleccionado.indentificadorUnico,
        descripción: documentoSeleccionado.descripcion, // Clave con tilde
        categoria: documentoSeleccionado.categoria,
        estado: documentoSeleccionado.estado,
        id_empleado: documentoSeleccionado.idEmpleado,
        archivo: documentoSeleccionado.archivo, // Enviamos la URL (string) original
        updated_by: idUsuario,
      };

      body = JSON.stringify(data);
      headers["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(url, {
        method: "PUT",
        body,
        headers,
      });

      const data = await response.json();

      if (!data.success) return Alert.alert("Error", data.message);
      Alert.alert("Éxito", "Documento actualizado."); // Mensaje
      navigation.goBack();

    } catch (error) {
      Alert.alert("Error", "No se pudo guardar.");
    }
  };

  // ======================================================
  //         GUARDAR CAMBIOS CON DETECTOR
  // ======================================================
  const guardarCambios = async () => {
    if (!documentoSeleccionado)
      return Alert.alert("Error", "Seleccione un documento"); // Mensaje

    if (!hasChanges(originalDocumento, documentoSeleccionado)) // Adaptado
      return Alert.alert("Sin cambios", "No modificaste nada.");

    _proceedToSave();
  };

  // ======================================================
  //        CARGA INICIAL
  // ======================================================
  useEffect(() => {
    const init = async () => {
      setLoading(true);

      try {
        // Cargar empleados (sigue igual)
        const r = await fetch(`${API_URL}/empleados/todos`);
        const d = await r.json();
        if (d.success) setEmpleadosList(d.empleados);

        if (documentoDesdeRuta) { // Adaptado
          const f = documentoDesdeRuta.idEmpleado ? documentoDesdeRuta : formatearDocumento(documentoDesdeRuta); // Check adaptado
          setDocumentoSeleccionado(f);
          setOriginalDocumento(f);
        } else {
          cargarDocumentosAleatorios(); // Adaptado
        }

      } catch (e) {
        console.log("Error init", e);
      }

      setLoading(false);
    };

    init();
  }, [documentoDesdeRuta, cargarDocumentosAleatorios]); // Dependencias adaptadas

  // =Vuel
  return {
    terminoBusqueda,
    setTerminoBusqueda,
    documentos, // Adaptado
    documentoSeleccionado, // Adaptado

    empleadosList,
    loading,

    buscarDocumento, // Adaptado
    seleccionarDocumento, // Adaptado
    setDocumentoDesdeNavegacion, // Adaptado

    guardarCambios,
    deseleccionarDocumento, // Adaptado

    onChange: handleDocumentoChange, // Adaptado
    onFileSelect: handleFileSelect,
    onViewFile: handleViewFile,
  };
}
