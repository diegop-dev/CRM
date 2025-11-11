import { useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../../../config/apiConfig";

// Usamos la misma función de 'editarempleado.js' para crear un
// objeto 'empleado' limpio, vacío y en camelCase.
function crearEmpleadoVacio() {
  const e = {}; // Objeto vacío
  return {
    id_empleado: "",
    nombres: (e.nombres || "").trim(),
    apellidoPaterno: (e.apellido_paterno || "").trim(),
    apellidoMaterno: (e.apellido_materno || "").trim(),
    diaNacimiento: "",
    mesNacimiento: "",
    añoNacimiento: "",
    sexo: (e.sexo || "").trim(),
    rfc: (e.rfc || "").trim(),
    curp: (e.curp || "").trim(),
    nss: (e.nss || "").trim(),
    telefono: (e.telefono || "").trim(),
    correoElectronico: (e.correo_electronico || "").trim(),
    calle: (e.calle || "").trim(),
    colonia: (e.colonia || "").trim(),
    ciudad: (e.ciudad || "").trim(),
    estado: (e.estado || "").trim(),
    codigoPostal: (e.codigo_postal || "").trim(),
    rol: (e.rol || "").trim(),
    estadoEmpleado: (e.estado_empleado || "").trim(),
    nombreUsuario: (e.nombre_usuario || "").trim(),
    contraseña: e.contraseña || "",
    observaciones: (e.observaciones || "").trim(),
  };
}

export function useAgregarEmpleadoLogic() {
  // El estado ahora se maneja aquí, no dentro del formulario
  const [empleado, setEmpleado] = useState(crearEmpleadoVacio());

  // 👇 --- ¡CAMBIO CLAVE! ---
  // Esta es la función que SÍ actualiza el estado correctamente.
  // Recibe la 'llave' (ej: 'nombres') y el 'valor' (ej: 'Juan')
  const handleEmpleadoChange = (key, value) => {
    // Usamos el 'prevState' para asegurarnos de no perder los otros datos
    setEmpleado(prevState => ({
      ...prevState, // Mantiene todos los valores antiguos
      [key]: value   // Sobrescribe solo el valor que cambió
    }));
  };
  // --- FIN DEL CAMBIO ---


  // Esta es la función de 'guardar' que pasaremos al formulario
  const guardarNuevoEmpleado = async () => {

    // --- Validación simple en el frontend ---
    if (!empleado.nombres || !empleado.apellidoPaterno || !empleado.nombreUsuario || !empleado.contraseña) {
      Alert.alert("Campos incompletos", "Por favor, llene al menos Nombres, Apellido Paterno, Usuario y Contraseña.");
      return;
    }
    
    // Hacemos trim() a los campos clave antes de enviar
    const dataParaEnviar = {
      ...empleado,
      nombres: empleado.nombres.trim(),
      apellidoPaterno: empleado.apellidoPaterno.trim(),
      apellidoMaterno: empleado.apellidoMaterno.trim(),
      nombreUsuario: empleado.nombreUsuario.trim(),
    };

    try {
      const response = await fetch(`${API_URL}/empleados/guardar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dataParaEnviar),
      });

      const data = await response.json();

      // Si el backend nos envía un error (como "Usuario ya existe")
      if (!response.ok || data.success === false) {
        Alert.alert("Error al guardar", data.message || "No se pudo crear el empleado.");
      } else {
        Alert.alert("Éxito", "Empleado guardado correctamente.");
        // Limpiamos el formulario
        setEmpleado(crearEmpleadoVacio());
      }
    } catch (error) {
      console.error("Error al guardar empleado:", error);
      Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
    }
  };

  return {
    empleado,
    // 👇 CAMBIO: Pasamos la nueva función 'handleEmpleadoChange' en lugar de 'setEmpleado'
    onChange: handleEmpleadoChange,
    onGuardar: guardarNuevoEmpleado, // Pasamos 'guardarNuevoEmpleado' como 'onGuardar'
  };
}
