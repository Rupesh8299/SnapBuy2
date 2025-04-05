import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Image,
  Pressable,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/services/fakeStoreApi";

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { addToCart, removeFromCart, getItemQuantity, updateQuantity } =
    useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);

  // Check if product is in cart or wishlist on mount
  useEffect(() => {
    const quantity = getItemQuantity(product.id);
    setCartQuantity(quantity);
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id, getItemQuantity, isInWishlist]);

  const handleAddToCart = () => {
    addToCart(product);
    setCartQuantity(1);
  };

  const handleRemoveFromCart = () => {
    removeFromCart(product.id);
    setCartQuantity(0);
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart();
    } else {
      updateQuantity(product.id, newQuantity);
      setCartQuantity(newQuantity);
    }
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
      setIsWishlisted(false);
    } else {
      addToWishlist(product);
      setIsWishlisted(true);
    }
  };

  const handleProductPress = () => {
    router.push(`/product/${product.id}`);
  };

  return (
    <Pressable style={styles.container} onPress={handleProductPress}>
      <View style={styles.imageContainer}>
        <TouchableOpacity
          style={styles.wishlistButton}
          onPress={handleWishlistToggle}
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <Ionicons
            name={isWishlisted ? "heart" : "heart-outline"}
            size={24}
            color={isWishlisted ? "#FF3B30" : "#666"}
          />
        </TouchableOpacity>
        <Image
          source={{ uri: product.image }}
          style={styles.image}
          resizeMode="cover"
        />
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>
      </View>

      {cartQuantity > 0 ? (
        <View style={styles.cartControls}>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleUpdateQuantity(cartQuantity - 1)}
            >
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{cartQuantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => handleUpdateQuantity(cartQuantity + 1)}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <TouchableOpacity
          style={styles.addToCartButton}
          onPress={handleAddToCart}
        >
          <Text style={styles.addToCartText}>Add to Cart</Text>
        </TouchableOpacity>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderRadius: 8,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  imageContainer: {
    aspectRatio: 1,
    width: "100%",
    backgroundColor: "#f5f5f5",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  wishlistButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  content: {
    padding: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    color: "#333",
  },
  price: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  ratingText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  cartControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 8,
    backgroundColor: "#fff",
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
    height: 36,
    width: "100%",
    justifyContent: "space-between",
  },
  quantityButton: {
    width: 36,
    height: 36,
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#4169E1",
  },
  quantity: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
  },
  addToCartButton: {
    backgroundColor: "#4169E1",
    height: 36,
    margin: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  addToCartText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
});
