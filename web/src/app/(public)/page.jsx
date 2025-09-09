import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Kennelo
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            Plateforme de gestion moderne et intuitive
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>API Intégrée</CardTitle>
              <CardDescription>
                Testez notre API robuste et performante
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/test">Tester l'API</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Connexion</CardTitle>
              <CardDescription>
                Accédez à votre compte existant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/login">Se connecter</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>Inscription</CardTitle>
              <CardDescription>
                Créez votre nouveau compte
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/register">S'inscrire</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Commencez votre expérience avec Kennelo dès aujourd'hui
          </p>
        </div>
      </div>
    </div>
  );
}
