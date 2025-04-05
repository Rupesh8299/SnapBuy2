import React from "react";
import {
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { ThemedText as Text } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ProductCard } from "@/components/ProductCard";
import { BannerCarousel } from "@/components/BannerCarousel";
import { CategoryList } from "@/components/CategoryList";
import { useEffect, useState } from "react";
import { Product, fakeStoreApi } from "@/services/fakeStoreApi";

export default function HomeScreen() {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [womenProducts, setWomenProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const allProducts = await fakeStoreApi.getAllProducts();

      // Get latest products
      const latest = [...allProducts].sort((a, b) => b.id - a.id).slice(0, 6);
      setNewProducts(latest);

      // Get women's products
      const women = await fakeStoreApi.getProductsByCategory(
        "women's clothing"
      );
      setWomenProducts(women.slice(0, 4));
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoading(false);
    }
  };

  const renderSectionHeader = (title: string, onSeeAll: () => void) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <TouchableOpacity onPress={onSeeAll}>
        <Text style={styles.seeAll}>See All</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.addressBar}>
          <Ionicons name="location-outline" size={24} color="#666" />
          <View style={styles.addressTextContainer}>
            <Text style={styles.deliverTo}>Deliver to</Text>
            <Text style={styles.address}>123 Main Street, City, Country</Text>
          </View>
          <TouchableOpacity onPress={() => router.push("/profile")}>
            <View style={styles.profilePicture}>
              <MaterialCommunityIcons
                name="account-circle"
                size={32}
                color="#666"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <MaterialCommunityIcons name="magnify" size={24} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your item"
            placeholderTextColor="#666"
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Banner Carousel */}
        <BannerCarousel />

        {/* Categories */}
        <CategoryList />

        {/* New Products */}
        {renderSectionHeader("New Products", () => router.push("/products"))}
        <FlatList
          data={newProducts}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productList}
          renderItem={({ item }) => (
            <View style={styles.productCard}>
              <ProductCard product={item} />
            </View>
          )}
          keyExtractor={(item) => item.id.toString()}
        />

        {/* Women's Collections */}
        {renderSectionHeader("Women's Collections", () =>
          router.push({
            pathname: "/categories/[id]",
            params: { id: "women's clothing" },
          })
        )}
        <View style={styles.gridContainer}>
          {womenProducts.map((product) => (
            <View key={product.id} style={styles.gridCard}>
              <ProductCard product={product} />
            </View>
          ))}
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 8,
  },
  addressBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addressTextContainer: {
    flex: 1,
    marginLeft: 8,
  },
  deliverTo: {
    fontSize: 12,
    color: "#666",
  },
  address: {
    fontSize: 14,
    fontWeight: "500",
  },
  profilePicture: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  searchContainer: {
    padding: 16,
    backgroundColor: "#fff",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  seeAll: {
    fontSize: 14,
    color: "#4169E1",
    fontWeight: "500",
  },
  productList: {
    paddingHorizontal: 8,
  },
  productCard: {
    width: 170,
    marginHorizontal: 4,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 8,
    gap: 8,
  },
  gridCard: {
    width: "48%",
    marginBottom: 8,
  },
});
