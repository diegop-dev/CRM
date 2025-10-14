import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import ClienteForm from './ClienteForm';
import BuscadorCliente from './BuscadorCliente'; // 1. Importamos el componente de búsqueda

// Eliminamos 'route' de las props, ya no se reciben datos por navegación
export default function ConsultarCliente() {
  
  // 2. Estado para almacenar el cliente encontrado. Se inicializa en null.
  const [cliente, setCliente] = useState(null);

  // 3. Esta función se pasará al buscador y se ejecutará cuando encuentre un cliente.
  const handleClienteEncontrado = (clienteData) => {
    // Actualiza el estado con los datos del cliente encontrado.
    setCliente(clienteData);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
            {/* 4. Renderizamos el componente de búsqueda y le pasamos la función manejadora */}
            <BuscadorCliente onClienteEncontrado={handleClienteEncontrado} />

            {/* 5. El formulario solo se muestra si el estado 'cliente' tiene datos */}
            {cliente && (
                <ClienteForm
                    // Pasamos el objeto cliente del estado al formulario
                    cliente={cliente}
                    // El modo 'consultar' hace que el formulario sea de solo lectura
                    mode="consultar"
                    // Pasamos una función vacía ya que no habrá botón de guardado
                    onGuardar={() => {}}
                />
            )}
        </ScrollView>
    </SafeAreaView>
  );
}
