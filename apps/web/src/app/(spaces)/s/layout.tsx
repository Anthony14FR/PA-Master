import { AppProviders } from '@/providers/app.providers';
import { ProtectedRoute, RequireAuth } from '@kennelo/presentation';
import React from 'react';

export default async function RootLayout({ children }: {
    children: React.ReactNode
}) {
    return (
        <AppProviders>
            <RequireAuth>
                <ProtectedRoute /*fallback={<LoginView/>}*/>
                    {children}
                </ProtectedRoute>
            </RequireAuth>
        </AppProviders>
    );
}