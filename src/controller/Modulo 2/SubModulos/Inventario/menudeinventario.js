import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

// Lógica separada del menú de Inventario
export const useMenuLogic = () => {
  const navigation = useNavigation();

  // Opciones del menú (datos)
  const menuItems = [
    {
      title: "Agregar Artículo",
      screen: "AgregarArticulo",
      image: require("../../../../../assets/1.png"),
    },
    {
      title: "Editar Artículo",
      screen: "EditarArticulo",
      image: require("../../../../../assets/1.png"),
    },
    {
      title: "Consultar Artículo",
      screen: "ConsultarArticulo",
      image: require("../../../../../assets/1.png"),
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
