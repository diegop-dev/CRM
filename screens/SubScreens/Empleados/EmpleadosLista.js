// src/screens/Empleados/EmpleadosLista.js
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EmpleadosLista({ onSeleccionar }) {
  const [empleados, setEmpleados] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // 🔹 Obtener empleados del backend
  const fetchEmpleados = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://192.168.1.122:3000/empleados?q=${busqueda}&limit=10`);
      const data = await res.json();
      setEmpleados(data);
    } catch (error) {
      console.error('Error al cargar empleados', error);
    }
    setLoading(false);
  };

  
  useEffect(() => {
    fetchEmpleados();
  }, [busqueda]);

  return (
    <SafeAreaView style={{ flex: 1, padding: 20 }}>
      {/* 🔎 Input de búsqueda */}
      <TextInput
        placeholder="Buscar por ID, nombre o usuario"
        value={busqueda}
        onChangeText={setBusqueda}
        style={{
          marginBottom: 15,
          padding: 10,
          borderWidth: 1,
          borderRadius: 8,
          borderColor: '#ccc',
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={empleados}
          keyExtractor={(item) => item.id_empleado.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                padding: 15,
                backgroundColor: '#fff',
                marginBottom: 10,
                borderRadius: 8,
              }}
              onPress={() => onSeleccionar(item)} 
            >
              <Text>{item.nombres} {item.apellido_paterno} {item.apellido_materno}</Text>
              <Text style={{ color: '#666' }}>Usuario: {item.nombre_usuario || '—'}</Text>
              <Text style={{ color: '#666' }}>ID: {item.id_empleado}</Text>
            </TouchableOpacity>
          )}
        />
      )}
    </SafeAreaView>
  );
}
