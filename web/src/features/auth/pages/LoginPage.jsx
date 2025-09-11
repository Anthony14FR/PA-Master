"use client";

import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { useAuth } from "@/shared/hooks/useAuth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const { login, error, clearError } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        clearError();

        try {
            await login({ email, password });
            router.push('/dashboard');
        } catch (error) {
            console.error('Erreur de connexion:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold text-slate-900 dark:text-white hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                        Kennelo
                    </Link>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">
                        Connectez-vous à votre compte
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Connexion</CardTitle>
                        <CardDescription>
                            Entrez vos identifiants pour accéder à votre compte
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}
                            
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Votre mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? 'Connexion en cours...' : 'Se connecter'}
                            </Button>
                        </form>
                        
                        <div className="mt-6 text-center space-y-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Pas encore de compte ?{" "}
                                <Link 
                                    href="/auth/register" 
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                >
                                    S'inscrire
                                </Link>
                            </p>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/">
                                    Retour à l'accueil
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}