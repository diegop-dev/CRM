import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import styles from '../styles/LoginStyles';
import { toastConfig } from '../components/CustomToast';
import { useNavigation } from '@react-navigation/native';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const correctUsername = 'admin';
  const correctPassword = '123456';

  const handleLogin = () => {
    if (username === correctUsername && password === correctPassword) {
      Toast.show({
        type: 'centerToast',
        text1: `¡Bienvenido, ${username}! 🎉`,
        text2: 'Has iniciado sesión correctamente',
        visibilityTime: 2500,
      });
      setTimeout(() => navigation.replace('Menu'), 2500);
    } else {
      Toast.show({
        type: 'centerToast',
        text1: 'Error ⚠️',
        text2: 'Usuario o contraseña incorrectos',
        visibilityTime: 2500,
      });
    }
  };

  return (
    <LinearGradient
      colors={['#0072ff', '#00c6ff']}
      style={{ flex: 1, paddingHorizontal: 20 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {/* Contenedor principal centrado */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Image
          source={require('../assets/1.png')}
          style={{ width: 120, height: 120, marginBottom: 20 }}
          resizeMode="contain"
        />
        <Text style={[styles.title, { marginBottom: 30 }]}>JoseliasNRMX</Text>

        <TextInput
          placeholder="Usuario"
          style={[styles.input, { width: '80%', marginBottom: 15 }]}
          value={username}
          onChangeText={setUsername}
        />

        <View style={{ width: '80%', marginBottom: 25 }}>
          <TextInput
            placeholder="Contraseña"
            style={[styles.input, { paddingRight: 40 }]}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: 10, top: 10 }}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? 'eye-off' : 'eye'}
              size={24}
              color="#888"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Iniciar Sesión</Text>
        </TouchableOpacity>
      </View>

      {/* Versión de la app abajo */}
      <Text style={{ textAlign: 'center', color: '#0c0b0bff', fontSize: 14, marginBottom: 10 }}>
        V 1.0
      </Text>

      <Toast config={toastConfig} />
    </LinearGradient>
  );
}
