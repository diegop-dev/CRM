import { useState } from "react";
// import { Alert } from "react-native"; // <-- Eliminamos Alert
import { API_URL } from "../../../../config/apiConfig";

// (La función crearEmpleadoVacio no cambia)
function crearEmpleadoVacio() {
  const e = {}; 
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
  const [empleado, setEmpleado] = useState(crearEmpleadoVacio());
  
  // --- Estado para el modal de alerta ---
  const [modalInfo, setModalInfo] = useState({ visible: false, title: "", message: "" });

  const handleEmpleadoChange = (key, value) => {
    setEmpleado(prevState => ({
      ...prevState,
      [key]: value 
    }));
  };

  const guardarNuevoEmpleado = async () => {

    if (!empleado.nombres || !empleado.apellidoPaterno || !empleado.nombreUsuario || !empleado.contraseña) {
      // --- Usamos el modal ---
      setModalInfo({ 
        visible: true, 
        title: "Campos incompletos", 
        message: "Por favor, llene al menos Nombres, Apellido Paterno, Usuario y Contraseña."
      });
      return;
    }
    
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

      if (!response.ok || data.success === false) {
        // --- Usamos el modal ---
        setModalInfo({ 
          visible: true, 
          title: "Error al guardar", 
          message: data.message || "No se pudo crear el empleado."
        });
      } else {
        // --- Usamos el modal ---
        setModalInfo({ 
          visible: true, 
          title: "Éxito", 
          message: "Empleado guardado correctamente."
        });
        setEmpleado(crearEmpleadoVacio());
      }
    } catch (error) {
      console.error("Error al guardar empleado:", error);
      // --- Usamos el modal ---
      setModalInfo({ 
        visible: true, 
        title: "Error de Conexión", 
        message: "No se pudo conectar con el servidor."
      });
    }
  };

  // --- Función para cerrar el modal ---
  const closeModal = () => {
    setModalInfo({ visible: false, title: "", message: "" });
  };

  return {
    empleado,
    onChange: handleEmpleadoChange,
    onGuardar: guardarNuevoEmpleado,
    modalInfo, // <-- Exportamos el estado del modal
    closeModal, // <-- Exportamos la función de cierre
  };
}