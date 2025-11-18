import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../../../config/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker';

// Función para crear un objeto de documento vacío
function crearDocumentoVacio() {
  return {
    id_documento: "",
    indentificadorUnico: "",
    descripcion: "",
    categoria: "",
    idEmpleado: "",
    empleadoNombre: "",
    estado: "Actualizado", // Asumimos 'actualizado' como default al agregar
    // 'archivo' puede ser el objeto Asset seleccionado o la URL (string)
    archivo: null,
  };
}

// Lógica para la pantalla de 'Agregar Documento'
export function useAgregarDocumentoLogic() {
  const [documento, setDocumento] = useState(crearDocumentoVacio());
  const [empleadosList, setEmpleadosList] = useState([]);

  // --- EFECTO PARA CARGAR EMPLEADOS (Se mantiene igual) ---
  useEffect(() => {
    async function fetchEmpleados() {
      try {
        const response = await fetch(`${API_URL}/empleados/todos`);
        if (!response.ok) throw new Error("No se pudo cargar la lista de empleados");
        const data = await response.json();
        if (data.success) {
          setEmpleadosList(data.empleados);
        } else {
          Alert.alert("Error", data.message || "Error al cargar empleados.");
        }
      } catch (error) {
        console.error("Error al cargar empleados:", error);
        Alert.alert("Error de Conexión", error.message);
      }
    }
    fetchEmpleados();
  }, []);

  // Función genérica para actualizar el estado del 'documento'
  const handleDocumentoChange = (key, value) => {
    setDocumento(prevState => ({
      ...prevState,
      [key]: value
    }));
  };


  // ===========================================
  // FUNCIÓN: SELECCIONAR ARCHIVO PDF (Se mantiene la lógica, cambia el handler)
  // ===========================================
  const handleFileSelect = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', // Solo permitimos PDF
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        // Guardamos el objeto Asset en el estado 'documento.archivo'
        handleDocumentoChange('archivo', asset);
        Alert.alert("Archivo Seleccionado", `PDF listo para subir: ${asset.name}`);
      } else if (!result.canceled) {
        Alert.alert("Selección Cancelada", "No se seleccionó ningún archivo.");
      }
    } catch (error) {
      console.error("Error seleccionando archivo:", error);
      Alert.alert("Error", "No se pudo acceder al selector de documentos.");
    }
  }, [handleDocumentoChange]); // Depende del nuevo handler


  // --- Función para guardar el 'documento' ---
  const guardarNuevoDocumento = async () => {
    // --- Validación ---
    if (!documento.indentificadorUnico || !documento.categoria || !documento.idEmpleado) {
      Alert.alert("Campos incompletos", "Por favor, llene al menos Identificador, Categoría y Empleado.");
      return;
    }

    // Leemos el ID del usuario
    const idUsuarioString = await AsyncStorage.getItem('id_usuario');
    const idUsuario = idUsuarioString ? parseInt(idUsuarioString, 10) : null;
    if (!idUsuario) {
      Alert.alert("Error de autenticación", "No se ha encontrado ID de usuario.");
      return;
    }

    // ===========================================
    // PREPARACIÓN Y ENVÍO DE FormData
    // ===========================================
    const formData = new FormData();

    // 1. Añadir campos de texto (Mapeo a snake_case)
    formData.append('indentificador_unico', documento.indentificadorUnico.trim());
    formData.append('descripción', documento.descripcion.trim()); // Clave con tilde
    formData.append('categoria', documento.categoria);
    formData.append('id_empleado', documento.idEmpleado || null);
    formData.append('estado', documento.estado || 'actualizado');
    formData.append('created_by', idUsuario);

    // 2. Añadir el archivo si fue seleccionado
    if (documento.archivo && documento.archivo.uri) {
      const mimeType = 'application/pdf';

      // 'archivo_pdf' debe coincidir con el nombre esperado por Multer en el backend
      formData.append('archivo_pdf', {
        uri: documento.archivo.uri,
        name: documento.archivo.name,
        type: mimeType,
      });
    }

    try {
      // 3. ENVIAR (A la nueva ruta del controlador de documentos)
      const response = await fetch(`${API_URL}/documentos/guardar-con-archivo`, {
        method: "POST",
        headers: {
          // NO ENVIAR 'Content-Type'. Fetch lo establece automáticamente.
        },
        body: formData, // Enviamos el FormData
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        Alert.alert("Error al guardar", data.message || "No se pudo crear el documento.");
      } else {
        Alert.alert("Éxito", "Documento y archivo guardados correctamente.");
        setDocumento(crearDocumentoVacio()); // Limpiamos el formulario
      }
    } catch (error) {
      console.error("Error al guardar documento:", error);
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
    }
  };

  return {
    documento,
    setDocumento,
    empleadosList,
    onChange: handleDocumentoChange,
    onGuardar: guardarNuevoDocumento,
    onFileSelect: handleFileSelect,
  };
}
