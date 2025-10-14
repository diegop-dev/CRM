// Archivo: ServicioForm.js
import React from 'react';
import { View, Text, TextInput, ScrollView, Button } from 'react-native';
import styles from '../../../styles/MenuStyles';

export default function ServicioForm({
  servicio = {},
  mode = 'agregar',
  onGuardar = () => {},
}) {

  const editable = mode !== 'consultar';

  const disabledInputStyle = {
    ...inputStyle,
    backgroundColor: '#f0f0f0',
    color: '#888',
  };

  return (
    <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 50 }}>
      {/* Título dinámico basado en el modo */}
      <Text style={styles.title}>{mode === 'agregar' ? 'Agregar Servicio' : mode === 'editar' ? 'Editar Servicio' : 'Consultar Servicio'}</Text>

      {/* --- ID del Servicio --- */}
      <Text style={labelStyle}>ID de Servicio</Text>
      <TextInput
        style={disabledInputStyle}
        value={servicio.id_servicio || ''}
        editable={false}
      />

      {/* --- Información del Servicio --- */}
      <Text style={labelStyle}>Nombre del Servicio</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={servicio.nombre_servicio || ''}
        onChangeText={servicio.setNombreServicio}
        editable={editable}
      />

      <Text style={labelStyle}>Categoría</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={servicio.categoria || ''}
        onChangeText={servicio.setCategoria}
        editable={editable}
      />

      <Text style={labelStyle}>Precio</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={servicio.precio ? String(servicio.precio) : ''}
        onChangeText={servicio.setPrecio}
        editable={editable}
        keyboardType="numeric"
      />

      <Text style={labelStyle}>Moneda</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={servicio.moneda || ''}
        onChangeText={servicio.setMoneda}
        editable={editable}
        placeholder="Ej: MXN, USD"
      />

      <Text style={labelStyle}>Duración Estimada</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={servicio.duracion_estimada || ''}
        onChangeText={servicio.setDuracionEstimada}
        editable={editable}
        placeholder="Ej: 60 minutos, 2 horas"
      />

      <Text style={labelStyle}>Estado</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={servicio.estado || ''}
        onChangeText={servicio.setEstado}
        editable={editable}
      />

      <Text style={labelStyle}>ID Responsable</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={servicio.id_responsable || ''}
        onChangeText={servicio.setIdResponsable}
        editable={editable}
      />
      
      {/* --- Información Adicional --- */}
      <Text style={labelStyle}>Descripción</Text>
      <TextInput
        style={editable ? { ...inputStyle, height: 100, textAlignVertical: 'top' } : { ...disabledInputStyle, height: 100, textAlignVertical: 'top' }}
        value={servicio.descripcion || ''}
        onChangeText={servicio.setDescripcion}
        editable={editable}
        multiline
      />

      <Text style={labelStyle}>Notas Internas</Text>
      <TextInput
        style={editable ? { ...inputStyle, height: 100, textAlignVertical: 'top' } : { ...disabledInputStyle, height: 100, textAlignVertical: 'top' }}
        value={servicio.notas_internas || ''}
        onChangeText={servicio.setNotasInternas}
        editable={editable}
        multiline
      />

      {/* --- Auditoría --- */}
      <Text style={labelStyle}>Fecha de Creación</Text>
      <TextInput
        style={disabledInputStyle}
        value={servicio.created_at || ''}
        editable={false}
      />

      <Text style={labelStyle}>Creado Por</Text>
      <TextInput
        style={disabledInputStyle}
        value={servicio.created_by || ''}
        editable={false}
      />

      {/* Campos de actualización solo visibles si no es modo 'agregar' */}
      {mode !== 'agregar' && (
        <>
          <Text style={labelStyle}>Fecha de Actualización</Text>
          <TextInput
            style={disabledInputStyle}
            value={servicio.updated_at || ''}
            editable={false}
          />

          <Text style={labelStyle}>Actualizado Por</Text>
          <TextInput
            style={disabledInputStyle}
            value={servicio.updated_by || ''}
            editable={false}
          />
        </>
      )}

      {/* Botón Guardar solo si crear o editar */}
      {mode !== 'consultar' && (
        <View style={{ marginVertical: 20, width: '100%' }}>
          <Button title="Guardar Servicio" onPress={onGuardar} />
        </View>
      )}
    </ScrollView>
  );
}

// Estilos locales (se pueden mover a la hoja de estilos externa)
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
