import { useState } from "react";
// import { Alert } from "react-native"; // <-- Eliminamos Alert
import { API_URL } from "../../config/apiConfig";

// (Tu función 'crearClienteVacio' no cambia)
function crearClienteVacio() {
  const c = {}; 
  return {
    idCliente: "",
    nombreCliente: (c.nombreCliente || "").trim(),
    apellidoPaterno: (c.apellidoPaterno || "").trim(),
    apellidoMaterno: (c.apellidoMaterno || "").trim(),
    tipoCliente: (c.tipoCliente || "").trim(),
    estadoCliente: (c.estadoCliente || "").trim(),
    sexo: (c.sexo || "").trim(),
    correoElectronico: (c.correoElectronico || "").trim(),
    telefono: (c.telefono || "").trim(),
    calle: (c.calle || "").trim(),
    colonia: (c.colonia || "").trim(),
    ciudad: (c.ciudad || "").trim(),
    estado: (c.estado || "").trim(),
    pais: (c.pais || "").trim(),
    codigoPostal: (c.codigoPostal || "").trim(),
    descripcion: (c.descripcion || "").trim(),
  };
}

export function useAgregarClienteLogic() {
  const [cliente, setCliente] = useState(crearClienteVacio());
  
  // --- NUEVO: Estado para el modal de alerta ---
  const [modalInfo, setModalInfo] = useState({ visible: false, title: "", message: "" });

  const handleClienteChange = (key, value) => {
    setCliente(prevState => ({
      ...prevState,
      [key]: value   
    }));
  };

  const guardarNuevoCliente = async () => {

    if (!cliente.nombreCliente || !cliente.tipoCliente || !cliente.estadoCliente) {
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ 
        visible: true, 
        title: "Campos incompletos", 
        message: "Por favor, llene al menos Nombre, Tipo y Estado del Cliente." 
      });
      return;
    }
    
    const dataParaEnviar = {
      ...cliente,
      nombreCliente: cliente.nombreCliente.trim(),
      apellidoPaterno: cliente.apellidoPaterno.trim(),
      apellidoMaterno: cliente.apellidoMaterno.trim(),
      correoElectronico: cliente.correoElectronico.trim(),
      calle: cliente.calle.trim(),
      colonia: cliente.colonia.trim(),
      ciudad: cliente.ciudad.trim(),
      estado: cliente.estado.trim(),
      pais: cliente.pais.trim(),
    };

    try {
      const response = await fetch(`${API_URL}/clientes/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ 
          visible: true, 
          title: "Error al guardar", 
          message: data.message || "No se pudo crear el cliente."
        });
      } else {
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ 
          visible: true, 
          title: "Éxito", 
          message: "Cliente guardado correctamente."
        });
        setCliente(crearClienteVacio());
      }
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ 
        visible: true, 
        title: "Error de Conexión", 
        message: "No se pudo conectar con el servidor."
      });
    }
  };

  // --- NUEVO: Función para cerrar el modal ---
  const closeModal = () => {
    setModalInfo({ visible: false, title: "", message: "" });
  };

  return {
    cliente,
    onChange: handleClienteChange,
    onGuardar: guardarNuevoCliente,
    modalInfo, // <-- Exportamos el estado del modal
    closeModal, // <-- Exportamos la función de cierre
  };
}