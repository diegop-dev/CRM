import { useState } from "react";
// Eliminamos Alert
import { API_URL } from "../../../../config/apiConfig";

function crearEmpleadoVacio() {
  const e = {};
  return {
    id_empleado: "",
    nombres: (e.nombres || "").trim(),
    apellidoPaterno: (e.apellido_paterno || "").trim(),
    apellidoMaterno: (e.apellido_materno || "").trim(),
    diaNacimiento: "",
    mesNacimiento: "",
    añoNacimiento: "",
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

export function useAgregarEmpleadoLogic() {
  const [empleado, setEmpleado] = useState(crearEmpleadoVacio());

  // --- NUEVO ESTADO PARA EL MODAL DE FEEDBACK ---
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info", // 'success', 'error', 'warning', 'question'
    onConfirm: null, // Guardaremos la función a ejecutar si el usuario confirma
  });

  // Función auxiliar para mostrar el modal
  // Si pasamos un onConfirm, el modal mostrará botones de "Cancelar" y "Confirmar"
  const showModal = (title, message, type = "info", onConfirmAction = null) => {
    setFeedbackModal({
      visible: true,
      title,
      message,
      type,
      onConfirm: onConfirmAction,
    });
  };

  // Función auxiliar para cerrar el modal
  const closeFeedbackModal = () => {
    setFeedbackModal((prev) => ({ ...prev, visible: false, onConfirm: null }));
  };

  const handleEmpleadoChange = (key, value) => {
    setEmpleado(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  // --- LÓGICA DE GUARDADO (API) ---
  // Esta función se ejecutará SOLO cuando el usuario confirme el último modal
  const executeSave = async () => {
    // Cerramos el modal de confirmación previo
    closeFeedbackModal();

    const dataParaEnviar = {
      ...empleado,
      nombres: empleado.nombres.trim(),
      apellidoPaterno: empleado.apellidoPaterno.trim(),
      apellidoMaterno: empleado.apellidoMaterno.trim(),
      nombreUsuario: empleado.nombreUsuario.trim(),
    };

    try {
      const response = await fetch(`${API_URL}/empleados`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        showModal("Error al guardar", data.message || "No se pudo crear el empleado.", "error");
      } else {
        showModal("Éxito", "Empleado guardado correctamente.", "success");
        setEmpleado(crearEmpleadoVacio());
      }
    } catch (error) {
      console.error("Error al guardar empleado:", error);
      showModal("Error de Conexión", "No se pudo conectar con el servidor.", "error");
    }
  };

  // --- PASO INTERMEDIO: Confirmar Guardado ---
  const _proceedToSave = () => {
    // Cerramos cualquier modal previo (como el de credenciales)
    closeFeedbackModal();
    
    // Mostramos el modal de pregunta final
    // Pasamos executeSave como la acción a realizar si dicen "Sí"
    setTimeout(() => {
        showModal(
            "Confirmar Guardado",
            "¿Está seguro de que desea guardar este nuevo empleado?",
            "question", 
            executeSave 
        );
    }, 200); // Pequeño delay para evitar parpadeos si venimos de otro modal
  };

  // --- FUNCIÓN PRINCIPAL DEL BOTÓN ---
  const guardarNuevoEmpleado = async () => {
    // 1. Validación básica
    if (!empleado.nombres || !empleado.apellidoPaterno) {
      showModal("Campos incompletos", "Por favor, llene al menos Nombres y Apellido Paterno.", "warning");
      return;
    }

    // 2. Validación de Credenciales
    if (empleado.nombreUsuario || empleado.contraseña) {
      // Mostramos modal de pregunta
      // Pasamos _proceedToSave como la acción si dicen "Confirmar"
      showModal(
        "Confirmar Credenciales",
        "Ha ingresado un Nombre de Usuario y/o Contraseña.\n\n¿Está seguro de que estos datos son correctos?",
        "warning",
        _proceedToSave 
      );
    } else {
      // Si no hay credenciales, pasamos directo a la confirmación de guardado
      _proceedToSave();
    }
  };

  return {
    empleado,
    onChange: handleEmpleadoChange,
    onGuardar: guardarNuevoEmpleado,
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal
  };
}
