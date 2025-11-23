import { useState, useEffect, useCallback } from "react";
import { Alert, Linking } from "react-native";
import { API_URL } from "../../../../config/apiConfig";
import { useNavigation } from "@react-navigation/native";

// Estructura vacía para evitar errores de renderizado
const FACTURA_VACIA = {
  id_factura: null,
  numeroFolio: "",
  diaEmision: "",
  mesEmision: "",
  añoEmision: "",
  idCliente: "",
  clienteNombre: "",
  montoTotal: "",
  metodoPago: "",
  responsableRegistro: "",
  archivo: null,
};

// Formateador: BD (snake_case) -> React (camelCase)
function formatearFactura(f) {
  if (!f) return FACTURA_VACIO;
  
  let dia = "", mes = "", anio = "";
  if (f.fecha_emision) {
    const iso = f.fecha_emision.split('T')[0]; 
    [anio, mes, dia] = iso.split('-');
  }

  return {
    id_factura: f.id_factura,
    numeroFolio: f.numero_factura || "",
    diaEmision: dia,
    mesEmision: mes,
    añoEmision: anio,
    idCliente: f.id_cliente || "",
    clienteNombre: f.cliente_nombre || f.cliente_proveedor || "", 
    montoTotal: f.monto_total ? f.monto_total.toString() : "",
    metodoPago: f.metodo_pago || "",
    responsableRegistro: f.responsable_nombre || "", 
    // Ruta relativa del archivo
    archivo: (f.archivo || "").trim(), 
  };
}

export function useConsultarFacturaLogic() {
  const navigation = useNavigation();
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [factura, setFactura] = useState(null); 
  const [clientesList, setClientesList] = useState([]); 
  const [facturasRecientes, setFacturasRecientes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Cargar datos iniciales
  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      try {
        const [cliRes, facRes] = await Promise.all([
          fetch(`${API_URL}/clientes/todos`),
          fetch(`${API_URL}/facturas/recientes`)
        ]);

        const cliData = await cliRes.json();
        const facData = await facRes.json();

        if (cliData.success) setClientesList(cliData.clientes);
        if (facData.success) setFacturasRecientes(facData.facturas);

      } catch (error) {
        console.error("Error inicial:", error);
      } finally {
        setIsLoading(false);
      }
    };
    cargarDatos();
  }, []);

  // 2. Buscar Factura
  const handleBuscarFactura = useCallback(async (folioOpcional) => {
    const termino = folioOpcional || terminoBusqueda;
    if (!termino.trim()) {
      Alert.alert("Error", "Ingrese un número de folio.");
      return;
    }

    setIsLoading(true);
    setFactura(null);
    
    try {
      const response = await fetch(`${API_URL}/facturas/buscar?folio=${encodeURIComponent(termino)}`);
      const data = await response.json();

      if (data.success && data.factura) {
        setFactura(formatearFactura(data.factura));
      } else {
        Alert.alert("No encontrada", "No se encontró ninguna factura con ese folio.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Fallo al buscar la factura.");
    } finally {
      setIsLoading(false);
    }
  }, [terminoBusqueda]);

  // 3. Visualizar Archivo
  const handleViewFile = useCallback(async (fileUrl) => {
    if (!fileUrl) return Alert.alert("Aviso", "Esta factura no tiene archivo adjunto.");
    
    const fullUrl = `${API_URL}${fileUrl}`;
    
    Alert.alert(
        "Visualizar Documento", 
        `Se intentará abrir el archivo.`,
        [
            { text: "Cancelar", style: "cancel" },
            { 
                text: "Abrir", 
                onPress: async () => {
                    const supported = await Linking.canOpenURL(fullUrl);
                    if (supported) {
                        await Linking.openURL(fullUrl);
                    } else {
                        Alert.alert("Error", "No se puede abrir el archivo.");
                    }
                }
            }
        ]
    );
  }, []);

  // 4. Limpiar y volver a recientes
  const handleLimpiar = () => {
    setFactura(null);
    setTerminoBusqueda("");
  };

  // 5. Navegación a Editar (Se usa en el modal de la vista)
  const navegarAEditar = () => {
      if (factura) {
          // Pasamos el objeto 'factura' como parámetro inicial para que EditarFactura lo cargue
          // Ojo: EditarFactura debe estar preparado para recibir `route.params.factura` si quieres pasarlo directo,
          // o puedes pasar solo el folio/id y que él lo busque.
          // Si EditarFactura busca por `route.params.terminoBusqueda`, pasamos eso.
          navigation.navigate("EditarFactura", { 
             // Dependiendo de tu implementación de EditarFactura, pasa lo que necesite.
             // Si EditarFactura usa 'terminoBusqueda' inicial:
             terminoBusqueda: factura.numeroFolio 
          });
      }
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    factura,
    clientesList,
    facturasRecientes,
    isLoading,
    handleBuscarFactura,
    handleLimpiar,
    handleViewFile,
    navegarAEditar,
    onChange: () => {} // No hace nada en consulta
  };
}