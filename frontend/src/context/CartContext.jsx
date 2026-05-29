import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as cartStorage from '../utils/cart';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => cartStorage.getCart());

  const syncCart = useCallback(() => {
    setItems(cartStorage.getCart());
  }, []);

  const addItem = useCallback(
    (product, quantity = 1) => {
      cartStorage.addItem(product, quantity);
      syncCart();
    },
    [syncCart],
  );

  const updateQuantity = useCallback(
    (productId, quantity) => {
      cartStorage.updateItemQuantity(productId, quantity);
      syncCart();
    },
    [syncCart],
  );

  const removeItem = useCallback(
    (productId) => {
      cartStorage.removeItem(productId);
      syncCart();
    },
    [syncCart],
  );

  const clearCart = useCallback(() => {
    cartStorage.clearCart();
    syncCart();
  }, [syncCart]);

  const cartCount = useMemo(
    () => items.reduce((total, item) => total + (item.quantity || 0), 0),
    [items],
  );

  const value = useMemo(
    () => ({
      items,
      cartCount,
      addItem,
      updateQuantity,
      removeItem,
      clearCart,
    }),
    [items, cartCount, addItem, updateQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }

  return context;
}
