import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { TrendingUp, DollarSign, RotateCcw } from 'lucide-react-native';
import { Svg, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/OnboardingContext';

interface PieToken {
    symbol: string;
    allocation: number;
    color: string;
    direction: 'long' | 'short';
}

interface ActivePie {
    id: string;
    name: string;
    emoji: string;
    investedAmount: number;
    currentValue: number;
    pnl: number;
    pnlPercent: number;
    tokens: PieToken[];
    investedDate: string;
}

const ACTIVE_PIES: ActivePie[] = [
    {
        id: '1',
        name: 'AI Boom',
        emoji: '🤖',
        investedAmount: 500,
        currentValue: 623,
        pnl: 123,
        pnlPercent: 24.6,
        tokens: [
            { symbol: 'FET', allocation: 25, color: '#5b7aff', direction: 'long' },
            { symbol: 'RNDR', allocation: 25, color: '#ff6b6b', direction: 'long' },
            { symbol: 'TAO', allocation: 20, color: '#00ff88', direction: 'long' },
            { symbol: 'AGIX', allocation: 15, color: '#ffd93d', direction: 'long' },
            { symbol: 'OCEAN', allocation: 15, color: '#a78bfa', direction: 'long' },
        ],
        investedDate: '2024-01-10',
    },
    {
        id: '2',
        name: 'Layer 2 Surge',
        emoji: '🚀',
        investedAmount: 300,
        currentValue: 387,
        pnl: 87,
        pnlPercent: 29.0,
        tokens: [
            { symbol: 'ARB', allocation: 30, color: '#5b7aff', direction: 'long' },
            { symbol: 'OP', allocation: 30, color: '#ff6b6b', direction: 'long' },
            { symbol: 'MATIC', allocation: 25, color: '#00ff88', direction: 'long' },
            { symbol: 'IMX', allocation: 15, color: '#ffd93d', direction: 'long' },
        ],
        investedDate: '2024-01-05',
    },
];

const SmallDonutChart = ({ tokens, size = 60 }: { tokens: PieToken[]; size?: number }) => {
    const radius = size / 2;
    const strokeWidth = 6;
    const innerRadius = radius - strokeWidth / 2;
    const circumference = 2 * Math.PI * innerRadius;

    let currentOffset = 0;

    return (
        <Svg width={size} height={size}>
            {tokens.map((token, index) => {
                const percentage = token.allocation / 100;
                const strokeDasharray = `${circumference * percentage} ${circumference} `;
                const strokeDashoffset = -currentOffset;
                currentOffset += circumference * percentage;

                return (
                    <Circle
                        key={index}
                        cx={radius}
                        cy={radius}
                        r={innerRadius}
                        stroke={token.color}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        rotation="-90"
                        origin={`${radius}, ${radius} `}
                    />
                );
            })}
        </Svg>
    );
};

export default function PositionsScreen() {
    const router = useRouter();
    const { resetOnboarding } = useOnboarding();

    const handleResetOnboarding = async () => {
        Alert.alert(
            'Reset Onboarding',
            'This will clear all onboarding data and restart the onboarding flow. Continue?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Reset',
                    style: 'destructive',
                    onPress: async () => {
                        await resetOnboarding();
                        router.replace('/');
                    },
                },
            ]
        );
    };

    const totalInvested = ACTIVE_PIES.reduce((sum, pie) => sum + pie.investedAmount, 0);
    const totalValue = ACTIVE_PIES.reduce((sum, pie) => sum + pie.currentValue, 0);
    const totalPnl = totalValue - totalInvested;
    const totalPnlPercent = (totalPnl / totalInvested) * 100;

    const renderPiePosition = (pie: ActivePie) => (
        <TouchableOpacity key={pie.id} style={styles.pieCard} activeOpacity={0.7}>
            <View style={styles.cardHeader}>
                <View style={styles.chartSection}>
                    <SmallDonutChart tokens={pie.tokens} size={70} />
                </View>

                <View style={styles.pieInfo}>
                    <View style={styles.pieHeader}>
                        <Text style={styles.emoji}>{pie.emoji}</Text>
                        <Text style={styles.pieName}>{pie.name}</Text>
                    </View>

                    <View style={styles.tokenList}>
                        {pie.tokens.map((token) => (
                            <View key={token.symbol} style={[styles.tokenTag, { borderColor: token.color }]}>
                                <View style={[styles.tokenDot, { backgroundColor: token.color }]} />
                                <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                            </View>
                        ))}
                    </View>
                </View>
            </View>

            <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Invested</Text>
                    <Text style={styles.statValue}>${pie.investedAmount}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Current</Text>
                    <Text style={styles.statValue}>${pie.currentValue}</Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>P&L</Text>
                    <Text style={[styles.statValue, pie.pnl > 0 ? styles.profit : styles.loss]}>
                        {pie.pnl > 0 ? '+' : ''}${pie.pnl}
                    </Text>
                </View>
                <View style={styles.statItem}>
                    <Text style={styles.statLabel}>Return</Text>
                    <Text style={[styles.statValue, pie.pnl > 0 ? styles.profit : styles.loss]}>
                        {pie.pnl > 0 ? '+' : ''}{pie.pnlPercent.toFixed(1)}%
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>My Pies</Text>
                    <Text style={styles.headerSubtitle}>{ACTIVE_PIES.length} active investments</Text>
                </View>
                <TouchableOpacity
                    style={styles.resetButton}
                    onPress={handleResetOnboarding}
                    activeOpacity={0.7}>
                    <RotateCcw size={20} color="#888" />
                </TouchableOpacity>
            </View>

            {/* Portfolio Summary */}
            <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total Invested</Text>
                        <Text style={styles.summaryValue}>${totalInvested}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Current Value</Text>
                        <Text style={styles.summaryValue}>${totalValue}</Text>
                    </View>
                </View>
                <View style={styles.summaryDivider} />
                <View style={styles.summaryRow}>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Total P&L</Text>
                        <Text style={[styles.summaryPnl, totalPnl > 0 ? styles.profit : styles.loss]}>
                            {totalPnl > 0 ? '+' : ''}${totalPnl.toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Return</Text>
                        <Text style={[styles.summaryPnl, totalPnl > 0 ? styles.profit : styles.loss]}>
                            {totalPnl > 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%
                        </Text>
                    </View>
                </View>
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {ACTIVE_PIES.length > 0 ? (
                    ACTIVE_PIES.map(renderPiePosition)
                ) : (
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No Active Pies</Text>
                        <Text style={styles.emptySubtext}>Invest in a pie to get started</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    resetButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(136, 136, 136, 0.1)',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#888',
    },
    summaryCard: {
        backgroundColor: '#0f0f0f',
        margin: 16,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(91, 122, 255, 0.2)',
        gap: 16,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    summaryItem: {
        flex: 1,
    },
    summaryLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 6,
    },
    summaryValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    summaryPnl: {
        fontSize: 24,
        fontWeight: '700',
    },
    summaryDivider: {
        height: 1,
        backgroundColor: '#1a1a1a',
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
        gap: 12,
    },
    pieCard: {
        backgroundColor: '#0f0f0f',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(91, 122, 255, 0.2)',
        gap: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        gap: 16,
    },
    chartSection: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    pieInfo: {
        flex: 1,
        gap: 12,
    },
    pieHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    emoji: {
        fontSize: 24,
    },
    pieName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    tokenList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 6,
    },
    tokenTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
        borderWidth: 1,
    },
    tokenDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
    },
    tokenSymbol: {
        fontSize: 11,
        fontWeight: '600',
        color: '#fff',
    },
    statsGrid: {
        flexDirection: 'row',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#1a1a1a',
    },
    statItem: {
        flex: 1,
        gap: 4,
    },
    statLabel: {
        fontSize: 11,
        color: '#888',
    },
    statValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
    profit: {
        color: '#00ff88',
    },
    loss: {
        color: '#ff6b6b',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 8,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#666',
    },
    emptySubtext: {
        fontSize: 14,
        color: '#555',
    },
});
