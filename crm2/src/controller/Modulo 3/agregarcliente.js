import { useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config/apiConfig"; // Asegúrate de que esta ruta sea correcta

// Función para crear un objeto cliente limpio
function crearClienteVacio() {
  return {
    nombreCliente: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    tipoCliente: "",
    estadoCliente: "",
    sexo: "",
    correoElectronico: "",
    telefono: "",
    calle: "",
    colonia: "",
    ciudad: "",
    estado: "",
    pais: "",
    codigoPostal: "",
    descripcion: "",
  };
}

export function useAgregarClienteLogic() {
  const [cliente, setCliente] = useState(crearClienteVacio());

  // Función para actualizar el estado del cliente
  const handleClienteChange = (key, value) => {
    setCliente(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  // Función para guardar el nuevo cliente
  const guardarNuevoCliente = async () => {
    // 1. Validación básica
    if (!cliente.nombreCliente || !cliente.tipoCliente || !cliente.estadoCliente) {
      Alert.alert("Campos incompletos", "Por favor, llene al menos Nombre, Tipo y Estado del Cliente.");
      return;
    }
    
    // 2. Preparar datos (limpiar espacios extra)
    const dataParaEnviar = {
      ...cliente,
      nombreCliente: cliente.nombreCliente.trim(),
      apellidoPaterno: cliente.apellidoPaterno.trim(),
      apellidoMaterno: cliente.apellidoMaterno.trim(),
      correoElectronico: cliente.correoElectronico.trim(),
      telefono: cliente.telefono.trim(),
      calle: cliente.calle.trim(),
      colonia: cliente.colonia.trim(),
      ciudad: cliente.ciudad.trim(),
      estado: cliente.estado.trim(),
      pais: cliente.pais.trim(),
      codigoPostal: cliente.codigoPostal.trim(),
      descripcion: cliente.descripcion.trim(),
    };

    try {
      // 3. Enviar al backend
      const response = await fetch(`${API_URL}/clientes/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });

      const data = await response.json();

      if (!response.ok || data.success === false) {
        Alert.alert("Error al guardar", data.message || "No se pudo crear el cliente.");
      } else {
        Alert.alert("Éxito", "Cliente guardado correctamente.");
        // Limpiamos el formulario después de guardar
        setCliente(crearClienteVacio());
      }
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
    }
  };

  return {
    cliente,
    onChange: handleClienteChange,
    onGuardar: guardarNuevoCliente,
  };
}