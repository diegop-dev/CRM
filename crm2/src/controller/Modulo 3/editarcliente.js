import { useState, useEffect } from "react";
// Eliminamos Alert
import { API_URL } from "../../config/apiConfig"; 

// =================================================================
// HELPER: FORMATEAR CLIENTE
// =================================================================
function formatearCliente(c) {
  if (!c) return null;
  return {
    id_cliente: c.id_cliente || c.idCliente,
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
  const [clientes, setClientes] = useState([]); // Lista de resultados
  const [loading, setLoading] = useState(false);

  // Formateamos el cliente inicial
  const clienteFormateado = formatearCliente(clienteInicial);

  // Estado del formulario actual y original (Snapshot)
  const [clienteSeleccionado, setClienteSeleccionado] = useState(clienteFormateado);
  const [originalCliente, setOriginalCliente] = useState(clienteFormateado);

  // --- NUEVO ESTADO PARA EL MODAL DE FEEDBACK ---
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info", // 'success', 'error', 'warning', 'question'
    onConfirm: null,
  });

  // Helper para mostrar modal
  const showModal = (title, message, type = "info", onConfirmAction = null) => {
    setFeedbackModal({
      visible: true,
      title,
      message,
      type,
      onConfirm: onConfirmAction,
    });
  };

  // Helper para cerrar modal
  const closeFeedbackModal = () => {
    setFeedbackModal((prev) => ({ ...prev, visible: false, onConfirm: null }));
  };

  // 1. Efecto de Carga Inicial
  useEffect(() => {
    if (!clienteInicial) {
      cargarClientesAleatorios();
    }
  }, [clienteInicial]);

  // 2. Cargar lista de sugerencias
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
        showModal("Sin resultados", "No se encontró ningún cliente con ese nombre.", "warning");
      }

    } catch (error) {
      console.error("Error al buscar cliente:", error);
      showModal("Error", "No se pudo realizar la búsqueda.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 4. Seleccionar cliente
  const seleccionarCliente = async (cli) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/clientes/consultar/${cli.id_cliente}`);
      const data = await response.json();

      if (data.success && data.cliente) {
        const formateado = formatearCliente(data.cliente);
        setClienteSeleccionado(formateado);
        setOriginalCliente(formateado); 
      } else {
        showModal("Error", "No se pudieron obtener los datos completos del cliente.", "error");
      }
    } catch (error) {
      console.error("Error al seleccionar:", error);
      showModal("Error", "No se pudo conectar con el servidor.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 5. Deseleccionar
  const deseleccionarCliente = () => {
    setClienteSeleccionado(null);
    setOriginalCliente(null);
    setTerminoBusqueda("");
    cargarClientesAleatorios(); 
  };

  // --- LÓGICA DE GUARDADO (API) ---
  const executeSave = async () => {
      closeFeedbackModal(); // Cerramos pregunta

      try {
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
          showModal("Éxito", "Información actualizada correctamente.", "success");
          // Resetear flujo
          setClienteSeleccionado(null);
          setOriginalCliente(null);
          cargarClientesAleatorios();
        } else {
          showModal("Error", data.message || "No se pudo actualizar el cliente.", "error");
        }
      } catch (error) {
        console.error("Error al guardar:", error);
        showModal("Error de Conexión", "Ocurrió un problema al intentar guardar.", "error");
      }
  };

  // 6. Guardar Cambios (Con validación)
  const guardarCambios = async () => {
    if (!clienteSeleccionado || !originalCliente) {
      showModal("Error", "No hay datos para guardar.", "error");
      return;
    }

    // A) Validaciones
    if (!clienteSeleccionado.nombreCliente || !clienteSeleccionado.tipoCliente || !clienteSeleccionado.estadoCliente) {
      showModal("Campos incompletos", "El Nombre, Tipo y Estado son obligatorios.", "warning");
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
      showModal("Sin cambios", "No se ha realizado ninguna modificación.", "info");
      return;
    }

    // C) Modal de Confirmación
    showModal(
        "Confirmar Cambios",
        `Se modificarán los siguientes campos:\n\n• ${cambios.join("\n• ")}\n\n¿Desea continuar?`,
        "question",
        executeSave
    );
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    clientes,            
    clienteSeleccionado, 
    setClienteSeleccionado,
    loading,
    buscarCliente,
    seleccionarCliente,
    guardarCambios,
    deseleccionarCliente,
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal
  };
}
