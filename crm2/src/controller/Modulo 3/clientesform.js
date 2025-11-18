import { useState, useCallback } from "react";

// Renombrado de useEmpleadoLogic a useClienteLogic
export function useClienteLogic(initialCliente = {}) {
  
  // --- Eliminada Lógica de Fecha de Nacimiento ---
  // const fecha = ...

  // --- Estados Adaptados a Cliente ---
  
  // ID (Mantenido por instrucción, asumiendo 'id_cliente' del API)
  const [idCliente, setIdCliente] = useState(initialCliente.id_cliente || "");
  
  // Paso 1
  const [nombreCliente, setNombreCliente] = useState(initialCliente.nombre_cliente || ""); // Renombrado de 'nombres'
  const [apellidoPaterno, setApellidoPaterno] = useState(initialCliente.apellido_paterno || "");
  const [apellidoMaterno, setApellidoMaterno] = useState(initialCliente.apellido_materno || "");
  const [tipoCliente, setTipoCliente] = useState(initialCliente.tipo_cliente || ""); // Nuevo
  const [estadoCliente, setEstadoCliente] = useState(initialCliente.estado_cliente || ""); // Renombrado de 'estadoEmpleado'

  // --- Eliminados Estados de Fecha de Nacimiento ---
  // const [diaNacimiento, setDiaNacimiento] = ...
  // const [mesNacimiento, setMesNacimiento] = ...
  // const [añoNacimiento, setAñoNacimiento] = ...

  // Paso 2
  const [sexo, setSexo] = useState(initialCliente.sexo || "");
  const [correoElectronico, setCorreoElectronico] = useState(initialCliente.correo_electronico || "");
  const [telefono, setTelefono] = useState(initialCliente.telefono || "");
  const [calle, setCalle] = useState(initialCliente.calle || "");
  const [colonia, setColonia] = useState(initialCliente.colonia || "");
  const [ciudad, setCiudad] = useState(initialCliente.ciudad || "");

  // --- Eliminados Estados RFC, CURP, NSS ---
  // const [rfc, setRfc] = ...
  // const [curp, setCurp] = ...
  // const [nss, setNss] = ...

  // Paso 3
  const [estado, setEstado] = useState(initialCliente.estado || "");
  const [pais, setPais] = useState(initialCliente.pais || ""); // Nuevo
  const [codigoPostal, setCodigoPostal] = useState(initialCliente.codigo_postal || "");
  const [descripcion, setDescripcion] = useState(initialCliente.descripcion || ""); // Renombrado de 'observaciones'

  // --- Eliminados Estados de Rol, Usuario, Contraseña, PDF ---
  // const [rol, setRol] = ...
  // const [nombreUsuario, setNombreUsuario] = ...
  // const [contraseña, setContraseña] = ...
  // const [archivoPDF, setArchivoPDF] = ...


  const handleGuardar = useCallback(() => {
    // --- Eliminada lógica de formato de fechaNacimiento ---

    // Retorna el objeto 'cliente' con los campos actualizados
    // (Usando snake_case para coincidir con el formato original de API)
    return {
      id_cliente: idCliente,
      nombre_cliente: nombreCliente,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      tipo_cliente: tipoCliente,
      estado_cliente: estadoCliente,
      sexo: sexo,
      correo_electronico: correoElectronico,
      telefono: telefono,
      calle: calle,
      colonia: colonia,
      ciudad: ciudad,
      estado: estado,
      pais: pais,
      codigo_postal: codigoPostal,
      descripcion: descripcion,
    };
  }, [
    // Dependencias actualizadas
    idCliente, nombreCliente, apellidoPaterno, apellidoMaterno,
    tipoCliente, estadoCliente, sexo,
    correoElectronico, telefono,
    calle, colonia, ciudad, estado, pais, codigoPostal,
    descripcion,
  ]);

  // Retorno de estados y setters actualizados
  return {
    idCliente, setIdCliente,
    nombreCliente, setNombreCliente,
    apellidoPaterno, setApellidoPaterno,
    apellidoMaterno, setApellidoMaterno,
    tipoCliente, setTipoCliente,
    estadoCliente, setEstadoCliente,
    sexo, setSexo,
    correoElectronico, setCorreoElectronico,
    telefono, setTelefono,
    calle, setCalle,
    colonia, setColonia,
    ciudad, setCiudad,
    estado, setEstado,
    pais, setPais,
    codigoPostal, setCodigoPostal,
    descripcion, setDescripcion,
    handleGuardar,
  };
}
