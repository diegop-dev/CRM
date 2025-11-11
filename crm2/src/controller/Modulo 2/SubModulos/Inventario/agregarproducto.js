import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../../../config/apiConfig"; // Asumo que tienes esto

// CAMBIO: Función para crear un objeto de producto vacío
function crearProductoVacio() {
  return {
    id_producto: "",
    nombre: "",
    // --- CAMPOS AÑADIDOS ---
    codigo_interno: "",
    unidad_medida: "",
    // --- FIN CAMPOS AÑADIDOS ---
    categoria: "",
    idResponsable: "",
    responsableNombre: "",
    diaIngreso: "",
    mesIngreso: "",
    añoIngreso: "",
    cantidad: "",
    // --- CAMPO AÑADIDO ---
    estado: "",
    // --- FIN CAMPO AÑADIDO ---
    descripcion: "",
  };
}

// CAMBIO: Renombrado a 'useAgregarProductoLogic'
export function useAgregarProductoLogic() {
  // CAMBIO: Estado para el objeto 'producto'
  const [producto, setProducto] = useState(crearProductoVacio());
  
  // (MANTENIDO) Estado para la lista de empleados (para el picker de responsable)
  const [empleadosList, setEmpleadosList] = useState([]);

  // --- EFECTO PARA CARGAR EMPLEADOS ---
  // (MANTENIDO)
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
          Alert.alert("Error", data.message || "Error al cargar empleados.");
        }
      } catch (error) {
        console.error("Error al cargar empleados:", error);
        Alert.alert("Error de Conexión", error.message);
      }
    }
    fetchEmpleados();
  }, []); // El array vacío asegura que solo se ejecute una vez

  // CAMBIO: Función genérica para actualizar el estado del 'producto'
  const handleProductoChange = (key, value) => {
    setProducto(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  // CAMBIO: Función para guardar el 'producto'
  const guardarNuevoProducto = async () => {
    // --- Validación simple ---
    // (Actualizada para campos de producto)
    // CAMBIO: Añadida validación para los nuevos campos
    if (!producto.nombre || !producto.categoria || !producto.idResponsable || !producto.cantidad || !producto.unidad_medida || !producto.estado) {
      Alert.alert("Campos incompletos", "Por favor, llene todos los campos obligatorios (Nombre, Categoría, Responsable, Cantidad, Unidad y Estado).");
      return;
    }

    // --- Preparar datos para el backend ---
    const fechaIngreso = producto.diaIngreso && producto.mesIngreso && producto.añoIngreso
      ? `${producto.añoIngreso}-${producto.mesIngreso.padStart(2, "0")}-${producto.diaIngreso.padStart(2, "0")}`
      : null;

    // CAMBIO: dataParaEnviar actualizada con los nuevos campos
    const dataParaEnviar = {
      nombre: producto.nombre.trim(),
      codigo_interno: producto.codigo_interno.trim(), // <-- AÑADIDO
      categoria: producto.categoria.trim(),
      unidad_medida: producto.unidad_medida, // <-- AÑADIDO
      idResponsable: producto.idResponsable, 
      fechaIngreso: fechaIngreso,
      cantidad: parseInt(producto.cantidad) || 0,
      estado: producto.estado, // <-- AÑADIDO
      descripcion: producto.descripcion.trim(),
    };

    try {
      // CAMBIO: Llamamos a la nueva ruta del backend
      const response = await fetch(`${API_URL}/productos/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        Alert.alert("Error al guardar", data.message || "No se pudo crear el producto.");
      } else {
        Alert.alert("Éxito", "Producto guardado correctamente.");
        // CAMBIO: Limpiamos el formulario de producto
        setProducto(crearProductoVacio());
      }
    } catch (error) {
      console.error("Error al guardar producto:", error);
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
    }
  };

  // CAMBIO: Retorno de valores
  return {
    producto,
    empleadosList, // Pasamos la lista de empleados al formulario
    onChange: handleProductoChange,
    onGuardar: guardarNuevoProducto,
  };
}
