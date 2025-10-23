import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

// Importar las pantallas
// Módulo 1
import InicioDeSesion from "./src/view/Inicio/iniciodesesion.jsx";
// Módulo 3
import AgregarClienteView from "./src/view/Modulo 3/agregarcliente.jsx";
import EditarClienteView from "./src/view/Modulo 3/editarcliente.jsx";
import ConsultarClienteView from "./src/view/Modulo 3/consultarcliente.jsx";
import MenuGestionDeClientesView from "./src/view/Modulo 3/menugestiondeclientes.jsx";
// Módulo 4

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MenuGestionDeClientes"
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="InicioDeSesion" component={InicioDeSesion} />

        {/* He reordenado tus pantallas para que sea más lógico
          (Inicio -> Menú -> Sub-pantallas) 
        */}
        <Stack.Screen
          name="MenuGestionDeClientes"
          component={MenuGestionDeClientesView}
          options={{ detachPreviousScreen: false }} // <-- CAMBIO AQUÍ
        />
        <Stack.Screen
          name="AgregarCliente"
          component={AgregarClienteView}
          options={{ detachPreviousScreen: false }} // <-- CAMBIO AQUÍ
        />
        <Stack.Screen
          name="EditarCliente"
          component={EditarClienteView}
          options={{ detachPreviousScreen: false }} // <-- CAMBIO AQUÍ
        />
        <Stack.Screen
          name="ConsultarCliente"
          component={ConsultarClienteView}
          options={{ detachPreviousScreen: false }} // <-- CAMBIO AQUÍ
        />

        {/* Eliminé el "MenuGestionDeClientes" duplicado que tenías al final.
          Solo debe estar declarado una vez.
        */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
