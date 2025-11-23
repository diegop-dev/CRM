import * as React from "react";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Platform } from "react-native";
import * as Device from "expo-device";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css"; 
// AGREGAR ESTO
import { navigationRef } from "./src/utils/NavigationRef.js";

// App Activity Wrapper
import AppActivityWrapper from "./src/components/AppActivityWrapper.jsx";

// Vistas
import InicioDeSesionView from "./src/view/Inicio/iniciodesesion.jsx";
import MenuPrincipalView from "./src/view/Inicio/menuprincipal.jsx";
import ProyectoFormView from "./src/view/Modulo 1/proyectoform.jsx";
import MenuGestionDeProyectosView from "./src/view/Modulo 1/menugestiondeproyectos.jsx";
import AgregarProyectoView from "./src/view/Modulo 1/agregarproyecto.jsx";
import EditarProyectoView from "./src/view/Modulo 1/editarproyecto.jsx";
import ConsultarProyectoView from "./src/view/Modulo 1/consultarproyecto.jsx";

import MenuGestionDeRecursosHumanosView from "./src/view/Modulo 2/menugestionderecursoshumanos.jsx";
import MenuDeEmpleadosView from "./src/view/Modulo 2/SubModulos/Empleados/menudeempleados.jsx";
import AgregarEmpleadoView from "./src/view/Modulo 2/SubModulos/Empleados/agregarempleado.jsx";
import EditarEmpleadoView from "./src/view/Modulo 2/SubModulos/Empleados/editarempleado.jsx";
import EmpleadosFormView from "./src/view/Modulo 2/SubModulos/Empleados/empleadosform.jsx";
import ConsultarEmpleadoView from "./src/view/Modulo 2/SubModulos/Empleados/consultarempleado.jsx";

import MenuDeInventarioView from "./src/view/Modulo 2/SubModulos/Inventario/menudeinventario.jsx";
import AgregarProductoView from "./src/view/Modulo 2/SubModulos/Inventario/agregarproducto.jsx";
import EditarProductoView from "./src/view/Modulo 2/SubModulos/Inventario/editarproducto.jsx";
import ProductosFormView from "./src/view/Modulo 2/SubModulos/Inventario/productosform.jsx";
import ConsultarProductoView from "./src/view/Modulo 2/SubModulos/Inventario/consultarproducto.jsx";

import MenuDeFacturasView from "./src/view/Modulo 2/SubModulos/Facturas/menudefacturas.jsx";
import AgregarFacturaView from "./src/view/Modulo 2/SubModulos/Facturas/agregarfactura.jsx";
import EditarFacturaView from "./src/view/Modulo 2/SubModulos/Facturas/editarfactura.jsx";
import ConsultarFacturaView from "./src/view/Modulo 2/SubModulos/Facturas/consultarfactura.jsx";

import MenuDeDocumentosView from "./src/view/Modulo 2/SubModulos/Documentos/menudedocumentos.jsx";
import AgregarDocumentoView from "./src/view/Modulo 2/SubModulos/Documentos/agregardocumento.jsx";
import EditarDocumentoView from "./src/view/Modulo 2/SubModulos/Documentos/editardocumento.jsx";
import ConsultarDocumentoView from "./src/view/Modulo 2/SubModulos/Documentos/consultardocumento.jsx"

import MenuGestionDeClientesView from "./src/view/Modulo 3/menugestiondeclientes.jsx";
import AgregarClienteView from "./src/view/Modulo 3/agregarcliente.jsx";
import EditarClienteView from "./src/view/Modulo 3/editarcliente.jsx";
import ClientesFormView from "./src/view/Modulo 3/clientesform.jsx";
import ConsultarClienteView from "./src/view/Modulo 3/consultarcliente.jsx";

import MenuGestionDeServiciosView from "./src/view/Modulo 4/menugestiondeservicios.jsx";
import AgregarServicioView from "./src/view/Modulo 4/agregarservicio.jsx";
import EditarServicioView from "./src/view/Modulo 4/editarservicio.jsx";
import ServiciosFormView from "./src/view/Modulo 4/serviciosform.jsx";
import ConsultarServicioView from "./src/view/Modulo 4/consultarservicio.jsx";

import MenuGestionDeUsuariosView from "./src/view/Modulo 5/menugestiondeusuarios.jsx";
import AdministradoresView from "./src/view/Modulo 5/administradores.jsx";
import EmpleadosView from "./src/view/Modulo 5/empleados.jsx";

const Stack = createNativeStackNavigator();

export default function App() {
  const [isCompatible, setIsCompatible] = useState(null);

  useEffect(() => {
    const checkDevice = async () => {
      const brand = Device.brand || "Unknown";
      const model = Device.modelName || "Unknown";
      const manufacturer = Device.manufacturer || "Unknown";

      const allowedAppleModels = [
        "iPhone 8", "iPhone 8 Plus", "iPhone X", "iPhone XR",
        "iPhone XS", "iPhone XS Max", "iPhone 11", "iPhone 11 Pro", "iPhone 11 Pro Max",
        "iPhone 12", "iPhone 12 Pro", "iPhone 12 Pro Max",
        "iPhone 13", "iPhone 13 Pro", "iPhone 13 Pro Max",
        "iPhone 14", "iPhone 14 Pro", "iPhone 14 Pro Max",
        "iPhone 15", "iPhone 15 Pro", "iPhone 15 Pro Max",
        "iPhone 16", "iPhone 16 Pro", "iPhone 16 Pro Max",
        "iPhone 17", "iPhone 17 Pro", "iPhone 17 Pro Max",
        "iPad (10th generation)"
      ];

      const allowedSamsungModels = ["Samsung S25 Ultra", "Samsung S24 Ultra", "Samsung Galaxy A55 5G"];
      const allowedHonorModels = ["Honor Magic 6", "Honor X10", "Honor X7"];

      let compatible = false;

      if (brand === "Apple") {
        compatible = allowedAppleModels.includes(model);
      } else if (brand === "Samsung") {
        compatible = allowedSamsungModels.includes(model);
      } else if (brand === "Honor") {
        compatible = allowedHonorModels.includes(model);
      } else if (manufacturer === "Google" && (model.includes("Pixel") || model.includes("Android SDK built"))) {
        compatible = true;
      } else {
        compatible = false;
      }

      setIsCompatible(compatible);
    };

    checkDevice();
  }, []);

  if (isCompatible === null) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.text}>Verificando compatibilidad...</Text>
      </View>
    );
  }

  if (!isCompatible) {
    return (
      <View style={styles.blockedContainer}>
        <Text style={styles.textTitle}>⚠️ Dispositivo no compatible</Text>
        <Text style={styles.text}>
          {Platform.OS === "ios"
            ? "Esta aplicación está optimizada para iPhone 8 en adelante."
            : "Este dispositivo Android (Samsung/Honor) no es compatible."}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      {/* AQUÍ ESTÁ LA CORRECCIÓN */}
      <NavigationContainer ref={navigationRef}>
        <AppActivityWrapper>
          <Stack.Navigator initialRouteName="InicioDeSesion" screenOptions={{ headerShown: false }}>

            {/* Pantallas */}
            <Stack.Screen name="InicioDeSesion" component={InicioDeSesionView} />
            <Stack.Screen name="MenuPrincipal" component={MenuPrincipalView} />
            <Stack.Screen name="ProyectoForm" component={ProyectoFormView} />
            <Stack.Screen name="MenuGestionDeProyectos" component={MenuGestionDeProyectosView} />
            <Stack.Screen name="AgregarProyecto" component={AgregarProyectoView} />
            <Stack.Screen name="EditarProyecto" component={EditarProyectoView} />
            <Stack.Screen name="ConsultarProyecto" component={ConsultarProyectoView} />
            
            <Stack.Screen name="MenuGestionDeRecursosHumanos" component={MenuGestionDeRecursosHumanosView} />
            <Stack.Screen name="MenuDeEmpleados" component={MenuDeEmpleadosView} />
            <Stack.Screen name="AgregarEmpleado" component={AgregarEmpleadoView} />
            <Stack.Screen name="EditarEmpleado" component={EditarEmpleadoView} />
            <Stack.Screen name="ConsultarEmpleado" component={ConsultarEmpleadoView} />
            <Stack.Screen name="EmpleadosForm" component={EmpleadosFormView} />

            <Stack.Screen name="MenuDeInventario" component={MenuDeInventarioView} />
            <Stack.Screen name="AgregarProducto" component={AgregarProductoView} />
            <Stack.Screen name="EditarProducto" component={EditarProductoView} />
            <Stack.Screen name="ProductosForm" component={ProductosFormView} />
            <Stack.Screen name="ConsultarProducto" component={ConsultarProductoView} />

            <Stack.Screen name="MenuDeFacturas" component={MenuDeFacturasView} />
            <Stack.Screen name="AgregarFactura" component={AgregarFacturaView} />
            <Stack.Screen name="EditarFactura" component={EditarFacturaView} />
            <Stack.Screen name="ConsultarFactura" component={ConsultarFacturaView} />

            <Stack.Screen name="MenuDeDocumentos" component={MenuDeDocumentosView} />
            <Stack.Screen name="AgregarDocumento" component={AgregarDocumentoView} />
            <Stack.Screen name="EditarDocumento" component={EditarDocumentoView} />
            <Stack.Screen name="ConsultarDocumento" component={ConsultarDocumentoView} />

            <Stack.Screen name="MenuGestionDeClientes" component={MenuGestionDeClientesView} />
            <Stack.Screen name="AgregarCliente" component={AgregarClienteView} />
            <Stack.Screen name="EditarCliente" component={EditarClienteView} />
            <Stack.Screen name="ClientesForm" component={ClientesFormView} />
            <Stack.Screen name="ConsultarCliente" component={ConsultarClienteView} />

            <Stack.Screen name="MenuGestionDeServicios" component={MenuGestionDeServiciosView} />
            <Stack.Screen name="AgregarServicio" component={AgregarServicioView} />
            <Stack.Screen name="EditarServicio" component={EditarServicioView} />
            <Stack.Screen name="ServiciosForm" component={ServiciosFormView} />
            <Stack.Screen name="ConsultarServicio" component={ConsultarServicioView} />

            <Stack.Screen name="MenuGestionDeUsuarios" component={MenuGestionDeUsuariosView} />
            <Stack.Screen name="Administradores" component={AdministradoresView}/>
            <Stack.Screen name="Empleados" component={EmpleadosView}/>

          </Stack.Navigator>
        </AppActivityWrapper>
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
