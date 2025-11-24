import { Platform } from 'react-native'; 
const LOCAL_URL = "http://localhost:3000"; // Para la App Web 

const NGROK_URL = "https://monorhinous-merrill-barbarically.ngrok-free.dev"; // Para la App Móvil const PROD_URL = "https://miapi-crm.onrender.com";

const getApiUrl = () => {
  if (Platform.OS === 'web') {
    // Si estamos en el navegador (localhost)
    return LOCAL_URL;
  } else {
    // Si estamos en un dispositivo móvil (Android/iOS)
    return NGROK_URL; 
  }
  // O podrías tener una lógica más compleja para 'production'
  // if (process.env.NODE_ENV === 'production') {
  //   return PROD_URL;
  // } 
};

// Exportamos el resultado de la función
export const API_URL = getApiUrl();