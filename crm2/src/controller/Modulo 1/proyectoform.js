import { useState, useCallback } from "react";

export function useProyectoLogic(initialProyecto = {}) {
  const [idProyecto] = useState(initialProyecto.idProyecto || "");
  const [nombreProyecto, setNombreProyecto] = useState(initialProyecto.nombreProyecto || "");
  const [tipoProyecto, setTipoProyecto] = useState(initialProyecto.tipoProyecto || "");

  
  const [diaInicio, setDiaInicio] = useState("");
  const [mesInicio, setMesInicio] = useState("");
  const [añoInicio, setAñoInicio] = useState("");

  const [diaFin, setDiaFin] = useState("");
  const [mesFin, setMesFin] = useState("");
  const [añoFin, setAñoFin] = useState("");

  const [responsable, setResponsable] = useState(initialProyecto.responsable || "");
  const [estado, setEstado] = useState(initialProyecto.estado || "");
  const [prioridad, setPrioridad] = useState(initialProyecto.prioridad || "");
  const [RecursosList, setRecursosList] = useState(initialProyecto.RecursosList || []);
  const [Auditoria] = useState(initialProyecto.Auditoria || "");
  const [Descripcion, setDescripcion] = useState(initialProyecto.Descripcion || "");

  const handleGuardar = useCallback(() => {
    
    const fechaInicio = diaInicio && mesInicio && añoInicio ? `${añoInicio}-${mesInicio.padStart(2,"0")}-${diaInicio.padStart(2,"0")}` : "";
    const fechaFin = diaFin && mesFin && añoFin ? `${añoFin}-${mesFin.padStart(2,"0")}-${diaFin.padStart(2,"0")}` : "";

    const proyectoData = {
      idProyecto,
      nombreProyecto,
      tipoProyecto,
      fechaInicio,
      fechaFin,
      responsable,
      estado,
      prioridad,
      RecursosList,
      Auditoria,
      Descripcion,
    };

    console.log("Guardar Proyecto:", proyectoData);
    return proyectoData;
  }, [
    idProyecto,
    nombreProyecto,
    tipoProyecto,
    diaInicio,
    mesInicio,
    añoInicio,
    diaFin,
    mesFin,
    añoFin,
    responsable,
    estado,
    prioridad,
    RecursosList,
    Auditoria,
    Descripcion,
  ]);

  return {
    idProyecto,
    nombreProyecto,
    setNombreProyecto,
    tipoProyecto,
    setTipoProyecto,
    diaInicio,
    setDiaInicio,
    mesInicio,
    setMesInicio,
    añoInicio,
    setAñoInicio,
    diaFin,
    setDiaFin,
    mesFin,
    setMesFin,
    añoFin,
    setAñoFin,
    responsable,
    setResponsable,
    estado,
    setEstado,
    prioridad,
    setPrioridad,
    RecursosList,
    setRecursosList,
    Auditoria,
    Descripcion,
    setDescripcion,
    handleGuardar,
  };
}
