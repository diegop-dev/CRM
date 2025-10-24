import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native";

// --- Función de validación de Email ---
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// --- Hook personalizado para manejar toda la lógica del formulario ---
export function useFormLogic() {
  const navigation = useNavigation();

  // --- Estados para los campos del formulario (basados en la DB) ---
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  const [apellidoMaterno, setApellidoMaterno] = useState("");
  const [tipo, setTipo] = useState("");
  const [estadoCliente, setEstadoCliente] = useState("");
  const [sexo, setSexo] = useState("");
  const [correo, setCorreo] = useState("");
  const [telefono, setTelefono] = useState("");
  const [calle, setCalle] = useState("");
  const [colonia, setColonia] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [estado, setEstado] = useState("");
  const [pais, setPais] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [descripcion, setDescripcion] = useState("");

  // --- Estados para los campos de auditoría (no editables) ---
  const [idCliente, setIdCliente] = useState("C-...");
  const [creadoEn, setCreadoEn] = useState("...cargando");
  const [creadoPor, setCreadoPor] = useState("...cargando");
  const [actualizadoEn, setActualizadoEn] = useState("N/A");
  const [actualizadoPor, setActualizadoPor] = useState("N/A");

  // --- Efecto para simular la carga de datos de auditoría ---
  useEffect(() => {
    const nuevoId = `C-${Math.floor(1000 + Math.random() * 9000)}`;
    setIdCliente(nuevoId);
    const hoy = new Date().toLocaleDateString("es-ES");
    const usuarioLogueado = "001";

    setCreadoEn(hoy);
    setCreadoPor(usuarioLogueado);
    setActualizadoEn("N/A");
    setActualizadoPor("N/A");
  }, []);

  // --- Manejador de Guardado (Modificado con Alertas) ---
  const handleGuardarPress = () => {
    // 1. Validaciones
    const errors = [];
    if (!nombre) errors.push("Nombre");
    if (!apellidoPaterno) errors.push("Apellido Paterno");
    if (!tipo) errors.push("Tipo");
    if (!estadoCliente) errors.push("Estado Cliente");
    if (!correo || !validateEmail(correo)) errors.push("Correo");
    if (!telefono || !/^\d{10}$/.test(telefono)) errors.push("Teléfono");
    if (!calle) errors.push("Calle");
    if (!colonia) errors.push("Colonia");
    if (!ciudad) errors.push("Ciudad");
    if (!estado) errors.push("Estado");
    if (!pais) errors.push("País");
    if (!codigoPostal || !/^\d{5}$/.test(codigoPostal)) errors.push("CP");

    if (errors.length > 0) {
      Alert.alert(
        "Campos incompletos o incorrectos",
        "Por favor, revise el formulario. Hay campos obligatorios vacíos o con formato no válido."
      );
      return;
    }

    // 2. Alerta de Confirmación (reemplaza el modal)
    Alert.alert(
      "Confirmar Guardado",
      "¿Está seguro que desea agregar al cliente?",
      [
        // Botón Cancelar
        {
          text: "Cancelar",
          onPress: () => console.log("Guardado cancelado."),
          style: "cancel",
        },
        // Botón Confirmar
        {
          text: "Confirmar",
          onPress: () => {
            console.log("Guardado confirmado. Simulando API call...");

            // 3. Lógica de Guardado (antes en handleConfirmarGuardado)
            const datosCliente = {
              id_cliente: idCliente,
              nombre,
              apellido_paterno: apellidoPaterno,
              apellido_materno: apellidoMaterno,
              tipo,
              estado_cliente: estadoCliente,
              sexo,
              correo_electronico: correo,
              telefono,
              calle,
              colonia,
              ciudad,
              estado,
              pais,
              codigo_postal: codigoPostal,
              descripcion,
              created_at: creadoEn,
              created_by: creadoPor,
            };
            console.log("Enviando datos:", datosCliente);

            // 4. Simulación de API y Alerta de Éxito
            setTimeout(() => {
              console.log("Respuesta de API: Éxito");
              Alert.alert("Éxito", "Cliente agregado correctamente.", [
                // 5. Botón Aceptar (antes en handleCerrarExito)
                {
                  text: "Aceptar",
                  onPress: () => {
                    console.log("Regresando al menú...");
                    navigation.goBack();
                  },
                },
              ]);
            }, 500); // Simula retraso de red
          },
        },
      ]
    );
  };

  // --- Retornar todos los estados y funciones para que el JSX los use ---
  return {
    // Estados de campos
    nombre,
    setNombre,
    apellidoPaterno,
    setApellidoPaterno,
    apellidoMaterno,
    setApellidoMaterno,
    tipo,
    setTipo,
    estadoCliente,
    setEstadoCliente,
    sexo,
    setSexo,
    correo,
    setCorreo,
    telefono,
    setTelefono,
    calle,
    setCalle,
    colonia,
    setColonia,
    ciudad,
    setCiudad,
    estado,
    setEstado,
    pais,
    setPais,
    codigoPostal,
    setCodigoPostal,
    descripcion,
    setDescripcion,
    // Estados de auditoría
    idCliente,
    creadoEn,
    creadoPor,
    actualizadoEn,
    actualizadoPor,
    // Estados de modales (Eliminados)
    // Manejadores
    handleGuardarPress,
  };
}
