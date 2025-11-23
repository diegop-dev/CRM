import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config/apiConfig"; 

// Función para crear un objeto de proyecto vacío
function crearProyectoVacio() {
  return {
    id_proyecto: "",
    nombreProyecto: "",
    tipoProyecto: "",
    diaInicio: "",
    mesInicio: "",
    añoInicio: "",
    diaFin: "",
    mesFin: "",
    añoFin: "",
    descripcion: "",
    idResponsable: "", //  Usamos idResponsable
    estado: "",
    prioridad: "",
    RecursosList: [], // Guardamos como array
  };
}

export function useAgregarProyectoLogic() {
  // Estado para el objeto proyecto
  const [proyecto, setProyecto] = useState(crearProyectoVacio());
  
  // Estado para la lista de empleados (para el picker de responsable)
  const [empleadosList, setEmpleadosList] = useState([]);

  // --- EFECTO PARA CARGAR EMPLEADOS ---
  // Se ejecuta una vez al cargar la pantalla
  useEffect(() => {
    async function fetchEmpleados() {
      try {
        // Usamos la ruta que ya creamos para Empleados
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

  // Función genérica para actualizar el estado del proyecto
  const handleProyectoChange = (key, value) => {
    setProyecto(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  // Función para guardar el proyecto
  const guardarNuevoProyecto = async () => {
    // --- Validación simple ---
    if (!proyecto.nombreProyecto || !proyecto.idResponsable || !proyecto.estado) {
      Alert.alert("Campos incompletos", "Por favor, llene al menos Nombre, Responsable y Estado.");
      return;
    }

    // --- Preparar datos para el backend ---
    const fechaInicio = proyecto.diaInicio && proyecto.mesInicio && proyecto.añoInicio
      ? `${proyecto.añoInicio}-${proyecto.mesInicio.padStart(2, "0")}-${proyecto.diaInicio.padStart(2, "0")}`
      : null; 

    const fechaFin = proyecto.diaFin && proyecto.mesFin && proyecto.añoFin
      ? `${proyecto.añoFin}-${proyecto.mesFin.padStart(2, "0")}-${proyecto.diaFin.padStart(2, "0")}`
      : null;

    const dataParaEnviar = {
      nombreProyecto: proyecto.nombreProyecto.trim(),
      tipoProyecto: proyecto.tipoProyecto,
      fechaInicio: fechaInicio,
      fechaFin: fechaFin,
      idResponsable: proyecto.idResponsable, // Enviamos el ID
      estado: proyecto.estado,
      prioridad: proyecto.prioridad,
      // Convertimos el array de recursos a un string JSON para guardarlo en el CRMDB
      recursosAsignados: JSON.stringify(proyecto.RecursosList),
      descripcion: proyecto.descripcion.trim(),
    };

    try {
      // Llamamos a la nueva ruta del backend
      const response = await fetch(`${API_URL}/proyectos/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        Alert.alert("Error al guardar", data.message || "No se pudo crear el proyecto.");
      } else {
        Alert.alert("Éxito", "Proyecto guardado correctamente.");
        // Limpiamos el formulario
        setProyecto(crearProyectoVacio());
      }
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
    }
  };

  return {
    proyecto,
    empleadosList, 
    onChange: handleProyectoChange,
    onGuardar: guardarNuevoProyecto,
  };
}
