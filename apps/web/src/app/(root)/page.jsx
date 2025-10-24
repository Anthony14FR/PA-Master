"use client";

<<<<<<< HEAD:apps/web/src/app/(root)/page.jsx
import KLink from "@kennelo/components/k-link";
import { Button } from "@kennelo/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@kennelo/ui/card";
import { LanguageSwitcher } from "@kennelo/components/language-switcher";
import { useCommonTranslation } from "@kennelo/hooks/use-translation";
import { useAuth } from "@kennelo/hooks/use-auth";
=======
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { LanguageSwitcher } from "@/shared/components/language-switcher";
<<<<<<< HEAD:apps/web/src/app/(root)/page.jsx
import { useCommonTranslation } from "@/shared/hooks/useTranslation";
import { useAuth } from "@/shared/hooks/useAuth";
>>>>>>> b1eb7ca (feat: Added routing's restrictions from user roles):web/src/app/(public)/page.jsx
=======
import { useCommonTranslation } from "@/shared/hooks/use-translation";
import { useAuth } from "@/shared/hooks/use-auth";
>>>>>>> 15dc11d (feat: Sub-domaine namespace routing + auth redirections):web/src/app/(public)/page.jsx
import { LogOut } from "lucide-react";

export default function Page() {
  const { T, t } = useCommonTranslation();
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="w-2xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            <T tKey="site.name" skeletonWidth={200} />
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            <T tKey="site.tagline" skeletonWidth={400} />
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow justify-between">
            <CardHeader>
              <CardTitle>
                <T tKey="home.cards.api.title" skeletonWidth={120} />
              </CardTitle>
              <CardDescription>
                <T tKey="home.cards.api.description" skeletonWidth={200} />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/test">
                  <T tKey="home.cards.api.button" skeletonWidth={100} />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow justify-between">
            <CardHeader>
              <CardTitle>
                <T tKey="home.cards.login.title" skeletonWidth={100} />
              </CardTitle>
              <CardDescription>
                <T tKey="home.cards.login.description" skeletonWidth={180} />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/login">
                  <T tKey="home.cards.login.button" skeletonWidth={100} />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow justify-between">
            <CardHeader>
              <CardTitle>
                <T tKey="home.cards.register.title" skeletonWidth={110} />
              </CardTitle>
              <CardDescription>
                <T tKey="home.cards.register.description" skeletonWidth={170} />
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/register">
                  <T tKey="home.cards.register.button" skeletonWidth={90} />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            <T tKey="home.cta" skeletonWidth={350} />
          </p>

          <div className="flex gap-2">
            <LanguageSwitcher />
            {user && (
              <Button variant='destructive' size='sm' onClick={logout}>
                <LogOut />
                {t("dashboard.logout")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
