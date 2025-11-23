import React, { useState, useCallback } from "react"; // <--- 1. Importamos useState y useCallback
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  ActivityIndicator,
  RefreshControl // <--- 2. Importamos RefreshControl
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
// Importamos la lógica (hook personalizado)
import { useMenuLogic } from "../../controller/Inicio/menuprincipal";

export default function MenuPrincipalView() {
  // Ahora también recibimos 'loading' por si quieres mostrar un spinner inicial
  // NOTA: Si tu useMenuLogic tiene una función para recargar datos (ej. 'fetchMenu'), deberías importarla aquí.
  const { menuItems, handleNavigation, handleLogout, loading } = useMenuLogic();

  // --- 3. Estado para el control de recarga ---
  const [refreshing, setRefreshing] = useState(false);

  // --- 4. Función que se ejecuta al deslizar ---
  const onRefresh = useCallback(() => {
    setRefreshing(true);

    // AQUÍ VA TU LÓGICA DE RECARGA REAL
    // Si tu hook useMenuLogic expone una función para recargar, llámala aquí.
    // Por ahora, simulamos una recarga de 1.5 segundos para que veas el efecto visual.
    console.log("Recargando menú principal...");

    setTimeout(() => {
      // Aquí podrías llamar de nuevo a tu API si fuera necesario
      setRefreshing(false);
      // Opcional: Mostrar un mensaje pequeño
      // Alert.alert("Actualizado", "El menú se ha actualizado."); 
    }, 1500);
  }, []);

  // Confirmación antes de cerrar sesión
  const confirmLogout = () => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Cerrar sesión",
        style: "destructive",
        onPress: handleLogout,
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#2b3042'}}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ paddingBottom: 40 }}
        // --- 5. Vinculamos el RefreshControl al ScrollView ---
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#d92a1c"]} // Color del spinner en Android
            tintColor={"#d92a1c"} // Color del spinner en iOS
            title="Actualizando menú..." // Texto en iOS
            titleColor="#fff"
          />
        }
      >
        {/* Encabezado */}
        <View style={styles.header}>
          <Image
            source={require("../../../assets/LOGO_BLANCO.png")}
            style={styles.headerIcon}
          />
          <Text style={styles.headerTitle}>Menú Principal</Text>
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
              //  Pasamos 'item' completo, no solo 'item.screen'
              // Esto permite validar la clave del módulo antes de navegar.
              onPress={() => handleNavigation(item)}
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
        
        {/* --- Botón de Cerrar Sesión --- */}
        <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
          <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
        </TouchableOpacity>
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
    tintColor: "#f7f3f3ff",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    marginLeft: 15,
    color: "#f7f3f3ff",
  },
  divider: {
    width: "100%",
    height: 3,
    backgroundColor: "#fa0505ff",
    marginTop: 15,
    marginBottom: 30,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#FFFFFF",
    borderColor: "#77a7ab",
    borderRadius: 30,
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
  // --- Botón de Cerrar Sesión ---
  logoutButton: {
    backgroundColor: "#77a7ab",
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },
  logoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});