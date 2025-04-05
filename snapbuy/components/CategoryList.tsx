import React from "react";
import {
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { router } from "expo-router";
import { ThemedText as Text } from "@/components/ThemedText";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Category {
  id: number;
  name: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
}

const categories: Category[] = [
  { id: 1, name: "Women", icon: "human-female" },
  { id: 2, name: "Men", icon: "human-male" },
  { id: 3, name: "Kids", icon: "human-child" },
  { id: 4, name: "Shoes", icon: "shoe-heel" },
  { id: 5, name: "Beauty", icon: "lipstick" },
  { id: 6, name: "Jewelry", icon: "diamond-stone" },
  { id: 7, name: "Electronics", icon: "cellphone" },
  { id: 8, name: "Sports", icon: "basketball" },
];

export function CategoryList() {
  const handleCategoryPress = (category: Category) => {
    router.push(`/category/${category.name.toLowerCase()}`);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={styles.categoryItem}
            onPress={() => handleCategoryPress(category)}
          >
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons
                name={category.icon}
                size={24}
                color="#4169E1"
              />
            </View>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  scrollContent: {
    paddingHorizontal: 12,
  },
  categoryItem: {
    alignItems: "center",
    marginHorizontal: 8,
    width: 72,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
});
