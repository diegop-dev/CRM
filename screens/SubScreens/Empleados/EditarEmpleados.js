import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmpleadosLista from './EmpleadosLista';
import EmpleadosForm from './EmpleadosForm';

export default function EditarEmpleados() {
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {empleadoSeleccionado ? (
        <EmpleadosForm
          empleado={empleadoSeleccionado}
          mode="editar"
          onGuardar={() => setEmpleadoSeleccionado(null)} 
        />
      ) : (
        <EmpleadosLista onSeleccionar={setEmpleadoSeleccionado} />
      )}
    </SafeAreaView>
  );
}
