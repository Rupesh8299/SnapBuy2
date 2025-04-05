import React, { useState, useEffect, useRef } from "react";
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from "react-native";
import { router } from "expo-router";
import { ThemedText as Text } from "@/components/ThemedText";

const { width } = Dimensions.get("window");

interface Banner {
  id: number;
  image: string;
  title: string;
  discount: string;
  collection: string;
  backgroundColor: string;
}

const banners: Banner[] = [
  {
    id: 1,
    image: "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    title: "New Collection",
    discount: "UP TO 30% OFF*",
    collection: "For New Collection",
    backgroundColor: "#FFB6C1",
  },
  {
    id: 2,
    image:
      "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
    title: "Summer Sale",
    discount: "UP TO 50% OFF",
    collection: "Summer Collection",
    backgroundColor: "#FFD700",
  },
  {
    id: 3,
    image: "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    title: "Flash Sale",
    discount: "UP TO 40% OFF",
    collection: "Limited Time",
    backgroundColor: "#98FB98",
  },
];

export function BannerCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % banners.length;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
      setActiveIndex(nextIndex);

      // Fade animation
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 0.7,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }, 3000);

    return () => clearInterval(interval);
  }, [activeIndex]);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleBannerPress = () => {
    router.push("/products");
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        {banners.map((banner) => (
          <TouchableOpacity
            key={banner.id}
            style={[styles.banner, { backgroundColor: banner.backgroundColor }]}
            onPress={handleBannerPress}
            activeOpacity={0.9}
          >
            <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{banner.title}</Text>
                <Text style={styles.discount}>{banner.discount}</Text>
                <Text style={styles.collection}>{banner.collection}</Text>
              </View>
              <Image source={{ uri: banner.image }} style={styles.image} />
            </Animated.View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.pagination}>
        {banners.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              index === activeIndex && styles.paginationDotActive,
            ]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 180,
    marginVertical: 12,
  },
  banner: {
    width: width - 32,
    marginHorizontal: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  content: {
    flexDirection: "row",
    padding: 16,
    alignItems: "center",
    height: "100%",
  },
  textContainer: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
    color: "#000",
  },
  discount: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#000",
  },
  collection: {
    fontSize: 14,
    color: "#666",
  },
  image: {
    width: 120,
    height: 120,
    resizeMode: "contain",
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "#4169E1",
    width: 12,
    height: 12,
    borderRadius: 6,
  },
});
