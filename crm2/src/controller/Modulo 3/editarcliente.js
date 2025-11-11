// src/controller/.../editarcliente.js
import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config/apiConfig";

// 1. CAMBIO: Renombrado a 'formatearCliente'
// Se eliminan campos de fecha de nac, rfc, curp, nss, rol, usuario, etc.
// Se añaden/renombran campos como nombreCliente, tipoCliente, estadoCliente, pais, descripcion.
function formatearCliente(c) {
  if (!c) return null;

  // --- Lógica de Fecha Eliminada ---

  // Se usa .trim() en todos los campos de texto para
  // quitar los espacios en blanco al *cargarlos*.
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

// CAMBIO: Renombrado a 'useEditarClienteLogic'
export function useEditarClienteLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  // CAMBIO: 'empleados' -> 'clientes'
  const [clientes, setClientes] = useState([]);
  // CAMBIO: 'empleadoSeleccionado' -> 'clienteSeleccionado'
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // CAMBIO: 'cargarEmpleadosAleatorios' -> 'cargarClientesAleatorios'
    cargarClientesAleatorios();
  }, []);

  // CAMBIO: Función renombrada y adaptada
  const setClienteDesdeNavegacion = (clienteCrudo) => {
    // 2. Usamos la función formateadora de cliente
    setClienteSeleccionado(formatearCliente(clienteCrudo));
  };

  // CAMBIO: 'cargarEmpleadosAleatorios' -> 'cargarClientesAleatorios'
  const cargarClientesAleatorios = async () => {
    setLoading(true);
    try {
      // CAMBIO: Endpoint actualizado
      const response = await fetch(`${API_URL}/clientes/aleatorios`);
      const data = await response.json();
      // CAMBIO: 'data.empleados' -> 'data.clientes'
      if (data.success && data.clientes) {
        setClientes(data.clientes);
      } else {
        setClientes([]);
      }
    } catch (error) {
      // CAMBIO: Mensaje de error
      console.error("Error al cargar clientes:", error);
    } finally {
      setLoading(false);
    }
  };

  // CAMBIO: 'buscarEmpleado' -> 'buscarCliente'
  const buscarCliente = async () => {
    if (!terminoBusqueda.trim()) {
      // CAMBIO: Carga aleatorios de clientes
      cargarClientesAleatorios();
      return;
    }
    setLoading(true);
    try {
      // CAMBIO: Endpoint actualizado
      const response = await fetch(
        `${API_URL}/clientes/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );
      const data = await response.json();
      // CAMBIO: 'data.empleados' -> 'data.clientes'
      if (!data.success || !data.clientes?.length) {
        setClientes([]);
        // CAMBIO: Mensaje de alerta
        Alert.alert("Sin resultados", "No se encontró ningún cliente.");
        return;
      }
      setClientes(data.clientes);
    } catch (error) {
      // CAMBIO: Mensaje de error
      console.error("Error al buscar cliente:", error);
      Alert.alert("Error", "No se pudo realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  // CAMBIO: 'seleccionarEmpleado' -> 'seleccionarCliente'
  const seleccionarCliente = async (cli) => {
    setLoading(true);
    try {
      // CAMBIO: Endpoint y ID actualizados
      const response = await fetch(
        `${API_URL}/clientes/consultar/${cli.id_cliente || cli.idCliente}`
      );
      const rawResponse = await response.text();
      const data = JSON.parse(rawResponse);

      // CAMBIO: 'data.empleado' -> 'data.cliente'
      if (data.success && data.cliente) {
        // 3. Usamos la función formateadora de cliente
        setClienteSeleccionado(formatearCliente(data.cliente));
      } else {
        // CAMBIO: Mensaje de alerta
        Alert.alert("Error", "No se pudieron obtener los datos del cliente.");
      }
    } catch (error) {
      // CAMBIO: Mensaje de error
      console.error("Error al obtener datos del cliente:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Guardar cambios
  const guardarCambios = async () => {
    // CAMBIO: Verificación de 'clienteSeleccionado'
    if (!clienteSeleccionado) {
      Alert.alert("Error", "Debe seleccionar un cliente primero.");
      return;
    }

    // CAMBIO: .trim() aplicado a los campos de cliente
    const dataParaEnviar = {
      ...clienteSeleccionado,
      nombreCliente: (clienteSeleccionado.nombreCliente || "").trim(),
      apellidoPaterno: (clienteSeleccionado.apellidoPaterno || "").trim(),
      apellidoMaterno: (clienteSeleccionado.apellidoMaterno || "").trim(),
      correoElectronico: (clienteSeleccionado.correoElectronico || "").trim(),
      calle: (clienteSeleccionado.calle || "").trim(),
      colonia: (clienteSeleccionado.colonia || "").trim(),
      ciudad: (clienteSeleccionado.ciudad || "").trim(),
      estado: (clienteSeleccionado.estado || "").trim(),
      pais: (clienteSeleccionado.pais || "").trim(),
    };
    // --- FIN DEL BLOQUE DE SEGURIDAD ---

    // CAMBIO: 'id_empleado' -> 'id_cliente'
    const id = dataParaEnviar.id_cliente;

    try {
      // 4. CAMBIO: Endpoint actualizado
      const response = await fetch(`${API_URL}/clientes/editar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar), // Enviamos la data "limpia"
      });

      const rawResponse = await response.text();
      console.log("Respuesta CRUDA de 'guardarCambios':", rawResponse);
      const data = JSON.parse(rawResponse);

      if (data.success) {
        // CAMBIO: Mensaje de alerta
        Alert.alert("Éxito", "Cliente actualizado correctamente.");
        setClienteSeleccionado(null);
        cargarClientesAleatorios();
      } else {
        Alert.alert("Error", data.message || "No se pudieron guardar los cambios.");
      }
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      Alert.alert("Error de Servidor", "Error al guardar. Revisa la consola.");
    }
  };

  // CAMBIO: 'deseleccionarEmpleado' -> 'deseleccionarCliente'
  const deseleccionarCliente = () => {
    setClienteSeleccionado(null);
  };

  // CAMBIO: Retorno de valores adaptados
  return {
    terminoBusqueda,
    setTerminoBusqueda,
    clientes,
    clienteSeleccionado,
    setClienteSeleccionado,
    setClienteDesdeNavegacion,
    loading,
    buscarCliente,
    seleccionarCliente,
    guardarCambios,
    deseleccionarCliente,
  };
}
