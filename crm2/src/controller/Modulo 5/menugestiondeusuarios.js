import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
// Eliminamos Alert
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config/apiConfig"; 

export const useMenuLogic = () => {
  const navigation = useNavigation();
  const [permisosUsuario, setPermisosUsuario] = useState([]);
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

  // Opciones del menú (datos)
  const menuItems = [
    {
      title: "Administradores",
      screen: "Administradores",
      image: require("../../../assets/icons/Generales/agregar.png"),
      moduleKey: "MOD_USUARIOS_ADMIN", 
    },
    {
      title: "Empleados",
      screen: "Empleados",
      image: require("../../../assets/icons/Generales/lapiz-regla.png"),
      moduleKey: "MOD_USUARIOS_EMP", 
    },
  ];

  // 1. CARGAR PERMISOS AL ENFOCAR EL SUB-MENÚ
  useFocusEffect(
    useCallback(() => {
      const fetchPermisos = async () => {
        setLoading(true);
        try {
          const idUsuario = await AsyncStorage.getItem("id_usuario");
          if (!idUsuario) return;

          const response = await fetch(`${API_URL}/usuarios/${idUsuario}/permisos`);
          const data = await response.json();

          if (data.success) {
            setPermisosUsuario(data.permisos);
          }
        } catch (error) {
          console.error("Error al cargar permisos submenú:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPermisos();
    }, [])
  );

  // 2. FUNCIÓN DE NAVEGACIÓN SEGURA
  const handleNavigation = useCallback(
    (item) => { 
      const { screen, moduleKey } = item;

      // Validación de seguridad
      if (moduleKey) {
        const permiso = permisosUsuario.find(p => p.clave_modulo === moduleKey);
        
        // Si no existe el permiso o no está activo, bloqueamos con Modal
        if (!permiso || (!permiso.activo && permiso.activo !== 1)) {
            showModal(
                "Acceso Denegado 🔒", 
                "No tienes permisos para ver esta lista.",
                "error"
            );
            return;
        }
      }

      // Si pasa la validación, navegamos
      try {
        navigation.navigate(screen);
      } catch (error) {
        console.error("Error al navegar:", screen, error);
      }
    },
    [navigation, permisosUsuario]
  );

  return { 
      menuItems, 
      handleNavigation, 
      loading,
      // Exportamos el modal
      feedbackModal,
      closeFeedbackModal
  };
};
