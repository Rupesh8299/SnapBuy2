import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";

import { ThemedText as Text } from "@/components/ThemedText";
import { ThemedView as View } from "@/components/ThemedView";
import { useCart } from "@/context/CartContext";

const GST_RATE = 0.18; // 18% GST

export default function CartScreen() {
  const router = useRouter();
  const { items, removeFromCart, getSubtotal, getGST, getTotal } = useCart();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "SPOOKY15") {
      setDiscount(getTotal() * 0.15); // 15% discount
    }
  };

  const handleRemoveItem = (productId: number) => {
    removeFromCart(productId);
  };

  const subtotal = getSubtotal();
  const gstAmount = getGST();
  const grandTotal = getTotal() - discount;
  const amountToBePaid = grandTotal;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Cart Items */}
        {items.length === 0 ? (
          <View style={styles.emptyCart}>
            <MaterialCommunityIcons
              name="cart-outline"
              size={64}
              color="#ccc"
            />
            <Text style={styles.emptyCartText}>Your cart is empty</Text>
            <TouchableOpacity
              style={styles.continueShoppingButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.continueShoppingText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        ) : (
          items.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemDetails}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.itemQuantity}>
                  Quantity: {item.quantity}
                </Text>
                <Text style={styles.itemPrice}>
                  Unit Price: ₹{item.price.toFixed(2)}
                </Text>
                <Text style={styles.subtotal}>
                  Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemoveItem(item.id)}
                  style={styles.removeButton}
                >
                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={20}
                    color="#666"
                  />
                  <Text style={styles.removeText}>Remove Item</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        {/* Discount Coupon */}
        {items.length > 0 && (
          <View style={styles.couponSection}>
            <Text style={styles.sectionTitle}>Discount Coupon</Text>
            <View style={styles.couponInput}>
              <TextInput
                style={styles.input}
                value={couponCode}
                onChangeText={setCouponCode}
                placeholder="SPOOKY15"
                autoCapitalize="characters"
              />
              <TouchableOpacity
                onPress={handleApplyCoupon}
                style={styles.applyButton}
              >
                <Text style={styles.applyButtonText}>APPLY</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Price Details */}
        {items.length > 0 && (
          <View style={styles.priceDetails}>
            <Text style={styles.sectionTitle}>PRICE DETAILS</Text>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>Subtotal</Text>
              <Text style={styles.priceValue}>₹{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.priceRow}>
              <Text style={styles.priceLabel}>GST (18%)</Text>
              <Text style={styles.priceValue}>₹{gstAmount.toFixed(2)}</Text>
            </View>
            {discount > 0 && (
              <View style={styles.priceRow}>
                <Text style={styles.priceLabel}>Discount</Text>
                <Text style={[styles.priceValue, styles.discountText]}>
                  -₹{discount.toFixed(2)}
                </Text>
              </View>
            )}
            <View style={[styles.priceRow, styles.totalRow]}>
              <Text style={styles.grandTotalLabel}>Grand Total</Text>
              <Text style={styles.grandTotalValue}>
                ₹{grandTotal.toFixed(2)}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom Payment Section */}
      {items.length > 0 && (
        <View style={styles.paymentSection}>
          <View style={styles.amountRow}>
            <Text style={styles.amountLabel}>Amt. to be paid</Text>
            <Text style={styles.amountValue}>₹{amountToBePaid.toFixed(2)}</Text>
          </View>
          <TouchableOpacity style={styles.payButton}>
            <Text style={styles.payButtonText}>PAY NOW</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    flex: 1,
  },
  emptyCart: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyCartText: {
    fontSize: 18,
    color: "#666",
    marginTop: 16,
    marginBottom: 24,
  },
  continueShoppingButton: {
    backgroundColor: "#4169E1",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueShoppingText: {
    color: "#fff",
    fontWeight: "600",
  },
  cartItem: {
    flexDirection: "row",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemDetails: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  subtotal: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  removeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  removeText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  couponSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 12,
    color: "#666",
  },
  couponInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    marginRight: 12,
    fontSize: 14,
  },
  applyButton: {
    backgroundColor: "#4169E1",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  applyButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  priceDetails: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: 14,
    color: "#666",
  },
  priceValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  discountText: {
    color: "#4caf50",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  grandTotalLabel: {
    fontSize: 16,
    fontWeight: "600",
  },
  grandTotalValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  paymentSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    backgroundColor: "#fff",
  },
  amountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  amountLabel: {
    fontSize: 14,
    color: "#666",
  },
  amountValue: {
    fontSize: 16,
    fontWeight: "600",
  },
  payButton: {
    backgroundColor: "#4169E1",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  payButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
