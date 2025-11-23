import { useState, useEffect, useCallback } from "react";
// Quitamos Alert aquí porque usas el modal en la vista, pero necesitamos Alert para el Picker
import { Alert } from "react-native"; 
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
    responsableRegistro: "", // Nombre (solo visual)
    archivo: null, // Nuevo campo para el archivo
  };
}

export function useAgregarFacturaLogic() {
  const [factura, setFactura] = useState(crearFacturaVacia());
  const [clientesList, setClientesList] = useState([]);
  
  // Estado para el modal de alerta personalizado
  const [modalInfo, setModalInfo] = useState({ visible: false, title: "", message: "" });

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
      }
    }
    fetchClientes();
  }, []); 

  const handleFacturaChange = (key, value) => {
    setFactura(prevState => ({ ...prevState, [key]: value }));
  };

  //  SELECCIÓN DE ARCHIVO
  const handleFileSelect = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/*'], // PDF o Imágenes
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        handleFacturaChange('archivo', asset);
        // Usamos Alert nativo para feedback rápido de selección, o puedes usar tu modal si prefieres
        // Alert.alert("Archivo Seleccionado", asset.name); 
      }
    } catch (error) {
      setModalInfo({ visible: true, title: "Error", message: "No se pudo seleccionar el archivo." });
    }
  }, []);

  // 🔑 GUARDAR
  const guardarNuevaFactura = async () => {
    if (!factura.numeroFolio || !factura.idCliente || !factura.montoTotal || !factura.metodoPago) {
      setModalInfo({ visible: true, title: "Campos incompletos", message: "Llene Folio, Cliente, Monto y Método." });
      return;
    }

    const idUsuario = await AsyncStorage.getItem('id_usuario'); // ID del empleado logueado

    const fechaEmision = factura.diaEmision && factura.mesEmision && factura.añoEmision
      ? `${factura.añoEmision}-${factura.mesEmision.padStart(2, "0")}-${factura.diaEmision.padStart(2, "0")}`
      : null;

    // FormData
    const formData = new FormData();
    formData.append('numero_factura', factura.numeroFolio);
    formData.append('fecha_emision', fechaEmision || '');
    formData.append('id_cliente', factura.idCliente); // ID para lógica
    formData.append('cliente_nombre', factura.clienteNombre); // Nombre por si acaso
    formData.append('monto_total', parseFloat(factura.montoTotal) || 0);
    formData.append('metodo_pago', factura.metodoPago);
    formData.append('responsable_registro', idUsuario); // Guardamos el ID del usuario logueado como responsable
    formData.append('estado', 'PENDIENTE');

    // Archivo
    if (factura.archivo && factura.archivo.uri) {
        formData.append('archivo_factura', { //  Nombre clave para Multer
            uri: factura.archivo.uri,
            name: factura.archivo.name,
            type: factura.archivo.mimeType || 'application/pdf',
        });
    }

    try {
      const response = await fetch(`${API_URL}/facturas/guardar-con-archivo`, {
        method: "POST",
        body: formData, // Fetch pone el Content-Type correcto
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        setModalInfo({ visible: true, title: "Error al guardar", message: data.message || "Error desconocido." });
      } else {
        setModalInfo({ visible: true, title: "Éxito", message: "Factura guardada correctamente." });
        setFactura(crearFacturaVacia());
      }
    } catch (error) {
      console.error("Error guardar:", error);
      setModalInfo({ visible: true, title: "Error de Conexión", message: "No se pudo conectar con el servidor." });
    }
  };

  const closeModal = () => setModalInfo({ visible: false, title: "", message: "" });

  return {
    factura,
    clientesList, 
    onChange: handleFacturaChange,
    onGuardar: guardarNuevaFactura,
    onFileSelect: handleFileSelect, // Exportamos
    modalInfo, 
    closeModal,
    // Placeholder para View
    onViewFile: () => setModalInfo({visible: true, title: "Info", message: "Archivo local pendiente de subir."})
  };
}