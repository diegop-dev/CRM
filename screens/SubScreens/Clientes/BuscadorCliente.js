import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

// Datos de ejemplo. En una aplicación real, esto vendría de una API.
const MOCK_CLIENTES = [
  { idCliente: 'CLI-12345', nombre: 'Juan', apellidoPaterno: 'Pérez', correoElectronico: 'juan.perez@email.com', tipo: 'Particular', estadoCliente: 'Activo', sexo: 'Masculino', telefono: '5512345678', calle: 'Av. Siempre Viva 123', colonia: 'Centro', ciudad: 'Springfield', estado: 'Provincia X', pais: 'México', codigoPostal: '12345', descripcion: 'Cliente frecuente.' },
  { idCliente: 'CLI-67890', nombre: 'Ana', apellidoPaterno: 'García', correoElectronico: 'ana.garcia@email.com', tipo: 'Empresa', estadoCliente: 'Activo', sexo: 'Femenino', telefono: '5587654321', calle: 'Calle Falsa 456', colonia: 'Norte', ciudad: 'Metrópolis', estado: 'Provincia Y', pais: 'México', codigoPostal: '67890', descripcion: 'Contacto principal de la empresa.' },
];

// El componente recibe una función 'onClienteEncontrado' como prop
export default function BuscadorCliente({ onClienteEncontrado }) {
  const [searchId, setSearchId] = useState('');

  const handleSearch = () => {
    if (searchId.trim() === '') {
      Alert.alert("Error", "Por favor, ingrese un ID de cliente.");
      return;
    }

    // --- Simulación de búsqueda en la base de datos ---
    const clienteEncontrado = MOCK_CLIENTES.find(cliente => cliente.idCliente.toLowerCase() === searchId.toLowerCase());
    
    if (clienteEncontrado) {
      // Si se encuentra, se llama a la función prop con los datos del cliente
      onClienteEncontrado(clienteEncontrado);
      Alert.alert("Éxito", "Cliente encontrado.");
    } else {
      // Si no se encuentra, se notifica al usuario
      Alert.alert("No encontrado", `No se encontró ningún cliente con el ID: ${searchId}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Buscar Cliente por ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Ej: CLI-12345"
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
