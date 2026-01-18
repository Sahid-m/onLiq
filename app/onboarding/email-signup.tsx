import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Mail, Lock, ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';

export default function EmailSignupScreen() {
    const router = useRouter();
    const { setAuthMethod, setEmail, setWalletAddress } = useOnboarding();
    const [email, setEmailInput] = useState('');
    const [password, setPasswordInput] = useState('');
    const [confirmPassword, setConfirmPasswordInput] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const validateEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password: string) => {
        // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
        return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
    };

    const handleSignup = async () => {
        if (!email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert('Invalid Email', 'Please enter a valid email address');
            return;
        }

        if (!validatePassword(password)) {
            Alert.alert(
                'Weak Password',
                'Password must be at least 8 characters with uppercase, lowercase, and numbers'
            );
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            // TODO: Implement actual signup API call
            // For now, simulate wallet creation
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Generate a placeholder wallet address
            const walletAddress = '0x' + Math.random().toString(16).substring(2, 42);

            // Save to context
            await setAuthMethod('email');
            await setEmail(email);
            await setWalletAddress(walletAddress);

            // Show success message
            Alert.alert(
                'Account Created! 🎉',
                'We\'ve created a secure wallet for you. Your wallet address has been saved.',
                [
                    {
                        text: 'Continue',
                        onPress: () => router.push('/onboarding/tour'),
                    },
                ]
            );
        } catch (error) {
            Alert.alert('Error', 'Failed to create account. Please try again.');
        } finally {
            setLoading(false);
        }
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
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.iconContainer}>
                        <Mail size={40} color="#00ff88" />
                    </View>
                    <Text style={styles.title}>Create Your Account</Text>
                    <Text style={styles.subtitle}>
                        Sign up with email and we'll handle your wallet creation
                    </Text>
                </View>

                {/* Info Box */}
                <View style={styles.infoBox}>
                    <Text style={styles.infoText}>
                        🔐 We'll create a secure crypto wallet for you automatically. You don't need to worry about seed phrases or private keys!
                    </Text>
                </View>

                {/* Form */}
                <View style={styles.form}>
                    {/* Email Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputContainer}>
                            <Mail size={20} color="#888" />
                            <TextInput
                                style={styles.input}
                                value={email}
                                onChangeText={setEmailInput}
                                placeholder="your@email.com"
                                placeholderTextColor="#666"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <Lock size={20} color="#888" />
                            <TextInput
                                style={styles.input}
                                value={password}
                                onChangeText={setPasswordInput}
                                placeholder="Min. 8 characters"
                                placeholderTextColor="#666"
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                {showPassword ? (
                                    <EyeOff size={20} color="#888" />
                                ) : (
                                    <Eye size={20} color="#888" />
                                )}
                            </TouchableOpacity>
                        </View>
                        <Text style={styles.helperText}>
                            Must include uppercase, lowercase, and numbers
                        </Text>
                    </View>

                    {/* Confirm Password Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.inputContainer}>
                            <Lock size={20} color="#888" />
                            <TextInput
                                style={styles.input}
                                value={confirmPassword}
                                onChangeText={setConfirmPasswordInput}
                                placeholder="Re-enter password"
                                placeholderTextColor="#666"
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                                {showConfirmPassword ? (
                                    <EyeOff size={20} color="#888" />
                                ) : (
                                    <Eye size={20} color="#888" />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Signup Button */}
                    <TouchableOpacity
                        style={[styles.signupButton, loading && styles.signupButtonDisabled]}
                        onPress={handleSignup}
                        disabled={loading}
                        activeOpacity={0.8}>
                        {loading ? (
                            <ActivityIndicator color="#000" />
                        ) : (
                            <Text style={styles.signupButtonText}>Create Account</Text>
                        )}
                    </TouchableOpacity>
                </View>

                {/* Terms */}
                <Text style={styles.terms}>
                    By creating an account, you agree to our Terms of Service and Privacy Policy
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
        backgroundColor: 'rgba(0, 255, 136, 0.1)',
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
        lineHeight: 22,
    },
    infoBox: {
        backgroundColor: 'rgba(0, 255, 136, 0.05)',
        borderRadius: 12,
        padding: 16,
        borderWidth: 1,
        borderColor: 'rgba(0, 255, 136, 0.2)',
    },
    infoText: {
        fontSize: 14,
        color: '#00ff88',
        lineHeight: 20,
    },
    form: {
        gap: 20,
    },
    inputGroup: {
        gap: 8,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
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
        fontSize: 16,
        color: '#fff',
        paddingVertical: 12,
    },
    helperText: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    signupButton: {
        backgroundColor: '#00ff88',
        paddingVertical: 18,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 8,
        shadowColor: '#00ff88',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    signupButtonDisabled: {
        backgroundColor: '#2a2a2a',
        shadowOpacity: 0,
    },
    signupButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000',
    },
    terms: {
        fontSize: 12,
        color: '#666',
        textAlign: 'center',
        lineHeight: 18,
    },
});
