/**
 * Route-related types for LiFi API
 */

import { Token } from './token';

export interface RouteStep {
    id: string;
    type: 'swap' | 'cross';
    tool: string;
    action: {
        fromChainId: number;
        toChainId: number;
        fromToken: Token;
        toToken: Token;
        fromAmount: string;
        slippage: number;
    };
    estimate: {
        fromAmount: string;
        toAmount: string;
        toAmountMin: string;
        approvalAddress: string;
        feeCosts: FeeCost[];
        gasCosts: GasCost[];
        data?: any;
    };
    integrator: string;
}

export interface FeeCost {
    name: string;
    description: string;
    percentage: string;
    token: Token;
    amount: string;
    amountUSD: string;
    included: boolean;
}

export interface GasCost {
    type: string;
    price: string;
    estimate: string;
    limit: string;
    amount: string;
    amountUSD: string;
    token: Token;
}

export interface Route {
    id: string;
    fromChainId: number;
    fromAmountUSD: string;
    fromAmount: string;
    fromToken: Token;
    toChainId: number;
    toAmountUSD: string;
    toAmount: string;
    toAmountMin: string;
    toToken: Token;
    gasCostUSD: string;
    steps: RouteStep[];
}

export interface RouteRequest {
    fromChainId: number;
    fromAmount: string;
    fromTokenAddress: string;
    toChainId: number;
    toTokenAddress: string;
    options?: {
        integrator?: string;
        slippage?: number;
        order?: 'CHEAPEST' | 'FASTEST' | 'SAFEST';
        allowSwitchChain?: boolean;
    };
}

export interface RoutesResponse {
    routes: Route[];
    errors?: any[];
}
