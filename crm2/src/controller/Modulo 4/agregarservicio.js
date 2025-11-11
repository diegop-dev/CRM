import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config/apiConfig"; // Asumo que tienes esto

// CAMBIO: Función para crear un objeto de servicio vacío
// (Basado en los campos de serviciosform.js)
function crearServicioVacio() {
  return {
    id_servicio: "",
    nombreServicio: "",
    descripcion: "",
    categoria: "",
    precio: "",
    moneda: "",
    duracionEstimada: "",
    estado: "",
    idResponsable: "", // <-- ¡Importante!
    responsableNombre: "", // <-- ¡Importante!
    notasInternas: "",
  };
}

// CAMBIO: Renombrado a 'useAgregarServicioLogic'
export function useAgregarServicioLogic() {
  // CAMBIO: Estado para el objeto 'servicio'
  const [servicio, setServicio] = useState(crearServicioVacio());
  
  // (MANTENIDO) Estado para la lista de empleados (para el picker de responsable)
  const [empleadosList, setEmpleadosList] = useState([]);

  // --- EFECTO PARA CARGAR EMPLEADOS ---
  // (MANTENIDO) Se ejecuta una vez al cargar la pantalla
  useEffect(() => {
    async function fetchEmpleados() {
      try {
        const response = await fetch(`${API_URL}/empleados/todos`); // Asumiendo este endpoint
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

  // CAMBIO: Función genérica para actualizar el estado del 'servicio'
  const handleServicioChange = (key, value) => {
    setServicio(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  // CAMBIO: Función para guardar el 'servicio'
  const guardarNuevoServicio = async () => {
    // --- Validación simple ---
    if (!servicio.nombreServicio || !servicio.categoria || !servicio.estado || !servicio.precio) {
      Alert.alert("Campos incompletos", "Por favor, llene al menos Nombre, Categoría, Estado y Precio.");
      return;
    }

    // --- Preparar datos para el backend ---
    // (Lógica de fechas eliminada)

    const dataParaEnviar = {
      nombreServicio: servicio.nombreServicio.trim(),
      descripcion: servicio.descripcion.trim(),
      categoria: servicio.categoria,
      // Asegurarse de que el precio sea un número
      precio: parseFloat(servicio.precio) || 0,
      moneda: servicio.moneda,
      duracionEstimada: servicio.duracionEstimada.trim(),
      estado: servicio.estado,
      idResponsable: servicio.idResponsable, // Enviamos el ID
      // 'responsableNombre' no es necesario enviarlo, solo el ID
      notasInternas: servicio.notasInternas.trim(),
    };

    try {
      // CAMBIO: Llamamos a la nueva ruta del backend
      const response = await fetch(`${API_URL}/servicios/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        Alert.alert("Error al guardar", data.message || "No se pudo crear el servicio.");
      } else {
        Alert.alert("Éxito", "Servicio guardado correctamente.");
        // CAMBIO: Limpiamos el formulario de servicio
        setServicio(crearServicioVacio());
      }
    } catch (error) {
      console.error("Error al guardar servicio:", error);
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
    }
  };

  // CAMBIO: Retorno de valores
  return {
    servicio,
    empleadosList, // Pasamos la lista de empleados al formulario
    onChange: handleServicioChange,
    onGuardar: guardarNuevoServicio,
  };
}
