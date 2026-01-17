import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { Settings, Wallet, ArrowRight } from 'lucide-react-native';
import { useState } from 'react';
import { TokenSelector } from './Token-selector';
import { AmountInput } from './Amount-Input';
import { MOCK_TOKENS } from '@/data/mockToken';
import { Token } from '@/types/token';

export function ExchangeCard() {
  const [fromToken, setFromToken] = useState<Token>(MOCK_TOKENS[0]);
  const [toToken, setToToken] = useState<Token>(MOCK_TOKENS[1]);
  const [amount, setAmount] = useState<string>('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  const handleConnectWallet = () => {
    setIsWalletConnected(true);
    Alert.alert('Wallet Connected', 'Your wallet has been connected successfully!');
  };

  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleExchange = () => {
    if (!amount || parseFloat(amount) === 0) {
      Alert.alert('Invalid Amount', 'Please enter an amount to exchange');
      return;
    }
    Alert.alert(
      'Exchange Initiated',
      `Exchanging ${amount} ${fromToken.symbol} to ${toToken.symbol}`
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Exchange</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => Alert.alert('Settings', 'Settings page coming soon')}>
              <Settings size={24} color="#fff" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.connectWalletHeaderButton}
              onPress={handleConnectWallet}>
              <Text style={styles.connectWalletHeaderText}>Connect wallet</Text>
              <Wallet size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.exchangeSection}>
          <View style={styles.selectors}>
            <TokenSelector
              label="From"
              selectedToken={fromToken}
              tokens={MOCK_TOKENS.filter((t) => t.id !== toToken.id)}
              onSelectToken={setFromToken}
            />
            <TouchableOpacity
              style={styles.swapButton}
              onPress={handleSwapTokens}
              activeOpacity={0.7}>
              <ArrowRight size={20} color="#fff" />
            </TouchableOpacity>
            <TokenSelector
              label="To"
              selectedToken={toToken}
              tokens={MOCK_TOKENS.filter((t) => t.id !== fromToken.id)}
              onSelectToken={setToToken}
            />
          </View>

          <AmountInput
            token={fromToken}
            amount={amount}
            onChangeAmount={setAmount}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[
              styles.connectButton,
              isWalletConnected && styles.exchangeButton,
            ]}
            onPress={isWalletConnected ? handleExchange : handleConnectWallet}
            activeOpacity={0.8}>
            <Text style={styles.connectButtonText}>
              {isWalletConnected ? 'Exchange' : 'Connect wallet'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.walletIconButton}
            activeOpacity={0.8}
            onPress={() => Alert.alert('Wallet', 'Wallet options coming soon')}>
            <Wallet size={24} color="#fff" />
          </TouchableOpacity>
        </View>

        <Text style={styles.poweredBy}>Powered by LI.FI</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  card: {
    backgroundColor: '#0f0f0f',
    margin: 16,
    marginTop: 60,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
  },
  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#5b7aff',
  },
  connectWalletHeaderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  connectWalletHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  exchangeSection: {
    gap: 8,
  },
  selectors: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  swapButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  connectButton: {
    flex: 1,
    backgroundColor: '#5b7aff',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exchangeButton: {
    backgroundColor: '#5b7aff',
  },
  connectButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  walletIconButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#2a3a7a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  poweredBy: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 16,
  },
});
