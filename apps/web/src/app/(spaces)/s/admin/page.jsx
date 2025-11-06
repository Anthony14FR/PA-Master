import KLink from '@kennelo/components/k-link';
import { Button } from '@kennelo/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@kennelo/ui/card';
import { Users } from 'lucide-react';

export default function Page() {
    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Panneau d'administration
                </h1>
                <p className="text-gray-600">
                    Gérez la plateforme Kennelo
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Users className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <CardTitle>Utilisateurs</CardTitle>
                                <CardDescription>
                                    Gérer les comptes utilisateurs
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Button asChild className="w-full">
                            <KLink context="admin" href="/users">
                                Voir les utilisateurs
                            </KLink>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="opacity-50">
                    <CardHeader>
                        <CardTitle>Établissements</CardTitle>
                        <CardDescription>
                            Gérer les établissements
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button disabled className="w-full">
                            Bientôt disponible
                        </Button>
                    </CardContent>
                </Card>

                <Card className="opacity-50">
                    <CardHeader>
                        <CardTitle>Réservations</CardTitle>
                        <CardDescription>
                            Gérer les réservations
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button disabled className="w-full">
                            Bientôt disponible
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-8">
                <Button asChild variant="outline">
                    <KLink href="/">
                        Retour à l'accueil
                    </KLink>
                </Button>
            </div>
        </div>
    );
}