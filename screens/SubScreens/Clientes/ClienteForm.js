import React from 'react';
import { View, Text, TextInput, ScrollView, Button } from 'react-native';
import styles from '../../../styles/MenuStyles';

export default function ClienteForm({
  cliente = {},
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
      {/* Lógica del título, consistente con el modo 'agregar' */}
      <Text style={styles.title}>{mode === 'agregar' ? 'Agregar Cliente' : mode === 'editar' ? 'Editar Cliente' : 'Consultar Cliente'}</Text>

      {/* --- ID del Cliente --- */}
      <Text style={labelStyle}>ID de Cliente</Text>
      <TextInput
        style={disabledInputStyle}
        value={cliente.idCliente || ''}
        editable={false}
      />

      {/* --- Información Personal --- */}
      <Text style={labelStyle}>Nombre(s)</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={cliente.nombre || ''}
        onChangeText={cliente.setNombre}
        editable={editable}
      />

      <Text style={labelStyle}>Apellido Paterno</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={cliente.apellidoPaterno || ''}
        onChangeText={cliente.setApellidoPaterno}
        editable={editable}
      />

      <Text style={labelStyle}>Apellido Materno</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={cliente.apellidoMaterno || ''}
        onChangeText={cliente.setApellidoMaterno}
        editable={editable}
      />

      <Text style={labelStyle}>Tipo</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={cliente.tipo || ''}
        onChangeText={cliente.setTipo}
        editable={editable}
      />

      <Text style={labelStyle}>Estado del Cliente</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={cliente.estadoCliente || ''}
        onChangeText={cliente.setEstadoCliente}
        editable={editable}
      />

      <Text style={labelStyle}>Sexo</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={cliente.sexo || ''}
        onChangeText={cliente.setSexo}
        editable={editable}
      />

      {/* --- Información de Contacto --- */}
      <Text style={labelStyle}>Correo Electrónico</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={cliente.correoElectronico || ''}
        onChangeText={cliente.setCorreoElectronico}
        editable={editable}
        keyboardType="email-address"
      />

      <Text style={labelStyle}>Teléfono</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={cliente.telefono || ''}
        onChangeText={cliente.setTelefono}
        editable={editable}
        keyboardType="phone-pad"
      />

      {/* --- Dirección --- */}
      <Text style={labelStyle}>Calle</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={cliente.calle || ''}
        onChangeText={cliente.setCalle}
        editable={editable}
      />

      <Text style={labelStyle}>Colonia</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={cliente.colonia || ''}
        onChangeText={cliente.setColonia}
        editable={editable}
      />

      <Text style={labelStyle}>Ciudad</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={cliente.ciudad || ''}
        onChangeText={cliente.setCiudad}
        editable={editable}
      />

      <Text style={labelStyle}>Estado</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={cliente.estado || ''}
        onChangeText={cliente.setEstado}
        editable={editable}
      />

      <Text style={labelStyle}>País</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={cliente.pais || ''}
        onChangeText={cliente.setPais}
        editable={editable}
      />

      <Text style={labelStyle}>Código Postal</Text>
      <TextInput
        style={editable ? inputStyle : disabledInputStyle}
        value={cliente.codigoPostal || ''}
        onChangeText={cliente.setCodigoPostal}
        editable={editable}
        keyboardType="numeric"
      />

      {/* --- Información Adicional y Auditoría --- */}
      <Text style={labelStyle}>Descripción</Text>
      <TextInput
        style={editable ? { ...inputStyle, height: 120, textAlignVertical: 'top' } : { ...disabledInputStyle, height: 120, textAlignVertical: 'top' }}
        value={cliente.descripcion || ''}
        onChangeText={cliente.setDescripcion}
        editable={editable}
        multiline
      />

      <Text style={labelStyle}>Fecha de Creación</Text>
      <TextInput
        style={disabledInputStyle}
        value={cliente.createdAt || ''}
        editable={false}
      />

      <Text style={labelStyle}>Creado Por</Text>
      <TextInput
        style={disabledInputStyle}
        value={cliente.createdBy || ''}
        editable={false}
      />

      {/* Estos campos solo se mostrarán si el modo NO es 'agregar' */}
      {mode !== 'agregar' && (
        <>
          <Text style={labelStyle}>Fecha de Actualización</Text>
          <TextInput
            style={disabledInputStyle}
            value={cliente.updatedAt || ''}
            editable={false}
          />

          <Text style={labelStyle}>Actualizado Por</Text>
          <TextInput
            style={disabledInputStyle}
            value={cliente.updatedBy || ''}
            editable={false}
          />
        </>
      )}
      {/* --- FIN DE LA MODIFICACIÓN --- */}


      {/* Botón Guardar solo si crear o editar */}
      {mode !== 'consultar' && (
        <View style={{ marginVertical: 20, width: '100%' }}>
          <Button title="Guardar Cliente" onPress={onGuardar} />
        </View>
      )}
    </ScrollView>
  );
}

// Estilos mantenidos del archivo original
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
