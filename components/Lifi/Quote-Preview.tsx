import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { ArrowRight, Zap, Clock } from 'lucide-react-native';
import { Token } from '@/types/token';

interface QuotePreviewProps {
    quote: any;
    loading: boolean;
    error: string | null;
    onExecute: () => void;
    fromToken: Token;
    toToken: Token;
}

export function QuotePreview({
    quote,
    loading,
    error,
    onExecute,
    fromToken,
    toToken,
}: QuotePreviewProps) {
    if (loading) {
        return (
            <View style={styles.container}>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="small" color="#5b7aff" />
                    <Text style={styles.loadingText}>Getting best quote...</Text>
                </View>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            </View>
        );
    }

    if (!quote) {
        return null;
    }

    const formatAmount = (amount: string, decimals: number) => {
        const num = parseFloat(amount) / Math.pow(10, decimals);
        return num.toFixed(4);
    };

    const formatUSD = (value: string) => {
        const num = parseFloat(value);
        return isNaN(num) ? '$0.00' : `$${num.toFixed(2)}`;
    };

    const totalGasCost = quote.estimate?.gasCosts?.reduce((sum: number, cost: any) => {
        return sum + parseFloat(cost.amountUSD || '0');
    }, 0) || 0;

    const executionTime = quote.estimate?.executionDuration || 0;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Best Quote</Text>
                <View style={styles.badge}>
                    <Zap size={12} color="#5b7aff" />
                    <Text style={styles.badgeText}>
                        {quote.includedSteps?.length || 1} step{(quote.includedSteps?.length || 1) > 1 ? 's' : ''}
                    </Text>
                </View>
            </View>

            <View style={styles.quoteDetails}>
                <View style={styles.amountRow}>
                    <View style={styles.amountSection}>
                        <Text style={styles.amountLabel}>You send</Text>
                        <Text style={styles.amountValue}>
                            {formatAmount(quote.action.fromAmount, fromToken.decimals)} {fromToken.symbol}
                        </Text>
                    </View>

                    <ArrowRight size={16} color="#888" style={styles.arrow} />

                    <View style={styles.amountSection}>
                        <Text style={styles.amountLabel}>You receive</Text>
                        <Text style={styles.amountValue}>
                            {formatAmount(quote.estimate.toAmount, toToken.decimals)} {toToken.symbol}
                        </Text>
                    </View>
                </View>

                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Gas cost</Text>
                        <Text style={styles.statValue}>{formatUSD(totalGasCost.toString())}</Text>
                    </View>

                    {executionTime > 0 && (
                        <View style={styles.stat}>
                            <Clock size={12} color="#888" />
                            <Text style={styles.statValue}>~{Math.ceil(executionTime / 60)}m</Text>
                        </View>
                    )}

                    <View style={styles.stat}>
                        <Text style={styles.statLabel}>Via</Text>
                        <Text style={styles.statValue}>{quote.tool}</Text>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.executeButton}
                onPress={onExecute}
                activeOpacity={0.8}>
                <Text style={styles.executeButtonText}>Execute</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#0f0f0f',
        borderRadius: 16,
        padding: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#1a1a1a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    badgeText: {
        fontSize: 11,
        fontWeight: '600',
        color: '#5b7aff',
    },
    quoteDetails: {
        gap: 16,
    },
    amountRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 12,
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
    },
    amountSection: {
        flex: 1,
        gap: 4,
    },
    amountLabel: {
        fontSize: 11,
        color: '#888',
    },
    amountValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#fff',
    },
    arrow: {
        marginHorizontal: 8,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 4,
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    statLabel: {
        fontSize: 11,
        color: '#888',
    },
    statValue: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
    executeButton: {
        backgroundColor: '#5b7aff',
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 16,
    },
    executeButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        paddingVertical: 20,
    },
    loadingText: {
        fontSize: 13,
        color: '#888',
    },
    errorContainer: {
        paddingVertical: 12,
    },
    errorText: {
        fontSize: 13,
        color: '#ff6b6b',
        textAlign: 'center',
    },
});
