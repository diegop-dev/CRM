import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from '../../../styles/MenuStyles';


export default function Inventario() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#6bbbe0ff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.container}>
          <Text style={styles.title}>Inventario</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}