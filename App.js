import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas principales
import LoginScreen from './screens/LoginScreen';
import MenuScreen from './screens/MenuScreen';

// Módulo Proyectos
import GestionProyectos from './screens/GestionProyectos';
import MenuProyectos from './screens/MenuProyectos';
import EditarProyecto from './screens/SubScreens/Proyecto/EditarProyecto';
import ConsultarProyecto from './screens/SubScreens/Proyecto/ConsultarProyecto';

// Módulo RRHH
import GestionRRHH from './screens/GestionRRHH';
import MenuRRHH from './screens/MenuRRHH';

// Módulo Empleados
import MenuEmpleados from './screens/SubScreens/Empleados/MenuEmpleados';
import EmpleadosForm from './screens/SubScreens/Empleados/EmpleadosForm';
import ConsultarEmpleados from './screens/SubScreens/Empleados/ConsultarEmpleados';
import EditarEmpleados from './screens/SubScreens/Empleados/EditarEmpleados';

// Otros módulos
import Documentos from './screens/SubScreens/Documentos/Documentos';
import Facturas from './screens/SubScreens/Facturas/Facturas';
import Inventarios from './screens/SubScreens/Inventarios/Inventario';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        {/* Login y Menús principales */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Menu" component={MenuScreen} />

        {/* Módulo Proyectos */}
        <Stack.Screen name="MenuProyectos" component={MenuProyectos} />
        <Stack.Screen name="GestionProyectos" component={GestionProyectos} />
        <Stack.Screen name="EditarProyecto" component={EditarProyecto} />
        <Stack.Screen name="ConsultarProyecto" component={ConsultarProyecto} />

        {/* Módulo RRHH */}
        <Stack.Screen name="GestionRRHH" component={GestionRRHH} />
        <Stack.Screen name="MenuRRHH" component={MenuRRHH} />

        {/* Menú y pantallas de empleados */}
        <Stack.Screen name="MenuEmpleados" component={MenuEmpleados} />
        <Stack.Screen name="EmpleadosForm" component={EmpleadosForm} />
        <Stack.Screen name="ConsultarEmpleados" component={ConsultarEmpleados} />
        <Stack.Screen name="EditarEmpleados" component={EditarEmpleados} />

        {/* Otros módulos */}
        <Stack.Screen name="Documentos" component={Documentos} />
        <Stack.Screen name="Facturas" component={Facturas} />
        <Stack.Screen name="Inventarios" component={Inventarios} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
