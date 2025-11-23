import { useEffect, useRef, useCallback } from 'react';
import { AppState } from 'react-native';

// Tiempo límite de inactividad en milisegundos (10 segundos)
const INACTIVITY_TIMEOUT_MS = 30000;

/**
 * Hook para gestionar el cierre de sesión automático por inactividad.
 */
export const useActivityTimeout = (onTimeout, isAuthenticated, navigation) => { 
    // Referencia al temporizador (para poder cancelarlo)
    const timeoutRef = useRef(null); 
    const appState = useRef(AppState.currentState);

    // Usamos useCallback para estabilizar la función del temporizador.
    const startTimer = useCallback(() => {
        // Limpiar siempre el temporizador anterior
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }

        if (isAuthenticated) {
            console.log("LOG Timer: Iniciando/Reiniciando temporizador."); 
            
            timeoutRef.current = setTimeout(() => {
                console.log("¡Tiempo de inactividad agotado! Cerrando sesión...");
                onTimeout(); // Ejecuta la función de cierre de sesión
            }, INACTIVITY_TIMEOUT_MS);
        }
    }, [onTimeout, isAuthenticated]); 

    // Función que se llama con cualquier interacción del usuario
    const handleUserActivity = useCallback(() => {
        // Solo si la app está activa y el temporizador está activo
        if (appState.current === 'active' && isAuthenticated) {
            startTimer(); // Llama a la función estable
        }
    }, [startTimer, isAuthenticated]);

    // useEffect de Montaje/Inicialización
    // Agregamos 'navigation' a las dependencias para forzar la re-ejecución al cambiar el estado de ruta
    useEffect(() => {
        // Ejecutamos el timer al montar o al cambiar el estado de autenticación/navegación
        startTimer(); 

        // Limpieza: Se ejecuta al desmontar
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    // El uso de navigation aquí fuerza el reinicio al cambiar la ruta.
    }, [isAuthenticated, startTimer, navigation]); 


    // Manejar los cambios de estado de la aplicación (fondo/primer plano)
    useEffect(() => {
        const handleAppStateChange = (nextAppState) => {

            // Si la app pasa de 'fondo' a 'activo' y el temporizador está activo, reinicia.
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active' &&
                isAuthenticated
            ) {
                startTimer(); 
            }

            // Si la app va a 'fondo' (o inactivo), limpiamos el temporizador
            if (nextAppState.match(/inactive|background/) && isAuthenticated) {
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
            }

            appState.current = nextAppState;
            console.log('AppState', appState.current);
        };

        const subscription = AppState.addEventListener('change', handleAppStateChange);

        return () => {
            subscription.remove();
        };
    }, [isAuthenticated, startTimer, navigation]);


    return { handleUserActivity };
};