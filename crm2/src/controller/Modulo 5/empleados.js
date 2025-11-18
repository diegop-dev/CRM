import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config/apiConfig"; // Ajusta esta ruta

// (La función de formateo es la misma)
function formatearUsuario(u) {
  if (!u) return null;
  return {
    id_usuario: u.id_usuario, 
    nombre_completo: `${u.nombres || ''} ${u.apellido_paterno || ''}`.trim(),
    nombre_usuario: u.nombre_usuario,
  };
}

export function useEmpleadosLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [usuarios, setUsuarios] = useState([]); 
  const [loading, setLoading] = useState(false);
  const [modalInfo, setModalInfo] = useState({ visible: false, title: "", message: "" });

  // Carga inicial de usuarios
  useEffect(() => {
    buscarUsuarios();
  }, []);

  const buscarUsuarios = async () => {
    setLoading(true);
    try {
      // --- ¡CAMBIO CLAVE! ---
      // Buscamos usuarios POR ROL "Empleado"
      const response = await fetch(
        `${API_URL}/usuarios/buscar?rol=Empleado&termino=${encodeURIComponent(terminoBusqueda)}`
      );
      const data = await response.json();

      if (response.ok && data.success) {
        setUsuarios(data.usuarios.map(formatearUsuario)); 
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