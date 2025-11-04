'use client';

import { initializeStorage } from '@kennelo/lib/storage-provider';
import { CapacitorAdapter } from '@/adapters/capacitor.adapter';

if (typeof window !== 'undefined') {
    initializeStorage(
        new CapacitorAdapter({ prefix: 'kennelo' })
    );
}

export function InitStorage() {
    return null;
}