import { View, Text, StyleSheet, TextInput } from 'react-native';
import { Token } from '@/types/token';
import { useState } from 'react';

interface AmountInputProps {
  token: Token;
  amount: string;
  onChangeAmount: (amount: string) => void;
}

export function AmountInput({ token, amount, onChangeAmount }: AmountInputProps) {
  const usdValue = parseFloat(amount || '0') * token.priceUSD;

  const handleChangeText = (text: string) => {
    const filtered = text.replace(/[^0-9.]/g, '');
    if (filtered.split('.').length > 2) return;
    onChangeAmount(filtered);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Send</Text>
      <View style={styles.inputContainer}>
        <View style={styles.tokenInfo}>
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>{token.icon}</Text>
            <View style={styles.statusDot} />
          </View>
          <View style={styles.amountContainer}>
            <TextInput
              style={styles.input}
              value={amount}
              onChangeText={handleChangeText}
              placeholder="0"
              placeholderTextColor="#444"
              keyboardType="decimal-pad"
            />
            <Text style={styles.usdValue}>
              ${usdValue.toFixed(2)} {token.symbol}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  inputContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  icon: {
    fontSize: 20,
  },
  statusDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00ff88',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  amountContainer: {
    flex: 1,
    gap: 2,
  },
  input: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    padding: 0,
  },
  usdValue: {
    fontSize: 13,
    color: '#888',
  },
});
