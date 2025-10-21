import { getDomainForLocale, getHreflangCode } from '@/lib/i18n';

export function OrganizationStructuredData({ locale, messages, t }) {
  const domain = getDomainForLocale(locale);
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": t(messages, 'site.name'),
    "url": `https://${domain}`,
    "logo": `https://${domain}/logo.png`,
    "description": t(messages, 'meta.description'),
    "sameAs": [
      "https://www.facebook.com/kennelo",
      "https://www.twitter.com/kennelo",
      "https://www.linkedin.com/company/kennelo"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["French", "English", "Italian", "German"]
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}

export function WebSiteStructuredData({ locale, messages, t }) {
  const domain = getDomainForLocale(locale);
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": t(messages, 'site.name'),
    "url": `https://${domain}`,
    "description": t(messages, 'meta.description'),
    "inLanguage": getHreflangCode(locale),
    "potentialAction": {
      "@type": "SearchAction",
      "target": `https://${domain}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}