import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config/apiConfig"; 

// =================================================================
// HELPER: FORMATEAR CLIENTE
// Estandariza datos de DB (snake_case) o previos (camelCase)
// =================================================================
function formatearCliente(c) {
  if (!c) return null;
  return {
    id_cliente: c.id_cliente || c.idCliente,
    // Prioridad: camelCase (Frontend) || snake_case (DB) || Cadena vacía
    nombreCliente: (c.nombreCliente || c.nombre || c.nombre_cliente || "").trim(),
    apellidoPaterno: (c.apellidoPaterno || c.apellido_paterno || "").trim(),
    apellidoMaterno: (c.apellidoMaterno || c.apellido_materno || "").trim(),
    tipoCliente: (c.tipoCliente || c.tipo || c.tipo_cliente || "").trim(),
    estadoCliente: (c.estadoCliente || c.estado_cliente || "").trim(),
    sexo: (c.sexo || "").trim(),
    correoElectronico: (c.correoElectronico || c.correo_electronico || "").trim(),
    telefono: (c.telefono || "").trim(),
    calle: (c.calle || "").trim(),
    colonia: (c.colonia || "").trim(),
    ciudad: (c.ciudad || "").trim(),
    estado: (c.estado || "").trim(),
    pais: (c.pais || "").trim(),
    codigoPostal: (c.codigoPostal || c.codigo_postal || "").trim(),
    descripcion: (c.descripcion || "").trim(),
  };
}

// =================================================================
// HOOK DE LÓGICA: EDITAR CLIENTE
// =================================================================
export function useEditarClienteLogic(clienteInicial = null) {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [clientes, setClientes] = useState([]); // Lista de resultados o sugeridos
  const [loading, setLoading] = useState(false);

  // Formateamos el cliente inicial si viene por props/navegación
  const clienteFormateado = formatearCliente(clienteInicial);

  // Estado del formulario actual
  const [clienteSeleccionado, setClienteSeleccionado] = useState(clienteFormateado);
  
  // Estado original para comparar cambios (Snapshopt)
  const [originalCliente, setOriginalCliente] = useState(clienteFormateado);

  // 1. Efecto de Carga Inicial
  useEffect(() => {
    // Si no nos pasaron un cliente, cargamos aleatorios/sugeridos
    if (!clienteInicial) {
      cargarClientesAleatorios();
    }
  }, [clienteInicial]);

  // 2. Cargar lista de sugerencias (Aleatorios)
  const cargarClientesAleatorios = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/clientes/aleatorios`);
      const data = await response.json();
      
      if (data.success && data.clientes) {
        const formateados = data.clientes.map(c => formatearCliente(c));
        setClientes(formateados);
      } else {
        setClientes([]);
      }
    } catch (error) {
      console.error("Error al cargar aleatorios:", error);
    } finally {
      setLoading(false);
    }
  };

  // 3. Buscar cliente por nombre
  const buscarCliente = async () => {
    // Si está vacío, recargamos aleatorios
    if (!terminoBusqueda.trim()) {
      cargarClientesAleatorios();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/clientes/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );
      const data = await response.json();
      
      if (data.success && data.clientes && data.clientes.length > 0) {
        const formateados = data.clientes.map(c => formatearCliente(c));
        setClientes(formateados);
      } else {
        setClientes([]);
        Alert.alert("Sin resultados", "No se encontró ningún cliente con ese nombre.");
      }

    } catch (error) {
      console.error("Error al buscar cliente:", error);
      Alert.alert("Error", "No se pudo realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  // 4. Seleccionar cliente de la lista (para editar)
  const seleccionarCliente = async (cli) => {
    setLoading(true);
    try {
      // Hacemos fetch del detalle completo para asegurar datos frescos
      const response = await fetch(`${API_URL}/clientes/consultar/${cli.id_cliente}`);
      const data = await response.json();

      if (data.success && data.cliente) {
        const formateado = formatearCliente(data.cliente);
        setClienteSeleccionado(formateado);
        setOriginalCliente(formateado); // Guardamos la referencia original
      } else {
        Alert.alert("Error", "No se pudieron obtener los datos completos del cliente.");
      }
    } catch (error) {
      console.error("Error al seleccionar:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // 5. Deseleccionar / Cancelar edición
  const deseleccionarCliente = () => {
    setClienteSeleccionado(null);
    setOriginalCliente(null);
    setTerminoBusqueda("");
    cargarClientesAleatorios(); // Volvemos a mostrar sugerencias
  };

  // 6. Guardar Cambios (Con validación y detección de cambios)
  const guardarCambios = async () => {
    if (!clienteSeleccionado || !originalCliente) {
      Alert.alert("Error", "No hay datos para guardar.");
      return;
    }

    // A) Validaciones Básicas
    if (!clienteSeleccionado.nombreCliente || !clienteSeleccionado.tipoCliente || !clienteSeleccionado.estadoCliente) {
      Alert.alert("Campos incompletos", "El Nombre, Tipo y Estado son obligatorios.");
      return;
    }

    // B) Detectar diferencias
    const fieldDisplayNames = {
      nombreCliente: "Nombre",
      apellidoPaterno: "Apellido Paterno",
      apellidoMaterno: "Apellido Materno",
      tipoCliente: "Tipo",
      estadoCliente: "Estado",
      sexo: "Sexo",
      correoElectronico: "Email",
      telefono: "Teléfono",
      calle: "Calle",
      colonia: "Colonia",
      ciudad: "Ciudad",
      estado: "Estado/Provincia",
      pais: "País",
      codigoPostal: "C.P.",
      descripcion: "Descripción"
    };

    const cambios = [];
    for (const key in clienteSeleccionado) {
      if (key === 'id_cliente') continue; 

      const valActual = clienteSeleccionado[key] || "";
      const valOriginal = originalCliente[key] || "";

      if (valActual !== valOriginal) {
        cambios.push(fieldDisplayNames[key] || key);
      }
    }

    if (cambios.length === 0) {
      Alert.alert("Sin cambios", "No se ha realizado ninguna modificación.");
      return;
    }

    // C) Alerta de Confirmación
    Alert.alert(
      "Confirmar Cambios",
      `Se modificarán los siguientes campos:\n\n• ${cambios.join("\n• ")}\n\n¿Desea continuar?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Guardar",
          onPress: async () => {
            // D) Ejecutar Guardado
            try {
              // Preparamos el payload asegurando strings limpios
              const payload = {};
              Object.keys(clienteSeleccionado).forEach(key => {
                payload[key] = typeof clienteSeleccionado[key] === 'string' 
                  ? clienteSeleccionado[key].trim() 
                  : clienteSeleccionado[key];
              });

              const response = await fetch(`${API_URL}/clientes/editar/${clienteSeleccionado.id_cliente}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
              });

              const data = await response.json();
              
              if (data.success) {
                Alert.alert("Éxito", "Información actualizada correctamente.");
                // Resetear flujo
                setClienteSeleccionado(null);
                setOriginalCliente(null);
                cargarClientesAleatorios();
              } else {
                Alert.alert("Error", data.message || "No se pudo actualizar el cliente.");
              }
            } catch (error) {
              console.error("Error al guardar:", error);
              Alert.alert("Error de Conexión", "Ocurrió un problema al intentar guardar.");
            }
          }
        }
      ]
    );
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    clientes,            // Para la lista visual
    clienteSeleccionado, // Para el formulario
    setClienteSeleccionado,
    loading,
    buscarCliente,
    seleccionarCliente,
    guardarCambios,
    deseleccionarCliente,
  };
}