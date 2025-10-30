import * as React from "react";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Platform } from "react-native";
import * as Device from "expo-device"; //------------------------------ Detectar modelo de iPhone el cual solo se ejecuta si es iphone 8 en adelante es decir hasta el iphone 17 pro max
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";

import InicioDeSesionView from "./src/view/Inicio/iniciodesesion.jsx";
import MenuPrincipalView from "./src/view/Inicio/menuprincipal.jsx";
import ProyectoFormView from "./src/view/Modulo 1/proyectoform.jsx";
import MenuGestionDeProyectosView from "./src/view/Modulo 1/menugestiondeproyectos.jsx";
import AgregarProyectoView from "./src/view/Modulo 1/agregarproyecto.jsx";
import EditarProyectoView from "./src/view/Modulo 1/editarproyecto.jsx";
import ConsultarProyectoView from "./src/view/Modulo 1/consultarproyecto.jsx";
import MenuGestionDeRecursosHumanosView from "./src/view/Modulo 2/menugestionderecursoshumanos.jsx";
import MenuDeEmpleadosView from "./src/view/Modulo 2/SubModulos/Empleados/menudeempleados.jsx";
import MenuDeJCFView from "./src/view/Modulo 2/SubModulos/JCF/menudejcf.jsx";
import MenuDeInventarioView from "./src/view/Modulo 2/SubModulos/Inventario/menudeinventario.jsx";
import MenuDeFacturasView from "./src/view/Modulo 2/SubModulos/Facturas/menudefacturas.jsx";
import MenuDeDocumentosView from "./src/view/Modulo 2/SubModulos/Documentos/menudedocumentos.jsx";
import MenuGestionDeClientesView from "./src/view/Modulo 3/menugestiondeclientes.jsx";
import MenuGestionDeServiciosView from "./src/view/Modulo 4/menugestiondeservicios.jsx";
import MenuGestionDeUsuariosView from "./src/view/Modulo 5/menugestiondeusuarios.jsx";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isCompatible, setIsCompatible] = useState(null); 

  useEffect(() => {
    const checkDevice = async () => {
      if (Platform.OS !== "ios") {
        // Si no es iPhone, no aplica esta verificación
        setIsCompatible(true);
        return;
      }

      const model = Device.modelName || "Unknown";

      
      const allowedModels = [
        "iPhone 8",
        "iPhone 8 Plus",
        "iPhone X",
        "iPhone XR",
        "iPhone XS",
        "iPhone XS Max",
        "iPhone 11",
        "iPhone 11 Pro",
        "iPhone 11 Pro Max",
        "iPhone 12",
        "iPhone 12 Pro",
        "iPhone 12 Pro Max",
        "iPhone 13",
        "iPhone 13 Pro",
        "iPhone 13 Pro Max",
        "iPhone 14",
        "iPhone 14 Pro",
        "iPhone 14 Pro Max",
        "iPhone 15",
        "iPhone 15 Pro",
        "iPhone 15 Pro Max",
        "iPhone 16",
        "iPhone 16 Pro",
        "iPhone 16 Pro Max",
        "iPhone 17",
        "iPhone 17 Pro",
        "iPhone 17 Pro Max",
      ];

      setIsCompatible(allowedModels.includes(model));
    };

    checkDevice();
  }, []);

  // Mientras detecta el dispositivo
  if (isCompatible === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.text}>Verificando compatibilidad...</Text>
      </View>
    );
  }

  // Si el dispositivo NO es compatible
  if (!isCompatible) {
    return (
      <View style={styles.blockedContainer}>
        <Text style={styles.textTitle}>⚠️ Dispositivo no compatible</Text>
        <Text style={styles.text}>
          Esta aplicación está optimizada para iPhone 8 o posterior.{"\n"}
          Por favor, utiliza un dispositivo más reciente.
        </Text>
      </View>
    );
  }

  // Si es compatible, carga normalmente tu app
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="InicioDeSesion"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="InicioDeSesion" component={InicioDeSesionView} />
          <Stack.Screen name="MenuPrincipal" component={MenuPrincipalView} />
          <Stack.Screen name="ProyectoForm" component={ProyectoFormView} />
          <Stack.Screen name="MenuGestionDeProyectos" component={MenuGestionDeProyectosView} />
          <Stack.Screen name="AgregarProyecto" component={AgregarProyectoView} />
          <Stack.Screen name="EditarProyecto" component={EditarProyectoView} />
          <Stack.Screen name="ConsultarProyecto" component={ConsultarProyectoView} />
          <Stack.Screen name="MenuGestionDeRecursosHumanos" component={MenuGestionDeRecursosHumanosView} />
          <Stack.Screen name="MenuDeEmpleados" component={MenuDeEmpleadosView} />
          <Stack.Screen name="MenuDeJCF" component={MenuDeJCFView} />
          <Stack.Screen name="MenuDeInventario" component={MenuDeInventarioView} />
          <Stack.Screen name="MenuDeFacturas" component={MenuDeFacturasView} />
          <Stack.Screen name="MenuDeDocumentos" component={MenuDeDocumentosView} />
          <Stack.Screen name="MenuGestionDeClientes" component={MenuGestionDeClientesView} />
          <Stack.Screen name="MenuGestionDeServicios" component={MenuGestionDeServiciosView} />
          <Stack.Screen name="MenuGestionDeUsuarios" component={MenuGestionDeUsuariosView} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  blockedContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#111",
    padding: 30,
  },
  textTitle: {
    fontSize: 22,
    color: "#ff3b30",
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  text: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
});
