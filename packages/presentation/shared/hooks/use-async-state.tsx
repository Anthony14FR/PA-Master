"use client"
import { useState, useCallback } from 'react';

export interface AsyncState<T> {
  data: T | undefined;
  isLoading: boolean;
  error: string | undefined;
}

/**
 * Hook for managing async operation states (loading, error)
 * 
 * @example
 * const { execute, isLoading, error } = useAsyncState();
 * 
 * const fetchData = async (id: number) => {
 *   const result = await execute(() => repository.findById(id));
 *   return result;
 * };
 */
export function useAsyncState() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const execute = useCallback(async <T,>(callback: () => Promise<T>): Promise<T | undefined> => {
    setIsLoading(true);
    setError(undefined);

    try {
      const result = await callback();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      return undefined;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setIsLoading(false);
    setError(undefined);
  }, []);

  return { execute, isLoading, error, reset };
}
