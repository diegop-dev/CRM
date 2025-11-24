import { useState, useEffect, useCallback } from "react";
// Eliminamos Alert
import { API_URL } from "../../../../config/apiConfig";
import { useNavigation } from "@react-navigation/native";

// Estructura de producto vacía para inicialización
const PRODUCTO_VACIO = {
  id_producto: null, nombre: "", codigoInterno: "", unidadMedida: "",
  categoria: "", idResponsable: "", responsableNombre: "", diaIngreso: "",
  mesIngreso: "", añoIngreso: "", cantidad: "", estado: "", descripcion: "",
};

// Utilidad para formatear la fecha
const formatearProducto = (p) => {
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
};

export function useEditarProductoLogic() {
  const navigation = useNavigation();
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
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

  // Función para obtener productos aleatorios
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

  // --- EFECTO: Carga inicial ---
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setLoading(true);
      try {
        // 1. Cargar Empleados
        const empResponse = await fetch(`${API_URL}/inventario/empleados/todos`);
        if (!empResponse.ok) throw new Error("Fallo al cargar empleados");
        const empData = await empResponse.json();
        if (empData.success) {
          setEmpleadosList(empData.empleados);
        }

        // 2. Cargar productos aleatorios
        await cargarProductosAleatorios();

      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        showModal("Error de Conexión", "No se pudieron cargar los datos iniciales.", "error");
      } finally {
        setLoading(false);
      }
    };
    cargarDatosIniciales();
  }, [cargarProductosAleatorios]);


  // Función para buscar productos
  const buscarProducto = useCallback(async () => {
    if (!terminoBusqueda.trim()) {
      cargarProductosAleatorios();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/inventario/productos/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );
      if (!response.ok) throw new Error("Fallo en búsqueda");
      const data = await response.json();
      if (data.success && data.productos?.length) {
        setProductos(data.productos);
      } else {
        setProductos([]);
        showModal("Sin resultados", "No se encontró ningún producto con ese término.", "warning");
      }
    } catch (error) {
      showModal("Error", "No se pudo realizar la búsqueda.", "error");
    } finally {
      setLoading(false);
    }
  }, [terminoBusqueda, cargarProductosAleatorios]);

  // Función para seleccionar un producto (detalle completo)
  const seleccionarProducto = useCallback(async (p) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/inventario/productos/buscar/${p.id_producto || p.idProducto}`
      );
      if (!response.ok) throw new Error("Fallo al obtener detalles");
      const data = await response.json();

      if (data.success && data.producto) {
        setProductoSeleccionado(formatearProducto(data.producto));
        setProductos([]); 
      } else {
        showModal("Error", "No se pudieron obtener los datos completos del producto.", "error");
      }
    } catch (error) {
      showModal("Error", "No se pudo conectar con el servidor para obtener los detalles.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Setear producto desde navegación (Asumimos que ya viene formateado o lo formateamos si es necesario)
  const setProductoDesdeNavegacion = useCallback((p) => {
    setProductoSeleccionado(p);
  }, []);


  // --- LÓGICA DE GUARDADO (API) ---
  const executeSave = async () => {
    closeFeedbackModal(); // Cerramos modal de confirmación

    const fechaIngreso =
      productoSeleccionado.diaIngreso && productoSeleccionado.mesIngreso && productoSeleccionado.añoIngreso
        ? `${productoSeleccionado.añoIngreso}-${productoSeleccionado.mesIngreso.padStart(2, "0")}-${productoSeleccionado.diaIngreso.padStart(2, "0")}`
        : null;

    const dataParaEnviar = {
      nombre: (productoSeleccionado.nombre || "").trim(),
      codigo_interno: (productoSeleccionado.codigoInterno || "").trim(),
      categoria: (productoSeleccionado.categoria || "").trim(),
      unidad_medida: (productoSeleccionado.unidadMedida || ""),
      idResponsable: parseInt(productoSeleccionado.idResponsable),
      fechaIngreso: fechaIngreso,
      cantidad: parseInt(productoSeleccionado.cantidad) || 0,
      estado: (productoSeleccionado.estado || ""),
      descripcion: (productoSeleccionado.descripcion || "").trim(),
    };

    const id = productoSeleccionado.id_producto;

    try {
      const response = await fetch(`${API_URL}/inventario/productos/editar/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });
      
      if (!response.ok) throw new Error("Fallo en la actualización");

      const data = await response.json();

      if (data.success) {
        showModal("Éxito", "Producto actualizado correctamente.", "success");
        navigation.goBack(); 
      } else {
        showModal("Error", data.message || "No se pudieron guardar los cambios.", "error");
      }
    } catch (error) {
      showModal("Error de Servidor", "Error al guardar. Revisa la conexión.", "error");
    }
  };

  // --- FUNCIÓN PRINCIPAL GUARDAR (Validación + Confirmación) ---
  const guardarCambios = useCallback(async () => {
    if (!productoSeleccionado || !productoSeleccionado.id_producto) {
      showModal("Error", "No hay producto seleccionado para guardar.", "warning");
      return;
    }

    // Mostramos modal de confirmación
    showModal(
        "Confirmar Cambios",
        "¿Está seguro de que desea guardar los cambios realizados en este producto?",
        "question",
        executeSave // Acción al confirmar
    );

  }, [productoSeleccionado, navigation]);

  const deseleccionarProducto = useCallback(() => {
    setProductoSeleccionado(null);
    setTerminoBusqueda("");
    cargarProductosAleatorios(); 
  }, [cargarProductosAleatorios]);

  const handleFormChange = useCallback((key, value) => {
    setProductoSeleccionado(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    productos,
    productoSeleccionado,
    setProductoSeleccionado: handleFormChange,
    setProductoDesdeNavegacion,
    empleadosList,
    loading,
    buscarProducto,
    seleccionarProducto,
    guardarCambios,
    deseleccionarProducto,
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal
  };
}
