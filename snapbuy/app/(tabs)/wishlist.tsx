import { StyleSheet, ScrollView, Image, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { ThemedText as Text } from "@/components/ThemedText";
import { ThemedView as View } from "@/components/ThemedView";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

export default function WishlistScreen() {
  const { addToCart } = useCart();
  const { items, removeFromWishlist } = useWishlist();

  const handleMoveToCart = (product: Product) => {
    addToCart({ ...product, quantity: 1 });
    removeFromWishlist(product.id);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Wishlist</Text>
        <Text style={styles.itemCount}>{items.length} items</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.productGrid}>
          {items.map((product) => (
            <View key={product.id} style={styles.productCard}>
              <Image
                source={{ uri: product.image }}
                style={styles.productImage}
              />
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {product.title}
                </Text>
                <Text style={styles.productPrice}>₹{product.price}</Text>
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.moveToCartButton}
                  onPress={() => handleMoveToCart(product)}
                >
                  <MaterialCommunityIcons
                    name="cart-plus"
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.buttonText}>Move to Cart</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => removeFromWishlist(product.id)}
                >
                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={20}
                    color="#FF3B30"
                  />
                  <Text style={[styles.buttonText, styles.removeText]}>
                    Remove
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  itemCount: {
    fontSize: 14,
    color: "#666",
  },
  scrollView: {
    flex: 1,
  },
  productGrid: {
    padding: 8,
  },
  productCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginVertical: 8,
    marginHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a237e",
  },
  buttonContainer: {
    flexDirection: "row",
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  moveToCartButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#1a237e",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  removeButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#FF3B30",
  },
  buttonText: {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  removeText: {
    color: "#FF3B30",
  },
});
