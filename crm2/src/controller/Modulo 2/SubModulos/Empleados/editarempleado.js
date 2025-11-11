// src/controller/.../editarempleado.js
import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../../../config/apiConfig";

// 1. CREAMOS UNA FUNCIÓN FORMATEADORA
function formatearEmpleado(e) {
  if (!e) return null;

  // Separamos la fecha (ej: "1926-01-01T...")
  const fecha = e.fecha_nacimiento ? e.fecha_nacimiento.split("T")[0].split("-") : ["", "", ""];
  
  // --- INICIO DE LA CORRECCIÓN ---
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
  // --- FIN DE LA CORRECCIÓN ---
}


export function useEditarEmpleadoLogic() {
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [empleados, setEmpleados] = useState([]);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarEmpleadosAleatorios();
  }, []);

  // Función para establecer el empleado (usada por el useEffect de la vista)
  const setEmpleadoDesdeNavegacion = (empleadoCrudo) => {
    // 2. Usamos la función formateadora
    setEmpleadoSeleccionado(formatearEmpleado(empleadoCrudo));
  };

  // ... (cargarEmpleadosAleatorios y buscarEmpleado se quedan igual que las tuyas) ...
  const cargarEmpleadosAleatorios = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/empleados/aleatorios`);
      const data = await response.json();
      if (data.success && data.empleados) {
        setEmpleados(data.empleados);
      } else {
        setEmpleados([]);
      }
    } catch (error) {
      console.error("Error al cargar empleados:", error);
    } finally {
      setLoading(false);
    }
  };

  const buscarEmpleado = async () => {
    if (!terminoBusqueda.trim()) {
      cargarEmpleadosAleatorios();
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/empleados/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
      );
      const data = await response.json();
      if (!data.success || !data.empleados?.length) {
        setEmpleados([]);
        Alert.alert("Sin resultados", "No se encontró ningún empleado.");
        return;
      }
      setEmpleados(data.empleados);
    } catch (error) {
      console.error("Error al buscar empleado:", error);
      Alert.alert("Error", "No se pudo realizar la búsqueda.");
    } finally {
      setLoading(false);
    }
  };

  // Seleccionar empleado
  const seleccionarEmpleado = async (emp) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/empleados/consultar/${emp.id_empleado || emp.idEmpleado}`
      );
      // ¡Usamos la versión de depuración para estar seguros!
      const rawResponse = await response.text();
      const data = JSON.parse(rawResponse);

      if (data.success && data.empleado) {
        // 3. Usamos la función formateadora (corregida)
        setEmpleadoSeleccionado(formatearEmpleado(data.empleado));
      } else {
        Alert.alert("Error", "No se pudieron obtener los datos del empleado.");
      }
    } catch (error) {
      console.error("Error al obtener datos del empleado:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // Guardar cambios
  const guardarCambios = async () => {
    if (!empleadoSeleccionado) {
      Alert.alert("Error", "Debe seleccionar un empleado primero.");
      return;
    }

    // --- AÑADIMOS EL .TRIM() AQUÍ TAMBIÉN POR SEGURIDAD ---
    // (Esto ya lo tenías de mi sugerencia anterior, lo mantenemos)
    const dataParaEnviar = {
      ...empleadoSeleccionado,
      rfc: (empleadoSeleccionado.rfc || "").trim(),
      curp: (empleadoSeleccionado.curp || "").trim(),
      nss: (empleadoSeleccionado.nss || "").trim(),
      nombres: (empleadoSeleccionado.nombres || "").trim(),
      apellidoPaterno: (empleadoSeleccionado.apellidoPaterno || "").trim(),
      apellidoMaterno: (empleadoSeleccionado.apellidoMaterno || "").trim(),
    };
    // --- FIN DEL BLOQUE DE SEGURIDAD ---

    const id = dataParaEnviar.id_empleado; // Usamos el ID de la data limpia

    try {
      // 4. Esta URL debe coincidir con la de tus rutas (¡la correcta!)
      const response = await fetch(`${API_URL}/empleados/editar/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        // El body ahora SÍ tiene el campo "nombres"
        body: JSON.stringify(dataParaEnviar), // Enviamos la data "limpia"
      });

      const rawResponse = await response.text();
      console.log("Respuesta CRUDA de 'guardarCambios':", rawResponse); // Mantenemos la depuración
      const data = JSON.parse(rawResponse);

      if (data.success) {
        Alert.alert("Éxito", "Empleado actualizado correctamente.");
        setEmpleadoSeleccionado(null);
        cargarEmpleadosAleatorios();
      } else {
        Alert.alert("Error", data.message || "No se pudieron guardar los cambios.");
      }
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      // El error "<" saltará aquí
      Alert.alert("Error de Servidor", "Error al guardar. Revisa la consola.");
    }
  };

  // --- FUNCIÓN NUEVA ---
  // Esta función pone el empleado seleccionado en null,
  // lo que oculta el formulario y muestra la lista de nuevo.
  const deseleccionarEmpleado = () => {
    setEmpleadoSeleccionado(null);
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    empleados,
    empleadoSeleccionado,
    setEmpleadoSeleccionado, // Lo mantenemos por si acaso
    setEmpleadoDesdeNavegacion, // <--- Nueva función para la vista
    loading,
    buscarEmpleado,
    seleccionarEmpleado,
    guardarCambios,
    deseleccionarEmpleado, // <-- AÑADIDO
  };
}
