import { useState, useEffect, useCallback } from "react";
import { Linking } from "react-native"; // Eliminamos Alert
import { API_URL } from "../../../../config/apiConfig";

// =============================================
// FORMATEADOR COMPLETO
// =============================================
function formatearDocumento(d) {
  if (!d) return null;

  return {
    id_documento: d.id_documento || d.idDocumento,
    nombreDocumento: (d.nombre_documento || d.nombreDocumento || d.indentificador_unico || "").trim(),
    tipoDocumento: (d.tipo_documento || d.tipoDocumento || d.categoria || "").trim(),
    descripcion: (d.descripcion || d.descripción || "").trim(),
    idResponsable: d.id_responsable ? d.id_responsable.toString() : "",
    responsableNombre: (d.responsable_nombre || d.empleado_nombre || "").trim(),
    estado: (d.estado || "").trim(),
    archivo: (d.archivo || "").trim(), 
  };
}

// ======================================================
// HOOK PRINCIPAL DE CONSULTA
// ======================================================
export function useConsultarDocumentoLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [documentos, setDocumentos] = useState([]); // Lista de resultados
  const [documento, setDocumento] = useState(null); // Documento seleccionado
  const [loading, setLoading] = useState(false);
  const [empleadosList, setEmpleadosList] = useState([]);

  // --- NUEVO ESTADO PARA EL MODAL DE FEEDBACK ---
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info", // 'success', 'error', 'warning', 'question'
    onConfirm: null,
  });

  // Helper para mostrar modal
  const showModal = (title, message, type = "info", onConfirmAction = null) => {
    setFeedbackModal({
      visible: true,
      title,
      message,
      type,
      onConfirm: onConfirmAction,
    });
  };

  // Helper para cerrar modal
  const closeFeedbackModal = () => {
    setFeedbackModal((prev) => ({ ...prev, visible: false, onConfirm: null }));
  };

  // ======================================================
  // CARGA INICIAL
  // ======================================================
  
  const cargarEmpleados = async () => {
    try {
      const response = await fetch(`${API_URL}/empleados/todos`);
      const data = await response.json();
      if (data.success) {
        setEmpleadosList(data.empleados);
      }
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  const cargarDocumentosAleatorios = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/documentos/aleatorios`);
      const data = await res.json();

      if (data.success && data.documentos) {
        const docsFormateados = data.documentos.map(formatearDocumento);
        setDocumentos(docsFormateados);
      } else {
        setDocumentos([]);
      }
    } catch (error) {
      console.error("Error al cargar aleatorios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
    cargarDocumentosAleatorios();
  }, []);

  // ======================================================
  // BUSCAR POR TEXTO
  // ======================================================
  const buscarDocumento = useCallback(async () => {
    if (!terminoBusqueda.trim()) {
      cargarDocumentosAleatorios();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/documentos/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );

      const data = await response.json();

      if (data.success && data.documentos?.length > 0) {
        const docsFormateados = data.documentos.map(formatearDocumento);
        setDocumentos(docsFormateados);
      } else {
        setDocumentos([]);
        showModal("Sin resultados", "No se encontró ningún documento con ese criterio.", "warning");
      }
    } catch (error) {
      console.error("Error al buscar:", error);
      showModal("Error", "No se pudo realizar la búsqueda.", "error");
    } finally {
      setLoading(false);
    }
  }, [terminoBusqueda]);

  // ======================================================
  // SELECCIONAR DE LA LISTA
  // ======================================================
  const seleccionarDocumento = useCallback(async (d) => {
    setLoading(true);
    try {
      const id = d.id_documento;
      const response = await fetch(`${API_URL}/documentos/${id}`);
      const data = await response.json();

      if (data.success && data.documento) {
        setDocumento(formatearDocumento(data.documento));
      } else {
        showModal("Error", "No se pudieron obtener los datos completos.", "error");
      }
    } catch (error) {
      console.error("Error seleccionar:", error);
      showModal("Error", "Fallo al conectar con el servidor.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================================================
  // DESELECCIONAR
  // ======================================================
  const deseleccionarDocumento = useCallback(() => {
    setDocumento(null);
    setTerminoBusqueda("");
    cargarDocumentosAleatorios();
  }, []);

  // ======================================================
  // VISUALIZAR ARCHIVO (Con Confirmación)
  // ======================================================
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

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    documentos,
    documento,
    empleadosList,
    loading,
    buscarDocumento,
    seleccionarDocumento,
    deseleccionarDocumento,
    handleViewFile,
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal
  };
}
