import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

// Lógica separada del menú de Gestión de Recursos Humanos
export const useMenuLogic = () => {
  const navigation = useNavigation();

  // Opciones del menú (datos)
  const menuItems = [
    {
      title: "Empleados",
      screen: "MenuDeEmpleados",
      image: require("../../../assets/1.png"),
    },
    {
      title: "JCF",
      screen: "MenuDeJCF",
      image: require("../../../assets/1.png"),
    },
    {
      title: "Inventario",
      screen: "MenuDeInventario",
      image: require("../../../assets/1.png"),
    },
    {
      title: "Facturas",
      screen: "MenuDeFacturas",
      image: require("../../../assets/1.png"),
    },
    {
      title: "Documentos",
      screen: "MenuDeDocumentos",
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
