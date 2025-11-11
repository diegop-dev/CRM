import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

// Lógica separada del menú de Empleados
export const useMenuLogic = () => {
  const navigation = useNavigation();

  // Opciones del menú (datos)
  const menuItems = [
    {
      title: "Agregar Empleado",
      screen: "AgregarEmpleado",
      image: require("../../../../../assets/icons/Generales/agregar.png"),
    },
    {
      title: "Editar Empleado",
      screen: "EditarEmpleado",
      image: require("../../../../../assets/icons/Generales/lapiz-regla.png"),
    },
    {
      title: "Consultar Empleado",
      screen: "ConsultarEmpleado",
      image: require("../../../../../assets/icons/Generales/lupa.png"),
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
