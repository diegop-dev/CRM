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

export function useEditarServicioLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [servicios, setServicios] = useState([]);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [empleadosList, setEmpleadosList] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- NUEVO: Estado para el modal de alerta ---
  const [modalInfo, setModalInfo] = useState({ visible: false, title: "", message: "" });

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setLoading(true);
      try {
        const [servResponse, empResponse] = await Promise.all([
          fetch(`${API_URL}/servicios/aleatorios`), 
          fetch(`${API_URL}/empleados/todos`) 
        ]);

        const servData = await servResponse.json();
        const empData = await empResponse.json();

        if (servData.success && servData.servicios) {
          setServicios(servData.servicios);
        } else {
          setServicios([]);
        }

        if (empData.success && empData.empleados) {
          setEmpleadosList(empData.empleados);
        } else {
          setEmpleadosList([]);
          // --- CAMBIO: Usamos el modal ---
          setModalInfo({ visible: true, title: "Error", message: "No se pudo cargar la lista de empleados." });
        }

      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ visible: true, title: "Error de Conexión", message: "No se pudieron cargar los datos iniciales." });
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatosIniciales();
  }, []);

  const setServicioDesdeNavegacion = (servicioCrudo) => {
    setServicioSeleccionado(formatearServicio(servicioCrudo));
  };

  const cargarServiciosAleatorios = async () => {
     setLoading(true);
     try {
       const response = await fetch(`${API_URL}/servicios/aleatorios`);
       const data = await response.json();
       if (data.success && data.servicios) {
         setServicios(data.servicios);
       } else {
         setServicios([]);
       }
     } catch (error) {
       console.error("Error al cargar servicios:", error);
     } finally {
       setLoading(false);
     }
   };

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
      if (!data.success || !data.servicios?.length) {
        setServicios([]);
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ visible: true, title: "Sin resultados", message: "No se encontró ningún servicio." });
        return;
      }
      setServicios(data.servicios);
    } catch (error) {
      console.error("Error al buscar servicio:", error);
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ visible: true, title: "Error", message: "No se pudo realizar la búsqueda." });
    } finally {
      setLoading(false);
    }
  };

  const seleccionarServicio = async (s) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/servicios/consultar/${s.id_servicio || s.idServicio}`
      );
      const rawResponse = await response.text();
      const data = JSON.parse(rawResponse);

      if (data.success && data.servicio) {
        setServicioSeleccionado(formatearServicio(data.servicio));
      } else {
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ visible: true, title: "Error", message: "No se pudieron obtener los datos del servicio." });
      }
    } catch (error) {
      console.error("Error al obtener datos del servicio:", error);
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ visible: true, title: "Error", message: "No se pudo conectar con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  const guardarCambios = async () => {
    if (!servicioSeleccionado) {
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ visible: true, title: "Error", message: "Debe seleccionar un servicio primero." });
      return;
    }

    const fechaIngreso =
      servicioSeleccionado.diaIngreso && servicioSeleccionado.mesIngreso && servicioSeleccionado.añoIngreso
        ? `${servicioSeleccionado.añoIngreso}-${servicioSeleccionado.mesIngreso.padStart(2, "0")}-${servicioSeleccionado.diaIngreso.padStart(2, "0")}`
        : null;

    const dataParaEnviar = {
      ...servicioSeleccionado,
      nombreServicio: (servicioSeleccionado.nombreServicio || "").trim(),
      descripcion: (servicioSeleccionado.descripcion || "").trim(),
      precio: parseFloat(servicioSeleccionado.precio) || 0,
      duracionEstimada: (servicioSeleccionado.duracionEstimada || "").trim(),
      notasInternas: (servicioSeleccionado.notasInternas || "").trim(),
      idResponsable: servicioSeleccionado.idResponsable,
      fecha_ingreso: fechaIngreso, // (Asegúrate de que el API espere 'fecha_ingreso')
    };

    const id = dataParaEnviar.id_servicio;

    try {
      const response = await fetch(`${API_URL}/servicios/editar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar), 
      });
      const rawResponse = await response.text();
      const data = JSON.parse(rawResponse);

      if (data.success) {
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ visible: true, title: "Éxito", message: "Servicio actualizado correctamente." });
        setServicioSeleccionado(null);
        cargarServiciosAleatorios(); 
      } else {
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ visible: true, title: "Error", message: data.message || "No se pudieron guardar los cambios." });
      }
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ visible: true, title: "Error de Servidor", message: "Error al guardar. Revisa la consola." });
    }
  };

  const deseleccionarServicio = () => {
    setServicioSeleccionado(null);
  };

  // --- NUEVO: Función para cerrar el modal ---
  const closeModal = () => {
    setModalInfo({ visible: false, title: "", message: "" });
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    servicios,
    servicioSeleccionado,
    setServicioSeleccionado,
    setServicioDesdeNavegacion,
    empleadosList, 
    loading,
    buscarServicio,
    seleccionarServicio,
    guardarCambios,
    deseleccionarServicio,
    modalInfo, // <-- Exportamos el estado del modal
    closeModal, // <-- Exportamos la función de cierre
  };
}