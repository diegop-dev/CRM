// src/controller/.../editarservicio.js
import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config/apiConfig"; // Ajusta esta ruta

// 1. CAMBIO: Creamos una función formateadora para 'Servicio'
// (Basada en 'formatearEmpleado' y los campos de 'serviciosform.js')
function formatearServicio(s) {
  if (!s) return null;

  // (No hay campos de fecha para formatear en 'servicio')

  // Usamos .trim() en todos los campos de texto
  return {
    id_servicio: s.id_servicio || s.idServicio,
    nombreServicio: (s.nombre_servicio || "").trim(),
    descripcion: (s.descripcion || "").trim(),
    categoria: (s.categoria || "").trim(),
    precio: s.precio ? s.precio.toString() : "", // Convertir a string para el input
    moneda: (s.moneda || "").trim(),
    duracionEstimada: (s.duracion_estimada || "").trim(),
    estado: (s.estado || "").trim(),
    idResponsable: s.id_responsable || s.idResponsable || "", // ID del empleado
    responsableNombre: (s.responsable_nombre || "").trim(), // Nombre del empleado
    notasInternas: (s.notas_internas || "").trim(),
  };
}


// CAMBIO: Renombrado a 'useEditarServicioLogic'
export function useEditarServicioLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  // CAMBIO: 'empleados' -> 'servicios' (la lista de búsqueda)
  const [servicios, setServicios] = useState([]);
  // CAMBIO: 'empleadoSeleccionado' -> 'servicioSeleccionado'
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  
  // --- LÓGICA DE 'editarproyecto.js' ---
  // (Necesitamos la lista completa de empleados para el dropdown)
  const [empleadosList, setEmpleadosList] = useState([]);
  // --- FIN LÓGICA 'editarproyecto.js' ---

  const [loading, setLoading] = useState(false);

  // CAMBIO: Carga inicial de Servicios Aleatorios Y Empleados
  useEffect(() => {
    // (Lógica combinada de ambos hooks)
    const cargarDatosIniciales = async () => {
      setLoading(true);
      try {
        // Hacemos ambas peticiones al mismo tiempo
        const [servResponse, empResponse] = await Promise.all([
          fetch(`${API_URL}/servicios/aleatorios`), // (Endpoint de 'editarempleado')
          fetch(`${API_URL}/empleados/todos`)     // (Endpoint de 'editarproyecto')
        ]);

        const servData = await servResponse.json();
        const empData = await empResponse.json();

        if (servData.success && servData.servicios) {
          setServicios(servData.servicios);
        } else {
          setServicios([]);
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

  // CAMBIO: 'setEmpleadoDesdeNavegacion' -> 'setServicioDesdeNavegacion'
  const setServicioDesdeNavegacion = (servicioCrudo) => {
    // 2. Usamos la función formateadora de servicio
    setServicioSeleccionado(formatearServicio(servicioCrudo));
  };

  // (Función solo para cargar aleatorios, usada si la búsqueda está vacía)
  const cargarServiciosAleatorios = async () => {
     setLoading(true);
     try {
       const response = await fetch(`${API_URL}/servicios/aleatorios`);
       const data = await response.json();
       if (data.success && data.servicios) {
         setServicios(data.servicios);
       } else {
         setServicios([]);
       }
     } catch (error) {
       console.error("Error al cargar servicios:", error);
     } finally {
       setLoading(false);
     }
   };

  // CAMBIO: 'buscarEmpleado' -> 'buscarServicio'
  const buscarServicio = async () => {
    if (!terminoBusqueda.trim()) {
      cargarServiciosAleatorios(); // Carga aleatorios si no hay término
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/servicios/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );
      const data = await response.json();
      if (!data.success || !data.servicios?.length) {
        setServicios([]);
        Alert.alert("Sin resultados", "No se encontró ningún servicio.");
        return;
      }
      setServicios(data.servicios);
    } catch (error) {
      console.error("Error al buscar servicio:", error);
      Alert.alert("Error", "No se pudo realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  // CAMBIO: 'seleccionarEmpleado' -> 'seleccionarServicio'
  const seleccionarServicio = async (s) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/servicios/consultar/${s.id_servicio || s.idServicio}`
      );
      const rawResponse = await response.text();
      const data = JSON.parse(rawResponse);

      if (data.success && data.servicio) {
        // 3. Usamos la función formateadora de servicio
        setServicioSeleccionado(formatearServicio(data.servicio));
      } else {
        Alert.alert("Error", "No se pudieron obtener los datos del servicio.");
      }
    } catch (error) {
      console.error("Error al obtener datos del servicio:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // CAMBIO: 'guardarCambios' (para Empleado) -> 'guardarCambios' (para Servicio)
  const guardarCambios = async () => {
    if (!servicioSeleccionado) {
      Alert.alert("Error", "Debe seleccionar un servicio primero.");
      return;
    }

    // Preparamos la data (trim() y parseFloat)
    const dataParaEnviar = {
      ...servicioSeleccionado,
      nombreServicio: (servicioSeleccionado.nombreServicio || "").trim(),
      descripcion: (servicioSeleccionado.descripcion || "").trim(),
      precio: parseFloat(servicioSeleccionado.precio) || 0,
      duracionEstimada: (servicioSeleccionado.duracionEstimada || "").trim(),
      notasInternas: (servicioSeleccionado.notasInternas || "").trim(),
      // El ID del responsable ya debe estar correcto por el picker
      idResponsable: servicioSeleccionado.idResponsable,
    };

    const id = dataParaEnviar.id_servicio;

    try {
      // 4. CAMBIO: Endpoint actualizado
      const response = await fetch(`${API_URL}/servicios/editar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar), // Enviamos la data "limpia"
      });

      const rawResponse = await response.text();
      const data = JSON.parse(rawResponse);

      if (data.success) {
        Alert.alert("Éxito", "Servicio actualizado correctamente.");
        setServicioSeleccionado(null);
        cargarServiciosAleatorios(); // Recargamos la lista
      } else {
        Alert.alert("Error", data.message || "No se pudieron guardar los cambios.");
      }
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      Alert.alert("Error de Servidor", "Error al guardar. Revisa la consola.");
    }
  };

  // CAMBIO: 'deseleccionarEmpleado' -> 'deseleccionarServicio'
  const deseleccionarServicio = () => {
    setServicioSeleccionado(null);
  };

  // CAMBIO: Retorno de valores adaptados
  return {
    terminoBusqueda,
    setTerminoBusqueda,
    servicios,
    servicioSeleccionado,
    setServicioSeleccionado,
    setServicioDesdeNavegacion,
    empleadosList, // <-- ¡LA COMBINACIÓN CLAVE!
    loading,
    buscarServicio,
    seleccionarServicio,
    guardarCambios,
    deseleccionarServicio,
  };
}
