/**
 * Chain ID to network name mapping
 * Based on common EVM and non-EVM chain IDs
 */

export const CHAIN_ID_TO_NETWORK: Record<number, string> = {
    1: 'Ethereum',
    10: 'Optimism',
    56: 'BSC',
    100: 'Gnosis',
    137: 'Polygon',
    250: 'Fantom',
    324: 'zkSync Era',
    1101: 'Polygon zkEVM',
    8453: 'Base',
    42161: 'Arbitrum',
    43114: 'Avalanche',
    59144: 'Linea',
    534352: 'Scroll',
    // Solana
    1151111081099710: 'Solana',
    // Add more chains as needed
};

/**
 * Get human-readable network name from chain ID
 * @param chainId - The chain ID from the token
 * @returns Network name or 'Unknown Network' if not found
 */
export function getNetworkName(chainId: number): string {
    return CHAIN_ID_TO_NETWORK[chainId] || `Chain ${chainId}`;
}

/**
 * Get all supported network names
 * @returns Array of unique network names
 */
export function getSupportedNetworks(): string[] {
    return Array.from(new Set(Object.values(CHAIN_ID_TO_NETWORK)));
}
