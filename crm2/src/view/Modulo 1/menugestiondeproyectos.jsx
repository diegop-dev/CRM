import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert, 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native"; 
import { useMenuLogic } from "../../controller/Modulo 1/menugestiondeproyectos"; 

export default function MenuGestionDeProyectosView() {
  const { menuItems, handleNavigation } = useMenuLogic();
  const navigation = useNavigation(); 

  // --- FUNCIÓN: Maneja el toque en el logo con doble confirmación ---
  const handleLogoPress = () => {
    // Primera Alerta: Confirmación de salida del módulo
    Alert.alert(
      "Confirmar Navegación",
      "¿Desea salir de la Gestión de Proyectos y volver al menú principal?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Sí, Volver",
          onPress: () => {
            // Segunda Alerta: Confirmación de área segura 
            Alert.alert(
              "Área Segura",
              "Será redirigido al Menú Principal.",
              [
                { text: "Permanecer", style: "cancel" },
                {
                  text: "Confirmar",
                  onPress: () => {
                    
                    navigation.navigate("MenuPrincipal"); 
                  },
                },
              ]
            );
          },
        },
      ],
      { cancelable: true }
    );
  };
  // --- FIN FUNCIÓN ---

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2b3042" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Encabezado */}
        <View style={styles.header}>
          
          {/* ¡CLAVE! TouchableOpacity para hacer la imagen clickable */}
          <TouchableOpacity onPress={handleLogoPress}> 
            <Image
              source={require("../../../assets/LOGO_BLANCO.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Gestión De Proyectos</Text>
        </View>

        {/* Línea divisora */}
        <View style={styles.divider} />

        {/* Renderizado dinámico de botones */}
        <View style={styles.grid}>
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.button,
                index === menuItems.length - 1 && styles.largeButton,
              ]}
              onPress={() => handleNavigation(item.screen)}
            >
              {/* Imagen individual por opción */}
              <Image
                source={
                  item.image ? item.image : require("../../../assets/LOGO_BLANCO.png")
                }
                style={styles.buttonIcon}
              />
              <Text style={styles.buttonText}>{item.title}</Text>
            </TouchableOpacity>
          ))}
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
    paddingHorizontal: 15,
    paddingTop: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  headerIcon: {
    width: 60,
    height: 80,
    resizeMode: "contain",
    tintColor: "#FFFFFF",
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: "700",
    marginLeft: 15,
    color: "#FFFFFF",
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
    width: "48%",
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
  largeButton: {
    width: "100%",
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