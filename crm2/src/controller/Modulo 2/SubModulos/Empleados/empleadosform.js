import { useState, useCallback } from "react";

export function useEmpleadoLogic(initialEmpleado = {}) {
  // Convertir fecha_nacimiento de API a día, mes, año
  const fecha = initialEmpleado.fecha_nacimiento
    ? new Date(initialEmpleado.fecha_nacimiento)
    : null;

  const [idEmpleado, setIdEmpleado] = useState(initialEmpleado.id_empleado || "");
  const [nombres, setNombres] = useState(initialEmpleado.nombres || "");
  const [apellidoPaterno, setApellidoPaterno] = useState(initialEmpleado.apellido_paterno || "");
  const [apellidoMaterno, setApellidoMaterno] = useState(initialEmpleado.apellido_materno || "");
  
  const [diaNacimiento, setDiaNacimiento] = useState(fecha ? fecha.getDate().toString() : "");
  const [mesNacimiento, setMesNacimiento] = useState(fecha ? (fecha.getMonth() + 1).toString() : "");
  const [añoNacimiento, setAñoNacimiento] = useState(fecha ? fecha.getFullYear().toString() : "");

  const [sexo, setSexo] = useState(initialEmpleado.sexo || "");
  const [rfc, setRfc] = useState(initialEmpleado.rfc || "");
  const [curp, setCurp] = useState(initialEmpleado.curp || "");
  const [nss, setNss] = useState(initialEmpleado.nss || "");

  const [telefono, setTelefono] = useState(initialEmpleado.telefono || "");
  const [correoElectronico, setCorreoElectronico] = useState(initialEmpleado.correo_electronico || "");

  const [calle, setCalle] = useState(initialEmpleado.calle || "");
  const [colonia, setColonia] = useState(initialEmpleado.colonia || "");
  const [ciudad, setCiudad] = useState(initialEmpleado.ciudad || "");
  const [estado, setEstado] = useState(initialEmpleado.estado || "");
  const [codigoPostal, setCodigoPostal] = useState(initialEmpleado.codigo_postal || "");

  const [rol, setRol] = useState(initialEmpleado.rol || "");
  const [estadoEmpleado, setEstadoEmpleado] = useState(initialEmpleado.estado_empleado || "");

  const [nombreUsuario, setNombreUsuario] = useState(initialEmpleado.nombre_usuario || "");
  const [contraseña, setContraseña] = useState(initialEmpleado.contraseña || "");

  const [observaciones, setObservaciones] = useState(initialEmpleado.observaciones || "");
  const [archivoPDF, setArchivoPDF] = useState(initialEmpleado.archivoPDF || null);

  const handleGuardar = useCallback(() => {
    const fechaNacimiento =
      diaNacimiento && mesNacimiento && añoNacimiento
        ? `${añoNacimiento}-${mesNacimiento.padStart(2, "0")}-${diaNacimiento.padStart(2, "0")}`
        : "";

    return {
      idEmpleado,
      nombres,
      apellidoPaterno,
      apellidoMaterno,
      fechaNacimiento,
      sexo,
      rfc,
      curp,
      nss,
      telefono,
      correoElectronico,
      calle,
      colonia,
      ciudad,
      estado,
      codigoPostal,
      rol,
      estadoEmpleado,
      nombreUsuario,
      contraseña,
      observaciones,
      archivoPDF,
    };
  }, [
    idEmpleado, nombres, apellidoPaterno, apellidoMaterno,
    diaNacimiento, mesNacimiento, añoNacimiento,
    sexo, rfc, curp, nss,
    telefono, correoElectronico,
    calle, colonia, ciudad, estado, codigoPostal,
    rol, estadoEmpleado,
    nombreUsuario, contraseña, observaciones, archivoPDF,
  ]);

  return {
    idEmpleado, setIdEmpleado,
    nombres, setNombres,
    apellidoPaterno, setApellidoPaterno,
    apellidoMaterno, setApellidoMaterno,
    diaNacimiento, setDiaNacimiento,
    mesNacimiento, setMesNacimiento,
    añoNacimiento, setAñoNacimiento,
    sexo, setSexo,
    rfc, setRfc,
    curp, setCurp,
    nss, setNss,
    telefono, setTelefono,
    correoElectronico, setCorreoElectronico,
    calle, setCalle,
    colonia, setColonia,
    ciudad, setCiudad,
    estado, setEstado,
    codigoPostal, setCodigoPostal,
    rol, setRol,
    estadoEmpleado, setEstadoEmpleado,
    nombreUsuario, setNombreUsuario,
    contraseña, setContraseña,
    observaciones, setObservaciones,
    archivoPDF, setArchivoPDF,
    handleGuardar,
  };
}
