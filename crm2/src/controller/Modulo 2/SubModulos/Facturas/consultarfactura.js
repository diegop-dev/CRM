import { useState, useEffect, useCallback } from "react";
import { Linking } from "react-native"; // Eliminamos Alert
import { API_URL } from "../../../../config/apiConfig";
import { useNavigation } from "@react-navigation/native";

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
    idCliente: f.id_cliente || "",
    clienteNombre: f.cliente_nombre || f.cliente_proveedor || "", 
    montoTotal: f.monto_total ? f.monto_total.toString() : "",
    metodoPago: f.metodo_pago || "",
    responsableRegistro: f.responsable_nombre || "", 
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
        showModal("Error", "No se pudieron cargar los datos iniciales.", "error");
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
      showModal("Aviso", "Ingrese un número de folio para buscar.", "warning");
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
        showModal("No encontrada", "No se encontró ninguna factura con ese folio.", "warning");
      }
    } catch (error) {
      console.error(error);
      showModal("Error", "Fallo al buscar la factura.", "error");
    } finally {
      setIsLoading(false);
    }
  }, [terminoBusqueda]);

  // 3. Visualizar Archivo (Con confirmación)
  const handleViewFile = useCallback(async (fileUrl) => {
    if (!fileUrl) return showModal("Aviso", "Esta factura no tiene archivo adjunto.", "info");
    
    const fullUrl = `${API_URL}${fileUrl}`;
    
    // Lógica para abrir el archivo
    const openFileAction = async () => {
        closeFeedbackModal(); // Cerramos la pregunta
        try {
            const supported = await Linking.canOpenURL(fullUrl);
            if (supported) {
                await Linking.openURL(fullUrl);
            } else {
                showModal("Error", "No se puede abrir el archivo o no hay aplicación compatible.", "error");
            }
        } catch (err) {
            showModal("Error", "Ocurrió un error al intentar abrir el enlace.", "error");
        }
    };

    // Mostramos modal de pregunta
    showModal(
        "Visualizar Documento", 
        "Se intentará abrir el archivo adjunto. ¿Desea continuar?",
        "question",
        openFileAction
    );
  }, []);

  // 4. Limpiar
  const handleLimpiar = () => {
    setFactura(null);
    setTerminoBusqueda("");
  };

  // 5. Navegación a Editar
  const navegarAEditar = () => {
      if (factura) {
          navigation.navigate("EditarFactura", { 
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
    onChange: () => {},
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal
  };
}
