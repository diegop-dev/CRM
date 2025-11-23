import { useState, useCallback } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config/apiConfig";
import { useUsuarioFormLogic } from "../../controller/Modulo 5/usuariosform"; // Reutilizamos la lógica del form

export function useAdministradoresLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  // Inicializamos la lógica del formulario pasándole el usuario seleccionado
  const formLogic = useUsuarioFormLogic(usuarioSeleccionado);

  // Buscar solo ADMINISTRADORES
  const buscarUsuarios = useCallback(async () => {
    if (!terminoBusqueda.trim()) {
      Alert.alert("Aviso", "Ingrese un nombre para buscar.");
      return;
    }

    setLoading(true);
    try {
      // Endpoint específico para buscar administradores
      const response = await fetch(`${API_URL}/usuarios/buscar?rol=admin&termino=${encodeURIComponent(terminoBusqueda)}`);
      const data = await response.json();

      if (data.success && data.usuarios.length > 0) {
        setListaUsuarios(data.usuarios);
      } else {
        setListaUsuarios([]);
        Alert.alert("Sin resultados", "No se encontraron administradores.");
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
    formLogic // Pasamos la lógica del formulario a la vista
  };
}