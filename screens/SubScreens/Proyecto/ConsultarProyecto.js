import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import ProyectoForm from './ProyectoForm'; 

export default function ConsultarProyecto({ proyecto = {} }) {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ProyectoForm
        proyecto={proyecto}
        mode="consultar"
        onGuardar={() => {}}
      />
    </SafeAreaView>
  );
}
