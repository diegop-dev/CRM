import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../../../config/apiConfig";

// 1. CORRECCIÓN: Usamos nombres en camelCase para el estado de React
function crearProductoVacio() {
  return {
    id_producto: "",
    nombre: "",
    codigoInterno: "", 
    unidadMedida: "", 
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
  // Estado para el objeto 'producto'
  const [producto, setProducto] = useState(crearProductoVacio());
  const [empleadosList, setEmpleadosList] = useState([]);

  // --- EFECTO PARA CARGAR EMPLEADOS (omito por brevedad, es correcto) ---
  useEffect(() => {
    async function fetchEmpleados() {
      try {
        const response = await fetch(`${API_URL}/inventario/empleados/todos`);
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
  }, []);

  // Función genérica para actualizar el estado del 'producto'
  const handleProductoChange = (key, value) => {
    setProducto(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  // Función para guardar el 'producto'
  const guardarNuevoProducto = async () => {
    // Validación (Ahora usa las claves camelCase del estado)
    if (!producto.nombre || !producto.categoria || !producto.idResponsable || !producto.cantidad || !producto.unidadMedida || !producto.estado) {
      Alert.alert("Campos incompletos", "Por favor, llene todos los campos obligatorios.");
      return;
    }

    // Preparar datos para el backend
    const fechaIngreso = producto.diaIngreso && producto.mesIngreso && producto.añoIngreso
      ? `${producto.añoIngreso}-${producto.mesIngreso.padStart(2, "0")}-${producto.diaIngreso.padStart(2, "0")}`
      : null;

    // 2. CORRECCIÓN CRÍTICA: Mapeamos de camelCase (React State) a snake_case (API/SQL)
    const dataParaEnviar = {
      nombre: producto.nombre.trim(),
      codigo_interno: producto.codigoInterno.trim(), // 👈 Mapea 'codigoInterno' a 'codigo_interno'
      categoria: producto.categoria.trim(),
      unidad_medida: producto.unidadMedida,       // 👈 Mapea 'unidadMedida' a 'unidad_medida'
      idResponsable: parseInt(producto.idResponsable),
      fechaIngreso: fechaIngreso,
      cantidad: parseInt(producto.cantidad) || 0,
      estado: producto.estado,
      descripcion: producto.descripcion.trim(),
    };

    try {
      // USAMOS LA RUTA MODULAR
      const response = await fetch(`${API_URL}/inventario/productos/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        Alert.alert("Error al guardar", data.message || "No se pudo crear el producto.");
      } else {
        Alert.alert("Éxito", "Producto guardado correctamente.");
        setProducto(crearProductoVacio());
      }
    } catch (error) {
      console.error("Error al guardar producto:", error);
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
    }
  };

  return {
    producto,
    empleadosList,
    onChange: handleProductoChange,
    onGuardar: guardarNuevoProducto,
  };
}