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
      image: require("../../../../../assets/1.png"),
    },
    {
      title: "Editar Factura",
      screen: "EditarFactura",
      image: require("../../../../../assets/1.png"),
    },
    {
      title: "Consultar Factura",
      screen: "ConsultarFactura",
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
