import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

// Lógica separada del menú de Gestión de Clientes
export const useMenuLogic = () => {
  const navigation = useNavigation();

  // Opciones del menú (datos)
  const menuItems = [
    {
      title: "Agregar Cliente",
      screen: "AgregarCliente",
      image: require("../../../assets/1.png"),
    },
    {
      title: "Editar Cliente",
      screen: "EditarCliente",
      image: require("../../../assets/1.png"),
    },
    {
      title: "Consultar Cliente",
      screen: "ConsultarCliente",
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
