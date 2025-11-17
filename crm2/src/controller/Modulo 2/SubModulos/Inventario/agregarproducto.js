import { useState, useEffect } from "react";
// import { Alert } from "react-native"; // <-- Eliminamos Alert
import { API_URL } from "../../../../config/apiConfig"; 

// (crearProductoVacio no cambia)
function crearProductoVacio() {
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

export function useAgregarProductoLogic() {
  const [producto, setProducto] = useState(crearProductoVacio());
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

  const handleProductoChange = (key, value) => {
    setProducto(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const guardarNuevoProducto = async () => {
    if (!producto.nombre || !producto.categoria || !producto.idResponsable || !producto.cantidad || !producto.unidad_medida || !producto.estado) {
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ 
        visible: true, 
        title: "Campos incompletos", 
        message: "Por favor, llene todos los campos obligatorios (Nombre, Categoría, Responsable, Cantidad, Unidad y Estado)." 
      });
      return;
    }

    const fechaIngreso = producto.diaIngreso && producto.mesIngreso && producto.añoIngreso
      ? `${producto.añoIngreso}-${producto.mesIngreso.padStart(2, "0")}-${producto.diaIngreso.padStart(2, "0")}`
      : null;

    const dataParaEnviar = {
      nombre: producto.nombre.trim(),
      codigo_interno: producto.codigo_interno.trim(), 
      categoria: producto.categoria.trim(),
      unidad_medida: producto.unidad_medida, 
      idResponsable: producto.idResponsable, 
      fechaIngreso: fechaIngreso,
      cantidad: parseInt(producto.cantidad) || 0,
      estado: producto.estado, 
      descripcion: producto.descripcion.trim(),
    };

    try {
      const response = await fetch(`${API_URL}/productos/guardar`, {
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
          message: data.message || "No se pudo crear el producto."
        });
      } else {
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ 
          visible: true, 
          title: "Éxito", 
          message: "Producto guardado correctamente."
        });
        setProducto(crearProductoVacio());
      }
    } catch (error) {
      console.error("Error al guardar producto:", error);
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
    producto,
    empleadosList,
    onChange: handleProductoChange,
    onGuardar: guardarNuevoProducto,
    modalInfo, // <-- Exportamos el estado del modal
    closeModal, // <-- Exportamos la función de cierre
  };
}