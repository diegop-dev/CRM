import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styles from '../../../styles/MenuStyles';

export default function MenuEmpleados() {
  const navigation = useNavigation();

  const menuItems = [
    { title: 'Agregar Empleado', screen: 'EmpleadosForm' },
    { title: 'Editar Empleado', screen: 'EditarEmpleados' },
    { title: 'Consultar Empleado', screen: 'ConsultarEmpleados' },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        style={{ flex: 1, width: '100%' }}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 50,
          alignItems: 'flex-start',
        }}
      >
        {/* Encabezado */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
          <Text style={[styles.title, { textAlign: 'left', marginBottom: 0 }]}>
            Gestión de Empleados
          </Text>
        </View>

        {/* Separador */}
        <View style={{ width: '100%', height: 2, backgroundColor: '#060707ff', marginBottom: 15 }} />

        {/* Grid de opciones */}
        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.card}
              onPress={() => navigation.navigate(item.screen)}
            >
              <Text style={styles.cardText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
