import React from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/MenuStyles';

export default function MenuScreen() {
  const navigation = useNavigation();

  const menuItems = [
    { title: 'Gestión de Proyectos', screen: 'GestionProyectos' },
    { title: 'Gestión de Recursos Humanos', screen: 'GestionRRHH' },
    { title: 'Finanzas', screen: 'Finanzas' },
    { title: 'Reportes', screen: 'Reportes' },
    { title: 'Configuración', screen: 'Configuracion' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f2f2f2' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Menú Principal</Text>

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
