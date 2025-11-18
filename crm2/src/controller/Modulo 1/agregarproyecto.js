import { useState, useEffect } from "react";
// import { Alert } from "react-native"; // <-- Eliminamos Alert
import { API_URL } from "../../config/apiConfig"; 

// (crearProyectoVacio no cambia)
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
    responsableNombre: "", // <-- Importante añadir este (si no estaba)
    estado: "",
    prioridad: "",
    RecursosList: [], 
  };
}

export function useAgregarProyectoLogic() {
  const [proyecto, setProyecto] = useState(crearProyectoVacio());
  const [empleadosList, setEmpleadosList] = useState([]);
  
  // --- NUEVO: Estado para el modal de alerta ---
  const [modalInfo, setModalInfo] = useState({ visible: false, title: "", message: "" });

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
          // --- CAMBIO: Usamos el modal ---
          setModalInfo({ visible: true, title: "Error", message: data.message || "Error al cargar empleados." });
        }
      } catch (error) {
        console.error("Error al cargar empleados:", error);
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ visible: true, title: "Error de Conexión", message: error.message });
      }
    }
    fetchEmpleados();
  }, []); 

  const handleProyectoChange = (key, value) => {
    setProyecto(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const guardarNuevoProyecto = async () => {
    if (!proyecto.nombreProyecto || !proyecto.idResponsable || !proyecto.estado) {
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ 
        visible: true, 
        title: "Campos incompletos", 
        message: "Por favor, llene al menos Nombre, Responsable y Estado." 
      });
      return;
    }

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
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ 
          visible: true, 
          title: "Error al guardar", 
          message: data.message || "No se pudo crear el proyecto."
        });
      } else {
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ 
          visible: true, 
          title: "Éxito", 
          message: "Proyecto guardado correctamente."
        });
        setProyecto(crearProyectoVacio());
      }
    } catch (error) {
      console.error("Error al guardar proyecto:", error);
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ 
        visible: true, 
        title: "Error de Conexión", 
        message: "No se pudo conectar con el servidor."
      });
    }
  };

  // --- NUEVO: Función para cerrar el modal ---
  const closeModal = () => {
    setModalInfo({ visible: false, title: "", message: "" });
  };

  return {
    proyecto,
    empleadosList,
    onChange: handleProyectoChange,
    onGuardar: guardarNuevoProyecto,
    modalInfo, // <-- Exportamos el estado del modal
    closeModal, // <-- Exportamos la función de cierre
  };
}