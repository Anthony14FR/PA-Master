"use client";

import { useMemo, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AppContainerProvider } from "@kennelo/presentation/shared/contexts/app-container.context";
import { I18nProvider } from "@kennelo/presentation/shared/contexts/i18n.context";
import { AuthProvider } from "@kennelo/presentation/features/auth/react/contexts/auth.context";
import { DI_TOKENS } from "@kennelo/infrastructure/di/tokens";
import { NextJsAppRouter } from "@/adapters/nextjs-app.router";
import { createWebAppContainer } from "../config/container.config";

export function AppProviders({ children, lang = "en"}: {
    children: ReactNode
    lang?: string
}) {
    const nextRouter = useRouter();

    const container = useMemo(() => {
        const appContainer = createWebAppContainer(lang);

        const router = new NextJsAppRouter(nextRouter);
        appContainer.register(DI_TOKENS.Router, router);

        return appContainer;
    }, [lang, nextRouter]);

    return (
        <AppContainerProvider container={container}>
            <I18nProvider>
                <AuthProvider>
                    {children}
                </AuthProvider>
            </I18nProvider>
        </AppContainerProvider>
    );
}
