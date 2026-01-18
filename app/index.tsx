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
        const inTabs = segments[0] === '(tabs)';

        // If we're already in the right place, don't navigate
        if (state.completed && inTabs) return;
        if (!state.completed && inOnboarding) return;

        // Navigate to the appropriate screen
        if (!state.completed) {
            // User hasn't completed onboarding
            router.replace('/onboarding/experience-level');
        } else {
            // User has completed onboarding
            router.replace('/(tabs)/trade');
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
