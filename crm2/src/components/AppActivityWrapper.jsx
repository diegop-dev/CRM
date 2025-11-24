import React, { useEffect, useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { navigationRef, getCurrentRoute } from "../utils/NavigationRef";
import { useActivityTimeout } from "../hooks/useActivityTimeout";

const styles = StyleSheet.create({
    container: { flex: 1 }
});

export default function AppActivityWrapper({ children }) {

    // Obtención segura de la ruta actual
    const currentRoute = getCurrentRoute();
    const currentRouteName = currentRoute?.name || "Unknown";

    const isAuthenticatedForTimer = useMemo(() => {
        return currentRouteName !== "InicioDeSesion";
    }, [currentRouteName]);

    const handleLogout = () => {
        const route = getCurrentRoute();
        const current = route?.name;

        if (current !== "InicioDeSesion") {
            console.log("Sesión cerrada por inactividad.");

            if (navigationRef.isReady()) {
                navigationRef.reset({
                    index: 0,
                    routes: [{ name: "InicioDeSesion" }],
                });
            }
        }
    };

    const { handleUserActivity } = useActivityTimeout(
        handleLogout,
        isAuthenticatedForTimer,
        navigationRef
    );

    useEffect(() => {
        if (isAuthenticatedForTimer) {
            handleUserActivity();
        }
    }, [isAuthenticatedForTimer, handleUserActivity]);

    return (
        <View
            style={styles.container}
            onTouchStart={handleUserActivity}
        >
            {children}
        </View>
    );
}
