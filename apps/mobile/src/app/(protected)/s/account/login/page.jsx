'use client';

import { Suspense } from 'react';
import { Login } from '@kennelo/features/auth/pages/login';

export default function Page() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Chargement...</p>
            </div>
        }>
            <Login />
        </Suspense>
    );
}