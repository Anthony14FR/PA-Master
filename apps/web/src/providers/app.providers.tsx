"use client";

import { useMemo, ReactNode } from "react";
import { AppContainerProvider } from "@kennelo/presentation/shared/contexts/app-container.context";
import { createWebAppContainer } from "../config/container.config";

export function AppProviders({ children }: { children: ReactNode }) {
    const container = useMemo(() => createWebAppContainer(), []);

    return (
        <AppContainerProvider container={container}>
            {children}
        </AppContainerProvider>
    );

}
