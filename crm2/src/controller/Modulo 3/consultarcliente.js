import { useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config/apiConfig";

// --- INICIO DE LA ACTUALIZACIÓN ---
// 1. CAMBIO: Renombrado a 'formatearCliente'
// Se eliminan campos de fecha, rfc, curp, nss, rol, usuario, etc.
// Se adaptan los campos a los del cliente.
function formatearCliente(c) {
  if (!c) return null;

  // --- Lógica de Fecha Eliminada ---

  // Usamos .trim() en todos los campos de texto
  return {
    id_cliente: c.id_cliente || c.idCliente,
    nombreCliente: (c.nombre_cliente || "").trim(),
    apellidoPaterno: (c.apellido_paterno || "").trim(),
    apellidoMaterno: (c.apellido_materno || "").trim(),
    tipoCliente: (c.tipo_cliente || "").trim(),
    estadoCliente: (c.estado_cliente || "").trim(),
    sexo: (c.sexo || "").trim(),
    correoElectronico: (c.correo_electronico || "").trim(),
    telefono: (c.telefono || "").trim(),
    calle: (c.calle || "").trim(),
    colonia: (c.colonia || "").trim(),
    ciudad: (c.ciudad || "").trim(),
    estado: (c.estado || "").trim(),
    pais: (c.pais || "").trim(),
    codigoPostal: (c.codigo_postal || "").trim(),
    descripcion: (c.descripcion || "").trim(),
  };
}
// --- FIN DE LA ACTUALIZACIÓN ---


// CAMBIO: Renombrado a 'useConsultarClienteLogic'
export function useConsultarClienteLogic() {
  // CAMBIO: 'nombreUsuario' -> 'terminoBusqueda' (para coincidir con el JSX)
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  // CAMBIO: 'empleado' -> 'cliente'
  const [cliente, setCliente] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // CAMBIO: 'editable' y 'confirmarEdicion' eliminados,
  // ya que la vista 'consultarcliente.jsx' no los usa.
  // La lógica de "editar" se maneja en 'handleTouchDisabled' en la vista.

  // CAMBIO: 'buscarEmpleado' -> 'buscarCliente'
  const buscarCliente = async () => {
    // CAMBIO: 'nombreUsuario' -> 'terminoBusqueda'
    if (!terminoBusqueda.trim()) {
      // CAMBIO: Mensaje actualizado
      Alert.alert("Atención", "Ingrese un nombre de cliente para buscar.");
      return;
    }

    try {
      setLoading(true);
      // CAMBIO: Endpoint actualizado para buscar clientes por término (nombre)
      const response = await fetch(
        `${API_URL}/clientes/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );

      const data = await response.json();

      // CAMBIO: Verificación de 'data.clientes' (si la búsqueda devuelve un array)
      // o 'data.cliente' (si devuelve un objeto único).
      // Asumiremos que devuelve un *único* cliente o el primero de la lista.
      const clienteEncontrado = data.cliente || (data.clientes && data.clientes[0]);

      if (response.ok && data.success && clienteEncontrado) {
        // --- INICIO DE LA ACTUALIZACIÓN ---
        // 2. Usamos la función formateadora de cliente
        setCliente(formatearCliente(clienteEncontrado)); // <-- ¡CAMBIO CLAVE!
        // --- FIN DE LA ACTUALIZACIÓN ---
      } else {
        // CAMBIO: Mensaje actualizado
        Alert.alert("Sin resultados", data.message || "No se encontró ningún cliente con ese nombre.");
      }
    } catch (error) {
      console.error("Error:", error);
      // CAMBIO: Mensaje actualizado
      Alert.alert("Error", "No se pudo obtener el cliente.");
    } finally {
      setLoading(false);
    }
  };

  // CAMBIO: 'deseleccionarEmpleado' -> 'deseleccionarCliente'
  const deseleccionarCliente = () => {
   setCliente(null);
   setTerminoBusqueda(""); // 'setNombreUsuario' -> 'setTerminoBusqueda'
  };

  // CAMBIO: Retorno de valores actualizados
  return {
    terminoBusqueda,
    setTerminoBusqueda,
    cliente,
    loading,
    editable: false, // Se mantiene 'false' por si el FormView lo necesita
    buscarCliente,
    deseleccionarCliente,
  };
}
