import { Geist, Geist_Mono } from "next/font/google";
import { InitStorage } from '@/lib/init-storage';
import { AuthProvider } from "@kennelo/core/auth/contexts/auth-context";
import { TranslationProvider } from "@kennelo/i18n/contexts/translation-context";
import { getMessages, DEFAULT_LOCALE } from "@kennelo/i18n/lib/i18n";
import { CapacitorProvider } from "@/lib/capacitor-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({ children }) {
  const locale = DEFAULT_LOCALE;
  const messages = await getMessages(locale);

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <InitStorage />
        <CapacitorProvider>
          <TranslationProvider initialMessages={messages} initialLocale={locale}>
            <AuthProvider locale={locale}>
              {children}
            </AuthProvider>
          </TranslationProvider>
        </CapacitorProvider>
      </body>
    </html>
  );
}
