import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../../../config/apiConfig"; // Asumo que tienes esto

// Función para crear un objeto de factura vacío
function crearFacturaVacia() {
  return {
    id_factura: "", // El backend lo generará
    numeroFolio: "",
    diaEmision: "",
    mesEmision: "",
    añoEmision: "",
    idCliente: "", // Guardamos el ID del cliente
    clienteNombre: "", // Guardamos el nombre para mostrarlo en el picker
    montoTotal: "",
    metodoPago: "",
    responsableRegistro: "", // Campo manual por ahora
    // 'archivos' se manejaría por separado, usualmente no en el mismo JSON
  };
}

export function useAgregarFacturaLogic() {
  // Estado para el objeto factura
  const [factura, setFactura] = useState(crearFacturaVacia());
  
  // Estado para la lista de clientes (para el picker)
  const [clientesList, setClientesList] = useState([]);

  // --- EFECTO PARA CARGAR CLIENTES ---
  useEffect(() => {
    async function fetchClientes() {
      try {
        // Asumimos que tienes una ruta para traer todos los clientes
        const response = await fetch(`${API_URL}/clientes/todos`); 
        if (!response.ok) {
          throw new Error("No se pudo cargar la lista de clientes");
        }
        const data = await response.json();
        if (data.success) {
          // Asumimos que la data.clientes es un array
          setClientesList(data.clientes); 
        } else {
          Alert.alert("Error", data.message || "Error al cargar clientes.");
        }
      } catch (error) {
        console.error("Error al cargar clientes:", error);
        Alert.alert("Error de Conexión", error.message);
      }
    }
    fetchClientes();
  }, []); // El array vacío asegura que solo se ejecute una vez

  // Función genérica para actualizar el estado de la factura
  const handleFacturaChange = (key, value) => {
    setFactura(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  // Función para guardar la factura
  const guardarNuevaFactura = async () => {
    // --- Validación simple ---
    if (!factura.numeroFolio || !factura.idCliente || !factura.montoTotal || !factura.metodoPago) {
      Alert.alert("Campos incompletos", "Por favor, llene Folio, Cliente, Monto y Método de Pago.");
      return;
    }

    // --- Preparar datos para el backend ---
    const fechaEmision = factura.diaEmision && factura.mesEmision && factura.añoEmision
      ? `${factura.añoEmision}-${factura.mesEmision.padStart(2, "0")}-${factura.diaEmision.padStart(2, "0")}`
      : null;

    const dataParaEnviar = {
      numeroFolio: factura.numeroFolio,
      fechaEmision: fechaEmision,
      idCliente: factura.idCliente,
      montoTotal: parseFloat(factura.montoTotal) || 0, // Aseguramos que sea un número
      metodoPago: factura.metodoPago,
      responsableRegistro: factura.responsableRegistro.trim(),
    };

    try {
      // Creamos la nueva ruta del backend para facturas
      const response = await fetch(`${API_URL}/facturas/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        Alert.alert("Error al guardar", data.message || "No se pudo crear la factura.");
      } else {
        Alert.alert("Éxito", "Factura guardada correctamente.");
        // Limpiamos el formulario
        setFactura(crearFacturaVacia());
      }
    } catch (error) {
      console.error("Error al guardar factura:", error);
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
    }
  };

  return {
    factura,
    clientesList, // Pasamos la lista de clientes al formulario
    onChange: handleFacturaChange,
    onGuardar: guardarNuevaFactura,
  };
}