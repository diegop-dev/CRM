import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ClienteForm from './SubScreens/Clientes/ClienteForm';

export default function GestionClientes() {
  // --- Estados para los campos del cliente ---
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

  // --- Estados para campos de auditoría ---
  const [createdAt, setCreatedAt] = useState('');
  const [createdBy, setCreatedBy] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');
  const [updatedBy, setUpdatedBy] = useState('');

  // Efecto para inicializar valores por defecto al cargar el componente
  useEffect(() => {
    // Generar un ID único para el nuevo cliente
    const generarId = () =>
      setIdCliente('CLI-' + Math.floor(10000 + Math.random() * 90000));
    generarId();

    // Establecer la fecha y usuario de creación
    const fechaHoy = new Date().toISOString(); // Formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
    setCreatedAt(fechaHoy);
    setCreatedBy('usuario_actual'); // Placeholder, debería venir del estado de la app (ej: auth context)
  }, []);

  // Función para guardar el nuevo cliente
  const guardarCliente = () => {
    Alert.alert(
      "Confirmación",
      "¿Desea guardar este nuevo cliente?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Confirmar",
          onPress: () => {
            // Validación simple: verificar que al menos un campo tenga datos
            if (
              nombre.trim() === '' &&
              apellidoPaterno.trim() === '' &&
              correoElectronico.trim() === '' &&
              telefono.trim() === ''
            ) {
              Alert.alert("Error", "El cliente no se puede guardar. Complete al menos los campos principales (nombre, apellido, correo o teléfono).");
              return;
            }

            // Aquí iría la lógica para guardar en la base de datos o API
            // ...

            // --- Simulación de guardado exitoso: Limpiar el formulario ---
            Alert.alert("Éxito", "Cliente guardado con éxito");

            // Resetear todos los estados a sus valores iniciales
            setIdCliente('CLI-' + Math.floor(10000 + Math.random() * 90000));
            setNombre('');
            setApellidoPaterno('');
            setApellidoMaterno('');
            setTipo('');
            setEstadoCliente('');
            setSexo('');
            setCorreoElectronico('');
            setTelefono('');
            setCalle('');
            setColonia('');
            setCiudad('');
            setEstado('');
            setPais('');
            setCodigoPostal('');
            setDescripcion('');

            // Resetear campos de auditoría para un nuevo registro
            const fechaHoy = new Date().toISOString();
            setCreatedAt(fechaHoy);
            setCreatedBy('usuario_actual');
            setUpdatedAt(''); // Estos estarían vacíos para un nuevo cliente
            setUpdatedBy('');   //
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Se pasa un objeto 'cliente' con todos los datos y sus setters al formulario */}
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
          createdBy
        }}
        mode="agregar"
        onGuardar={guardarCliente}
      />
    </SafeAreaView>
  );
}
