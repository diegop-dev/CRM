// src/Pantallas_Backend/Menu/menuprincipal.js
import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

// Lógica separada del menú principal
export const useMenuLogic = () => {
  const navigation = useNavigation();

  // Opciones del menú (datos)
  const menuItems = [
    { title: "Agregar Proyecto", screen: "AgregarProyecto" },
    { title: "Editar Proyecto", screen: "EditarProyecto" },
    { title: "Consultar Proyecto", screen: "ConsultarProyecto" },
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
