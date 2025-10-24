'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AUTH_CONFIG, AUTH_NAMESPACE } from '@kennelo/config/access-control.config';

const ENABLE_SUBDOMAIN_REDIRECT = process.env.NEXT_PUBLIC_ENABLE_SUBDOMAIN_REDIRECT !== 'false';

function extractSpaceFromPath(pathname) {
  if (!pathname.startsWith('/s/')) {
    return null;
  }
  const pathParts = pathname.split('/').filter(Boolean);
  return pathParts[1] || null;
}

function getCurrentSubdomain() {
  if (typeof window === 'undefined') {
    return null;
  }

  const hostname = window.location.hostname;

  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    if (hostname.includes('.localhost')) {
      return hostname.split('.')[0];
    }
    if (hostname.includes('.127.0.0.1')) {
      return hostname.split('.')[0];
    }
    return null;
  }

  const parts = hostname.split('.');
  
  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const previewParts = hostname.split('---');
    return previewParts[0] || null;
  }

  if (parts.length >= 3) {
    const subdomain = parts[0];
    if (subdomain === 'www') {
      return null;
    }
    return subdomain;
  }

  return null;
}

function buildSubdomainUrl(targetContext, pathname) {
  if (typeof window === 'undefined') {
    return pathname;
  }

  const protocol = window.location.protocol;
  const hostname = window.location.hostname;

  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    const port = window.location.port ? `:${window.location.port}` : '';
    if (targetContext === 'www') {
      return `${protocol}//localhost${port}${pathname}`;
    }
    return `${protocol}//${targetContext}.localhost${port}${pathname}`;
  }

  if (hostname.includes('---') && hostname.endsWith('.vercel.app')) {
    const baseDomain = hostname.split('---').slice(1).join('---');
    if (targetContext === 'www') {
      return `${protocol}//${baseDomain}${pathname}`;
    }
    return `${protocol}//${targetContext}---${baseDomain}${pathname}`;
  }

  const parts = hostname.split('.');
  let baseDomain;

  if (parts.length >= 3) {
    baseDomain = parts.slice(1).join('.');
  } else {
    baseDomain = hostname;
  }

  if (targetContext === AUTH_NAMESPACE) {
    const domainParts = baseDomain.split('.');
    const currentTld = domainParts[domainParts.length - 1];
    const targetTld = AUTH_CONFIG.tld.replace('.', '');
    
    if (currentTld !== targetTld) {
      domainParts[domainParts.length - 1] = targetTld;
      baseDomain = domainParts.join('.');
    }
  }

  if (targetContext === 'www') {
    return `${protocol}//www.${baseDomain}${pathname}`;
  }

  return `${protocol}//${targetContext}.${baseDomain}${pathname}`;
}

function buildPathBasedUrl(targetContext, pathname) {
  if (targetContext === 'www') {
    return pathname;
  }
  return `/s/${targetContext}${pathname}`;
}

export default function KLink({ href, context, children, ...rest }) {
  const currentPathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  let targetContext = context;

  if (!targetContext && href.startsWith('/s/')) {
    targetContext = extractSpaceFromPath(href);
  }

  if (!targetContext) {
    targetContext = 'www';
  }

  let cleanPathname = href;
  if (href.startsWith('/s/')) {
    const pathParts = href.split('/').filter(Boolean);
    cleanPathname = '/' + (pathParts.slice(2).join('/') || '');
  }

  if (!isClient) {
    const ssrHref = targetContext === 'www' 
      ? cleanPathname 
      : `/s/${targetContext}${cleanPathname}`;
    
    return (
      <Link href={ssrHref} {...rest}>
        {children}
      </Link>
    );
  }

  const currentSubdomain = getCurrentSubdomain();
  const currentContext = extractSpaceFromPath(currentPathname) || currentSubdomain || 'www';
  const needsCrossSubdomainNav = currentContext !== targetContext;

  let finalHref;

  if (ENABLE_SUBDOMAIN_REDIRECT) {
    if (needsCrossSubdomainNav) {
      finalHref = buildSubdomainUrl(targetContext, cleanPathname);
    } else {
      finalHref = cleanPathname;
    }
  } else {
    finalHref = buildPathBasedUrl(targetContext, cleanPathname);
  }

  if (finalHref?.startsWith('http://') || finalHref?.startsWith('https://')) {
    return (
      <a href={finalHref} {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={finalHref} {...rest}>
      {children}
    </Link>
  );
}

