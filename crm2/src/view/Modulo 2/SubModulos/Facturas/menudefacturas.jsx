import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Importamos la lógica (hook personalizado)
import { useMenuLogic } from "../../../../controller/Modulo 2/SubModulos/Facturas/menudefacturas";

export default function MenuDeFacturasView() { 
  const { menuItems, handleNavigation } = useMenuLogic();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2b3042" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Encabezado (ancho completo) */}
        <View style={styles.header}>
          <Image
            source={require("../../../../../assets/LOGO_BLANCO.png")}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}> Gestión de Facturas</Text>
        </View>

        {/* Contenedor principal para centrar y limitar el ancho de los botones */}
        <View style={styles.mainContentArea}>
          
          {/* --- LÍNEA DIVISORA AÑADIDA --- */}
          <View style={styles.divider} />

          {/* Renderizado dinámico de botones */}
          <View style={styles.grid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                // --- CAMBIO AQUÍ: Se restaura la lógica del largeButton ---
                style={[
                  styles.button,
                  index === menuItems.length - 1 && styles.largeButton,
                ]}
                onPress={() => handleNavigation(item.screen)}
              >
                {/* Imagen individual por opción */}
                <Image
                  source={
                    item.image ? item.image : require("../../../../../assets/1.png") 
                  }
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2b3042",
    paddingTop: 5,
  },
  mainContentArea: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    paddingHorizontal: 15, 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 15, 
    paddingBottom: 5,    
  },
  headerIcon: {
    width: 60,
    height: 80,
    resizeMode: "contain",
    tintColor: "#ffffff",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginLeft: 15,
    color: "#ffffff",
  },
  divider: {
    width: "100%",
    height: 3,
    backgroundColor: "#d92a1c", 
    marginTop: 5,
    marginBottom: 30,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderColor: "#BDC3C7",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    padding: 15,
    width: "48%", // Ancho estándar
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  // --- CAMBIO AQUÍ: Se restaura el estilo largeButton ---
  largeButton: {
    width: "100%", // Ancho completo para el último botón
  },
  buttonIcon: {
    width: 48,
    height: 48,
    resizeMode: "contain",
    tintColor: "#77a7ab",
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#34495E",
    textAlign: "center",
    marginTop: 5,
  },
});