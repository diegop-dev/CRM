import { useState, useEffect } from "react";
// Eliminamos Alert
import { API_URL } from "../../../../config/apiConfig";

function formatearEmpleado(e) {
  if (!e) return null;
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
    contraseña: e.contraseña || "", 
    observaciones: (e.observaciones || "").trim(),
  };
}

export function useEditarEmpleadoLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [originalEmpleado, setOriginalEmpleado] = useState(null); 
  const [loading, setLoading] = useState(false);

  // --- NUEVO ESTADO PARA EL MODAL DE FEEDBACK ---
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info", // 'success', 'error', 'warning', 'question'
    onConfirm: null, 
  });

  // Helper para mostrar modal
  const showModal = (title, message, type = "info", onConfirmAction = null) => {
    setFeedbackModal({
      visible: true,
      title,
      message,
      type,
      onConfirm: onConfirmAction,
    });
  };

  // Helper para cerrar modal
  const closeFeedbackModal = () => {
    setFeedbackModal((prev) => ({ ...prev, visible: false, onConfirm: null }));
  };

  useEffect(() => {
    cargarEmpleadosAleatorios();
  }, []);

  const setEmpleadoDesdeNavegacion = (empleadoCrudo) => {
    const formateado = formatearEmpleado(empleadoCrudo);
    setEmpleadoSeleccionado(formateado);
    setOriginalEmpleado(formateado); 
  };

  const cargarEmpleadosAleatorios = async () => {
    setLoading(true);
    try {
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
      const response = await fetch(
        `${API_URL}/empleados/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );
      const data = await response.json();
      if (!data.success || !data.empleados?.length) {
        setEmpleados([]);
        showModal("Sin resultados", "No se encontró ningún empleado.", "warning");
        return;
      }
      setEmpleados(data.empleados);
    } catch (error) {
      console.error("Error al buscar empleado:", error);
      showModal("Error", "No se pudo realizar la búsqueda.", "error");
    } finally {
      setLoading(false);
    }
  };

  const seleccionarEmpleado = async (emp) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/empleados/${emp.id_empleado || emp.idEmpleado}`
      );

      const rawResponse = await response.text();
      if (rawResponse.trim().startsWith("<")) {
        throw new Error("El servidor devolvió un error inesperado (HTML).");
      }
      
      const data = JSON.parse(rawResponse);

      if (data.success && data.empleado) {
        const formateado = formatearEmpleado(data.empleado);
        setEmpleadoSeleccionado(formateado);
        setOriginalEmpleado(formateado);
      } else {
        showModal("Error", "No se pudieron obtener los datos del empleado.", "error");
      }
    } catch (error) {
      console.error("Error al obtener datos del empleado:", error);
      if (error.message.includes("JSON")) {
          showModal("Error de Ruta", "No se pudo cargar el empleado. Verifique las rutas del servidor.", "error");
      } else {
          showModal("Error", error.message || "No se pudo conectar con el servidor.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- 1. EJECUCIÓN FINAL DEL API ---
  const executeSave = async () => {
    closeFeedbackModal(); // Cerramos modal de confirmación

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
      const response = await fetch(`${API_URL}/empleados/${id}`, {
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
        showModal("Éxito", "Empleado actualizado correctamente.", "success");
        setEmpleadoSeleccionado(null);
        setOriginalEmpleado(null);
        cargarEmpleadosAleatorios();
      } else {
        showModal("Error", data.message || "No se pudieron guardar los cambios.", "error");
      }
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      showModal("Error de Servidor", error.message || "Error al guardar.", "error");
    }
  };

  // --- 2. PASO INTERMEDIO: Confirmar Guardado General ---
  const _proceedToSave = () => {
    closeFeedbackModal(); // Cerramos cualquier modal previo (ej. Credenciales)

    // Usamos setTimeout para dar tiempo visual a que cierre el anterior
    setTimeout(() => {
        showModal(
            "Confirmar Cambios",
            "¿Está seguro de que desea guardar los cambios realizados?",
            "question",
            executeSave // Acción si confirman
        );
    }, 200);
  };

  // --- 3. INICIO: Botón Guardar (Validaciones) ---
  const guardarCambios = async () => {
    if (!empleadoSeleccionado) {
      showModal("Error", "Debe seleccionar un empleado primero.", "warning");
      return;
    }

    // DETECTAR CAMBIOS SENSIBLES (Usuario o Contraseña)
    const usuarioCambio = empleadoSeleccionado.nombreUsuario !== originalEmpleado.nombreUsuario;
    const passCambio = (empleadoSeleccionado.contraseña !== originalEmpleado.contraseña) && (empleadoSeleccionado.contraseña !== "");

    if (usuarioCambio || passCambio) {
      let mensaje = "Ha modificado el ";
      if (usuarioCambio && passCambio) mensaje += "Nombre de Usuario y la Contraseña.";
      else if (usuarioCambio) mensaje += "Nombre de Usuario.";
      else if (passCambio) mensaje += "Contraseña.";
      
      // Modal de Advertencia de Credenciales
      showModal(
        "Cambio de Credenciales Detectado",
        `${mensaje}\n\n¿Está seguro de que desea cambiar estos datos de acceso?`,
        "warning",
        _proceedToSave // Si confirman, vamos al paso intermedio
      );
    } else {
      // Si no hay cambios sensibles, vamos directo al paso intermedio
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
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal
  };
}
