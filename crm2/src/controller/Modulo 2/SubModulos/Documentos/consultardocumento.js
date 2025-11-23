import { useState, useEffect, useCallback } from "react";
import { Alert, Linking } from "react-native";
import { API_URL } from "../../../../config/apiConfig";

// =============================================
// FORMATEADOR COMPLETO
// Convierte los datos crudos de SQL a un objeto limpio para React
// =============================================
function formatearDocumento(d) {
  if (!d) return null;

  return {
    id_documento: d.id_documento || d.idDocumento,
    
    // Mapeo de nombres de columnas SQL (snake_case) a Estado React (camelCase)
    // SQL: nombre_documento -> React: nombreDocumento
    nombreDocumento: (d.nombre_documento || d.nombreDocumento || d.indentificador_unico || "").trim(),
    tipoDocumento: (d.tipo_documento || d.tipoDocumento || d.categoria || "").trim(),
    descripcion: (d.descripcion || d.descripción || "").trim(),
    
    // IDs y Nombres
    idResponsable: d.id_responsable ? d.id_responsable.toString() : "",
    // El backend devuelve 'responsable_nombre' gracias al JOIN con Empleados
    responsableNombre: (d.responsable_nombre || d.empleado_nombre || "").trim(),
    
    estado: (d.estado || "").trim(),
    // Ruta relativa del archivo (ej: /uploads/documentos/doc-123.pdf)
    archivo: (d.archivo || "").trim(), 
  };
}

// ======================================================
// HOOK PRINCIPAL DE CONSULTA
// ======================================================
export function useConsultarDocumentoLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [documentos, setDocumentos] = useState([]); // Lista de resultados
  const [documento, setDocumento] = useState(null); // Documento seleccionado (detalle)
  const [loading, setLoading] = useState(false);
  const [empleadosList, setEmpleadosList] = useState([]);

  // ======================================================
  // CARGA INICIAL
  // ======================================================
  useEffect(() => {
    cargarEmpleados();
    cargarDocumentosAleatorios();
  }, []);

  const cargarEmpleados = async () => {
    try {
      const response = await fetch(`${API_URL}/empleados/todos`);
      const data = await response.json();
      if (data.success) {
        setEmpleadosList(data.empleados);
      }
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    }
  };

  const cargarDocumentosAleatorios = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/documentos/aleatorios`);
      const data = await res.json();

      if (data.success && data.documentos) {
        // Formateamos la lista para que la Vista pueda leer 'nombreDocumento'
        const docsFormateados = data.documentos.map(formatearDocumento);
        setDocumentos(docsFormateados);
      } else {
        setDocumentos([]);
      }
    } catch (error) {
      console.error("Error al cargar aleatorios:", error);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // BUSCAR POR TEXTO
  // ======================================================
  const buscarDocumento = useCallback(async () => {
    if (!terminoBusqueda.trim()) {
      cargarDocumentosAleatorios();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/documentos/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );

      const data = await response.json();

      if (data.success && data.documentos?.length > 0) {
        //  CLAVE: Formateamos también los resultados de búsqueda
        const docsFormateados = data.documentos.map(formatearDocumento);
        setDocumentos(docsFormateados);
      } else {
        setDocumentos([]);
        Alert.alert("Sin resultados", "No se encontró ningún documento con ese criterio.");
      }
    } catch (error) {
      console.error("Error al buscar:", error);
      Alert.alert("Error", "No se pudo realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  }, [terminoBusqueda]);

  // ======================================================
  // SELECCIONAR DE LA LISTA (Obtiene datos completos)
  // ======================================================
  const seleccionarDocumento = useCallback(async (d) => {
    setLoading(true);
    try {
      // Usamos el ID que ya viene formateado o crudo
      const id = d.id_documento;
      const response = await fetch(`${API_URL}/documentos/${id}`);
      const data = await response.json();

      if (data.success && data.documento) {
        // Formateamos el objeto de detalle
        setDocumento(formatearDocumento(data.documento));
      } else {
        Alert.alert("Error", "No se pudieron obtener los datos completos.");
      }
    } catch (error) {
      console.error("Error seleccionar:", error);
      Alert.alert("Error", "Fallo al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  }, []);

  // ======================================================
  // DESELECCIONAR (Volver a la lista)
  // ======================================================
  const deseleccionarDocumento = useCallback(() => {
    setDocumento(null);
    setTerminoBusqueda("");
    cargarDocumentosAleatorios();
  }, []);

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    documentos,
    documento,
    empleadosList,
    loading,
    buscarDocumento,
    seleccionarDocumento,
    deseleccionarDocumento,
  };
}