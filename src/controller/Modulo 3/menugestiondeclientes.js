// Esta bandera vivirá mientras la app esté abierta
// y controlará que solo se pueda navegar una vez a la vez.
let isNavigating = false;

/**
 * Función para navegar a la pantalla de Agregar Cliente.
 * @param {object} navigation El objeto de navegación de React Navigation.
 */
export const handleAgregarCliente = (navigation) => {
  // Si ya estamos navegando, ignorar este toque.
  if (isNavigating) return; 

  // 1. Bloquear la navegación
  isNavigating = true;
  console.log('Navegando a Agregar Cliente...');
  
  // 2. Ejecutar la navegación
  navigation.navigate('AgregarCliente'); 

  // 3. Desbloquear la navegación después de 1 segundo (1000ms).
  // Esto da tiempo suficiente para que la animación de la
  // pantalla termine y evita el "double tap".
  setTimeout(() => {
    isNavigating = false;
  }, 1000); 
};

/**
 * Función para navegar a la pantalla de Editar Cliente.
 * @param {object} navigation El objeto de navegación de React Navigation.
 */
export const handleEditarCliente = (navigation) => {
  // Misma lógica de bloqueo
  if (isNavigating) return;
  isNavigating = true;
  
  console.log('Navegando a Editar Cliente...');
  navigation.navigate('EditarCliente');

  setTimeout(() => {
    isNavigating = false;
  }, 1000);
};

/**
 * Función para navegar a la pantalla de Consultar Cliente.
 * @param {object} navigation El objeto de navegación de React Navigation.
 */
export const handleConsultarCliente = (navigation) => {
  // Misma lógica de bloqueo
  if (isNavigating) return;
  isNavigating = true;

  console.log('Navegando a Consultar Cliente...');
  navigation.navigate('ConsultarCliente');

  setTimeout(() => {
    isNavigating = false;
  }, 1000);
};
