import React, { useEffect, useRef } from "react";
import { Animated, View, Text, Dimensions, Platform } from "react-native";

const { width } = Dimensions.get("window");

export const CustomToast = {
  centerToast: ({ text1, text2 }) => {
    // Animación: Inicia desplazado a la derecha (width) y llega a 0
    const translateX = useRef(new Animated.Value(width)).current;

    useEffect(() => {
      Animated.spring(translateX, {
        toValue: 0,
        useNativeDriver: true, // En web esto se maneja automáticamente
        bounciness: 8,
      }).start();
    }, []);

    return (
      <Animated.View
        style={{
          transform: [{ translateX }],
          height: 120,
          width: "90%",      // Ocupa casi todo el ancho en móviles
          maxWidth: 450,     // Límite máximo para Web/Tablets
          backgroundColor: "#77a7ab",
          borderRadius: 15,
          padding: 15,
          justifyContent: "center",
          alignItems: "center",
          alignSelf: "center", // Asegura centrado en contenedores grandes
          
          // Sombras para dar profundidad (Web + Móvil)
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
          zIndex: 9999, // Encima de modales
        }}
      >
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
          {text1}
        </Text>
        {text2 ? (
          <Text style={{ color: "#fff", fontSize: 16, textAlign: "center", marginTop: 5 }}>
            {text2}
          </Text>
        ) : null}
      </Animated.View>
    );
  },

  dynamicIslandToast: ({ text1, text2, props }) => {
    // Detectamos si se pasa la prop isDynamic (a veces viene dentro de props en Toast 2.0+)
    const isDynamic = props?.isDynamic || false;
    
    const translateY = useRef(new Animated.Value(isDynamic ? -150 : -50)).current;

    useEffect(() => {
      Animated.spring(translateY, {
        toValue: isDynamic ? 0 : 10, // Ajuste fino de posición final
        useNativeDriver: true,
        bounciness: 8,
      }).start();
    }, []);

    // Ajuste de posición superior para Web vs Móvil
    const topPosition = Platform.OS === 'web' ? 20 : (isDynamic ? 0 : 50);

    return (
      <Animated.View
        style={{
          transform: [{ translateY }],
          position: "absolute",
          top: topPosition,
          alignSelf: "center",
          height: 120,
          width: "90%",
          maxWidth: 450, // Límite para web
          backgroundColor: "#77a7ab",
          borderRadius: 15,
          padding: 15,
          justifyContent: "center",
          alignItems: "center",
          
          // Sombras
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 4.65,
          elevation: 8,
          zIndex: 9999,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold", textAlign: "center" }}>
          {text1}
        </Text>
        {text2 ? (
          <Text style={{ color: "#fff", fontSize: 16, textAlign: "center", marginTop: 5 }}>
            {text2}
          </Text>
        ) : null}
      </Animated.View>
    );
  },
};
