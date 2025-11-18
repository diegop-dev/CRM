import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config/apiConfig"; // Ajusta esta ruta

// Nota: No necesitamos 'formatear' mucho, solo asegurar los campos
function formatearUsuario(u) {
  if (!u) return null;
  return {
    id_usuario: u.id_usuario, // Asumiendo que este es el ID
    nombre_completo: `${u.nombres || ''} ${u.apellido_paterno || ''}`.trim(),
    nombre_usuario: u.nombre_usuario,
    // (Añadiremos los permisos después)
  };
}

export function useAdministradoresLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [usuarios, setUsuarios] = useState([]); // Lista de usuarios encontrados
  const [loading, setLoading] = useState(false);
  
  // Modal para errores
  const [modalInfo, setModalInfo] = useState({ visible: false, title: "", message: "" });

  // Carga inicial de usuarios
  useEffect(() => {
    buscarUsuarios();
  }, []);

  const buscarUsuarios = async () => {
    setLoading(true);
    try {
      // Buscamos usuarios POR ROL y opcionalmente por TÉRMINO
      const response = await fetch(
        `${API_URL}/usuarios/buscar?rol=Administrador&termino=${encodeURIComponent(terminoBusqueda)}`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setUsuarios(data.usuarios.map(formatearUsuario)); // Formateamos cada usuario
      } else {
        setModalInfo({ visible: true, title: "Error", message: data.message || "No se encontraron usuarios." });
        setUsuarios([]);
      }
    } catch (error) {
      console.error("Error:", error);
      setModalInfo({ visible: true, title: "Error de Conexión", message: "No se pudo conectar al servidor." });
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    setModalInfo({ visible: false, title: "", message: "" });
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    usuarios,
    loading,
    buscarUsuarios,
    modalInfo,
    closeModal,
  };
}