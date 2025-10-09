import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/MenuStyles';

export default function MenuRRHH() {
  const navigation = useNavigation();

  
  const menuItems = [
    { title: 'Empleados', screen: 'Empleados' },
    { title: 'Documentos', screen: 'Documentos' },
    { title: 'Facturas', screen: 'Facturas' },
    { title: 'Inventario', screen: 'Inventarios' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#6bbbe0ff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Menú RRHH</Text>

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
