import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

// Lógica separada del menú de Gestión de Servicios
export const useMenuLogic = () => {
  const navigation = useNavigation();

  // Opciones del menú (datos)
  const menuItems = [
    {
      title: "Agregar Servicio",
      screen: "AgregarServicio",
      image: require("../../../assets/icons/Generales/agregar.png"),
    },
    {
      title: "Editar Servicio",
      screen: "EditarServicio",
      image: require("../../../assets/icons/Generales/lapiz-regla.png"),
    },
    {
      title: "Consultar Servicio",
      screen: "ConsultarServicio",
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
