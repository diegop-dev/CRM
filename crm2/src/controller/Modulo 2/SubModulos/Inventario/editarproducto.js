import { useState, useEffect, useCallback } from "react";
import { Alert } from "react-native";
import { API_URL } from "../../../../config/apiConfig";
import { useNavigation } from "@react-navigation/native";

// Estructura de producto vacía para inicialización (DEBE SER CAMELCASE)
const PRODUCTO_VACIO = {
    id_producto: null, nombre: "", codigoInterno: "", unidadMedida: "",
    categoria: "", idResponsable: "", responsableNombre: "", diaIngreso: "",
    mesIngreso: "", añoIngreso: "", cantidad: "", estado: "", descripcion: "",
};

// Utilidad para formatear la fecha de SQL a los campos del formulario
const formatearProducto = (p) => {
    if (!p) return PRODUCTO_VACIO;

    // Manejamos la fecha y hora de SQL Server
    const fecha = p.fecha_ingreso
        ? new Date(p.fecha_ingreso)
        : null;

    return {
        // Mapeo de datos (API snake_case a React camelCase)
        id_producto: p.id_producto ? p.id_producto.toString() : null,
        nombre: (p.nombre || "").trim(),
        codigoInterno: (p.codigo_interno || "").trim(),
        unidadMedida: (p.unidad_medida || "").trim(),
        categoria: (p.categoria || "").trim(),
        idResponsable: p.id_responsable ? p.id_responsable.toString() : "",
        responsableNombre: (p.responsable_nombre || "").trim(),
        diaIngreso: fecha ? fecha.getDate().toString() : "",
        mesIngreso: fecha ? (fecha.getMonth() + 1).toString() : "",
        añoIngreso: fecha ? fecha.getFullYear().toString() : "",
        cantidad: p.cantidad ? p.cantidad.toString() : "",
        estado: (p.estado || "").trim(),
        descripcion: (p.descripcion || "").trim(),
    };
};


export function useEditarProductoLogic() {
    const navigation = useNavigation();
    const [terminoBusqueda, setTerminoBusqueda] = useState("");
    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [empleadosList, setEmpleadosList] = useState([]);
    const [loading, setLoading] = useState(false);

    // Función para obtener productos aleatorios (listado inicial)
    const cargarProductosAleatorios = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`${API_URL}/inventario/productos/aleatorios`);
            if (!response.ok) throw new Error("Fallo al cargar aleatorios");
            const data = await response.json();
            if (data.success && data.productos) {
                setProductos(data.productos);
            } else {
                setProductos([]);
            }
        } catch (error) {
            console.error("Error al cargar productos aleatorios:", error);
        } finally {
            setLoading(false);
        }
    }, [setProductos]);

    // --- EFECTO: Carga inicial de Empleados y Productos/Aleatorios ---
    useEffect(() => {
        const cargarDatosIniciales = async () => {
            setLoading(true);
            try {
                // 1. Cargar Empleados (Ruta modular)
                const empResponse = await fetch(`${API_URL}/inventario/empleados/todos`);
                if (!empResponse.ok) throw new Error("Fallo al cargar empleados");
                const empData = await empResponse.json();
                if (empData.success) {
                    setEmpleadosList(empData.empleados);
                }

                // 2. Cargar productos aleatorios para el listado inicial
                await cargarProductosAleatorios();

            } catch (error) {
                console.error("Error al cargar datos iniciales:", error);
            } finally {
                setLoading(false);
            }
        };
        cargarDatosIniciales();
    }, [cargarProductosAleatorios]);


    // Función para buscar productos por nombre/código
    const buscarProducto = useCallback(async () => {
        if (!terminoBusqueda.trim()) {
            cargarProductosAleatorios();
            return;
        }
        setLoading(true);
        try {
            // RUTA MODULAR
            const response = await fetch(
                `${API_URL}/inventario/productos/buscar?termino=${encodeURIComponent(terminoBusqueda)}`
            );
            if (!response.ok) throw new Error("Fallo en búsqueda");
            const data = await response.json();
            if (data.success && data.productos?.length) {
                setProductos(data.productos);
            } else {
                setProductos([]);
                Alert.alert("Sin resultados", "No se encontró ningún producto con ese término.");
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo realizar la búsqueda.");
        } finally {
            setLoading(false);
        }
    }, [terminoBusqueda, cargarProductosAleatorios]);

    // Función que se ejecuta cuando se selecciona un producto de la lista (Llamada desde la lista de búsqueda)
    const seleccionarProducto = useCallback(async (p) => {
        setLoading(true);
        try {
            // 1. Obtenemos los detalles completos del producto por ID
            const response = await fetch(
                `${API_URL}/inventario/productos/buscar/${p.id_producto || p.idProducto}`
            );
            if (!response.ok) throw new Error("Fallo al obtener detalles");
            const data = await response.json();

            if (data.success && data.producto) {
                // 2. Formateamos el objeto crudo (snake_case) para el formulario (camelCase)
                setProductoSeleccionado(formatearProducto(data.producto));
                setProductos([]); // Limpiamos la lista de búsqueda
            } else {
                Alert.alert("Error", "No se pudieron obtener los datos completos del producto.");
            }
        } catch (error) {
            Alert.alert("Error", "No se pudo conectar con el servidor para obtener los detalles.");
        } finally {
            setLoading(false);
        }
    }, []);


    //  setProductoDesdeNavegacion: Corregido para ACEPTAR el objeto camelCase directamente (FLUIDEZ ENTRE PANTALLAS)
    const setProductoDesdeNavegacion = useCallback((p) => {
        // Asignamos el objeto directamente. Asumimos que ConsultarProductoView ya hizo el mapeo API -> camelCase.
        setProductoSeleccionado(p);
    }, []);


    // Función para guardar los cambios del producto
    const guardarCambios = useCallback(async () => {
        if (!productoSeleccionado || !productoSeleccionado.id_producto) {
            Alert.alert("Error", "No hay producto seleccionado para guardar.");
            return;
        }

        // Reconstruimos la fecha
        const fechaIngreso =
            productoSeleccionado.diaIngreso && productoSeleccionado.mesIngreso && productoSeleccionado.añoIngreso
                ? `${productoSeleccionado.añoIngreso}-${productoSeleccionado.mesIngreso.padStart(2, "0")}-${productoSeleccionado.diaIngreso.padStart(2, "0")}`
                : null;

        // Preparamos la data (Mapeo de camelCase a snake_case para la API)
        const dataParaEnviar = {
            nombre: (productoSeleccionado.nombre || "").trim(),
            codigo_interno: (productoSeleccionado.codigoInterno || "").trim(), // Mapeo
            categoria: (productoSeleccionado.categoria || "").trim(),
            unidad_medida: (productoSeleccionado.unidadMedida || ""),           // Mapeo
            idResponsable: parseInt(productoSeleccionado.idResponsable),
            fechaIngreso: fechaIngreso,
            cantidad: parseInt(productoSeleccionado.cantidad) || 0,
            estado: (productoSeleccionado.estado || ""),
            descripcion: (productoSeleccionado.descripcion || "").trim(),
        };

        const id = productoSeleccionado.id_producto;

        try {
            // RUTA MODULAR
            const response = await fetch(`${API_URL}/inventario/productos/editar/${id}`, {
                method: "PUT", headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dataParaEnviar),
            });
            if (!response.ok) throw new Error("Fallo en la actualización");

            const data = await response.json();

            if (data.success) {
                Alert.alert("Éxito", "Producto actualizado correctamente.");
                navigation.goBack(); // Volvemos a la pantalla anterior
            } else {
                Alert.alert("Error", data.message || "No se pudieron guardar los cambios.");
            }
        } catch (error) {
            Alert.alert("Error de Servidor", "Error al guardar. Revisa la conexión.");
        }
    }, [productoSeleccionado, navigation]);

    // Función para deseleccionar y volver a la lista
    const deseleccionarProducto = useCallback(() => {
        setProductoSeleccionado(null);
        setTerminoBusqueda("");
        cargarProductosAleatorios(); // Recargamos para volver a la lista de búsqueda
    }, [cargarProductosAleatorios]);

    // Handler para actualizar el productoSeleccionado desde el Formulario
    const handleFormChange = useCallback((key, value) => {
        setProductoSeleccionado(prev => ({
            ...prev,
            [key]: value
        }));
    }, []);

    return {
        terminoBusqueda,
        setTerminoBusqueda,
        productos,
        productoSeleccionado,
        setProductoSeleccionado: handleFormChange,
        setProductoDesdeNavegacion,
        empleadosList,
        loading,
        buscarProducto,
        seleccionarProducto,
        guardarCambios,
        deseleccionarProducto,
    };
}