import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importar las pantallas
// Módulo 0
import InicioDeSesionView from "./src/view/Inicio/iniciodesesion.jsx";
// Módulo 0.1
import MenuPrincipalView from "./src/view/Inicio/menuprincipal.jsx";
// Módulo 1
import ProyectoFormView from "./src/view/Modulo 1/proyectoform.jsx";
import MenuGestionDeProyectosView from "./src/view/Modulo 1/menugestiondeproyectos.jsx";
import AgregarProyectoView from "./src/view/Modulo 1/agregarproyecto.jsx"
// Módulo 2
// Módulo 3
import MenuGestionDeClientesView from "./src/view/Modulo 3/menugestiondeclientes.jsx";
import AgregarClienteView from "./src/view/Modulo 3/agregarcliente.jsx";
import EditarClienteView from "./src/view/Modulo 3/editarcliente.jsx";
import ConsultarClienteView from "./src/view/Modulo 3/consultarcliente.jsx";


// Módulo 4
import MenuGestionDeServiciosView from "./src/view/Modulo 4/menugestiondeservicios.jsx";
// Módulo 5

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      // Definición de las rutas
      // Ruta principal
      <Stack.Navigator
        initialRouteName="InicioDeSesion" screenOptions={{ headerShown: false }}>
        {/*Módulo 0*/}
        <Stack.Screen name="InicioDeSesion" component={InicioDeSesionView} />
        {/*Módulo 0.1*/}
        <Stack.Screen name="MenuPrincipal" component={MenuPrincipalView} />
        {/*Módulo 1*/}
        <Stack.Screen name="ProyectoForm" component={ProyectoFormView} />
        <Stack.Screen name="MenuGestionDeProyectos" component={MenuGestionDeProyectosView}/>
        <Stack.Screen name="AgregarProyecto" component={AgregarProyectoView} />
        {/*Módulo 2*/}
        {/*Módulo 3*/}
        <Stack.Screen name="MenuGestionDeClientes" component={MenuGestionDeClientesView}/>
        {/*<Stack.Screen name="AgregarCliente" component={AgregarClienteView}/>
        <Stack.Screen name="EditarCliente" component={EditarClienteView}/>
        <Stack.Screen name="ConsultarCliente" ={ConsultarClienteView}/>*/}
        {/*Módulo 4*/}
        <Stack.Screen name="MenuGestionDeServicios" component={MenuGestionDeServiciosView}/>
        {/*Módulo 5*/}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
