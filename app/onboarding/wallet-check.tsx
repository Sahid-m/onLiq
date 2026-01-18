import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Wallet, Mail, ArrowLeft } from 'lucide-react-native';

export default function WalletCheckScreen() {
    const router = useRouter();

    const handleHasWallet = () => {
        router.push('/onboarding/connect-wallet');
    };

    const handleNoWallet = () => {
        router.push('/onboarding/email-signup');
    };

    return (
        <View style={styles.container}>
            {/* Back Button */}
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                <ArrowLeft size={24} color="#fff" />
            </TouchableOpacity>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Do you have a crypto wallet?</Text>
                    <Text style={styles.subtitle}>
                        We'll help you get set up either way
                    </Text>
                </View>

                {/* Options */}
                <View style={styles.optionsContainer}>
                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={handleHasWallet}
                        activeOpacity={0.7}>
                        <View style={[styles.iconContainer, styles.walletIcon]}>
                            <Wallet size={32} color="#5b7aff" />
                        </View>
                        <Text style={styles.optionTitle}>Yes, I have a wallet</Text>
                        <Text style={styles.optionDescription}>
                            Connect your existing crypto wallet to get started
                        </Text>
                        <View style={styles.button}>
                            <Text style={styles.buttonText}>Connect Wallet</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={handleNoWallet}
                        activeOpacity={0.7}>
                        <View style={[styles.iconContainer, styles.gmailIcon]}>
                            <Mail size={32} color="#00ff88" />
                        </View>
                        <Text style={styles.optionTitle}>No, I'm new to crypto</Text>
                        <Text style={styles.optionDescription}>
                            Sign up with email and we'll create a wallet for you
                        </Text>
                        <View style={[styles.button, styles.secondaryButton]}>
                            <Text style={styles.buttonText}>Sign Up with Email</Text>
                        </View>
                    </TouchableOpacity>
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
        gap: 40,
        paddingBottom: 40,
    },
    header: {
        alignItems: 'center',
        gap: 12,
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
    optionsContainer: {
        gap: 16,
    },
    optionCard: {
        backgroundColor: '#0f0f0f',
        borderRadius: 20,
        padding: 24,
        borderWidth: 2,
        borderColor: 'rgba(91, 122, 255, 0.2)',
        alignItems: 'center',
        gap: 16,
    },
    iconContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        alignItems: 'center',
        justifyContent: 'center',
    },
    walletIcon: {
        backgroundColor: 'rgba(91, 122, 255, 0.1)',
    },
    gmailIcon: {
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
    },
    optionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    optionDescription: {
        fontSize: 14,
        color: '#aaa',
        textAlign: 'center',
        lineHeight: 20,
    },
    button: {
        backgroundColor: '#5b7aff',
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: 12,
        marginTop: 8,
    },
    secondaryButton: {
        backgroundColor: '#00ff88',
    },
    buttonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
    },
});
