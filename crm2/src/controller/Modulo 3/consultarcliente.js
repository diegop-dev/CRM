import { useState, useEffect } from "react";
import { Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_URL } from "../../config/apiConfig";

// Helper para mapear los datos de la DB (snake_case/nombre) al Formulario (camelCase/nombreCliente)
function formatearCliente(c) {
  if (!c) return null;
  return {
    id_cliente: c.id_cliente,
    // Mapeo clave: DB 'nombre' -> Form 'nombreCliente'
    nombreCliente: (c.nombre || c.nombre_cliente || "").trim(),
    apellidoPaterno: (c.apellido_paterno || "").trim(),
    apellidoMaterno: (c.apellido_materno || "").trim(),
    tipoCliente: (c.tipo || c.tipo_cliente || "").trim(), // DB 'tipo' -> Form 'tipoCliente'
    estadoCliente: (c.estado_cliente || "").trim(),
    sexo: (c.sexo || "").trim(),
    correoElectronico: (c.correo_electronico || "").trim(),
    telefono: (c.telefono || "").trim(),
    calle: (c.calle || "").trim(),
    colonia: (c.colonia || "").trim(),
    ciudad: (c.ciudad || "").trim(),
    estado: (c.estado || "").trim(),
    pais: (c.pais || "").trim(),
    codigoPostal: (c.codigo_postal || "").trim(),
    descripcion: (c.descripcion || "").trim(),
  };
}

export function useConsultarClienteLogic() {
  const navigation = useNavigation();
  const [terminoBusqueda, setTerminoBusqueda] = useState("");
  const [cliente, setCliente] = useState(null); // Cliente seleccionado/buscado
  const [clientesAleatorios, setClientesAleatorios] = useState([]); // Lista inicial
  const [loading, setLoading] = useState(false);

  // 1. Cargar clientes aleatorios al iniciar
  useEffect(() => {
    async function fetchAleatorios() {
      try {
        const response = await fetch(`${API_URL}/clientes/aleatorios`);
        const data = await response.json();
        if (data.success) {
          // Formateamos también los de la lista para consistencia
          const formateados = data.clientes.map(c => formatearCliente(c));
          setClientesAleatorios(formateados);
        }
      } catch (error) {
        console.error("Error al cargar aleatorios:", error);
      }
    }
    fetchAleatorios();
  }, []);

  // 2. Buscar cliente por nombre
  const buscarCliente = async (terminoOpcional) => {
    const termino = terminoOpcional || terminoBusqueda;
    if (!termino.trim()) {
      Alert.alert("Atención", "Ingrese un nombre para buscar.");
      return;
    }

    setLoading(true);
    setCliente(null); // Limpiar selección previa

    try {
      const response = await fetch(`${API_URL}/clientes/buscar?termino=${encodeURIComponent(termino)}`);
      const data = await response.json();

      if (data.success && data.clientes && data.clientes.length > 0) {
        // Tomamos el primero encontrado y lo formateamos
        setCliente(formatearCliente(data.clientes[0]));
      } else {
        Alert.alert("Sin resultados", "No se encontró ningún cliente.");
      }
    } catch (error) {
      console.error("Error al buscar:", error);
      Alert.alert("Error", "No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Manejar clic en campo bloqueado -> Redirigir a Editar
  const handleRequestEdit = () => {
    Alert.alert(
      "Modo Consulta",
      "Este formulario es de solo lectura. ¿Desea editar este cliente?",
      [
        { text: "Cancelar", style: "cancel" },
        { 
          text: "Sí, Editar", 
          onPress: () => {
            // Navegamos a EditarCliente pasando el objeto 'cliente' formateado
            navigation.navigate("EditarCliente", { cliente: cliente });
          } 
        }
      ]
    );
  };

  // 4. Limpiar búsqueda y volver a la lista
  const limpiarBusqueda = () => {
    setCliente(null);
    setTerminoBusqueda("");
  };

  return {
    terminoBusqueda,
    setTerminoBusqueda,
    cliente,
    clientesAleatorios,
    loading,
    buscarCliente,
    handleRequestEdit,
    limpiarBusqueda
  };
}
