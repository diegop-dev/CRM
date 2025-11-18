import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from 'expo-document-picker'; // 🔑 Importamos librería para seleccionar archivos

// Función para crear un objeto de servicio vacío
function crearServicioVacio() {
  return {
    id_servicio: "",
    nombreServicio: "",
    descripcion: "",
    categoria: "",
    precio: "",
    moneda: "",
    duracionEstimada: "",
    estado: "Activo",
    idResponsable: "",
    responsableNombre: "",
    notasInternas: "",
    // 🔑 Ahora 'archivo' puede ser el objeto Asset seleccionado o la URL (string)
    archivo: null,
  };
}

// Lógica para la pantalla de 'Agregar Servicio'
export function useAgregarServicioLogic() {
  const [servicio, setServicio] = useState(crearServicioVacio());
  const [empleadosList, setEmpleadosList] = useState([]);

  // --- EFECTO PARA CARGAR EMPLEADOS (omito por brevedad, es correcto) ---
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

  // Función genérica para actualizar el estado del 'servicio'
  const handleServicioChange = (key, value) => {
    setServicio(prevState => ({
      ...prevState,
      [key]: value
    }));
  };


  // ===========================================
  // 🔑 NUEVA FUNCIÓN: SELECCIONAR ARCHIVO PDF
  // ===========================================
  const handleFileSelect = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf', // Solo permitimos PDF
        copyToCacheDirectory: true,
      });

      if (result.canceled === false && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        // Guardamos el objeto Asset en el estado 'servicio.archivo'
        // Esto permite que el formulario muestre el nombre del archivo.
        handleServicioChange('archivo', asset);
        Alert.alert("Archivo Seleccionado", `PDF listo para subir: ${asset.name}`);
      } else if (!result.canceled) {
        Alert.alert("Selección Cancelada", "No se seleccionó ningún archivo.");
      }
    } catch (error) {
      console.error("Error seleccionando archivo:", error);
      Alert.alert("Error", "No se pudo acceder al selector de documentos.");
    }
  }, [handleServicioChange]);


  // --- Función para guardar el 'servicio' ---
  const guardarNuevoServicio = async () => {
    // --- Validación simple ---
    if (!servicio.nombreServicio || !servicio.categoria || !servicio.precio) {
      Alert.alert("Campos incompletos", "Por favor, llene al menos Nombre, Categoría y Precio.");
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
    // 🔑 PREPARACIÓN Y ENVÍO DE FormData
    // ===========================================
    const formData = new FormData();

    // 1. Añadir campos de texto (Mapeo a snake_case)
    formData.append('nombre_servicio', servicio.nombreServicio.trim());
    formData.append('descripcion', servicio.descripcion.trim());
    formData.append('categoria', servicio.categoria);
    formData.append('precio', parseFloat(servicio.precio) || 0);
    formData.append('moneda', servicio.moneda);
    formData.append('duracion_estimada', servicio.duracionEstimada.trim());
    formData.append('estado', servicio.estado || 'Activo');
    formData.append('id_responsable', servicio.idResponsable || null);
    formData.append('notas_internas', servicio.notasInternas.trim());
    formData.append('created_by', idUsuario);

    // 2. Añadir el archivo si fue seleccionado
    if (servicio.archivo && servicio.archivo.uri) {
      const mimeType = 'application/pdf';

      // 🔑 CLAVE: El campo 'archivo_pdf' debe coincidir con el nombre de campo esperado por Multer en el backend
      formData.append('archivo_pdf', {
        uri: servicio.archivo.uri,
        name: servicio.archivo.name,
        type: mimeType,
      });
    }

    try {
      // 3. ENVIAR COMO multipart/form-data (A la nueva ruta del controlador)
      // La ruta 'guardar-con-archivo' usará el middleware multer en el backend
      const response = await fetch(`${API_URL}/servicios/guardar-con-archivo`, {
        method: "POST",
        headers: {
          // 🛑 NO ENVIAR 'Content-Type'. Fetch lo establece automáticamente para FormData.
        },
        body: formData, // 🔑 Enviamos el FormData
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        Alert.alert("Error al guardar", data.message || "No se pudo crear el servicio.");
      } else {
        Alert.alert("Éxito", "Servicio y archivo guardados correctamente.");
        setServicio(crearServicioVacio()); // Limpiamos el formulario
      }
    } catch (error) {
      console.error("Error al guardar servicio:", error);
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
    }
  };

  return {
    servicio,
    setServicio,
    empleadosList,
    onChange: handleServicioChange,
    onGuardar: guardarNuevoServicio,
    onFileSelect: handleFileSelect, // 🔑 Exportamos el nuevo handler
  };
}
