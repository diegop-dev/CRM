import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import MenuScreen from './screens/MenuScreen';
import GestionProyectos from './screens/GestionProyectos';
import GestionRRHH from './screens/GestionRRHH';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />
        <Stack.Screen name="GestionProyectos" component={GestionProyectos} />
        <Stack.Screen name="GestionRRHH" component={GestionRRHH} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

