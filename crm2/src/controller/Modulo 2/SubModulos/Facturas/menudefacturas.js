import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";

// Lógica separada del menú de Facturas
export const useMenuLogic = () => {
  const navigation = useNavigation();

  // Opciones del menú (datos)
  const menuItems = [
    {
      title: "Agregar Factura",
      screen: "AgregarFactura",
      image: require("../../../../../assets/icons/Generales/agregar.png"),
    },
    {
      title: "Editar Factura",
      screen: "EditarFactura",
      image: require("../../../../../assets/icons/Generales/lapiz-regla.png"),
    },
    {
      title: "Consultar Factura",
      screen: "ConsultarFactura",
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
