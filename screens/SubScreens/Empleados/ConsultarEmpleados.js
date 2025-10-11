import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmpleadosForm from './EmpleadosForm';

export default function ConsultarEmpleados() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <EmpleadosForm mode="Consultar" /> 
      {/* puedes agregar props como mode si tu formulario los soporta */}
    </SafeAreaView>
  );
}
