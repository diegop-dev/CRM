import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import styles from '../styles/MenuStyles';

export default function MenuProyectos() {
  const navigation = useNavigation();

  const menuItems = [
    { title: 'Agregar Cliente', screen: 'GestionClientes' },
    { title: 'Editar Cliente', screen: 'EditarCliente' },
    { title: 'Consultar Cliente', screen: 'ConsultarCliente' },
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
          <Image
            source={require('../assets/1.png')}
            style={{ width: 60, height: 60, borderRadius: 10, marginRight: 10 }}
            resizeMode="contain"
          />
          <Text style={[styles.title, { textAlign: 'left', marginBottom: 0 }]}>
            Gestión de Clientes
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
