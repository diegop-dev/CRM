import { useState, useCallback } from "react";


export function useProyectoLogic(initialProyecto = {}) {
  const [idProyecto] = useState(initialProyecto.idProyecto || "");
  const [nombreProyecto, setNombreProyecto] = useState(
    initialProyecto.nombreProyecto || ""
  );
  const [tipoProyecto, setTipoProyecto] = useState(
    initialProyecto.tipoProyecto || ""
  );
  const [fechaInicio, setFechaInicio] = useState(
    initialProyecto.fechaInicio || ""
  );
  const [fechaFin, setFechaFin] = useState(initialProyecto.fechaFin || "");
  const [responsable, setResponsable] = useState(
    initialProyecto.responsable || ""
  );
  const [estado, setEstado] = useState(initialProyecto.estado || "");
  const [prioridad, setPrioridad] = useState(initialProyecto.prioridad || "");
  const [RecursosList, setRecursosList] = useState(
    initialProyecto.RecursosList || []
  );
  const [Auditoria] = useState(initialProyecto.Auditoria || "");
  const [Descripcion, setDescripcion] = useState(
    initialProyecto.Descripcion || ""
  );

  const handleGuardar = useCallback(() => {
    
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
    fechaInicio,
    fechaFin,
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
    fechaInicio,
    setFechaInicio,
    fechaFin,
    setFechaFin,
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
