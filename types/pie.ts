// Pie Types for Backend API

export interface PieToken {
    symbol: string;
    allocation: number; // Percentage (0-100)
    direction: 'long' | 'short';
    color?: string; // Optional, for UI only
}

export interface Pie {
    id: string;
    name: string;
    description: string;
    avgReturn: number; // Percentage
    tokens: PieToken[];
    followers: number;
    minInvestment: number; // In USD
    emoji: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface PieInvestmentRequest {
    pieId: string;
    investmentAmount: number; // In USD
    customAllocations?: PieToken[]; // Optional custom allocations
    userAddress: string;
}

export interface PieInvestmentResponse {
    success: boolean;
    transactionId?: string;
    positions: {
        token: string;
        direction: 'long' | 'short';
        amount: number; // In USD
        allocation: number; // Percentage
    }[];
    totalInvested: number;
    error?: string;
}

export interface ActivePiePosition {
    id: string;
    pieId: string;
    pieName: string;
    emoji: string;
    investedAmount: number;
    currentValue: number;
    pnl: number;
    pnlPercent: number;
    tokens: PieToken[];
    investedDate: string;
    positions: {
        token: string;
        direction: 'long' | 'short';
        entryPrice: number;
        currentPrice: number;
        amount: number;
        pnl: number;
    }[];
}

// Example Backend API Endpoints

/**
 * GET /api/pies
 * Returns all available pies
 */
export interface GetPiesResponse {
    pies: Pie[];
}

/**
 * POST /api/pies/invest
 * Invests in a pie with custom or default allocations
 * 
 * Request Body: PieInvestmentRequest
 * Response: PieInvestmentResponse
 * 
 * Backend should:
 * 1. Validate allocations sum to 100%
 * 2. Check minimum investment
 * 3. For each token:
 *    - Calculate position size based on allocation
 *    - Execute long or short based on direction
 * 4. Return transaction details and positions
 */

/**
 * GET /api/pies/positions
 * Returns user's active pie positions
 */
export interface GetPositionsResponse {
    positions: ActivePiePosition[];
    totalInvested: number;
    totalValue: number;
    totalPnl: number;
    totalPnlPercent: number;
}

/**
 * Example: How backend should process investment
 * 
 * User invests $1000 in "AI Boom" pie:
 * - FET: 25% allocation, long → Open $250 long position on FET
 * - RNDR: 25% allocation, long → Open $250 long position on RNDR
 * - TAO: 20% allocation, long → Open $200 long position on TAO
 * - AGIX: 15% allocation, long → Open $150 long position on AGIX
 * - OCEAN: 15% allocation, long → Open $150 long position on OCEAN
 * 
 * If a token had direction: 'short', backend would open a short position instead.
 */
