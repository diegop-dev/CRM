import { useState, useEffect } from "react";

import { Alert } from "react-native";

import { API_URL } from "../../config/apiConfig"; 



// Esta es la lógica "inteligente" para la pantalla de CONSULTAR

export function useConsultarProyectoLogic(navigation) { 
  const [terminoBusqueda, setTerminoBusqueda] = useState("");

  const [proyecto, setProyecto] = useState(null); 

  const [empleadosList, setEmpleadosList] = useState([]);

  const [proyectosAleatorios, setProyectosAleatorios] = useState([]); 

  const [isLoading, setIsLoading] = useState(false);

  const [isInitialLoading, setIsInitialLoading] = useState(true); 







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

          Alert.alert("Error", "No se pudo cargar la lista de empleados.");

        }



        if (proyData.success) {

          setProyectosAleatorios(proyData.proyectos); 

        } else {

          Alert.alert("Error", "No se pudo cargar los proyectos sugeridos.");

        }



      } catch (error) {

        console.error("Error al cargar datos iniciales:", error);

        Alert.alert("Error de Conexión", "No se pudieron cargar los datos iniciales.");

      }

      setIsInitialLoading(false); // Terminamos la carga inicial

    }

    fetchDatosIniciales();

  }, []); // El array vacío asegura que solo se ejecute una vez







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

      const response = await fetch(`${API_URL}/proyectos/buscar?termino=${termino}`);

      const data = await response.json();



      if (data.success) {

        // Transformamos los datos del backend al formato que espera el formulario

        const p = data.proyecto;



        // a. Formatear fechas (corregido para T y -)

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

        Alert.alert("No Encontrado", data.message || "No se encontró el proyecto.");

      }

    } catch (error) {

      console.error("Error al buscar proyecto:", error);

      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");

    }

    setIsLoading(false);

  };





  // 3. Función para actualizar el estado del proyecto (no se usa en "consultar", pero se pasa)

  const handleProyectoChange = (key, value) => {

    // En modo consulta, no hacemos nada, pero la prop debe existir

  };



  // 4. Función para LIMPIAR la búsqueda y volver a la lista

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

  };

}