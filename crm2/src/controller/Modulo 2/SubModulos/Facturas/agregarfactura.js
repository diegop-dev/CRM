import { useState, useEffect, useCallback } from "react";
// Eliminamos Alert
import { API_URL } from "../../../../config/apiConfig";
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    archivo: null, 
  };
}

export function useAgregarFacturaLogic() {
  const [factura, setFactura] = useState(crearFacturaVacia());
  const [clientesList, setClientesList] = useState([]);
  
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

  // Cargar Clientes
  useEffect(() => {
    async function fetchClientes() {
      try {
        const response = await fetch(`${API_URL}/clientes/todos`); 
        if (!response.ok) throw new Error("Error carga clientes");
        const data = await response.json();
        if (data.success) setClientesList(data.clientes); 
      } catch (error) {
        console.error(error);
        // Opcional: Mostrar error si falla la carga inicial
        // showModal("Error", "No se pudieron cargar los clientes", "error");
      }
    }
    fetchClientes();
  }, []); 

  const handleFacturaChange = (key, value) => {
    setFactura(prevState => ({ ...prevState, [key]: value }));
  };

  // SELECCIÓN DE ARCHIVO
  const handleFileSelect = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'], 
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        handleFacturaChange('archivo', asset);
        // Confirmación visual simple mediante modal de éxito (opcional)
        showModal("Archivo Adjuntado", `Se seleccionó: ${asset.name}`, "success");
      }
    } catch (error) {
      showModal("Error", "No se pudo seleccionar el archivo.", "error");
    }
  }, []);

  // --- LÓGICA DE GUARDADO (API) ---
  const executeSave = async () => {
    closeFeedbackModal(); // Cerramos la pregunta

    const idUsuario = await AsyncStorage.getItem('id_usuario'); 

    const fechaEmision = factura.diaEmision && factura.mesEmision && factura.añoEmision
      ? `${factura.añoEmision}-${factura.mesEmision.padStart(2, "0")}-${factura.diaEmision.padStart(2, "0")}`
      : null;

    // FormData
    const formData = new FormData();
    formData.append('numero_factura', factura.numeroFolio);
    formData.append('fecha_emision', fechaEmision || '');
    formData.append('id_cliente', factura.idCliente); 
    formData.append('cliente_nombre', factura.clienteNombre); 
    formData.append('monto_total', parseFloat(factura.montoTotal) || 0);
    formData.append('metodo_pago', factura.metodoPago);
    formData.append('responsable_registro', idUsuario); 
    formData.append('estado', 'PENDIENTE');

    // Archivo
    if (factura.archivo && factura.archivo.uri) {
        formData.append('archivo_factura', { 
            uri: factura.archivo.uri,
            name: factura.archivo.name,
            type: factura.archivo.mimeType || 'application/pdf',
        });
    }

    try {
      const response = await fetch(`${API_URL}/facturas/guardar-con-archivo`, {
        method: "POST",
        body: formData, 
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        showModal("Error al guardar", data.message || "Error desconocido.", "error");
      } else {
        showModal("Éxito", "Factura guardada correctamente.", "success");
        setFactura(crearFacturaVacia());
      }
    } catch (error) {
      console.error("Error guardar:", error);
      showModal("Error de Conexión", "No se pudo conectar con el servidor.", "error");
    }
  };

  // 🔑 FUNCIÓN PRINCIPAL (Validación + Pregunta)
  const guardarNuevaFactura = async () => {
    if (!factura.numeroFolio || !factura.idCliente || !factura.montoTotal || !factura.metodoPago) {
      showModal("Campos incompletos", "Llene Folio, Cliente, Monto y Método.", "warning");
      return;
    }

    // Modal de confirmación
    showModal(
        "Confirmar Guardado",
        "¿Está seguro de que desea guardar esta nueva factura?",
        "question",
        executeSave // Acción al confirmar
    );
  };

  return {
    factura,
    clientesList, 
    onChange: handleFacturaChange,
    onGuardar: guardarNuevaFactura,
    onFileSelect: handleFileSelect, 
    // Exportamos el modal
    feedbackModal, 
    closeFeedbackModal,
    onViewFile: () => showModal("Info", "Archivo local pendiente de subir.", "info")
  };
}
