import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    TextInput,
    Platform,
    ScrollView,
    Modal,
    Image,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Search, ArrowLeft, ChevronDown, X, RefreshCw } from 'lucide-react-native';
import { useState, useMemo } from 'react';
import { Token } from '@/types/token';
import { useTokens } from '@/hooks/useTokens';
import { notifyTokenSelection } from '@/lib/tokenSelectionEvent';

// Define available networks
const NETWORKS = [
    { id: 'all', name: 'All Networks', icon: '🌐' },
    { id: 'ethereum', name: 'Ethereum', icon: '⟠' },
    { id: 'polygon', name: 'Polygon', icon: '🟣' },
    { id: 'optimism', name: 'Optimism', icon: '🔴' },
    { id: 'arbitrum', name: 'Arbitrum', icon: '🔷' },
    { id: 'base', name: 'Base', icon: '🔵' },
    { id: 'hyperliquid', name: 'Hyperliquid', icon: '💎' },
    { id: 'hyperevm', name: 'HyperEVM', icon: '⚡' },
    { id: 'bsc', name: 'BSC', icon: '🟡' },
    { id: 'solana', name: 'Solana', icon: '◎' },
];

export default function TokenSelectorScreen() {
    const router = useRouter();
    const { tokens, loading, error, refresh } = useTokens();
    const params = useLocalSearchParams<{
        mode?: string;
        currentTokenId?: string;
        excludeTokenId?: string;
        onSelect?: string;
    }>();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedNetwork, setSelectedNetwork] = useState('all');
    const [showNetworks, setShowNetworks] = useState(false);
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

    const mode = params.mode || 'from';
    const excludeTokenId = params.excludeTokenId;

    // Filter available tokens
    const availableTokens = useMemo(() => {
        return tokens.filter((token) => token.id !== excludeTokenId);
    }, [tokens, excludeTokenId]);

    // Filter tokens based on search query and selected network
    const filteredTokens = useMemo(() => {
        return availableTokens.filter((token) => {
            const matchesSearch =
                token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                token.name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesNetwork =
                selectedNetwork === 'all' ||
                token.network.toLowerCase() === selectedNetwork.toLowerCase();

            return matchesSearch && matchesNetwork;
        });
    }, [availableTokens, searchQuery, selectedNetwork]);

    const handleSelectToken = (token: Token) => {
        // Notify via event emitter
        notifyTokenSelection(token, mode);
        // Navigate back
        router.back();
    };

    const selectedNetworkName =
        NETWORKS.find((n) => n.id === selectedNetwork)?.name || 'All networks';

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={styles.backButton}>
                    <ArrowLeft size={24} color="#fff" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>
                    Exchange {mode === 'from' ? 'from' : 'to'}
                </Text>
                <View style={styles.headerRight} />
            </View>

            {/* Search Input */}
            <View style={styles.searchContainer}>
                <Search size={20} color="#888" />
                <TextInput
                    style={styles.searchInput}
                    placeholder="Search by token or address"
                    placeholderTextColor="#666"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    autoFocus={true}
                />
            </View>

            {/* Network Filter */}
            <TouchableOpacity
                style={styles.networkFilterButton}
                onPress={() => setShowNetworks(!showNetworks)}
                activeOpacity={0.7}>
                <View style={styles.networkFilterLeft}>
                    <Text style={styles.networkFilterLabel}>Network</Text>
                    <Text style={styles.networkFilterValue}>{selectedNetworkName}</Text>
                </View>
                <ChevronDown
                    size={20}
                    color="#888"
                    style={{
                        transform: [{ rotate: showNetworks ? '180deg' : '0deg' }],
                    }}
                />
            </TouchableOpacity>

            {/* Network List Modal (Scrollable) */}
            <Modal
                visible={showNetworks}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setShowNetworks(false)}>
                <View style={styles.networkModalOverlay}>
                    <View style={styles.networkModalContent}>
                        <View style={styles.networkModalHeader}>
                            <Text style={styles.networkModalTitle}>Select Network</Text>
                            <TouchableOpacity onPress={() => setShowNetworks(false)}>
                                <X size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                        <ScrollView
                            style={styles.networkScrollView}
                            showsVerticalScrollIndicator={false}>
                            {NETWORKS.map((network) => (
                                <TouchableOpacity
                                    key={network.id}
                                    style={[
                                        styles.networkItem,
                                        selectedNetwork === network.id && styles.networkItemSelected,
                                    ]}
                                    onPress={() => {
                                        setSelectedNetwork(network.id);
                                        setShowNetworks(false);
                                    }}
                                    activeOpacity={0.7}>
                                    <Text style={styles.networkIcon}>{network.icon}</Text>
                                    <Text style={styles.networkName}>{network.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                </View>
            </Modal>

            {/* Token List */}
            {loading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#5b7aff" />
                    <Text style={styles.loadingText}>Loading tokens...</Text>
                </View>
            )}

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

            {!loading && !error && (
                <FlatList
                    data={filteredTokens}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.tokenListContent}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.tokenItem}
                            onPress={() => handleSelectToken(item)}
                            activeOpacity={0.7}>
                            <View style={styles.tokenItemLeft}>
                                <View style={styles.tokenItemIconContainer}>
                                    {!imageErrors.has(item.id) && item.logoURI ? (
                                        <Image
                                            source={{ uri: item.logoURI }}
                                            style={styles.tokenItemImage}
                                            onError={() => setImageErrors(prev => new Set(prev).add(item.id))}
                                        />
                                    ) : (
                                        <View style={styles.tokenItemPlaceholder}>
                                            <Text style={styles.tokenItemPlaceholderText}>
                                                {item.symbol.charAt(0)}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.tokenItemTextContainer}>
                                    <Text style={styles.tokenItemName}>{item.symbol}</Text>
                                    <Text style={styles.tokenItemNetwork}>{item.network}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Text style={styles.emptyText}>No tokens found</Text>
                        </View>
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0a0a0a',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 60 : 20,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    backButton: {
        padding: 8,
        marginLeft: -8,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
        flex: 1,
        textAlign: 'center',
    },
    headerRight: {
        width: 40,
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
    networkFilterButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 14,
        marginHorizontal: 16,
        marginBottom: 8,
    },
    networkFilterLeft: {
        flex: 1,
    },
    networkFilterLabel: {
        fontSize: 12,
        color: '#888',
        marginBottom: 4,
    },
    networkFilterValue: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
    networkModalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.9)',
        justifyContent: 'flex-end',
    },
    networkModalContent: {
        backgroundColor: '#0f0f0f',
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        maxHeight: '70%',
        paddingBottom: Platform.OS === 'ios' ? 34 : 20,
    },
    networkModalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    networkModalTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    networkScrollView: {
        maxHeight: 400,
    },
    networkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#1a1a1a',
    },
    networkItemSelected: {
        backgroundColor: '#2a2540',
    },
    networkIcon: {
        fontSize: 24,
        width: 32,
        textAlign: 'center',
    },
    networkName: {
        fontSize: 15,
        fontWeight: '500',
        color: '#fff',
    },
    tokenListContent: {
        paddingHorizontal: 16,
        paddingBottom: 20,
    },
    tokenItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 16,
        borderRadius: 12,
        marginVertical: 3,
        backgroundColor: '#0f0f0f',
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
        overflow: 'hidden',
    },
    tokenItemImage: {
        width: 44,
        height: 44,
        borderRadius: 22,
    },
    tokenItemPlaceholder: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#2a2a2a',
        alignItems: 'center',
        justifyContent: 'center',
    },
    tokenItemPlaceholderText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#888',
    },
    tokenItemTextContainer: {
        gap: 4,
    },
    tokenItemName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    tokenItemNetwork: {
        fontSize: 13,
        color: '#888',
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 15,
        color: '#666',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
        gap: 16,
    },
    loadingText: {
        fontSize: 14,
        color: '#888',
    },
    errorContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 40,
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
