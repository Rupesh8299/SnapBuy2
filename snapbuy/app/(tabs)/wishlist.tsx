import { View, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function WishlistScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.title}>My Wishlist</ThemedText>
      {/* Wishlist items will be implemented here */}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
});