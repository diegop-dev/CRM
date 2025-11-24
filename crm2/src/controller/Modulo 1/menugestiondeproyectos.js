import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

// Lógica separada del menú de Gestión de Proyectos
export const useMenuLogic = () => {
  const navigation = useNavigation();

  // Opciones del menú (datos)
  const menuItems = [
    {
      title: "Agregar Proyecto",
      screen: "AgregarProyecto",
      image: require("../../../assets/icons/Generales/agregar.png"),
    },
    {
      title: "Editar Proyecto",
      screen: "EditarProyecto",
      image: require("../../../assets/icons/Generales/lapiz-regla.png"),
    },
    {
      title: "Consultar Proyecto",
      screen: "ConsultarProyecto",
      image: require("../../../assets/icons/Generales/lupa.png"),
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
