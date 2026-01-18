import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { PieChart, Sliders, TrendingUp, Check } from 'lucide-react-native';
import { useOnboarding } from '@/contexts/OnboardingContext';

const TOUR_STEPS = [
    {
        icon: PieChart,
        title: 'Browse Investment Pies',
        description: 'Explore pre-built portfolios of tokens curated by experts. Each pie shows expected returns and token allocations.',
        color: '#5b7aff',
    },
    {
        icon: Sliders,
        title: 'Customize Allocations',
        description: 'Adjust token percentages to match your strategy. Use sliders to set how much of each token you want.',
        color: '#00ff88',
    },
    {
        icon: TrendingUp,
        title: 'Track Your Positions',
        description: 'Monitor all your pies in one place. See real-time P&L, returns, and performance metrics.',
        color: '#ffd93d',
    },
];

export default function TourScreen() {
    const router = useRouter();
    const { completeOnboarding } = useOnboarding();

    const handleComplete = async () => {
        await completeOnboarding();
        router.replace('/(tabs)/trade');
    };

    return (
        <View style={styles.container}>
            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>How Pies Work 🥧</Text>
                    <Text style={styles.subtitle}>
                        Diversify your portfolio with ease
                    </Text>
                </View>

                {/* Tour Steps */}
                <View style={styles.stepsContainer}>
                    {TOUR_STEPS.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <View key={index} style={styles.stepCard}>
                                <View style={[styles.stepIconContainer, { backgroundColor: `${step.color}15` }]}>
                                    <Icon size={32} color={step.color} />
                                </View>
                                <View style={styles.stepContent}>
                                    <View style={styles.stepHeader}>
                                        <Text style={styles.stepNumber}>Step {index + 1}</Text>
                                        <Text style={styles.stepTitle}>{step.title}</Text>
                                    </View>
                                    <Text style={styles.stepDescription}>{step.description}</Text>
                                </View>
                            </View>
                        );
                    })}
                </View>

                {/* Example */}
                <View style={styles.exampleBox}>
                    <Text style={styles.exampleTitle}>Example: AI Boom Pie</Text>
                    <View style={styles.exampleContent}>
                        <View style={styles.exampleRow}>
                            <Text style={styles.exampleLabel}>Investment:</Text>
                            <Text style={styles.exampleValue}>$1,000</Text>
                        </View>
                        <View style={styles.exampleRow}>
                            <Text style={styles.exampleLabel}>Tokens:</Text>
                            <Text style={styles.exampleValue}>FET, RNDR, TAO, AGIX, OCEAN</Text>
                        </View>
                        <View style={styles.exampleRow}>
                            <Text style={styles.exampleLabel}>Avg. Return:</Text>
                            <Text style={[styles.exampleValue, styles.positive]}>+24.5%</Text>
                        </View>
                    </View>
                </View>

                {/* Complete Button */}
                <TouchableOpacity style={styles.completeButton} onPress={handleComplete} activeOpacity={0.8}>
                    <Check size={24} color="#fff" />
                    <Text style={styles.completeButtonText}>Get Started</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingTop: 80,
        gap: 32,
    },
    header: {
        alignItems: 'center',
        gap: 12,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    stepsContainer: {
        gap: 16,
    },
    stepCard: {
        flexDirection: 'row',
        gap: 16,
        backgroundColor: '#0f0f0f',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(91, 122, 255, 0.2)',
    },
    stepIconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepContent: {
        flex: 1,
        gap: 8,
    },
    stepHeader: {
        gap: 4,
    },
    stepNumber: {
        fontSize: 12,
        fontWeight: '700',
        color: '#5b7aff',
        textTransform: 'uppercase',
    },
    stepTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    stepDescription: {
        fontSize: 14,
        color: '#aaa',
        lineHeight: 20,
    },
    exampleBox: {
        backgroundColor: 'rgba(91, 122, 255, 0.05)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(91, 122, 255, 0.2)',
        gap: 16,
    },
    exampleTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    exampleContent: {
        gap: 12,
    },
    exampleRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    exampleLabel: {
        fontSize: 14,
        color: '#888',
    },
    exampleValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
    positive: {
        color: '#00ff88',
    },
    completeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: '#5b7aff',
        paddingVertical: 18,
        borderRadius: 12,
        shadowColor: '#5b7aff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 20,
    },
    completeButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
});
