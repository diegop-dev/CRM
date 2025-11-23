import { useState, useEffect, useCallback } from "react";
import { Alert, Linking } from "react-native";
import { API_URL } from "../../../../config/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';
import { useNavigation, useRoute } from "@react-navigation/native";

// Estructura vacía
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
    archivo: (f.archivo || "").trim(), // URL relativa
  };
}

function hasChanges(original, current) {
  if (!original || !current) return false;
  // Comprobación simple de cambios
  // Si el archivo es objeto (nuevo), hay cambios.
  if (typeof current.archivo === 'object' && current.archivo !== null) return true;
  
  // Comparamos campos clave
  if (original.numeroFolio !== current.numeroFolio) return true;
  if (original.montoTotal !== current.montoTotal) return true;
  if (original.metodoPago !== current.metodoPago) return true;
  if (original.idCliente !== current.idCliente) return true;
  
  return false;
}

export function useEditarFacturaLogic() {
  const navigation = useNavigation();
  const route = useRoute();
  
  // Si venimos desde "Consultar", traemos la factura en params
  const facturaDesdeConsulta = route.params?.factura; 
  // O si venimos buscando por folio desde otra pantalla
  const terminoInicial = route.params?.terminoBusqueda || "";

  const [terminoBusqueda, setTerminoBusqueda] = useState(terminoInicial);
  const [factura, setFactura] = useState(null); 
  const [originalFactura, setOriginalFactura] = useState(null);
  const [clientesList, setClientesList] = useState([]);
  const [facturasRecientes, setFacturasRecientes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // --- 1. CARGA INICIAL ---
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
        if (facData.success && facData.facturas) setFacturasRecientes(facData.facturas);

        // Si viene factura completa desde Consulta
        if (facturaDesdeConsulta) {
            const f = formatearFactura(facturaDesdeConsulta);
            setFactura(f);
            setOriginalFactura(f);
        } 
        // Si viene solo el término de búsqueda
        else if (terminoInicial) {
            handleBuscarFactura(terminoInicial);
        }

      } catch (error) {
        console.error("Error inicial:", error);
      } finally {
        setIsLoading(false);
      }
    };
    cargarDatos();
  }, [facturaDesdeConsulta, terminoInicial]);

  // --- 2. BUSCAR FACTURA ---
  const handleBuscarFactura = async (folioOpcional) => {
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
        const f = formatearFactura(data.factura);
        setFactura(f);
        setOriginalFactura(f);
        setFacturasRecientes([]); 
      } else {
        Alert.alert("No encontrada", "No se encontró ninguna factura con ese folio.");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Fallo al buscar la factura.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3. MANEJO DE FORMULARIO ---
  const onChange = (key, value) => {
    setFactura(prev => ({ ...prev, [key]: value }));
  };

  // --- 4. SELECCIÓN DE ARCHIVO (REEMPLAZO) ---
  const onFileSelect = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const asset = result.assets[0];
        onChange('archivo', asset); // Guardamos el objeto Asset
        Alert.alert("Archivo seleccionado", `Listo para reemplazar: ${asset.name}`);
      }
    } catch (e) {
      Alert.alert("Error", "No se pudo seleccionar el archivo.");
    }
  }, []);

  // --- 5. VISUALIZACIÓN DE ARCHIVO ---
  const onViewFile = useCallback(async (fileUrl) => {
    if (!fileUrl) return Alert.alert("Aviso", "No hay archivo adjunto.");
    
    // Construimos la URL completa
    const fullUrl = `${API_URL}${fileUrl}`;
    
    const supported = await Linking.canOpenURL(fullUrl);
    if (supported) {
        await Linking.openURL(fullUrl);
    } else {
        Alert.alert("Error", "No se puede abrir el archivo. Verifique la URL.");
    }
  }, []);

  // --- 6. GUARDAR CAMBIOS (PUT) ---
  const onGuardar = async () => {
    if (!factura.numeroFolio || !factura.montoTotal) {
        return Alert.alert("Error", "Faltan datos obligatorios.");
    }

    // Verificamos si el archivo es nuevo (objeto) o el mismo (string)
    const isFileChanged = typeof factura.archivo === 'object' && factura.archivo !== null;
    const idUsuario = await AsyncStorage.getItem('id_usuario');
    
    const fechaEmision = factura.diaEmision && factura.mesEmision && factura.añoEmision
      ? `${factura.añoEmision}-${factura.mesEmision.padStart(2, "0")}-${factura.diaEmision.padStart(2, "0")}`
      : null;

    const url = `${API_URL}/facturas/${factura.id_factura}`;

    let body;
    let headers = {};

    if (isFileChanged) {
        // A) FormData (Nuevo archivo)
        body = new FormData();
        body.append("numero_factura", factura.numeroFolio);
        body.append("fecha_emision", fechaEmision || "");
        body.append("id_cliente", factura.idCliente);
        body.append("monto_total", factura.montoTotal);
        body.append("metodo_pago", factura.metodoPago);
        body.append("estado", "PENDIENTE"); // O el estado que corresponda
        // Enviar el archivo nuevo
        body.append("archivo_factura", { 
            uri: factura.archivo.uri,
            name: factura.archivo.name,
            type: factura.archivo.mimeType || "application/pdf"
        });
        // Enviar URL anterior por si el backend la necesita (opcional)
        body.append("archivo", originalFactura.archivo || "");

    } else {
        // B) JSON (Solo datos)
        body = JSON.stringify({
            numero_factura: factura.numeroFolio,
            fecha_emision: fechaEmision,
            id_cliente: factura.idCliente,
            monto_total: factura.montoTotal,
            metodo_pago: factura.metodoPago,
            archivo: factura.archivo, // URL string original
            estado: "PENDIENTE"
        });
        headers["Content-Type"] = "application/json";
    }

    try {
        const response = await fetch(url, { method: "PUT", body, headers });
        const data = await response.json();

        if (data.success) {
            Alert.alert("Éxito", "Factura actualizada.");
            handleLimpiar();
        } else {
            Alert.alert("Error", data.message || "No se pudo actualizar.");
        }
    } catch (e) {
        Alert.alert("Error", "Fallo de conexión al guardar.");
    }
  };

  const handleLimpiar = () => {
    setFactura(null);
    setTerminoBusqueda("");
    // Opcional: recargar recientes
  };

  return {
    terminoBusqueda, setTerminoBusqueda,
    factura,
    clientesList,
    facturasRecientes,
    isLoading,
    handleBuscarFactura,
    onChange,
    onGuardar,
    handleLimpiar,
    onFileSelect, 
    onViewFile    
  };
}