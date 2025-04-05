import { useLocalSearchParams, useRouter } from "expo-router";
import {
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  View as RNView,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useCallback, useLayoutEffect } from "react";

import { ThemedText as Text } from "@/components/ThemedText";
import { ThemedView as View } from "@/components/ThemedView";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

export default function ProductScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { addToCart, getItemQuantity, getTotalItems } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Mock product data - replace with actual API call
  const product = {
    id: Number(id),
    title: "Men Cotton Printed Regular Fit Mid-Rise Shorts",
    price: 866,
    image: "https://example.com/image.jpg",
    description: "Comfortable cotton shorts with modern print design.",
  };

  const cartQuantity = getItemQuantity(product.id);
  const totalCartItems = getTotalItems();
  const isWishlisted = isInWishlist(product.id);

  useLayoutEffect(() => {
    router.setParams({ title: product.title });
  }, [product.title, router]);

  const handleAddToCart = useCallback(() => {
    addToCart({ ...product, quantity: 1 });
  }, [product, addToCart]);

  const handleWishlistToggle = useCallback(() => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }, [product, isWishlisted, addToWishlist, removeFromWishlist]);

  const handleGoToCart = useCallback(() => {
    router.push("/cart");
  }, [router]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <Image source={{ uri: product.image }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>₹{product.price}</Text>
          <Text style={styles.description}>{product.description}</Text>
        </View>
      </ScrollView>

      <RNView style={styles.bottomButtons}>
        <TouchableOpacity
          style={[
            styles.wishlistButton,
            isWishlisted && styles.wishlistedButton,
          ]}
          onPress={handleWishlistToggle}
        >
          <MaterialCommunityIcons
            name={isWishlisted ? "heart" : "heart-outline"}
            size={24}
            color={isWishlisted ? "#fff" : "#FF4081"}
          />
          <Text
            style={[
              styles.wishlistButtonText,
              isWishlisted && styles.wishlistedButtonText,
            ]}
          >
            {isWishlisted ? "WISHLISTED" : "WISHLIST"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.addToCartButton,
            cartQuantity > 0 && styles.goToCartButton,
          ]}
          onPress={cartQuantity > 0 ? handleGoToCart : handleAddToCart}
        >
          <Text style={styles.addToCartButtonText}>
            {cartQuantity > 0 ? "GO TO BAG" : "ADD TO BAG"}
          </Text>
        </TouchableOpacity>
      </RNView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  image: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1a237e",
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  bottomButtons: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  wishlistButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginRight: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF4081",
  },
  wishlistedButton: {
    backgroundColor: "#FF4081",
    borderColor: "#FF4081",
  },
  wishlistButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#FF4081",
  },
  wishlistedButtonText: {
    color: "#fff",
  },
  addToCartButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: "#1a237e",
  },
  goToCartButton: {
    backgroundColor: "#FF4081",
  },
  addToCartButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});
