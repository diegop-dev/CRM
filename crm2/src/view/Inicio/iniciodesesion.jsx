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
  ActivityIndicator // Importamos ActivityIndicator para un mejor 'loading'
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { CustomToast } from "../../components/customtoast"; // Asumo que tienes esto
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
    // Asumimos que la lógica de handleLogin (que ya actualizamos) está correcta
    const success = await handleLogin(username, password, navigation);
    setLoading(false);

    if (success) {
      Toast.show({
        type: "centerToast",
        text1: `¡Bienvenido al JoseliasNRMX!`, // No es necesario mostrar el username aquí
        text2: "Has iniciado sesión correctamente",
        visibilityTime: 2500,
      });

      // Usamos 'replace' para que no pueda volver al login
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
    <SafeAreaView  style={{ flex: 1, backgroundColor: '#2b3042'} } >
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.logoContainer}>
          <Image
            // --- ¡CORRECCIÓN! ---
            // Restauramos la ruta original a tu logo local.
            // Asegúrate que esta ruta sea correcta desde la ubicación de este archivo.
            source={require("../../../assets/LOGO_BLANCO.png")}
            // --- FIN DE LA CORRECCIÓN ---
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formContainer}>
          <TextInput
            placeholder="Usuario"
            placeholderTextColor="#95A5A6"
            style={[styles.input, { marginBottom: 20 }]}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#95A5A6"
              secureTextEntry={!showPassword}
              style={[styles.input, { marginBottom: 20 }]}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeButton}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={26}
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
      </KeyboardAvoidingView>

      <Text style={styles.versionText}>v1.0</Text>
      <Toast config={CustomToast} />
    </View>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2b3042", 
  },
  keyboardView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 80,
  },
  logoImage: {
    width: 250,
    height: 250,
    // Si tu logo 'Lg_blanco.png' NO es blanco, 
    // puedes forzarlo a serlo con 'tintColor'
    // tintColor: 'white', 
  },

  formContainer: {
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,250,0.9)", // Ligero ajuste de color para más legibilidad
    borderColor: "#BDC3C7",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    fontSize: 16,
    color: '#333', // Color de texto oscuro para contraste
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  passwordContainer: {
    width: "100%",
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    top: 9.5,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#77a7ab", 
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20, // Añadido margen
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  versionText: {
    textAlign: "center",
    marginBottom: 30,
    color: "#FFFF",
  },
});