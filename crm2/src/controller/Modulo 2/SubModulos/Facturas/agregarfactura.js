import { useState, useEffect } from "react";
// import { Alert } from "react-native"; // <-- Eliminamos Alert
import { API_URL } from "../../../../config/apiConfig";
// (Función crearFacturaVacia no cambia)
function crearFacturaVacia() {
  return {
    id_factura: "", 
    numeroFolio: "",
    diaEmision: "",
    mesEmision: "",
    añoEmision: "",
    idCliente: "", 
    clienteNombre: "", 
    montoTotal: "",
    metodoPago: "",
    responsableRegistro: "", 
  };
}

export function useAgregarFacturaLogic() {
  const [factura, setFactura] = useState(crearFacturaVacia());
  const [clientesList, setClientesList] = useState([]);
  
  // --- NUEVO: Estado para el modal de alerta ---
  const [modalInfo, setModalInfo] = useState({ visible: false, title: "", message: "" });

  // --- EFECTO PARA CARGAR CLIENTES ---
  useEffect(() => {
    async function fetchClientes() {
      try {
        const response = await fetch(`${API_URL}/clientes/todos`); 
        if (!response.ok) {
          throw new Error("No se pudo cargar la lista de clientes");
        }
        const data = await response.json();
        if (data.success) {
          setClientesList(data.clientes); 
        } else {
          // --- CAMBIO: Usamos el modal ---
          setModalInfo({ visible: true, title: "Error", message: data.message || "Error al cargar clientes." });
        }
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ visible: true, title: "Error de Conexión", message: error.message });
      }
    }
    fetchClientes();
  }, []); 

  const handleFacturaChange = (key, value) => {
    setFactura(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  const guardarNuevaFactura = async () => {
    if (!factura.numeroFolio || !factura.idCliente || !factura.montoTotal || !factura.metodoPago) {
      // --- CAMBIO: Usamos el modal ---
      setModalInfo({ 
        visible: true, 
        title: "Campos incompletos", 
        message: "Por favor, llene Folio, Cliente, Monto y Método de Pago." 
      });
      return;
    }

    const fechaEmision = factura.diaEmision && factura.mesEmision && factura.añoEmision
      ? `${factura.añoEmision}-${factura.mesEmision.padStart(2, "0")}-${factura.diaEmision.padStart(2, "0")}`
      : null;

    const dataParaEnviar = {
      numeroFolio: factura.numeroFolio,
      fechaEmision: fechaEmision,
      idCliente: factura.idCliente,
      montoTotal: parseFloat(factura.montoTotal) || 0, 
      metodoPago: factura.metodoPago,
      responsableRegistro: factura.responsableRegistro.trim(),
    };

    try {
      const response = await fetch(`${API_URL}/facturas/guardar`, {
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
          message: data.message || "No se pudo crear la factura."
        });
      } else {
        // --- CAMBIO: Usamos el modal ---
        setModalInfo({ 
          visible: true, 
          title: "Éxito", 
          message: "Factura guardada correctamente."
        });
        setFactura(crearFacturaVacia());
      }
    } catch (error) {
      console.error("Error al guardar factura:", error);
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
    factura,
    clientesList, 
    onChange: handleFacturaChange,
    onGuardar: guardarNuevaFactura,
    modalInfo, // <-- Exportamos el estado del modal
    closeModal, // <-- Exportamos la función de cierre
  };
}