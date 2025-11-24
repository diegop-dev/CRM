import { useState, useEffect, useCallback } from "react";
// Eliminamos Alert
import { API_URL } from "../../../../config/apiConfig";

// Estructura de producto vacía
const PRODUCTO_VACIO = {
  id_producto: null, nombre: "", codigoInterno: "", unidadMedida: "",
  categoria: "", idResponsable: "", responsableNombre: "", diaIngreso: "",
  mesIngreso: "", añoIngreso: "", cantidad: "", estado: "", descripcion: "",
};

// Mapeo de snake_case a camelCase
function formatearProducto(p) {
  if (!p) return PRODUCTO_VACIO;

  const fecha = p.fecha_ingreso ? new Date(p.fecha_ingreso) : null;

  return {
    id_producto: p.id_producto ? p.id_producto.toString() : null,
    nombre: (p.nombre || "").trim(),
    codigoInterno: (p.codigo_interno || "").trim(),
    unidadMedida: (p.unidad_medida || "").trim(),
    categoria: (p.categoria || "").trim(),
    idResponsable: p.id_responsable ? p.id_responsable.toString() : "",
    responsableNombre: (p.responsable_nombre || "").trim(),
    diaIngreso: fecha ? fecha.getDate().toString() : "",
    mesIngreso: fecha ? (fecha.getMonth() + 1).toString() : "",
    añoIngreso: fecha ? fecha.getFullYear().toString() : "",
    cantidad: p.cantidad ? p.cantidad.toString() : "",
    estado: (p.estado || "").trim(),
    descripcion: (p.descripcion || "").trim(),
  };
}

export function useConsultarProductoLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [producto, setProducto] = useState(null); // Producto seleccionado
  const [productos, setProductos] = useState([]); // Lista de resultados
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

  // 1. Cargar productos aleatorios
  const cargarProductosAleatorios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/inventario/productos/aleatorios`);
      if (!response.ok) throw new Error("Fallo al cargar aleatorios");
      const data = await response.json();
      if (data.success && data.productos) {
        setProductos(data.productos);
      } else {
        setProductos([]);
      }
    } catch (error) {
      console.error("Error al cargar productos aleatorios:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Efecto Inicial
  useEffect(() => {
    async function cargarDatosIniciales() {
      try {
        setLoading(true);
        // Cargar Empleados
        const empResponse = await fetch(`${API_URL}/inventario/empleados/todos`);
        if (empResponse.ok) {
          const empData = await empResponse.json();
          if (empData.success) setEmpleadosList(empData.empleados);
        }
        // Cargar Aleatorios
        await cargarProductosAleatorios();
      } catch (error) {
        console.error("Error inicial:", error);
        showModal("Error de Conexión", "No se pudieron cargar los datos iniciales.", "error");
      } finally {
        setLoading(false);
      }
    }
    cargarDatosIniciales();
  }, [cargarProductosAleatorios]);

  // 3. Buscar Productos
  const buscarProducto = async () => {
    if (!terminoBusqueda.trim()) {
      cargarProductosAleatorios();
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/inventario/productos/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );

      if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);
      const data = await response.json();

      if (data.success && data.productos?.length > 0) {
        setProductos(data.productos); 
      } else if (data.success && data.producto) {
         setProductos([data.producto]);
      } else {
        setProductos([]);
        showModal("Sin resultados", "No se encontró ningún producto.", "warning");
      }
    } catch (error) {
      console.error("Error:", error);
      showModal("Error", "No se pudo buscar el producto.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 4. Seleccionar Producto
  const seleccionarProducto = async (p) => {
    setLoading(true);
    try {
      const id = p.id_producto || p.idProducto;
      const response = await fetch(`${API_URL}/inventario/productos/buscar/${id}`);
      const data = await response.json();

      if (data.success && data.producto) {
        setProducto(formatearProducto(data.producto));
        setProductos([]); 
      } else {
        showModal("Error", "No se pudieron cargar los detalles.", "error");
      }
    } catch (error) {
      console.error(error);
      showModal("Error", "Fallo de conexión.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 5. Deseleccionar
  const deseleccionarProducto = () => {
    setProducto(null);
    setTerminoBusqueda("");
    cargarProductosAleatorios();
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    producto,
    productos,
    empleadosList,
    loading,
    buscarProducto,
    seleccionarProducto,
    deseleccionarProducto,
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal
  };
}
