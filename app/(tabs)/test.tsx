import { View, StyleSheet } from 'react-native';
import { ExchangeCard } from '@/components/Lifi/Lifi-exchange';

export default function ExchangeScreen() {
  return (
    <View style={styles.container}>
      <ExchangeCard />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});