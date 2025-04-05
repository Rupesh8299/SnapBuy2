import {
  StyleSheet,
  Image,
  Pressable,
  TouchableOpacity,
  View as RNView,
} from "react-native";
import { Link } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { memo, useCallback } from "react";

import { ThemedText as Text } from "./ThemedText";
import { ThemedView as View } from "./ThemedView";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductCardProps {
  product: Product;
}

export const ProductCard = memo(({ product }: ProductCardProps) => {
  const { addToCart, getItemQuantity, updateQuantity, removeFromCart } =
    useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const cartQuantity = getItemQuantity(product.id);
  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = useCallback(() => {
    addToCart({ ...product, quantity: 1 });
  }, [product, addToCart]);

  const handleIncrement = useCallback(() => {
    const newQuantity = cartQuantity + 1;
    updateQuantity(product.id, newQuantity);
  }, [product.id, cartQuantity, updateQuantity]);

  const handleDecrement = useCallback(() => {
    if (cartQuantity <= 1) {
      removeFromCart(product.id);
      // Force a re-render after removal
      requestAnimationFrame(() => {
        updateQuantity(product.id, 0);
      });
    } else {
      updateQuantity(product.id, cartQuantity - 1);
    }
  }, [product.id, cartQuantity, updateQuantity, removeFromCart]);

  const handleWishlistToggle = useCallback(() => {
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  }, [product, isWishlisted, addToWishlist, removeFromWishlist]);

  const renderCartControls = () => {
    if (cartQuantity > 0) {
      return (
        <RNView key="cart-controls" style={styles.inCartControls}>
          <TouchableOpacity
            onPress={handleDecrement}
            style={styles.quantityButton}
          >
            <MaterialCommunityIcons name="minus" size={20} color="#fff" />
          </TouchableOpacity>
          <Text style={[styles.quantityText, styles.inCartQuantityText]}>
            {cartQuantity}
          </Text>
          <TouchableOpacity
            onPress={handleIncrement}
            style={styles.quantityButton}
          >
            <MaterialCommunityIcons name="plus" size={20} color="#fff" />
          </TouchableOpacity>
        </RNView>
      );
    }

    return (
      <TouchableOpacity
        key="add-button"
        onPress={handleAddToCart}
        style={styles.addButton}
      >
        <Text style={styles.addButtonText}>Add to Cart</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={styles.wishlistButton}
        onPress={handleWishlistToggle}
      >
        <MaterialCommunityIcons
          name={isWishlisted ? "heart" : "heart-outline"}
          size={24}
          color={isWishlisted ? "#FF3B30" : "#666"}
        />
      </TouchableOpacity>

      <Link href={`/product/${product.id}`} asChild>
        <Pressable>
          <Image source={{ uri: product.image }} style={styles.image} />
          <View style={styles.info}>
            <Text numberOfLines={2} style={styles.title}>
              {product.title}
            </Text>
            <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>
          </View>
        </Pressable>
      </Link>

      <RNView style={styles.cartControls}>
        <RNView
          style={styles.controlsContainer}
          key={`controls-${cartQuantity}`}
        >
          {renderCartControls()}
        </RNView>
      </RNView>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  info: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 5,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2196F3",
  },
  cartControls: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  controlsContainer: {
    width: "100%",
  },
  inCartControls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1a237e",
    borderRadius: 8,
    padding: 8,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    marginHorizontal: 16,
    fontSize: 16,
    fontWeight: "600",
  },
  inCartQuantityText: {
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#1a237e",
    borderRadius: 8,
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  wishlistButton: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    padding: 6,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});
