import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

// Lógica separada del menú de Gestión de Usuarios
export const useMenuLogic = () => {
  const navigation = useNavigation();

  // Opciones del menú (datos)
  const menuItems = [
    {
      title: "Administradores",
      screen: "Administradores",
      image: require("../../../assets/1.png"),
    },
    {
      title: "Empleados",
      screen: "Empleados",
      image: require("../../../assets/1.png"),
    },
    {
      title: "...",
      screen: "",
      image: require("../../../assets/1.png"),
    },
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
