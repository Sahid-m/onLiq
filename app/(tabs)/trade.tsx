import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { Search, TrendingUp, Users } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import { Svg, Circle } from 'react-native-svg';
import { useAccount } from '@reown/appkit-react-native';

interface PieToken {
    symbol: string;
    allocation: number;
    color: string;
    direction: 'long' | 'short';
}

interface Pie {
    id: string;
    name: string;
    description: string;
    avgReturn: number;
    tokens: PieToken[];
    followers: number;
    minInvestment: number;
    emoji: string;
}

const PIES: Pie[] = [
    {
        id: '0',
        name: 'Bitcoin 1H Bull',
        description: '100% Bitcoin - Riding the 1-hour uptrend momentum',
        avgReturn: 12.3,
        tokens: [
            { symbol: 'BTC', allocation: 100, color: '#f7931a', direction: 'long' },
        ],
        followers: 5234,
        minInvestment: 0,
        emoji: '₿',
    },
    {
        id: '0.5',
        name: 'ETH Bear',
        description: '100% Ethereum Short - Betting on ETH downtrend',
        avgReturn: -8.5,
        tokens: [
            { symbol: 'ETH', allocation: 100, color: '#627eea', direction: 'short' },
        ],
        followers: 3421,
        minInvestment: 0,
        emoji: '🐻',
    },
    {
        id: '0.6',
        name: 'BTC Long / ETH Short',
        description: 'Long Bitcoin, Short Ethereum - Classic pair trade',
        avgReturn: 15.7,
        tokens: [
            { symbol: 'BTC', allocation: 50, color: '#f7931a', direction: 'long' },
            { symbol: 'ETH', allocation: 50, color: '#627eea', direction: 'short' },
        ],
        followers: 4892,
        minInvestment: 0,
        emoji: '⚖️',
    },
    {
        id: '0.7',
        name: 'BTC/SOL Bulls',
        description: 'Long Bitcoin and Solana - Top L1 momentum play',
        avgReturn: 22.4,
        tokens: [
            { symbol: 'BTC', allocation: 60, color: '#f7931a', direction: 'long' },
            { symbol: 'SOL', allocation: 40, color: '#00d4aa', direction: 'long' },
        ],
        followers: 6234,
        minInvestment: 0,
        emoji: '🚀',
    },
    {
        id: '1',
        name: 'AI Boom',
        description: 'Diversified exposure to leading AI and machine learning tokens',
        avgReturn: 24.5,
        tokens: [
            { symbol: 'FET', allocation: 25, color: '#5b7aff', direction: 'long' },
            { symbol: 'RNDR', allocation: 25, color: '#ff6b6b', direction: 'long' },
            { symbol: 'TAO', allocation: 20, color: '#00ff88', direction: 'long' },
            { symbol: 'AGIX', allocation: 15, color: '#ffd93d', direction: 'long' },
            { symbol: 'OCEAN', allocation: 15, color: '#a78bfa', direction: 'long' },
        ],
        followers: 2847,
        minInvestment: 50,
        emoji: '🤖',
    },
    {
        id: '2',
        name: 'DeFi Giants',
        description: 'Blue-chip DeFi protocols with proven track records',
        avgReturn: 18.2,
        tokens: [
            { symbol: 'AAVE', allocation: 30, color: '#5b7aff', direction: 'long' },
            { symbol: 'UNI', allocation: 30, color: '#ff6b6b', direction: 'long' },
            { symbol: 'MKR', allocation: 25, color: '#00ff88', direction: 'long' },
            { symbol: 'CRV', allocation: 15, color: '#ffd93d', direction: 'long' },
        ],
        followers: 3521,
        minInvestment: 100,
        emoji: '💎',
    },
    {
        id: '3',
        name: 'Layer 2 Surge',
        description: 'Scaling solutions outpacing Ethereum mainnet',
        avgReturn: 31.8,
        tokens: [
            { symbol: 'ARB', allocation: 30, color: '#5b7aff', direction: 'long' },
            { symbol: 'OP', allocation: 30, color: '#ff6b6b', direction: 'long' },
            { symbol: 'MATIC', allocation: 25, color: '#00ff88', direction: 'long' },
            { symbol: 'IMX', allocation: 15, color: '#ffd93d', direction: 'long' },
        ],
        followers: 1923,
        minInvestment: 0,
        emoji: '🚀',
    },
    {
        id: '4',
        name: 'Solana Ecosystem',
        description: 'Top performers in the Solana DeFi ecosystem',
        avgReturn: 28.4,
        tokens: [
            { symbol: 'JUP', allocation: 30, color: '#5b7aff', direction: 'long' },
            { symbol: 'JTO', allocation: 25, color: '#ff6b6b', direction: 'long' },
            { symbol: 'PYTH', allocation: 25, color: '#00ff88', direction: 'long' },
            { symbol: 'ORCA', allocation: 20, color: '#ffd93d', direction: 'long' },
        ],
        followers: 2156,
        minInvestment: 60,
        emoji: '⚡',
    },
];

const DonutChart = ({ tokens, size = 120 }: { tokens: PieToken[]; size?: number }) => {
    const radius = size / 2;
    const strokeWidth = 12;
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

export default function TradeScreen() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const { address, isConnected } = useAccount();
    const [balance, setBalance] = useState<number | null>(null);
    const [isLoadingBalance, setIsLoadingBalance] = useState(false);

    // Fetch Hyperliquid balance when wallet is connected
    useEffect(() => {
        const fetchBalance = async () => {
            if (!isConnected || !address) {
                setBalance(null);
                return;
            }

            try {
                setIsLoadingBalance(true);
                // Fetch user state from Hyperliquid API
                const response = await fetch('https://api.hyperliquid.xyz/info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'clearinghouseState',
                        user: address,
                    }),
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch balance');
                }

                const data = await response.json();
                // Extract account value from the response
                const accountValue = parseFloat(data.marginSummary.accountValue);
                setBalance(accountValue);
            } catch (error) {
                console.error('Error fetching Hyperliquid balance:', error);
                setBalance(0);
            } finally {
                setIsLoadingBalance(false);
            }
        };

        fetchBalance();
    }, [isConnected, address]);

    const handleSelectPie = (pie: Pie) => {
        router.push({
            pathname: '/pie-detail',
            params: {
                pieId: pie.id,
                pieName: pie.name,
                pieData: JSON.stringify(pie),
            },
        });
    };

    const renderPieCard = (pie: Pie) => (
        <TouchableOpacity
            key={pie.id}
            style={styles.pieCard}
            onPress={() => handleSelectPie(pie)}
            activeOpacity={0.7}>
            {/* Donut Chart */}
            <View style={styles.chartContainer}>
                <DonutChart tokens={pie.tokens} size={140} />
                <View style={styles.chartCenter}>
                    <Text style={styles.returnValue}>{pie.avgReturn}%</Text>
                    <Text style={styles.returnLabel}>Avg. return</Text>
                </View>
            </View>

            {/* Pie Info */}
            <View style={styles.pieInfo}>
                <View style={styles.pieHeader}>
                    <Text style={styles.pieEmoji}>{pie.emoji}</Text>
                    <Text style={styles.pieName}>{pie.name}</Text>
                </View>
                <Text style={styles.pieDescription}>{pie.description}</Text>

                {/* Token Tags */}
                <View style={styles.tokenList}>
                    {pie.tokens.map((token) => (
                        <View key={token.symbol} style={[styles.tokenTag, { borderColor: token.color }]}>
                            <View style={[styles.tokenDot, { backgroundColor: token.color }]} />
                            <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                            <Text style={styles.tokenAllocation}>{token.allocation}%</Text>
                        </View>
                    ))}
                </View>

                {/* Select Button */}
                <TouchableOpacity
                    style={styles.selectButton}
                    onPress={() => handleSelectPie(pie)}
                    activeOpacity={0.8}>
                    <Text style={styles.selectButtonText}>Customize & Invest</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>Explore Pies</Text>
                    <Text style={styles.headerSubtitle}>Curated crypto portfolios</Text>
                </View>
            </View>

            {/* Balance Section */}
            <View style={styles.balanceCard}>
                <View style={styles.balanceHeader}>
                    <Text style={styles.balanceLabel}>Hyperliquid Balance</Text>
                    {isLoadingBalance && <ActivityIndicator size="small" color="#5b7aff" />}
                </View>
                <View style={styles.balanceRow}>
                    <Text style={styles.balanceValue}>
                        {isConnected ? (
                            balance !== null ? `$${balance.toFixed(2)}` : '$0.00'
                        ) : (
                            'Connect Wallet'
                        )}
                    </Text>
                    {isConnected && balance !== null && balance > 0 && (
                        <View style={styles.balanceBadge}>
                            <TrendingUp size={14} color="#00ff88" />
                            <Text style={styles.balanceBadgeText}>Active</Text>
                        </View>
                    )}
                </View>
                {isConnected && address && (
                    <Text style={styles.walletAddress}>
                        {address.slice(0, 6)}...{address.slice(-4)}
                    </Text>
                )}
            </View>

            {/* Pies List */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}>
                {PIES.map(renderPieCard)}
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
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 16,
        gap: 16,
    },
    pieCard: {
        backgroundColor: '#0f0f0f',
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(91, 122, 255, 0.2)',
        gap: 20,
    },
    chartContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    chartCenter: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    returnValue: {
        fontSize: 28,
        fontWeight: '700',
        color: '#00ff88',
    },
    returnLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
    },
    pieInfo: {
        gap: 16,
    },
    pieHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    pieEmoji: {
        fontSize: 28,
    },
    pieName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        flex: 1,
    },
    pieDescription: {
        fontSize: 14,
        color: '#aaa',
        lineHeight: 20,
    },
    tokenList: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    tokenTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 10,
        borderWidth: 1.5,
    },
    tokenDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    tokenSymbol: {
        fontSize: 13,
        fontWeight: '600',
        color: '#fff',
    },
    tokenAllocation: {
        fontSize: 12,
        color: '#888',
    },
    statsRow: {
        flexDirection: 'row',
        gap: 20,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#1a1a1a',
    },
    stat: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statText: {
        fontSize: 13,
        color: '#888',
    },
    selectButton: {
        backgroundColor: '#5b7aff',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#5b7aff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    selectButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    balanceCard: {
        backgroundColor: '#1a1a1a',
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 20,
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(91, 122, 255, 0.2)',
    },
    balanceHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    balanceLabel: {
        fontSize: 14,
        color: '#888',
        fontWeight: '600',
    },
    balanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    balanceValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
    },
    balanceBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    balanceBadgeText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#00ff88',
    },
    walletAddress: {
        fontSize: 12,
        color: '#666',
        marginTop: 8,
        fontFamily: 'monospace',
    },
});
