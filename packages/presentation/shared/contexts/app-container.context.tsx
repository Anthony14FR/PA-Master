"use client";

import { createContext, useContext, ReactNode } from "react";
import { AppContainer } from "@kennelo/infrastructure/di/container";

const AppContainerContext = createContext<AppContainer | null>(null);

interface AppContainerProviderProps {
    container: AppContainer;
    children: ReactNode;
}

export function AppContainerProvider({ container, children }: AppContainerProviderProps) {
    return (
        <AppContainerContext.Provider value={container}>
            {children}
        </AppContainerContext.Provider>
    );
}

export function useAppContainer(): AppContainer {
    const container = useContext(AppContainerContext);

    if (!container) {
        throw new Error("useAppContainer must be used within AppContainerProvider");
    }

    return container;
}
