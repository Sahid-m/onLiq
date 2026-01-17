import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
  TextInput,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Token } from '@/types/token';
import { ChevronDown, X, Search, ArrowLeft } from 'lucide-react-native';
import { useState, useMemo, useEffect } from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

interface TokenSelectorProps {
  label: string;
  selectedToken: Token;
  tokens: Token[];
  onSelectToken: (token: Token) => void;
}

// Define available networks
const NETWORKS = [
  { id: 'all', name: 'All networks', icon: '🌐' },
  { id: 'ethereum', name: 'Ethereum', icon: '⟠' },
  { id: 'solana', name: 'Solana', icon: '◎' },
  { id: 'arbitrum', name: 'Arbitrum', icon: '🔷' },
  { id: 'base', name: 'Base', icon: '🔵' },
  { id: 'hyperliquid', name: 'Hyperliquid', icon: '💎' },
  { id: 'hyperevm', name: 'HyperEVM', icon: '⚡' },
  { id: 'monad', name: 'Monad', icon: '🔮' },
  { id: 'bsc', name: 'BSC', icon: '🟡' },
  { id: 'bitcoin', name: 'Bitcoin', icon: '₿' },
  { id: 'sui', name: 'Sui', icon: '💧' },
  { id: 'optimism', name: 'Optimism', icon: '🔴' },
  { id: 'polygon', name: 'Polygon', icon: '🟣' },
];

export function TokenSelector({
  label,
  selectedToken,
  tokens,
  onSelectToken,
}: TokenSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const { width } = useWindowDimensions();
  const router = useRouter();
  const params = useLocalSearchParams();

  // Determine if we should use desktop layout (two panels side by side)
  const isDesktop = width >= 768;
  // Use navigation on mobile, modal on desktop
  const useMobileNavigation = Platform.OS !== 'web' && !isDesktop;

  // Handle token selection from navigation
  useEffect(() => {
    if (params.selectedToken && typeof params.selectedToken === 'string') {
      try {
        const token = JSON.parse(params.selectedToken);
        onSelectToken(token);
        // Clear the param
        router.setParams({ selectedToken: undefined });
      } catch (e) {
        console.error('Failed to parse selected token:', e);
      }
    }
  }, [params.selectedToken]);

  const handleOpenSelector = () => {
    if (useMobileNavigation) {
      // Navigate to the token selector screen
      router.push({
        pathname: '/token-selector-screen',
        params: {
          mode: label.toLowerCase(),
          currentTokenId: selectedToken.id,
          excludeTokenId: tokens.find((t) => t.id !== selectedToken.id)?.id,
        },
      });
    } else {
      // Use modal on desktop
      setModalVisible(true);
    }
  };

  const handleSelectToken = (token: Token) => {
    onSelectToken(token);
    setModalVisible(false);
    setSearchQuery('');
    setSelectedNetwork('all');
  };

  // Filter tokens based on search query and selected network
  const filteredTokens = useMemo(() => {
    return tokens.filter((token) => {
      const matchesSearch =
        token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        token.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesNetwork =
        selectedNetwork === 'all' ||
        token.network.toLowerCase() === selectedNetwork.toLowerCase();

      return matchesSearch && matchesNetwork;
    });
  }, [tokens, searchQuery, selectedNetwork]);

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={handleOpenSelector}
          activeOpacity={0.7}>
          <View style={styles.tokenInfo}>
            <View style={styles.iconContainer}>
              <Text style={styles.icon}>{selectedToken.icon}</Text>
              <View style={styles.statusDot} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.tokenName}>{selectedToken.symbol}</Text>
              <Text style={styles.network}>{selectedToken.network}</Text>
            </View>
          </View>
          <ChevronDown size={20} color="#888" />
        </TouchableOpacity>
      </View>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        presentationStyle="overFullScreen"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <Pressable
            style={[
              styles.modalContent,
              isDesktop && styles.modalContentDesktop,
            ]}
            onPress={(e) => e.stopPropagation()}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <View style={styles.headerLeft}>
                <TouchableOpacity
                  onPress={() => setModalVisible(false)}
                  style={styles.backButton}>
                  <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.modalTitle}>Exchange from</Text>
              </View>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.connectWalletButton}>
                <Text style={styles.connectWalletText}>Connect wallet</Text>
                <View style={styles.walletIcon}>
                  <Text style={styles.walletIconText}>👛</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Two-panel layout */}
            <View style={[styles.panelContainer, isDesktop && styles.panelContainerDesktop]}>
              {/* Left Panel - Token Selection */}
              <View style={[styles.leftPanel, isDesktop && styles.leftPanelDesktop]}>
                {/* Search Input */}
                <View style={styles.searchContainer}>
                  <Search size={20} color="#888" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search by token or address"
                    placeholderTextColor="#666"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                  />
                </View>

                {/* Token List */}
                <FlatList
                  data={filteredTokens}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.tokenItem,
                        item.id === selectedToken.id && styles.tokenItemSelected,
                      ]}
                      onPress={() => handleSelectToken(item)}
                      activeOpacity={0.7}>
                      <View style={styles.tokenItemLeft}>
                        <View style={styles.tokenItemIconContainer}>
                          <Text style={styles.tokenItemIcon}>{item.icon}</Text>
                        </View>
                        <View style={styles.tokenItemTextContainer}>
                          <Text style={styles.tokenItemName}>{item.symbol}</Text>
                          <Text style={styles.tokenItemAddress}>
                            {item.network}
                          </Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>

              {/* Right Panel - Network Selection */}
              <View style={[styles.rightPanel, isDesktop && styles.rightPanelDesktop]}>
                {/* Search Network Input */}
                <View style={styles.searchContainer}>
                  <Search size={20} color="#888" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search network"
                    placeholderTextColor="#666"
                  />
                </View>

                {/* Network List */}
                <FlatList
                  data={NETWORKS}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.networkItem,
                        selectedNetwork === item.id && styles.networkItemSelected,
                      ]}
                      onPress={() => setSelectedNetwork(item.id)}
                      activeOpacity={0.7}>
                      <View style={styles.networkItemLeft}>
                        <Text style={styles.networkIcon}>{item.icon}</Text>
                        <Text style={styles.networkName}>{item.name}</Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            </View>
          </Pressable>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 12,
  },
  selectorButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  textContainer: {
    gap: 2,
  },
  tokenName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  network: {
    fontSize: 13,
    color: '#888',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#0a0a0a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    width: '100%',
    maxHeight: '95%',
    overflow: 'hidden',
  },
  modalContentDesktop: {
    borderRadius: 16,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    width: '90%',
    maxWidth: 1000,
    height: '85%',
    maxHeight: 700,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1a1a1a',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  connectWalletButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  connectWalletText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  walletIcon: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletIconText: {
    fontSize: 14,
  },
  panelContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  panelContainerDesktop: {
    flexDirection: 'row',
  },
  leftPanel: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    borderRightWidth: 0,
    borderRightColor: '#1a1a1a',
  },
  leftPanelDesktop: {
    borderRightWidth: 1,
  },
  rightPanel: {
    flex: 1,
    backgroundColor: '#0a0a0a',
    display: 'none',
  },
  rightPanelDesktop: {
    display: 'flex',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#fff',
    padding: 0,
  },
  tokenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 3,
  },
  tokenItemSelected: {
    backgroundColor: '#2a2540',
  },
  tokenItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tokenItemIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tokenItemIcon: {
    fontSize: 24,
  },
  tokenItemTextContainer: {
    gap: 4,
  },
  tokenItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  tokenItemAddress: {
    fontSize: 13,
    color: '#888',
  },
  networkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 2,
  },
  networkItemSelected: {
    backgroundColor: '#2a2540',
  },
  networkItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  networkIcon: {
    fontSize: 24,
    width: 32,
    textAlign: 'center',
  },
  networkName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  modalBackdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: -1,
  },
});
