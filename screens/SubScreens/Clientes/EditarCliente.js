import React, { useState } from 'react'; // Eliminamos useEffect porque ya no se carga al inicio
import { Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ClienteForm from './ClienteForm';
import BuscadorCliente from './BuscadorCliente' // 1. Importamos el nuevo componente de búsqueda

// Eliminamos 'route' de las props, ya no se reciben datos por navegación
export default function EditarCliente() {

  // Todos los estados se mantienen, pero se inicializan vacíos.
  // Serán llenados por la función de búsqueda.
  const [idCliente, setIdCliente] = useState('');
  const [nombre, setNombre] = useState('');
  const [apellidoPaterno, setApellidoPaterno] = useState('');
  const [apellidoMaterno, setApellidoMaterno] = useState('');
  const [tipo, setTipo] = useState('');
  const [estadoCliente, setEstadoCliente] = useState('');
  const [sexo, setSexo] = useState('');
  const [correoElectronico, setCorreoElectronico] = useState('');
  const [telefono, setTelefono] = useState('');
  const [calle, setCalle] = useState('');
  const [colonia, setColonia] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [estado, setEstado] = useState('');
  const [pais, setPais] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [createdAt, setCreatedAt] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [updatedBy, setUpdatedBy] = useState('');

  // 2. Esta función se ejecutará cuando el BuscadorPorID encuentre un cliente.
  // Recibe los datos del cliente y actualiza todos los estados de este componente.
  const handleClienteEncontrado = (clienteData) => {
    if (clienteData) {
      setIdCliente(clienteData.idCliente);
      setNombre(clienteData.nombre || '');
      setApellidoPaterno(clienteData.apellidoPaterno || '');
      setApellidoMaterno(clienteData.apellidoMaterno || '');
      setTipo(clienteData.tipo || '');
      setEstadoCliente(clienteData.estadoCliente || '');
      setSexo(clienteData.sexo || '');
      setCorreoElectronico(clienteData.correoElectronico || '');
      setTelefono(clienteData.telefono || '');
      setCalle(clienteData.calle || '');
      setColonia(clienteData.colonia || '');
      setCiudad(clienteData.ciudad || '');
      setEstado(clienteData.estado || '');
      setPais(clienteData.pais || '');
      setCodigoPostal(clienteData.codigoPostal || '');
      setDescripcion(clienteData.descripcion || '');
      setCreatedAt(clienteData.createdAt || '');
      setCreatedBy(clienteData.createdBy || '');
      setUpdatedAt(clienteData.updatedAt || '');
      setUpdatedBy(clienteData.updatedBy || '');
    }
  };

  // La función de guardar se mantiene, pero ahora opera sobre los estados
  // que fueron poblados por la búsqueda.
  const guardarCliente = () => {
    // Se añade una validación para asegurar que un cliente ha sido cargado.
    if (!idCliente) {
      Alert.alert("Error", "Primero debe buscar y cargar un cliente para poder guardarlo.");
      return;
    }
    
    Alert.alert(
      "Confirmación",
      "¿Desea guardar los cambios en este cliente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            if (nombre.trim() === '' && apellidoPaterno.trim() === '') {
              Alert.alert("Error", "El cliente debe tener al menos un nombre o apellido.");
              return;
            }

            const fechaHoy = new Date().toISOString();
            const usuarioActual = 'usuario_editor';

            // Aquí se construiría el objeto actualizado para enviar a la API
            const clienteActualizado = { idCliente, nombre, /*...todos los demás estados...*/ updatedAt: fechaHoy, updatedBy: usuarioActual };
            
            Alert.alert("Éxito", "Cliente editado con éxito");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* 3. Envolvemos todo en un ScrollView para evitar problemas de espacio */}
      <ScrollView>
        {/* 4. Renderizamos el componente de búsqueda y le pasamos la función manejadora */}
        <BuscadorCliente onClienteEncontrado={handleClienteEncontrado} />

        {/* 5. El formulario solo se muestra si se ha encontrado un cliente (verificando el idCliente) */}
        {idCliente ? (
          <ClienteForm
            cliente={{
              idCliente,
              nombre, setNombre,
              apellidoPaterno, setApellidoPaterno,
              apellidoMaterno, setApellidoMaterno,
              tipo, setTipo,
              estadoCliente, setEstadoCliente,
              sexo, setSexo,
              correoElectronico, setCorreoElectronico,
              telefono, setTelefono,
              calle, setCalle,
              colonia, setColonia,
              ciudad, setCiudad,
              estado, setEstado,
              pais, setPais,
              codigoPostal, setCodigoPostal,
              descripcion, setDescripcion,
              createdAt,
              createdBy,
              updatedAt,
              updatedBy,
            }}
            mode="editar"
            onGuardar={guardarCliente}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
