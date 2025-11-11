import { useState, useEffect } from "react";
import { Alert } from "react-native";
// Ajusta esta ruta a tu archivo de config
import { API_URL } from "../../../../config/apiConfig"; 

export function useEditarFacturaLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [factura, setFactura] = useState(null); // La factura encontrada
  const [clientesList, setClientesList] = useState([]); // Para el picker de clientes
  const [facturasRecientes, setFacturasRecientes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // 1. Cargar datos iniciales (Clientes Y Facturas Recientes)
  useEffect(() => {
    async function fetchDatosIniciales() {
      setIsInitialLoading(true);
      try {
        const [cliResponse, facResponse] = await Promise.all([
          fetch(`${API_URL}/clientes/todos`), // Para el picker
          fetch(`${API_URL}/facturas/recientes`) // Para la lista
        ]);

        const cliData = await cliResponse.json();
        const facData = await facResponse.json();

        if (cliData.success) {
          setClientesList(cliData.clientes);
        } else {
          Alert.alert("Error", "No se pudo cargar la lista de clientes.");
        }

        if (facData.success) {
          setFacturasRecientes(facData.facturas);
        } else {
          Alert.alert("Error", "No se pudo cargar las facturas recientes.");
        }

      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        Alert.alert("Error de Conexión", "No se pudieron cargar los datos iniciales.");
      }
      setIsInitialLoading(false);
    }
    fetchDatosIniciales();
  }, []); // Se ejecuta solo una vez

  // 2. Función para BUSCAR una factura por Folio
  const handleBuscarFactura = async (terminoOpcional) => {
    const termino = terminoOpcional || terminoBusqueda;

    if (!termino.trim()) {
      Alert.alert("Error", "Por favor, ingrese un Número de Folio para buscar.");
      return;
    }
    setIsLoading(true);
    setFactura(null); // Limpiamos la factura anterior
    try {
      // Usamos el término validado
      const response = await fetch(`${API_URL}/facturas/buscar?folio=${termino}`);
      const data = await response.json();

      if (data.success) {
        // Transformamos los datos del backend al formato del formulario
        const f = data.factura;

        // a. Formatear fecha de emisión
        const [añoEmision, mesEmision, diaEmision] = (f.fecha_emision || "T").split('T')[0].split('-');

        // b. Asignar al estado
        setFactura({
          id_factura: f.id_factura,
          numeroFolio: f.numero_folio,
          diaEmision: diaEmision || "",
          mesEmision: mesEmision || "",
          añoEmision: añoEmision || "",
          idCliente: f.id_cliente,
          clienteNombre: f.cliente_nombre, // ¡Necesitamos que el API devuelva esto!
          montoTotal: f.monto_total.toString(),
          metodoPago: f.metodo_pago,
          responsableRegistro: f.responsable_registro,
        });

      } else {
        Alert.alert("No Encontrada", data.message || "No se encontró la factura.");
      }
    } catch (error) {
      console.error("Error al buscar factura:", error);
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
    }
    setIsLoading(false);
  };

  // 3. Función para actualizar el estado de la factura (genérica)
  const handleFacturaChange = (key, value) => {
    setFactura(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  // 4. Función para ENVIAR la actualización (Editar)
  const handleEditarFactura = async () => {
    if (!factura) return;

    // --- Mismas validaciones y preparación que en 'guardar' ---
    if (!factura.numeroFolio || !factura.idCliente || !factura.montoTotal || !factura.metodoPago) {
      Alert.alert("Campos incompletos", "Folio, Cliente, Monto y Método de Pago son obligatorios.");
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
    // --- Fin de la preparación ---

    try {
      const response = await fetch(`${API_URL}/facturas/editar/${factura.id_factura}`, { // <-- Ruta PUT
        method: "PUT", // <-- Método PUT
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        Alert.alert("Error al editar", data.message || "No se pudo actualizar la factura.");
      } else {
        Alert.alert("Éxito", "Factura actualizada correctamente.");
      }
    } catch (error) {
      console.error("Error al editar factura:", error);
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
    }
  };

  // 5. Función para LIMPIAR el formulario y volver a la lista
  const handleLimpiar = () => {
    setFactura(null);
    setTerminoBusqueda("");
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    factura,
    clientesList,
    facturasRecientes,
    isLoading: isLoading || isInitialLoading, // Mostramos loading en ambas cargas
    handleBuscarFactura,
    onChange: handleFacturaChange,
    onGuardar: handleEditarFactura,
    handleLimpiar,
  };
}