import { Geist, Geist_Mono } from "next/font/google";
import { headers } from 'next/headers';
import { AuthProvider } from "@/shared/contexts/AuthContext";
import { HreflangTags } from "@/components/HreflangTags";
import { getLocaleFromDomain, getDomainForLocale, getMessages, t } from "@/lib/i18n";
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
    other: {
      'google-site-verification': process.env.GOOGLE_SITE_VERIFICATION || '',
    },
  };
}

export default async function RootLayout({ children }) {
  const headersList = await headers();
  const hostname = headersList.get('host') || '';
  const pathname = headersList.get('x-pathname') || '/';
  
  const locale = getLocaleFromDomain(hostname);

  return (
    <html lang={locale}>
      <head>
        <HreflangTags pathname={pathname} />
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider locale={locale}>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
