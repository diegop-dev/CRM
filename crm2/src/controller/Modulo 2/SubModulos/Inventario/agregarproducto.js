import { useState } from "react";
// Eliminamos Alert
import { API_URL } from "../../../../config/apiConfig";

function crearProductoVacio() {
  return {
    id_producto: "",
    nombreProducto: "",
    descripcion: "",
    categoria: "",
    cantidadStock: "",
    precioUnitario: "",
    proveedor: "",
    estadoProducto: "",
    fechaIngreso: "", // Opcional, a veces se maneja automático en backend
  };
}

export function useAgregarProductoLogic() {
  const [producto, setProducto] = useState(crearProductoVacio());

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

  const handleProductoChange = (key, value) => {
    setProducto((prevState) => ({
      ...prevState,
      [key]: value,
    }));
  };

  // --- LÓGICA DE GUARDADO (API) ---
  const executeSave = async () => {
    closeFeedbackModal(); // Cerramos el modal de pregunta

    // Preparamos los datos (convertir números si es necesario)
    const dataParaEnviar = {
      nombreProducto: producto.nombreProducto.trim(),
      descripcion: producto.descripcion.trim(),
      categoria: producto.categoria,
      cantidadStock: parseInt(producto.cantidadStock) || 0,
      precioUnitario: parseFloat(producto.precioUnitario) || 0.0,
      proveedor: producto.proveedor.trim(),
      estadoProducto: producto.estadoProducto,
      // fechaIngreso: ... (si la manejas manual)
    };

    try {
      // Asumiendo ruta POST /productos
      const response = await fetch(`${API_URL}/productos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        showModal("Error al guardar", data.message || "No se pudo crear el producto.", "error");
      } else {
        showModal("Éxito", "Producto agregado correctamente al inventario.", "success");
        setProducto(crearProductoVacio()); // Limpiamos formulario
      }
    } catch (error) {
      console.error("Error al guardar producto:", error);
      showModal("Error de Conexión", "No se pudo conectar con el servidor.", "error");
    }
  };

  // --- FUNCIÓN PRINCIPAL (Validación + Pregunta) ---
  const guardarNuevoProducto = async () => {
    // 1. Validaciones básicas
    if (!producto.nombreProducto || !producto.precioUnitario || !producto.cantidadStock) {
      showModal(
        "Campos incompletos", 
        "El nombre, precio y cantidad de stock son obligatorios.", 
        "warning"
      );
      return;
    }

    // 2. Pregunta de confirmación
    showModal(
      "Confirmar Guardado",
      "¿Está seguro de que desea agregar este nuevo producto al inventario?",
      "question",
      executeSave // Callback si confirman
    );
  };

  return {
    producto,
    onChange: handleProductoChange,
    onGuardar: guardarNuevoProducto,
    // Exportamos el modal
    feedbackModal,
    closeFeedbackModal,
  };
}
