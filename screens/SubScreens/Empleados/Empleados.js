import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styles from '../../../styles/MenuStyles';

export default function Empleados() {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#6bbbe0ff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container}>
          <Text style={styles.title}>Gestión de Empleados</Text>

          {/* Botón para crear empleado */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('EmpleadosForm', { mode: 'crear' })}
          >
            <Text style={styles.cardTitle}>Registrar Empleado</Text>
            <Text style={styles.cardDesc}>Crea un nuevo registro de empleado</Text>
          </TouchableOpacity>

          {/* Botón para editar empleado */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('EmpleadosForm', { mode: 'editar' })}
          >
            <Text style={styles.cardTitle}>Editar Empleado</Text>
            <Text style={styles.cardDesc}>Modifica los datos de un empleado existente</Text>
          </TouchableOpacity>

          {/* Botón para consultar empleado */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('EmpleadosForm', { mode: 'consultar' })}
          >
            <Text style={styles.cardTitle}>Consultar Empleado</Text>
            <Text style={styles.cardDesc}>Visualiza la información de un empleado</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
