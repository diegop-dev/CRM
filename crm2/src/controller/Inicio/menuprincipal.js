import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

export const useMenuLogic = () => {
  const navigation = useNavigation();

  // Opciones del menú (datos)
  const menuItems = [
    {
      title: "Gestión de Proyectos",
      screen: "MenuGestionDeProyectos",
      image: require("../../../assets/icons/Modulo 1/equipo-de-documentos.png"),
    },
    {
      title: "Gestión de RRHH",
      screen: "MenuGestionDeRecursosHumanos",
      image: require("../../../assets/icons/Modulo 2/apreton-de-manos.png"),
    },
    {
      title: "Gestión de Clientes",
      screen: "MenuGestionDeClientes",
      image: require("../../../assets/icons/Modulo 3/reir.png"),
    },
    {
      title: "Gestión de Servicios",
      screen: "MenuGestionDeServicios",
      image: require("../../../assets/icons/Modulo 4/tienda.png"),
    },
    {
      title: "Gestión de Usuarios",
      screen: "MenuGestionDeUsuarios",
      image: require("../../../assets/icons/Modulo 5/usuarios.png"),
    },
  ];

  // --- Función de navegación a pantallas ---
  const handleNavigation = useCallback(
    (screenName) => {
      try {
        navigation.navigate(screenName);
      } catch (error) {
        console.error("Error al navegar:", screenName, error);
      }
    },
    [navigation]
  );

  // --- Función de cierre de sesión ---
  const handleLogout = useCallback(() => {
    try {
      navigation.replace("InicioDeSesion"); 
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }, [navigation]);

  return { menuItems, handleNavigation, handleLogout };
};
