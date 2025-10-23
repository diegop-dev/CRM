import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { Alert } from "react-native"; // <-- Solo usaremos Alert

// ... (validateEmail se mantiene igual) ...
const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

// --- Hook personalizado para manejar toda la lógica del formulario ---
export function useFormLogic() {
  const navigation = useNavigation();

  // ... (Estados de campos se mantienen igual) ...
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormLocked, setIsFormLocked] = useState(true);
  const [nombre, setNombre] = useState("");
  const [apellidoPaterno, setApellidoPaterno] = useState("");
  // ... (otros campos) ...
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
  const [idCliente, setIdCliente] = useState("");
  const [creadoEn, setCreadoEn] = useState("");
  const [creadoPor, setCreadoPor] = useState("");
  const [actualizadoEn, setActualizadoEn] = useState("");
  const [actualizadoPor, setActualizadoPor] = useState("");
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);

  // --- ESTADOS DE MODAL DE ERROR ELIMINADOS ---
  // const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  // const [errorMessages, setErrorMessages] = useState("");

  // ... (handleBuscarCliente se mantiene igual) ...
  const handleBuscarCliente = () => {
    if (!searchQuery) {
      Alert.alert("Error", "Por favor, ingrese un ID de cliente para buscar.");
      return;
    }
    // ... (Simulación de carga de datos) ...
    const dummyData = {
      id_cliente: searchQuery,
      nombre: "Juan",
      apellido_paterno: "Pérez",
      apellido_materno: "García",
      tipo: "Persona",
      estado_cliente: "Activo",
      sexo: "Hombre",
      correo_electronico: "juan.perez@example.com",
      telefono: "9811234567",
      calle: "Av. Siempre Viva",
      colonia: "Centro",
      ciudad: "Springfield",
      estado: "Campeche",
      pais: "México",
      codigo_postal: "24000",
      descripcion: "Cliente de prueba cargado desde la simulación.",
      created_at: "15/01/2024",
      created_by: "001",
      updated_at: "20/05/2025",
      updated_by: "002",
    };
    setIdCliente(dummyData.id_cliente);
    setNombre(dummyData.nombre);
    setApellidoPaterno(dummyData.apellido_paterno);
    setApellidoMaterno(dummyData.apellido_materno);
    setTipo(dummyData.tipo);
    setEstadoCliente(dummyData.estado_cliente);
    setSexo(dummyData.sexo);
    setCorreo(dummyData.correo_electronico);
    setTelefono(dummyData.telefono);
    setCalle(dummyData.calle);
    setColonia(dummyData.colonia);
    setCiudad(dummyData.ciudad);
    setEstado(dummyData.estado);
    setPais(dummyData.pais);
    setCodigoPostal(dummyData.codigo_postal);
    setDescripcion(dummyData.descripcion);
    setCreadoEn(dummyData.created_at);
    setCreadoPor(dummyData.created_by);
    setActualizadoEn(dummyData.updated_at);
    setActualizadoPor(dummyData.updated_by);
    setIsFormLocked(false);
  };

  // 1. Al presionar "Guardar" (Modificado con Alert simple)
  const handleGuardarPress = () => {
    if (isFormLocked) {
      Alert.alert(
        "Formulario bloqueado",
        "Primero debe buscar y cargar un cliente para poder editarlo."
      );
      return;
    }

    const errors = [];
    // ... (Validaciones se mantienen igual) ...
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

    // --- CAMBIO PRINCIPAL AQUÍ ---
    if (errors.length > 0) {
      // Mostrar un solo Alert general
      Alert.alert(
        "Campos incompletos o incorrectos",
        "Por favor, revise el formulario. Hay campos obligatorios vacíos o con formato no válido."
      );
      return;
    }
    // --- FIN DEL CAMBIO ---

    setIsConfirmVisible(true);
  };

  // ... (handleCancelarGuardado y handleConfirmarGuardado se mantienen igual) ...
  const handleCancelarGuardado = () => {
    setIsConfirmVisible(false);
  };
  const handleConfirmarGuardado = () => {
    setIsConfirmVisible(false);
    // ... (lógica de actualización) ...
    setTimeout(() => {
      setIsSuccessVisible(true);
    }, 500);
  };

  const handleCerrarExito = () => {
    setIsSuccessVisible(false);
    navigation.goBack();
  };

  // --- MANEJADOR DE ERROR ELIMINADO ---
  // const handleErrorModalClose = () => { ... };

  // --- Retornar todos los estados y funciones ---
  return {
    searchQuery,
    setSearchQuery,
    isFormLocked,
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
    idCliente,
    creadoEn,
    creadoPor,
    actualizadoEn,
    actualizadoPor,
    // Modales
    isConfirmVisible,
    isSuccessVisible,
    // (Estados de error eliminados)
    // Manejadores
    handleBuscarCliente,
    handleGuardarPress,
    handleCancelarGuardado,
    handleConfirmarGuardado,
    handleCerrarExito,
    // (Manejador de error eliminado)
  };
}
