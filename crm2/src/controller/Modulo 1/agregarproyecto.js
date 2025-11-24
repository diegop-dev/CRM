import { useState, useEffect } from "react";
// Eliminamos la importación de Alert porque ya no usaremos la nativa
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
    idResponsable: "", 
    estado: "",
    prioridad: "",
    RecursosList: [], 
  };
}

export function useAgregarProyectoLogic() {
  // Estado para el objeto proyecto
  const [proyecto, setProyecto] = useState(crearProyectoVacio());
  
  // Estado para la lista de empleados
  const [empleadosList, setEmpleadosList] = useState([]);

  // --- 1. NUEVO ESTADO PARA CONTROLAR EL MODAL DE FEEDBACK ---
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" // 'success', 'error', 'warning' (útil para cambiar colores en la vista si quisieras)
  });

  // Función auxiliar para mostrar el modal
  const showModal = (title, message, type = "info") => {
    setFeedbackModal({ visible: true, title, message, type });
  };

  // Función auxiliar para cerrar el modal
  const closeFeedbackModal = () => {
    setFeedbackModal((prev) => ({ ...prev, visible: false }));
  };

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
          // Reemplazo de Alert
          showModal("Error", data.message || "Error al cargar empleados.", "error");
        }
      } catch (error) {
        console.error("Error al cargar empleados:", error);
        // Reemplazo de Alert
        showModal("Error de Conexión", error.message, "error");
      }
    }
    fetchEmpleados();
  }, []); 

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
      // Reemplazo de Alert
      showModal("Campos incompletos", "Por favor, llene al menos Nombre, Responsable y Estado.", "warning");
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
      idResponsable: proyecto.idResponsable, 
      estado: proyecto.estado,
      prioridad: proyecto.prioridad,
      recursosAsignados: JSON.stringify(proyecto.RecursosList),
      descripcion: proyecto.descripcion.trim(),
    };

    try {
      const response = await fetch(`${API_URL}/proyectos/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        // Reemplazo de Alert
        showModal("Error al guardar", data.message || "No se pudo crear el proyecto.", "error");
      } else {
        // Reemplazo de Alert (ÉXITO)
        showModal("Éxito", "Proyecto guardado correctamente.", "success");
        // Limpiamos el formulario
        setProyecto(crearProyectoVacio());
      }
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
      // Reemplazo de Alert
      showModal("Error de Conexión", "No se pudo conectar con el servidor.", "error");
    }
  };

  return {
    proyecto,
    empleadosList, 
    onChange: handleProyectoChange,
    onGuardar: guardarNuevoProyecto,
    // Exportamos el estado y la función de cerrado para usarlos en la Vista (.jsx)
    feedbackModal,
    closeFeedbackModal
  };
}
