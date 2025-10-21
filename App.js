import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import InicioDeSesion from "./src/Pantallas_Frontend/Inicio/iniciodesesion.jsx";


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="InicioDeSesion" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="InicioDeSesion" component={InicioDeSesion} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}
