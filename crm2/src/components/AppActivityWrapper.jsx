import React, { useMemo, useEffect } from 'react'; // Quitamos useCallback de la importación
import { View, StyleSheet } from 'react-native';
// Importamos useNavigation para obtener el objeto de navegación COMPLETO
import { useNavigation } from "@react-navigation/native";
// La ruta es '../hooks/' porque este componente está en src/components/
import { useActivityTimeout } from '../hooks/useActivityTimeout';

// --- Estilos --
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});

export default function AppActivityWrapper({ children }) {
    const navigation = useNavigation();

    const routeState = navigation.getState();

    // --- CONTROL DEFENSIVO ---
    if (!routeState || !routeState.routes || routeState.routes.length === 0) {
        return <View style={styles.container}>{children}</View>;
    }

    // Obtener el nombre de la ruta actual
    const currentRouteName = routeState.routes[routeState.index].name;

    // Usamos useMemo para garantizar la estabilidad del valor booleano.
    const isAuthenticatedForTimer = useMemo(() => {
        const isAuth = currentRouteName !== 'InicioDeSesion';
        console.log(`[Timer Status] Ruta actual: ${currentRouteName}. Timer Activo: ${isAuth}`);
        return isAuth;
    }, [currentRouteName]);


    // Función handleLogout simplificada (SIN useCallback)
    const handleLogout = () => {
        // La lógica interna debe leer el estado actual de la navegación
        const currentState = navigation.getState();
        const currentName = currentState.routes[currentState.index].name;

        // Evitamos el bucle infinito
        if (currentName !== 'InicioDeSesion') {
            console.log("Sesión Cerrada automáticamente por inactividad global.");

            // Navegar a 'InicioDeSesion'
            navigation.reset({
                index: 0,
                routes: [{ name: 'InicioDeSesion' }],
            });
        } else {
            console.log("Intento de cierre de sesión bloqueado: Ya estamos en InicioDeSesion.");
        }
    };


    // Usar el hook de inactividad
    const { handleUserActivity } = useActivityTimeout(handleLogout, isAuthenticatedForTimer, navigation);

    // Este useEffect fuerza el inicio al detectar que la bandera se hizo TRUE.
    useEffect(() => {
        if (isAuthenticatedForTimer) {
            handleUserActivity();
            console.log("LOG: Forzando inicio del temporizador por cambio de ruta a privado.");
        }
    }, [isAuthenticatedForTimer, handleUserActivity]);

    return (
        // El View con onTouchStart cubre toda la aplicación, detectando cualquier actividad táctil.
        <View
            style={styles.container}
            onTouchStart={handleUserActivity} // Detector de actividad global (resetea)
        >
            {children}
        </View>
    );
}