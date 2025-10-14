// src/screens/Empleados/EmpleadosForm.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  Button,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Picker } from '@react-native-picker/picker';
import styles from '../../../styles/MenuStyles';

export default function EmpleadosForm({
  empleado = {},
  mode = 'crear',
  onGuardar = () => {},
}) {
  const [formData, setFormData] = useState({
    idEmpleado: empleado.idEmpleado || 'AUTO-' + Date.now(),
    nombres: empleado.nombres || '',
    apellidoPaterno: empleado.apellidoPaterno || '',
    apellidoMaterno: empleado.apellidoMaterno || '',
    fechaNacimiento: empleado.fechaNacimiento || '',
    sexo: empleado.sexo || '',
    rfc: empleado.rfc || '',
    curp: empleado.curp || '',
    nss: empleado.nss || '',
    telefono: empleado.telefono || '',
    correo: empleado.correo || '',
    calle: empleado.calle || '',
    colonia: empleado.colonia || '',
    ciudad: empleado.ciudad || '',
    estado: empleado.estado || '',
    codigoPostal: empleado.codigoPostal || '',
    rol: empleado.rol || '',
    estadoEmpleado: empleado.estadoEmpleado || '',
    nombreUsuario: empleado.nombreUsuario || '',
    contrasena: empleado.contrasena || '',
    archivoPDF: empleado.archivoPDF || null,
  });

  const editable = mode !== 'consultar';

  // 📄 Seleccionar archivo PDF
  const seleccionarArchivo = async () => {
    try {
      const res = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (res.canceled) return;

      const file = res.assets[0];
      if (file.mimeType !== 'application/pdf') {
        Alert.alert('Error', 'Solo se permiten archivos PDF.');
        return;
      }

      setFormData({ ...formData, archivoPDF: file });
    } catch (error) {
      Alert.alert('Error al seleccionar archivo', error.message);
    }
  };

  // 💾 Guardar datos del formulario en backend
  const handleGuardar = async () => {
  try {
    const response = await fetch('http://192.168.1.122:3000/empleados', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});

    const data = await response.json();
    Alert.alert(data.mensaje || 'Empleado guardado correctamente');
  } catch (error) {
    Alert.alert('Error', 'No se pudo guardar el empleado: ' + error.message);
  }
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f7f7' }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 50 }}>
        <Text style={styles.title}>
          {mode === 'crear'
            ? 'Nuevo Empleado'
            : mode === 'editar'
            ? 'Editar Empleado'
            : 'Consultar Empleado'}
        </Text>

        {renderInput('ID de Empleado', formData.idEmpleado, false)}
        {renderInput('Nombres', formData.nombres, editable, (t) => setFormData({ ...formData, nombres: t }))}
        {renderInput('Apellido Paterno', formData.apellidoPaterno, editable, (t) => setFormData({ ...formData, apellidoPaterno: t }))}
        {renderInput('Apellido Materno', formData.apellidoMaterno, editable, (t) => setFormData({ ...formData, apellidoMaterno: t }))}
        {renderInput('Fecha de Nacimiento (DD-MM-AA)', formData.fechaNacimiento, editable, (t) => setFormData({ ...formData, fechaNacimiento: t }))}
        {renderInput('Sexo (Hombre/Mujer)', formData.sexo, editable, (t) => setFormData({ ...formData, sexo: t }))}
        {renderInput('RFC', formData.rfc, editable, (t) => setFormData({ ...formData, rfc: t }))}
        {renderInput('CURP', formData.curp, editable, (t) => setFormData({ ...formData, curp: t }))}
        {renderInput('NSS', formData.nss, editable, (t) => setFormData({ ...formData, nss: t }))}
        {renderInput('Teléfono', formData.telefono, editable, (t) => setFormData({ ...formData, telefono: t }))}
        {renderInput('Correo Electrónico', formData.correo, editable, (t) => setFormData({ ...formData, correo: t }))}
        {renderInput('Calle', formData.calle, editable, (t) => setFormData({ ...formData, calle: t }))}
        {renderInput('Colonia', formData.colonia, editable, (t) => setFormData({ ...formData, colonia: t }))}
        {renderInput('Ciudad', formData.ciudad, editable, (t) => setFormData({ ...formData, ciudad: t }))}
        {renderInput('Estado', formData.estado, editable, (t) => setFormData({ ...formData, estado: t }))}
        {renderInput('Código Postal', formData.codigoPostal, editable, (t) => setFormData({ ...formData, codigoPostal: t }))}

        {/* 🔽 Selector de Rol */}
        <View style={{ marginBottom: 15 }}>
          <Text style={labelStyle}>Rol</Text>
          <View
            style={[
              inputStyle,
              { padding: 0, overflow: 'hidden', justifyContent: 'center' },
            ]}
          >
            <Picker
              selectedValue={formData.rol}
              enabled={editable}
              onValueChange={(itemValue) => setFormData({ ...formData, rol: itemValue })}
              style={{ height: 50 }}
            >
              <Picker.Item label="Seleccione un Rol" value="" />
              <Picker.Item label="Super Administrador (SA)" value="SA" />
              <Picker.Item label="Administrador (AD)" value="AD" />
              <Picker.Item label="Empleado (EM)" value="EM" />
            </Picker>
          </View>
        </View>

        {renderInput('Estado del Empleado', formData.estadoEmpleado, editable, (t) => setFormData({ ...formData, estadoEmpleado: t }))}
        {renderInput('Nombre de Usuario', formData.nombreUsuario, editable, (t) => setFormData({ ...formData, nombreUsuario: t }))}
        {renderInput('Contraseña', formData.contrasena, editable, (t) => setFormData({ ...formData, contrasena: t }), true)}

        {/* 📎 Subir Archivo PDF */}
        <Text style={labelStyle}>Subir Archivo (PDF)</Text>
        <TouchableOpacity
          onPress={seleccionarArchivo}
          style={{
            backgroundColor: '#eee',
            padding: 12,
            borderRadius: 10,
            marginTop: 5,
            marginBottom: 15,
          }}
          disabled={!editable}
        >
          <Text>{formData.archivoPDF ? formData.archivoPDF.name : 'Seleccionar archivo PDF'}</Text>
        </TouchableOpacity>

        {mode !== 'consultar' && (
          <View style={{ marginVertical: 20 }}>
            <Button title="Guardar Empleado" onPress={handleGuardar} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// 🧩 Componente reutilizable de campo de texto
function renderInput(label, value, editable, onChangeText, password = false) {
  return (
    <View style={{ marginBottom: 15 }}>
      <Text style={labelStyle}>{label}</Text>
      <TextInput
        style={inputStyle}
        value={value}
        editable={editable}
        secureTextEntry={password}
        onChangeText={onChangeText}
      />
    </View>
  );
}

// 🎨 Estilos base locales
const labelStyle = {
  fontWeight: 'bold',
  marginTop: 10,
};

const inputStyle = {
  backgroundColor: '#fff',
  borderRadius: 10,
  padding: 10,
  marginTop: 5,
  width: '100%',
};
