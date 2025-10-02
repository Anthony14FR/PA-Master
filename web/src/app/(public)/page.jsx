"use client";

import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useCommonTranslation } from "@/shared/hooks/useTranslation";

export default function Home() {
  const { t } = useCommonTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            {t("site.name")}
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8">
            {t("site.tagline")}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{t("home.cards.api.title")}</CardTitle>
              <CardDescription>
                {t("home.cards.api.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/test">{t("home.cards.api.button")}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{t("home.cards.login.title")}</CardTitle>
              <CardDescription>
                {t("home.cards.login.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/login">{t("home.cards.login.button")}</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{t("home.cards.register.title")}</CardTitle>
              <CardDescription>
                {t("home.cards.register.description")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/auth/register">{t("home.cards.register.button")}</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {t("home.cta")}
          </p>

          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}
