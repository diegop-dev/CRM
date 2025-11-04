import { useState, useCallback } from "react";

export function useEmpleadoLogic(initialEmpleado = {}) {
  // Eliminamos idEmpleado porque lo genera la base de datos
  const [nombres, setNombres] = useState(initialEmpleado.nombres || "");
  const [apellidoPaterno, setApellidoPaterno] = useState(initialEmpleado.apellidoPaterno || "");
  const [apellidoMaterno, setApellidoMaterno] = useState(initialEmpleado.apellidoMaterno || "");

  const [diaNacimiento, setDiaNacimiento] = useState("");
  const [mesNacimiento, setMesNacimiento] = useState("");
  const [añoNacimiento, setAñoNacimiento] = useState("");

  const [sexo, setSexo] = useState(initialEmpleado.sexo || "");
  const [rfc, setRfc] = useState(initialEmpleado.rfc || "");
  const [curp, setCurp] = useState(initialEmpleado.curp || "");
  const [nss, setNss] = useState(initialEmpleado.nss || "");
  const [telefono, setTelefono] = useState(initialEmpleado.telefono || "");
  const [correoElectronico, setCorreoElectronico] = useState(initialEmpleado.correoElectronico || "");
  const [calle, setCalle] = useState(initialEmpleado.calle || "");
  const [colonia, setColonia] = useState(initialEmpleado.colonia || "");
  const [ciudad, setCiudad] = useState(initialEmpleado.ciudad || "");
  const [estado, setEstado] = useState(initialEmpleado.estado || "");
  const [codigoPostal, setCodigoPostal] = useState(initialEmpleado.codigoPostal || "");
  const [rol, setRol] = useState(initialEmpleado.rol || "");
  const [estadoEmpleado, setEstadoEmpleado] = useState(initialEmpleado.estadoEmpleado || "");
  const [nombreUsuario, setNombreUsuario] = useState(initialEmpleado.nombreUsuario || "");
  const [contraseña, setContraseña] = useState(initialEmpleado.contraseña || "");
  const [observaciones, setObservaciones] = useState(initialEmpleado.observaciones || "");
  const [archivoPDF, setArchivoPDF] = useState(initialEmpleado.archivoPDF || null);

  const handleGuardar = useCallback(() => {
    const fechaNacimiento =
      diaNacimiento && mesNacimiento && añoNacimiento
        ? `${añoNacimiento}-${mesNacimiento.padStart(2, "0")}-${diaNacimiento.padStart(2, "0")}`
        : "";

    const empleadoData = {
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

    console.log("Guardar Empleado:", empleadoData);
    return empleadoData;
  }, [
    nombres,
    apellidoPaterno,
    apellidoMaterno,
    diaNacimiento,
    mesNacimiento,
    añoNacimiento,
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
  ]);

  return {
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
