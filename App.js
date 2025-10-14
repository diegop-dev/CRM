import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Pantallas Principales
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

// SubMódulo Empleados
import MenuEmpleados from './screens/SubScreens/Empleados/MenuEmpleados';
import EmpleadosForm from './screens/SubScreens/Empleados/EmpleadosForm';
import ConsultarEmpleados from './screens/SubScreens/Empleados/ConsultarEmpleados';
import EditarEmpleados from './screens/SubScreens/Empleados/EditarEmpleados';

// Módulo Clientes
import MenuClientes from './screens/MenuClientes';
import GestionClientes from './screens/GestionClientes';
import ClienteForm from './screens/SubScreens/Clientes/ClienteForm';
import ConsultarCliente from './screens/SubScreens/Clientes/ConsultarCliente';
import EditarCliente from './screens/SubScreens/Clientes/EditarCliente';
import BuscadorCliente from './screens/SubScreens/Clientes/BuscadorCliente';

// Módulo Servicios
import MenuServicios from './screens/MenuServicios';
import GestionServicios from './screens/GestionServicios';
import EditarServicio from './screens/SubScreens/Servicios/EditarServicio';
import ConsultarServicio from './screens/SubScreens/Servicios/ConsultarServicio';
import ServicioForm from './screens/SubScreens/Servicios/ServicioForm';
import BuscadorServicio from './screens/SubScreens/Servicios/BuscadorServicio';

// Otros Módulos
import Documentos from './screens/SubScreens/Documentos/Documentos';
import Facturas from './screens/SubScreens/Facturas/Facturas';
import Inventarios from './screens/SubScreens/Inventarios/Inventario';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
        {/* Pantallas Principales */}
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

        {/* SubMódulo Empleados */}
        <Stack.Screen name="MenuEmpleados" component={MenuEmpleados} />
        <Stack.Screen name="EmpleadosForm" component={EmpleadosForm} />
        <Stack.Screen name="ConsultarEmpleados" component={ConsultarEmpleados} />
        <Stack.Screen name="EditarEmpleados" component={EditarEmpleados} />

        {/* Módulo Clientes */}
        <Stack.Screen name="MenuClientes" component={MenuClientes} />
        <Stack.Screen name="GestionClientes" component={GestionClientes} />
        <Stack.Screen name="ClienteForm" component={ClienteForm} />
        <Stack.Screen name="ConsultarCliente" component={ConsultarCliente} />
        <Stack.Screen name="EditarCliente" component={EditarCliente} />
        <Stack.Screen name="BuscadorCliente" component={BuscadorCliente} />

        {/* Módulo Servicios */}
        <Stack.Screen name="MenuServicios" component={MenuServicios} />
        <Stack.Screen name="GestionServicios" component={GestionServicios} />
        <Stack.Screen name="EditarServicio" component={EditarServicio} />
        <Stack.Screen name="ConsultarServicio" component={ConsultarServicio} />
        <Stack.Screen name="ServicioForm" component={ServicioForm} />
        <Stack.Screen name="BuscadorServicio" component={BuscadorServicio} />

        {/* Otros Módulos */}
        <Stack.Screen name="Documentos" component={Documentos} />
        <Stack.Screen name="Facturas" component={Facturas} />
        <Stack.Screen name="Inventarios" component={Inventarios} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
