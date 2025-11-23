import { useState, useEffect, useCallback } from "react";
import { Alert, Linking } from "react-native";
import { API_URL } from "../../../../config/apiConfig";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as DocumentPicker from "expo-document-picker";
import { useNavigation, useRoute } from "@react-navigation/native";

// ==========================================
// 1. ESTRUCTURA INICIAL Y UTILIDADES
// ==========================================

const DOCUMENTO_VACIO = {
  id_documento: null,
  nombreDocumento: "",
  tipoDocumento: "",
  descripcion: "",
  idResponsable: "",
  responsableNombre: "",
  estado: "VIGENTE",
  archivo: null,
};

// Mapeo de la Base de Datos (snake_case) a React (camelCase)
function formatearDocumento(d) {
  if (!d) return DOCUMENTO_VACIO;
  return {
    id_documento: d.id_documento || d.idDocumento,
    // Mapeo de nombres de columnas SQL a Estado React
    nombreDocumento: (d.nombre_documento || d.nombreDocumento || d.indentificador_unico || "").trim(),
    tipoDocumento: (d.tipo_documento || d.tipoDocumento || d.categoria || "").trim(),
    descripcion: (d.descripcion || "").trim(),
    // Convertimos ID a string para los pickers
    idResponsable: (d.idResponsable || d.id_responsable || "").toString(),
responsableNombre: (d.responsableNombre || d.responsable_nombre || d.empleado_nombre || d.empleadoNombre || "").trim(),

    estado: (d.estado || "").trim(),
    archivo: (d.archivo || "").trim(),
  };
}

// Función para detectar si el usuario hizo algún cambio
function hasChanges(original, current) {
  if (!original || !current) return false;
  
  const keys = Object.keys(original);
  for (const key of keys) {
    if (key === "id_documento") continue;
    
    if (key === "archivo") {
      // Si es un objeto (nuevo archivo seleccionado) -> Hay cambio
      if (typeof current[key] === "object" && current[key] !== null) return true;
      // Si es string (URL) y es diferente al original -> Hay cambio
      if (String(original[key]).trim() !== String(current[key]).trim()) return true;
      continue;
    }

    // Comparación estándar de texto
    if (String(original[key]).trim() !== String(current[key]).trim()) return true;
  }
  return false;
}

// ======================================================
//               HOOK PRINCIPAL
// ======================================================

export function useEditarDocumentoLogic() {
  const navigation = useNavigation();
  const route = useRoute();
  const documentoDesdeRuta = route.params?.documentoSeleccionado;
  

  // --- Estados ---
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [documentos, setDocumentos] = useState([]);
  const [documentoSeleccionado, setDocumentoSeleccionado] = useState(null);
  const [originalDocumento, setOriginalDocumento] = useState(null);
  const [empleadosList, setEmpleadosList] = useState([]);
  const [loading, setLoading] = useState(false);

  // ==========================================
  // 2. CARGA INICIAL DE DATOS
  // ==========================================
  
  // Cargar documentos aleatorios para la lista inicial
  const cargarDocumentosAleatorios = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/documentos/aleatorios`);
      const data = await response.json();
      if (data.success && data.documentos) {
        setDocumentos(data.documentos);
      } else {
        setDocumentos([]);
      }
    } catch (error) {
      console.error("Error carga inicial:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Efecto principal: Carga empleados y decide qué mostrar
  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        // 1. Cargar lista de empleados (para el dropdown de responsable)
        const r = await fetch(`${API_URL}/empleados/todos`);
        const d = await r.json();
        if (d.success) setEmpleadosList(d.empleados);

        // 2. Si venimos de la pantalla de consulta, cargamos ese documento
        if (documentoDesdeRuta) {
          const f = formatearDocumento(documentoDesdeRuta);
          setDocumentoSeleccionado(f);
          setOriginalDocumento(f);
        } else {
          // 3. Si no, cargamos la lista aleatoria para buscar
          await cargarDocumentosAleatorios();
        }
      } catch (e) {
        console.error("Error init:", e);
      }
      setLoading(false);
    };
    init();
  }, [documentoDesdeRuta, cargarDocumentosAleatorios]);

  // ==========================================
  // 3. FUNCIONES DE BÚSQUEDA Y SELECCIÓN
  // ==========================================

  const buscarDocumento = useCallback(async () => {
    if (!terminoBusqueda.trim()) {
        cargarDocumentosAleatorios();
        return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/documentos/buscar?termino=${encodeURIComponent(terminoBusqueda)}`);
      const data = await response.json();
      if (data.success && data.documentos.length > 0) {
        setDocumentos(data.documentos);
      } else {
        setDocumentos([]);
        Alert.alert("Sin resultados", "No se encontró el documento.");
      }
    } catch (error) {
      Alert.alert("Error", "Fallo en la búsqueda.");
    } finally {
      setLoading(false);
    }
  }, [terminoBusqueda, cargarDocumentosAleatorios]);

  const seleccionarDocumento = useCallback(async (item) => {
    setLoading(true);
    try {
        // Hacemos fetch por ID para asegurar tener los datos más frescos (especialmente la URL del archivo)
        const id = item.id_documento;
        const response = await fetch(`${API_URL}/documentos/${id}`);
        const data = await response.json();

        if (data.success && data.documento) {
            const f = formatearDocumento(data.documento);
            setDocumentoSeleccionado(f);
            setOriginalDocumento(f);
            setDocumentos([]); // Limpiamos la lista
        } else {
            Alert.alert("Error", "No se pudieron cargar los detalles.");
        }
    } catch (error) {
        Alert.alert("Error", "Fallo de conexión.");
    } finally {
        setLoading(false);
    }
  }, []);

  const deseleccionarDocumento = useCallback(() => {
    setDocumentoSeleccionado(null);
    setOriginalDocumento(null);
    setTerminoBusqueda("");
    cargarDocumentosAleatorios();
  }, [cargarDocumentosAleatorios]);

  // Función auxiliar para setear datos manualmente (usada en el useEffect)
  const setDocumentoDesdeNavegacion = useCallback((docCrudo) => {
    const f = formatearDocumento(docCrudo);
    setDocumentoSeleccionado(f);
    setOriginalDocumento(f);
  }, []);

  // ==========================================
  // 4. MANEJO DE ARCHIVOS Y FORMULARIO
  // ==========================================

  const handleDocumentoChange = useCallback((key, value) => {
    setDocumentoSeleccionado(prev => ({ ...prev, [key]: value }));
  }, []);

  // VISUALIZAR ARCHIVO
  const handleViewFile = useCallback(async (fileUrl) => {
    if (!fileUrl) return Alert.alert("Aviso", "No hay archivo adjunto en este documento.");
    
    // Construimos la URL completa concatenando la base del servidor
    const fullUrl = `${API_URL}${fileUrl}`;
    
    const supported = await Linking.canOpenURL(fullUrl);
    if (supported) {
        await Linking.openURL(fullUrl);
    } else {
        Alert.alert("Error", "No se puede abrir el archivo. Verifique la URL: " + fullUrl);
    }
  }, []);

  // SELECCIONAR ARCHIVO (Por si se habilita el reemplazo en el futuro)
  const handleFileSelect = useCallback(async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: "*/*", copyToCacheDirectory: true });
      if (!result.canceled && result.assets) {
        handleDocumentoChange("archivo", result.assets[0]);
        Alert.alert("Archivo seleccionado", result.assets[0].name);
      }
    } catch {
      Alert.alert("Error", "No se pudo abrir el selector.");
    }
  }, [handleDocumentoChange]);

  // ==========================================
  // 5. GUARDADO (PUT)
  // ==========================================

  const _proceedToSave = async () => {
      const isFileChanged = typeof documentoSeleccionado.archivo === "object";
      const idUsuario = await AsyncStorage.getItem("id_usuario");
      const url = `${API_URL}/documentos/${documentoSeleccionado.id_documento}`;
      
      let body;
      let headers = {};

      if (isFileChanged) {
        // FORM DATA (Si se sube archivo nuevo)
        body = new FormData();
        body.append("nombre_documento", documentoSeleccionado.nombreDocumento);
        body.append("tipo_documento", documentoSeleccionado.tipoDocumento);
        body.append("descripcion", documentoSeleccionado.descripcion);
        body.append("id_responsable", documentoSeleccionado.idResponsable);
        body.append("estado", documentoSeleccionado.estado);
        body.append("updated_by", idUsuario); // Opcional según tu BD
        
        // El archivo nuevo. Nombre clave: 'archivo_doc' (debe coincidir con backend)
        body.append("archivo_doc", { 
            uri: documentoSeleccionado.archivo.uri,
            name: documentoSeleccionado.archivo.name,
            type: documentoSeleccionado.archivo.mimeType || "application/pdf",
        });
        
        // Enviamos la URL vieja por si el backend la necesita para limpiar (opcional)
        body.append("archivo", originalDocumento.archivo || ""); 

      } else {
        // JSON (Si solo cambian textos)
        body = JSON.stringify({
            nombre_documento: documentoSeleccionado.nombreDocumento,
            tipo_documento: documentoSeleccionado.tipoDocumento,
            descripcion: documentoSeleccionado.descripcion,
            id_responsable: documentoSeleccionado.idResponsable,
            estado: documentoSeleccionado.estado,
            archivo: documentoSeleccionado.archivo, // Enviamos la URL string original
            updated_by: idUsuario
        });
        headers["Content-Type"] = "application/json";
      }

      try {
          const response = await fetch(url, { method: "PUT", body, headers });
          const data = await response.json();
          if (data.success) {
              Alert.alert("Éxito", "Documento actualizado correctamente.");
              navigation.goBack();
          } else {
              Alert.alert("Error", data.message || "No se pudo actualizar.");
          }
      } catch (e) {
          Alert.alert("Error", "Fallo de conexión al guardar.");
      }
  };

  const guardarCambios = async () => {
      if (!hasChanges(originalDocumento, documentoSeleccionado)) {
          return Alert.alert("Sin cambios", "No hay nada que guardar.");
      }
      _proceedToSave();
  };

  // ==========================================
  // 6. RETORNO
  // ==========================================
  return {
    terminoBusqueda, setTerminoBusqueda,
    documentos, documentoSeleccionado, setDocumentoDesdeNavegacion,
    empleadosList, loading,
    buscarDocumento, seleccionarDocumento, deseleccionarDocumento,
    guardarCambios, onChange: handleDocumentoChange,
    onFileSelect: handleFileSelect, 
    onViewFile: handleViewFile 
  };
}