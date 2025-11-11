'use client';

import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from '@kennelo/core/auth/services/auth.service';

function LogoutContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const performLogout = async () => {
            try {
                authService.clearTokens();

                await new Promise(resolve => setTimeout(resolve, 100));

                const returnUrl = searchParams.get('returnUrl');
                if (returnUrl) {
                    window.location.href = decodeURIComponent(returnUrl);
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error('[Logout Page] Error:', error);
                router.push('/');
            }
        };

        performLogout();
    }, [router, searchParams]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg">Déconnexion en cours...</p>
        </div>
    );
}

export default function LogoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg">Déconnexion en cours...</p>
            </div>
        }>
            <LogoutContent />
        </Suspense>
    );
}