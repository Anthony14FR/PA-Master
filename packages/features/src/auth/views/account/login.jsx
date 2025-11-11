"use client";

import { Button } from '@kennelo/ui/components/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kennelo/ui/components/shadcn/card';
import { Input } from '@kennelo/ui/components/shadcn/input';
import { Label } from '@kennelo/ui/components/shadcn/label';
import { useAuth } from '@kennelo/core/auth/hooks/use-auth';
import KLink from '@kennelo/ui/components/composed/k-link';
import {useRouter, useSearchParams} from "next/navigation";
import { useState } from "react";
import {useCommonTranslation, useTranslation} from '@kennelo/i18n/hooks/use-translation';
import { accessControlService } from '@kennelo/core/auth/services/access-control.service';

export function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const searchParams = useSearchParams();

    const { t: tCommon } = useCommonTranslation();
    const { t: tAuth } = useTranslation("auth", "login");

    const { login, error, clearError } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        clearError();

        try {
            const response = await login({ email, password });
            const userData = response.user || response;
            const accessToken = response.access_token || response.token;
            const refreshToken = response.refresh_token;

            const returnUrl = searchParams.get('returnUrl');
            if(returnUrl) {
                const decodedReturnUrl = decodeURIComponent(returnUrl);

                const currentHostname = window.location.hostname;
                const returnUrlObj = new URL(decodedReturnUrl);
                const returnHostname = returnUrlObj.hostname;

                const getBaseDomain = (hostname) => {
                    const parts = hostname.split('.');
                    return parts.length >= 2 ? parts.slice(-2).join('.') : hostname;
                };

                const currentBaseDomain = getBaseDomain(currentHostname);
                const returnBaseDomain = getBaseDomain(returnHostname);

                if (currentBaseDomain !== returnBaseDomain && accessToken) {
                    const sessionData = {
                        access_token: accessToken,
                        refresh_token: refreshToken
                    };
                    const encodedSession = btoa(JSON.stringify(sessionData));
                    returnUrlObj.searchParams.set('session_token', encodedSession);
                    window.location.href = returnUrlObj.toString();
                } else {
                    router.push(decodedReturnUrl);
                }
            } else {
                router.push(accessControlService.getUserHomePage(userData.roles || []));
            }
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
                            {error && (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">{tAuth("form.email")}</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder={tAuth("form.emailPlaceholder")}
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    disabled={isSubmitting}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">{tAuth("form.password")}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder={tAuth("form.passwordPlaceholder")}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                                {tAuth("links.noAccount")}{" "}
                                <KLink
                                    context="account"
                                    href="/register"
                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                                >
                                    {tAuth("links.register")}
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
