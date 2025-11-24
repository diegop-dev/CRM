import { useState, useCallback } from "react";
// Eliminamos Alert
import { API_URL } from "../../config/apiConfig";
import { useUsuarioFormLogic } from "../../controller/Modulo 5/usuariosform"; 

export function useEmpleadosLogic() {
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
  const formLogic = useUsuarioFormLogic(usuarioSeleccionado);

  // Buscar solo EMPLEADOS
  const buscarUsuarios = useCallback(async () => {
    if (!terminoBusqueda.trim()) {
      showModal("Aviso", "Ingrese un nombre para buscar.", "warning");
      return;
    }

    setLoading(true);
    try {
      // CAMBIO IMPORTANTE: rol=empleado
      const response = await fetch(`${API_URL}/usuarios/buscar?rol=empleado&termino=${encodeURIComponent(terminoBusqueda)}`);
      const data = await response.json();

      if (data.success && data.usuarios.length > 0) {
        setListaUsuarios(data.usuarios);
      } else {
        setListaUsuarios([]);
        showModal("Sin resultados", "No se encontraron empleados con ese nombre.", "info");
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
    formLogic,
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal
  };
}
