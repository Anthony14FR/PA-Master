import { useMemo } from "react";
import { useAppContainer } from "../contexts/app-container.context";
import { AppContainer } from "../../../infrastructure";

/**
 * Manage without limite repositories implementation
 * 
 * @example
 * const createRepository = useCallback((container) => {
 *   return new ProductRepository(
 *       container.resolve<HttpClient>(DI_TOKENS.HttpClient), 
 *       container.resolve<LoggerService>(DI_TOKENS.LoggerService)
 *   );
 * }, []);
 * const repository = useRepositoryFactory(createRepository);
 * 
 * @warning Factory function should be stable (use useCallback or define outside component)
 */
export function useRepositoryFactory<R>(factory: (container: AppContainer) => R): R {
    const container = useAppContainer();
    // Note: factory should be memoized by caller to avoid re-instantiation
    return useMemo(() => factory(container), [container, factory]);
}

/**
 * Instance repositories with ease
 * 
 * @example
 * const repository = useRepository(
 *   ProductRepository,
 *   [DI_TOKENS.HttpClient, DI_TOKENS.LoggerService]
 * );
 */
export function useRepository<R>(
    RepositoryClass: new (...deps: any[]) => R,
    tokens: (symbol | Function)[]
): R {
    const container = useAppContainer();

    return useMemo(() => {
        const deps = tokens.map(token => container.resolve(token));
        return new RepositoryClass(...deps);
    }, [container, RepositoryClass, tokens]);
}