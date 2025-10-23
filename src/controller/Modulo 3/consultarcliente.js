import { useState } from "react";
import { Alert } from "react-native";

// --- Hook personalizado para manejar toda la lógica de consulta ---
export function useFormLogic() {
  // --- Estado para la búsqueda ---
  const [searchQuery, setSearchQuery] = useState("");
  // const [isDataLoaded, setIsDataLoaded] = useState(false); // <-- Eliminado

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

    // --- Simulación de llamada a la API (GET /api/clientes/{searchQuery}) ---
    const dummyData = {
      id_cliente: searchQuery,
      nombre: "Brenda",
      apellido_paterno: "Domínguez",
      apellido_materno: "Castillo",
      tipo: "Persona",
      estado_cliente: "Potencial",
      sexo: "Mujer",
      correo_electronico: "brenda.dominguez@example.com",
      telefono: "9818123456",
      calle: "Calle 10",
      colonia: "Guadalupe",
      ciudad: "San Francisco de Campeche",
      estado: "Campeche",
      pais: "México",
      codigo_postal: "24010",
      descripcion: "Cliente potencial interesada en el producto B.",
      created_at: "10/08/2024",
      created_by: "002",
      updated_at: "15/09/2025",
      updated_by: "002",
    };

    // --- Cargar datos en el estado ---
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

    // setIsDataLoaded(true); // <-- Eliminado
    console.log("Cliente cargado.");
  };

  // --- Retornar todos los estados y funciones ---
  return {
    // Estados de búsqueda
    searchQuery,
    setSearchQuery,
    // isDataLoaded, <-- Eliminado
    // Estados de campos
    nombre,
    apellidoPaterno,
    apellidoMaterno,
    tipo,
    estadoCliente,
    sexo,
    correo,
    telefono,
    calle,
    colonia,
    ciudad,
    estado,
    pais,
    codigoPostal,
    descripcion,
    // Estados de auditoría
    idCliente,
    creadoEn,
    creadoPor,
    actualizadoEn,
    actualizadoPor,
    // Manejador
    handleBuscarCliente,
  };
}
