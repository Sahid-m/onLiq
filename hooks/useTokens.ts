import { useState, useEffect, useCallback } from 'react';
import { Token } from '@/types/token';
import { fetchTokensWithRetry } from '@/services/lifiService';

interface UseTokensReturn {
    tokens: Token[];
    loading: boolean;
    error: string | null;
    refresh: () => Promise<void>;
}

/**
 * Custom hook to manage token fetching and state
 * Automatically fetches tokens on mount with retry logic
 * Provides loading, error states, and manual refresh function
 */
export function useTokens(): UseTokensReturn {
    const [tokens, setTokens] = useState<Token[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTokensData = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);

            const fetchedTokens = await fetchTokensWithRetry(3, 1000);
            setTokens(fetchedTokens);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load tokens';
            setError(errorMessage);
            console.error('Error in useTokens:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Fetch tokens on mount
    useEffect(() => {
        fetchTokensData();
    }, [fetchTokensData]);

    // Manual refresh function
    const refresh = useCallback(async () => {
        await fetchTokensData();
    }, [fetchTokensData]);

    return {
        tokens,
        loading,
        error,
        refresh,
    };
}
