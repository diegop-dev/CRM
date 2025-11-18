import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../../../config/apiConfig";

function formatearEmpleado(e) {
  if (!e) return null;
  // Separamos la fecha si viene en formato ISO
  const fecha = e.fecha_nacimiento ? e.fecha_nacimiento.split("T")[0].split("-") : ["", "", ""];
  
  return {
    id_empleado: e.id_empleado || e.idEmpleado,
    nombres: (e.nombres || "").trim(),
    apellidoPaterno: (e.apellido_paterno || "").trim(),
    apellidoMaterno: (e.apellido_materno || "").trim(),
    diaNacimiento: fecha[2] || "",
    mesNacimiento: fecha[1] || "",
    añoNacimiento: fecha[0] || "",
    sexo: (e.sexo || "").trim(),
    rfc: (e.rfc || "").trim(),
    curp: (e.curp || "").trim(),
    nss: (e.nss || "").trim(),
    telefono: (e.telefono || "").trim(),
    correoElectronico: (e.correo_electronico || "").trim(),
    calle: (e.calle || "").trim(),
    colonia: (e.colonia || "").trim(),
    ciudad: (e.ciudad || "").trim(),
    estado: (e.estado || "").trim(),
    codigoPostal: (e.codigo_postal || "").trim(),
    rol: (e.rol || "").trim(),
    estadoEmpleado: (e.estado_empleado || "").trim(),
    nombreUsuario: (e.nombre_usuario || "").trim(),
    contraseña: e.contraseña || "", // La contraseña se deja intacta (puede estar vacía)
    observaciones: (e.observaciones || "").trim(),
  };
}

export function useEditarEmpleadoLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [originalEmpleado, setOriginalEmpleado] = useState(null); 
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarEmpleadosAleatorios();
  }, []);

  // Se llama cuando viene desde la pantalla de navegación
  const setEmpleadoDesdeNavegacion = (empleadoCrudo) => {
    const formateado = formatearEmpleado(empleadoCrudo);
    setEmpleadoSeleccionado(formateado);
    setOriginalEmpleado(formateado); // Guardamos copia de seguridad
  };

  const cargarEmpleadosAleatorios = async () => {
    setLoading(true);
    try {
      // Esta ruta (GET /empleados/aleatorios) es correcta
      const response = await fetch(`${API_URL}/empleados/aleatorios`);
      const data = await response.json();
      if (data.success && data.empleados) {
        setEmpleados(data.empleados);
      } else {
        setEmpleados([]);
      }
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    } finally {
      setLoading(false);
    }
  };

  const buscarEmpleado = async () => {
    if (!terminoBusqueda.trim()) {
      cargarEmpleadosAleatorios();
      return;
    }
    setLoading(true);
    try {
      // Esta ruta (GET /empleados/buscar?termino=...) es correcta
      const response = await fetch(
        `${API_URL}/empleados/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );
      const data = await response.json();
      if (!data.success || !data.empleados?.length) {
        setEmpleados([]);
        Alert.alert("Sin resultados", "No se encontró ningún empleado.");
        return;
      }
      setEmpleados(data.empleados);
    } catch (error) {
      console.error("Error al buscar empleado:", error);
      Alert.alert("Error", "No se pudo realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  const seleccionarEmpleado = async (emp) => {
    setLoading(true);
    try {
      // --- CAMBIO INICIA ---
      // Ruta antigua: /empleados/consultar/:id
      // Ruta NUEVA: /empleados/:id
      const response = await fetch(
        `${API_URL}/empleados/${emp.id_empleado || emp.idEmpleado}`
      );
      // --- CAMBIO TERMINA ---

      const rawResponse = await response.text();
      // Verificamos si la respuesta es HTML (un error)
      if (rawResponse.trim().startsWith("<")) {
        throw new Error("El servidor devolvió un error inesperado (HTML).");
      }
      
      const data = JSON.parse(rawResponse);

      if (data.success && data.empleado) {
        const formateado = formatearEmpleado(data.empleado);
        setEmpleadoSeleccionado(formateado);
        setOriginalEmpleado(formateado); // Guardamos copia de seguridad al seleccionar
      } else {
        Alert.alert("Error", "No se pudieron obtener los datos del empleado.");
      }
    } catch (error) {
      console.error("Error al obtener datos del empleado:", error);
      // Mostramos el error original de JSON si existe
      if (error.message.includes("JSON")) {
          Alert.alert("Error de Ruta", "No se pudo cargar el empleado. Verifique las rutas del servidor.");
      } else {
          Alert.alert("Error", error.message || "No se pudo conectar con el servidor.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- FUNCIÓN INTERNA QUE EJECUTA EL GUARDADO ---
  const _proceedToSave = async () => {
    Alert.alert(
      "Confirmar Cambios",
      "¿Está seguro de que desea guardar los cambios realizados?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Guardar",
          onPress: async () => {
            // Preparar datos limpios
            const dataParaEnviar = {
              ...empleadoSeleccionado,
              rfc: (empleadoSeleccionado.rfc || "").trim(),
              curp: (empleadoSeleccionado.curp || "").trim(),
              nss: (empleadoSeleccionado.nss || "").trim(),
              nombres: (empleadoSeleccionado.nombres || "").trim(),
              apellidoPaterno: (empleadoSeleccionado.apellidoPaterno || "").trim(),
              apellidoMaterno: (empleadoSeleccionado.apellidoMaterno || "").trim(),
            };

            const id = dataParaEnviar.id_empleado;

            try {
              // --- CAMBIO INICIA ---
              // Ruta antigua: /empleados/editar/:id
              // Ruta NUEVA: /empleados/:id
              const response = await fetch(`${API_URL}/empleados/${id}`, {
              // --- CAMBIO TERMINA ---
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataParaEnviar),
              });

              const rawResponse = await response.text();
              if (rawResponse.trim().startsWith("<")) {
                throw new Error("El servidor devolvió un error inesperado (HTML).");
              }
      
              const data = JSON.parse(rawResponse);

              if (data.success) {
                Alert.alert("Éxito", "Empleado actualizado correctamente.");
                setEmpleadoSeleccionado(null);
                setOriginalEmpleado(null);
                cargarEmpleadosAleatorios();
              } else {
                Alert.alert("Error", data.message || "No se pudieron guardar los cambios.");
              }
            } catch (error) {
              console.error("Error al guardar cambios:", error);
              Alert.alert("Error de Servidor", error.message || "Error al guardar.");
            }
          }
        }
      ]
    );
  };

  // --- FUNCIÓN PRINCIPAL GUARDAR ---
  const guardarCambios = async () => {
    if (!empleadoSeleccionado) {
      Alert.alert("Error", "Debe seleccionar un empleado primero.");
      return;
    }

    // DETECTAR CAMBIOS SENSIBLES (Usuario o Contraseña)
    const usuarioCambio = empleadoSeleccionado.nombreUsuario !== originalEmpleado.nombreUsuario;
    
    // Comparamos si la contraseña actual es diferente de la original
    // O si la original estaba vacía y la actual ahora tiene algo
    const passCambio = (empleadoSeleccionado.contraseña !== originalEmpleado.contraseña) && (empleadoSeleccionado.contraseña !== "");


    if (usuarioCambio || passCambio) {
      // Si hubo cambios sensibles, mostramos alerta de seguridad primero
      let mensaje = "Ha modificado el ";
      if (usuarioCambio && passCambio) mensaje += "Nombre de Usuario y la Contraseña.";
      else if (usuarioCambio) mensaje += "Nombre de Usuario.";
      else if (passCambio) mensaje += "Contraseña.";
      
      Alert.alert(
        "Cambio de Credenciales Detectado",
        `${mensaje}\n\n¿Está seguro de que desea cambiar estos datos de acceso?`,
        [
          { text: "Cancelar", style: "cancel" },
          { 
            text: "Confirmar Cambio", 
            onPress: () => _proceedToSave() // Si confirma, procedemos a la alerta final de guardado
          }
        ]
      );
    } else {
      // Si no hay cambios sensibles, procedemos directo a la alerta final
      _proceedToSave();
    }
  };

  const deseleccionarEmpleado = () => {
    setEmpleadoSeleccionado(null);
    setOriginalEmpleado(null);
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    empleados,
    empleadoSeleccionado,
    setEmpleadoSeleccionado,
    setEmpleadoDesdeNavegacion,
    loading,
    buscarEmpleado,
    seleccionarEmpleado,
    guardarCambios,
    deseleccionarEmpleado,
  };
}