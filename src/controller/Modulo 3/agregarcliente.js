import { useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native"; // <-- 1. IMPORTADO

// --- Función de validación de Email --- (AÑADIDO)
const validateEmail = (email) => {
  // Expresión regular simple para validación de email
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
  const [tipo, setTipo] = useState(""); // Dropdown: Persona, Empresa
  const [estadoCliente, setEstadoCliente] = useState(""); // Dropdown: Activo, Inactivo, Potencial
  const [sexo, setSexo] = useState(""); // Dropdown: Hombre, Mujer
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
  const [idCliente, setIdCliente] = useState("C-..."); // Autogenerado
  const [creadoEn, setCreadoEn] = useState("...cargando"); // DD/MM/AAAA
  const [creadoPor, setCreadoPor] = useState("...cargando"); // ID de usuario
  const [actualizadoEn, setActualizadoEn] = useState("N/A"); // DD/MM/AAAA
  const [actualizadoPor, setActualizadoPor] = useState("N/A"); // ID de usuario

  // --- Estados para los Modales ---
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  // --- Efecto para simular la carga de datos de auditoría al abrir la pantalla ---
  useEffect(() => {
    // Simula la obtención de un nuevo ID de cliente
    const nuevoId = `C-${Math.floor(1000 + Math.random() * 9000)}`;
    setIdCliente(nuevoId);

    // Simula la obtención del usuario logueado y la fecha actual
    const hoy = new Date().toLocaleDateString("es-ES"); // Formato DD/MM/AAAA
    const usuarioLogueado = "001"; // ID del usuario (ej. admin)

    setCreadoEn(hoy);
    setCreadoPor(usuarioLogueado);
    setActualizadoEn("N/A");
    setActualizadoPor("N/A");
  }, []); // El array vacío [] asegura que esto solo se ejecute una vez

  // --- Manejadores de eventos de los modales ---

  // 1. Al presionar "Guardar", (MODIFICADO CON VALIDACIONES)
  const handleGuardarPress = () => {
    // --- INICIO DE VALIDACIONES ---
    const errors = [];

    // Requeridos
    if (!nombre) errors.push("Nombre");
    if (!apellidoPaterno) errors.push("Apellido Paterno");
    if (!tipo) errors.push("Tipo");
    if (!estadoCliente) errors.push("Estado Cliente");

    // Contacto (Requerido + Formato)
    if (!correo) {
      errors.push("Correo");
    } else if (!validateEmail(correo)) {
      errors.push("Correo Formato");
    }

    if (!telefono) {
      errors.push("Teléfono");
    } else if (!/^\d{10}$/.test(telefono)) {
      // Asume 10 dígitos numéricos
      errors.push("Teléfono Formato");
    }

    // Dirección (Requeridos)
    if (!calle) errors.push("Calle");
    if (!colonia) errors.push("Colonia");
    if (!ciudad) errors.push("Ciudad");
    if (!estado) errors.push("Estado");
    if (!pais) errors.push("País");

    if (!codigoPostal) {
      errors.push("CP");
    } else if (!/^\d{5}$/.test(codigoPostal)) {
      // Asume 5 dígitos numéricos
      errors.push("CP Formato");
    }

    // Si hay errores, mostrar alerta general y detener
    if (errors.length > 0) {
      Alert.alert(
        "Campos incompletos o incorrectos",
        "Por favor, revise el formulario. Hay campos obligatorios vacíos o con formato no válido."
      );
      return;
    }
    // --- FIN DE VALIDACIONES ---

    console.log("Mostrando modal de confirmación...");
    setIsConfirmVisible(true);
  };

  // 2. Al presionar "Cancelar" en el modal
  const handleCancelarGuardado = () => {
    console.log("Guardado cancelado.");
    setIsConfirmVisible(false);
  };

  // 3. Al presionar "Confirmar" en el modal
  const handleConfirmarGuardado = () => {
    console.log("Guardado confirmado. Simulando API call...");
    setIsConfirmVisible(false);

    // --- Simulación de guardado en Base de Datos ---
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

    // Al recibir éxito de la API:
    setTimeout(() => {
      console.log("Respuesta de API: Éxito");
      setIsSuccessVisible(true);
    }, 500);
  };

  // 4. Al cerrar el modal de "Éxito"
  const handleCerrarExito = () => {
    setIsSuccessVisible(false);
    console.log("Regresando al menú...");
    navigation.goBack(); // Regresa a la pantalla anterior (menú)
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
    // Estados de modales
    isConfirmVisible,
    isSuccessVisible,
    // Manejadores
    handleGuardarPress,
    handleCancelarGuardado,
    handleConfirmarGuardado,
    handleCerrarExito,
  };
}
