import { useState, useEffect, useCallback } from "react";
import { Linking } from "react-native"; // Eliminamos Alert
import { API_URL } from "../../config/apiConfig";

// =============================================
// FORMATEADOR COMPLETO (INCLUYE RUTA RELATIVA)
// =============================================
function formatearServicio(s) {
  if (!s) return null;

  const archivoRuta = s.archivo ? s.archivo.trim() : "";

  return {
    id_servicio: s.id_servicio || s.idServicio,
    nombreServicio: (s.nombre_servicio || s.nombreServicio || "").trim(),
    descripcion: (s.descripcion || "").trim(),
    categoria: (s.categoria || "").trim(),
    precio: s.precio ? String(s.precio) : "",
    moneda: (s.moneda || "").trim(),
    duracionEstimada: (s.duracion_estimada || s.duracionEstimada || "").trim(),
    estado: (s.estado || "").trim(),
    id_responsable: s.id_responsable || s.idResponsable || "",
    responsableNombre: (s.responsable_nombre || s.responsableNombre || "").trim(),
    notasInternas: (s.notas_internas || s.notasInternas || "").trim(),
    archivo: archivoRuta, // Ruta relativa tal cual viene de BD
  };
}

// ======================================================
// HOOK PRINCIPAL DE CONSULTA DE SERVICIOS
// ======================================================
export function useConsultarServicioLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [servicios, setServicios] = useState([]);
  const [servicio, setServicio] = useState(null);
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

  // ======================================================
  // CARGA INICIAL (empleados + servicios aleatorios)
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

  const cargarServiciosAleatorios = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/servicios/aleatorios`);
      const data = await res.json();

      if (data.success && data.servicios) {
        setServicios(data.servicios);
      } else {
        setServicios([]);
      }
    } catch (error) {
      console.error("Error al cargar aleatorios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarEmpleados();
    cargarServiciosAleatorios();
  }, []);

  // ======================================================
  // BUSCAR POR TEXTO
  // ======================================================
  const buscarServicio = async () => {
    if (!terminoBusqueda.trim()) {
      cargarServiciosAleatorios();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/servicios/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );

      const data = await response.json();

      if (response.ok && data.success && data.servicios.length > 0) {
        setServicios(data.servicios);
      } else {
        setServicios([]);
        showModal("Sin resultados", data.message || "No se encontró ningún servicio.", "warning");
      }
    } catch (error) {
      console.error("Error al buscar:", error);
      showModal("Error", "No se pudo realizar la búsqueda.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // SELECCIONAR DE LA LISTA (Obtiene datos completos)
  // ======================================================
  const seleccionarServicio = async (s) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/servicios/${s.id_servicio || s.idServicio}`
      );

      const data = await response.json();

      if (data.success && data.servicio) {
        setServicio(formatearServicio(data.servicio));
      } else {
        showModal("Error", "No se pudieron obtener los datos completos del servicio.", "error");
      }
    } catch (error) {
      console.error("Error seleccionar:", error);
      showModal("Error", "Fallo al conectar con el servidor.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DESELECCIONAR
  // ======================================================
  const deseleccionarServicio = () => {
    setServicio(null);
    setTerminoBusqueda("");
    cargarServiciosAleatorios();
  };

  // ======================================================
  // VISUALIZAR ARCHIVO (Con Confirmación)
  // ======================================================
  const handleViewFile = useCallback(async (fileUrl) => {
    if (!fileUrl) return showModal("Aviso", "No hay archivo adjunto en este servicio.", "info");
    
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
    servicios,
    servicio,
    empleadosList,
    loading,
    buscarServicio,
    seleccionarServicio,
    deseleccionarServicio,
    handleViewFile,
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal
  };
}
