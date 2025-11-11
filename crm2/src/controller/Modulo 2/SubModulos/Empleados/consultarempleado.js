import { useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../../../config/apiConfig";

// --- INICIO DE LA ACTUALIZACIÓN ---
// 1. AÑADIMOS LA FUNCIÓN FORMATEADORA
function formatearEmpleado(e) {
  if (!e) return null;

  // Separamos la fecha (ej: "1926-01-01T...")
  const fecha = e.fecha_nacimiento ? e.fecha_nacimiento.split("T")[0].split("-") : ["", "", ""];

  // Usamos .trim() en todos los campos de texto para
  // quitar los espacios en blanco al *cargarlos*.
  return {
    id_empleado: e.id_empleado || e.idEmpleado,
    nombres: (e.nombres || "").trim(),
    apellidoPaterno: (e.apellido_paterno || "").trim(),
    apellidoMaterno: (e.apellido_materno || "").trim(),
    diaNacimiento: fecha[2] || "",
    mesNacimiento: fecha[1] || "",
    añoNacimiento: fecha[0] || "",
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
    contraseña: e.contraseña || "", // La contraseña puede tener espacios
    observaciones: (e.observaciones || "").trim(),
  };
}
// --- FIN DE LA ACTUALIZACIÓN ---


export function useConsultarEmpleadoLogic() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editable, setEditable] = useState(false);

  const buscarEmpleado = async () => {
    if (!nombreUsuario.trim()) {
      Alert.alert("Atención", "Ingrese un nombre de usuario para buscar.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/empleados/buscar/usuario?termino=${encodeURIComponent(nombreUsuario)}`
      );

      const data = await response.json();

      if (response.ok && data.success && data.empleado) {
        // --- INICIO DE LA ACTUALIZACIÓN ---
        // 2. Usamos la función formateadora
        setEmpleado(formatearEmpleado(data.empleado)); // <-- ¡CAMBIO CLAVE!
        // --- FIN DE LA ACTUALIZACIÓN ---
        setEditable(false);
      } else {
        Alert.alert("Sin resultados", data.message || "No se encontró ningún empleado con ese usuario.");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "No se pudo obtener el empleado.");
    } finally {
      setLoading(false);
    }
  };

  const confirmarEdicion = () => {
    Alert.alert(
      "Confirmar edición",
      "¿Desea editar la información de este empleado?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, editar",
          onPress: () => setEditable(true),
        },
      ],
      { cancelable: true }
    );
  };

  const deseleccionarEmpleado = () => {
   setEmpleado(null);
    setNombreUsuario("");
  };

  return {
    nombreUsuario,
    setNombreUsuario,
    empleado,
    loading,
    editable,
    buscarEmpleado,
    confirmarEdicion,
    deseleccionarEmpleado,
  };
}
