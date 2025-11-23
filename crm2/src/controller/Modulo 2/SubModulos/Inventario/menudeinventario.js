import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

// Lógica separada del menú de Inventario
export const useMenuLogic = () => {
  const navigation = useNavigation();

  // Opciones del menú (datos)
  const menuItems = [
    {
      title: "Agregar Producto",
      screen: "AgregarProducto",
      image: require("../../../../../assets/icons/Generales/agregar.png"),
    },
    {
      title: "Editar Producto",
      screen: "EditarProducto",
      image: require("../../../../../assets/icons/Generales/lapiz-regla.png"),
    },
    {
      title: "Consultar Producto",
      screen: "ConsultarProducto",
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
