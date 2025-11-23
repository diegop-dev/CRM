import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../../../config/apiConfig"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

// Estructura inicial del documento (camelCase para React)
function crearDocumentoVacio() {
  return {
    id_documento: "",
    nombreDocumento: "", // Se enviará como: nombre_documento
    tipoDocumento: "",   // Se enviará como: tipo_documento
    descripcion: "",     // Se enviará como: descripcion
    idResponsable: "",   // Se enviará como: id_responsable
    responsableNombre: "", // Solo para mostrar en el input
    estado: "VIGENTE",   // Valor por defecto
    archivo: null,       // Objeto del archivo seleccionado (Asset)
  };
}

export function useAgregarDocumentoLogic() {
  const [documento, setDocumento] = useState(crearDocumentoVacio());
  const [empleadosList, setEmpleadosList] = useState([]);

  // 1. Cargar lista de empleados para el selector
  useEffect(() => {
    async function fetchEmpleados() {
      try {
        const response = await fetch(`${API_URL}/empleados/todos`);
        const data = await response.json();
        if (data.success) {
          setEmpleadosList(data.empleados);
        } else {
          console.error("Error cargando empleados:", data.message);
        }
      } catch (error) {
        console.error("Error de conexión al cargar empleados:", error);
      }
    }
    fetchEmpleados();
  }, []);

  // 2. Handler para cambios en los inputs de texto
  const handleDocumentoChange = (key, value) => {
    setDocumento(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 3. Handler para SELECCIONAR ARCHIVO
  const handleFileSelect = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*', // Puedes cambiar a 'application/pdf' si prefieres restringirlo
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        handleDocumentoChange('archivo', asset);
        Alert.alert("Archivo Seleccionado", `Listo para subir: ${asset.name}`);
      }
    } catch (error) {
      console.error("Error seleccionando archivo:", error);
      Alert.alert("Error", "No se pudo seleccionar el documento.");
    }
  }, []);

  // 4. Función GUARDAR (Envío al Backend)
  const guardarNuevoDocumento = async () => {
    // Validación de campos obligatorios
    if (!documento.nombreDocumento || !documento.tipoDocumento || !documento.idResponsable) {
      Alert.alert("Campos incompletos", "Por favor llene: Nombre, Tipo y Responsable.");
      return;
    }

    // Obtener usuario actual
    const idUsuario = await AsyncStorage.getItem('id_usuario');
    if (!idUsuario) {
      Alert.alert("Error", "Sesión no válida. Vuelva a iniciar sesión.");
      return;
    }

    // Construcción del FormData
    const formData = new FormData();
    
    // Mapeo de campos (React -> API/SQL)
    formData.append('nombre_documento', documento.nombreDocumento.trim());
    formData.append('tipo_documento', documento.tipoDocumento);
    formData.append('descripcion', documento.descripcion.trim());
    formData.append('id_responsable', documento.idResponsable);
    formData.append('estado', documento.estado);
    formData.append('created_by', idUsuario);

    // Adjuntar archivo si existe
    if (documento.archivo && documento.archivo.uri) {
      formData.append('archivo_doc', { //  Este nombre 'archivo_doc' debe coincidir con el controller
        uri: documento.archivo.uri,
        name: documento.archivo.name,
        type: documento.archivo.mimeType || 'application/pdf', 
      });
    }

    try {
      // Enviar a la ruta configurada en backend
      const response = await fetch(`${API_URL}/documentos/guardar-con-archivo`, {
        method: "POST",
        body: formData,
        // Nota: No agregamos 'Content-Type', fetch lo maneja automáticamente para multipart
      });

      const data = await response.json();

      if (data.success) {
        Alert.alert("Éxito", "Documento guardado correctamente.");
        setDocumento(crearDocumentoVacio()); // Limpiar formulario
      } else {
        Alert.alert("Error", data.message || "No se pudo guardar el documento.");
      }
    } catch (error) {
      console.error("Error al guardar:", error);
      Alert.alert("Error", "Fallo de conexión con el servidor.");
    }
  };

  // 5. Retorno de funciones y variables para la Vista
  return {
    documento,
    empleadosList,
    onChange: handleDocumentoChange,
    onGuardar: guardarNuevoDocumento,
    onFileSelect: handleFileSelect,
    // Función placeholder para visualización en modo agregar (muestra alerta informativa)
    onViewFile: () => Alert.alert("Info", "El archivo es local y está pendiente de subir."),
  };
}