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
// Importamos la lógica
import { useMenuLogic } from "../../controller/Modulo 5/menugestiondeusuarios";

export default function MenuGestionDeUsuariosView() {
  // Obtenemos los items del menú
  const { menuItems, handleNavigation } = useMenuLogic();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2b3042" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/LOGO_BLANCO.png")}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Gestión De Usuarios</Text>
        </View>

        {/* Contenedor principal */}
        <View style={styles.mainContentArea}>
          
          {/* --- LÍNEA DIVISORA (Restaurada) --- */}
          <View style={styles.divider} />

          {/* Renderizado de botones */}
          <View style={styles.grid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.button}
                onPress={() => handleNavigation(item.screen)}
              >
                <Image
                  // Usamos la imagen que venga en el item, o la genérica si no hay
                  source={item.image ? item.image : require("../../../assets/1.png")}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Botón de regreso ELIMINADO */}
      
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
  
  // --- Estilo de la Línea Roja ---
  divider: {
    width: "100%",
    height: 3,
    backgroundColor: "#d92a1c", // Rojo
    marginTop: 5,
    marginBottom: 30,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    // marginTop quitado porque el divider da el espacio
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderColor: "#BDC3C7",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    padding: 15,
    width: "48%", // Ajuste para 2 columnas
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