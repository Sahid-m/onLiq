import { Token } from '@/types/token';

// Simple event emitter for token selection
type TokenSelectionCallback = (token: Token, mode: string) => void;

let tokenSelectionCallback: TokenSelectionCallback | null = null;

export function setTokenSelectionCallback(callback: TokenSelectionCallback) {
    tokenSelectionCallback = callback;
}

export function clearTokenSelectionCallback() {
    tokenSelectionCallback = null;
}

export function notifyTokenSelection(token: Token, mode: string) {
    if (tokenSelectionCallback) {
        tokenSelectionCallback(token, mode);
    }
}
