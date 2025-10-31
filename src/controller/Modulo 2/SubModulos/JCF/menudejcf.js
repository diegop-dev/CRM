import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

// Lógica separada del menú de JCF
export const useMenuLogic = () => {
  const navigation = useNavigation();

  // Opciones del menú (datos)
  const menuItems = [
    {
      title: "Agregar Becado",
      screen: "AgregarBecado",
      image: require("../../../../../assets/1.png"),
    },
    {
      title: "Editar Becado",
      screen: "EditarBecado",
      image: require("../../../../../assets/1.png"),
    },
    {
      title: "Consultar Becado",
      screen: "ConsultarBecado",
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
