import { StyleSheet, ScrollView, Pressable, Image } from "react-native";
import { Link } from "expo-router";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

const CATEGORIES = [
  { id: 1, name: "Electronics", icon: "🔌" },
  { id: 2, name: "Clothing", icon: "👕" },
  { id: 3, name: "Books", icon: "📚" },
  { id: 4, name: "Home", icon: "🏠" },
];

const TRENDING_PRODUCTS = [
  {
    id: 1,
    title: "Wireless Earbuds",
    price: 79.99,
    image: "https://picsum.photos/200",
    discount: "20% OFF",
  },
  {
    id: 2,
    title: "Smart Watch",
    price: 199.99,
    image: "https://picsum.photos/201",
    discount: "15% OFF",
  },
];

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Categories</ThemedText>
        <ThemedView style={styles.categories}>
          {CATEGORIES.map((category) => (
            <Pressable key={category.id} style={styles.categoryItem}>
              <ThemedText style={styles.categoryIcon}>
                {category.icon}
              </ThemedText>
              <ThemedText style={styles.categoryName}>
                {category.name}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Trending Deals</ThemedText>
        {TRENDING_PRODUCTS.map((product) => (
          <Link key={product.id} href={`/product/${product.id}`} asChild>
            <Pressable style={styles.dealCard}>
              <Image source={{ uri: product.image }} style={styles.dealImage} />
              <ThemedView style={styles.dealInfo}>
                <ThemedText style={styles.dealTitle}>
                  {product.title}
                </ThemedText>
                <ThemedText style={styles.dealPrice}>
                  ${product.price}
                </ThemedText>
                <ThemedView style={styles.discountBadge}>
                  <ThemedText style={styles.discountText}>
                    {product.discount}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </Pressable>
          </Link>
        ))}
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  categories: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  categoryItem: {
    width: "23%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    marginBottom: 10,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  categoryName: {
    fontSize: 12,
    textAlign: "center",
  },
  dealCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dealImage: {
    width: 100,
    height: 100,
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  dealInfo: {
    flex: 1,
    padding: 12,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  dealPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2196F3",
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#ff4444",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  discountText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});
