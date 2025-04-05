import React, { createContext, useContext, useState, useCallback } from "react";

const GST_RATE = 0.18; // 18% GST

interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: CartItem) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number) => number;
  total: number;
  subtotal: number;
  gstAmount: number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = useCallback((product: CartItem) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.id === product.id);
      if (existingItem) {
        return currentItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }
      return [...currentItems, product];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setItems((currentItems) => {
      // First, ensure the item exists
      const itemExists = currentItems.some((item) => item.id === productId);
      if (!itemExists) return currentItems;

      // Remove the item and trigger a state update
      const newItems = currentItems.filter((item) => item.id !== productId);

      // Use requestAnimationFrame to ensure UI updates properly
      requestAnimationFrame(() => {
        // Force a re-render by setting the same state
        setItems([...newItems]);
      });

      return newItems;
    });
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setItems((currentItems) => {
      // If quantity is 0 or less, remove the item
      if (quantity <= 0) {
        return currentItems.filter((item) => item.id !== productId);
      }

      const itemExists = currentItems.some((item) => item.id === productId);

      // If item doesn't exist and quantity > 0, do nothing
      if (!itemExists) {
        return currentItems;
      }

      // Update quantity for existing item
      return currentItems.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemQuantity = useCallback(
    (productId: number) => {
      const item = items.find((item) => item.id === productId);
      return item?.quantity || 0;
    },
    [items]
  );

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const gstAmount = subtotal * GST_RATE;
  const total = subtotal + gstAmount;

  const getTotalItems = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const value = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getItemQuantity,
    total,
    subtotal,
    gstAmount,
    getTotalItems,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
