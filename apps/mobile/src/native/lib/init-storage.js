'use client';

import { initializeStorage } from '@kennelo/core/storage/hooks/storage-provider';
import { CapacitorAdapter } from '@/adapters/capacitor.adapter';

if (typeof window !== 'undefined') {
    initializeStorage(
        new CapacitorAdapter({ prefix: 'kennelo' })
    );
}

export function InitStorage() {
    return null;
}