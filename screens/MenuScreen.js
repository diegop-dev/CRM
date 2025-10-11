import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/MenuStyles';

export default function MenuScreen() {
  const navigation = useNavigation();

  const menuItems = [
    { title: 'Gestión de Proyectos', screen: 'MenuProyectos' },
    { title: 'Gestión de Recursos Humanos', screen: 'MenuRRHH' },
    { title: 'Gestión de Clientes', screen: 'Finanzas' },
    { title: 'Gestión de Usuarios', screen: 'Reportes' },
    { title: 'Gestión de Servicios', screen: 'Configuracion' },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        {/* Cuadro encabezado */}
        <View style={{
          backgroundColor: '#fff',
          borderRadius: 10,
          borderWidth: 1,
          borderColor: '#000',
          padding: 15,
          marginBottom: 20,
          flexDirection: 'row',  
          alignItems: 'flex-start'
        }}>
          {/* Imagen */}
          <Image
            source={require('../assets/1.png')}
            style={{ width: 60, height: 60, borderRadius: 10, marginRight: 15 }}
            resizeMode="contain"
          />
          
          {/* Bloque de texto */}
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 5 }}>Menú Principal</Text>
            <Text style={{ fontSize: 16 }}>Bienvenido Usuario1</Text>
          </View>
        </View>

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
