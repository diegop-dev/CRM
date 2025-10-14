// Archivo: ConsultarServicio.js
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView } from 'react-native';
import ServicioForm from './ServicioForm'; // Apuntamos al formulario de servicio
import BuscadorServicio from './BuscadorServicio'; // Asumimos un buscador de servicios

export default function ConsultarServicio() {
  
  // Estado para almacenar el servicio encontrado. Se inicializa en null.
  const [servicio, setServicio] = useState(null);

  // Esta función se pasará al buscador y se ejecutará cuando encuentre un servicio.
  const handleServicioEncontrado = (servicioData) => {
    // Actualiza el estado con los datos del servicio encontrado.
    setServicio(servicioData);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
        <ScrollView>
            {/* Renderizamos el componente de búsqueda de servicios y le pasamos la función manejadora */}
            <BuscadorServicio onServicioEncontrado={handleServicioEncontrado} />

            {/* El formulario solo se muestra si el estado 'servicio' tiene datos */}
            {servicio && (
                <ServicioForm
                    // Pasamos el objeto servicio del estado al formulario
                    servicio={servicio}
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
