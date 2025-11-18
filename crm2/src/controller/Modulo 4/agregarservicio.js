import { useState, useEffect } from "react";
// import { Alert } from "react-native"; // <-- Eliminamos Alert
import { API_URL } from "../../config/apiConfig";function crearProductoVacio() {
  return {
    id_producto: "",
    nombre: "",
    codigo_interno: "",
    unidad_medida: "",
    categoria: "",
    idResponsable: "",
    responsableNombre: "",
    diaIngreso: "",
    mesIngreso: "",
    añoIngreso: "",
    cantidad: "",
    estado: "",
    descripcion: "",
  };
}

// CAMBIO: Renombrado a 'useAgregarServicioLogic'
export function useAgregarServicioLogic() {
  // CAMBIO: 'producto' -> 'servicio'
  const [servicio, setServicio] = useState(crearProductoVacio());
  const [empleadosList, setEmpleadosList] = useState([]);
  
  // --- NUEVO: Estado para el modal de alerta ---
  const [modalInfo, setModalInfo] = useState({ visible: false, title: "", message: "" });

  // --- EFECTO PARA CARGAR EMPLEADOS ---
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
          // --- CAMBIO: Usamos el modal ---
          setModalInfo({ visible: true, title: "Error", message: data.message || "Error al cargar empleados." });
        }
      } catch (error) {
        console.error("Error al cargar empleados:", error);
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ visible: true, title: "Error de Conexión", message: error.message });
      }
    }
    fetchEmpleados();
  }, []); 

  // CAMBIO: 'handleProductoChange' -> 'handleServicioChange'
  const handleServicioChange = (key, value) => {
    setServicio(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  // CAMBIO: 'guardarNuevoProducto' -> 'guardarNuevoServicio'
  const guardarNuevoServicio = async () => {
    // CAMBIO: Validación para campos de servicio
    if (!servicio.nombre || !servicio.categoria || !servicio.idResponsable || !servicio.cantidad || !servicio.unidad_medida || !servicio.estado) {
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ 
        visible: true, 
        title: "Campos incompletos", 
        message: "Por favor, llene todos los campos obligatorios (Nombre, Categoría, Responsable, Cantidad, Unidad y Estado)." 
      });
      return;
    }

    const fechaIngreso = servicio.diaIngreso && servicio.mesIngreso && servicio.añoIngreso
      ? `${servicio.añoIngreso}-${servicio.mesIngreso.padStart(2, "0")}-${servicio.diaIngreso.padStart(2, "0")}`
      : null;

    const dataParaEnviar = {
      nombre: servicio.nombre.trim(),
      codigo_interno: servicio.codigo_interno.trim(), 
      categoria: servicio.categoria.trim(),
      unidad_medida: servicio.unidad_medida, 
      idResponsable: servicio.idResponsable, 
      fechaIngreso: fechaIngreso,
      cantidad: parseInt(servicio.cantidad) || 0,
      estado: servicio.estado, 
      descripcion: servicio.descripcion.trim(),
    };

    try {
      // CAMBIO: Endpoint a '/servicios/guardar'
      const response = await fetch(`${API_URL}/servicios/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ 
          visible: true, 
          title: "Error al guardar", 
          message: data.message || "No se pudo crear el servicio."
        });
      } else {
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ 
          visible: true, 
          title: "Éxito", 
          message: "Servicio guardado correctamente."
        });
        setServicio(crearProductoVacio());
      }
    } catch (error) {
      console.error("Error al guardar servicio:", error);
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ 
        visible: true, 
        title: "Error de Conexión", 
        message: "No se pudo conectar con el servidor."
      });
    }
  };

  // --- NUEVO: Función para cerrar el modal ---
  const closeModal = () => {
    setModalInfo({ visible: false, title: "", message: "" });
  };

  return {
    servicio, // <-- CAMBIO
    empleadosList, 
    onChange: handleServicioChange, // <-- CAMBIO
    onGuardar: guardarNuevoServicio, // <-- CAMBIO
    modalInfo, 
    closeModal, 
  };
}