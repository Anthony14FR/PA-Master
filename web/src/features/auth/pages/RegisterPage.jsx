"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";

export function RegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert("Les mots de passe ne correspondent pas");
            return;
        }
        console.log("Inscription:", formData);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="text-3xl font-bold text-slate-900 dark:text-white hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                        Kennelo
                    </Link>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">
                        Créez votre nouveau compte
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Inscription</CardTitle>
                        <CardDescription>
                            Remplissez le formulaire pour créer votre compte
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nom complet</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Votre nom complet"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="votre@email.com"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Mot de passe</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Créez un mot de passe"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder="Confirmez votre mot de passe"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full">
                                S'inscrire
                            </Button>
                        </form>
                        
                        <div className="mt-6 text-center space-y-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                Déjà un compte ?{" "}
                                <Link 
                                    href="/auth/login" 
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                >
                                    Se connecter
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