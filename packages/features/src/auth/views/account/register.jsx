"use client";

import { Button } from '@kennelo/ui/components/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kennelo/ui/components/shadcn/card';
import { Input } from '@kennelo/ui/components/shadcn/input';
import { Label } from '@kennelo/ui/components/shadcn/label';
import { useAuth } from '@kennelo/core/auth/hooks/use-auth';
import KLink from '@kennelo/ui/components/composed/k-link';
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useCommonTranslation, useTranslation } from '@kennelo/i18n/hooks/use-translation';
import { getLocaleFromDomain } from '@kennelo/i18n/lib/i18n';

export function Register() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [validationError, setValidationError] = useState("");

    const { t: tCommon } = useCommonTranslation();
    const { t: tAuth } = useTranslation("auth", "register");

    const { register, error, clearError } = useAuth();
    const router = useRouter();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setValidationError("");
        clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setValidationError(tAuth("errors.passwordMismatch"));
            return;
        }

        setIsSubmitting(true);
        clearError();

        try {
            // Détecter la locale courante depuis le domaine
            const currentLocale = typeof window !== 'undefined'
                ? getLocaleFromDomain(window.location.hostname)
                : 'en';

            // Envoyer la locale avec les données d'inscription
            await register({
                ...formData,
                locale: currentLocale
            });
            router.push('/dashboard');
        } catch (error) {
            console.error('Registration error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <KLink href="/" className="text-3xl font-bold text-slate-900 dark:text-white hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
                        {tCommon("site.name")}
                    </KLink>
                    <p className="text-slate-600 dark:text-slate-300 mt-2">
                        {tAuth("subtitle")}
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>{tAuth("title")}</CardTitle>
                        <CardDescription>
                            {tAuth("description")}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {(error || validationError) && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {validationError || error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">{tAuth("form.name")}</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder={tAuth("form.namePlaceholder")}
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">{tAuth("form.email")}</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder={tAuth("form.emailPlaceholder")}
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{tAuth("form.password")}</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder={tAuth("form.passwordPlaceholder")}
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">{tAuth("form.confirmPassword")}</Label>
                                <Input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type="password"
                                    placeholder={tAuth("form.confirmPasswordPlaceholder")}
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full" disabled={isSubmitting}>
                                {isSubmitting ? tAuth("form.loading") : tAuth("form.submit")}
                            </Button>
                        </form>

                        <div className="mt-6 text-center space-y-4">
                            <p className="text-sm text-slate-600 dark:text-slate-400">
                                {tAuth("links.hasAccount")}{" "}
                                <KLink
                                    context="account"
                                    href="/login"
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                >
                                    {tAuth("links.login")}
                                </KLink>
                            </p>
                            <Button asChild variant="outline" className="w-full">
                                <KLink href="/">
                                    {tAuth("links.goBack")}
                                </KLink>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}