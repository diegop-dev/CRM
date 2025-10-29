import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

// Lógica separada del menú de Documentos
export const useMenuLogic = () => {
  const navigation = useNavigation();

  // Opciones del menú (datos)
  const menuItems = [
    {
      title: "Agregar Documento",
      screen: "AgregarDocumento",
      image: require("../../../../../assets/1.png"),
    },
    {
      title: "Editar Documento",
      screen: "EditarDocumento",
      image: require("../../../../../assets/1.png"),
    },
    {
      title: "Consultar Documento",
      screen: "ConsultarDocumento",
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
