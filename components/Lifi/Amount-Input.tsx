import { View, Text, StyleSheet, TextInput, Image, TouchableOpacity } from 'react-native';
import { Token } from '@/types/token';
import { useState } from 'react';
import { DollarSign } from 'lucide-react-native';

interface AmountInputProps {
  token: Token;
  amount: string;
  onChangeAmount: (amount: string) => void;
}

export function AmountInput({ token, amount, onChangeAmount }: AmountInputProps) {
  const [imageError, setImageError] = useState(false);
  const [inputMode, setInputMode] = useState<'token' | 'usd'>('token');

  const usdValue = parseFloat(amount || '0') * token.priceUSD;
  const tokenValue = parseFloat(amount || '0') / token.priceUSD;

  const handleChangeText = (text: string) => {
    // Allow empty string for deletion
    if (text === '') {
      onChangeAmount('');
      return;
    }

    const filtered = text.replace(/[^0-9.]/g, '');
    if (filtered.split('.').length > 2) return;

    if (inputMode === 'usd') {
      // Convert USD to token amount
      const usdAmount = parseFloat(filtered || '0');
      const tokenAmount = usdAmount / token.priceUSD;
      onChangeAmount(tokenAmount.toString());
    } else {
      onChangeAmount(filtered);
    }
  };

  const displayValue = inputMode === 'usd'
    ? (amount === '' ? '' : usdValue.toFixed(2))
    : amount;

  const toggleInputMode = () => {
    setInputMode(prev => prev === 'token' ? 'usd' : 'token');
  };

  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <Text style={styles.label}>Send</Text>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={toggleInputMode}
          activeOpacity={0.7}>
          <DollarSign size={14} color={inputMode === 'usd' ? '#00ff88' : '#888'} />
          <Text style={[styles.toggleText, inputMode === 'usd' && styles.toggleTextActive]}>
            {inputMode === 'usd' ? 'USD' : token.symbol}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <View style={styles.tokenInfo}>
          <View style={styles.iconContainer}>
            {!imageError && token.logoURI ? (
              <Image
                source={{ uri: token.logoURI }}
                style={styles.tokenImage}
                onError={() => setImageError(true)}
              />
            ) : (
              <View style={styles.placeholderIcon}>
                <Text style={styles.placeholderText}>{token.symbol.charAt(0)}</Text>
              </View>
            )}
            <View style={styles.statusDot} />
          </View>
          <View style={styles.amountContainer}>
            <TextInput
              style={styles.input}
              value={displayValue}
              onChangeText={handleChangeText}
              placeholder="0"
              placeholderTextColor="#444"
              keyboardType="decimal-pad"
            />
            <Text style={styles.usdValue}>
              {inputMode === 'usd'
                ? `≈ ${parseFloat(amount || '0').toFixed(6)} ${token.symbol}`
                : `≈ $${usdValue.toFixed(2)}`
              }
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
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  toggleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
  },
  toggleTextActive: {
    color: '#00ff88',
  },
  inputContainer: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(91, 122, 255, 0.3)',
    shadowColor: '#5b7aff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  tokenInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(91, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'rgba(91, 122, 255, 0.2)',
  },
  tokenImage: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  placeholderIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#3a3a3a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#888',
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
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    padding: 0,
  },
  usdValue: {
    fontSize: 14,
    color: '#888',
  },
});
