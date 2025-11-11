import { useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config/apiConfig";

// CAMBIO: Renombrado a 'crearClienteVacio'
// Adaptado con los campos del formulario de cliente (en camelCase)
function crearClienteVacio() {
  const c = {}; // Objeto vacío (respetando la lógica original)
  return {
    idCliente: "",
    nombreCliente: (c.nombreCliente || "").trim(),
    apellidoPaterno: (c.apellidoPaterno || "").trim(),
    apellidoMaterno: (c.apellidoMaterno || "").trim(),
    tipoCliente: (c.tipoCliente || "").trim(),
    estadoCliente: (c.estadoCliente || "").trim(),
    sexo: (c.sexo || "").trim(),
    correoElectronico: (c.correoElectronico || "").trim(),
    telefono: (c.telefono || "").trim(),
    calle: (c.calle || "").trim(),
    colonia: (c.colonia || "").trim(),
    ciudad: (c.ciudad || "").trim(),
    estado: (c.estado || "").trim(),
    pais: (c.pais || "").trim(),
    codigoPostal: (c.codigoPostal || "").trim(),
    descripcion: (c.descripcion || "").trim(),
  };
}

// CAMBIO: Renombrado a 'useAgregarClienteLogic'
export function useAgregarClienteLogic() {
  // CAMBIO: 'empleado' -> 'cliente'
  const [cliente, setCliente] = useState(crearClienteVacio());

  // CAMBIO: 'handleEmpleadoChange' -> 'handleClienteChange'
  const handleClienteChange = (key, value) => {
    // CAMBIO: 'setEmpleado' -> 'setCliente'
    setCliente(prevState => ({
      ...prevState, // Mantiene todos los valores antiguos
      [key]: value   // Sobrescribe solo el valor que cambió
    }));
  };

  // CAMBIO: 'guardarNuevoEmpleado' -> 'guardarNuevoCliente'
  const guardarNuevoCliente = async () => {

    // CAMBIO: Validación actualizada para campos de cliente
    if (!cliente.nombreCliente || !cliente.tipoCliente || !cliente.estadoCliente) {
      Alert.alert("Campos incompletos", "Por favor, llene al menos Nombre, Tipo y Estado del Cliente.");
      return;
    }
    
    // CAMBIO: Objeto 'dataParaEnviar' adaptado a cliente
    // (Asumiendo que la API recibe camelCase, como en el original)
    const dataParaEnviar = {
      ...cliente,
      nombreCliente: cliente.nombreCliente.trim(),
      apellidoPaterno: cliente.apellidoPaterno.trim(),
      apellidoMaterno: cliente.apellidoMaterno.trim(),
      // Añadimos trim() a otros campos de texto
      correoElectronico: cliente.correoElectronico.trim(),
      calle: cliente.calle.trim(),
      colonia: cliente.colonia.trim(),
      ciudad: cliente.ciudad.trim(),
      estado: cliente.estado.trim(),
      pais: cliente.pais.trim(),
    };

    try {
      // CAMBIO: Endpoint actualizado a '/clientes/guardar'
      const response = await fetch(`${API_URL}/clientes/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });

      const data = await response.json();

      // CAMBIO: Mensajes de alerta actualizados
      if (!response.ok || data.success === false) {
        Alert.alert("Error al guardar", data.message || "No se pudo crear el cliente.");
      } else {
        Alert.alert("Éxito", "Cliente guardado correctamente.");
        // CAMBIO: Limpiamos el formulario de cliente
        setCliente(crearClienteVacio());
      }
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
    }
  };

  return {
    // CAMBIO: Retornamos 'cliente'
    cliente,
    // CAMBIO: Retornamos 'handleClienteChange'
    onChange: handleClienteChange,
    // CAMBIO: Retornamos 'guardarNuevoCliente'
    onGuardar: guardarNuevoCliente,
  };
}
