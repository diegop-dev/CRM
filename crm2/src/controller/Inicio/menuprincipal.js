import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
// Eliminamos Alert
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config/apiConfig"; 

export const useMenuLogic = () => {
  const navigation = useNavigation();
  const [permisosUsuario, setPermisosUsuario] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- NUEVO ESTADO PARA EL MODAL DE FEEDBACK (Acceso Denegado / Errores) ---
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info", // 'success', 'error', 'warning'
    onConfirm: null,
  });

  // Función auxiliar para mostrar el modal
  const showModal = (title, message, type = "info") => {
    setFeedbackModal({
      visible: true,
      title,
      message,
      type,
      onConfirm: null,
    });
  };

  // Función auxiliar para cerrar el modal
  const closeFeedbackModal = () => {
    setFeedbackModal((prev) => ({ ...prev, visible: false }));
  };

  // Opciones del menú
  const menuItems = [
    {
      title: "Gestión de Proyectos",
      screen: "MenuGestionDeProyectos",
      image: require("../../../assets/icons/Modulo 1/equipo-de-documentos.png"),
      moduleKey: "MOD_PROYECTOS", 
    },
    {
      title: "Gestión de RRHH",
      screen: "MenuGestionDeRecursosHumanos",
      image: require("../../../assets/icons/Modulo 2/apreton-de-manos.png"),
      moduleKey: "MOD_RRHH",
    },
    {
      title: "Gestión de Clientes",
      screen: "MenuGestionDeClientes",
      image: require("../../../assets/icons/Modulo 3/reir.png"),
      moduleKey: "MOD_CLIENTES",
    },
    {
      title: "Gestión de Servicios",
      screen: "MenuGestionDeServicios",
      image: require("../../../assets/icons/Modulo 4/tienda.png"),
      moduleKey: "MOD_SERVICIOS",
    },
    {
      title: "Gestión de Usuarios",
      screen: "MenuGestionDeUsuarios",
      image: require("../../../assets/icons/Modulo 5/usuarios.png"),
      moduleKey: "MOD_USUARIOS",
    },
  ];

  // --- 1. CARGAR PERMISOS ---
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
          console.error("Error al cargar permisos:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPermisos();
    }, [])
  );

  // --- 2. NAVEGACIÓN CON SEGURIDAD ---
  const handleNavigation = useCallback(
    (item) => { 
      const { screen, moduleKey } = item;

      // A. Si no tiene clave, pasa directo
      if (!moduleKey) {
        navigation.navigate(screen);
        return;
      }

      // B. Buscamos permiso
      const permisoEncontrado = permisosUsuario.find(p => p.clave_modulo === moduleKey);

      // C. Verificamos
      if (permisoEncontrado && permisoEncontrado.activo) {
        try {
          navigation.navigate(screen);
        } catch (error) {
          console.error("Error al navegar:", screen, error);
        }
      } else {
        // D. BLOQUEO DE SEGURIDAD (Usando Modal en vez de Alert)
        showModal(
          "Acceso Denegado 🔒",
          "No tienes permisos para acceder a este módulo. Contacta a tu administrador.",
          "error"
        );
      }
    },
    [navigation, permisosUsuario]
  );

  // --- CIERRE DE SESIÓN ---
  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.clear(); 
      navigation.reset({
        index: 0,
        routes: [{ name: "InicioDeSesion" }],
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, [navigation]);

  return { 
      menuItems, 
      handleNavigation, 
      handleLogout, 
      loading,
      // Exportamos el modal para la Vista
      feedbackModal,
      closeFeedbackModal
  };
};
