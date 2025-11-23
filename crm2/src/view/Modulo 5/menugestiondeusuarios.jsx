import React, { useState, useCallback } from "react"; // <--- 1. Hooks necesarios
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl // <--- 2. Componente visual
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
// Importamos la lógica segura
import { useMenuLogic } from "../../controller/Modulo 5/menugestiondeusuarios";

export default function MenuGestionDeUsuariosView() {
  const navigation = useNavigation();
  // Recibimos 'loading' también
  const { menuItems, handleNavigation, loading } = useMenuLogic();

  // --- 3. Estado para la recarga ---
  const [refreshing, setRefreshing] = useState(false);

  // --- 4. Función de recarga ---
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    
    // Aquí simulamos la recarga. Si tuvieras una función para recargar permisos
    // en useMenuLogic, la llamarías aquí.
    console.log("Recargando menú de gestión de usuarios...");

    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  }, []);

  if (loading) {
      return (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#006480" />
        </View>
      );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#2b3042" }}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        // --- 5. Vinculación al ScrollView ---
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#d92a1c"]}   // Color Android
            tintColor={"#d92a1c"}  // Color iOS
            title="Actualizando..." // Texto iOS
            titleColor="#fff"
          />
        }
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
             <Image
                source={require("../../../assets/LOGO_BLANCO.png")}
                style={styles.headerIcon}
              />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Gestión De Usuarios</Text>
        </View>

        {/* Contenedor principal */}
        <View style={styles.mainContentArea}>
          
          <View style={styles.divider} />

          {/* Renderizado de botones */}
          <View style={styles.grid}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.button}
                // Pasamos 'item' completo, no solo la pantalla
                onPress={() => handleNavigation(item)}
              >
                <Image
                  source={item.image ? item.image : require("../../../assets/1.png")}
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
  loadingContainer: {
    flex: 1,
    backgroundColor: "#2b3042",
    justifyContent: "center",
    alignItems: "center"
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