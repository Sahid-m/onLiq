import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ActivityIndicator,
    ScrollView,
    Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, ArrowRight, Zap, RefreshCw } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { fetchRoutes } from '@/services/lifiService';
import { Alert } from 'react-native';

export default function RoutesScreen() {
    const router = useRouter();
    const params = useLocalSearchParams<{
        fromChainId?: string;
        fromAmount?: string;
        fromTokenAddress?: string;
        fromTokenSymbol?: string;
        toChainId?: string;
        toTokenAddress?: string;
        toTokenSymbol?: string;
    }>();

    const [routes, setRoutes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadRoutes = async () => {
        if (!params.fromChainId || !params.fromAmount || !params.fromTokenAddress ||
            !params.toChainId || !params.toTokenAddress) {
            setError('Missing required parameters');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Use Arbitrum as destination since Hyperliquid might not be supported by LiFi
            const ARBITRUM_CHAIN_ID = 42161;
            const USDC_ARBITRUM = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831';

            const response = await fetchRoutes({
                fromChainId: parseInt(params.fromChainId),
                fromAmount: params.fromAmount,
                fromTokenAddress: params.fromTokenAddress,
                toChainId: ARBITRUM_CHAIN_ID, // Always use Arbitrum
                toTokenAddress: USDC_ARBITRUM, // Always use USDC on Arbitrum
                fromAddress: "0x63ef147426D1a29808F1A5a47077488673A9282f",
                toAddress: "0x63ef147426D1a29808F1A5a47077488673A9282f"
            });

            setRoutes(response.routes || []);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to load routes';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRoutes();
    }, []);

    const handleSelectRoute = (route: any) => {
        Alert.alert('Done', `Selected route with ${route.steps.length} step(s)`);
        // TODO: Implement route execution
    };

    const formatUSD = (value: string) => {
        const num = parseFloat(value);
        return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
    };

    const formatAmount = (amount: string, decimals: number = 18) => {
        const num = parseFloat(amount) / Math.pow(10, decimals);
        return num.toFixed(4);
    };

    const renderRouteItem = ({ item, index }: { item: any; index: number }) => (
        <TouchableOpacity
            style={styles.routeCard}
            onPress={() => handleSelectRoute(item)}
            activeOpacity={0.7}>
            <View style={styles.routeHeader}>
                <View style={styles.routeBadge}>
                    <Text style={styles.routeBadgeText}>Route {index + 1}</Text>
                </View>
                <View style={styles.stepsIndicator}>
                    <Zap size={14} color="#5b7aff" />
                    <Text style={styles.stepsText}>{item.steps[0].includedSteps.length} step{item.steps[0].includedSteps.length > 1 ? 's' : ''}</Text>
                </View>
            </View>

            <View style={styles.routeAmounts}>
                <View style={styles.amountSection}>
                    <Text style={styles.amountLabel}>You send</Text>
                    <Text style={styles.amountValue}>
                        {formatAmount(item.fromAmount, item.fromToken.decimals)} {item.fromToken.symbol}
                    </Text>
                    <Text style={styles.amountUSD}>{formatUSD(item.fromAmountUSD)}</Text>
                </View>

                <ArrowRight size={20} color="#888" style={styles.arrowIcon} />

                <View style={styles.amountSection}>
                    <Text style={styles.amountLabel}>You receive</Text>
                    <Text style={styles.amountValue}>
                        {formatAmount(item.toAmount, item.toToken.decimals)} {item.toToken.symbol}
                    </Text>
                    <Text style={styles.amountUSD}>{formatUSD(item.toAmountUSD)}</Text>
                </View>
            </View>

            <View style={styles.routeFooter}>
                <View style={styles.gasCost}>
                    <Text style={styles.gasCostLabel}>Gas cost</Text>
                    <Text style={styles.gasCostValue}>{formatUSD(item.gasCostUSD)}</Text>
                </View>
                <View style={styles.selectButton}>
                    <Text style={styles.selectButtonText}>Select Route</Text>
                </View>
            </View>

            {/* Steps Preview */}
            <View style={styles.stepsPreview}>
                {item.steps.map((step: any, stepIndex: number) => (
                    <View key={step.id} style={styles.stepItem}>
                        <View style={styles.stepDot} />
                        <Text style={styles.stepText}>
                            {step.type === 'swap' ? '🔄 Swap' : '🌉 Bridge'} via {step.tool}
                        </Text>
                    </View>
                ))}
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}>
                    <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Select Route</Text>
                <View style={styles.headerRight} />
            </View>

            {/* Exchange Summary */}
            <View style={styles.summary}>
                <Text style={styles.summaryText}>
                    {params.fromTokenSymbol} → {params.toTokenSymbol}
                </Text>
            </View>

            {/* Loading State */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#5b7aff" />
                    <Text style={styles.loadingText}>Finding best routes...</Text>
                </View>
            )}

            {/* Error State */}
            {error && !loading && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorTitle}>Failed to load routes</Text>
                    <Text style={styles.errorMessage}>{error}</Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={loadRoutes}
                        activeOpacity={0.8}>
                        <RefreshCw size={18} color="#fff" />
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Routes List */}
            {!loading && !error && (
                <FlatList
                    data={routes}
                    keyExtractor={(item) => item.id}
                    renderItem={renderRouteItem}
                    contentContainerStyle={styles.routesList}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No routes found</Text>
                            <Text style={styles.emptySubtext}>
                                Try adjusting your token selection or amount
                            </Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
    },
    summary: {
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#0f0f0f',
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    summaryText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        textAlign: 'center',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 16,
    },
    loadingText: {
        fontSize: 14,
        color: '#888',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
        gap: 12,
    },
    errorTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#ff6b6b',
    },
    errorMessage: {
        fontSize: 14,
        color: '#888',
        textAlign: 'center',
    },
    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        backgroundColor: '#5b7aff',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        marginTop: 8,
    },
    retryButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    routesList: {
        padding: 16,
        gap: 12,
    },
    routeCard: {
        backgroundColor: '#0f0f0f',
        borderRadius: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: '#1a1a1a',
        gap: 16,
    },
    routeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    routeBadge: {
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 8,
    },
    routeBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#888',
    },
    stepsIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    stepsText: {
        fontSize: 12,
        color: '#5b7aff',
        fontWeight: '600',
    },
    routeAmounts: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
    },
    amountSection: {
        flex: 1,
        gap: 4,
    },
    amountLabel: {
        fontSize: 12,
        color: '#888',
    },
    amountValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    amountUSD: {
        fontSize: 13,
        color: '#666',
    },
    arrowIcon: {
        marginHorizontal: 8,
    },
    routeFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#1a1a1a',
    },
    gasCost: {
        gap: 2,
    },
    gasCostLabel: {
        fontSize: 12,
        color: '#888',
    },
    gasCostValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    selectButton: {
        backgroundColor: '#5b7aff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 10,
    },
    selectButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    stepsPreview: {
        gap: 8,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#1a1a1a',
    },
    stepItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: '#5b7aff',
    },
    stepText: {
        fontSize: 13,
        color: '#888',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 8,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    emptySubtext: {
        fontSize: 13,
        color: '#555',
        textAlign: 'center',
    },
});
