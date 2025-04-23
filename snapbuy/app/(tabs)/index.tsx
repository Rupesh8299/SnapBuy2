import React, { useEffect, useState, useCallback } from "react";
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
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

import { ThemedText as Text } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ProductCard } from "@/components/ProductCard";
import { BannerCarousel } from "@/components/BannerCarousel";
import { CategoryList } from "@/components/CategoryList";
import { Product, fakeStoreApi } from "@/services/fakeStoreApi";

const DELIVERY_ADDRESSES_KEY = "@snapbuy_delivery_addresses";
const SELECTED_ADDRESS_KEY = "@snapbuy_delivery_address";

interface Address {
  id: string;
  name: string;
  addressType: string;
  street: string;
  landmark?: string;
  city: string;
  pincode: string;
  state: string;
}

export default function HomeScreen() {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [womenProducts, setWomenProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  useFocusEffect(
    useCallback(() => {
      loadSelectedAddress();
    }, [])
  );

  useEffect(() => {
    loadProducts();
    loadSelectedAddress();
  }, []);

  const loadSelectedAddress = async () => {
    try {
      const selectedId = await AsyncStorage.getItem(SELECTED_ADDRESS_KEY);
      if (selectedId) {
        const savedAddresses = await AsyncStorage.getItem(
          DELIVERY_ADDRESSES_KEY
        );
        if (savedAddresses) {
          const addresses: Address[] = JSON.parse(savedAddresses);
          const selected = addresses.find((addr) => addr.id === selectedId);
          if (selected) {
            setSelectedAddress(selected);
          }
        }
      }
    } catch (error) {
      console.error("Error loading delivery address:", error);
    }
  };

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

  const formatAddress = (address: Address): string => {
    return `${address.street}${
      address.landmark ? `, ${address.landmark}` : ""
    }, ${address.city}, ${address.state} - ${address.pincode}`;
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
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.addressBar}
            onPress={() => router.push("/delivery-location")}
          >
            <Ionicons name="location-outline" size={24} color="#666" />
            <View style={styles.addressTextContainer}>
              <Text style={styles.deliverTo}>
                Deliver to {selectedAddress?.name}
              </Text>
              <Text style={styles.address} numberOfLines={1}>
                {selectedAddress
                  ? formatAddress(selectedAddress)
                  : "Add delivery address"}
              </Text>
            </View>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#666"
            />
          </TouchableOpacity>
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
    paddingBottom: 8,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  addressBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  addressTextContainer: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
