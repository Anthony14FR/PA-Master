import { AppProviders } from '@/providers/app.providers';
import React from 'react';

export default async function RootLayout({ children, params }: {
    params: Promise<{ locale: string }>
    children: React.ReactNode
}) {
    const { locale } = await params

    return (
        <AppProviders lang={locale}>
            {children}
        </AppProviders>
    );
}
