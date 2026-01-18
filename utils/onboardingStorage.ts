import AsyncStorage from '@react-native-async-storage/async-storage';

// Storage keys
export const STORAGE_KEYS = {
    ONBOARDING_COMPLETED: 'onboarding_completed',
    USER_EXPERIENCE_LEVEL: 'user_experience_level',
    AUTH_METHOD: 'auth_method',
    WALLET_ADDRESS: 'wallet_address',
    GMAIL_USER: 'gmail_user',
    USER_NAME: 'user_name',
    EMAIL: 'email',
} as const;

export type ExperienceLevel = 'native' | 'beginner';
export type AuthMethod = 'wallet' | 'gmail' | 'email';

export interface GmailUser {
    email: string;
    name: string;
    picture?: string;
}

export interface OnboardingState {
    completed: boolean;
    experienceLevel?: ExperienceLevel;
    authMethod?: AuthMethod;
    walletAddress?: string;
    gmailUser?: GmailUser;
    userName?: string;
    email?: string;
}

// Get onboarding completion status
export async function getOnboardingCompleted(): Promise<boolean> {
    try {
        const value = await AsyncStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
        return value === 'true';
    } catch (error) {
        console.error('Error reading onboarding status:', error);
        return false;
    }
}

// Set onboarding completion status
export async function setOnboardingCompleted(completed: boolean): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, completed.toString());
    } catch (error) {
        console.error('Error saving onboarding status:', error);
    }
}

// Get experience level
export async function getExperienceLevel(): Promise<ExperienceLevel | null> {
    try {
        const value = await AsyncStorage.getItem(STORAGE_KEYS.USER_EXPERIENCE_LEVEL);
        return value as ExperienceLevel | null;
    } catch (error) {
        console.error('Error reading experience level:', error);
        return null;
    }
}

// Set experience level
export async function setExperienceLevel(level: ExperienceLevel): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.USER_EXPERIENCE_LEVEL, level);
    } catch (error) {
        console.error('Error saving experience level:', error);
    }
}

// Get auth method
export async function getAuthMethod(): Promise<AuthMethod | null> {
    try {
        const value = await AsyncStorage.getItem(STORAGE_KEYS.AUTH_METHOD);
        return value as AuthMethod | null;
    } catch (error) {
        console.error('Error reading auth method:', error);
        return null;
    }
}

// Set auth method
export async function setAuthMethod(method: AuthMethod): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.AUTH_METHOD, method);
    } catch (error) {
        console.error('Error saving auth method:', error);
    }
}

// Get wallet address
export async function getWalletAddress(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(STORAGE_KEYS.WALLET_ADDRESS);
    } catch (error) {
        console.error('Error reading wallet address:', error);
        return null;
    }
}

// Set wallet address
export async function setWalletAddress(address: string): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.WALLET_ADDRESS, address);
    } catch (error) {
        console.error('Error saving wallet address:', error);
    }
}

// Get Gmail user
export async function getGmailUser(): Promise<GmailUser | null> {
    try {
        const value = await AsyncStorage.getItem(STORAGE_KEYS.GMAIL_USER);
        return value ? JSON.parse(value) : null;
    } catch (error) {
        console.error('Error reading Gmail user:', error);
        return null;
    }
}

// Set Gmail user
export async function setGmailUser(user: GmailUser): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.GMAIL_USER, JSON.stringify(user));
    } catch (error) {
        console.error('Error saving Gmail user:', error);
    }
}

// Get email
export async function getEmail(): Promise<string | null> {
    try {
        return await AsyncStorage.getItem(STORAGE_KEYS.EMAIL);
    } catch (error) {
        console.error('Error reading email:', error);
        return null;
    }
}

// Set email
export async function setEmail(email: string): Promise<void> {
    try {
        await AsyncStorage.setItem(STORAGE_KEYS.EMAIL, email);
    } catch (error) {
        console.error('Error saving email:', error);
    }
}

// Get full onboarding state
export async function getOnboardingState(): Promise<OnboardingState> {
    try {
        const [completed, experienceLevel, authMethod, walletAddress, gmailUser, email] = await Promise.all([
            getOnboardingCompleted(),
            getExperienceLevel(),
            getAuthMethod(),
            getWalletAddress(),
            getGmailUser(),
            getEmail(),
        ]);

        return {
            completed,
            experienceLevel: experienceLevel || undefined,
            authMethod: authMethod || undefined,
            walletAddress: walletAddress || undefined,
            gmailUser: gmailUser || undefined,
            email: email || undefined,
        };
    } catch (error) {
        console.error('Error reading onboarding state:', error);
        return { completed: false };
    }
}

// Clear all onboarding data (for testing/reset)
export async function clearOnboardingData(): Promise<void> {
    try {
        await AsyncStorage.multiRemove([
            STORAGE_KEYS.ONBOARDING_COMPLETED,
            STORAGE_KEYS.USER_EXPERIENCE_LEVEL,
            STORAGE_KEYS.AUTH_METHOD,
            STORAGE_KEYS.WALLET_ADDRESS,
            STORAGE_KEYS.GMAIL_USER,
            STORAGE_KEYS.EMAIL,
        ]);
    } catch (error) {
        console.error('Error clearing onboarding data:', error);
    }
}
