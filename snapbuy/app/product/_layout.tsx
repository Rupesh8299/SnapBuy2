import { Stack, useRouter } from "expo-router";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ThemedText as Text } from "@/components/ThemedText";
import { useCart } from "@/context/CartContext";

type RouteParams = {
  title?: string;
};

export default function ProductLayout() {
  const router = useRouter();
  const { getTotalItems } = useCart();
  const totalCartItems = getTotalItems();

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#fff" },
        headerStyle: {
          backgroundColor: "#fff",
        },
        headerTitleStyle: {
          fontSize: 16,
          fontWeight: "500",
          color: "#000",
        },
        headerLeft: () => (
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
          </TouchableOpacity>
        ),
        headerRight: () => (
          <View style={styles.headerRight}>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => router.push("/cart")}
            >
              <MaterialCommunityIcons
                name="shopping-outline"
                size={24}
                color="#000"
              />
              {totalCartItems > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{totalCartItems}</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        ),
      }}
    >
      <Stack.Screen
        name="[id]"
        options={({ route }) => ({
          title: (route.params as RouteParams)?.title || "",
          headerTitleStyle: styles.headerTitle,
        })}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 4,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000",
    maxWidth: "75%",
    marginLeft: 8,
  },
  cartButton: {
    padding: 16,
    position: "relative",
  },
  backButton: {
    padding: 16,
    paddingLeft: 20,
  },
  cartBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#FF3B30",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#FFF",
    zIndex: 1,
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
});
