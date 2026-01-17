import { Token } from '@/types/token';
import { getNetworkName } from '@/utils/chainMapping';
import { saveTokensToCache, getTokensFromCache } from '@/utils/tokenCache';

const LIFI_API_BASE_URL = 'https://li.quest/v1';
const REQUEST_TIMEOUT_MS = 10000; // 10 seconds

/**
 * LiFi API token response structure
 */
interface LiFiToken {
    address: string;
    symbol: string;
    decimals: number;
    chainId: number;
    name: string;
    coinKey?: string;
    priceUSD: string;
    logoURI: string;
}

/**
 * LiFi API response structure - tokens grouped by chain ID
 */
interface LiFiTokensResponse {
    [chainId: string]: LiFiToken[];
}

/**
 * Fetch tokens from LiFi API with timeout
 * @param timeoutMs - Request timeout in milliseconds
 * @returns Promise that resolves with the response or rejects on timeout
 */
async function fetchWithTimeout(
    url: string,
    timeoutMs: number = REQUEST_TIMEOUT_MS
): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'Accept': 'application/json',
            },
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

/**
 * Transform LiFi API token to our Token interface
 * @param lifiToken - Token from LiFi API
 * @returns Transformed token
 */
function transformLiFiToken(lifiToken: LiFiToken): Token {
    return {
        id: `${lifiToken.chainId}-${lifiToken.address}`,
        name: lifiToken.name,
        symbol: lifiToken.symbol,
        network: getNetworkName(lifiToken.chainId),
        logoURI: lifiToken.logoURI,
        balance: 0, // Balance will be fetched separately when wallet is connected
        priceUSD: parseFloat(lifiToken.priceUSD) || 0,
        address: lifiToken.address,
        chainId: lifiToken.chainId,
        decimals: lifiToken.decimals,
        coinKey: lifiToken.coinKey,
    };
}

/**
 * Fetch all tokens from LiFi API
 * @param useCache - Whether to try cache first (default: true)
 * @returns Array of tokens
 * @throws Error if fetch fails and no cache is available
 */
export async function fetchTokens(useCache: boolean = true): Promise<Token[]> {
    // Try to get from cache first
    if (useCache) {
        const cachedTokens = await getTokensFromCache();
        if (cachedTokens && cachedTokens.length > 0) {
            console.log(`Loaded ${cachedTokens.length} tokens from cache`);
            return cachedTokens;
        }
    }

    try {
        console.log('Fetching tokens from LiFi API...');
        const response = await fetchWithTimeout(`${LIFI_API_BASE_URL}/tokens`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }


        const data = await response.json();
        const tokensData: LiFiTokensResponse = data.tokens


        // Flatten the chain-grouped response into a single array
        const tokens: Token[] = [];
        for (const chainId in tokensData) {
            const chainTokens = tokensData[chainId];
            if (Array.isArray(chainTokens)) {
                chainTokens.forEach((lifiToken) => {
                    tokens.push(transformLiFiToken(lifiToken));
                });
            }
        }

        console.log(`Fetched ${tokens.length} tokens from LiFi API`);

        // Save to cache
        await saveTokensToCache(tokens);

        return tokens;
    } catch (error) {
        console.error('Error fetching tokens from LiFi API:', error);

        // Try to fall back to cache even if useCache was false
        const cachedTokens = await getTokensFromCache();
        if (cachedTokens && cachedTokens.length > 0) {
            console.log('Falling back to cached tokens after fetch error');
            return cachedTokens;
        }

        // If no cache available, throw the error
        throw new Error(
            `Failed to fetch tokens: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}

/**
 * Fetch tokens with retry logic
 * @param maxRetries - Maximum number of retry attempts (default: 3)
 * @param retryDelay - Initial delay between retries in ms (default: 1000)
 * @returns Array of tokens
 */
export async function fetchTokensWithRetry(
    maxRetries: number = 3,
    retryDelay: number = 1000
): Promise<Token[]> {
    let lastError: Error | null = null;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            // Only use cache on first attempt
            return await fetchTokens(attempt === 1);
        } catch (error) {
            lastError = error instanceof Error ? error : new Error('Unknown error');
            console.log(`Fetch attempt ${attempt}/${maxRetries} failed:`, lastError.message);

            // Don't wait after the last attempt
            if (attempt < maxRetries) {
                // Exponential backoff
                const delay = retryDelay * Math.pow(2, attempt - 1);
                console.log(`Retrying in ${delay}ms...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }

    // All retries failed
    throw lastError || new Error('Failed to fetch tokens after multiple attempts');
}

/**
 * Fetch routes for a token exchange
 * @param request - Route request parameters
 * @returns Routes response with available routes
 */
export async function fetchRoutes(request: {
    fromChainId: number;
    fromAmount: string;
    fromTokenAddress: string;
    toChainId: number;
    toTokenAddress: string;
    fromAddress?: string;
    toAddress?: string;
}): Promise<any> {
    try {
        console.log('Fetching routes from LiFi API...', request);

        const requestBody = {
            fromChainId: request.fromChainId,
            fromAmount: request.fromAmount,
            fromTokenAddress: request.fromTokenAddress,
            toChainId: request.toChainId,
            toTokenAddress: request.toTokenAddress,
            fromAddress: request.fromAddress,
            toAddress: request.toAddress,
            options: {
                integrator: 'onLiq',
                slippage: 0.005, // 0.5% slippage
                order: 'RECOMMENDED',
                allowSwitchChain: true,
            },
        };

        const response = await fetch(`${LIFI_API_BASE_URL}/advanced/routes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Routes response:', data.routes[0].steps[0].includedSteps.length);
        console.log(`Fetched ${data.routes?.length || 0} routes from LiFi API`);

        return data;
    } catch (error) {
        console.error('Error fetching routes from LiFi API:', error);
        throw new Error(
            `Failed to fetch routes: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}

/**
 * Fetch a quote for a token exchange
 * @param request - Quote request parameters
 * @returns Quote with transaction details
 */
export async function fetchQuote(request: {
    fromChain: string | number;
    toChain: string | number;
    fromToken: string;
    toToken: string;
    fromAmount: string;
    fromAddress?: string;
    toAddress?: string;
}): Promise<any> {
    try {
        console.log('Fetching quote from LiFi API...', request);

        const params = new URLSearchParams({
            fromChain: request.fromChain.toString(),
            toChain: request.toChain.toString(),
            fromToken: request.fromToken,
            toToken: request.toToken,
            fromAmount: request.fromAmount,
            integrator: 'onLiq',
            slippage: '0.005',
        });

        if (request.fromAddress) {
            params.append('fromAddress', request.fromAddress);
        }
        if (request.toAddress) {
            params.append('toAddress', request.toAddress);
        }

        const response = await fetch(`${LIFI_API_BASE_URL}/quote?${params.toString()}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched quote from LiFi API');

        return data;
    } catch (error) {
        console.error('Error fetching quote from LiFi API:', error);
        throw new Error(
            `Failed to fetch quote: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
    }
}
