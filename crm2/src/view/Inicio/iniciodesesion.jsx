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
} from "react-native";
// import { LinearGradient } from "expo-linear-gradient"; // <-- Eliminado
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
        text1: `¡Bienvenido, ${username}! 🎉`,
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
    <SafeAreaView  style={{ flex: 1, backgroundColor: '#2b3042'} } >
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.logoContainer}>
          <Image
            source={require("../../../assets/Lg_blanco.png")}
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
            style={styles.loginButton} // Se simplificó, el color ahora está en StyleSheet
          >
            <Text style={styles.loginButtonText}>
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </Text>
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
    backgroundColor: "#2b3042", // <-- Color de fondo fijo agregado aquí
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
  },

  formContainer: {
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderColor: "#BDC3C7",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    fontSize: 16,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  passwordContainer: {
    width: "100%",
    marginBottom: 20,
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: 15,
    top: 9.5,
  },
  loginButton: {
    width: "100%",
    backgroundColor: "#77a7ab", // <-- Color fijo del botón agregado aquí
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 25,
    alignItems: "center",
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
