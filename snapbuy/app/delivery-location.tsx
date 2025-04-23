import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemedText as Text } from "@/components/ThemedText";
import { ThemedView as View } from "@/components/ThemedView";

const DELIVERY_ADDRESSES_KEY = "@snapbuy_delivery_addresses";
const SELECTED_ADDRESS_KEY = "@snapbuy_delivery_address";
const ADDRESS_TYPES = ["Home", "Office", "Other"];

interface Address {
  id: string;
  name: string;
  addressType: string;
  street: string;
  landmark?: string;
  city: string;
  pincode: string;
  state: string;
}

export default function DeliveryLocationScreen() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    null
  );
  const [newAddress, setNewAddress] = useState<Address>({
    id: "",
    name: "",
    addressType: "Home",
    street: "",
    landmark: "",
    city: "",
    pincode: "",
    state: "",
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const loadAddresses = async () => {
    try {
      const savedAddresses = await AsyncStorage.getItem(DELIVERY_ADDRESSES_KEY);
      const selectedId = await AsyncStorage.getItem(SELECTED_ADDRESS_KEY);
      if (savedAddresses) {
        const parsedAddresses = JSON.parse(savedAddresses);
        setAddresses(parsedAddresses);
        if (selectedId) {
          setSelectedAddressId(selectedId);
        } else if (parsedAddresses.length > 0) {
          // Set first address as selected if none is selected
          setSelectedAddressId(parsedAddresses[0].id);
          await AsyncStorage.setItem(
            SELECTED_ADDRESS_KEY,
            parsedAddresses[0].id
          );
        }
      }
    } catch (error) {
      console.error("Error loading addresses:", error);
    }
  };

  const handleSaveAddress = async () => {
    if (
      !newAddress.name ||
      !newAddress.street ||
      !newAddress.city ||
      !newAddress.pincode ||
      !newAddress.state
    ) {
      Alert.alert("Error", "Please fill in all required fields");
      return;
    }

    try {
      const newId = Date.now().toString();
      const addressToSave = { ...newAddress, id: newId };
      const updatedAddresses = [...addresses, addressToSave];
      await AsyncStorage.setItem(
        DELIVERY_ADDRESSES_KEY,
        JSON.stringify(updatedAddresses)
      );

      // If this is the first address, set it as selected
      if (updatedAddresses.length === 1) {
        await AsyncStorage.setItem(SELECTED_ADDRESS_KEY, newId);
        setSelectedAddressId(newId);
      }

      setAddresses(updatedAddresses);
      setShowAddForm(false);
      setNewAddress({
        id: "",
        name: "",
        addressType: "Home",
        street: "",
        landmark: "",
        city: "",
        pincode: "",
        state: "",
      });
    } catch (error) {
      console.error("Error saving address:", error);
      Alert.alert("Error", "Failed to save address");
    }
  };

  const handleRemoveAddress = async (id: string) => {
    try {
      const updatedAddresses = addresses.filter((addr) => addr.id !== id);
      await AsyncStorage.setItem(
        DELIVERY_ADDRESSES_KEY,
        JSON.stringify(updatedAddresses)
      );

      // If removing selected address, select another one if available
      if (id === selectedAddressId) {
        if (updatedAddresses.length > 0) {
          await AsyncStorage.setItem(
            SELECTED_ADDRESS_KEY,
            updatedAddresses[0].id
          );
          setSelectedAddressId(updatedAddresses[0].id);
        } else {
          await AsyncStorage.removeItem(SELECTED_ADDRESS_KEY);
          setSelectedAddressId(null);
        }
      }

      setAddresses(updatedAddresses);
    } catch (error) {
      console.error("Error removing address:", error);
      Alert.alert("Error", "Failed to remove address");
    }
  };

  const handleSelectAddress = async (id: string) => {
    try {
      await AsyncStorage.setItem(SELECTED_ADDRESS_KEY, id);
      setSelectedAddressId(id);
      router.back();
    } catch (error) {
      console.error("Error selecting address:", error);
      Alert.alert("Error", "Failed to select address");
    }
  };

  const formatAddress = (address: Address): string => {
    return `${address.street}${
      address.landmark ? `, ${address.landmark}` : ""
    }, ${address.city}, ${address.state} - ${address.pincode}`;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialCommunityIcons name="arrow-left" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Locations</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Address List */}
        {addresses.map((address) => (
          <TouchableOpacity
            key={address.id}
            style={[
              styles.addressCard,
              selectedAddressId === address.id && styles.addressCardSelected,
            ]}
            onPress={() => handleSelectAddress(address.id)}
          >
            <View style={styles.addressTypeTag}>
              <Text style={styles.addressTypeText}>{address.addressType}</Text>
            </View>
            <Text style={styles.addressName}>{address.name}</Text>
            <Text style={styles.addressText}>{formatAddress(address)}</Text>
            <View style={styles.addressActions}>
              {selectedAddressId === address.id && (
                <View style={styles.selectedIndicator}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={20}
                    color="#4169E1"
                  />
                  <Text style={styles.selectedText}>Selected</Text>
                </View>
              )}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => handleRemoveAddress(address.id)}
              >
                <MaterialCommunityIcons
                  name="delete-outline"
                  size={20}
                  color="#FF3B30"
                />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {/* Add New Address Button */}
        {!showAddForm && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}
          >
            <MaterialCommunityIcons name="plus" size={24} color="#4169E1" />
            <Text style={styles.addButtonText}>Add New Address</Text>
          </TouchableOpacity>
        )}

        {/* Add Address Form */}
        {showAddForm && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Add New Address</Text>

            <TextInput
              style={styles.input}
              placeholder="Full Name *"
              value={newAddress.name}
              onChangeText={(text) =>
                setNewAddress((prev) => ({ ...prev, name: text }))
              }
            />

            <View style={styles.addressTypeContainer}>
              {ADDRESS_TYPES.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.addressTypeButton,
                    newAddress.addressType === type &&
                      styles.addressTypeButtonActive,
                  ]}
                  onPress={() =>
                    setNewAddress((prev) => ({ ...prev, addressType: type }))
                  }
                >
                  <Text
                    style={[
                      styles.addressTypeButtonText,
                      newAddress.addressType === type &&
                        styles.addressTypeButtonTextActive,
                    ]}
                  >
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <TextInput
              style={styles.input}
              placeholder="Street Address *"
              value={newAddress.street}
              onChangeText={(text) =>
                setNewAddress((prev) => ({ ...prev, street: text }))
              }
              multiline
            />

            <TextInput
              style={styles.input}
              placeholder="Landmark (Optional)"
              value={newAddress.landmark}
              onChangeText={(text) =>
                setNewAddress((prev) => ({ ...prev, landmark: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="City *"
              value={newAddress.city}
              onChangeText={(text) =>
                setNewAddress((prev) => ({ ...prev, city: text }))
              }
            />

            <TextInput
              style={styles.input}
              placeholder="Pincode *"
              value={newAddress.pincode}
              onChangeText={(text) =>
                setNewAddress((prev) => ({ ...prev, pincode: text }))
              }
              keyboardType="number-pad"
              maxLength={6}
            />

            <TextInput
              style={styles.input}
              placeholder="State *"
              value={newAddress.state}
              onChangeText={(text) =>
                setNewAddress((prev) => ({ ...prev, state: text }))
              }
            />

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.saveButton,
                  !newAddress.name && styles.saveButtonDisabled,
                ]}
                onPress={handleSaveAddress}
                disabled={!newAddress.name}
              >
                <Text style={styles.saveButtonText}>Save Address</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </ScrollView>
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
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  addressCard: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    position: "relative",
  },
  addressCardSelected: {
    borderWidth: 2,
    borderColor: "#4169E1",
  },
  addressTypeTag: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "#4169E1",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  addressTypeText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  addressName: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  addressActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 8,
  },
  selectedIndicator: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  selectedText: {
    marginLeft: 4,
    fontSize: 14,
    color: "#4169E1",
    fontWeight: "500",
  },
  removeButton: {
    padding: 4,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4169E1",
    borderStyle: "dashed",
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#4169E1",
    fontWeight: "500",
  },
  formContainer: {
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
    padding: 16,
    marginTop: 16,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  addressTypeContainer: {
    flexDirection: "row",
    marginBottom: 16,
  },
  addressTypeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    backgroundColor: "#fff",
    marginRight: 8,
    alignItems: "center",
  },
  addressTypeButtonActive: {
    backgroundColor: "#4169E1",
  },
  addressTypeButtonText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "500",
  },
  addressTypeButtonTextActive: {
    color: "#fff",
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  formButtons: {
    flexDirection: "row",
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#fff",
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#4169E1",
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
