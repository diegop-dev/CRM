import { useState, useEffect } from "react";
// Eliminamos Alert
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../config/apiConfig";

// Helper para mapear los datos
function formatearCliente(c) {
  if (!c) return null;
  return {
    id_cliente: c.id_cliente,
    nombreCliente: (c.nombre || c.nombre_cliente || "").trim(),
    apellidoPaterno: (c.apellido_paterno || "").trim(),
    apellidoMaterno: (c.apellido_materno || "").trim(),
    tipoCliente: (c.tipo || c.tipo_cliente || "").trim(),
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

export function useConsultarClienteLogic() {
  const navigation = useNavigation();
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [cliente, setCliente] = useState(null); // Cliente seleccionado
  const [clientesAleatorios, setClientesAleatorios] = useState([]); // Lista inicial
  const [loading, setLoading] = useState(false);

  // --- NUEVO ESTADO PARA EL MODAL DE FEEDBACK ---
  const [feedbackModal, setFeedbackModal] = useState({
    visible: false,
    title: "",
    message: "",
    type: "info", // 'success', 'error', 'warning', 'question'
    onConfirm: null,
  });

  // Función auxiliar para mostrar el modal
  const showModal = (title, message, type = "info", onConfirmAction = null) => {
    setFeedbackModal({
      visible: true,
      title,
      message,
      type,
      onConfirm: onConfirmAction,
    });
  };

  // Función auxiliar para cerrar el modal
  const closeFeedbackModal = () => {
    setFeedbackModal((prev) => ({ ...prev, visible: false, onConfirm: null }));
  };

  // 1. Cargar clientes aleatorios al iniciar
  useEffect(() => {
    async function fetchAleatorios() {
      try {
        const response = await fetch(`${API_URL}/clientes/aleatorios`);
        const data = await response.json();
        if (data.success) {
          const formateados = data.clientes.map(c => formatearCliente(c));
          setClientesAleatorios(formateados);
        }
      } catch (error) {
        console.error("Error al cargar aleatorios:", error);
        // Opcional: showModal("Error", "No se pudieron cargar sugerencias", "error");
      }
    }
    fetchAleatorios();
  }, []);

  // 2. Buscar cliente por nombre
  const buscarCliente = async (terminoOpcional) => {
    const termino = terminoOpcional || terminoBusqueda;
    if (!termino.trim()) {
      showModal("Atención", "Ingrese un nombre para buscar.", "warning");
      return;
    }

    setLoading(true);
    setCliente(null); 

    try {
      const response = await fetch(`${API_URL}/clientes/buscar?termino=${encodeURIComponent(termino)}`);
      const data = await response.json();

      if (data.success && data.clientes && data.clientes.length > 0) {
        setCliente(formatearCliente(data.clientes[0]));
      } else {
        showModal("Sin resultados", "No se encontró ningún cliente.", "warning");
      }
    } catch (error) {
      console.error("Error al buscar:", error);
      showModal("Error", "No se pudo conectar con el servidor.", "error");
    } finally {
      setLoading(false);
    }
  };

  // 3. Manejar clic en campo bloqueado -> Redirigir a Editar
  const handleRequestEdit = () => {
    // Usamos el modal tipo 'question' con callback
    showModal(
        "Modo Consulta",
        "Este formulario es de solo lectura. ¿Desea editar este cliente?",
        "question",
        () => {
            // Acción al confirmar (Sí)
            closeFeedbackModal();
            navigation.navigate("EditarCliente", { cliente: cliente });
        }
    );
  };

  // 4. Limpiar búsqueda
  const limpiarBusqueda = () => {
    setCliente(null);
    setTerminoBusqueda("");
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    cliente,
    clientesAleatorios,
    loading,
    buscarCliente,
    handleRequestEdit,
    limpiarBusqueda,
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal
  };
}
