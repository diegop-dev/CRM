import { useState, useCallback } from "react";

// Hook personalizado para manejar la lógica del formulario de documentos
export function useDocumentoLogic(initialDocumento = {}) {
  
  // --- Estados del Documento ---
  // Inicializamos con los valores recibidos o cadenas vacías
  const [idDocumento, setIdDocumento] = useState(initialDocumento.id_documento || "");
  const [indentificadorUnico, setIndentificadorUnico] = useState(initialDocumento.indentificador_unico || "");
  const [descripcion, setDescripcion] = useState(initialDocumento.descripción || ""); // Leemos de 'descripción' con tilde
  const [categoria, setCategoria] = useState(initialDocumento.categoria || "");
  const [estado, setEstado] = useState(initialDocumento.estado || "");
  
  // --- Lógica de Empleado (en lugar de Responsable) ---
  // Guardamos tanto el ID (para la BD) como el Nombre (para mostrar en UI)
  const [idEmpleado, setIdEmpleado] = useState(initialDocumento.id_empleado || "");
  const [empleadoNombre, setEmpleadoNombre] = useState(initialDocumento.empleado_nombre || "");

  // --- Campo Archivo ---
  const [archivo, setArchivo] = useState(initialDocumento.archivo || "");

  // --- Función para preparar el objeto a guardar ---
  const handleGuardar = useCallback(() => {
    
    // Retorna el objeto con las claves en snake_case, listas para la API
    return {
      id_documento: idDocumento,
      indentificador_unico: indentificadorUnico,
      descripción: descripcion, // Guardamos la clave con tilde
      categoria: categoria,
      id_empleado: idEmpleado,
      empleado_nombre: empleadoNombre, // Útil para actualizar la lista local sin recargar
      archivo: archivo,
      estado: estado,
    };
  }, [
    idDocumento, 
    indentificadorUnico, 
    descripcion, 
    categoria, 
    idEmpleado, 
    empleadoNombre, 
    archivo, 
    estado
  ]);

  // Retornamos todo lo necesario para que el componente visual funcione
  return {
    // Getters y Setters
    idDocumento, setIdDocumento,
    indentificadorUnico, setIndentificadorUnico,
    descripcion, setDescripcion,
    categoria, setCategoria,
    idEmpleado, setIdEmpleado,
    empleadoNombre, setEmpleadoNombre,
    archivo, setArchivo,
    estado, setEstado,
    
    // Acción
    handleGuardar,
  };
}
