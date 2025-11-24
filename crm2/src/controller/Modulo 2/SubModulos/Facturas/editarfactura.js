import { useState, useEffect, useCallback } from "react";
import { Linking } from "react-native"; // Eliminamos Alert, mantenemos Linking
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

// Formateador
function formatearFactura(f) {
  if (!f) return FACTURA_VACIA;
  
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
    idCliente: f.id_cliente ? f.id_cliente.toString() : "",
    clienteNombre: f.cliente_nombre || f.cliente_proveedor || "", 
    montoTotal: f.monto_total ? f.monto_total.toString() : "",
    metodoPago: f.metodo_pago || "",
    responsableRegistro: f.responsable_nombre || "", 
    archivo: (f.archivo || "").trim(), 
  };
}

export function useEditarFacturaLogic() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const facturaDesdeConsulta = route.params?.factura; 
  const terminoInicial = route.params?.terminoBusqueda || "";

  const [terminoBusqueda, setTerminoBusqueda] = useState(terminoInicial);
  const [factura, setFactura] = useState(null); 
  const [originalFactura, setOriginalFactura] = useState(null);
  const [clientesList, setClientesList] = useState([]);
  const [facturasRecientes, setFacturasRecientes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // --- NUEVO ESTADO PARA EL MODAL DE FEEDBACK ---
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info", // 'success', 'error', 'warning', 'question'
    onConfirm: null,
  });

  // Función auxiliar para mostrar el modal
  const showModal = (title, message, type = "info", onConfirmAction = null) => {
    setFeedbackModal({
      visible: true,
      title,
      message,
      type,
      onConfirm: onConfirmAction,
    });
  };

  // Función auxiliar para cerrar el modal
  const closeFeedbackModal = () => {
    setFeedbackModal((prev) => ({ ...prev, visible: false, onConfirm: null }));
  };
  
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
        showModal("Error", "Fallo al cargar datos iniciales.", "error");
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
      showModal("Aviso", "Ingrese un número de folio para buscar.", "warning");
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
        showModal("No encontrada", "No se encontró ninguna factura con ese folio.", "warning");
      }
    } catch (error) {
      console.error(error);
      showModal("Error", "Fallo al buscar la factura.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 3. MANEJO DE FORMULARIO ---
  const onChange = (key, value) => {
    setFactura(prev => ({ ...prev, [key]: value }));
  };

  // --- 4. SELECCIÓN DE ARCHIVO ---
  const onFileSelect = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets) {
        const asset = result.assets[0];
        onChange('archivo', asset); // Guardamos el objeto Asset
        showModal("Archivo Seleccionado", `Listo para reemplazar: ${asset.name}`, "success");
      }
    } catch (e) {
      showModal("Error", "No se pudo seleccionar el archivo.", "error");
    }
  }, []);

  // --- 5. VISUALIZACIÓN DE ARCHIVO ---
  const onViewFile = useCallback(async (fileUrl) => {
    if (!fileUrl) return showModal("Aviso", "No hay archivo adjunto para visualizar.", "info");
    
    // Construimos la URL completa si es una ruta relativa
    const fullUrl = fileUrl.startsWith('http') ? fileUrl : `${API_URL}${fileUrl}`;
    
    try {
        const supported = await Linking.canOpenURL(fullUrl);
        if (supported) {
            await Linking.openURL(fullUrl);
        } else {
            showModal("Error", "No se puede abrir este tipo de archivo o la URL es inválida.", "error");
        }
    } catch (err) {
        showModal("Error", "Ocurrió un error al intentar abrir el archivo.", "error");
    }
  }, []);

  // --- 6. EJECUCIÓN DE GUARDADO (API) ---
  const executeSave = async () => {
    closeFeedbackModal(); // Cerramos confirmación

    // Verificamos si el archivo es nuevo (objeto)
    const isFileChanged = typeof factura.archivo === 'object' && factura.archivo !== null;
    
    const fechaEmision = factura.diaEmision && factura.mesEmision && factura.añoEmision
      ? `${factura.añoEmision}-${factura.mesEmision.padStart(2, "0")}-${factura.diaEmision.padStart(2, "0")}`
      : null;

    const url = `${API_URL}/facturas/${factura.id_factura}`;

    let body;
    let headers = {};

    if (isFileChanged) {
        // A) FormData
        body = new FormData();
        body.append("numero_factura", factura.numeroFolio);
        body.append("fecha_emision", fechaEmision || "");
        body.append("id_cliente", factura.idCliente);
        body.append("monto_total", factura.montoTotal);
        body.append("metodo_pago", factura.metodoPago);
        // Opcional: mantener estado
        // body.append("estado", "PENDIENTE"); 
        
        // Enviar archivo nuevo
        body.append("archivo_factura", { 
            uri: factura.archivo.uri,
            name: factura.archivo.name,
            type: factura.archivo.mimeType || "application/pdf"
        });
        
        // Enviar URL anterior (opcional, según backend)
        // body.append("archivo_anterior", originalFactura.archivo || "");

    } else {
        // B) JSON
        body = JSON.stringify({
            numero_factura: factura.numeroFolio,
            fecha_emision: fechaEmision,
            id_cliente: factura.idCliente,
            monto_total: factura.montoTotal,
            metodo_pago: factura.metodoPago,
            archivo: typeof factura.archivo === 'string' ? factura.archivo : "", 
            // estado: ...
        });
        headers["Content-Type"] = "application/json";
    }

    try {
        const response = await fetch(url, { method: "PUT", body, headers });
        const data = await response.json();

        if (data.success) {
            showModal("Éxito", "Factura actualizada correctamente.", "success");
            // Regresar o limpiar
            navigation.goBack();
        } else {
            showModal("Error", data.message || "No se pudo actualizar la factura.", "error");
        }
    } catch (e) {
        showModal("Error", "Fallo de conexión al guardar.", "error");
    }
  };

  // --- 7. BOTÓN GUARDAR (Confirmación) ---
  const onGuardar = async () => {
    if (!factura.numeroFolio || !factura.montoTotal) {
        return showModal("Campos incompletos", "El folio y el monto son obligatorios.", "warning");
    }

    // Confirmar acción
    showModal(
        "Confirmar Cambios",
        "¿Está seguro de que desea guardar los cambios realizados en esta factura?",
        "question",
        executeSave
    );
  };

  const handleLimpiar = () => {
    setFactura(null);
    setTerminoBusqueda("");
    // Recargar recientes si fuera necesario
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
    onViewFile,
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal
  };
}
