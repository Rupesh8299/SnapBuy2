import { router } from "expo-router";
import {
  StyleSheet,
  FlatList,
  Image,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { ProductCard } from "@/components/ProductCard";
import { Ionicons } from "@expo/vector-icons";

const DUMMY_PRODUCTS = [
  {
    id: 1,
    title: "Macbook -Pro",
    price: 1198.0,
    image: "https://picsum.photos/200",
  },
  {
    id: 2,
    title: "Macbook -Pro",
    price: 1425.0,
    image: "https://picsum.photos/200",
  },
];

const NEWEST_PRODUCTS = [
  {
    id: 3,
    title: "Sony-Z457",
    price: 50.0,
    image: "https://picsum.photos/200",
  },
  {
    id: 4,
    title: "Sony-X9014",
    price: 45.0,
    image: "https://picsum.photos/200",
  },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Address Bar Section */}
      <ThemedView style={styles.addressBar}>
        <ThemedView style={styles.locationContainer}>
          <ThemedText style={styles.locationLabel}>Delivery to</ThemedText>
          <Pressable style={styles.locationSelector}>
            <ThemedText style={styles.location}>456 Your Location</ThemedText>
            <ThemedText style={styles.chevron}>▼</ThemedText>
          </Pressable>
        </ThemedView>
        <Pressable
          style={styles.profileButton}
          onPress={() => router.push("/profile")}
        >
          <Image
            source={{ uri: "https://i.pravatar.cc/100" }}
            style={styles.profileImage}
          />
        </Pressable>
      </ThemedView>

      {/* Search Bar */}
      <ThemedView style={styles.searchContainer}>
        <ThemedView style={styles.searchInputContainer}>
          <Ionicons
            name="search-outline"
            size={20}
            color="#666"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search your item"
            placeholderTextColor="#666"
          />
        </ThemedView>
      </ThemedView>

      {/* Banner Section */}
      <ThemedView style={styles.banner}>
        <ThemedView style={styles.bannerContent}>
          <ThemedText style={styles.bannerTitle}>New Macbook</ThemedText>
          <ThemedText style={styles.bannerSubtitle}>
            Winter Collection
          </ThemedText>
          <Pressable style={styles.bannerButton}>
            <ThemedText style={styles.bannerButtonText}>Browse Now</ThemedText>
          </Pressable>
        </ThemedView>
        <Image
          source={{ uri: "https://picsum.photos/200" }}
          style={styles.bannerImage}
        />
      </ThemedView>

      {/* Popular Products Section */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Popular Product</ThemedText>
          <Pressable>
            <ThemedText style={styles.seeAll}>See All</ThemedText>
          </Pressable>
        </ThemedView>
        <FlatList
          data={DUMMY_PRODUCTS}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productList}
        />
      </ThemedView>

      {/* Newest Products Section */}
      <ThemedView style={styles.section}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText style={styles.sectionTitle}>Newest Product</ThemedText>
          <Pressable>
            <ThemedText style={styles.seeAll}>See All</ThemedText>
          </Pressable>
        </ThemedView>
        <FlatList
          data={NEWEST_PRODUCTS}
          renderItem={({ item }) => <ProductCard product={item} />}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.productList}
        />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  addressBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  locationContainer: {
    flex: 1,
  },
  locationLabel: {
    fontSize: 12,
    color: "#666",
  },
  locationSelector: {
    flexDirection: "row",
    alignItems: "center",
  },
  location: {
    fontSize: 16,
    fontWeight: "600",
    marginRight: 4,
  },
  chevron: {
    fontSize: 12,
    color: "#666",
  },
  profileButton: {
    marginLeft: 12,
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginBottom: 8,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#000",
  },
  banner: {
    height: 180,
    backgroundColor: "#4169E1",
    borderRadius: 15,
    margin: 16,
    padding: 20,
    flexDirection: "row",
    overflow: "hidden",
  },
  bannerContent: {
    flex: 1,
    justifyContent: "center",
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: "#fff",
    opacity: 0.8,
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: "flex-start",
  },
  bannerButtonText: {
    color: "#4169E1",
    fontWeight: "600",
  },
  bannerImage: {
    width: 140,
    height: 140,
    resizeMode: "contain",
    alignSelf: "center",
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  seeAll: {
    color: "#4169E1",
    fontWeight: "600",
  },
  productList: {
    paddingRight: 16,
  },
});
