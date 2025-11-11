import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../../../config/apiConfig";

// --- INICIO DE LA ACTUALIZACIÓN ---
// 1. CAMBIO: Renombrado a 'formatearProducto'
// (Campos adaptados a los de producto, incluyendo los nuevos)
function formatearProducto(p) {
  if (!p) return null;

  // --- LÓGICA DE FECHA (Re-integrada) ---
  const fecha = p.fecha_ingreso ? p.fecha_ingreso.split("T")[0].split("-") : ["", "", ""];

  // Usamos .trim() en todos los campos de texto
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
// --- FIN DE LA ACTUALIZACIÓN ---


// CAMBIO: Renombrado a 'useConsultarProductoLogic'
export function useConsultarProductoLogic() {
  // CAMBIO: 'terminoBusqueda'
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  // CAMBIO: 'servicio' -> 'producto'
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // (Mantenido) Necesario para el dropdown de Responsable
  const [empleadosList, setEmpleadosList] = useState([]);

  // --- EFECTO PARA CARGAR EMPLEADOS ---
  // (Mantenido)
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
  }, []); // El array vacío asegura que solo se ejecute una vez
  // --- FIN DE LÓGICA AÑADIDA ---


  // CAMBIO: 'buscarServicio' -> 'buscarProducto'
  const buscarProducto = async () => {
    if (!terminoBusqueda.trim()) {
      // CAMBIO: Mensaje actualizado
      Alert.alert("Atención", "Ingrese un nombre de producto para buscar.");
      return;
    }

    try {
      setLoading(true);
      // CAMBIO: Endpoint actualizado
      const response = await fetch(
        `${API_URL}/productos/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );

      const data = await response.json();

      // CAMBIO: Asumimos 'data.producto' o 'data.productos[0]'
      const productoEncontrado = data.producto || (data.productos && data.productos[0]);

      if (response.ok && data.success && productoEncontrado) {
        // --- INICIO DE LA ACTUALIZACIÓN ---
        // 2. Usamos la función formateadora de producto
        setProducto(formatearProducto(productoEncontrado)); // <-- ¡CAMBIO CLAVE!
        // --- FIN DE LA ACTUALIZACIÓN ---
      } else {
        // CAMBIO: Mensaje actualizado
        Alert.alert("Sin resultados", data.message || "No se encontró ningún producto con ese nombre.");
      }
    } catch (error) {
      console.error("Error:", error);
      // CAMBIO: Mensaje actualizado
      Alert.alert("Error", "No se pudo obtener el producto.");
    } finally {
      setLoading(false);
    }
  };

  // CAMBIO: 'deseleccionarServicio' -> 'deseleccionarProducto'
  const deseleccionarProducto = () => {
   setProducto(null);
   setTerminoBusqueda("");
  };

  // CAMBIO: Retorno de valores adaptados
  return {
    terminoBusqueda,
    setTerminoBusqueda,
    producto,
    empleadosList, // <-- ¡CLAVE! Se retorna la lista de empleados
    loading,
    editable: false, // Se mantiene 'false' por si el FormView lo necesita
    buscarProducto,
    deseleccionarProducto,
  };
}
