import { createNavigationContainerRef } from "@react-navigation/native";

export const navigationRef = createNavigationContainerRef();

export function getCurrentRoute() {
    if (navigationRef.isReady()) {
        return navigationRef.getCurrentRoute();
    }
    return null;
}

export function navigate(name, params) {
    if (navigationRef.isReady()) {
        navigationRef.navigate(name, params);
    }
}
