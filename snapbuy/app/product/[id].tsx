import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { fakeStoreApi, Product } from "@/services/fakeStoreApi";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [relatedLoading, setRelatedLoading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const { addToCart, removeFromCart, getItemQuantity, updateQuantity } =
    useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [cartQuantity, setCartQuantity] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [id]);

  useEffect(() => {
    if (product) {
      const quantity = getItemQuantity(product.id);
      setCartQuantity(quantity);
      setIsWishlisted(isInWishlist(product.id));
      loadRelatedProducts(product.category);
    }
  }, [product, getItemQuantity, isInWishlist]);

  const loadProduct = async () => {
    try {
      setLoading(true);
      const productId = parseInt(id, 10);
      if (isNaN(productId)) {
        throw new Error("Invalid product ID");
      }
      const data = await fakeStoreApi.getProductById(productId);
      setProduct(data);
      setError(null);
    } catch (err) {
      setError("Failed to load product");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadRelatedProducts = async (category: string) => {
    try {
      setRelatedLoading(true);
      const data = await fakeStoreApi.getProductsByCategory(category);
      // Filter out the current product and limit to 4 related products
      const filtered = data.filter((p) => p.id !== product?.id).slice(0, 4);
      setRelatedProducts(filtered);
    } catch (err) {
      console.error("Failed to load related products:", err);
    } finally {
      setRelatedLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      addToCart(product);
      setCartQuantity(1);
    }
  };

  const handleRemoveFromCart = () => {
    if (product) {
      removeFromCart(product.id);
      setCartQuantity(0);
    }
  };

  const handleUpdateQuantity = (newQuantity: number) => {
    if (product) {
      if (newQuantity <= 0) {
        handleRemoveFromCart();
      } else {
        updateQuantity(product.id, newQuantity);
        setCartQuantity(newQuantity);
      }
    }
  };

  const handleWishlistToggle = () => {
    if (product) {
      if (isWishlisted) {
        removeFromWishlist(product.id);
        setIsWishlisted(false);
      } else {
        addToWishlist(product);
        setIsWishlisted(true);
      }
    }
  };

  const handleRelatedProductPress = (productId: number) => {
    router.replace(`/product/${productId}`);
  };

  // Generate multiple views of the same image for demo
  const getProductImages = (mainImage: string) => [
    mainImage,
    mainImage.replace(".jpg", "-2.jpg"),
    mainImage.replace(".jpg", "-3.jpg"),
    mainImage.replace(".jpg", "-4.jpg"),
  ];

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentImageIndex(pageNum);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4169E1" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || "Product not found"}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.retryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <ScrollView
            ref={scrollViewRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {product &&
              getProductImages(product.image).map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image }}
                  style={styles.image}
                  resizeMode="contain"
                />
              ))}
          </ScrollView>
          <View style={styles.pagination}>
            {product &&
              getProductImages(product.image).map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    index === currentImageIndex && styles.paginationDotActive,
                  ]}
                />
              ))}
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{product.title}</Text>
          <Text style={styles.price}>₹{product.price.toFixed(2)}</Text>

          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={styles.rating}>
              {product.rating.rate} ({product.rating.count} reviews)
            </Text>
          </View>

          <Text style={styles.category}>{product.category}</Text>

          <Text style={styles.description}>{product.description}</Text>
        </View>

        {relatedProducts.length > 0 && (
          <View style={styles.relatedSection}>
            <Text style={styles.relatedTitle}>Related Products</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.relatedContainer}
            >
              {relatedProducts.map((relatedProduct) => (
                <TouchableOpacity
                  key={relatedProduct.id}
                  style={styles.relatedProduct}
                  onPress={() => handleRelatedProductPress(relatedProduct.id)}
                >
                  <Image
                    source={{ uri: relatedProduct.image }}
                    style={styles.relatedImage}
                    resizeMode="contain"
                  />
                  <Text style={styles.relatedProductTitle} numberOfLines={1}>
                    {relatedProduct.title}
                  </Text>
                  <Text style={styles.relatedProductPrice}>
                    ₹{relatedProduct.price.toFixed(2)}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.wishlistButton,
            isWishlisted && styles.wishlistButtonActive,
          ]}
          onPress={handleWishlistToggle}
        >
          <Ionicons
            name={isWishlisted ? "heart" : "heart-outline"}
            size={24}
            color={isWishlisted ? "#fff" : "#4169E1"}
          />
          <Text
            style={[
              styles.wishlistButtonText,
              isWishlisted && styles.wishlistButtonTextActive,
            ]}
          >
            {isWishlisted ? "Wishlisted" : "Wishlist"}
          </Text>
        </TouchableOpacity>

        {cartQuantity > 0 ? (
          <View style={styles.cartControls}>
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
            <TouchableOpacity
              style={styles.goToCartButton}
              onPress={() => router.push("/cart")}
            >
              <Text style={styles.goToCartButtonText}>Go to Cart</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        )}
      </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 20,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: "#4169E1",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  imageContainer: {
    position: "relative",
    backgroundColor: "#fff",
  },
  image: {
    width: SCREEN_WIDTH,
    height: SCREEN_WIDTH,
    backgroundColor: "#f5f5f5",
  },
  pagination: {
    flexDirection: "row",
    position: "absolute",
    bottom: 16,
    alignSelf: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#4169E1",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4169E1",
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  rating: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  category: {
    fontSize: 14,
    color: "#666",
    marginBottom: 16,
    textTransform: "capitalize",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
  },
  relatedSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  relatedTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  relatedContainer: {
    paddingRight: 16,
  },
  relatedProduct: {
    width: 140,
    marginRight: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 1.41,
    elevation: 2,
  },
  relatedImage: {
    width: "100%",
    height: 100,
    marginBottom: 8,
  },
  relatedProductTitle: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
  },
  relatedProductPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4169E1",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  wishlistButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4169E1",
    marginRight: 12,
    flex: 1,
  },
  wishlistButtonActive: {
    backgroundColor: "#4169E1",
  },
  wishlistButtonText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "600",
    color: "#4169E1",
  },
  wishlistButtonTextActive: {
    color: "#fff",
  },
  addToCartButton: {
    backgroundColor: "#4169E1",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flex: 2,
  },
  addToCartButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cartControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4169E1",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 2,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4169E1",
  },
  quantity: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginHorizontal: 12,
  },
  goToCartButton: {
    marginLeft: 12,
    backgroundColor: "white",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  goToCartButtonText: {
    color: "#4169E1",
    fontWeight: "600",
  },
});
