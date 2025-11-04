import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { CustomToast } from "../../components/customtoast"
import { useNavigation } from "@react-navigation/native";
import { handleLogin } from "../../controller/Inicio/iniciodesesion";

const { height } = Dimensions.get("window");


const isDynamicIslandDevice = () => {
  if (Platform.OS !== "ios") return false;
  return height >= 780; 
};

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
        type: "dynamicIslandToast",
        text1: `¡Bienvenido, ${username}! 🎉`,
        text2: "Has iniciado sesión correctamente",
        visibilityTime: 2500,
        isDynamic: isDynamicIslandDevice(),
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
    <LinearGradient
      colors={["#0072ff", "#00c6ff"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <View style={{ alignItems: "center", marginBottom: 20 }}>
          <Image
            source={require("../../../assets/1.png")}
            style={{ width: 120, height: 120 }}
            resizeMode="contain"
          />
          <Text
            style={{
              color: "white",
              fontSize: 28,
              fontWeight: "800",
              marginTop: 15,
              marginBottom: 30,
            }}
          >
            JoseliasNRMX
          </Text>
        </View>

        <View style={{ width: "100%", maxWidth: 350, alignItems: "center" }}>
          <TextInput
            placeholder="Usuario"
            placeholderTextColor="#777"
            style={{
              width: "100%",
              backgroundColor: "rgba(255,255,255,0.9)",
              paddingVertical: 12,
              paddingHorizontal: 15,
              borderRadius: 25,
              marginBottom: 15,
              fontSize: 16,
            }}
            value={username}
            onChangeText={setUsername}
          />

          <View style={{ width: "100%", marginBottom: 20, position: "relative" }}>
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#777"
              secureTextEntry={!showPassword}
              style={{
                width: "100%",
                backgroundColor: "rgba(255,255,255,0.9)",
                paddingVertical: 12,
                paddingHorizontal: 15,
                borderRadius: 25,
                fontSize: 16,
              }}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={{ position: "absolute", right: 15, top: 12 }}
            >
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={24} color="#888" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={onLoginPress}
            disabled={loading}
            style={{
              width: "100%",
              backgroundColor: loading ? "#4da0ff" : "#005bbb",
              paddingVertical: 12,
              borderRadius: 25,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontSize: 18, fontWeight: "700" }}>
              {loading ? "Cargando..." : "Iniciar Sesión"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      <Text style={{ textAlign: "center", color: "#000000AA", marginBottom: 15 }}>V 1.0</Text>

      <Toast config={CustomToast} />
    </LinearGradient>
  );
}
