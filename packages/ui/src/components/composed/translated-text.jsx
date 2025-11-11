'use client';

import { Skeleton } from '@kennelo/ui/components/shadcn/skeleton';
import { useTranslationContext } from '@kennelo/i18n/contexts/translation-context';
import { useMemo } from 'react';

/**
 * Composant qui affiche un skeleton pendant le chargement des traductions
 * @param {Object} props
 * @param {Function} props.t - Fonction de traduction depuis useTranslation
 * @param {string} props.tKey - Clé de traduction (ex: "dashboard.title")
 * @param {Object} props.params - Paramètres pour interpolation
 * @param {string} props.as - Element HTML (default: "span")
 * @param {string} props.className - Classes CSS
 * @param {string} props.skeletonClassName - Classes CSS pour le skeleton
 * @param {number} props.skeletonWidth - Largeur du skeleton en pixels
 */
export function TranslatedText({
    t,
    tKey,
    params = {},
    as: Component = 'span',
    className = '',
    skeletonClassName = '',
    skeletonWidth = 100,
    ...props
}) {
    const { loading } = useTranslationContext();

    const estimatedWidth = useMemo(() => {
        if (skeletonWidth) return skeletonWidth;
        return Math.min(tKey.length * 8, 200);
    }, [tKey, skeletonWidth]);

    if (loading) {
        return (
            <Skeleton
                as="span"
                className={skeletonClassName || className}
                style={{
                    width: `${estimatedWidth}px`,
                    height: '1.2em',
                    display: 'inline-block'
                }}
            />
        );
    }

    const translatedText = t(tKey, params);

    return (
        <Component className={className} {...props}>
            {translatedText}
        </Component>
    );
}

/**
 * Hook personnalisé qui retourne la fonction `t` wrapper avec TranslatedText
 */
export function useTranslatedText() {
    const { loading } = useTranslationContext();

    return {
        loading,
        T: TranslatedText
    };
}
