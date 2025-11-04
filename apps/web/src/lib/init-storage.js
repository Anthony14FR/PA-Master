'use client';

import { initializeStorage } from '@kennelo/lib/storage-provider';
import { CookieAdapter } from '@kennelo/services/storage/adapters/cookie.adapter';

if (typeof window !== 'undefined') {
  initializeStorage(
    new CookieAdapter({
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
  );
}

export function InitStorage() {
  return null;
}
