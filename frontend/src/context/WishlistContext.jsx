import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import * as wishlistStorage from '../utils/wishlist';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const [items, setItems] = useState(() => wishlistStorage.getWishlist());

  const syncWishlist = useCallback(() => {
    setItems(wishlistStorage.getWishlist());
  }, []);

  const toggleItem = useCallback(
    (product) => {
      wishlistStorage.toggleWishlist(product);
      syncWishlist();
    },
    [syncWishlist],
  );

  const removeItem = useCallback(
    (productId) => {
      wishlistStorage.removeFromWishlist(productId);
      syncWishlist();
    },
    [syncWishlist],
  );

  const isInWishlist = useCallback(
    (productId) => wishlistStorage.isInWishlist(productId, items),
    [items],
  );

  const wishlistCount = items.length;

  const value = useMemo(
    () => ({
      items,
      wishlistCount,
      toggleItem,
      removeItem,
      isInWishlist,
    }),
    [items, wishlistCount, toggleItem, removeItem, isInWishlist],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }

  return context;
}
