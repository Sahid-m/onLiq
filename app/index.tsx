import { useEffect } from 'react';
import { useRouter, useSegments } from 'expo-router';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function Index() {
    const router = useRouter();
    const segments = useSegments();
    const { state, loading } = useOnboarding();

    useEffect(() => {
        if (loading) return;

        const inOnboarding = segments[0] === 'onboarding';

        if (!state.completed && !inOnboarding) {
            // User hasn't completed onboarding, redirect to onboarding
            setTimeout(() => {
                router.replace('/onboarding/experience-level');
            }, 100);
        } else if (state.completed && !inOnboarding) {
            // User has completed onboarding, redirect to main app
            setTimeout(() => {
                router.replace('/(tabs)/trade');
            }, 100);
        }
    }, [state.completed, loading, segments]);

    // Always show loading indicator while determining where to navigate
    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#5b7aff" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
