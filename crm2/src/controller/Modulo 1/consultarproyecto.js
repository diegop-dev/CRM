import { useState, useEffect } from "react";
// Eliminamos Alert de react-native
import { API_URL } from "../../config/apiConfig"; 

export function useConsultarProyectoLogic(navigation) { 
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [proyecto, setProyecto] = useState(null); 
  const [empleadosList, setEmpleadosList] = useState([]);
  const [proyectosAleatorios, setProyectosAleatorios] = useState([]); 
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

  // 1. Cargar datos iniciales (Empleados Y Proyectos Aleatorios)
  useEffect(() => {
    async function fetchDatosIniciales() {
      setIsInitialLoading(true);
      try {
        // Hacemos ambas peticiones al mismo tiempo
        const [empResponse, proyResponse] = await Promise.all([
          fetch(`${API_URL}/empleados/todos`),
          fetch(`${API_URL}/proyectos/aleatorios`) 
        ]);

        const empData = await empResponse.json();
        const proyData = await proyResponse.json();

        if (empData.success) {
          setEmpleadosList(empData.empleados);
        } else {
          showModal("Error", "No se pudo cargar la lista de empleados.", "error");
        }

        if (proyData.success) {
          setProyectosAleatorios(proyData.proyectos); 
        } else {
          showModal("Error", "No se pudo cargar los proyectos sugeridos.", "error");
        }

      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        showModal("Error de Conexión", "No se pudieron cargar los datos iniciales.", "error");
      }
      setIsInitialLoading(false); // Terminamos la carga inicial
    }
    fetchDatosIniciales();
  }, []); 

  // 2. Función para BUSCAR un proyecto
  const handleBuscarProyecto = async (terminoOpcional) => {
    // Si recibimos un término (al hacer clic en un reciente), lo usamos.
    const termino = terminoOpcional || terminoBusqueda;

    if (!termino.trim()) {
      showModal("Error", "Por favor, ingrese un nombre de proyecto para buscar.", "warning");
      return;
    }
    setIsLoading(true);
    setProyecto(null); // Limpiamos el proyecto anterior
    try {
      const response = await fetch(`${API_URL}/proyectos/buscar?termino=${termino}`);
      const data = await response.json();

      if (data.success) {
        const p = data.proyecto;

        // a. Formatear fechas 
        const [añoInicio, mesInicio, diaInicio] = (p.fecha_inicio || "T").split('T')[0].split('-');
        const [añoFin, mesFin, diaFin] = (p.fecha_fin || "T").split('T')[0].split('-');

        // b. Formatear recursos 
        let recursos = [];
        try {
          recursos = JSON.parse(p.recursos_asignados || '[]');
        } catch (e) {
          recursos = []; 
        }

        // c. Asignar al estado
        setProyecto({
          id_proyecto: p.id_proyecto,
          nombreProyecto: p.nombre_proyecto,
          tipoProyecto: p.tipo_proyecto,
          diaInicio: diaInicio || "", 
          mesInicio: mesInicio || "",
          añoInicio: añoInicio || "",
          diaFin: diaFin || "",
          mesFin: mesFin || "",
          añoFin: añoFin || "",
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

  // 3. Función dummy para evitar errores
  const handleProyectoChange = (key, value) => {
    // En modo consulta no hacemos nada
  };

  // 4. Función para LIMPIAR la búsqueda
  const handleLimpiarBusqueda = () => {
    setProyecto(null);
    setTerminoBusqueda("");
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    proyecto,
    empleadosList,
    proyectosAleatorios, 
    isLoading,
    isInitialLoading,   
    handleBuscarProyecto,
    handleLimpiarBusqueda, 
    onChange: handleProyectoChange,
    // Exportamos el modal para que la vista lo consuma
    feedbackModal,
    closeFeedbackModal
  };
}
