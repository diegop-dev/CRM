import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config/apiConfig";

// --- INICIO DE LA ACTUALIZACIÓN ---
// 1. CAMBIO: Renombrado a 'formatearServicio'
// (Campos adaptados de 'formatearEmpleado' a los de servicio)
function formatearServicio(s) {
  if (!s) return null;

  // --- Lógica de Fecha Eliminada ---

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
// --- FIN DE LA ACTUALIZACIÓN ---


// CAMBIO: Renombrado a 'useConsultarServicioLogic'
export function useConsultarServicioLogic() {
  // CAMBIO: 'nombreUsuario' -> 'terminoBusqueda'
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  // CAMBIO: 'empleado' -> 'servicio'
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // (Eliminados 'editable' y 'confirmarEdicion' porque la vista los maneja)

  // --- ¡AÑADIDO CLAVE! ---
  // (Necesario para el dropdown de Responsable en 'ServiciosFormView')
  const [empleadosList, setEmpleadosList] = useState([]);

  // --- EFECTO PARA CARGAR EMPLEADOS ---
  // (Se ejecuta una vez al cargar la pantalla)
  useEffect(() => {
    async function fetchEmpleados() {
      // No seteamos 'loading' aquí para no interferir con la búsqueda principal
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


  // CAMBIO: 'buscarEmpleado' -> 'buscarServicio'
  const buscarServicio = async () => {
    // CAMBIO: 'nombreUsuario' -> 'terminoBusqueda'
    if (!terminoBusqueda.trim()) {
      Alert.alert("Atención", "Ingrese un nombre de servicio para buscar.");
      return;
    }

    try {
      setLoading(true);
      // CAMBIO: Endpoint actualizado para buscar servicio por nombre (término)
      const response = await fetch(
        `${API_URL}/servicios/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );

      const data = await response.json();

      // Asumimos que la búsqueda devuelve el primer resultado
      const servicioEncontrado = data.servicio || (data.servicios && data.servicios[0]);

      if (response.ok && data.success && servicioEncontrado) {
        // --- INICIO DE LA ACTUALIZACIÓN ---
        // 2. Usamos la función formateadora de servicio
        setServicio(formatearServicio(servicioEncontrado)); // <-- ¡CAMBIO CLAVE!
        // --- FIN DE LA ACTUALIZACIÓN ---
      } else {
        // CAMBIO: Mensaje actualizado
        Alert.alert("Sin resultados", data.message || "No se encontró ningún servicio con ese nombre.");
      }
    } catch (error) {
      console.error("Error:", error);
      // CAMBIO: Mensaje actualizado
      Alert.alert("Error", "No se pudo obtener el servicio.");
    } finally {
      setLoading(false);
    }
  };

  // (confirmarEdicion eliminada)

  // CAMBIO: 'deseleccionarEmpleado' -> 'deseleccionarServicio'
  const deseleccionarServicio = () => {
   setServicio(null);
   setTerminoBusqueda(""); // 'setNombreUsuario' -> 'setTerminoBusqueda'
  };

  // CAMBIO: Retorno de valores adaptados
  return {
    terminoBusqueda,
    setTerminoBusqueda,
    servicio,
    empleadosList, // <-- ¡CLAVE! Se retorna la lista de empleados
    loading,
    editable: false, // Se mantiene 'false' por si el FormView lo necesita
    buscarServicio,
    deseleccionarServicio,
  };
}
