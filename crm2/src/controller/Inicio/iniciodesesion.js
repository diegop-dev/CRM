import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config/apiConfig'; 

// Esta función AHORA llama al backend
export const handleLogin = async (username, password, navigation) => {
  try {
    
    // 1. Preparamos los datos para enviar al backend
    const dataParaEnviar = {
      nombre_usuario: username,
      contraseña: password
    };

    // 2. Llamamos a la nueva API de Login en el backend
    const response = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dataParaEnviar),
    });

    const data = await response.json();

    // 3. Revisamos la respuesta del backend
    if (!response.ok || data.success === false) {
      // Si el backend dijo que algo estaba mal (usuario/pass incorrecto)
      await AsyncStorage.removeItem('id_usuario'); 
      return false;
    }

    
    
    await AsyncStorage.setItem('id_usuario', String(data.id_usuario));
    return true; 

  } catch (error) {
    console.error("Error en el login:", error);
    Alert.alert("Error de Conexión", "No se pudo conectar con el servidor.");
    return false;
  }
};
