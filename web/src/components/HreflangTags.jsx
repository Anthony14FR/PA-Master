import { getHreflangUrls, getHreflangCode, AVAILABLE_LOCALES } from '@/lib/i18n';

export function HreflangTags({ pathname = '/' }) {
  const hreflangUrls = getHreflangUrls(pathname);

  return (
    <>
      {AVAILABLE_LOCALES.map(locale => (
        <link
          key={locale}
          rel="alternate"
          hrefLang={getHreflangCode(locale)}
          href={hreflangUrls[locale]}
        />
      ))}
      <link
        rel="alternate"
        hrefLang="x-default"
        href={hreflangUrls['x-default']}
      />
    </>
  );
}