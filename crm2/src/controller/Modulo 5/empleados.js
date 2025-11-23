import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config/apiConfig";
import { useUsuarioFormLogic } from "../../controller/Modulo 5/usuariosform"; 

export function useEmpleadosLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  // Inicializamos la lógica del formulario pasándole el usuario seleccionado
  const formLogic = useUsuarioFormLogic(usuarioSeleccionado);

  // Buscar solo EMPLEADOS
  const buscarUsuarios = useCallback(async () => {
    if (!terminoBusqueda.trim()) {
      Alert.alert("Aviso", "Ingrese un nombre para buscar.");
      return;
    }

    setLoading(true);
    try {
      // CAMBIO IMPORTANTE: rol=empleado
      const response = await fetch(`${API_URL}/usuarios/buscar?rol=empleado&termino=${encodeURIComponent(terminoBusqueda)}`);
      const data = await response.json();

      if (data.success && data.usuarios.length > 0) {
        setListaUsuarios(data.usuarios);
      } else {
        setListaUsuarios([]);
        Alert.alert("Sin resultados", "No se encontraron empleados.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Fallo de conexión.");
    } finally {
      setLoading(false);
    }
  }, [terminoBusqueda]);

  const seleccionarUsuario = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setListaUsuarios([]); // Limpiar lista para enfocar en el form
  };

  const deseleccionarUsuario = () => {
    setUsuarioSeleccionado(null);
    setTerminoBusqueda("");
  };

  return {
    terminoBusqueda, setTerminoBusqueda,
    listaUsuarios, usuarioSeleccionado,
    loading,
    buscarUsuarios, seleccionarUsuario, deseleccionarUsuario,
    formLogic 
  };
}