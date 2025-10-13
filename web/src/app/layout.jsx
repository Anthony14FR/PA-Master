import { Geist, Geist_Mono } from "next/font/google";
import { headers } from 'next/headers';
import { AuthProvider } from "@/shared/contexts/auth-context";
import { TranslationProvider } from "@/shared/contexts/translation-context";
import { HreflangTags } from "@/shared/components/hreflang-tags";
import { OrganizationStructuredData, WebSiteStructuredData } from "@/shared/components/structured-data";
import { getLocaleFromDomain, getDomainForLocale, getMessages, getHreflangCode, getGoogleSiteVerification, t } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata() {
  const headersList = await headers();
  const hostname = headersList.get('host') || '';
  const pathname = headersList.get('x-pathname') || '/';
  
  const locale = getLocaleFromDomain(hostname);
  const messages = await getMessages(locale);
  const currentDomain = getDomainForLocale(locale);

  return {
    title: t(messages, 'meta.title'),
    description: t(messages, 'meta.description'),
    alternates: {
      canonical: `https://${currentDomain}${pathname}`,
    },
    openGraph: {
      title: t(messages, 'meta.title'),
      description: t(messages, 'meta.description'),
      url: `https://${currentDomain}${pathname}`,
      siteName: t(messages, 'site.name'),
      locale: getHreflangCode(locale).replace('-', '_'),
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t(messages, 'meta.title'),
      description: t(messages, 'meta.description'),
    },
    other: {
      'google-site-verification': getGoogleSiteVerification(hostname),
    },
  };
}

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const hostname = headersList.get('host') || '';
  const pathname = headersList.get('x-pathname') || '/';
  
  const locale = getLocaleFromDomain(hostname);
  const messages = await getMessages(locale);

  return (
    <html lang={locale}>
      <head>
        <HreflangTags pathname={pathname} />
        <OrganizationStructuredData locale={locale} messages={messages} t={t} />
        <WebSiteStructuredData locale={locale} messages={messages} t={t} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <TranslationProvider initialMessages={messages} initialLocale={locale}>
          <AuthProvider locale={locale}>
            {children}
          </AuthProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
