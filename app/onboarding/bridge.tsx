import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, Keyboard, TouchableWithoutFeedback, ActivityIndicator, Alert, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRightLeft, DollarSign, ArrowLeft, ChevronRight, Check } from 'lucide-react-native';
import { useState, useEffect, useRef } from 'react';
import { fetchRoutes } from '@/services/lifiService';
import { Token } from '@/types/token';
import { setTokenSelectionCallback, clearTokenSelectionCallback } from '@/lib/tokenSelectionEvent';
import { useAccount, useProvider } from '@reown/appkit-react-native';

export default function BridgeScreen() {
    const router = useRouter();
    const [amount, setAmount] = useState('');
    const [selectedToken, setSelectedToken] = useState<'USDC' | 'HYPE'>('USDC');
    const [fromToken, setFromToken] = useState<Token | null>(null);
    const [routes, setRoutes] = useState<any[]>([]);
    const [selectedRoute, setSelectedRoute] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { address, isConnected } = useAccount();
    const { provider } = useProvider();

    // Success animation state
    const [showSuccess, setShowSuccess] = useState(false);
    const successScale = useRef(new Animated.Value(0)).current;
    const successOpacity = useRef(new Animated.Value(0)).current;
    const checkScale = useRef(new Animated.Value(0)).current;

    // Hyperliquid chain ID and token addresses
    // Note: Hyperliquid might not be supported by LiFi yet
    // Using Arbitrum (42161) as destination for now as a workaround
    const HYPERLIQUID_CHAIN_ID = 42161; // Arbitrum - change to 998 when Hyperliquid is supported
    const USDC_ARBITRUM = '0xaf88d065e77c8cC2239327C5EDb3A432268e5831'; // USDC on Arbitrum
    const USDC_HYPERLIQUID = '0x6d1e7cde53ba9467b783cb7c530ce054'; // USDC on Hyperliquid (when supported)

    // Listen for token selection
    useEffect(() => {
        setTokenSelectionCallback((token: Token, mode: string) => {
            if (mode === 'from') {
                setFromToken(token);
                // Clear routes when token changes
                setRoutes([]);
                setSelectedRoute(null);
                setError(null);
            }
        });

        return () => {
            clearTokenSelectionCallback();
        };
    }, []);

    const handleSelectFromToken = () => {
        router.push({
            pathname: '/token-selector-screen',
            params: {
                mode: 'from',
                returnPath: '/onboarding/bridge',
            },
        });
    };

    const handleGetQuotes = async () => {
        if (!amount || !fromToken) {
            setError('Please select a token and enter an amount');
            return;
        }

        setLoading(true);
        setError(null);
        setRoutes([]);
        setSelectedRoute(null);

        try {
            // Using Arbitrum as destination since Hyperliquid might not be supported by LiFi yet
            const toTokenAddress = USDC_ARBITRUM;

            // Convert amount to wei (using the token's actual decimals)
            const amountInWei = (parseFloat(amount) * Math.pow(10, fromToken.decimals || 18)).toString();

            // Use placeholder addresses for now


            console.log('Fetching routes with params:', {
                fromChainId: fromToken.chainId,
                fromAmount: amountInWei,
                fromTokenAddress: fromToken.address,
                toChainId: HYPERLIQUID_CHAIN_ID,
                toTokenAddress: toTokenAddress,
            });
            if (!isConnected) {
                setError('Please connect your wallet first');
                return;
            }
            const routesData = await fetchRoutes({
                fromChainId: fromToken.chainId,
                fromAmount: amountInWei,
                fromTokenAddress: fromToken.address,
                toChainId: HYPERLIQUID_CHAIN_ID,
                toTokenAddress: toTokenAddress,
                fromAddress: address!,
                toAddress: address!,
            });

            console.log('Routes response:', routesData);

            if (routesData.routes && routesData.routes.length > 0) {
                setRoutes(routesData.routes);
                setSelectedRoute(routesData.routes[0]); // Auto-select first route
            } else {
                setError('No routes found for this bridge');
            }
        } catch (err) {
            console.error('Error fetching routes:', err);
            setError(err instanceof Error ? err.message : 'Failed to fetch routes. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleBridge = async () => {
        if (!selectedRoute) {
            Alert.alert('Error', 'Please select a route first');
            return;
        }

        if (!isConnected || !address) {
            Alert.alert('Error', 'Please connect your wallet first');
            return;
        }

        try {
            setLoading(true);
            Keyboard.dismiss();

            console.log('Selected route for bridge:', selectedRoute);

            // Get the first step from the route
            const step = selectedRoute.steps[0];

            console.log('Fetching transaction data for step:', step);

            // Fetch the transaction data from LiFi
            const { fetchStepTransaction } = await import('@/services/lifiService');
            const stepWithTransaction = await fetchStepTransaction(step);

            console.log('Step with transaction data:', stepWithTransaction);

            // The transactionRequest object contains the data needed to execute the transaction
            const transactionData = stepWithTransaction.transactionRequest;

            if (!transactionData) {
                throw new Error('No transaction data returned from LiFi');
            }

            console.log('Transaction data to send to wallet:', transactionData);

            // TODO: Send transactionData to wallet client for execution
            // Example structure of transactionData:
            // {
            //   from: '0x...',
            //   to: '0x...',
            //   data: '0x...',
            //   value: '0x...',
            //   gasLimit: '0x...',
            //   gasPrice: '0x...',
            //   chainId: 1
            // }

            Alert.alert(
                'Transaction Ready',
                `Transaction data prepared!\n\nTo: ${transactionData.to}\nValue: ${transactionData.value}\n\nReady to execute via wallet.`,
                [
                    {
                        text: 'Cancel',
                        style: 'cancel',
                    },
                    {
                        text: 'Execute',
                        onPress: async () => {
                            try {
                                // Execute transaction via wallet client
                                await provider?.request({ method: 'eth_sendTransaction', params: [transactionData] });

                                // Show success animation
                                playSuccessAnimation();

                                // Navigate to tour after animation
                                setTimeout(() => {
                                    router.push('/onboarding/tour');
                                }, 2500);
                            } catch (error) {
                                console.error('Transaction failed:', error);
                                Alert.alert('Transaction Failed', error instanceof Error ? error.message : 'Unknown error');
                            }
                        },
                    },
                ]
            );
        } catch (error) {
            console.error('Error preparing bridge transaction:', error);
            Alert.alert('Error', error instanceof Error ? error.message : 'Failed to prepare transaction');
        } finally {
            setLoading(false);
        }
    };

    const playSuccessAnimation = () => {
        setShowSuccess(true);

        // Animate the success overlay
        Animated.parallel([
            Animated.timing(successOpacity, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }),
            Animated.spring(successScale, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();

        // Animate the checkmark with delay
        setTimeout(() => {
            Animated.spring(checkScale, {
                toValue: 1,
                friction: 5,
                tension: 40,
                useNativeDriver: true,
            }).start();
        }, 200);
    };

    const handleSkip = () => {
        router.push('/onboarding/tour');
    };

    const formatUSD = (value: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(value);
    };

    const formatTime = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        return `${minutes}m`;
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={0}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.container}>
                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <ArrowLeft size={24} color="#fff" />
                    </TouchableOpacity>

                    <ScrollView
                        style={styles.scrollView}
                        contentContainerStyle={styles.content}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled">
                        {/* Header */}
                        <View style={styles.header}>
                            <View style={styles.iconContainer}>
                                <ArrowRightLeft size={40} color="#5b7aff" />
                            </View>
                            <Text style={styles.title}>Bridge Funds</Text>
                            <Text style={styles.subtitle}>
                                Transfer funds to Hyperliquid to start trading
                            </Text>
                        </View>

                        {/* Bridge Form */}
                        <View style={styles.formContainer}>
                            {/* From Token Selection */}
                            <View style={styles.section}>
                                <Text style={styles.label}>From Your Wallet Address : {address}</Text>
                                <TouchableOpacity
                                    style={styles.tokenSelector}
                                    onPress={handleSelectFromToken}
                                    activeOpacity={0.7}>
                                    {fromToken ? (
                                        <View style={styles.selectedToken}>
                                            <Text style={styles.tokenSymbol}>{fromToken.symbol}</Text>
                                            <Text style={styles.tokenNetwork}>{fromToken.network}</Text>
                                        </View>
                                    ) : (
                                        <Text style={styles.placeholderText}>Select token</Text>
                                    )}
                                    <ChevronRight size={20} color="#888" />
                                </TouchableOpacity>
                            </View>

                            {/* To Token Selection */}
                            <View style={styles.section}>
                                <Text style={styles.label}>To (Arbitrum)</Text>
                                <Text style={styles.helperText}>
                                    Bridging to Arbitrum (Hyperliquid not yet supported by LiFi)
                                </Text>
                                <View style={styles.tokenDisplay}>
                                    <Text style={styles.tokenDisplayText}>USDC</Text>
                                </View>
                            </View>

                            {/* Amount Input */}
                            <View style={styles.section}>
                                <Text style={styles.label}>Amount</Text>
                                <View style={styles.inputContainer}>
                                    <DollarSign size={20} color="#888" />
                                    <TextInput
                                        style={styles.input}
                                        value={amount}
                                        onChangeText={setAmount}
                                        placeholder="0.00"
                                        placeholderTextColor="#666"
                                        keyboardType="decimal-pad"
                                        returnKeyType="done"
                                        onSubmitEditing={Keyboard.dismiss}
                                    />
                                    {fromToken && (
                                        <Text style={styles.currency}>{fromToken.symbol}</Text>
                                    )}
                                </View>
                            </View>

                            {/* Get Quotes Button */}
                            <TouchableOpacity
                                style={[styles.quoteButton, (!amount || !fromToken) && styles.quoteButtonDisabled]}
                                onPress={handleGetQuotes}
                                disabled={!amount || !fromToken || loading}
                                activeOpacity={0.8}>
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.quoteButtonText}>Get Quotes</Text>
                                )}
                            </TouchableOpacity>

                            {/* Error Message */}
                            {error && (
                                <View style={styles.errorBox}>
                                    <Text style={styles.errorText}>{error}</Text>
                                </View>
                            )}

                            {/* Routes */}
                            {routes.length > 0 && (
                                <View style={styles.routesContainer}>
                                    <Text style={styles.routesTitle}>Available Routes ({routes.length})</Text>
                                    {routes.map((route, index) => {
                                        const isSelected = selectedRoute === route;
                                        const estimatedTime = route.steps.reduce((sum: number, step: any) =>
                                            sum + (step.estimate?.executionDuration || 0), 0);
                                        console.log('Route:', route);

                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                style={[styles.routeCard, isSelected && styles.routeCardSelected]}
                                                onPress={() => setSelectedRoute(route)}
                                                activeOpacity={0.7}>
                                                <View style={styles.routeHeader}>
                                                    <Text style={styles.routeName}>Route {index + 1}</Text>
                                                    <Text style={styles.routeTime}>{formatTime(estimatedTime)}</Text>
                                                </View>
                                                <View style={styles.routeDetails}>
                                                    <View style={styles.routeDetail}>
                                                        <Text style={styles.routeDetailLabel}>You send</Text>
                                                        <Text style={styles.routeDetailValue}>
                                                            {(parseFloat(amount) || 0).toFixed(4)} {fromToken?.symbol}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.routeDetail}>
                                                        <Text style={styles.routeDetailLabel}>You receive</Text>
                                                        <Text style={styles.routeDetailValue}>
                                                            {(parseFloat(route.toAmount) / Math.pow(10, 6)).toFixed(4)} {selectedToken}
                                                        </Text>
                                                    </View>
                                                    <View style={styles.routeDetail}>
                                                        <Text style={styles.routeDetailLabel}>Gas cost</Text>
                                                        <Text style={styles.routeDetailValue}>
                                                            {formatUSD(parseFloat(route.gasCostUSD || '0'))}
                                                        </Text>
                                                    </View>
                                                </View>
                                                {isSelected && (
                                                    <View style={styles.selectedBadge}>
                                                        <Text style={styles.selectedBadgeText}>Selected</Text>
                                                    </View>
                                                )}
                                            </TouchableOpacity>
                                        );
                                    })}
                                </View>
                            )}

                            {/* Bridge Button */}
                            {selectedRoute && (
                                <TouchableOpacity
                                    style={styles.bridgeButton}
                                    onPress={handleBridge}
                                    activeOpacity={0.8}>
                                    <Text style={styles.bridgeButtonText}>Bridge to Hyperliquid</Text>
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Skip Option */}
                        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
                            <Text style={styles.skipText}>Skip for now</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </TouchableWithoutFeedback>

            {/* Success Animation Overlay */}
            {showSuccess && (
                <Animated.View
                    style={[
                        styles.successOverlay,
                        {
                            opacity: successOpacity,
                        },
                    ]}>
                    <Animated.View
                        style={[
                            styles.successCard,
                            {
                                transform: [{ scale: successScale }],
                            },
                        ]}>
                        <Animated.View
                            style={[
                                styles.checkCircle,
                                {
                                    transform: [{ scale: checkScale }],
                                },
                            ]}>
                            <Check size={48} color="#fff" strokeWidth={3} />
                        </Animated.View>
                        <Text style={styles.successTitle}>Transaction Successful!</Text>
                        <Text style={styles.successMessage}>
                            Your bridge transaction has been executed successfully
                        </Text>
                    </Animated.View>
                </Animated.View>
            )}
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    backButton: {
        position: 'absolute',
        top: 50,
        left: 20,
        zIndex: 10,
        padding: 8,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingTop: 100,
        gap: 24,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 90,
        height: 90,
        borderRadius: 45,
        backgroundColor: 'rgba(91, 122, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    formContainer: {
        gap: 20,
    },
    section: {
        gap: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    tokenSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0f0f0f',
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: '#1a1a1a',
    },
    selectedToken: {
        gap: 4,
    },
    tokenSymbol: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    tokenNetwork: {
        fontSize: 13,
        color: '#888',
    },
    placeholderText: {
        fontSize: 16,
        color: '#666',
    },
    tokenOptions: {
        flexDirection: 'row',
        gap: 12,
    },
    tokenOption: {
        flex: 1,
        paddingVertical: 16,
        borderRadius: 12,
        backgroundColor: '#0f0f0f',
        borderWidth: 2,
        borderColor: '#1a1a1a',
        alignItems: 'center',
    },
    tokenOptionActive: {
        borderColor: '#5b7aff',
        backgroundColor: 'rgba(91, 122, 255, 0.1)',
    },
    tokenText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#666',
    },
    tokenTextActive: {
        color: '#5b7aff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#0f0f0f',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderWidth: 2,
        borderColor: '#1a1a1a',
    },
    input: {
        flex: 1,
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
        paddingVertical: 12,
    },
    currency: {
        fontSize: 16,
        fontWeight: '700',
        color: '#888',
    },
    quoteButton: {
        backgroundColor: '#00ff88',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    quoteButtonDisabled: {
        backgroundColor: '#2a2a2a',
    },
    quoteButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000',
    },
    errorBox: {
        backgroundColor: 'rgba(255, 107, 107, 0.1)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 107, 107, 0.3)',
    },
    errorText: {
        fontSize: 14,
        color: '#ff6b6b',
        textAlign: 'center',
    },
    routesContainer: {
        gap: 12,
    },
    routesTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    routeCard: {
        backgroundColor: '#0f0f0f',
        borderRadius: 16,
        padding: 16,
        borderWidth: 2,
        borderColor: '#1a1a1a',
        gap: 12,
    },
    routeCardSelected: {
        borderColor: '#5b7aff',
        backgroundColor: 'rgba(91, 122, 255, 0.05)',
    },
    routeHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    routeName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    routeTime: {
        fontSize: 14,
        color: '#00ff88',
    },
    routeDetails: {
        gap: 8,
    },
    routeDetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    routeDetailLabel: {
        fontSize: 13,
        color: '#888',
    },
    routeDetailValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    selectedBadge: {
        backgroundColor: '#5b7aff',
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    selectedBadgeText: {
        fontSize: 12,
        fontWeight: '700',
        color: '#fff',
    },
    bridgeButton: {
        backgroundColor: '#5b7aff',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#5b7aff',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    bridgeButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    skipButton: {
        paddingVertical: 12,
        marginTop: 8,
    },
    skipText: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
    },
    helperText: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
        lineHeight: 16,
    },
    tokenDisplay: {
        backgroundColor: '#0f0f0f',
        borderRadius: 12,
        padding: 16,
        borderWidth: 2,
        borderColor: '#5b7aff',
        alignItems: 'center',
        marginTop: 8,
    },
    tokenDisplayText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#5b7aff',
    },
    successOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    successCard: {
        backgroundColor: '#0f0f0f',
        borderRadius: 24,
        padding: 40,
        alignItems: 'center',
        gap: 20,
        borderWidth: 2,
        borderColor: '#00ff88',
        shadowColor: '#00ff88',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
        elevation: 10,
    },
    checkCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#00ff88',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#00ff88',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.6,
        shadowRadius: 12,
        elevation: 8,
    },
    successTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#fff',
        textAlign: 'center',
    },
    successMessage: {
        fontSize: 16,
        color: '#888',
        textAlign: 'center',
        lineHeight: 24,
    },
});
