import { useState, useEffect, useCallback } from "react";
// Eliminamos Alert
import { API_URL } from "../../config/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

// Función para crear un objeto de servicio vacío
function crearServicioVacio() {
  return {
    id_servicio: "",
    nombreServicio: "",
    descripcion: "",
    categoria: "",
    precio: "",
    moneda: "",
    duracionEstimada: "",
    estado: "Activo",
    idResponsable: "",
    responsableNombre: "",
    notasInternas: "",
    archivo: null,
  };
}

export function useAgregarServicioLogic() {
  const [servicio, setServicio] = useState(crearServicioVacio());
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

  // --- EFECTO PARA CARGAR EMPLEADOS ---
  useEffect(() => {
    async function fetchEmpleados() {
      try {
        const response = await fetch(`${API_URL}/empleados/todos`);
        if (!response.ok) throw new Error("No se pudo cargar la lista de empleados");
        const data = await response.json();
        if (data.success) {
          setEmpleadosList(data.empleados);
        } else {
          showModal("Error", data.message || "Error al cargar empleados.", "error");
        }
      } catch (error) {
        console.error("Error al cargar empleados:", error);
        showModal("Error de Conexión", error.message, "error");
      }
    }
    fetchEmpleados();
  }, []);

  const handleServicioChange = (key, value) => {
    setServicio(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  // ===========================================
  // SELECCIONAR ARCHIVO PDF
  // ===========================================
  const handleFileSelect = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        handleServicioChange('archivo', asset);
        showModal("Archivo Seleccionado", `PDF listo para subir: ${asset.name}`, "success");
      }
    } catch (error) {
      console.error("Error seleccionando archivo:", error);
      showModal("Error", "No se pudo acceder al selector de documentos.", "error");
    }
  }, []);

  // ===========================================
  // LÓGICA DE GUARDADO (API)
  // ===========================================
  const executeSave = async () => {
    closeFeedbackModal(); // Cerramos pregunta

    const idUsuarioString = await AsyncStorage.getItem('id_usuario');
    const idUsuario = idUsuarioString ? parseInt(idUsuarioString, 10) : null;
    
    if (!idUsuario) {
      showModal("Error de autenticación", "No se ha encontrado ID de usuario.", "error");
      return;
    }

    const formData = new FormData();

    // Campos de texto
    formData.append('nombre_servicio', servicio.nombreServicio.trim());
    formData.append('descripcion', servicio.descripcion.trim());
    formData.append('categoria', servicio.categoria);
    formData.append('precio', parseFloat(servicio.precio) || 0);
    formData.append('moneda', servicio.moneda);
    formData.append('duracion_estimada', servicio.duracionEstimada.trim());
    formData.append('estado', servicio.estado || 'Activo');
    formData.append('id_responsable', servicio.idResponsable || null);
    formData.append('notas_internas', servicio.notasInternas.trim());
    formData.append('created_by', idUsuario);

    // Archivo
    if (servicio.archivo && servicio.archivo.uri) {
      formData.append('archivo_pdf', {
        uri: servicio.archivo.uri,
        name: servicio.archivo.name,
        type: 'application/pdf',
      });
    }

    try {
      const response = await fetch(`${API_URL}/servicios/guardar-con-archivo`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        showModal("Error al guardar", data.message || "No se pudo crear el servicio.", "error");
      } else {
        showModal("Éxito", "Servicio y archivo guardados correctamente.", "success");
        setServicio(crearServicioVacio());
      }
    } catch (error) {
      console.error("Error al guardar servicio:", error);
      showModal("Error de Conexión", "No se pudo conectar con el servidor.", "error");
    }
  };

  // --- FUNCIÓN PRINCIPAL GUARDAR (Validación + Pregunta) ---
  const guardarNuevoServicio = async () => {
    if (!servicio.nombreServicio || !servicio.categoria || !servicio.precio) {
      showModal("Campos incompletos", "Por favor, llene al menos Nombre, Categoría y Precio.", "warning");
      return;
    }

    showModal(
        "Confirmar Guardado",
        "¿Está seguro de que desea guardar este nuevo servicio?",
        "question",
        executeSave
    );
  };

  return {
    servicio,
    setServicio,
    empleadosList,
    onChange: handleServicioChange,
    onGuardar: guardarNuevoServicio,
    onFileSelect: handleFileSelect,
    // Placeholder para visualizar archivo local (Opcional)
    onViewFile: () => showModal("Info", "El archivo es local y está pendiente de subir.", "info"),
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal,
  };
}
