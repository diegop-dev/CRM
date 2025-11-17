import { useState, useEffect } from "react";
// import { Alert } from "react-native"; // <-- Eliminamos Alert
import { API_URL } from "../../config/apiConfig";

// (Tu función 'formatearServicio' no cambia)
function formatearServicio(s) {
  if (!s) return null;
  return {
    id_servicio: s.id_servicio || s.idServicio,
    nombreServicio: (s.nombre_servicio || "").trim(),
    descripcion: (s.descripcion || "").trim(),
    categoria: (s.categoria || "").trim(),
    precio: s.precio ? s.precio.toString() : "", 
    moneda: (s.moneda || "").trim(),
    duracionEstimada: (s.duracion_estimada || "").trim(),
    estado: (s.estado || "").trim(),
    idResponsable: s.id_responsable || s.idResponsable || "", 
    responsableNombre: (s.responsable_nombre || "").trim(), 
    notasInternas: (s.notas_internas || "").trim(),
  };
}

export function useConsultarServicioLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [empleadosList, setEmpleadosList] = useState([]);

  // --- NUEVO: Estado para el modal de alerta ---
  const [modalInfo, setModalInfo] = useState({ visible: false, title: "", message: "" });

  useEffect(() => {
    async function fetchEmpleados() {
      try {
        const response = await fetch(`${API_URL}/empleados/todos`);
        if (!response.ok) {
          throw new Error("No se pudo cargar la lista de empleados");
        }
        const data = await response.json();
        if (data.success) {
          setEmpleadosList(data.empleados);
        } else {
          console.warn("Advertencia", data.message || "Error al cargar empleados.");
        }
      } catch (error) {
        console.error("Error al cargar empleados:", error);
      }
    }
    fetchEmpleados();
  }, []); 

  const buscarServicio = async () => {
    if (!terminoBusqueda.trim()) {
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ visible: true, title: "Atención", message: "Ingrese un nombre de servicio para buscar." });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/servicios/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );

      const data = await response.json();
      const servicioEncontrado = data.servicio || (data.servicios && data.servicios[0]);

      if (response.ok && data.success && servicioEncontrado) {
        setServicio(formatearServicio(servicioEncontrado)); 
      } else {
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ visible: true, title: "Sin resultados", message: data.message || "No se encontró ningún servicio con ese nombre." });
      }
    } catch (error) {
      console.error("Error:", error);
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ visible: true, title: "Error", message: "No se pudo obtener el servicio." });
    } finally {
      setLoading(false);
    }
  };

  const deseleccionarServicio = () => {
    setServicio(null);
    setTerminoBusqueda("");
  };

  // --- NUEVO: Función para cerrar el modal ---
  const closeModal = () => {
    setModalInfo({ visible: false, title: "", message: "" });
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    servicio,
    empleadosList, 
    loading,
    editable: false, 
    buscarServicio,
    deseleccionarServicio,
    modalInfo, // <-- Exportamos el estado del modal
    closeModal, // <-- Exportamos la función de cierre
  };
}