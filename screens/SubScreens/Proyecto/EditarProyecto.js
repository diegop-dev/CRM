import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProyectoForm from './ProyectoForm'; 

export default function EditarProyecto({ proyectoInicial = {} }) {
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

  useEffect(() => {
    if (proyectoInicial.idProyecto) {
      setIdProyecto(proyectoInicial.idProyecto);
      setNombreProyecto(proyectoInicial.nombreProyecto || '');
      setTipoProyecto(proyectoInicial.tipoProyecto || '');
      setFechaInicio(proyectoInicial.fechaInicio || '');
      setFechaFin(proyectoInicial.fechaFin || '');
      setResponsable(proyectoInicial.responsable || '');
      setEstado(proyectoInicial.estado || '');
      setPrioridad(proyectoInicial.prioridad || '');
      setRecursosList(proyectoInicial.RecursosList || []);
      setDescripcion(proyectoInicial.Descripcion || '');
      setAuditoria(proyectoInicial.Auditoria || '');
    }
  }, [proyectoInicial]);

  const guardarProyecto = () => {
    Alert.alert("Confirmación", "¿Desea guardar los cambios en este proyecto?", [
      { text: "Cancelar", style: "cancel" },
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

          Alert.alert("Éxito", "Proyecto editado con éxito");
        }
      }
    ]);
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
        mode="editar"
        onGuardar={guardarProyecto}
      />
    </SafeAreaView>
  );
}
