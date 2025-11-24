import { useState, useEffect, useCallback } from "react";
import { Linking } from "react-native"; // Eliminamos Alert
import { API_URL } from "../../config/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from "expo-document-picker";
import { useNavigation, useRoute } from "@react-navigation/native";

// =========================
//     SERVICIO VACÍO
// =========================
const SERVICIO_VACIO = {
  id_servicio: null,
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

// =========================
//  FORMATEAR SERVICIO
// =========================
function formatearServicio(s) {
  if (!s) return SERVICIO_VACIO;

  return {
    id_servicio: s.id_servicio || s.idServicio,
    nombreServicio: (s.nombre_servicio || s.nombreServicio || "").trim(),
    descripcion: (s.descripcion || "").trim(),
    categoria: (s.categoria || "").trim(),
    precio: s.precio ? String(s.precio) : "",
    moneda: (s.moneda || "").trim(),
    duracionEstimada: (s.duracion_estimada || s.duracionEstimada || "").trim(),
    estado: (s.estado || "").trim(),
    idResponsable: s.id_responsable ? s.id_responsable.toString() : (s.idResponsable || ""),
    responsableNombre: s.responsableNombre || s.responsable_nombre || "",
    notasInternas: (s.notas_internas || s.notasInternas || "").trim(),
    archivo: (s.archivo || "").trim(),
  };
}

// =========================
//  DETECTAR CAMBIOS
// =========================
function hasChanges(original, current) {
  if (!original || !current) return false;

  for (const key of Object.keys(original)) {
    if (key === "id_servicio") continue;

    if (key === "archivo") {
      if (typeof current[key] === "object" && current[key] !== null) return true;
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
//           HOOK PRINCIPAL: useEditarServicioLogic
// ======================================================
export function useEditarServicioLogic() {
  const navigation = useNavigation();
  const route = useRoute();
  const servicioDesdeRuta = route.params?.servicio;

  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [servicios, setServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [originalServicio, setOriginalServicio] = useState(null);

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

  // =========================
  //  CAMBIAR VALOR DEL FORM
  // =========================
  const handleServicioChange = useCallback((key, value) => {
    setServicioSeleccionado(prev => ({ ...prev, [key]: value }));
  }, []);

  // =========================
  //  CARGAR ALEATORIOS
  // =========================
  const cargarServiciosAleatorios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/servicios/aleatorios`);
      const data = await response.json();
      setServicios(data.success ? data.servicios : []);
    } catch {
      console.error("Error aleatorios");
    }
    setLoading(false);
  }, []);

  // =========================
  //  BUSCAR SERVICIO
  // =========================
  const buscarServicio = useCallback(async () => {
    if (!terminoBusqueda.trim()) return cargarServiciosAleatorios();

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/servicios/buscar?termino=${encodeURIComponent(terminoBusqueda)}`);
      const data = await response.json();

      if (data.success && data.servicios.length) {
        setServicios(data.servicios);
      } else {
        setServicios([]);
        showModal("Sin resultados", "No se encontró ningún servicio.", "warning");
      }

    } catch {
      showModal("Error", "No se pudo realizar la búsqueda.", "error");
    }
    setLoading(false);
  }, [terminoBusqueda, cargarServiciosAleatorios]);

  // ======================================================
  //       SELECCIONAR SERVICIO DESDE LA LISTA
  // ======================================================
  const seleccionarServicio = useCallback(async (s) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/servicios/${s.id_servicio || s.idServicio}`);
      const data = await response.json();

      if (data.success) {
        const formateado = formatearServicio(data.servicio);
        setServicioSeleccionado(formateado);
        setOriginalServicio(formateado);
        setServicios([]);
      } else {
        showModal("Error", "No se pudo obtener el servicio.", "error");
      }

    } catch {
      showModal("Error", "Fallo de conexión.", "error");
    }
    setLoading(false);
  }, []);

  const setServicioDesdeNavegacion = useCallback((raw) => {
    const formateado = raw.idResponsable ? raw : formatearServicio(raw);
    setServicioSeleccionado(formateado);
    setOriginalServicio(formateado);
  }, []);

  const deseleccionarServicio = useCallback(() => {
    setServicioSeleccionado(null);
    setOriginalServicio(null);
    setTerminoBusqueda("");
    cargarServiciosAleatorios();
  }, [cargarServiciosAleatorios]);

  // ======================================================
  //             ABRIR ARCHIVO PDF (Con Confirmación)
  // ======================================================
  const handleViewFile = useCallback(async (fileUrl) => {
    if (!fileUrl) return showModal("Aviso", "No hay archivo adjunto.", "info");

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
        } catch {
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

  // ======================================================
  //     SELECCIONAR PDF DEL DISPOSITIVO
  // ======================================================
  const handleFileSelect = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const asset = result.assets[0];
        handleServicioChange("archivo", asset);
        showModal("Archivo seleccionado", asset.name, "success");
      }

    } catch {
      showModal("Error", "No se pudo abrir el selector de documentos.", "error");
    }
  }, [handleServicioChange]);

  // ======================================================
  //           GUARDAR SERVICIO (PUT)
  // ======================================================
  const executeSave = async () => {
    closeFeedbackModal(); // Cerramos confirmación

    const isFileChanged = typeof servicioSeleccionado.archivo === "object";
    const idUsuario = await AsyncStorage.getItem("id_usuario");
    
    if (!idUsuario) {
        showModal("Error", "Sesión expirada.", "error");
        return;
    }

    const url = `${API_URL}/servicios/${servicioSeleccionado.id_servicio}`;
    let body;
    let headers = {};

    if (isFileChanged) {
      body = new FormData();
      body.append("nombre_servicio", servicioSeleccionado.nombreServicio);
      body.append("descripcion", servicioSeleccionado.descripcion);
      body.append("categoria", servicioSeleccionado.categoria);
      body.append("precio", servicioSeleccionado.precio);
      body.append("moneda", servicioSeleccionado.moneda);
      body.append("duracion_estimada", servicioSeleccionado.duracionEstimada);
      body.append("estado", servicioSeleccionado.estado);
      body.append("id_responsable", servicioSeleccionado.idResponsable);
      body.append("notas_internas", servicioSeleccionado.notasInternas);
      body.append("updated_by", idUsuario);

      body.append("archivo_pdf", {
        uri: servicioSeleccionado.archivo.uri,
        type: "application/pdf",
        name: servicioSeleccionado.archivo.name,
      });

    } else {
      body = JSON.stringify({
        nombre_servicio: servicioSeleccionado.nombreServicio,
        descripcion: servicioSeleccionado.descripcion,
        categoria: servicioSeleccionado.categoria,
        precio: servicioSeleccionado.precio,
        moneda: servicioSeleccionado.moneda,
        duracion_estimada: servicioSeleccionado.duracionEstimada,
        estado: servicioSeleccionado.estado,
        id_responsable: servicioSeleccionado.idResponsable,
        notas_internas: servicioSeleccionado.notasInternas,
        archivo: servicioSeleccionado.archivo,
        updated_by: idUsuario,
      });
      headers["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(url, { method: "PUT", body, headers });
      const data = await response.json();

      if (data.success) {
        showModal("Éxito", "Servicio actualizado correctamente.", "success");
        navigation.goBack();
      } else {
        showModal("Error", data.message || "No se pudo actualizar.", "error");
      }
    } catch (error) {
      showModal("Error", "Fallo de conexión al guardar.", "error");
    }
  };

  // ======================================================
  //         GUARDAR CAMBIOS CON DETECTOR
  // ======================================================
  const guardarCambios = async () => {
    if (!servicioSeleccionado) return showModal("Error", "Seleccione un servicio", "warning");

    if (!hasChanges(originalServicio, servicioSeleccionado)) {
      return showModal("Sin cambios", "No modificaste nada.", "info");
    }

    showModal(
        "Confirmar Cambios",
        "¿Está seguro de que desea guardar los cambios realizados?",
        "question",
        executeSave
    );
  };

  // ======================================================
  //         CARGA INICIAL
  // ======================================================
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const r = await fetch(`${API_URL}/empleados/todos`);
        const d = await r.json();
        if (d.success) setEmpleadosList(d.empleados);

        if (servicioDesdeRuta) {
          const f = servicioDesdeRuta.idResponsable ? servicioDesdeRuta : formatearServicio(servicioDesdeRuta);
          setServicioSeleccionado(f);
          setOriginalServicio(f);
        } else {
          await cargarServiciosAleatorios();
        }
      } catch (e) {
        console.log("Error init", e);
      }
      setLoading(false);
    };
    init();
  }, [servicioDesdeRuta, cargarServiciosAleatorios]);

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    servicios,
    servicioSeleccionado,
    empleadosList,
    loading,
    buscarServicio,
    seleccionarServicio,
    setServicioDesdeNavegacion,
    guardarCambios,
    deseleccionarServicio,
    onChange: handleServicioChange,
    onFileSelect: handleFileSelect,
    onViewFile: handleViewFile,
    // Exportamos modal
    feedbackModal,
    closeFeedbackModal
  };
}
