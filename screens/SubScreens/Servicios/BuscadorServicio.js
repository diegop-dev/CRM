// Archivo: BuscadorServicio.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

// Datos de ejemplo para servicios. En una aplicación real, esto vendría de una API.
const MOCK_SERVICIOS = [
  { 
    id_servicio: 'SERV-12345', 
    nombre_servicio: 'Corte de Cabello Clásico', 
    descripcion: 'Corte tradicional para caballero con máquina y/o tijera.',
    categoria: 'Peluquería',
    precio: 250,
    moneda: 'MXN',
    duracion_estimada: '30 minutos',
    estado: 'activo',
    id_responsable: 'EMP-001',
    notas_internas: 'Cliente prefiere la máquina número 2 en los lados.',
    created_at: new Date('2023-10-26T10:00:00Z').toISOString(),
    created_by: 'admin_user'
  },
  { 
    id_servicio: 'SERV-67890', 
    nombre_servicio: 'Manicura Completa', 
    descripcion: 'Limpieza, limado, tratamiento de cutículas y esmaltado.',
    categoria: 'Uñas',
    precio: 350,
    moneda: 'MXN',
    duracion_estimada: '45 minutos',
    estado: 'activo',
    id_responsable: 'EMP-002',
    notas_internas: '',
    created_at: new Date('2023-10-25T14:30:00Z').toISOString(),
    created_by: 'admin_user'
  },
];

// El componente recibe una función 'onServicioEncontrado' como prop
export default function BuscadorServicio({ onServicioEncontrado }) {
  const [searchId, setSearchId] = useState('');

  const handleSearch = () => {
    if (searchId.trim() === '') {
      Alert.alert("Error", "Por favor, ingrese un ID de servicio.");
      return;
    }

    // --- Simulación de búsqueda en la base de datos ---
    const servicioEncontrado = MOCK_SERVICIOS.find(servicio => servicio.id_servicio.toLowerCase() === searchId.toLowerCase());
    
    if (servicioEncontrado) {
      // Si se encuentra, se llama a la función prop con los datos del servicio
      onServicioEncontrado(servicioEncontrado);
      Alert.alert("Éxito", "Servicio encontrado.");
    } else {
      // Si no se encuentra, se notifica al usuario
      Alert.alert("No encontrado", `No se encontró ningún servicio con el ID: ${searchId}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Buscar Servicio por ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: SERV-12345"
        value={searchId}
        onChangeText={setSearchId}
        autoCapitalize="characters"
      />
      <Button title="Buscar" onPress={handleSearch} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});
