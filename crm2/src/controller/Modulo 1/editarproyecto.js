import { useState, useEffect } from "react";
// Eliminamos Alert de react-native
import { API_URL } from "../../config/apiConfig"; 

// ACEPTAMOS EL PROYECTO INICIAL COMO PARÁMETRO
export function useEditarProyectoLogic(proyectoInicial = null) {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  
  // 1. SI NOS MANDAN UN PROYECTO, LO USAMOS DE INMEDIATO
  const [proyecto, setProyecto] = useState(proyectoInicial); 
  
  const [empleadosList, setEmpleadosList] = useState([]);
  const [proyectosRecientes, setProyectosRecientes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // --- NUEVO ESTADO PARA EL MODAL DE FEEDBACK ---
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info" // 'success', 'error', 'warning'
  });

  // Función auxiliar para mostrar el modal
  const showModal = (title, message, type = "info") => {
    setFeedbackModal({ visible: true, title, message, type });
  };

  // Función auxiliar para cerrar el modal
  const closeFeedbackModal = () => {
    setFeedbackModal((prev) => ({ ...prev, visible: false }));
  };

  // 2. CARGA DE DATOS (INTELIGENTE)
  useEffect(() => {
    async function fetchDatosIniciales() {
      setIsInitialLoading(true);
      try {
        // A. SIEMPRE cargamos los empleados
        const empResponse = await fetch(`${API_URL}/empleados/todos`);
        const empData = await empResponse.json();

        if (empData.success) {
          setEmpleadosList(empData.empleados);
        } else {
          showModal("Error", "No se pudo cargar la lista de empleados.", "error");
        }

        // B. SOLO cargamos "Proyectos Recientes" si NO venimos de "Consultar"
        if (!proyectoInicial) {
          const proyResponse = await fetch(`${API_URL}/proyectos/recientes`);
          const proyData = await proyResponse.json();
          if (proyData.success) {
            setProyectosRecientes(proyData.proyectos);
          }
        }

      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        showModal("Error de Conexión", "No se pudieron cargar los datos iniciales.", "error");
      }
      setIsInitialLoading(false);
    }
    fetchDatosIniciales();
  }, []); // Se ejecuta al montar

  // --- RESTO DE FUNCIONES ---

  const handleBuscarProyecto = async (terminoOpcional) => {
    const termino = terminoOpcional || terminoBusqueda;

    if (!termino.trim()) {
      showModal("Error", "Por favor, ingrese un nombre de proyecto para buscar.", "warning");
      return;
    }
    setIsLoading(true);
    setProyecto(null);
    try {
      const response = await fetch(`${API_URL}/proyectos/buscar?termino=${termino}`);
      const data = await response.json();

      if (data.success) {
        const p = data.proyecto;
        const [añoInicio, mesInicio, diaInicio] = (p.fecha_inicio || "T").split('T')[0].split('-');
        const [añoFin, mesFin, diaFin] = (p.fecha_fin || "T").split('T')[0].split('-');

        let recursos = [];
        try {
          recursos = JSON.parse(p.recursos_asignados || '[]');
        } catch (e) {
          recursos = [];
        }

        setProyecto({
          id_proyecto: p.id_proyecto,
          nombreProyecto: p.nombre_proyecto,
          tipoProyecto: p.tipo_proyecto,
          diaInicio, mesInicio, añoInicio,
          diaFin, mesFin, añoFin,
          descripcion: p.descripcion,
          idResponsable: p.id_responsable,
          responsableNombre: p.responsable_nombre,
          estado: p.estado,
          prioridad: p.prioridad,
          RecursosList: recursos,
        });

      } else {
        showModal("No Encontrado", data.message || "No se encontró el proyecto.", "warning");
      }
    } catch (error) {
      console.error("Error al buscar proyecto:", error);
      showModal("Error de Conexión", "No se pudo conectar con el servidor.", "error");
    }
    setIsLoading(false);
  };

  const handleProyectoChange = (key, value) => {
    setProyecto(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const handleEditarProyecto = async () => {
    if (!proyecto) return;

    if (!proyecto.nombreProyecto || !proyecto.idResponsable || !proyecto.estado) {
      showModal("Campos incompletos", "Nombre, Responsable y Estado son obligatorios.", "warning");
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
      descripcion: (proyecto.descripcion || "").trim(),
    };

    try {
      const response = await fetch(`${API_URL}/proyectos/editar/${proyecto.id_proyecto}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        showModal("Error al editar", data.message || "No se pudo actualizar el proyecto.", "error");
      } else {
        // MENSAJE DE ÉXITO
        showModal("Éxito", "Proyecto actualizado correctamente.", "success");
      }
    } catch (error) {
      console.error("Error al editar proyecto:", error);
      showModal("Error de Conexión", "No se pudo conectar con el servidor.", "error");
    }
  };

  const handleLimpiar = () => {
    setProyecto(null);
    setTerminoBusqueda("");
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    proyecto,
    empleadosList,
    proyectosRecientes,
    isLoading: isLoading || isInitialLoading,
    handleBuscarProyecto,
    onChange: handleProyectoChange,
    onGuardar: handleEditarProyecto,
    handleLimpiar,
    // Exportamos el estado del modal
    feedbackModal,
    closeFeedbackModal
  };
}
