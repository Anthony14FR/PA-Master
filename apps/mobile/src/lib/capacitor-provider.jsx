'use client';

import { useEffect } from 'react';
import { Capacitor } from '@capacitor/core';
import { StatusBar, Style } from '@capacitor/status-bar';

/**
 * Provider client-side pour initialiser Capacitor et configurer la StatusBar
 * Ce composant doit être utilisé côté client uniquement
 */
export function CapacitorProvider({ children }) {
  useEffect(() => {
    if (Capacitor.isNativePlatform()) {
      StatusBar.setStyle({ style: Style.Light }).catch(err => {
        console.warn('Failed to set StatusBar style:', err);
      });

      if (Capacitor.getPlatform() === 'android') {
        StatusBar.setBackgroundColor({ color: '#ffffff' }).catch(err => {
          console.warn('Failed to set StatusBar background color:', err);
        });
      }
    }
  }, []);

  return <>{children}</>;
}
