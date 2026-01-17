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
          // fromAddress: walletAddress,
          // toAddress: walletAddress,
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

    // If quote is available and user clicked execute from quote preview
    if (quote && isWalletConnected) {
      Alert.alert('Done', 'Transaction would be executed here');
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
                  onExecute={handleExchange}
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
