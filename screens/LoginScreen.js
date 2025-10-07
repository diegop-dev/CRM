import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
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
      style={styles.containerGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Text style={styles.title}>JoseliasNRMX</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Usuario"
          style={styles.input}
          value={username}
          onChangeText={setUsername}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Contraseña"
          style={styles.input}
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          style={styles.eyeIcon}
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

      <Toast config={toastConfig} />
    </LinearGradient>
  );
}
