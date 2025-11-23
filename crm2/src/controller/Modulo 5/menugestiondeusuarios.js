import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config/apiConfig"; // Ajusta la ruta si es necesario

// Lógica separada del menú de Gestión de Usuarios
export const useMenuLogic = () => {
  const navigation = useNavigation();
  const [permisosUsuario, setPermisosUsuario] = useState([]);
  const [loading, setLoading] = useState(false);

  // Opciones del menú (datos)
  const menuItems = [
    {
      title: "Administradores",
      screen: "Administradores",
      image: require("../../../assets/icons/Generales/agregar.png"),
      
      moduleKey: "MOD_USUARIOS_ADMIN", 
    },
    {
      title: "Empleados",
      screen: "Empleados",
      image: require("../../../assets/icons/Generales/lapiz-regla.png"),
      
      moduleKey: "MOD_USUARIOS_EMP", 
    },
  ];

  // 1. CARGAR PERMISOS AL ENFOCAR EL SUB-MENÚ
  // Esto asegura que si le quitaste el permiso hace 1 segundo, aquí ya no lo deje pasar.
  useFocusEffect(
    useCallback(() => {
      const fetchPermisos = async () => {
        setLoading(true);
        try {
          const idUsuario = await AsyncStorage.getItem("id_usuario");
          if (!idUsuario) return;

          const response = await fetch(`${API_URL}/usuarios/${idUsuario}/permisos`);
          const data = await response.json();

          if (data.success) {
            setPermisosUsuario(data.permisos);
            // console.log("Permisos Submenú cargados:", data.permisos);
          }
        } catch (error) {
          console.error("Error al cargar permisos submenú:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPermisos();
    }, [])
  );

  // 2. FUNCIÓN DE NAVEGACIÓN SEGURA
  const handleNavigation = useCallback(
    (item) => { // Recibimos el objeto item completo
      const { screen, moduleKey } = item;

      // Validación de seguridad
      if (moduleKey) {
        const permiso = permisosUsuario.find(p => p.clave_modulo === moduleKey);
        
        // Si no existe el permiso o no está activo (1 o true), bloqueamos
        if (!permiso || (!permiso.activo && permiso.activo !== 1)) {
            Alert.alert(
                "Acceso Denegado 🔒", 
                "No tienes permisos para ver esta lista."
            );
            return;
        }
      }

      // Si pasa la validación, navegamos
      try {
        navigation.navigate(screen);
      } catch (error) {
        console.error("Error al navegar:", screen, error);
      }
    },
    [navigation, permisosUsuario]
  );

  return { menuItems, handleNavigation, loading };
};