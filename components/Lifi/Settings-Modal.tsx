import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    ScrollView,
} from 'react-native';
import { X } from 'lucide-react-native';
import { useState } from 'react';

interface SettingsModalProps {
    visible: boolean;
    onClose: () => void;
    slippage: number;
    onSlippageChange: (value: number) => void;
}

export function SettingsModal({
    visible,
    onClose,
    slippage,
    onSlippageChange,
}: SettingsModalProps) {
    const [customSlippage, setCustomSlippage] = useState(slippage.toString());

    const presetSlippages = [0.1, 0.5, 1.0, 3.0];

    const handleSlippageSelect = (value: number) => {
        onSlippageChange(value);
        setCustomSlippage(value.toString());
    };

    const handleCustomSlippageChange = (text: string) => {
        setCustomSlippage(text);
        const value = parseFloat(text);
        if (!isNaN(value) && value >= 0 && value <= 50) {
            onSlippageChange(value);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}>
            <View style={styles.overlay}>
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Settings</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <X size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Slippage Tolerance</Text>
                            <Text style={styles.sectionDescription}>
                                Your transaction will revert if the price changes unfavorably by more than this percentage.
                            </Text>

                            <View style={styles.presetButtons}>
                                {presetSlippages.map((preset) => (
                                    <TouchableOpacity
                                        key={preset}
                                        style={[
                                            styles.presetButton,
                                            slippage === preset && styles.presetButtonActive,
                                        ]}
                                        onPress={() => handleSlippageSelect(preset)}
                                        activeOpacity={0.7}>
                                        <Text
                                            style={[
                                                styles.presetButtonText,
                                                slippage === preset && styles.presetButtonTextActive,
                                            ]}>
                                            {preset}%
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.customInputContainer}>
                                <TextInput
                                    style={styles.customInput}
                                    value={customSlippage}
                                    onChangeText={handleCustomSlippageChange}
                                    keyboardType="decimal-pad"
                                    placeholder="Custom"
                                    placeholderTextColor="#666"
                                />
                                <Text style={styles.percentSymbol}>%</Text>
                            </View>

                            {parseFloat(customSlippage) > 5 && (
                                <Text style={styles.warningText}>
                                    ⚠️ High slippage tolerance may result in unfavorable trades
                                </Text>
                            )}
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Transaction Settings</Text>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Integrator</Text>
                                <Text style={styles.infoValue}>onLiq</Text>
                            </View>
                            <View style={styles.infoRow}>
                                <Text style={styles.infoLabel}>Route Order</Text>
                                <Text style={styles.infoValue}>Recommended</Text>
                            </View>
                        </View>
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={onClose}
                        activeOpacity={0.8}>
                        <Text style={styles.saveButtonText}>Save Settings</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'flex-end',
    },
    container: {
        backgroundColor: '#0a0a0a',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '80%',
        borderWidth: 1,
        borderColor: '#1a1a1a',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
    },
    closeButton: {
        padding: 4,
    },
    content: {
        padding: 20,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 8,
    },
    sectionDescription: {
        fontSize: 13,
        color: '#888',
        marginBottom: 16,
        lineHeight: 18,
    },
    presetButtons: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
    },
    presetButton: {
        flex: 1,
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#1a1a1a',
        borderWidth: 1,
        borderColor: '#2a2a2a',
        alignItems: 'center',
    },
    presetButtonActive: {
        backgroundColor: '#5b7aff',
        borderColor: '#5b7aff',
    },
    presetButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#888',
    },
    presetButtonTextActive: {
        color: '#fff',
    },
    customInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#2a2a2a',
        paddingHorizontal: 16,
    },
    customInput: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        color: '#fff',
    },
    percentSymbol: {
        fontSize: 14,
        color: '#888',
        marginLeft: 8,
    },
    warningText: {
        fontSize: 12,
        color: '#ff6b6b',
        marginTop: 8,
    },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    infoLabel: {
        fontSize: 14,
        color: '#888',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#fff',
    },
    saveButton: {
        margin: 20,
        marginTop: 0,
        backgroundColor: '#5b7aff',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
    },
    saveButtonText: {
        fontSize: 15,
        fontWeight: '700',
        color: '#fff',
    },
});
