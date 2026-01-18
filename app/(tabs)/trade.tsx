import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TrendingUp, Users, DollarSign } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Svg, Circle } from 'react-native-svg';

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
        minInvestment: 100,
        emoji: '₿',
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
        minInvestment: 75,
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
                const strokeDasharray = `${circumference * percentage} ${circumference}`;
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
                        origin={`${radius}, ${radius}`}
                    />
                );
            })}
        </Svg>
    );
};

export default function TradeScreen() {
    const router = useRouter();

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

                {/* Stats */}
                <View style={styles.statsRow}>
                    <View style={styles.stat}>
                        <Users size={14} color="#888" />
                        <Text style={styles.statText}>{pie.followers.toLocaleString()} followers</Text>
                    </View>
                    <View style={styles.stat}>
                        <DollarSign size={14} color="#888" />
                        <Text style={styles.statText}>Min ${pie.minInvestment}</Text>
                    </View>
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
                    <Text style={styles.headerTitle}>Investment Pies</Text>
                    <Text style={styles.headerSubtitle}>Diversify with pre-built portfolios</Text>
                </View>
                <View style={styles.balanceContainer}>
                    <Text style={styles.balanceLabel}>Balance</Text>
                    <Text style={styles.balanceValue}>$1,240</Text>
                </View>
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
    balanceContainer: {
        alignItems: 'flex-end',
    },
    balanceLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    balanceValue: {
        fontSize: 20,
        fontWeight: '700',
        color: '#5b7aff',
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
});
