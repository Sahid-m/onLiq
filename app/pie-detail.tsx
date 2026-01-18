import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Info } from 'lucide-react-native';
import { useState } from 'react';
import { Svg, Circle } from 'react-native-svg';
import Slider from '@react-native-community/slider';
import { createPosition, CreatePositionRequest } from '@/services/pearProtocolService';

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

const DonutChart = ({ tokens, size = 160 }: { tokens: PieToken[]; size?: number }) => {
    const radius = size / 2;
    const strokeWidth = 16;
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

export default function PieDetailScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const pieData: Pie = params.pieData ? JSON.parse(params.pieData as string) : null;

    const [allocations, setAllocations] = useState<PieToken[]>(
        pieData?.tokens || []
    );
    const [investmentAmount, setInvestmentAmount] = useState('22'); // Hardcoded to $22
    const [isCreatingPosition, setIsCreatingPosition] = useState(false);

    // Hardcoded bearer token - same as positions screen
    const PEAR_BEARER_TOKEN = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIweDYzZWYxNDc0MjZEMWEyOTgwOEYxQTVhNDcwNzc0ODg2NzNBOTI4MmYiLCJhZGRyZXNzIjoiMHg2M2VmMTQ3NDI2RDFhMjk4MDhGMUE1YTQ3MDc3NDg4NjczQTkyODJmIiwiY2xpZW50SWQiOiJQRUFSUFJPVE9DT0xVSSIsImFwcElkIjoiZWlwNzEyIiwiaWF0IjoxNzY4Njk4ODkwLCJleHAiOjE3NzEyOTA4OTAsImp0aSI6ImZkMzRmZThiLTQxNjItNDMxMy1hOWI1LWY2OWIzODcxNTVjYSIsImF1ZCI6InBlYXItcHJvdG9jb2wtY2xpZW50IiwiaXNzIjoicGVhci1wcm90b2NvbC1hcGkifQ.oMGVKgbI-6pbML0_Oy9XBVNsjPgCtjMt4xETVU8XL3-i6lYVnQL_qdPU1QdnAhr1ZoZCsvWbyblqJafc-cWxyLjr6-1eJINCOTWJekvOXbDbCrF-tUZQnET3-kS_f5WrABimfAEeL8gWizGVsM_pAV_BK2UR9_IFczJmYO8DK3KO0WxLx8ekGHXBf8-pNAku-xXfJQclT0Uz3tlTv25jAhm20xi5NRSelU1AY1QTBPnbo1H8--S_Ak7o7PiIBvPi2UDRjHjJXzCatxbqlraRmZ5SbEN-xBoCuTDWqvAAK1OG6a4pSRiwhhz0s_puchY9ckuHTxyl1OEJxo6rYD4JOA';

    if (!pieData) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Pie not found</Text>
            </View>
        );
    }

    const handleAllocationChange = (index: number, value: number) => {
        const newAllocations = [...allocations];
        newAllocations[index] = { ...newAllocations[index], allocation: value };
        setAllocations(newAllocations);
    };

    const totalAllocation = allocations.reduce((sum, token) => sum + token.allocation, 0);
    const isValid = Math.abs(totalAllocation - 100) < 0.1;

    const handleInvest = async () => {
        if (!isValid) {
            Alert.alert('Invalid Allocation', 'Allocations must sum to 100%');
            return;
        }

        const amount = parseFloat(investmentAmount);
        if (isNaN(amount) || amount < pieData.minInvestment) {
            Alert.alert('Invalid Amount', `Minimum investment is $${pieData.minInvestment}`);
            return;
        }

        try {
            setIsCreatingPosition(true);

            // Separate tokens into long and short based on direction
            const longAssets = allocations
                .filter(t => t.direction === 'long')
                .map(t => ({
                    asset: t.symbol,
                    weight: t.allocation / 100, // Convert percentage to decimal
                }));

            const shortAssets = allocations
                .filter(t => t.direction === 'short')
                .map(t => ({
                    asset: t.symbol,
                    weight: t.allocation / 100,
                }));

            // Create position request
            const positionRequest: CreatePositionRequest = {
                slippage: 0.01, // 1% slippage
                executionType: 'MARKET',
                leverage: 5, // Hardcoded leverage of 5x
                usdValue: amount,
                longAssets: longAssets.length > 0 ? longAssets : undefined,
                shortAssets: shortAssets.length > 0 ? shortAssets : undefined,
                stopLoss: null,
                takeProfit: null,
            };

            console.log('Creating position:', positionRequest);

            const result = await createPosition(PEAR_BEARER_TOKEN, positionRequest);

            console.log('Position created:', result);

            Alert.alert(
                'Success!',
                `Position created successfully!\n\nOrder ID: ${result.orderId}\nInvested: $${amount} with ${5}x leverage`,
                [
                    {
                        text: 'View Positions',
                        onPress: () => {
                            router.replace('/(tabs)/positions');
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Error creating position:', error);
            Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'Failed to create position. Please try again.'
            );
        } finally {
            setIsCreatingPosition(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Customize Pie</Text>
                <View style={styles.headerRight} />
            </View>

            <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
                {/* Donut Chart */}
                <View style={styles.chartSection}>
                    <View style={styles.chartContainer}>
                        <DonutChart tokens={allocations} size={180} />
                        <View style={styles.chartCenter}>
                            <Text style={[styles.totalValue, !isValid && styles.invalidText]}>
                                {totalAllocation.toFixed(1)}%
                            </Text>
                            <Text style={styles.totalLabel}>Total allocation</Text>
                        </View>
                    </View>
                </View>

                {/* Pie Info */}
                <View style={styles.pieInfo}>
                    <View style={styles.pieHeader}>
                        <Text style={styles.pieEmoji}>{pieData.emoji}</Text>
                        <Text style={styles.pieName}>{pieData.name}</Text>
                    </View>
                    <Text style={styles.pieDescription}>{pieData.description}</Text>
                </View>

                {/* Investment Amount */}
                <View style={styles.investmentSection}>
                    <Text style={styles.sectionTitle}>Investment Amount</Text>
                    <View style={styles.amountInputContainer}>
                        <Text style={styles.dollarSign}>$</Text>
                        <TextInput
                            style={styles.amountInput}
                            value={investmentAmount}
                            onChangeText={setInvestmentAmount}
                            keyboardType="decimal-pad"
                            placeholder="0"
                            placeholderTextColor="#666"
                        />
                    </View>
                    <Text style={styles.minInvestmentText}>
                        Minimum investment: ${pieData.minInvestment}
                    </Text>
                </View>

                {/* Allocation Sliders */}
                <View style={styles.allocationsSection}>
                    <Text style={styles.sectionTitle}>Token Allocations</Text>
                    {allocations.map((token, index) => (
                        <View key={token.symbol} style={styles.sliderContainer}>
                            <View style={styles.sliderHeader}>
                                <View style={styles.tokenInfo}>
                                    <View style={[styles.tokenDot, { backgroundColor: token.color }]} />
                                    <Text style={styles.tokenSymbol}>{token.symbol}</Text>
                                </View>
                                <Text style={styles.allocationValue}>{token.allocation.toFixed(1)}%</Text>
                            </View>
                            <Slider
                                style={styles.slider}
                                minimumValue={0}
                                maximumValue={100}
                                value={token.allocation}
                                onValueChange={(value) => handleAllocationChange(index, value)}
                                minimumTrackTintColor={token.color}
                                maximumTrackTintColor="#2a2a2a"
                                thumbTintColor={token.color}
                            />
                        </View>
                    ))}
                </View>

                {/* Warning */}
                {!isValid && (
                    <View style={styles.warningBox}>
                        <Info size={16} color="#ffd93d" />
                        <Text style={styles.warningText}>
                            Allocations must sum to 100%. Currently: {totalAllocation.toFixed(1)}%
                        </Text>
                    </View>
                )}

                {/* Invest Button */}
                <TouchableOpacity
                    style={[styles.investButton, (!isValid || isCreatingPosition) && styles.investButtonDisabled]}
                    onPress={handleInvest}
                    disabled={!isValid || isCreatingPosition}
                    activeOpacity={0.8}>
                    {isCreatingPosition ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator color="#fff" />
                            <Text style={styles.investButtonText}>Creating Position...</Text>
                        </View>
                    ) : (
                        <Text style={styles.investButtonText}>
                            Invest ${investmentAmount} (5x Leverage)
                        </Text>
                    )}
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
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        gap: 24,
    },
    chartSection: {
        alignItems: 'center',
    },
    chartContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    chartCenter: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    totalValue: {
        fontSize: 32,
        fontWeight: '700',
        color: '#00ff88',
    },
    invalidText: {
        color: '#ff6b6b',
    },
    totalLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
    pieInfo: {
        gap: 12,
    },
    pieHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    pieEmoji: {
        fontSize: 32,
    },
    pieName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
    },
    pieDescription: {
        fontSize: 14,
        color: '#aaa',
        lineHeight: 20,
    },
    investmentSection: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        paddingHorizontal: 16,
        borderWidth: 1,
        borderColor: 'rgba(91, 122, 255, 0.3)',
    },
    dollarSign: {
        fontSize: 24,
        fontWeight: '700',
        color: '#5b7aff',
        marginRight: 8,
    },
    amountInput: {
        flex: 1,
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        paddingVertical: 16,
    },
    minInvestmentText: {
        fontSize: 12,
        color: '#888',
    },
    allocationsSection: {
        gap: 16,
    },
    sliderContainer: {
        gap: 8,
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    tokenInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    tokenDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    tokenSymbol: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    allocationValue: {
        fontSize: 16,
        fontWeight: '700',
        color: '#5b7aff',
    },
    slider: {
        width: '100%',
        height: 40,
    },
    warningBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: 'rgba(255, 217, 61, 0.1)',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 217, 61, 0.3)',
    },
    warningText: {
        flex: 1,
        fontSize: 13,
        color: '#ffd93d',
        lineHeight: 18,
    },
    investButton: {
        backgroundColor: '#5b7aff',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#5b7aff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
        marginBottom: 20,
    },
    investButtonDisabled: {
        backgroundColor: '#2a2a2a',
        shadowOpacity: 0,
    },
    investButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    errorText: {
        fontSize: 16,
        color: '#ff6b6b',
        textAlign: 'center',
        marginTop: 100,
    },
});
