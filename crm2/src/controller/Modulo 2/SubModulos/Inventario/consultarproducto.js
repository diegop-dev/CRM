import { useState, useEffect } from "react";
// import { Alert } from "react-native"; // <-- Eliminamos Alert
import { API_URL } from "../../../../config/apiConfig";

// (Tu función 'formatearProducto' no cambia)
function formatearProducto(p) {
  if (!p) return null;
  const fecha = p.fecha_ingreso ? p.fecha_ingreso.split("T")[0].split("-") : ["", "", ""];
  return {
    id_producto: p.id_producto || p.idProducto,
    nombre: (p.nombre || "").trim(),
    codigoInterno: (p.codigo_interno || "").trim(),
    categoria: (p.categoria || "").trim(),
    unidadMedida: (p.unidad_medida || "").trim(),
    idResponsable: p.id_responsable || p.idResponsable || "",
    responsableNombre: (p.responsable_nombre || "").trim(),
    diaIngreso: fecha[2] || "",
    mesIngreso: fecha[1] || "",
    añoIngreso: fecha[0] || "",
    cantidad: p.cantidad ? p.cantidad.toString() : "",
    estado: (p.estado || "").trim(),
    descripcion: (p.descripcion || "").trim(),
  };
}

export function useConsultarProductoLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [producto, setProducto] = useState(null);
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

  const buscarProducto = async () => {
    if (!terminoBusqueda.trim()) {
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ visible: true, title: "Atención", message: "Ingrese un nombre de producto para buscar." });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/productos/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );
      const data = await response.json();
      const productoEncontrado = data.producto || (data.productos && data.productos[0]);

      if (response.ok && data.success && productoEncontrado) {
        setProducto(formatearProducto(productoEncontrado));
      } else {
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ visible: true, title: "Sin resultados", message: data.message || "No se encontró ningún producto con ese nombre." });
      }
    } catch (error) {
      console.error("Error:", error);
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ visible: true, title: "Error", message: "No se pudo obtener el producto." });
    } finally {
      setLoading(false);
    }
  };

  const deseleccionarProducto = () => {
    setProducto(null);
    setTerminoBusqueda("");
  };

  // --- NUEVO: Función para cerrar el modal ---
  const closeModal = () => {
    setModalInfo({ visible: false, title: "", message: "" });
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    producto,
    empleadosList, 
    loading,
    editable: false, 
    buscarProducto,
    deseleccionarProducto,
    modalInfo, // <-- Exportamos el estado del modal
    closeModal, // <-- Exportamos la función de cierre
  };
}