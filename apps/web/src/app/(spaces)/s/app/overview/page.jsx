'use client';

import KLink from '@kennelo/components/k-link';
import { Button } from '@kennelo/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kennelo/ui/card';
import { MessageCircle } from 'lucide-react';
import { UnreadBadge } from '@kennelo/features/conversations/components/unread-badge';

export default function Page() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
                <p className="text-muted-foreground">
                    Gérez votre établissement
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle className="flex items-center justify-center">
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Conversations
                            <UnreadBadge />
                        </CardTitle>
                        <CardDescription>
                            Gérez les conversations avec vos clients
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <KLink context="app" href="/conversations">
                                Voir les conversations
                            </KLink>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <CardTitle>Réservations</CardTitle>
                        <CardDescription>
                            Gérez les réservations de votre établissement
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild variant="outline" className="w-full" disabled>
                            <span>Bientôt disponible</span>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}