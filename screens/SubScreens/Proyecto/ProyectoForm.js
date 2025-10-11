import React from 'react';
import { View, Text, TextInput, ScrollView, Button } from 'react-native';
import styles from '../../../styles/MenuStyles';

export default function ProyectoForm({
  proyecto = {},       
  mode = 'crear',      
  onGuardar = () => {}, 
}) {

  const editable = (field) => mode !== 'consultar'; 

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 50 }}>
      <Text style={styles.title}>{mode === 'crear' ? 'Nuevo Proyecto' : mode === 'editar' ? 'Editar Proyecto' : 'Consultar Proyecto'}</Text>

      {/* ID */}
      <Text style={labelStyle}>ID de Proyecto</Text>
      <TextInput
        style={inputStyle}
        value={proyecto.idProyecto || ''}
        editable={false} 
      />

      {/* Nombre */}
      <Text style={labelStyle}>Nombre del Proyecto</Text>
      <TextInput
        style={inputStyle}
        value={proyecto.nombreProyecto || ''}
        onChangeText={proyecto.setNombreProyecto}
        editable={editable('nombre')}
      />

      {/* Tipo */}
      <Text style={labelStyle}>Tipo de Proyecto</Text>
      <TextInput
        style={inputStyle}
        value={proyecto.tipoProyecto || ''}
        onChangeText={proyecto.setTipoProyecto}
        editable={editable('tipo')}
      />

      {/* Fechas */}
      <Text style={labelStyle}>Fecha de Inicio</Text>
      <TextInput
        style={inputStyle}
        value={proyecto.fechaInicio || ''}
        onChangeText={proyecto.setFechaInicio}
        editable={editable('fechaInicio')}
      />

      <Text style={labelStyle}>Fecha de Fin</Text>
      <TextInput
        style={inputStyle}
        value={proyecto.fechaFin || ''}
        onChangeText={proyecto.setFechaFin}
        editable={editable('fechaFin')}
      />

      {/* Responsable */}
      <Text style={labelStyle}>Responsable / Encargado</Text>
      <TextInput
        style={inputStyle}
        value={proyecto.responsable || ''}
        onChangeText={proyecto.setResponsable}
        editable={editable('responsable')}
      />

      {/* Estado */}
      <Text style={labelStyle}>Estado</Text>
      <TextInput
        style={inputStyle}
        value={proyecto.estado || ''}
        onChangeText={proyecto.setEstado}
        editable={editable('estado')}
      />

      {/* Prioridad */}
      <Text style={labelStyle}>Prioridad</Text>
      <TextInput
        style={inputStyle}
        value={proyecto.prioridad || ''}
        onChangeText={proyecto.setPrioridad}
        editable={editable('prioridad')}
      />

      {/* Recursos */}
<Text style={labelStyle}>Recursos</Text>
<TextInput
  style={{ ...inputStyle, height: 120, textAlignVertical: 'top' }}
  value={Array.isArray(proyecto.RecursosList) ? proyecto.RecursosList.join('\n') : proyecto.RecursosList || ''}
  onChangeText={(text) => {
    
    const recursosArray = text.split('\n').filter(r => r.trim() !== '');
    proyecto.setRecursosList(recursosArray);
  }}
  editable={editable('Recursos')}
  multiline
/>

      {/* Auditoría */}
      <Text style={labelStyle}>Auditoría</Text>
      <TextInput
        style={{ ...inputStyle, backgroundColor: '#e6e6e6' }}
        value={proyecto.Auditoria || ''}
        editable={false}
      />

      {/* Descripción */}
      <Text style={labelStyle}>Descripción</Text>
      <TextInput
        style={{ ...inputStyle, height: 120, textAlignVertical: 'top' }}
        value={proyecto.Descripcion || ''}
        onChangeText={proyecto.setDescripcion}
        editable={editable('Descripcion')}
        multiline
      />

      {/* Botón Guardar solo si crear o editar */}
      {mode !== 'consultar' && (
        <View style={{ marginVertical: 20, width: '100%' }}>
          <Button title="Guardar Proyecto" onPress={onGuardar} />
        </View>
      )}
    </ScrollView>
  );
}

const labelStyle = {
  fontWeight: 'bold',
  marginTop: 20,
};

const inputStyle = {
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 10,
  marginTop: 5,
  width: '100%',
};
