import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
    getOnboardingState,
    setOnboardingCompleted as saveOnboardingCompleted,
    setExperienceLevel as saveExperienceLevel,
    setAuthMethod as saveAuthMethod,
    setWalletAddress as saveWalletAddress,
    setGmailUser as saveGmailUser,
    setEmail as saveEmail,
    clearOnboardingData,
    ExperienceLevel,
    AuthMethod,
    GmailUser,
    OnboardingState,
} from '@/utils/onboardingStorage';

interface OnboardingContextType {
    state: OnboardingState;
    loading: boolean;
    setExperienceLevel: (level: ExperienceLevel) => Promise<void>;
    setAuthMethod: (method: AuthMethod) => Promise<void>;
    setWalletAddress: (address: string) => Promise<void>;
    setGmailUser: (user: GmailUser) => Promise<void>;
    setEmail: (email: string) => Promise<void>;
    completeOnboarding: () => Promise<void>;
    resetOnboarding: () => Promise<void>;
    isAuthenticated: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<OnboardingState>({ completed: false });
    const [loading, setLoading] = useState(true);

    // Load onboarding state on mount
    useEffect(() => {
        loadOnboardingState();
    }, []);

    const loadOnboardingState = async () => {
        try {
            const savedState = await getOnboardingState();
            setState(savedState);
        } catch (error) {
            console.error('Error loading onboarding state:', error);
        } finally {
            setLoading(false);
        }
    };

    const setExperienceLevel = async (level: ExperienceLevel) => {
        await saveExperienceLevel(level);
        setState((prev) => ({ ...prev, experienceLevel: level }));
    };

    const setAuthMethod = async (method: AuthMethod) => {
        await saveAuthMethod(method);
        setState((prev) => ({ ...prev, authMethod: method }));
    };

    const setWalletAddress = async (address: string) => {
        await saveWalletAddress(address);
        setState((prev) => ({ ...prev, walletAddress: address }));
    };

    const setGmailUser = async (user: GmailUser) => {
        await saveGmailUser(user);
        setState((prev) => ({ ...prev, gmailUser: user }));
    };

    const setEmail = async (email: string) => {
        await saveEmail(email);
        setState((prev) => ({ ...prev, email }));
    };

    const completeOnboarding = async () => {
        await saveOnboardingCompleted(true);
        setState((prev) => ({ ...prev, completed: true }));
    };

    const resetOnboarding = async () => {
        await clearOnboardingData();
        setState({ completed: false });
    };

    const isAuthenticated = !!(state.walletAddress || state.gmailUser);

    const value: OnboardingContextType = {
        state,
        loading,
        setExperienceLevel,
        setAuthMethod,
        setWalletAddress,
        setGmailUser,
        setEmail,
        completeOnboarding,
        resetOnboarding,
        isAuthenticated,
    };

    return <OnboardingContext.Provider value={value}>{children}</OnboardingContext.Provider>;
}

export function useOnboarding() {
    const context = useContext(OnboardingContext);
    if (context === undefined) {
        throw new Error('useOnboarding must be used within OnboardingProvider');
    }
    return context;
}
