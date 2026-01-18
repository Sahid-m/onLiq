import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
            }}>
            <Stack.Screen name="experience-level" />
            <Stack.Screen name="wallet-check" />
            <Stack.Screen name="connect-wallet" />
            <Stack.Screen name="email-signup" />
            <Stack.Screen name="bridge" />
            <Stack.Screen name="tour" />
        </Stack>
    );
}
