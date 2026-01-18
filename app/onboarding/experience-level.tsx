import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Sparkles, GraduationCap, ArrowLeft } from 'lucide-react-native';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function ExperienceLevelScreen() {
    const router = useRouter();
    const { setExperienceLevel } = useOnboarding();

    const handleSelect = async (level: 'native' | 'beginner') => {
        await setExperienceLevel(level);
        router.push('/onboarding/wallet-check');
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
                    <Text style={styles.logo}>onLiq</Text>
                    <Text style={styles.title}>Welcome! 👋</Text>
                    <Text style={styles.subtitle}>Let's personalize your experience</Text>
                </View>

                {/* Options */}
                <View style={styles.optionsContainer}>
                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={() => handleSelect('native')}
                        activeOpacity={0.7}>
                        <View style={[styles.iconContainer, styles.nativeIcon]}>
                            <Sparkles size={32} color="#5b7aff" />
                        </View>
                        <Text style={styles.optionTitle}>Crypto Native</Text>
                        <Text style={styles.optionDescription}>
                            I'm experienced with crypto trading and DeFi protocols
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.optionCard}
                        onPress={() => handleSelect('beginner')}
                        activeOpacity={0.7}>
                        <View style={[styles.iconContainer, styles.beginnerIcon]}>
                            <GraduationCap size={32} color="#00ff88" />
                        </View>
                        <Text style={styles.optionTitle}>Beginner</Text>
                        <Text style={styles.optionDescription}>
                            I'm new to crypto and want to learn about investing
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Footer */}
                <Text style={styles.footerText}>
                    Don't worry, you can always change this later
                </Text>
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
    },
    header: {
        alignItems: 'center',
        gap: 12,
    },
    logo: {
        fontSize: 36,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 20,
    },
    title: {
        fontSize: 32,
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
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nativeIcon: {
        backgroundColor: 'rgba(91, 122, 255, 0.1)',
    },
    beginnerIcon: {
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
    },
    optionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#fff',
    },
    optionDescription: {
        fontSize: 14,
        color: '#aaa',
        textAlign: 'center',
        lineHeight: 20,
    },
    footerText: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
    },
});
