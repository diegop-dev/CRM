import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import MenuScreen from './screens/MenuScreen';
import GestionProyectos from './screens/GestionProyectos';
import GestionRRHH from './screens/GestionRRHH';
import MenuRRHH from './screens/MenuRRHH';
import Empleados from './screens/SubScreens/Empleados/Empleados';
import Documentos from './screens/SubScreens/Documentos/Documentos';
import Facturas from './screens/SubScreens/Facturas/Facturas';
import Inventarios from './screens/SubScreens/Inventarios/Inventario';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="GestionProyectos" component={GestionProyectos} />
        <Stack.Screen name="GestionRRHH" component={GestionRRHH} />
        <Stack.Screen name="MenuRRHH" component={MenuRRHH} />
        <Stack.Screen name="Empleados" component={Empleados} />
        <Stack.Screen name="Documentos" component={Documentos} />
        <Stack.Screen name="Facturas" component={Facturas} />
        <Stack.Screen name="Inventarios" component={Inventarios} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
