import { useState } from "react";
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

  // --- Estados para búsqueda y bloqueo ---
  const [searchQuery, setSearchQuery] = useState("");
  const [isFormLocked, setIsFormLocked] = useState(true);

  // --- Estados para los campos del formulario ---
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

  // --- Estados para los campos de auditoría ---
  const [idCliente, setIdCliente] = useState("");
  const [creadoEn, setCreadoEn] = useState("");
  const [creadoPor, setCreadoPor] = useState("");
  const [actualizadoEn, setActualizadoEn] = useState("");
  const [actualizadoPor, setActualizadoPor] = useState("");

  // --- Manejador de la Búsqueda ---
  const handleBuscarCliente = () => {
    if (!searchQuery) {
      Alert.alert("Error", "Por favor, ingrese un ID de cliente para buscar.");
      return;
    }
    console.log("Buscando cliente con ID:", searchQuery);
    // Simulación de carga de datos
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
    console.log("Cliente cargado y formulario desbloqueado.");
  };

  // --- Manejador de Guardado (Modificado con Alertas) ---
  const handleGuardarPress = () => {
    if (isFormLocked) {
      // Esta alerta simple está bien aquí
      Alert.alert(
        "Formulario bloqueado",
        "Primero debe buscar y cargar un cliente para poder editarlo."
      );
      return;
    }

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

    // 2. Alerta de Confirmación
    Alert.alert(
      "Confirmar Edición",
      "¿Está seguro que desea editar al cliente?",
      [
        // Botón Cancelar
        {
          text: "Cancelar",
          onPress: () => console.log("Edición cancelada."),
          style: "cancel",
        },
        // Botón Confirmar
        {
          text: "Confirmar",
          onPress: () => {
            console.log("Edición confirmada. Simulando API call (PUT)...");

            // 3. Lógica de Actualización
            const hoy = new Date().toLocaleDateString("es-ES");
            const usuarioLogueado = "001"; // ID del usuario actual

            // Actualizamos el estado (simulación)
            setActualizadoEn(hoy);
            setActualizadoPor(usuarioLogueado);

            const datosClienteActualizados = {
              id_cliente: idCliente,
              nombre,
              apellido_paterno: apellidoPaterno,
              // ... todos los demás campos ...
              updated_at: hoy,
              updated_by: usuarioLogueado,
            };
            console.log(
              "Enviando datos actualizados:",
              datosClienteActualizados
            );

            // 4. Simulación de API y Alerta de Éxito
            setTimeout(() => {
              console.log("Respuesta de API: Éxito");
              Alert.alert("Éxito", "Cliente editado correctamente.", [
                // 5. Botón Aceptar
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

  // --- Retornar estados y funciones necesarios ---
  return {
    // Búsqueda y bloqueo
    searchQuery,
    setSearchQuery,
    isFormLocked,
    // Campos del formulario
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
    // Campos de auditoría
    idCliente,
    creadoEn,
    creadoPor,
    actualizadoEn,
    actualizadoPor,
    // Manejadores principales
    handleBuscarCliente,
    handleGuardarPress,
  };
}
