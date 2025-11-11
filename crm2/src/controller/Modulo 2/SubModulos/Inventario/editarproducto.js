// src/controller/.../editarproducto.js
import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../../../config/apiConfig"; // Ajusta esta ruta

// 1. CAMBIO: Creamos una función formateadora para 'Producto'
// (Basada en la lógica de 'formatearEmpleado' y los campos de 'productosform.js')
function formatearProducto(p) {
  if (!p) return null;

  // Separamos la fecha (ej: "2025-11-10T...")
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


// CAMBIO: Renombrado a 'useEditarProductoLogic'
export function useEditarProductoLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  // CAMBIO: 'servicios' -> 'productos' (la lista de búsqueda)
  const [productos, setProductos] = useState([]);
  // CAMBIO: 'servicioSeleccionado' -> 'productoSeleccionado'
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
  // (MANTENIDO) Lista de empleados para el dropdown
  const [empleadosList, setEmpleadosList] = useState([]);

  const [loading, setLoading] = useState(false);

  // CAMBIO: Carga inicial de Productos Aleatorios Y Empleados
  useEffect(() => {
    const cargarDatosIniciales = async () => {
      setLoading(true);
      try {
        const [prodResponse, empResponse] = await Promise.all([
          fetch(`${API_URL}/productos/aleatorios`), // <-- CAMBIO
          fetch(`${API_URL}/empleados/todos`)
        ]);

        const prodData = await prodResponse.json();
        const empData = await empResponse.json();

        if (prodData.success && prodData.productos) { // <-- CAMBIO
          setProductos(prodData.productos); // <-- CAMBIO
        } else {
          setProductos([]);
        }

        if (empData.success && empData.empleados) {
          setEmpleadosList(empData.empleados);
        } else {
          setEmpleadosList([]);
          Alert.alert("Error", "No se pudo cargar la lista de empleados.");
        }

      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      } finally {
        setLoading(false);
      }
    };
    
    cargarDatosIniciales();
  }, []);

  // CAMBIO: 'setServicioDesdeNavegacion' -> 'setProductoDesdeNavegacion'
  const setProductoDesdeNavegacion = (productoCrudo) => {
    // 2. Usamos la función formateadora de producto
    setProductoSeleccionado(formatearProducto(productoCrudo));
  };

  // (Función para cargar aleatorios)
  const cargarProductosAleatorios = async () => {
     setLoading(true);
     try {
       const response = await fetch(`${API_URL}/productos/aleatorios`); // <-- CAMBIO
       const data = await response.json();
       if (data.success && data.productos) { // <-- CAMBIO
         setProductos(data.productos); // <-- CAMBIO
       } else {
         setProductos([]);
       }
     } catch (error) {
       console.error("Error al cargar productos:", error); // <-- CAMBIO
     } finally {
       setLoading(false);
     }
   };

  // CAMBIO: 'buscarServicio' -> 'buscarProducto'
  const buscarProducto = async () => {
    if (!terminoBusqueda.trim()) {
      cargarProductosAleatorios(); 
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/productos/buscar?termino=${encodeURIComponent(terminoBusqueda)}` // <-- CAMBIO
      );
      const data = await response.json();
      if (!data.success || !data.productos?.length) { // <-- CAMBIO
        setProductos([]);
        Alert.alert("Sin resultados", "No se encontró ningún producto."); // <-- CAMBIO
        return;
      }
      setProductos(data.productos); // <-- CAMBIO
    } catch (error) {
      console.error("Error al buscar producto:", error); // <-- CAMBIO
      Alert.alert("Error", "No se pudo realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  // CAMBIO: 'seleccionarServicio' -> 'seleccionarProducto'
  const seleccionarProducto = async (p) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/productos/consultar/${p.id_producto || p.idProducto}` // <-- CAMBIO
      );
      const rawResponse = await response.text();
      const data = JSON.parse(rawResponse);

      if (data.success && data.producto) { // <-- CAMBIO
        // 3. Usamos la función formateadora de producto
        setProductoSeleccionado(formatearProducto(data.producto)); // <-- CAMBIO
      } else {
        Alert.alert("Error", "No se pudieron obtener los datos del producto."); // <-- CAMBIO
      }
    } catch (error) {
      console.error("Error al obtener datos del producto:", error); // <-- CAMBIO
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // CAMBIO: 'guardarCambios' (para Producto)
  const guardarCambios = async () => {
    if (!productoSeleccionado) {
      Alert.alert("Error", "Debe seleccionar un producto primero."); // <-- CAMBIO
      return;
    }

    // Reconstruimos la fecha
    const fechaIngreso =
      productoSeleccionado.diaIngreso && productoSeleccionado.mesIngreso && productoSeleccionado.añoIngreso
        ? `${productoSeleccionado.añoIngreso}-${productoSeleccionado.mesIngreso.padStart(2, "0")}-${productoSeleccionado.diaIngreso.padStart(2, "0")}`
        : null;

    // Preparamos la data (trim() y parseInt)
    const dataParaEnviar = {
      ...productoSeleccionado,
      nombre: (productoSeleccionado.nombre || "").trim(),
      codigo_interno: (productoSeleccionado.codigoInterno || "").trim(), // <-- AÑADIDO
      categoria: (productoSeleccionado.categoria || "").trim(),
      unidad_medida: (productoSeleccionado.unidadMedida || ""), // <-- AÑADIDO
      idResponsable: productoSeleccionado.idResponsable,
      fecha_ingreso: fechaIngreso, // <-- AÑADIDO
      cantidad: parseInt(productoSeleccionado.cantidad) || 0, // <-- AÑADIDO
      estado: (productoSeleccionado.estado || ""), // <-- AÑADIDO
      descripcion: (productoSeleccionado.descripcion || "").trim(),
    };

    const id = dataParaEnviar.id_producto; // <-- CAMBIO

    try {
      // 4. CAMBIO: Endpoint actualizado
      const response = await fetch(`${API_URL}/productos/editar/${id}`, { // <-- CAMBIO
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar), 
      });

      const rawResponse = await response.text();
      const data = JSON.parse(rawResponse);

      if (data.success) {
        Alert.alert("Éxito", "Producto actualizado correctamente."); // <-- CAMBIO
        setProductoSeleccionado(null);
        cargarProductosAleatorios(); // Recargamos la lista
      } else {
        Alert.alert("Error", data.message || "No se pudieron guardar los cambios.");
      }
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      Alert.alert("Error de Servidor", "Error al guardar. Revisa la consola.");
    }
  };

  // CAMBIO: 'deseleccionarServicio' -> 'deseleccionarProducto'
  const deseleccionarProducto = () => {
    setProductoSeleccionado(null);
  };

  // CAMBIO: Retorno de valores adaptados
  return {
    terminoBusqueda,
    setTerminoBusqueda,
    productos,
    productoSeleccionado,
    setProductoSeleccionado,
    setProductoDesdeNavegacion,
    empleadosList, // (Se mantiene)
    loading,
    buscarProducto,
    seleccionarProducto,
    guardarCambios,
    deseleccionarProducto,
  };
}
