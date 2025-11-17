import { useState, useEffect } from "react";
import { Alert } from "react-native";
// Asegúrate de que esta ruta sea correcta desde la carpeta 'controller'
import { API_URL } from "../../../../config/apiConfig"; 

// ESTE ES EL ÚNICO HOOK QUE DEBE HABER EN ESTE ARCHIVO
export function useConsultarEmpleadoLogic() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [empleado, setEmpleado] = useState(null);
  const [loading, setLoading] = useState(false);

  // 'editable' siempre es false en "Consultar"
  const editable = false; 

  const buscarEmpleado = async () => {
    if (!nombreUsuario.trim()) {
      Alert.alert("Error", "Por favor, ingrese un nombre de usuario.");
      return;
    }
    setLoading(true);
    setEmpleado(null); // Limpia resultados anteriores
    try {
      // --- ESTA ES LA LÓGICA REAL (DEBES DESCOMENTARLA CUANDO TU API ESTÉ LISTA) ---
      // const response = await fetch(`${API_URL}/empleados/buscar?usuario=${nombreUsuario}`);
      // const data = await response.json();
      
      // if (data.success) {
      //   setEmpleado(data.empleado); 
      // } else {
      //   Alert.alert("Error", data.message || "Empleado no encontrado.");
      // }

      // --- DATOS SIMULADOS (BORRAR DESPUÉS) ---
      const datosSimulados = {
        id_empleado: 1,
        nombres: "Juan",
        apellido_paterno: "Pérez",
        apellido_materno: "Gómez",
        sexo: "Masculino",
        rfc: "PEGO880101ABC",
        curp: "PEGO880101HCS...",
        nss: "12345678901",
        fecha_nacimiento: "1988-01-10",
        correo_electronico: "juan.perez@empresa.com",
        telefono: "9991234567",
        calle: "Av. Siempre Viva",
        colonia: "Centro",
        ciudad: "Mérida",
        estado: "Yucatán",
        pais: "México",
        codigo_postal: "97000",
        rol: "Vendedor",
        estado_empleado: "Activo",
        nombre_usuario: "jperez",
      };
      // Simulamos un retraso de la red
      setTimeout(() => {
        setEmpleado(datosSimulados);
        setLoading(false);
      }, 1000);
      // --- FIN DE SIMULACIÓN ---

    } catch (error) {
      console.error("Error al buscar empleado:", error);
      Alert.alert("Error de Conexión", error.message);
      setLoading(false);
    }
  };

  // Función para limpiar la selección y volver a la búsqueda
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
    deseleccionarEmpleado,
  };
}

// ¡¡NO DEBE HABER NADA MÁS EN ESTE ARCHIVO!!
// ¡¡NINGÚN 'export default', NINGÚN '<View>', NINGÚN 'StyleSheet'!!