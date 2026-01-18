import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Settings, Wallet, ArrowRight, RefreshCw } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { TokenSelector } from './Token-selector';
import { AmountInput } from './Amount-Input';
import { QuotePreview } from './Quote-Preview';
import { SettingsModal } from './Settings-Modal';
import { useTokens } from '@/hooks/useTokens';
import { Token } from '@/types/token';
import { setTokenSelectionCallback, clearTokenSelectionCallback } from '@/lib/tokenSelectionEvent';
import { useRouter } from 'expo-router';
import { fetchQuote } from '@/services/lifiService';

export function ExchangeCard() {
  const { tokens, loading, error, refresh } = useTokens();
  const router = useRouter();
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [amount, setAmount] = useState<string>('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [quote, setQuote] = useState<any>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState(0.5); // Default 0.5%

  // Initialize tokens when data is loaded
  useEffect(() => {
    if (tokens.length > 0 && !fromToken && !toToken) {
      setFromToken(tokens[0]);
      setToToken(tokens[1] || tokens[0]);
    }
  }, [tokens, fromToken, toToken]);

  // Fetch quote when all parameters are available
  useEffect(() => {
    const getQuote = async () => {
      if (!fromToken || !toToken || !amount || parseFloat(amount) === 0 || !isWalletConnected) {
        setQuote(null);
        return;
      }

      try {
        setQuoteLoading(true);
        setQuoteError(null);

        const amountInSmallestUnit = (parseFloat(amount) * Math.pow(10, fromToken.decimals)).toString();

        const quoteData = await fetchQuote({
          fromChain: fromToken.chainId,
          toChain: toToken.chainId,
          fromToken: fromToken.address,
          toToken: toToken.address,
          fromAmount: amountInSmallestUnit,
          // TODO: Add actual wallet addresses when wallet is connected
          fromAddress: "0x63ef147426D1a29808F1A5a47077488673A9282f",
          toAddress: "0x63ef147426D1a29808F1A5a47077488673A9282f",
        });

        setQuote(quoteData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to get quote';
        setQuoteError(errorMessage);
        setQuote(null);
      } finally {
        setQuoteLoading(false);
      }
    };

    // Debounce quote fetching
    const timeoutId = setTimeout(getQuote, 500);
    return () => clearTimeout(timeoutId);
  }, [fromToken, toToken, amount, isWalletConnected]);

  const handleConnectWallet = () => {
    setIsWalletConnected(true);
    Alert.alert('Wallet Connected', 'Your wallet has been connected successfully!');
  };

  const handleDisconnectWallet = () => {
    setIsWalletConnected(false);
    setQuote(null);
    Alert.alert('Wallet Disconnected', 'Your wallet has been disconnected');
  };

  const handleSwapTokens = () => {
    if (!fromToken || !toToken) return;
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
  };

  const handleExchange = () => {
    if (!amount || parseFloat(amount) === 0) {
      Alert.alert('Invalid Amount', 'Please enter an amount to exchange');
      return;
    }
    if (!fromToken || !toToken) {
      Alert.alert('Error', 'Please select tokens to exchange');
      return;
    }

    // Convert amount to smallest unit (wei equivalent)
    const amountInSmallestUnit = (parseFloat(amount) * Math.pow(10, fromToken.decimals)).toString();

    // Navigate to routes screen with parameters
    router.push({
      pathname: '/routes-screen',
      params: {
        fromChainId: fromToken.chainId.toString(),
        fromAmount: amountInSmallestUnit,
        fromTokenAddress: fromToken.address,
        fromTokenSymbol: fromToken.symbol,
        toChainId: toToken.chainId.toString(),
        toTokenAddress: toToken.address,
        toTokenSymbol: toToken.symbol,
      },
    });
  };

  const handleExecuteQuote = () => {
    // This is called from the quote preview's execute button
    Alert.alert('Done', 'Transaction would be executed here');
  };

  // Listen for token selection events from the mobile screen
  useEffect(() => {
    setTokenSelectionCallback((token: Token, mode: string) => {
      if (mode === 'from') {
        setFromToken(token);
      } else if (mode === 'to') {
        setToToken(token);
      }
    });

    return () => {
      clearTokenSelectionCallback();
    };
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.title}>Exchange</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setShowSettings(true)}>
              <Settings size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.connectWalletHeaderButton,
                isWalletConnected && styles.connectedWalletButton,
              ]}
              onPress={isWalletConnected ? handleDisconnectWallet : handleConnectWallet}>
              <Text style={styles.connectWalletHeaderText}>
                {isWalletConnected ? 'Connected' : 'Connect'}
              </Text>
              <Wallet size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5b7aff" />
            <Text style={styles.loadingText}>Loading tokens...</Text>
          </View>
        )}

        {/* Error State */}
        {error && !loading && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Failed to load tokens</Text>
            <Text style={styles.errorMessage}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={refresh}
              activeOpacity={0.8}>
              <RefreshCw size={18} color="#fff" />
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Main Exchange UI - Only show when tokens are loaded */}
        {!loading && !error && fromToken && toToken && (
          <>
            <View style={styles.exchangeSection}>
              <View style={styles.selectors}>
                <TokenSelector
                  label="From"
                  selectedToken={fromToken}
                  tokens={tokens.filter((t) => t.id !== toToken.id)}
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
                  tokens={tokens.filter((t) => t.id !== fromToken.id)}
                  onSelectToken={setToToken}
                />
              </View>

              <AmountInput
                token={fromToken}
                amount={amount}
                onChangeAmount={setAmount}
              />

              {/* Quote Preview */}
              {isWalletConnected && fromToken && toToken && (
                <QuotePreview
                  quote={quote}
                  loading={quoteLoading}
                  error={quoteError}
                  fromToken={fromToken}
                  toToken={toToken}
                  onExecute={handleExecuteQuote}
                />
              )}
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
                  {isWalletConnected ? 'View All Routes' : 'Connect wallet'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.walletIconButton}
                activeOpacity={0.8}
                onPress={() => Alert.alert('Wallet', 'Wallet options coming soon')}>
                <Wallet size={24} color="#fff" />
              </TouchableOpacity>
            </View>
          </>
        )}

        <Text style={styles.poweredBy}>Powered by LI.FI</Text>
      </View>

      {/* Settings Modal */}
      <SettingsModal
        visible={showSettings}
        onClose={() => setShowSettings(false)}
        slippage={slippage}
        onSlippageChange={setSlippage}
      />
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
    margin: 12,
    marginTop: 50,
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(91, 122, 255, 0.2)',
    shadowColor: '#5b7aff',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    flexShrink: 0,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(91, 122, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(91, 122, 255, 0.3)',
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
    gap: 6,
    backgroundColor: 'rgba(91, 122, 255, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(91, 122, 255, 0.3)',
  },
  connectWalletHeaderText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  connectedWalletButton: {
    backgroundColor: 'rgba(0, 255, 136, 0.15)',
    borderColor: 'rgba(0, 255, 136, 0.4)',
  },
  exchangeSection: {
    gap: 8,
  },
  selectors: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'nowrap',
  },
  swapButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 28,
    flexShrink: 0,
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
    shadowColor: '#5b7aff',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
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
  loadingContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 14,
    color: '#888',
  },
  errorContainer: {
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#ff6b6b',
  },
  errorMessage: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#5b7aff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 8,
  },
  retryButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});
