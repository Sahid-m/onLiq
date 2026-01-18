import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator, RefreshControl } from 'react-native';
import { TrendingUp, DollarSign, RotateCcw } from 'lucide-react-native';
import { Svg, Circle } from 'react-native-svg';
import { useRouter } from 'expo-router';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useState, useEffect } from 'react';
import { fetchOpenPositions, PearPosition, closePosition } from '@/services/pearProtocolService';

// TODO: Replace with actual bearer token from user authentication
const PEAR_BEARER_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIweDYzZWYxNDc0MjZEMWEyOTgwOEYxQTVhNDcwNzc0ODg2NzNBOTI4MmYiLCJhZGRyZXNzIjoiMHg2M2VmMTQ3NDI2RDFhMjk4MDhGMUE1YTQ3MDc3NDg4NjczQTkyODJmIiwiY2xpZW50SWQiOiJQRUFSUFJPVE9DT0xVSSIsImFwcElkIjoiZWlwNzEyIiwiaWF0IjoxNzY4Njk4ODkwLCJleHAiOjE3NzEyOTA4OTAsImp0aSI6ImZkMzRmZThiLTQxNjItNDMxMy1hOWI1LWY2OWIzODcxNTVjYSIsImF1ZCI6InBlYXItcHJvdG9jb2wtY2xpZW50IiwiaXNzIjoicGVhci1wcm90b2NvbC1hcGkifQ.oMGVKgbI-6pbML0_Oy9XBVNsjPgCtjMt4xETVU8XL3-i6lYVnQL_qdPU1QdnAhr1ZoZCsvWbyblqJafc-cWxyLjr6-1eJINCOTWJekvOXbDbCrF-tUZQnET3-kS_f5WrABimfAEeL8gWizGVsM_pAV_BK2UR9_IFczJmYO8DK3KO0WxLx8ekGHXBf8-pNAku-xXfJQclT0Uz3tlTv25jAhm20xi5NRSelU1AY1QTBPnbo1H8--S_Ak7o7PiIBvPi2UDRjHjJXzCatxbqlraRmZ5SbEN-xBoCuTDWqvAAK1OG6a4pSRiwhhz0s_puchY9ckuHTxyl1OEJxo6rYD4JOA';

interface PieToken {
    symbol: string;
    allocation: number;
    color: string;
    direction: 'long' | 'short';
}

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
    const [positions, setPositions] = useState<PearPosition[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch positions on mount
    useEffect(() => {
        loadPositions();
    }, []);

    const loadPositions = async () => {
        try {
            setLoading(true);
            setError(null);
            const fetchedPositions = await fetchOpenPositions(PEAR_BEARER_TOKEN);
            setPositions(fetchedPositions);
        } catch (err) {
            console.error('Error loading positions:', err);
            setError(err instanceof Error ? err.message : 'Failed to load positions');
        } finally {
            setLoading(false);
        }
    };

    const handleRefresh = async () => {
        setRefreshing(true);
        await loadPositions();
        setRefreshing(false);
    };

    const handleClosePosition = async (positionId: string, positionName: string) => {
        Alert.alert(
            'Close Position',
            `Are you sure you want to close ${positionName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Close',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await closePosition(PEAR_BEARER_TOKEN, positionId);
                            Alert.alert('Success', 'Position closed successfully');
                            loadPositions(); // Refresh positions
                        } catch (err) {
                            Alert.alert('Error', err instanceof Error ? err.message : 'Failed to close position');
                        }
                    },
                },
            ]
        );
    };

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

    // Helper function to generate colors for tokens
    const getTokenColor = (index: number): string => {
        const colors = ['#5b7aff', '#ff6b6b', '#00ff88', '#ffd93d', '#a78bfa', '#ff9f43', '#ee5a6f', '#4ecdc4'];
        return colors[index % colors.length];
    };

    // Transform Pear position to display format
    const transformPosition = (position: PearPosition) => {
        const tokens: PieToken[] = [
            ...position.longAssets.map((asset, index) => ({
                symbol: asset.coin,
                allocation: asset.initialWeight * 100,
                color: getTokenColor(index),
                direction: 'long' as const,
            })),
            ...position.shortAssets.map((asset, index) => ({
                symbol: asset.coin,
                allocation: asset.initialWeight * 100,
                color: getTokenColor(position.longAssets.length + index),
                direction: 'short' as const,
            })),
        ];

        return {
            id: position.positionId,
            name: `${position.longAssets.map(a => a.coin).join('/')} vs ${position.shortAssets.map(a => a.coin).join('/')}`,
            emoji: '📊',
            investedAmount: position.marginUsed,
            currentValue: position.positionValue,
            pnl: position.unrealizedPnl,
            pnlPercent: position.unrealizedPnlPercentage,
            tokens,
            investedDate: new Date(position.createdAt).toISOString().split('T')[0],
        };
    };

    // Calculate totals from Pear positions
    const totalInvested = positions.reduce((sum, pos) => sum + pos.marginUsed, 0);
    const totalValue = positions.reduce((sum, pos) => sum + pos.positionValue, 0);
    const totalPnl = positions.reduce((sum, pos) => sum + pos.unrealizedPnl, 0);
    const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

    const renderPiePosition = (position: PearPosition) => {
        const pie = transformPosition(position);
        return (
            <TouchableOpacity
                key={pie.id}
                style={styles.pieCard}
                onPress={() => router.push(`/pie-detail?id=${pie.id}`)}
                activeOpacity={0.8}>
                <View style={styles.pieHeader}>
                    <View style={styles.pieInfo}>
                        <View style={styles.pieTitleRow}>
                            <Text style={styles.pieEmoji}>{pie.emoji}</Text>
                            <Text style={styles.pieName}>{pie.name}</Text>
                        </View>
                        <View style={styles.tokenList}>
                            {pie.tokens.map((token: PieToken) => (
                                <View key={token.symbol} style={[styles.tokenTag, { borderColor: token.color }]}>
                                    <View style={[styles.tokenDot, { backgroundColor: token.color }]} />
                                    <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                                    <Text style={styles.tokenDirection}>({token.direction})</Text>
                                </View>
                            ))}
                        </View>
                    </View>
                    <SmallDonutChart tokens={pie.tokens} />
                </View>

                <View style={styles.statsGrid}>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Invested</Text>
                        <Text style={styles.statValue}>${pie.investedAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Current</Text>
                        <Text style={styles.statValue}>${pie.currentValue.toFixed(2)}</Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>P&L</Text>
                        <Text style={[styles.statValue, pie.pnl > 0 ? styles.profit : styles.loss]}>
                            {pie.pnl > 0 ? '+' : ''}${pie.pnl.toFixed(2)}
                        </Text>
                    </View>
                    <View style={styles.statItem}>
                        <Text style={styles.statLabel}>Return</Text>
                        <Text style={[styles.statValue, pie.pnl > 0 ? styles.profit : styles.loss]}>
                            {pie.pnl > 0 ? '+' : ''}{pie.pnlPercent.toFixed(1)}%
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.closeButton}
                    onPress={(e) => {
                        e.stopPropagation();
                        handleClosePosition(position.positionId, pie.name);
                    }}
                    activeOpacity={0.7}>
                    <Text style={styles.closeButtonText}>Close Position</Text>
                </TouchableOpacity>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>My Positions</Text>
                    <Text style={styles.headerSubtitle}>{positions.length} active positions</Text>
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
                        <Text style={styles.summaryValue}>${totalInvested.toFixed(2)}</Text>
                    </View>
                    <View style={styles.summaryItem}>
                        <Text style={styles.summaryLabel}>Current Value</Text>
                        <Text style={styles.summaryValue}>${totalValue.toFixed(2)}</Text>
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

            {/* Loading State */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#5b7aff" />
                    <Text style={styles.loadingText}>Loading positions...</Text>
                </View>
            )}

            {/* Error State */}
            {error && !loading && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                    <TouchableOpacity style={styles.retryButton} onPress={loadPositions}>
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Positions List */}
            {!loading && !error && (
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.content}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#5b7aff" />
                    }>
                    {positions.length > 0 ? (
                        positions.map(renderPiePosition)
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyText}>No Active Positions</Text>
                            <Text style={styles.emptySubtext}>Create a position to get started</Text>
                        </View>
                    )}
                </ScrollView>
            )}
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
    pieTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    pieEmoji: {
        fontSize: 24,
        marginRight: 8,
    },
    tokenDirection: {
        fontSize: 10,
        color: '#888',
        marginLeft: 4,
    },
    closeButton: {
        backgroundColor: '#ff4444',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 12,
        alignItems: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        color: '#888',
        fontSize: 14,
        marginTop: 12,
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
    },
    errorText: {
        color: '#ff4444',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 16,
    },
    retryButton: {
        backgroundColor: '#5b7aff',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
});
