import { useState } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../../../config/apiConfig";

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

  const handleEmpleadoChange = (key, value) => {
    setEmpleado(prevState => ({
      ...prevState,
      [key]: value
    }));
  };

  // --- FUNCIÓN INTERNA PARA EJECUTAR EL GUARDADO REAL ---
  const _proceedToSave = async () => {
    // Alerta Final de Confirmación General
    Alert.alert(
      "Confirmar Guardado",
      "¿Está seguro de que desea guardar este nuevo empleado?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Guardar",
          onPress: async () => {
            // Lógica de guardado (fetch)
            const dataParaEnviar = {
              ...empleado,
              nombres: empleado.nombres.trim(),
              apellidoPaterno: empleado.apellidoPaterno.trim(),
              apellidoMaterno: empleado.apellidoMaterno.trim(),
              nombreUsuario: empleado.nombreUsuario.trim(),
            };

            try {
              // --- CAMBIO CLAVE ---
              // Usamos la ruta REST estándar: POST /empleados
              const response = await fetch(`${API_URL}/empleados`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataParaEnviar),
              });

              const data = await response.json();

              if (!response.ok || data.success === false) {
                Alert.alert("Error al guardar", data.message || "No se pudo crear el empleado.");
              } else {
                Alert.alert("Éxito", "Empleado guardado correctamente.");
                setEmpleado(crearEmpleadoVacio());
              }
            } catch (error) {
              console.error("Error al guardar empleado:", error);
              Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
            }
          }
        }
      ]
    );
  };

  // --- FUNCIÓN PRINCIPAL DEL BOTÓN ---
  const guardarNuevoEmpleado = async () => {
    // 1. Validación básica
    if (!empleado.nombres || !empleado.apellidoPaterno) {
      Alert.alert("Campos incompletos", "Por favor, llene al menos Nombres y Apellido Paterno.");
      return;
    }

    // 2. Validación de Credenciales (Usuario/Contraseña)
    // Si hay datos en usuario o contraseña, pedimos confirmación extra.
    if (empleado.nombreUsuario || empleado.contraseña) {
      Alert.alert(
        "Confirmar Credenciales",
        "Ha ingresado un Nombre de Usuario y/o Contraseña.\n\n¿Está seguro de que estos datos son correctos?",
        [
          { text: "Revisar", style: "cancel" },
          { 
            text: "Confirmar", 
            onPress: () => _proceedToSave() // Si confirma, vamos al siguiente paso
          }
        ]
      );
    } else {
      // Si no hay credenciales, pasamos directo al guardado
      _proceedToSave();
    }
  };

  return {
    empleado,
    onChange: handleEmpleadoChange,
    onGuardar: guardarNuevoEmpleado,
  };
}