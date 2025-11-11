import { useState, useCallback } from "react";

// Renombrado a 'useServicioLogic'
export function useServicioLogic(initialServicio = {}) {
  
  // --- Estados basados en los wireframes de Servicio ---
  // (Siguiendo el patrón de 'useEmpleadoLogic')
  
  const [idServicio, setIdServicio] = useState(initialServicio.id_servicio || "");
  const [nombreServicio, setNombreServicio] = useState(initialServicio.nombre_servicio || "");
  const [descripcion, setDescripcion] = useState(initialServicio.descripcion || "");
  const [categoria, setCategoria] = useState(initialServicio.categoria || "");
  const [precio, setPrecio] = useState(initialServicio.precio || "");
  
  const [moneda, setMoneda] = useState(initialServicio.moneda || "");
  const [duracionEstimada, setDuracionEstimada] = useState(initialServicio.duracion_estimada || "");
  const [estado, setEstado] = useState(initialServicio.estado || "");
  
  // --- Lógica de ID de Empleado (Responsable) ---
  // (Inspirado en 'useProyectoLogic' pero adaptado 
  // para 'serviciosform.jsx' que maneja ID y Nombre)
  const [idResponsable, setIdResponsable] = useState(initialServicio.id_responsable || "");
  const [responsableNombre, setResponsableNombre] = useState(initialServicio.responsable_nombre || "");

  const [notasInternas, setNotasInternas] = useState(initialServicio.notas_internas || "");

  // --- Campos de 'empleado' eliminados ---
  // (nombres, apellidos, fecha, sexo, rfc, curp, nss, direccion, rol, etc.)


  const handleGuardar = useCallback(() => {
    
    // --- Lógica de fecha de 'empleado' eliminada ---

    // Retorna el objeto 'servicio' con los campos
    // (Usando snake_case para la API, como en el original)
    return {
      id_servicio: idServicio,
      nombre_servicio: nombreServicio,
      descripcion: descripcion,
      categoria: categoria,
      precio: precio,
      moneda: moneda,
      duracion_estimada: duracionEstimada,
      estado: estado,
      id_responsable: idResponsable,
      responsable_nombre: responsableNombre, // Enviamos ambos, por si acaso
      notas_internas: notasInternas,
    };
  }, [
    // Dependencias actualizadas
    idServicio, nombreServicio, descripcion, categoria, precio,
    moneda, duracionEstimada, estado, idResponsable, responsableNombre, notasInternas
  ]);

  // Retorno de estados y setters para 'servicio'
  return {
    idServicio, setIdServicio,
    nombreServicio, setNombreServicio,
    descripcion, setDescripcion,
    categoria, setCategoria,
    precio, setPrecio,
    moneda, setMoneda,
    duracionEstimada, setDuracionEstimada,
    estado, setEstado,
    idResponsable, setIdResponsable,
    responsableNombre, setResponsableNombre, // <-- Se retorna el estado y setter
    notasInternas, setNotasInternas,
    handleGuardar,
  };
}
