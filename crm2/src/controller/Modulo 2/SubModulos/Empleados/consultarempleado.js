import { useState } from "react";
// Eliminamos Alert
import { API_URL } from "../../../../config/apiConfig";

// 1. FUNCIÓN FORMATEADORA (Se mantiene igual)
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
    contraseña: "", 
    observaciones: (e.observaciones || "").trim(),
  };
}

export function useConsultarEmpleadoLogic() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editable, setEditable] = useState(false);

  // --- NUEVO ESTADO PARA EL MODAL DE FEEDBACK ---
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info", // 'success', 'error', 'warning', 'question'
    onConfirm: null, 
  });

  // Función auxiliar para mostrar el modal
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

  const buscarEmpleado = async () => {
    if (!nombreUsuario.trim()) {
      showModal("Atención", "Ingrese un nombre de usuario para buscar.", "warning");
      return;
    }

    try {
      setLoading(true);
      
      const response = await fetch(
        `${API_URL}/empleados/buscarusuario?termino=${encodeURIComponent(nombreUsuario)}`
      );
      
      const data = await response.json();

      if (response.ok && data.success && data.empleado) {
        setEmpleado(formatearEmpleado(data.empleado));
        setEditable(false);
      } else {
        showModal("Sin resultados", data.message || "No se encontró ningún empleado con ese usuario.", "warning");
      }
    } catch (error) {
      console.error("Error:", error);
      showModal("Error", "No se pudo obtener el empleado.", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- LÓGICA DE CONFIRMACIÓN CON MODAL ---
  const confirmarEdicion = () => {
    // En lugar de Alert.alert, usamos showModal con tipo 'question' y un callback
    showModal(
      "Confirmar edición",
      "¿Desea editar la información de este empleado?",
      "question",
      () => {
        // Esta función se ejecuta si el usuario da click en "Confirmar"
        setEditable(true);
        closeFeedbackModal();
      }
    );
  };

  const deseleccionarEmpleado = () => {
    setEmpleado(null);
    setNombreUsuario("");
    setEditable(false);
  };

  return {
    nombreUsuario,
    setNombreUsuario,
    empleado,
    loading,
    editable,
    buscarEmpleado,
    confirmarEdicion,
    deseleccionarEmpleado,
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal
  };
}
