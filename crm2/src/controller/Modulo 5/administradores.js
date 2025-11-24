import { useState, useCallback } from "react";
// Eliminamos Alert
import { API_URL } from "../../config/apiConfig";
import { useUsuarioFormLogic } from "../../controller/Modulo 5/usuariosform"; 

export function useAdministradoresLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

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

  // Inicializamos la lógica del formulario pasándole el usuario seleccionado
  // Nota: Si useUsuarioFormLogic usa Alerts internamente, también debería adaptarse, 
  // pero aquí nos enfocamos en la lógica de este controlador.
  const formLogic = useUsuarioFormLogic(usuarioSeleccionado);

  // Buscar solo ADMINISTRADORES
  const buscarUsuarios = useCallback(async () => {
    if (!terminoBusqueda.trim()) {
      showModal("Aviso", "Ingrese un nombre para buscar.", "warning");
      return;
    }

    setLoading(true);
    try {
      // Endpoint específico para buscar administradores
      const response = await fetch(`${API_URL}/usuarios/buscar?rol=admin&termino=${encodeURIComponent(terminoBusqueda)}`);
      const data = await response.json();

      if (data.success && data.usuarios.length > 0) {
        setListaUsuarios(data.usuarios);
      } else {
        setListaUsuarios([]);
        showModal("Sin resultados", "No se encontraron administradores con ese criterio.", "info");
      }
    } catch (error) {
      console.error(error);
      showModal("Error", "Fallo de conexión con el servidor.", "error");
    } finally {
      setLoading(false);
    }
  }, [terminoBusqueda]);

  const seleccionarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setListaUsuarios([]); // Limpiar lista para enfocar en el form
  };

  const deseleccionarUsuario = () => {
    setUsuarioSeleccionado(null);
    setTerminoBusqueda("");
  };

  return {
    terminoBusqueda, setTerminoBusqueda,
    listaUsuarios, usuarioSeleccionado,
    loading,
    buscarUsuarios, seleccionarUsuario, deseleccionarUsuario,
    formLogic, // Pasamos la lógica del formulario a la vista
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal
  };
}
