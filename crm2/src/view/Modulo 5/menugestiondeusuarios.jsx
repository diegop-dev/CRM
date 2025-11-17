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
import { useMenuLogic } from "../../controller/Modulo 5/menugestiondeusuarios";

// Añadimos { navigation } para poder regresar
export default function MenuGestionDeUsuariosView({ navigation }) {
  const { menuItems, handleNavigation } = useMenuLogic();

  // Función para el nuevo botón de regreso
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    // Aplicamos el color de fondo correcto
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2b3042" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
      >
        {/* Encabezado (ancho completo) */}
        <View style={styles.header}>
          <Image
            // Corregimos el source del logo
            source={require("../../../assets/LOGO_BLANCO.png")}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Gestión De Usuarios</Text>
        </View>

        {/* Contenedor principal para centrar y limitar el ancho de los botones */}
        <View style={styles.mainContentArea}>
          
          {/* Línea divisora eliminada */}

          {/* Renderizado dinámico de botones */}
          <View style={styles.grid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.button,
                ]}
                onPress={() => handleNavigation(item.screen)}
              >
                {/* Imagen individual por opción */}
                <Image
                  source={
                    item.image ? item.image : require("../../../assets/1.png") // Imagen por defecto si falta alguna
                  }
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* --- Botón Flotante de Regreso --- */}
      <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
        <Text style={styles.backButtonText}>Regresar</Text>
      </TouchableOpacity>
      
    </SafeAreaView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2b3042", // <--- CORREGIDO
    // paddingHorizontal: 15, // <--- Se mueve
    paddingTop: 5,
  },
  // Contenedor SÓLO para la grid, para centrarla
  mainContentArea: {
    width: "100%",
    maxWidth: 960,
    alignSelf: "center",
    paddingHorizontal: 15, // <--- Padding aplicado aquí
  },
  // Header ahora necesita su propio padding
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 15, // <--- AÑADIDO: Devuelve el padding original
    paddingBottom: 5,    // <--- AÑADIDO: Espacio antes del 'marginTop' del grid
  },
  headerIcon: {
    width: 60,  // <--- Ajustado al logo
    height: 80, // <--- Ajustado al logo
    resizeMode: "contain",
    tintColor: "#ffffff", // <--- CORREGIDO
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginLeft: 15,
    color: "#ffffff", // <--- CORREGIDO
  },
  
  // --- 'divider' ELIMINADO ---

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 30, // <--- AÑADIDO: Para separar del header
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
    tintColor: "#77a7ab", // <--- CORREGIDO
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#34495E",
    textAlign: "center",
    marginTop: 5,
  },

  // --- NUEVOS ESTILOS PARA EL BOTÓN DE REGRESO ---
  backButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    backgroundColor: '#77a7ab', // Color de acento
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 25, // Forma de píldora
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});