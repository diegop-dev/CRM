// Archivo: GestionServicios.js
import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ServicioForm from './SubScreens/Servicios/ServicioForm'; // Apuntamos al formulario de servicio

export default function GestionServicios() {
  // --- Estados para los campos del servicio ---
  const [id_servicio, setIdServicio] = useState('');
  const [nombre_servicio, setNombreServicio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [moneda, setMoneda] = useState(''); // Ej. 'MXN', 'USD'
  const [duracion_estimada, setDuracionEstimada] = useState(''); // Ej. '60 minutos', '2 horas'
  const [estado, setEstado] = useState('activo'); // Valor por defecto
  const [id_responsable, setIdResponsable] = useState('');
  const [notas_internas, setNotasInternas] = useState('');

  // --- Estados para campos de auditoría ---
  const [created_at, setCreatedAt] = useState('');
  const [created_by, setCreatedBy] = useState('');
  const [updated_at, setUpdatedAt] = useState('');
  const [updated_by, setUpdatedBy] = useState('');

  // Efecto para inicializar valores por defecto al cargar el componente
  useEffect(() => {
    // Generar un ID único para el nuevo servicio
    const generarId = () =>
      setIdServicio('SERV-' + Math.floor(10000 + Math.random() * 90000));
    generarId();

    // Establecer la fecha y usuario de creación
    const fechaHoy = new Date().toISOString(); // Formato ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ)
    setCreatedAt(fechaHoy);
    setCreatedBy('usuario_actual'); // Placeholder, debería venir del estado de la app
  }, []);

  // Función para guardar el nuevo servicio
  const guardarServicio = () => {
    Alert.alert(
      "Confirmación",
      "¿Desea guardar este nuevo servicio?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Confirmar",
          onPress: () => {
            // Validación simple: verificar campos obligatorios
            if (
              nombre_servicio.trim() === '' ||
              precio.toString().trim() === '' ||
              categoria.trim() === ''
            ) {
              Alert.alert("Error", "El servicio no se puede guardar. Complete al menos nombre, precio y categoría.");
              return;
            }

            // Aquí iría la lógica para guardar en la base de datos o API
            // ...

            // --- Simulación de guardado exitoso: Limpiar el formulario ---
            Alert.alert("Éxito", "Servicio guardado con éxito");

            // Resetear todos los estados a sus valores iniciales
            setIdServicio('SERV-' + Math.floor(10000 + Math.random() * 90000));
            setNombreServicio('');
            setDescripcion('');
            setCategoria('');
            setPrecio('');
            setMoneda('');
            setDuracionEstimada('');
            setEstado('activo');
            setIdResponsable('');
            setNotasInternas('');

            // Resetear campos de auditoría para un nuevo registro
            const fechaHoy = new Date().toISOString();
            setCreatedAt(fechaHoy);
            setCreatedBy('usuario_actual');
            setUpdatedAt(''); // Estos estarían vacíos para un nuevo servicio
            setUpdatedBy('');   //
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* Se pasa un objeto 'servicio' con todos los datos y sus setters al formulario */}
      <ServicioForm
        servicio={{
          id_servicio,
          nombre_servicio, setNombreServicio,
          descripcion, setDescripcion,
          categoria, setCategoria,
          precio, setPrecio,
          moneda, setMoneda,
          duracion_estimada, setDuracionEstimada,
          estado, setEstado,
          id_responsable, setIdResponsable,
          notas_internas, setNotasInternas,
          created_at,
          created_by
        }}
        mode="agregar"
        onGuardar={guardarServicio}
      />
    </SafeAreaView>
  );
}
