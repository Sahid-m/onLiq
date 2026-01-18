import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { ExternalLink, CreditCard, Smartphone, Globe } from 'lucide-react-native';

export default function OnRampsScreen() {
    const onRamps = [
        {
            name: 'Moonpay',
            description: 'Buy crypto with credit card or bank transfer',
            icon: '🌙',
            url: 'https://www.moonpay.com',
            color: '#7B3FE4',
        },
        {
            name: 'Transak',
            description: 'Fast and secure fiat-to-crypto gateway',
            icon: '⚡',
            url: 'https://transak.com',
            color: '#1B4FFF',
        },
        {
            name: 'Ramp',
            description: 'Simple way to buy crypto with Apple Pay',
            icon: '🚀',
            url: 'https://ramp.network',
            color: '#00D395',
        },
    ];

    const handleOpenOnRamp = (url: string) => {
        Linking.openURL(url);
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Buy Crypto</Text>
                <Text style={styles.subtitle}>
                    Get started with crypto using these trusted on-ramp providers
                </Text>
            </View>

            {/* Info Box */}
            <View style={styles.infoBox}>
                <CreditCard size={24} color="#00ff88" />
                <View style={styles.infoContent}>
                    <Text style={styles.infoTitle}>What are on-ramps?</Text>
                    <Text style={styles.infoText}>
                        On-ramps let you buy cryptocurrency using traditional payment methods like credit cards or bank transfers.
                    </Text>
                </View>
            </View>

            {/* On-Ramp Options */}
            <View style={styles.onRampsContainer}>
                <Text style={styles.sectionTitle}>Popular On-Ramps</Text>
                {onRamps.map((onRamp, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.onRampCard}
                        onPress={() => handleOpenOnRamp(onRamp.url)}
                        activeOpacity={0.7}>
                        <View style={styles.onRampHeader}>
                            <View style={[styles.onRampIcon, { backgroundColor: onRamp.color + '20' }]}>
                                <Text style={styles.onRampEmoji}>{onRamp.icon}</Text>
                            </View>
                            <View style={styles.onRampInfo}>
                                <Text style={styles.onRampName}>{onRamp.name}</Text>
                                <Text style={styles.onRampDescription}>{onRamp.description}</Text>
                            </View>
                            <ExternalLink size={20} color="#888" />
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

            {/* How It Works */}
            <View style={styles.howItWorks}>
                <Text style={styles.sectionTitle}>How It Works</Text>
                <View style={styles.stepsList}>
                    <View style={styles.step}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>1</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Choose an on-ramp</Text>
                            <Text style={styles.stepDescription}>
                                Select your preferred provider from the list above
                            </Text>
                        </View>
                    </View>

                    <View style={styles.step}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>2</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Complete verification</Text>
                            <Text style={styles.stepDescription}>
                                Verify your identity (required by regulations)
                            </Text>
                        </View>
                    </View>

                    <View style={styles.step}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>3</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Buy crypto</Text>
                            <Text style={styles.stepDescription}>
                                Purchase crypto with your preferred payment method
                            </Text>
                        </View>
                    </View>

                    <View style={styles.step}>
                        <View style={styles.stepNumber}>
                            <Text style={styles.stepNumberText}>4</Text>
                        </View>
                        <View style={styles.stepContent}>
                            <Text style={styles.stepTitle}>Start trading</Text>
                            <Text style={styles.stepDescription}>
                                Use your crypto to trade pies on onLiq
                            </Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Tips */}
            <View style={styles.tipsBox}>
                <Globe size={20} color="#5b7aff" />
                <View style={styles.tipsContent}>
                    <Text style={styles.tipsTitle}>💡 Tips</Text>
                    <Text style={styles.tipsText}>
                        • Compare fees across different providers{'\n'}
                        • Start with a small amount to test{'\n'}
                        • Keep your wallet address handy{'\n'}
                        • Allow time for verification
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    content: {
        padding: 20,
        paddingTop: 60,
        paddingBottom: 40,
        gap: 24,
    },
    header: {
        gap: 8,
    },
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
    },
    subtitle: {
        fontSize: 16,
        color: '#888',
        lineHeight: 22,
    },
    infoBox: {
        flexDirection: 'row',
        gap: 16,
        backgroundColor: 'rgba(0, 255, 136, 0.05)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(0, 255, 136, 0.2)',
    },
    infoContent: {
        flex: 1,
        gap: 4,
    },
    infoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#00ff88',
    },
    infoText: {
        fontSize: 14,
        color: '#aaa',
        lineHeight: 20,
    },
    onRampsContainer: {
        gap: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    onRampCard: {
        backgroundColor: '#0f0f0f',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: '#1a1a1a',
    },
    onRampHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    onRampIcon: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
    },
    onRampEmoji: {
        fontSize: 28,
    },
    onRampInfo: {
        flex: 1,
        gap: 4,
    },
    onRampName: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    onRampDescription: {
        fontSize: 13,
        color: '#888',
        lineHeight: 18,
    },
    howItWorks: {
        gap: 16,
    },
    stepsList: {
        gap: 16,
    },
    step: {
        flexDirection: 'row',
        gap: 16,
    },
    stepNumber: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#5b7aff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    stepNumberText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
    stepContent: {
        flex: 1,
        gap: 4,
    },
    stepTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    stepDescription: {
        fontSize: 14,
        color: '#888',
        lineHeight: 20,
    },
    tipsBox: {
        flexDirection: 'row',
        gap: 16,
        backgroundColor: 'rgba(91, 122, 255, 0.05)',
        borderRadius: 16,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(91, 122, 255, 0.2)',
    },
    tipsContent: {
        flex: 1,
        gap: 8,
    },
    tipsTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#5b7aff',
    },
    tipsText: {
        fontSize: 14,
        color: '#aaa',
        lineHeight: 22,
    },
});
