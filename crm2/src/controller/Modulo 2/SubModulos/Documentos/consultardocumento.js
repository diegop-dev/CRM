import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../../../config/apiConfig";

// =============================================
// FORMATEADOR COMPLETO (INCLUYE RUTA ABSOLUTA)
// =============================================
function formatearDocumento(d) {
  if (!d) return null;

  const archivoRuta = d.archivo ? d.archivo.trim() : "";

  return {
    id_documento: d.id_documento || d.idDocumento,
    indentificadorUnico: (d.indentificador_unico || d.indentificadorUnico || "").trim(),
    descripcion: (d.descripción || d.descripcion || "").trim(), // Lee la clave con tilde
    categoria: (d.categoria || "").trim(),
    estado: (d.estado || "").trim(),
    idEmpleado: d.id_empleado || d.idEmpleado || "",
    empleadoNombre: (d.empleado_nombre || d.empleadoNombre || "").trim(),

    // URL ABSOLUTA PARA VISOR DE PDF
    archivo: archivoRuta
      ? `${API_URL}${archivoRuta.startsWith("/") ? archivoRuta : `/${archivoRuta}`}`
      : "",
  };
}

// ======================================================
// HOOK PRINCIPAL DE CONSULTA DE DOCUMENTOS
// ======================================================
export function useConsultarDocumentoLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [documentos, setDocumentos] = useState([]);
  const [documento, setDocumento] = useState(null);
  const [loading, setLoading] = useState(false);
  const [empleadosList, setEmpleadosList] = useState([]);

  // ======================================================
  // CARGA INICIAL (empleados + documentos aleatorios)
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

  // ======================================================
  // CARGAR DOCUMENTOS ALEATORIOS
  // ======================================================
  const cargarDocumentosAleatorios = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/documentos/aleatorios`);
      const data = await res.json();

      if (data.success && data.documentos) {
        setDocumentos(data.documentos);
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
  const buscarDocumento = async () => {
    if (!terminoBusqueda.trim()) {
      cargarDocumentosAleatorios();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/documentos/buscar?termino=${encodeURIComponent(
          terminoBusqueda
        )}`
      );

      const data = await response.json();

      if (response.ok && data.success && data.documentos.length > 0) {
        setDocumentos(data.documentos);
      } else {
        setDocumentos([]);
        Alert.alert(
          "Sin resultados",
          data.message || "No se encontró ningún documento."
        );
      }
    } catch (error) {
      console.error("Error al buscar:", error);
      Alert.alert("Error", "No se pudo realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // SELECCIONAR DE LA LISTA (Obtiene datos completos)
  // ======================================================
  const seleccionarDocumento = async (d) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/documentos/${d.id_documento || d.idDocumento}`
      );

      const data = await response.json();

      if (data.success && data.documento) {
        setDocumento(formatearDocumento(data.documento));
      } else {
        Alert.alert(
          "Error",
          "No se pudieron obtener los datos completos del documento."
        );
      }
    } catch (error) {
      console.error("Error seleccionar:", error);
      Alert.alert("Error", "Fallo al conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // DESELECCIONAR
  // ======================================================
  const deseleccionarDocumento = () => {
    setDocumento(null);
    setTerminoBusqueda("");
    cargarDocumentosAleatorios();
  };

  // ======================================================
  // RETORNO DEL HOOK
  // ======================================================
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
