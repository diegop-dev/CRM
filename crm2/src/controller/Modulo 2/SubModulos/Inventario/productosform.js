import { useState, useCallback } from "react";

// Renombrado a 'useProductoLogic'
export function useProductoLogic(initialProducto = {}) {
  
  // --- Estados basados en los wireframes de Producto ---
  
  const [idProducto, setIdProducto] = useState(initialProducto.id_producto || "");
  const [nombre, setNombre] = useState(initialProducto.nombre || "");
  
  // --- CAMPOS AÑADIDOS ---
  const [codigoInterno, setCodigoInterno] = useState(initialProducto.codigo_interno || "");
  const [unidadMedida, setUnidadMedida] = useState(initialProducto.unidad_medida || "");
  // --- FIN CAMPOS AÑADIDOS ---

  const [categoria, setCategoria] = useState(initialProducto.categoria || "");

  // --- Lógica de ID de Empleado (Responsable) ---
  const [idResponsable, setIdResponsable] = useState(initialProducto.id_responsable || "");
  const [responsableNombre, setResponsableNombre] = useState(initialProducto.responsable_nombre || "");

  // --- LÓGICA DE FECHA ---
  const fecha = initialProducto.fecha_ingreso
    ? new Date(initialProducto.fecha_ingreso)
    : null;
  
  const [diaIngreso, setDiaIngreso] = useState(fecha ? fecha.getDate().toString() : "");
  const [mesIngreso, setMesIngreso] = useState(fecha ? (fecha.getMonth() + 1).toString() : "");
  const [añoIngreso, setAñoIngreso] = useState(fecha ? fecha.getFullYear().toString() : "");
  // --- FIN LÓGICA DE FECHA ---

  const [cantidad, setCantidad] = useState(initialProducto.cantidad || "");
  
  // --- CAMPO AÑADIDO ---
  const [estado, setEstado] = useState(initialProducto.estado || "");
  // --- FIN CAMPO AÑADIDO ---

  const [descripcion, setDescripcion] = useState(initialProducto.descripcion || "");

  const handleGuardar = useCallback(() => {
    
    const fechaIngreso =
      diaIngreso && mesIngreso && añoIngreso
        ? `${añoIngreso}-${mesIngreso.padStart(2, "0")}-${diaIngreso.padStart(2, "0")}`
        : ""; 

    // CAMBIO: Retorna el objeto 'producto' con los nuevos campos
    return {
      id_producto: idProducto,
      nombre: nombre,
      codigo_interno: codigoInterno, // <-- AÑADIDO
      categoria: categoria,
      unidad_medida: unidadMedida, // <-- AÑADIDO
      id_responsable: idResponsable,
      responsable_nombre: responsableNombre,
      fecha_ingreso: fechaIngreso,
      cantidad: cantidad,
      estado: estado, // <-- AÑADIDO
      descripcion: descripcion,
    };
  }, [
    // CAMBIO: Dependencias actualizadas
    idProducto, nombre, codigoInterno, categoria, unidadMedida, 
    idResponsable, responsableNombre,
    diaIngreso, mesIngreso, añoIngreso,
    cantidad, estado, descripcion
  ]);

  // CAMBIO: Retorno de estados y setters para 'producto'
  return {
    idProducto, setIdProducto,
    nombre, setNombre,
    codigoInterno, setCodigoInterno, // <-- AÑADIDO
    categoria, setCategoria,
    unidadMedida, setUnidadMedida, // <-- AÑADIDO
    idResponsable, setIdResponsable,
    responsableNombre, setResponsableNombre,
    diaIngreso, setDiaIngreso,
    mesIngreso, setMesIngreso,
    añoIngreso, setAñoIngreso,
    cantidad, setCantidad,
    estado, setEstado, // <-- AÑADIDO
    descripcion, setDescripcion,
    handleGuardar,
  };
}
