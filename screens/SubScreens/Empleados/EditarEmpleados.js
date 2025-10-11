import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmpleadosForm from './EmpleadosForm';

export default function EditarEmpleados() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <EmpleadosForm mode="editar" /> 
      {/* puedes agregar props como mode si tu formulario los soporta */}
    </SafeAreaView>
  );
}
