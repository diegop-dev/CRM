import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../config/apiConfig"; 

export function useUsuarioFormLogic(initialUsuario) {
  
  //  PROTECCIÓN CLAVE: Si initialUsuario es null, usamos un objeto vacío para evitar crashes iniciales.
  const usuario = initialUsuario || {}; 

  // Estados iniciales seguros
  const [idUsuario, setIdUsuario] = useState(usuario.id_usuario || null);
  const [nombreUsuario, setNombreUsuario] = useState(usuario.nombre_usuario || "");
  const [contraseña, setContraseña] = useState(""); 
  const [idRol, setIdRol] = useState(usuario.id_rol || "");
  
  const [idEmpleado, setIdEmpleado] = useState(usuario.id_empleado || "");
  // Concatenamos nombre para mostrar si existe, sino cadena vacía
  const nombreCompleto = usuario.nombres ? `${usuario.nombres} ${usuario.apellido_paterno}` : "";
  const [nombreEmpleado, setNombreEmpleado] = useState(nombreCompleto);

  // --- PERMISOS ---
  const [listaPermisos, setListaPermisos] = useState([]);
  const [loadingPermisos, setLoadingPermisos] = useState(false);

  // 1. NUEVO EFECTO: Sincronizar datos cuando cambias de usuario en la lista
  // Este useEffect es vital para que el formulario se "refresque" al tocar otro usuario.
  useEffect(() => {
    if (initialUsuario) {
        setIdUsuario(initialUsuario.id_usuario);
        setNombreUsuario(initialUsuario.nombre_usuario);
        setIdRol(initialUsuario.id_rol);
        setIdEmpleado(initialUsuario.id_empleado);
        setNombreEmpleado(initialUsuario.nombres ? `${initialUsuario.nombres} ${initialUsuario.apellido_paterno}` : "");
        setContraseña(""); // Limpiar contraseña por seguridad
    } else {
        // Si se deselecciona (null), limpiar todo el formulario
        setIdUsuario(null);
        setNombreUsuario("");
        setNombreEmpleado("");
        setIdRol("");
        setIdEmpleado("");
        setListaPermisos([]);
    }
  }, [initialUsuario]);

  // 2. Cargar permisos cuando tenemos un ID de usuario válido
  useEffect(() => {
    const fetchPermisos = async () => {
      setLoadingPermisos(true);
      try {
        // Si tenemos ID, pedimos sus permisos específicos.
        // Si no (es nuevo o está limpio), pedimos el catálogo base vacío.
        const endpoint = idUsuario 
          ? `${API_URL}/usuarios/${idUsuario}/permisos`
          : `${API_URL}/usuarios/catalogo-permisos`;

        const response = await fetch(endpoint);
        const data = await response.json();

        if (data.success) {
          setListaPermisos(data.permisos);
        } else {
           console.error("Error data permisos:", data.message);
        }
      } catch (error) {
        console.error("Error permisos:", error);
        setListaPermisos([]); // Fallback para evitar errores visuales
      } finally {
        setLoadingPermisos(false);
      }
    };

    // Ejecutar solo si hay un usuario seleccionado o para resetear
    if (idUsuario || !initialUsuario) {
        fetchPermisos();
    }
  }, [idUsuario]); // Dependencia crítica: idUsuario

  // 3. Toggle Switch (Cambiar estado de permiso localmente en la UI)
  const togglePermiso = useCallback((idModulo) => {
    setListaPermisos(prev => prev.map(item => 
        item.id_modulo === idModulo ? { ...item, activo: !item.activo } : item
    ));
  }, []);

  // 4. Función GUARDAR CAMBIOS
  const guardarCambios = async () => {
    if (!idUsuario) {
        Alert.alert("Error", "No hay un usuario seleccionado para guardar.");
        return;
    }

    // Filtramos solo los permisos que están en 'true' para enviar al backend
    // El backend espera un array de enteros: [1, 3, 5]
    const permisosActivosIds = listaPermisos
        .filter(p => p.activo)
        .map(p => p.id_modulo);

    try {
        const response = await fetch(`${API_URL}/usuarios/actualizar-permisos`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                id_usuario: idUsuario,
                permisos: permisosActivosIds // Enviamos el array limpio
            })
        });

        const data = await response.json();

        if (data.success) {
            Alert.alert("Éxito", "Permisos actualizados correctamente.");
        } else {
            Alert.alert("Error", data.message || "No se pudieron guardar los cambios.");
        }

    } catch (error) {
        console.error(error);
        Alert.alert("Error", "Fallo de conexión con el servidor.");
    }
  };

  // 5. Preparar objeto de retorno para la Vista
  return {
    // Datos del Formulario
    nombreUsuario, setNombreUsuario,
    contraseña, setContraseña,
    idRol, setIdRol,
    idEmpleado, setIdEmpleado,
    nombreEmpleado, setNombreEmpleado,
    
    // Gestión de Permisos
    listaPermisos,
    togglePermiso,
    loadingPermisos,

    // Acción Principal
    guardarCambios 
  };
}