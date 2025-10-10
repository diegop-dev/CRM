import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../../styles/MenuStyles';


export default function Empleados() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#6bbbe0ff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container}>
          <Text style={styles.title}>Empleados</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}