import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../../../config/apiConfig";

// Estructura de producto vacía para evitar errores de referencia
const PRODUCTO_VACIO = {
  id_producto: null, nombre: "", codigoInterno: "", unidadMedida: "",
  categoria: "", idResponsable: "", responsableNombre: "", diaIngreso: "",
  mesIngreso: "", añoIngreso: "", cantidad: "", estado: "", descripcion: "",
};

// 1. CORRECCIÓN: Mapeamos las claves de la API (snake_case) al estado (camelCase)
function formatearProducto(p) {
  if (!p) return PRODUCTO_VACIO;

  const fecha = p.fecha_ingreso
    ? new Date(p.fecha_ingreso)
    : null;

  return {
    id_producto: p.id_producto || null,
    nombre: (p.nombre || "").trim(),
    codigoInterno: (p.codigo_interno || "").trim(), // 👈 CORREGIDO A CAMELCASE
    unidadMedida: (p.unidad_medida || "").trim(),   // 👈 CORREGIDO A CAMELCASE
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
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [empleadosList, setEmpleadosList] = useState([]);

  // --- EFECTO PARA CARGAR EMPLEADOS ---
  useEffect(() => {
    async function fetchEmpleados() {
      try {
        // Usamos la ruta modular del controlador de inventario
        const response = await fetch(`${API_URL}/inventario/empleados/todos`);
        if (!response.ok) {
          throw new Error("No se pudo cargar la lista de empleados");
        }
        const data = await response.json();
        if (data.success) {
          setEmpleadosList(data.empleados);
        }
      } catch (error) {
        console.error("Error al cargar empleados:", error);
      }
    }
    fetchEmpleados();
  }, []);


  const buscarProducto = async () => {
    if (!terminoBusqueda.trim()) {
      Alert.alert("Atención", "Ingrese un nombre o código de producto para buscar.");
      return;
    }

    try {
      setLoading(true);
      // Endpoint que busca por término (usa la función buscarProducto del controlador)
      const response = await fetch(
        `${API_URL}/inventario/productos/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );

      // Aseguramos que la respuesta es OK antes de parsear JSON
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status}`);
      }

      const data = await response.json();

      // El backend retorna 'productos'[] si hay varios, o 'producto' si es una coincidencia exacta.
      // Aquí solo necesitamos la primera coincidencia de la lista de resultados para mostrar.
      const productoEncontrado = data.producto || (data.productos && data.productos[0]);

      if (data.success && productoEncontrado) {
        // Obtenemos el producto completo por ID para asegurar todos los campos (como editar)
        const fullResponse = await fetch(`${API_URL}/inventario/productos/buscar/${productoEncontrado.id_producto}`);
        const fullData = await fullResponse.json();

        if (fullData.success && fullData.producto) {
          setProducto(formatearProducto(fullData.producto)); // Mapeo correcto
        } else {
          Alert.alert("Error", "No se pudieron obtener los datos completos del producto.");
        }
      } else {
        Alert.alert("Sin resultados", data.message || "No se encontró ningún producto.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudo obtener el producto.");
    } finally {
      setLoading(false);
    }
  };

  const deseleccionarProducto = () => {
    setProducto(null);
    setTerminoBusqueda("");
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
  };
}