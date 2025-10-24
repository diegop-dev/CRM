import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

export const useMenuLogic = () => {
  const navigation = useNavigation();

  // Opciones del menú (datos)
  const menuItems = [
    { title: "Gestión de Proyectos", screen: "MenuGestionDeProyectos" },
    {
      title: "Gestión de Recursos Humanos",
      screen: "MenuGestionDeRecursosHumanos",
    },
    { title: "Gestión de Clientes", screen: "MenuGestionDeClientes" },
    { title: "Gestión de Servicios", screen: "MenuGestionDeServicios" },
    { title: "Gestión de Usuarios", screen: "MenuGestiondeusuarios" },
  ];

  // Función de navegación
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

  return { menuItems, handleNavigation };
};
