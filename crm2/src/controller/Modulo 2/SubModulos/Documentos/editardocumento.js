import { useState, useEffect, useCallback } from "react";
import { Linking } from "react-native"; // Eliminamos Alert
import { API_URL } from "../../../../config/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from "expo-document-picker";
import { useNavigation, useRoute } from "@react-navigation/native";

// ==========================================
// 1. ESTRUCTURA INICIAL Y UTILIDADES
// ==========================================

const DOCUMENTO_VACIO = {
  id_documento: null,
  nombreDocumento: "",
  tipoDocumento: "",
  descripcion: "",
  idResponsable: "",
  responsableNombre: "",
  estado: "VIGENTE",
  archivo: null,
};

// Mapeo de la Base de Datos (snake_case) a React (camelCase)
function formatearDocumento(d) {
  if (!d) return DOCUMENTO_VACIO;
  return {
    id_documento: d.id_documento || d.idDocumento,
    nombreDocumento: (d.nombre_documento || d.nombreDocumento || d.indentificador_unico || "").trim(),
    tipoDocumento: (d.tipo_documento || d.tipoDocumento || d.categoria || "").trim(),
    descripcion: (d.descripcion || "").trim(),
    idResponsable: (d.idResponsable || d.id_responsable || "").toString(),
    responsableNombre: (d.responsableNombre || d.responsable_nombre || d.empleado_nombre || d.empleadoNombre || "").trim(),
    estado: (d.estado || "").trim(),
    archivo: (d.archivo || "").trim(),
  };
}

// Función para detectar si el usuario hizo algún cambio
function hasChanges(original, current) {
  if (!original || !current) return false;
  
  const keys = Object.keys(original);
  for (const key of keys) {
    if (key === "id_documento") continue;
    
    if (key === "archivo") {
      // Si es un objeto (nuevo archivo seleccionado) -> Hay cambio
      if (typeof current[key] === "object" && current[key] !== null) return true;
      // Si es string (URL) y es diferente al original -> Hay cambio
      if (String(original[key]).trim() !== String(current[key]).trim()) return true;
      continue;
    }

    // Comparación estándar de texto
    if (String(original[key]).trim() !== String(current[key]).trim()) return true;
  }
  return false;
}

// ======================================================
//               HOOK PRINCIPAL
// ======================================================

export function useEditarDocumentoLogic() {
  const navigation = useNavigation();
  const route = useRoute();
  const documentoDesdeRuta = route.params?.documentoSeleccionado;

  // --- Estados ---
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [documentos, setDocumentos] = useState([]);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
  const [originalDocumento, setOriginalDocumento] = useState(null);
  const [empleadosList, setEmpleadosList] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- NUEVO ESTADO PARA EL MODAL DE FEEDBACK ---
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info", // 'success', 'error', 'warning', 'question'
    onConfirm: null,
  });

  // Función auxiliar para mostrar el modal
  const showModal = (title, message, type = "info", onConfirmAction = null) => {
    setFeedbackModal({
      visible: true,
      title,
      message,
      type,
      onConfirm: onConfirmAction,
    });
  };

  // Función auxiliar para cerrar el modal
  const closeFeedbackModal = () => {
    setFeedbackModal((prev) => ({ ...prev, visible: false, onConfirm: null }));
  };

  // ==========================================
  // 2. CARGA INICIAL DE DATOS
  // ==========================================
  
  const cargarDocumentosAleatorios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/documentos/aleatorios`);
      const data = await response.json();
      if (data.success && data.documentos) {
        setDocumentos(data.documentos);
      } else {
        setDocumentos([]);
      }
    } catch (error) {
      console.error("Error carga inicial:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // 1. Cargar lista de empleados
        const r = await fetch(`${API_URL}/empleados/todos`);
        const d = await r.json();
        if (d.success) setEmpleadosList(d.empleados);

        // 2. Si venimos de la pantalla de consulta
        if (documentoDesdeRuta) {
          const f = formatearDocumento(documentoDesdeRuta);
          setDocumentoSeleccionado(f);
          setOriginalDocumento(f);
        } else {
          // 3. Si no, cargar aleatorios
          await cargarDocumentosAleatorios();
        }
      } catch (e) {
        console.error("Error init:", e);
        showModal("Error", "Fallo al cargar datos iniciales.", "error");
      }
      setLoading(false);
    };
    init();
  }, [documentoDesdeRuta, cargarDocumentosAleatorios]);

  // ==========================================
  // 3. FUNCIONES DE BÚSQUEDA Y SELECCIÓN
  // ==========================================

  const buscarDocumento = useCallback(async () => {
    if (!terminoBusqueda.trim()) {
        cargarDocumentosAleatorios();
        return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/documentos/buscar?termino=${encodeURIComponent(terminoBusqueda)}`);
      const data = await response.json();
      if (data.success && data.documentos.length > 0) {
        setDocumentos(data.documentos);
      } else {
        setDocumentos([]);
        showModal("Sin resultados", "No se encontró el documento.", "warning");
      }
    } catch (error) {
      showModal("Error", "Fallo en la búsqueda.", "error");
    } finally {
      setLoading(false);
    }
  }, [terminoBusqueda, cargarDocumentosAleatorios]);

  const seleccionarDocumento = useCallback(async (item) => {
    setLoading(true);
    try {
        const id = item.id_documento;
        const response = await fetch(`${API_URL}/documentos/${id}`);
        const data = await response.json();

        if (data.success && data.documento) {
            const f = formatearDocumento(data.documento);
            setDocumentoSeleccionado(f);
            setOriginalDocumento(f);
            setDocumentos([]); 
        } else {
            showModal("Error", "No se pudieron cargar los detalles.", "error");
        }
    } catch (error) {
        showModal("Error", "Fallo de conexión.", "error");
    } finally {
        setLoading(false);
    }
  }, []);

  const deseleccionarDocumento = useCallback(() => {
    setDocumentoSeleccionado(null);
    setOriginalDocumento(null);
    setTerminoBusqueda("");
    cargarDocumentosAleatorios();
  }, [cargarDocumentosAleatorios]);

  const setDocumentoDesdeNavegacion = useCallback((docCrudo) => {
    const f = formatearDocumento(docCrudo);
    setDocumentoSeleccionado(f);
    setOriginalDocumento(f);
  }, []);

  // ==========================================
  // 4. MANEJO DE ARCHIVOS Y FORMULARIO
  // ==========================================

  const handleDocumentoChange = useCallback((key, value) => {
    setDocumentoSeleccionado(prev => ({ ...prev, [key]: value }));
  }, []);

  // VISUALIZAR ARCHIVO (Con confirmación)
  const handleViewFile = useCallback(async (fileUrl) => {
    if (!fileUrl) return showModal("Aviso", "No hay archivo adjunto en este documento.", "info");
    
    const fullUrl = `${API_URL}${fileUrl}`;
    
    const openFileAction = async () => {
        closeFeedbackModal();
        try {
            const supported = await Linking.canOpenURL(fullUrl);
            if (supported) {
                await Linking.openURL(fullUrl);
            } else {
                showModal("Error", "No se puede abrir el archivo. Verifique la URL.", "error");
            }
        } catch (e) {
            showModal("Error", "Ocurrió un error al intentar abrir el enlace.", "error");
        }
    };

    showModal(
        "Visualizar Documento",
        "Se intentará abrir el archivo externamente. ¿Desea continuar?",
        "question",
        openFileAction
    );
  }, []);

  // SELECCIONAR ARCHIVO
  const handleFileSelect = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*", copyToCacheDirectory: true });
      if (!result.canceled && result.assets) {
        handleDocumentoChange("archivo", result.assets[0]);
        showModal("Archivo seleccionado", `Listo para reemplazar: ${result.assets[0].name}`, "success");
      }
    } catch {
      showModal("Error", "No se pudo abrir el selector.", "error");
    }
  }, [handleDocumentoChange]);

  // ==========================================
  // 5. GUARDADO (PUT)
  // ==========================================

  const executeSave = async () => {
      closeFeedbackModal(); // Cerramos pregunta

      const isFileChanged = typeof documentoSeleccionado.archivo === "object";
      const idUsuario = await AsyncStorage.getItem("id_usuario");
      const url = `${API_URL}/documentos/${documentoSeleccionado.id_documento}`;
      
      let body;
      let headers = {};

      if (isFileChanged) {
        // FORM DATA
        body = new FormData();
        body.append("nombre_documento", documentoSeleccionado.nombreDocumento);
        body.append("tipo_documento", documentoSeleccionado.tipoDocumento);
        body.append("descripcion", documentoSeleccionado.descripcion);
        body.append("id_responsable", documentoSeleccionado.idResponsable);
        body.append("estado", documentoSeleccionado.estado);
        body.append("updated_by", idUsuario); 
        
        body.append("archivo_doc", { 
            uri: documentoSeleccionado.archivo.uri,
            name: documentoSeleccionado.archivo.name,
            type: documentoSeleccionado.archivo.mimeType || "application/pdf",
        });
        
        body.append("archivo", originalDocumento.archivo || ""); 

      } else {
        // JSON
        body = JSON.stringify({
            nombre_documento: documentoSeleccionado.nombreDocumento,
            tipo_documento: documentoSeleccionado.tipoDocumento,
            descripcion: documentoSeleccionado.descripcion,
            id_responsable: documentoSeleccionado.idResponsable,
            estado: documentoSeleccionado.estado,
            archivo: documentoSeleccionado.archivo, // URL string original
            updated_by: idUsuario
        });
        headers["Content-Type"] = "application/json";
      }

      try {
          const response = await fetch(url, { method: "PUT", body, headers });
          const data = await response.json();
          if (data.success) {
            showModal("Éxito", "Documento actualizado correctamente.", "success");
            navigation.goBack();
          } else {
            showModal("Error", data.message || "No se pudo actualizar.", "error");
          }
      } catch (e) {
          showModal("Error", "Fallo de conexión al guardar.", "error");
      }
  };

  const guardarCambios = async () => {
      if (!hasChanges(originalDocumento, documentoSeleccionado)) {
          return showModal("Sin cambios", "No hay nada que guardar.", "info");
      }
      
      showModal(
          "Confirmar Cambios",
          "¿Está seguro de que desea guardar los cambios realizados?",
          "question",
          executeSave
      );
  };

  return {
    terminoBusqueda, setTerminoBusqueda,
    documentos, documentoSeleccionado, setDocumentoDesdeNavegacion,
    empleadosList, loading,
    buscarDocumento, seleccionarDocumento, deseleccionarDocumento,
    guardarCambios, onChange: handleDocumentoChange,
    onFileSelect: handleFileSelect, 
    onViewFile: handleViewFile,
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal
  };
}
