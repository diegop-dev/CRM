import { useState, useEffect, useCallback } from "react";
// Eliminamos Alert
import { API_URL } from "../../../../config/apiConfig"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

// Estructura inicial del documento
function crearDocumentoVacio() {
  return {
    id_documento: "",
    nombreDocumento: "", 
    tipoDocumento: "",   
    descripcion: "",     
    idResponsable: "",   
    responsableNombre: "", 
    estado: "VIGENTE",   
    archivo: null,       
  };
}

export function useAgregarDocumentoLogic() {
  const [documento, setDocumento] = useState(crearDocumentoVacio());
  const [empleadosList, setEmpleadosList] = useState([]);

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

  // 1. Cargar lista de empleados
  useEffect(() => {
    async function fetchEmpleados() {
      try {
        const response = await fetch(`${API_URL}/empleados/todos`);
        const data = await response.json();
        if (data.success) {
          setEmpleadosList(data.empleados);
        } else {
          console.error("Error cargando empleados:", data.message);
        }
      } catch (error) {
        console.error("Error de conexión al cargar empleados:", error);
      }
    }
    fetchEmpleados();
  }, []);

  // 2. Handler inputs
  const handleDocumentoChange = (key, value) => {
    setDocumento(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 3. SELECCIONAR ARCHIVO
  const handleFileSelect = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', 
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        handleDocumentoChange('archivo', asset);
        showModal("Archivo Seleccionado", `Listo para subir: ${asset.name}`, "success");
      }
    } catch (error) {
      console.error("Error seleccionando archivo:", error);
      showModal("Error", "No se pudo seleccionar el documento.", "error");
    }
  }, []);

  // --- LÓGICA DE GUARDADO (API) ---
  const executeSave = async () => {
    closeFeedbackModal(); // Cerramos la pregunta

    const idUsuario = await AsyncStorage.getItem('id_usuario');
    if (!idUsuario) {
      showModal("Error", "Sesión no válida. Vuelva a iniciar sesión.", "error");
      return;
    }

    // Construcción del FormData
    const formData = new FormData();
    formData.append('nombre_documento', documento.nombreDocumento.trim());
    formData.append('tipo_documento', documento.tipoDocumento);
    formData.append('descripcion', documento.descripcion.trim());
    formData.append('id_responsable', documento.idResponsable);
    formData.append('estado', documento.estado);
    formData.append('created_by', idUsuario);

    if (documento.archivo && documento.archivo.uri) {
      formData.append('archivo_doc', { 
        uri: documento.archivo.uri,
        name: documento.archivo.name,
        type: documento.archivo.mimeType || 'application/pdf', 
      });
    }

    try {
      const response = await fetch(`${API_URL}/documentos/guardar-con-archivo`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        showModal("Éxito", "Documento guardado correctamente.", "success");
        setDocumento(crearDocumentoVacio()); 
      } else {
        showModal("Error", data.message || "No se pudo guardar el documento.", "error");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      showModal("Error", "Fallo de conexión con el servidor.", "error");
    }
  };

  // 4. FUNCIÓN PRINCIPAL GUARDAR (Validación + Pregunta)
  const guardarNuevoDocumento = async () => {
    if (!documento.nombreDocumento || !documento.tipoDocumento || !documento.idResponsable) {
      showModal("Campos incompletos", "Por favor llene: Nombre, Tipo y Responsable.", "warning");
      return;
    }

    showModal(
        "Confirmar Guardado",
        "¿Está seguro de que desea guardar este nuevo documento?",
        "question",
        executeSave
    );
  };

  return {
    documento,
    empleadosList,
    onChange: handleDocumentoChange,
    onGuardar: guardarNuevoDocumento,
    onFileSelect: handleFileSelect,
    onViewFile: () => showModal("Info", "El archivo es local y está pendiente de subir.", "info"),
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal
  };
}
