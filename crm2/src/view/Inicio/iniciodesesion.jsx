import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { CustomToast } from "../../components/customtoast"; 
import { useNavigation } from "@react-navigation/native";
import { handleLogin } from "../../controller/Inicio/iniciodesesion";
import { SafeAreaView } from "react-native-safe-area-context";

export default function InicioDeSesionView() {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLoginPress = async () => {
    if (!username || !password) {
      Toast.show({
        type: "centerToast",
        text1: "Campos vacíos ⚠️",
        text2: "Por favor ingresa usuario y contraseña",
        visibilityTime: 2500,
      });
      return;
    }

    setLoading(true);
    const success = await handleLogin(username, password, navigation);
    setLoading(false);

    if (success) {
      Toast.show({
        type: "centerToast",
        text1: `¡Bienvenido a JoseliasNRMX!`, 
        text2: "Has iniciado sesión correctamente",
        visibilityTime: 2500,
      });

      setTimeout(() => navigation.replace("MenuPrincipal"), 2500);
    } else {
      Toast.show({
        type: "centerToast",
        text1: "Error ⚠️",
        text2: "Usuario o contraseña incorrectos",
        visibilityTime: 2500,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* CONTENEDOR PRINCIPAL (WEB FRIENDLY) 
           Limita el ancho y centra el contenido.
        */}
        <View style={styles.mainContainer}>
          
          {/* LOGO */}
          <View style={styles.logoContainer}>
            <Image
              source={require("../../../assets/LOGO_BLANCO.png")}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>

          {/* FORMULARIO */}
          <View style={styles.formContainer}>
            <TextInput
              placeholder="Usuario"
              placeholderTextColor="#95A5A6"
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
              <TextInput
                placeholder="Contraseña"
                placeholderTextColor="#95A5A6"
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={24}
                  color="#888"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={onLoginPress}
              disabled={loading}
              style={styles.loginButton} 
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.loginButtonText}>Iniciar Sesión</Text>
              )}
            </TouchableOpacity>
          </View>
          
          <Text style={styles.versionText}>v1.0</Text>
        </View>

      </KeyboardAvoidingView>

      {/* Toast fuera del contenedor centrado para que flote correctamente */}
      <Toast config={CustomToast} />
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2b3042',
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  
  // Nuevo contenedor maestro para controlar el ancho en Web
  mainContainer: {
    width: "90%",
    maxWidth: 400, // Evita que se estire en pantallas grandes
    alignItems: "center",
    paddingVertical: 20,
  },

  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoImage: {
    width: 220,
    height: 220,
  },

  formContainer: {
    width: "100%",
    alignItems: "center",
  },
  
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,250,0.9)",
    borderColor: "#BDC3C7",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    fontSize: 16,
    color: '#333',
    marginBottom: 20, // Margen inferior unificado
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },

  passwordContainer: {
    width: "100%",
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    top: 12, // Ajustado para centrar verticalmente con el input
  },

  loginButton: {
    width: "100%",
    backgroundColor: "#77a7ab", 
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },

  versionText: {
    textAlign: "center",
    marginTop: 40,
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
  },
});
