import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config/apiConfig"; // Ajusta esta ruta si es necesario

export function useEditarProyectoLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [proyecto, setProyecto] = useState(null); // El proyecto encontrado
  const [empleadosList, setEmpleadosList] = useState([]);
  const [proyectosRecientes, setProyectosRecientes] = useState([]); // <-- NUEVO ESTADO
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true); // <-- NUEVO (para carga inicial)

  // 1. Cargar datos iniciales (Empleados Y Proyectos Recientes)
  useEffect(() => {
    async function fetchDatosIniciales() {
      setIsInitialLoading(true); // Empezamos la carga inicial
      try {
        // Hacemos ambas peticiones al mismo tiempo
        const [empResponse, proyResponse] = await Promise.all([
          fetch(`${API_URL}/empleados/todos`),
          fetch(`${API_URL}/proyectos/recientes`) // <-- NUEVA PETICIÓN
        ]);

        const empData = await empResponse.json();
        const proyData = await proyResponse.json();

        if (empData.success) {
          setEmpleadosList(empData.empleados);
        } else {
          Alert.alert("Error", "No se pudo cargar la lista de empleados.");
        }

        if (proyData.success) {
          setProyectosRecientes(proyData.proyectos); // <-- GUARDAMOS RECIENTES
        } else {
          Alert.alert("Error", "No se pudo cargar los proyectos recientes.");
        }

      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        Alert.alert("Error de Conexión", "No se pudieron cargar los datos iniciales.");
      }
      setIsInitialLoading(false); // Terminamos la carga inicial
    }
    fetchDatosIniciales();
  }, []); // Se ejecuta solo una vez

  // 2. Función para BUSCAR un proyecto
  const handleBuscarProyecto = async (terminoOpcional) => {
    // Si recibimos un término (al hacer clic en un reciente), lo usamos.
    // Si no, usamos el de la barra de búsqueda.
    const termino = terminoOpcional || terminoBusqueda;

    if (!termino.trim()) {
      Alert.alert("Error", "Por favor, ingrese un nombre de proyecto para buscar.");
      return;
    }
    setIsLoading(true);
    setProyecto(null); // Limpiamos el proyecto anterior
    try {
      // Usamos el término validado
      const response = await fetch(`${API_URL}/proyectos/buscar?termino=${termino}`);
      const data = await response.json();

      if (data.success) {
        // Transformamos los datos del backend al formato que espera el formulario
        const p = data.proyecto;

        // a. Formatear fechas
        const [añoInicio, mesInicio, diaInicio] = (p.fecha_inicio || "T").split('T')[0].split('-');
        const [añoFin, mesFin, diaFin] = (p.fecha_fin || "T").split('T')[0].split('-');

        // b. Formatear recursos (de string JSON a array)
        let recursos = [];
        try {
          recursos = JSON.parse(p.recursos_asignados || '[]');
        } catch (e) {
          recursos = []; // Si el JSON está mal, lo dejamos vacío
        }

        // c. Asignar al estado
        setProyecto({
          id_proyecto: p.id_proyecto,
          nombreProyecto: p.nombre_proyecto,
          tipoProyecto: p.tipo_proyecto,
          diaInicio,
          mesInicio,
          añoInicio,
          diaFin,
          mesFin,
          añoFin,
          descripcion: p.descripcion,
          idResponsable: p.id_responsable,
          responsableNombre: p.responsable_nombre, // ¡Lo necesitamos del JOIN!
          estado: p.estado,
          prioridad: p.prioridad,
          RecursosList: recursos,
        });

      } else {
        Alert.alert("No Encontrado", data.message || "No se encontró el proyecto.");
      }
    } catch (error) {
      console.error("Error al buscar proyecto:", error);
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
    }
    setIsLoading(false);
  };

  // 3. Función para actualizar el estado del proyecto (igual que en agregar)
  const handleProyectoChange = (key, value) => {
    setProyecto(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  // 4. Función para ENVIAR la actualización (Editar)
  const handleEditarProyecto = async () => {
    if (!proyecto) return;

    // --- Mismas validaciones y preparación que en 'guardar' ---
    if (!proyecto.nombreProyecto || !proyecto.idResponsable || !proyecto.estado) {
      Alert.alert("Campos incompletos", "Nombre, Responsable y Estado son obligatorios.");
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
    // --- Fin de la preparación ---

    try {
      const response = await fetch(`${API_URL}/proyectos/editar/${proyecto.id_proyecto}`, { // <-- Ruta PUT
        method: "PUT", // <-- Método PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        Alert.alert("Error al editar", data.message || "No se pudo actualizar el proyecto.");
      } else {
        Alert.alert("Éxito", "Proyecto actualizado correctamente.");
      }
    } catch (error) {
      console.error("Error al editar proyecto:", error);
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
    }
  };

  // 5. Función para LIMPIAR el formulario y volver a la lista (NUEVO)
  const handleLimpiar = () => {
    setProyecto(null);
    setTerminoBusqueda("");
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    proyecto,
    empleadosList,
    proyectosRecientes, // <-- EXPORTAMOS LA NUEVA LISTA
    isLoading: isLoading || isInitialLoading, // <-- MOSTRAMOS LOADING INICIAL
    handleBuscarProyecto,
    onChange: handleProyectoChange,
    onGuardar: handleEditarProyecto,
    handleLimpiar, // <-- EXPORTAMOS LA NUEVA FUNCIÓN
  };
}
