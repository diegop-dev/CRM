import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProyectoForm from './SubScreens/Proyecto/ProyectoForm';

export default function GestionProyectos() {
  const [idProyecto, setIdProyecto] = useState('');
  const [nombreProyecto, setNombreProyecto] = useState('');
  const [tipoProyecto, setTipoProyecto] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [responsable, setResponsable] = useState('');
  const [estado, setEstado] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [Auditoria, setAuditoria] = useState('');
  const [Descripcion, setDescripcion] = useState('');
  const [RecursosList, setRecursosList] = useState([]);
  const [currentRecurso, setCurrentRecurso] = useState('');

  useEffect(() => {
    
    const generarId = () =>
      setIdProyecto('PRJ-' + Math.floor(1000 + Math.random() * 9000));
    generarId();

    
    const fechaHoy = new Date();
    const fechaFormateada = `${fechaHoy.getFullYear()}-${String(
      fechaHoy.getMonth() + 1
    ).padStart(2, '0')}-${String(fechaHoy.getDate()).padStart(2, '0')}`;
    setAuditoria(`Fecha: ${fechaFormateada} | Usuario: usuario1`);
  }, []);

  const guardarProyecto = () => {
    Alert.alert(
      "Confirmación",
      "¿Desea guardar este nuevo proyecto?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Confirmar",
          onPress: () => {
            
            if (
              nombreProyecto.trim() === '' &&
              tipoProyecto.trim() === '' &&
              fechaInicio.trim() === '' &&
              fechaFin.trim() === '' &&
              responsable.trim() === '' &&
              estado.trim() === '' &&
              prioridad.trim() === '' &&
              RecursosList.length === 0 &&
              Descripcion.trim() === ''
            ) {
              Alert.alert("Error", "El proyecto no se puede guardar porque no hay campos rellenados");
              return;
            }

            
            setIdProyecto('PRJ-' + Math.floor(1000 + Math.random() * 9000));
            setNombreProyecto('');
            setTipoProyecto('');
            setFechaInicio('');
            setFechaFin('');
            setResponsable('');
            setEstado('');
            setPrioridad('');
            setRecursosList([]);
            setCurrentRecurso('');
            const fechaHoy = new Date();
            const fechaFormateada = `${fechaHoy.getFullYear()}-${String(
              fechaHoy.getMonth() + 1
            ).padStart(2, '0')}-${String(fechaHoy.getDate()).padStart(2, '0')}`;
            setAuditoria(`Fecha: ${fechaFormateada} | Usuario: usuario1`);
            setDescripcion('');
            Alert.alert("Éxito", "Proyecto guardado con éxito");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProyectoForm
        proyecto={{
          idProyecto,
          nombreProyecto,
          setNombreProyecto,
          tipoProyecto,
          setTipoProyecto,
          fechaInicio,
          setFechaInicio,
          fechaFin,
          setFechaFin,
          responsable,
          setResponsable,
          estado,
          setEstado,
          prioridad,
          setPrioridad,
          RecursosList,
          setRecursosList,
          Auditoria,
          Descripcion,
          setDescripcion
        }}
        mode="crear"
        onGuardar={guardarProyecto}
      />
    </SafeAreaView>
  );
}
