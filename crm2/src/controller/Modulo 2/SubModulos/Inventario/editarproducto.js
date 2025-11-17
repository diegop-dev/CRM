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

export function useEditarProductoLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [productos, setProductos] = useState([]);
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [empleadosList, setEmpleadosList] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- NUEVO: Estado para el modal de alerta ---
  const [modalInfo, setModalInfo] = useState({ visible: false, title: "", message: "" });

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setLoading(true);
      try {
        const [prodResponse, empResponse] = await Promise.all([
          fetch(`${API_URL}/productos/aleatorios`), 
          fetch(`${API_URL}/empleados/todos`)
        ]);

        const prodData = await prodResponse.json();
        const empData = await empResponse.json();

        if (prodData.success && prodData.productos) {
          setProductos(prodData.productos); 
        } else {
          setProductos([]);
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

  const setProductoDesdeNavegacion = (productoCrudo) => {
    setProductoSeleccionado(formatearProducto(productoCrudo));
  };

  const cargarProductosAleatorios = async () => {
     setLoading(true);
     try {
       const response = await fetch(`${API_URL}/productos/aleatorios`); 
       const data = await response.json();
       if (data.success && data.productos) { 
         setProductos(data.productos); 
       } else {
         setProductos([]);
       }
     } catch (error) {
       console.error("Error al cargar productos:", error); 
     } finally {
       setLoading(false);
     }
   };

  const buscarProducto = async () => {
    if (!terminoBusqueda.trim()) {
      cargarProductosAleatorios(); 
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/productos/buscar?termino=${encodeURIComponent(terminoBusqueda)}` 
      );
      const data = await response.json();
      if (!data.success || !data.productos?.length) { 
        setProductos([]);
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ visible: true, title: "Sin resultados", message: "No se encontró ningún producto." });
        return;
      }
      setProductos(data.productos); 
    } catch (error) {
      console.error("Error al buscar producto:", error); 
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ visible: true, title: "Error", message: "No se pudo realizar la búsqueda." });
    } finally {
      setLoading(false);
    }
  };

  const seleccionarProducto = async (p) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/productos/consultar/${p.id_producto || p.idProducto}` 
      );
      const rawResponse = await response.text();
      const data = JSON.parse(rawResponse);

      if (data.success && data.producto) { 
        setProductoSeleccionado(formatearProducto(data.producto)); 
      } else {
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ visible: true, title: "Error", message: "No se pudieron obtener los datos del producto." });
      }
    } catch (error) {
      console.error("Error al obtener datos del producto:", error); 
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ visible: true, title: "Error de Conexión", message: "No se pudo conectar con el servidor." });
    } finally {
      setLoading(false);
    }
  };

  const guardarCambios = async () => {
    if (!productoSeleccionado) {
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ visible: true, title: "Error", message: "Debe seleccionar un producto primero." });
      return;
    }

    const fechaIngreso =
      productoSeleccionado.diaIngreso && productoSeleccionado.mesIngreso && productoSeleccionado.añoIngreso
        ? `${productoSeleccionado.añoIngreso}-${productoSeleccionado.mesIngreso.padStart(2, "0")}-${productoSeleccionado.diaIngreso.padStart(2, "0")}`
        : null;

    const dataParaEnviar = {
      ...productoSeleccionado,
      nombre: (productoSeleccionado.nombre || "").trim(),
      codigo_interno: (productoSeleccionado.codigoInterno || "").trim(), 
      categoria: (productoSeleccionado.categoria || "").trim(),
      unidad_medida: (productoSeleccionado.unidadMedida || ""), 
      idResponsable: productoSeleccionado.idResponsable,
      fecha_ingreso: fechaIngreso, 
      cantidad: parseInt(productoSeleccionado.cantidad) || 0, 
      estado: (productoSeleccionado.estado || ""), 
      descripcion: (productoSeleccionado.descripcion || "").trim(),
    };
    const id = dataParaEnviar.id_producto; 

    try {
      const response = await fetch(`${API_URL}/productos/editar/${id}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar), 
      });
      const rawResponse = await response.text();
      const data = JSON.parse(rawResponse);

      if (data.success) {
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ visible: true, title: "Éxito", message: "Producto actualizado correctamente." });
        setProductoSeleccionado(null);
        cargarProductosAleatorios(); 
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

  const deseleccionarProducto = () => {
    setProductoSeleccionado(null);
  };

  // --- NUEVO: Función para cerrar el modal ---
  const closeModal = () => {
    setModalInfo({ visible: false, title: "", message: "" });
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    productos,
    productoSeleccionado,
    setProductoSeleccionado,
    setProductoDesdeNavegacion,
    empleadosList, 
    loading,
    buscarProducto,
    seleccionarProducto,
    guardarCambios,
    deseleccionarProducto,
    modalInfo, // <-- Exportamos el estado del modal
    closeModal, // <-- Exportamos la función de cierre
  };
}