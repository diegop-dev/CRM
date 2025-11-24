import { useState, useEffect, useCallback } from "react";
// Eliminamos Alert
import { API_URL } from "../../config/apiConfig"; 

export function useUsuarioFormLogic(initialUsuario) {
  
  const usuario = initialUsuario || {}; 

  // Estados iniciales
  const [idUsuario, setIdUsuario] = useState(usuario.id_usuario || null);
  const [nombreUsuario, setNombreUsuario] = useState(usuario.nombre_usuario || "");
  const [contraseña, setContraseña] = useState(""); 
  const [idRol, setIdRol] = useState(usuario.id_rol || "");
  
  const [idEmpleado, setIdEmpleado] = useState(usuario.id_empleado || "");
  const nombreCompleto = usuario.nombres ? `${usuario.nombres} ${usuario.apellido_paterno}` : "";
  const [nombreEmpleado, setNombreEmpleado] = useState(nombreCompleto);

  // --- PERMISOS ---
  const [listaPermisos, setListaPermisos] = useState([]);
  const [loadingPermisos, setLoadingPermisos] = useState(false);

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

  // 1. Sincronizar datos
  useEffect(() => {
    if (initialUsuario) {
        setIdUsuario(initialUsuario.id_usuario);
        setNombreUsuario(initialUsuario.nombre_usuario);
        setIdRol(initialUsuario.id_rol);
        setIdEmpleado(initialUsuario.id_empleado);
        setNombreEmpleado(initialUsuario.nombres ? `${initialUsuario.nombres} ${initialUsuario.apellido_paterno}` : "");
        setContraseña(""); 
    } else {
        setIdUsuario(null);
        setNombreUsuario("");
        setNombreEmpleado("");
        setIdRol("");
        setIdEmpleado("");
        setListaPermisos([]);
    }
  }, [initialUsuario]);

  // 2. Cargar permisos
  useEffect(() => {
    const fetchPermisos = async () => {
      setLoadingPermisos(true);
      try {
        const endpoint = idUsuario 
          ? `${API_URL}/usuarios/${idUsuario}/permisos`
          : `${API_URL}/usuarios/catalogo-permisos`;

        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.success) {
          setListaPermisos(data.permisos);
        } else {
           console.error("Error data permisos:", data.message);
           // Opcional: showModal("Error", "No se pudieron cargar los permisos.", "error");
        }
      } catch (error) {
        console.error("Error permisos:", error);
        setListaPermisos([]); 
      } finally {
        setLoadingPermisos(false);
      }
    };

    if (idUsuario || !initialUsuario) {
        fetchPermisos();
    }
  }, [idUsuario]);

  // 3. Toggle Switch
  const togglePermiso = useCallback((idModulo) => {
    setListaPermisos(prev => prev.map(item => 
        item.id_modulo === idModulo ? { ...item, activo: !item.activo } : item
    ));
  }, []);

  // --- LÓGICA DE GUARDADO (API) ---
  const executeSave = async () => {
      closeFeedbackModal(); // Cerramos pregunta

      const permisosActivosIds = listaPermisos
        .filter(p => p.activo)
        .map(p => p.id_modulo);

      try {
        const response = await fetch(`${API_URL}/usuarios/actualizar-permisos`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_usuario: idUsuario,
                permisos: permisosActivosIds 
            })
        });

        const data = await response.json();

        if (data.success) {
            showModal("Éxito", "Permisos actualizados correctamente.", "success");
        } else {
            showModal("Error", data.message || "No se pudieron guardar los cambios.", "error");
        }

      } catch (error) {
        console.error(error);
        showModal("Error", "Fallo de conexión con el servidor.", "error");
      }
  };

  // 4. Función GUARDAR CAMBIOS (Confirmación)
  const guardarCambios = async () => {
    if (!idUsuario) {
        showModal("Error", "No hay un usuario seleccionado para guardar.", "warning");
        return;
    }

    showModal(
        "Confirmar Cambios",
        "¿Está seguro de que desea actualizar los permisos de este usuario?",
        "question",
        executeSave
    );
  };

  // 5. Retorno
  return {
    nombreUsuario, setNombreUsuario,
    contraseña, setContraseña,
    idRol, setIdRol,
    idEmpleado, setIdEmpleado,
    nombreEmpleado, setNombreEmpleado,
    
    listaPermisos,
    togglePermiso,
    loadingPermisos,

    guardarCambios,
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal
  };
}
