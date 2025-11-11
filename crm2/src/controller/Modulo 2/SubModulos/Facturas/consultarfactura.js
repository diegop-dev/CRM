import { useState, useEffect } from "react";
import { Alert } from "react-native";
// Ajusta esta ruta a tu archivo de config
import { API_URL } from "../../../../config/apiConfig"; 

export function useConsultarFacturaLogic(navigation) { // Recibe navigation
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
    setFactura(null); 
    try {
      const response = await fetch(`${API_URL}/facturas/buscar?folio=${termino}`);
      const data = await response.json();

      if (data.success) {
        const f = data.factura;
        const [añoEmision, mesEmision, diaEmision] = (f.fecha_emision || "T").split('T')[0].split('-');

        setFactura({
          id_factura: f.id_factura,
          numeroFolio: f.numero_folio,
          diaEmision: diaEmision || "",
          mesEmision: mesEmision || "",
          añoEmision: añoEmision || "",
          idCliente: f.id_cliente,
          clienteNombre: f.cliente_nombre, // Asumimos que el API lo devuelve
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

  // 3. Función para actualizar el estado (necesaria para el formulario)
  const handleFacturaChange = (key, value) => {
    // En modo consulta, esto no debería llamarse, pero el form lo espera
    console.log("Intento de cambio bloqueado en modo consulta");
  };

  // 4. Función para LIMPIAR el formulario y volver a la lista
  const handleLimpiar = () => {
    setFactura(null);
    setTerminoBusqueda("");
  };

  // 5. Función para navegar a la pantalla de Edición
  const handleNavegarEditar = () => {
    if (!factura) return;
    // Navega a EditarFactura, pasando el ID o el objeto completo
    // (Asegúrate de que 'EditarFactura' esté en tu App.js)
    navigation.navigate('EditarFactura', { 
      // Pasamos el término de búsqueda para que 'EditarFactura' lo auto-busque
      terminoBusqueda: factura.numeroFolio 
    });
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    factura,
    clientesList,
    facturasRecientes,
    isLoading: isLoading || isInitialLoading, 
    handleBuscarFactura,
    onChange: handleFacturaChange,
    handleLimpiar,
    handleNavegarEditar, // Devolvemos la función de navegación
  };
}