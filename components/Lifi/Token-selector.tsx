import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { Token } from '@/types/token';
import { ChevronDown, X } from 'lucide-react-native';
import { useState } from 'react';

interface TokenSelectorProps {
  label: string;
  selectedToken: Token;
  tokens: Token[];
  onSelectToken: (token: Token) => void;
}

export function TokenSelector({
  label,
  selectedToken,
  tokens,
  onSelectToken,
}: TokenSelectorProps) {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSelectToken = (token: Token) => {
    onSelectToken(token);
    setModalVisible(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={styles.selectorButton}
          onPress={() => setModalVisible(true)}
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
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}>
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Token</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <X size={24} color="#fff" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={tokens}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.tokenItem,
                    item.id === selectedToken.id && styles.tokenItemSelected,
                  ]}
                  onPress={() => handleSelectToken(item)}
                  activeOpacity={0.7}>
                  <View style={styles.tokenInfo}>
                    <Text style={styles.tokenItemIcon}>{item.icon}</Text>
                    <View style={styles.textContainer}>
                      <Text style={styles.tokenItemName}>{item.symbol}</Text>
                      <Text style={styles.tokenItemNetwork}>
                        {item.network}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.balanceContainer}>
                    <Text style={styles.balance}>{item.balance}</Text>
                    <Text style={styles.balanceUSD}>
                      ${(item.balance * item.priceUSD).toFixed(2)}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </Pressable>
        </Pressable>
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
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
  },
  tokenItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a2a',
  },
  tokenItemSelected: {
    backgroundColor: '#2a2a2a',
  },
  tokenItemIcon: {
    fontSize: 32,
    width: 48,
    height: 48,
    textAlign: 'center',
    lineHeight: 48,
    backgroundColor: '#2a2a2a',
    borderRadius: 24,
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
  balanceContainer: {
    alignItems: 'flex-end',
    gap: 2,
  },
  balance: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  balanceUSD: {
    fontSize: 13,
    color: '#888',
  },
});
