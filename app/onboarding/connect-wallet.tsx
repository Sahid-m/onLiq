import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Wallet, Check, ArrowLeft } from 'lucide-react-native';
import { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { useAccount, useAppKit } from '@reown/appkit-react-native';

export default function ConnectWalletScreen() {
    const router = useRouter();
    const { setAuthMethod, setWalletAddress } = useOnboarding();
    const [connecting, setConnecting] = useState(false);
    const { open, disconnect } = useAppKit();
    const { address, isConnected, chainId } = useAccount();

    const handleConnectWallet = async () => {
        setConnecting(true);

        await open();

        if (isConnected) {
            setWalletAddress(address!);
        }
        setAuthMethod('wallet');
        setConnecting(false);
        router.push('/onboarding/bridge');

        // TODO: Implement actual wallet connection
        // // For now, using placeholder
        // setTimeout(async () => {
        //     const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);

        //     await setAuthMethod('wallet');
        //     await setWalletAddress(mockAddress);

        //     setConnecting(false);
        //     router.push('/onboarding/bridge');
        // }, 1500);
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.content} style={styles.scrollView}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Wallet size={48} color="#5b7aff" />
                    </View>
                    <Text style={styles.title}>Connect Your Wallet</Text>
                    <Text style={styles.subtitle}>
                        Connect to Hyperliquid to start trading
                    </Text>
                </View>

                {/* Wallet Options */}
                <View style={styles.walletsContainer}>
                    <TouchableOpacity
                        style={styles.walletOption}
                        onPress={handleConnectWallet}
                        disabled={connecting}
                        activeOpacity={0.7}>
                        <View style={styles.walletInfo}>
                            <View style={styles.walletIcon}>
                                <Text style={styles.walletIconText}>H</Text>
                            </View>
                            <View>
                                <Text style={styles.walletName}>Wallet Connect</Text>
                                <Text style={styles.walletDescription}>Connect to your wallet</Text>
                            </View>
                        </View>
                        {connecting ? (
                            <Text style={styles.connectingText}>Connecting...</Text>
                        ) : (
                            <Check size={20} color="#5b7aff" />
                        )}
                    </TouchableOpacity>

                    <View style={styles.comingSoon}>
                        <Text style={styles.comingSoonText}>More wallets coming soon</Text>
                    </View>
                </View>

                {/* Info Box */}
                <View style={styles.infoBox}>
                    <Text style={styles.infoTitle}>Why connect a wallet?</Text>
                    <Text style={styles.infoText}>
                        • Full control of your funds{'\n'}
                        • Trade directly from your wallet{'\n'}
                        • No custodial risk
                    </Text>
                </View>
            </ScrollView>
        </View>
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
        gap: 32,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
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
    walletsContainer: {
        gap: 16,
    },
    walletOption: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0f0f0f',
        borderRadius: 16,
        padding: 20,
        borderWidth: 2,
        borderColor: 'rgba(91, 122, 255, 0.3)',
    },
    walletInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    walletIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#5b7aff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    walletIconText: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    walletName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    walletDescription: {
        fontSize: 13,
        color: '#888',
    },
    connectingText: {
        fontSize: 14,
        color: '#5b7aff',
    },
    comingSoon: {
        alignItems: 'center',
        paddingVertical: 12,
    },
    comingSoonText: {
        fontSize: 13,
        color: '#666',
    },
    infoBox: {
        backgroundColor: 'rgba(91, 122, 255, 0.05)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(91, 122, 255, 0.2)',
        gap: 8,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    infoText: {
        fontSize: 14,
        color: '#aaa',
        lineHeight: 22,
    },
});
