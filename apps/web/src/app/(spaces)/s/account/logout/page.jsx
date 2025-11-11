'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from "next/navigation";
import { authService } from '@kennelo/core/auth/services/auth.service';

/**
 * Page de logout pour le domaine par défaut (account.kennelo.com)
 * 
 * Cette page supprime les cookies du domaine .com uniquement.
 * Le token a déjà été blacklisté sur le domaine d'origine (.fr, .it, .de).
 * 
 * IMPORTANT: N'appelle PAS useAuth().logout() pour éviter une boucle infinie.
 */
export default function LogoutPage() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Fonction async pour gérer le logout
        const performLogout = async () => {
            try {
                // Supprimer les cookies .com (client-side uniquement, pas d'appel API)
                authService.clearTokens();

                // Attendre un court instant pour s'assurer que les cookies sont supprimés
                await new Promise(resolve => setTimeout(resolve, 100));

                // Rediriger vers returnUrl ou home
                const returnUrl = searchParams.get('returnUrl');
                if (returnUrl) {
                    window.location.href = decodeURIComponent(returnUrl);
                } else {
                    router.push('/');
                }
            } catch (error) {
                console.error('[Logout Page] Error:', error);
                // En cas d'erreur, forcer la redirection
                router.push('/');
            }
        };

        performLogout();
    }, []); // ← Exécuté UNE SEULE FOIS au mount

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg">Déconnexion en cours...</p>
        </div>
    );
}