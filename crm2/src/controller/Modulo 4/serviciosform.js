import { useState, useCallback } from "react";

// Hook personalizado para manejar la lógica del formulario de servicios
export function useServicioLogic(initialServicio = {}) {
  
  // --- Estados del Servicio ---
  // Inicializamos con los valores recibidos o cadenas vacías
  const [idServicio, setIdServicio] = useState(initialServicio.id_servicio || "");
  const [nombreServicio, setNombreServicio] = useState(initialServicio.nombre_servicio || "");
  const [descripcion, setDescripcion] = useState(initialServicio.descripcion || "");
  const [categoria, setCategoria] = useState(initialServicio.categoria || "");
  const [precio, setPrecio] = useState(initialServicio.precio || "");
  
  const [moneda, setMoneda] = useState(initialServicio.moneda || "");
  const [duracionEstimada, setDuracionEstimada] = useState(initialServicio.duracion_estimada || "");
  const [estado, setEstado] = useState(initialServicio.estado || "");
  
  // --- Lógica de Responsable ---
  // Guardamos tanto el ID (para la BD) como el Nombre (para mostrar en UI)
  const [idResponsable, setIdResponsable] = useState(initialServicio.id_responsable || "");
  const [responsableNombre, setResponsableNombre] = useState(initialServicio.responsable_nombre || "");

  const [notasInternas, setNotasInternas] = useState(initialServicio.notas_internas || "");

  // --- Campo Archivo (Sincronizado con SQL) ---
  const [archivo, setArchivo] = useState(initialServicio.archivo || "");

  // --- Función para preparar el objeto a guardar ---
  const handleGuardar = useCallback(() => {
    
    // Retorna el objeto con las claves en snake_case, listas para la API
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
      responsable_nombre: responsableNombre, // Útil para actualizar la lista local sin recargar
      notas_internas: notasInternas,
      archivo: archivo,
    };
  }, [
    idServicio, 
    nombreServicio, 
    descripcion, 
    categoria, 
    precio,
    moneda, 
    duracionEstimada, 
    estado, 
    idResponsable, 
    responsableNombre, 
    notasInternas, 
    archivo
  ]);

  // Retornamos todo lo necesario para que el componente visual funcione
  return {
    // Getters y Setters
    idServicio, setIdServicio,
    nombreServicio, setNombreServicio,
    descripcion, setDescripcion,
    categoria, setCategoria,
    precio, setPrecio,
    moneda, setMoneda,
    duracionEstimada, setDuracionEstimada,
    estado, setEstado,
    idResponsable, setIdResponsable,
    responsableNombre, setResponsableNombre,
    notasInternas, setNotasInternas,
    archivo, setArchivo,
    
    // Acción
    handleGuardar,
  };
}
