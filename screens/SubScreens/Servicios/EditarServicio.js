// Archivo: EditarServicio.js
import React, { useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ServicioForm from './ServicioForm'; // Apuntamos al nuevo formulario
import BuscadorServicio from './BuscadorServicio'; // Asumimos un componente de búsqueda para servicios

export default function EditarServicio() {
  // Todos los estados para "Servicio" se inicializan vacíos.
  const [id_servicio, setIdServicio] = useState('');
  const [nombre_servicio, setNombreServicio] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precio, setPrecio] = useState('');
  const [moneda, setMoneda] = useState('');
  const [duracion_estimada, setDuracionEstimada] = useState('');
  const [estado, setEstado] = useState('');
  const [id_responsable, setIdResponsable] = useState('');
  const [notas_internas, setNotasInternas] = useState('');
  const [created_at, setCreatedAt] = useState('');
  const [created_by, setCreatedBy] = useState('');
  const [updated_at, setUpdatedAt] = useState('');
  const [updated_by, setUpdatedBy] = useState('');

  // Esta función se ejecuta cuando el BuscadorServicio encuentra un servicio.
  const handleServicioEncontrado = (servicioData) => {
    if (servicioData) {
      setIdServicio(servicioData.id_servicio);
      setNombreServicio(servicioData.nombre_servicio || '');
      setDescripcion(servicioData.descripcion || '');
      setCategoria(servicioData.categoria || '');
      setPrecio(servicioData.precio || '');
      setMoneda(servicioData.moneda || '');
      setDuracionEstimada(servicioData.duracion_estimada || '');
      setEstado(servicioData.estado || '');
      setIdResponsable(servicioData.id_responsable || '');
      setNotasInternas(servicioData.notas_internas || '');
      setCreatedAt(servicioData.created_at || '');
      setCreatedBy(servicioData.created_by || '');
      setUpdatedAt(servicioData.updated_at || '');
      setUpdatedBy(servicioData.updated_by || '');
    }
  };

  // La función de guardar opera sobre los estados poblados por la búsqueda.
  const guardarServicio = () => {
    // Validación para asegurar que un servicio ha sido cargado.
    if (!id_servicio) {
      Alert.alert("Error", "Primero debe buscar y cargar un servicio para poder guardarlo.");
      return;
    }
    
    Alert.alert(
      "Confirmación",
      "¿Desea guardar los cambios en este servicio?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Confirmar",
          onPress: () => {
            if (nombre_servicio.trim() === '' || precio.toString().trim() === '') {
              Alert.alert("Error", "El servicio debe tener al menos un nombre y un precio.");
              return;
            }

            const fechaHoy = new Date().toISOString();
            const usuarioActual = 'usuario_editor';

            // Aquí se construiría el objeto actualizado para enviar a la API/DB
            // const servicioActualizado = { id_servicio, nombre_servicio, ...etc, updated_at: fechaHoy, updated_by: usuarioActual };
            
            Alert.alert("Éxito", "Servicio editado con éxito");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView>
        {/* Renderizamos el componente de búsqueda y le pasamos la función manejadora */}
        <BuscadorServicio onServicioEncontrado={handleServicioEncontrado} />

        {/* El formulario solo se muestra si se ha encontrado un servicio */}
        {id_servicio ? (
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
              created_by,
              updated_at,
              updated_by
            }}
            mode="editar"
            onGuardar={guardarServicio}
          />
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
