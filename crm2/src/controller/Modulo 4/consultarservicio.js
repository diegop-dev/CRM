import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config/apiConfig";

// =============================================
// FORMATEADOR COMPLETO (INCLUYE RUTA ABSOLUTA)
// =============================================
function formatearServicio(s) {
  if (!s) return null;

  const archivoRuta = s.archivo ? s.archivo.trim() : "";

  return {
    id_servicio: s.id_servicio || s.idServicio,
    nombreServicio: (s.nombre_servicio || s.nombreServicio || "").trim(),
    descripcion: (s.descripcion || "").trim(),
    categoria: (s.categoria || "").trim(),
    precio: s.precio ? String(s.precio) : "",
    moneda: (s.moneda || "").trim(),
    duracionEstimada: (s.duracion_estimada || s.duracionEstimada || "").trim(),
    estado: (s.estado || "").trim(),
    id_responsable: s.id_responsable || s.idResponsable || "",
    responsableNombre: (s.responsable_nombre || s.responsableNombre || "").trim(),
    notasInternas: (s.notas_internas || s.notasInternas || "").trim(),

    //  URL ABSOLUTA PARA VISOR DE PDF/IMÁGENES
    archivo: archivoRuta
      ? `${API_URL}${archivoRuta.startsWith("/") ? archivoRuta : `/${archivoRuta}`}`
      : "",
  };
}

// ======================================================
// HOOK PRINCIPAL DE CONSULTA DE SERVICIOS
// ======================================================
export function useConsultarServicioLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [servicios, setServicios] = useState([]);
  const [servicio, setServicio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [empleadosList, setEmpleadosList] = useState([]);

  // ======================================================
  // CARGA INICIAL (empleados + servicios aleatorios)
  // ======================================================
  useEffect(() => {
    cargarEmpleados();
    cargarServiciosAleatorios();
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
  // CARGAR SERVICIOS ALEATORIOS
  // ======================================================
  const cargarServiciosAleatorios = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/servicios/aleatorios`);
      const data = await res.json();

      if (data.success && data.servicios) {
        setServicios(data.servicios);
      } else {
        setServicios([]);
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
  const buscarServicio = async () => {
    if (!terminoBusqueda.trim()) {
      cargarServiciosAleatorios();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/servicios/buscar?termino=${encodeURIComponent(
          terminoBusqueda
        )}`
      );

      const data = await response.json();

      if (response.ok && data.success && data.servicios.length > 0) {
        setServicios(data.servicios);
      } else {
        setServicios([]);
        Alert.alert(
          "Sin resultados",
          data.message || "No se encontró ningún servicio."
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
  const seleccionarServicio = async (s) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/servicios/${s.id_servicio || s.idServicio}`
      );

      const data = await response.json();

      if (data.success && data.servicio) {
        setServicio(formatearServicio(data.servicio));
      } else {
        Alert.alert(
          "Error",
          "No se pudieron obtener los datos completos del servicio."
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
  const deseleccionarServicio = () => {
    setServicio(null);
    setTerminoBusqueda("");
    cargarServiciosAleatorios();
  };

  // ======================================================
  // RETORNO DEL HOOK
  // ======================================================
  return {
    terminoBusqueda,
    setTerminoBusqueda,
    servicios,
    servicio,
    empleadosList,
    loading,
    buscarServicio,
    seleccionarServicio,
    deseleccionarServicio,
  };
}
