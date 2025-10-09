// screens/GestionRRHH.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../styles/MenuStyles';

export default function GestionRRHH({ navigation }) { 
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestión de Recursos Humanos</Text>

      {/* Botón para navegar a MenuRRHH */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('MenuRRHH')}
      >
        <Text style={styles.buttonText}>Ir al Menú RRHH</Text>
      </TouchableOpacity>
    </View>
  );
}
