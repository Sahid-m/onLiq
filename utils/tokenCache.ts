import AsyncStorage from '@react-native-async-storage/async-storage';
import { Token } from '@/types/token';

const TOKEN_CACHE_KEY = '@lifi_tokens_cache';
const TOKEN_CACHE_TIMESTAMP_KEY = '@lifi_tokens_cache_timestamp';
const CACHE_EXPIRY_MS = 1000 * 60 * 60; // 1 hour

/**
 * Save tokens to AsyncStorage cache
 * @param tokens - Array of tokens to cache
 */
export async function saveTokensToCache(tokens: Token[]): Promise<void> {
    try {
        const timestamp = Date.now();
        await AsyncStorage.multiSet([
            [TOKEN_CACHE_KEY, JSON.stringify(tokens)],
            [TOKEN_CACHE_TIMESTAMP_KEY, timestamp.toString()],
        ]);
    } catch (error) {
        console.error('Failed to save tokens to cache:', error);
    }
}

/**
 * Get tokens from AsyncStorage cache
 * @returns Cached tokens or null if cache is empty/expired
 */
export async function getTokensFromCache(): Promise<Token[] | null> {
    try {
        const [[, cachedTokens], [, cachedTimestamp]] = await AsyncStorage.multiGet([
            TOKEN_CACHE_KEY,
            TOKEN_CACHE_TIMESTAMP_KEY,
        ]);

        if (!cachedTokens || !cachedTimestamp) {
            return null;
        }

        const timestamp = parseInt(cachedTimestamp, 10);
        const now = Date.now();

        // Check if cache is expired
        if (now - timestamp > CACHE_EXPIRY_MS) {
            console.log('Token cache expired');
            return null;
        }

        return JSON.parse(cachedTokens);
    } catch (error) {
        console.error('Failed to get tokens from cache:', error);
        return null;
    }
}

/**
 * Clear token cache from AsyncStorage
 */
export async function clearTokenCache(): Promise<void> {
    try {
        await AsyncStorage.multiRemove([TOKEN_CACHE_KEY, TOKEN_CACHE_TIMESTAMP_KEY]);
    } catch (error) {
        console.error('Failed to clear token cache:', error);
    }
}

/**
 * Check if token cache exists and is valid
 * @returns true if cache exists and is not expired
 */
export async function isCacheValid(): Promise<boolean> {
    try {
        const cachedTimestamp = await AsyncStorage.getItem(TOKEN_CACHE_TIMESTAMP_KEY);

        if (!cachedTimestamp) {
            return false;
        }

        const timestamp = parseInt(cachedTimestamp, 10);
        const now = Date.now();

        return now - timestamp <= CACHE_EXPIRY_MS;
    } catch (error) {
        console.error('Failed to check cache validity:', error);
        return false;
    }
}
