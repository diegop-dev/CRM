import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config/apiConfig"; // Asegúrate que la ruta sea correcta

export const useMenuLogic = () => {
  const navigation = useNavigation();
  const [permisosUsuario, setPermisosUsuario] = useState([]);
  const [loading, setLoading] = useState(false);

  // Opciones del menú (datos) CON SU CLAVE DE SEGURIDAD
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
    // Si agregas Facturas/Documentos al menú principal, asegúrate de darles una clave en la BD o dejarlas sin clave si son públicas
  ];

  // --- 1. CARGAR PERMISOS AL ENFOCAR EL MENÚ ---
  // Usamos useFocusEffect para que se actualicen los permisos si cambias de usuario y vuelves
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
            // Guardamos la lista de permisos en el estado
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

  // --- 2. FUNCIÓN DE NAVEGACIÓN CON SEGURIDAD ---
  const handleNavigation = useCallback(
    (item) => { // Ahora recibimos el objeto 'item' completo, no solo el nombre
      const { screen, moduleKey } = item;

      // A. Si el botón no tiene clave de seguridad, pasa directo (ej: botones libres)
      if (!moduleKey) {
        navigation.navigate(screen);
        return;
      }

      // B. Buscamos el permiso en la lista descargada
      const permisoEncontrado = permisosUsuario.find(p => p.clave_modulo === moduleKey);

      // C. Verificamos si existe y si está activo (1 / true)
      if (permisoEncontrado && permisoEncontrado.activo) {
        try {
          navigation.navigate(screen);
        } catch (error) {
          console.error("Error al navegar:", screen, error);
        }
      } else {
        // D. BLOQUEO DE SEGURIDAD
        Alert.alert(
          "Acceso Denegado 🔒",
          "No tienes permisos para acceder a este módulo. Contacta a tu administrador."
        );
      }
    },
    [navigation, permisosUsuario] // Depende de los permisos actuales
  );

  // --- Función de cierre de sesión ---
  const handleLogout = useCallback(async () => {
    try {
      await AsyncStorage.clear(); // Limpiamos sesión y permisos locales
      navigation.reset({
        index: 0,
        routes: [{ name: "InicioDeSesion" }],
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, [navigation]);

  return { menuItems, handleNavigation, handleLogout, loading };
};