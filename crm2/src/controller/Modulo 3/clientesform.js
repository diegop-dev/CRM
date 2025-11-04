import { useState, useCallback } from "react";

// <-- ADAPTADO: Renombrado a useClienteLogic
export function useClienteLogic(initialCliente = {}) {
  
  // --- Paso 1 ---
  const [idCliente, setIdCliente] = useState(initialCliente.id_cliente || "");
  const [nombre, setNombre] = useState(initialCliente.nombre || "");
  const [apellidoPaterno, setApellidoPaterno] = useState(initialCliente.apellido_paterno || "");
  const [apellidoMaterno, setApellidoMaterno] = useState(initialCliente.apellido_materno || "");
  const [tipo, setTipo] = useState(initialCliente.tipo || "");
  const [estadoCliente, setEstadoCliente] = useState(initialCliente.estado_cliente || "");

  // --- Paso 2 ---
  const [sexo, setSexo] = useState(initialCliente.sexo || "");
  const [correoElectronico, setCorreoElectronico] = useState(initialCliente.correo_electronico || "");
  const [telefono, setTelefono] = useState(initialCliente.telefono || "");
  const [calle, setCalle] = useState(initialCliente.calle || "");
  const [colonia, setColonia] = useState(initialCliente.colonia || "");
  const [ciudad, setCiudad] = useState(initialCliente.ciudad || "");

  // --- Paso 3 ---
  const [estado, setEstado] = useState(initialCliente.estado || ""); // Estado/Región
  const [pais, setPais] = useState(initialCliente.pais || "");
  const [codigoPostal, setCodigoPostal] = useState(initialCliente.codigo_postal || "");
  const [descripcion, setDescripcion] = useState(initialCliente.descripcion || ""); // Se cambió de observaciones

  
  // <-- ADAPTADO: Función 'handleGuardar' del hook (si la usas para recolectar datos)
  const handleGuardar = useCallback(() => {
    // Se elimina la lógica de fecha_nacimiento

    return {
      idCliente,
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      tipo,
      estadoCliente,
      sexo,
      correoElectronico,
      telefono,
      calle,
      colonia,
      ciudad,
      estado,
      pais,
      codigoPostal,
      descripcion,
    };
  }, [
    // <-- ADAPTADO: Dependencias del hook
    idCliente, nombre, apellidoPaterno, apellidoMaterno,
    tipo, estadoCliente, sexo, correoElectronico, telefono,
    calle, colonia, ciudad, estado, pais, codigoPostal,
    descripcion,
  ]);

  // <-- ADAPTADO: Objeto retornado por el hook
  return {
    idCliente, setIdCliente,
    nombre, setNombre,
    apellidoPaterno, setApellidoPaterno,
    apellidoMaterno, setApellidoMaterno,
    tipo, setTipo,
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
