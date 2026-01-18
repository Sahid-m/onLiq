// Pear Protocol API Service
const PEAR_API_BASE_URL = 'https://hl-v2.pearprotocol.io';

export interface PearPosition {
    positionId: string;
    address: string;
    pearExecutionFlag: string;
    stopLoss: TpSlThreshold | null;
    takeProfit: TpSlThreshold | null;
    entryRatio: number;
    markRatio: number;
    entryPriceRatio?: number;
    markPriceRatio?: number;
    entryPositionValue: number;
    positionValue: number;
    marginUsed: number;
    unrealizedPnl: number;
    unrealizedPnlPercentage: number;
    longAssets: PositionAssetDetail[];
    shortAssets: PositionAssetDetail[];
    createdAt: string;
    updatedAt: string;
}

export interface TpSlThreshold {
    type: 'PERCENTAGE' | 'DOLLAR' | 'POSITION_VALUE' | 'PRICE' | 'PRICE_RATIO' | 'WEIGHTED_RATIO';
    value: number;
    isTrailing?: boolean;
    trailingDeltaValue?: number;
    trailingActivationValue?: number;
}

export interface PositionAssetDetail {
    coin: string;
    entryPrice: number;
    actualSize: number;
    leverage: number;
    marginUsed: number;
    positionValue: number;
    unrealizedPnl: number;
    entryPositionValue: number;
    initialWeight: number;
    fundingPaid?: number;
}

/**
 * Fetch open positions from Pear Protocol
 */
export async function fetchOpenPositions(bearerToken: string): Promise<PearPosition[]> {
    try {
        console.log('Fetching open positions from Pear Protocol...');

        const response = await fetch(`${PEAR_API_BASE_URL}/positions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
        }

        const positions: PearPosition[] = await response.json();
        console.log('Fetched positions:', positions);

        return positions;
    } catch (error) {
        console.error('Error fetching positions from Pear Protocol:', error);
        throw error;
    }
}

/**
 * Close a position
 */
export async function closePosition(
    bearerToken: string,
    positionId: string,
    executionType: 'MARKET' | 'TWAP' = 'MARKET'
): Promise<any> {
    try {
        const response = await fetch(`${PEAR_API_BASE_URL}/positions/${positionId}/close`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ executionType }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error closing position:', error);
        throw error;
    }
}

/**
 * Close all positions
 */
export async function closeAllPositions(
    bearerToken: string,
    executionType: 'MARKET' | 'TWAP' = 'MARKET'
): Promise<any> {
    try {
        const response = await fetch(`${PEAR_API_BASE_URL}/positions/close-all`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ executionType }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error closing all positions:', error);
        throw error;
    }
}

export interface CreatePositionRequest {
    slippage: number; // 0.01 = 1%
    executionType: 'MARKET' | 'TRIGGER' | 'TWAP' | 'LADDER';
    leverage: number; // 1-100
    usdValue: number; // Position size in USD
    longAssets?: Array<{ asset: string; weight?: number }>;
    shortAssets?: Array<{ asset: string; weight?: number }>;
    stopLoss?: {
        type: 'PERCENTAGE' | 'DOLLAR' | 'POSITION_VALUE';
        value: number;
    } | null;
    takeProfit?: {
        type: 'PERCENTAGE' | 'DOLLAR' | 'POSITION_VALUE';
        value: number;
    } | null;
}

/**
 * Create a new position
 */
export async function createPosition(
    bearerToken: string,
    request: CreatePositionRequest
): Promise<{ orderId: string; fills: any[] }> {
    try {
        console.log('Creating position with Pear Protocol:', request);

        const response = await fetch(`${PEAR_API_BASE_URL}/positions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${bearerToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || 'Unknown error'}`);
        }

        const result = await response.json();
        console.log('Position created successfully:', result);
        return result;
    } catch (error) {
        console.error('Error creating position:', error);
        throw error;
    }
}
