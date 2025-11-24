import { useState } from "react";
// Eliminamos Alert
import { API_URL } from "../../config/apiConfig"; 

// Función para crear un objeto cliente limpio
function crearClienteVacio() {
  return {
    nombreCliente: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    tipoCliente: "",
    estadoCliente: "",
    sexo: "",
    correoElectronico: "",
    telefono: "",
    calle: "",
    colonia: "",
    ciudad: "",
    estado: "",
    pais: "",
    codigoPostal: "",
    descripcion: "",
  };
}

export function useAgregarClienteLogic() {
  const [cliente, setCliente] = useState(crearClienteVacio());

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

  // Función para actualizar el estado del cliente
  const handleClienteChange = (key, value) => {
    setCliente(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  // --- LÓGICA DE GUARDADO (API) ---
  const executeSave = async () => {
    closeFeedbackModal(); // Cerramos la pregunta

    // Preparar datos (limpiar espacios extra)
    const dataParaEnviar = {
      ...cliente,
      nombreCliente: cliente.nombreCliente.trim(),
      apellidoPaterno: cliente.apellidoPaterno.trim(),
      apellidoMaterno: cliente.apellidoMaterno.trim(),
      correoElectronico: cliente.correoElectronico.trim(),
      telefono: cliente.telefono.trim(),
      calle: cliente.calle.trim(),
      colonia: cliente.colonia.trim(),
      ciudad: cliente.ciudad.trim(),
      estado: cliente.estado.trim(),
      pais: cliente.pais.trim(),
      codigoPostal: cliente.codigoPostal.trim(),
      descripcion: cliente.descripcion.trim(),
    };

    try {
      // Enviar al backend
      const response = await fetch(`${API_URL}/clientes/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        showModal("Error al guardar", data.message || "No se pudo crear el cliente.", "error");
      } else {
        showModal("Éxito", "Cliente guardado correctamente.", "success");
        // Limpiamos el formulario después de guardar
        setCliente(crearClienteVacio());
      }
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      showModal("Error de Conexión", "No se pudo conectar con el servidor.", "error");
    }
  };

  // --- FUNCIÓN PRINCIPAL (Validación + Pregunta) ---
  const guardarNuevoCliente = async () => {
    // 1. Validación básica
    if (!cliente.nombreCliente || !cliente.tipoCliente || !cliente.estadoCliente) {
      showModal("Campos incompletos", "Por favor, llene al menos Nombre, Tipo y Estado del Cliente.", "warning");
      return;
    }
    
    // 2. Pregunta de confirmación
    showModal(
        "Confirmar Guardado",
        "¿Está seguro de que desea guardar este nuevo cliente?",
        "question",
        executeSave
    );
  };

  return {
    cliente,
    onChange: handleClienteChange,
    onGuardar: guardarNuevoCliente,
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal
  };
}
