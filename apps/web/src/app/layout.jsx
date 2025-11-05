import { Geist, Geist_Mono } from "next/font/google";
import { headers } from 'next/headers';
import { InitStorage } from '@/lib/init-storage';
import { AuthProvider } from "@kennelo/contexts/auth-context";
import { TranslationProvider } from "@kennelo/contexts/translation-context";
import { ConversationProvider } from "@kennelo/features/conversations/contexts/conversation-context";
import { OrganizationStructuredData, WebSiteStructuredData } from "@kennelo/components/structured-data";
import { getLocaleFromDomain, getDomainForLocale, getMessages, getHreflangCode, getGoogleSiteVerification, getHreflangUrls, t } from "@kennelo/lib/i18n";
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
  const hreflangUrls = getHreflangUrls(pathname);

  return {
    title: t(messages, 'meta.title'),
    description: t(messages, 'meta.description'),
    alternates: {
      canonical: `https://${currentDomain}${pathname}`,
      languages: hreflangUrls,
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
    robots: {
      index: true,
      follow: true,
    },
    viewport: 'width=device-width, initial-scale=1',
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <InitStorage />
        <OrganizationStructuredData locale={locale} messages={messages} t={t} />
        <WebSiteStructuredData locale={locale} messages={messages} t={t} />
        <TranslationProvider initialMessages={messages} initialLocale={locale}>
          <AuthProvider locale={locale}>
            <ConversationProvider>
              {children}
            </ConversationProvider>
          </AuthProvider>
        </TranslationProvider>
      </body>
    </html>
  );
}
