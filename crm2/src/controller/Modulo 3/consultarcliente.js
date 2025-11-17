import { useState } from "react";
// import { Alert } from "react-native"; // <-- Eliminamos Alert
import { API_URL } from "../../config/apiConfig";

// (Tu función 'formatearCliente' no cambia)
function formatearCliente(c) {
  if (!c) return null;
  return {
    id_cliente: c.id_cliente || c.idCliente,
    nombreCliente: (c.nombre_cliente || "").trim(),
    apellidoPaterno: (c.apellido_paterno || "").trim(),
    apellidoMaterno: (c.apellido_materno || "").trim(),
    tipoCliente: (c.tipo_cliente || "").trim(),
    estadoCliente: (c.estado_cliente || "").trim(),
    sexo: (c.sexo || "").trim(),
    correoElectronico: (c.correo_electronico || "").trim(),
    telefono: (c.telefono || "").trim(),
    calle: (c.calle || "").trim(),
    colonia: (c.colonia || "").trim(),
    ciudad: (c.ciudad || "").trim(),
    estado: (c.estado || "").trim(),
    pais: (c.pais || "").trim(),
    codigoPostal: (c.codigo_postal || "").trim(),
    descripcion: (c.descripcion || "").trim(),
  };
}

export function useConsultarClienteLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // --- NUEVO: Estado para el modal de alerta ---
  const [modalInfo, setModalInfo] = useState({ visible: false, title: "", message: "" });

  const buscarCliente = async () => {
    if (!terminoBusqueda.trim()) {
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ visible: true, title: "Atención", message: "Ingrese un nombre de cliente para buscar." });
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/clientes/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );

      const data = await response.json();
      const clienteEncontrado = data.cliente || (data.clientes && data.clientes[0]);

      if (response.ok && data.success && clienteEncontrado) {
        setCliente(formatearCliente(clienteEncontrado));
      } else {
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ visible: true, title: "Sin resultados", message: data.message || "No se encontró ningún cliente con ese nombre." });
      }
    } catch (error) {
      console.error("Error:", error);
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ visible: true, title: "Error", message: "No se pudo obtener el cliente." });
    } finally {
      setLoading(false);
    }
  };

  const deseleccionarCliente = () => {
    setCliente(null);
    setTerminoBusqueda(""); 
  };

  // --- NUEVO: Función para cerrar el modal ---
  const closeModal = () => {
    setModalInfo({ visible: false, title: "", message: "" });
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    cliente,
    loading,
    editable: false, 
    buscarCliente,
    deseleccionarCliente,
    modalInfo, // <-- Exportamos el estado del modal
    closeModal, // <-- Exportamos la función de cierre
  };
}