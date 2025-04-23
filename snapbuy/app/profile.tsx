import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";

const PROFILE_IMAGE_KEY = "@snapbuy_profile_image";

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState("Account");
  const { user, logout } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Load saved profile image when component mounts
  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
      const savedImage = await AsyncStorage.getItem(PROFILE_IMAGE_KEY);
      if (savedImage) {
        setProfileImage(savedImage);
      }
    } catch (error) {
      console.error("Error loading profile image:", error);
    }
  };

  const handleImagePick = async () => {
    // Request permission to access the image library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Sorry",
        "We need camera roll permissions to make this work!"
      );
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });

    if (!result.canceled) {
      const newImageUri = result.assets[0].uri;
      setProfileImage(newImageUri);
      // Save the image URI to AsyncStorage
      try {
        await AsyncStorage.setItem(PROFILE_IMAGE_KEY, newImageUri);
      } catch (error) {
        console.error("Error saving profile image:", error);
        Alert.alert("Error", "Failed to save profile image");
      }
    }
  };

  const menuItems = [
    {
      title: "Purchase history",
      subtitle: "12 Product",
      icon: "card-outline" as const,
    },
    {
      title: "Bank Account",
      subtitle: "Edit your bank account",
      icon: "wallet-outline" as const,
    },
    {
      title: "Favorite Shop",
      subtitle: "8 Favorite stores",
      icon: "storefront-outline" as const,
    },
    {
      title: "Other Settings",
      subtitle: "Security, notifications and more",
      icon: "settings-outline" as const,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <TouchableOpacity
            onPress={handleImagePick}
            style={styles.avatarContainer}
          >
            <Image
              source={{
                uri: profileImage || "https://i.pravatar.cc/100",
              }}
              style={styles.avatar}
            />
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={16} color="#FFF" />
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="pencil-outline" size={20} color="#4169E1" />
          </TouchableOpacity>
          <ThemedText style={styles.name}>
            {user?.displayName || "User"}
          </ThemedText>
          <ThemedText style={styles.location}>
            {user?.email || "No email provided"}
          </ThemedText>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Account" && styles.activeTab]}
            onPress={() => setActiveTab("Account")}
          >
            <ThemedText
              style={[
                styles.tabText,
                activeTab === "Account" && styles.activeTabText,
              ]}
            >
              Account
            </ThemedText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "Wishlist" && styles.activeTab]}
            onPress={() => setActiveTab("Wishlist")}
          >
            <ThemedText
              style={[
                styles.tabText,
                activeTab === "Wishlist" && styles.activeTabText,
              ]}
            >
              Wishlist
            </ThemedText>
          </TouchableOpacity>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem}>
              <View style={styles.menuIconContainer}>
                <Ionicons name={item.icon} size={24} color="#4169E1" />
              </View>
              <View style={styles.menuTextContainer}>
                <ThemedText style={styles.menuTitle}>{item.title}</ThemedText>
                <ThemedText style={styles.menuSubtitle}>
                  {item.subtitle}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#E3E3E3" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Log Out Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={async () => {
            await logout();
            router.replace("/auth/login");
          }}
        >
          <Ionicons name="log-out-outline" size={24} color="#E3E3E3" />
          <ThemedText style={styles.logoutText}>Log Out</ThemedText>
          <ThemedText style={styles.logoutSubtext}>
            Log out from your account
          </ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  profileHeader: {
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraIconContainer: {
    position: "absolute",
    right: -4,
    bottom: -4,
    backgroundColor: "#4169E1",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  editButton: {
    position: "absolute",
    right: 20,
    top: 20,
    padding: 8,
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 4,
  },
  location: {
    fontSize: 14,
    color: "#666",
  },
  tabContainer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E3E3E3",
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#4169E1",
  },
  tabText: {
    fontSize: 16,
    color: "#666",
  },
  activeTabText: {
    color: "#4169E1",
    fontWeight: "600",
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0F7FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 12,
    color: "#666",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 12,
    flex: 1,
  },
  logoutSubtext: {
    fontSize: 12,
    color: "#666",
  },
});
