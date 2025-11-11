'use client';

import { Capacitor } from '@capacitor/core';
import { useEffect, useState } from 'react';

export function useCapacitor() {
    const [isNative, setIsNative] = useState(false);
    const [platform, setPlatform] = useState('web');

    useEffect(() => {
        setIsNative(Capacitor.isNativePlatform());
        setPlatform(Capacitor.getPlatform());
    }, []);

    return {
        isNative,
        platform,
        isIOS: platform === 'ios',
        isAndroid: platform === 'android',
        isWeb: platform === 'web',
    };
}