const WISHLIST_KEY = 'wishlist_items';

export const getWishlist = () => {
  const raw = localStorage.getItem(WISHLIST_KEY);
  if (!raw) return [];

  try {
    const items = JSON.parse(raw);
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

const saveWishlist = (items) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
};

export const toWishlistItem = (product) => ({
  _id: product._id,
  name: product.name,
  brand: product.brand || '',
  images: product.images || [],
  discounted_price: product.discounted_price,
  original_price: product.original_price,
  discount_percent: product.discount_percent || 0,
});

export const addToWishlist = (product) => {
  const wishlist = getWishlist();
  const exists = wishlist.some((item) => item._id === product._id);

  if (!exists) {
    wishlist.push(toWishlistItem(product));
    saveWishlist(wishlist);
  }

  return wishlist;
};

export const removeFromWishlist = (productId) => {
  const updated = getWishlist().filter((item) => item._id !== productId);
  saveWishlist(updated);
  return updated;
};

export const toggleWishlist = (product) => {
  const wishlist = getWishlist();
  const exists = wishlist.some((item) => item._id === product._id);

  if (exists) {
    return removeFromWishlist(product._id);
  }

  return addToWishlist(product);
};

export const isInWishlist = (productId, items = getWishlist()) =>
  items.some((item) => item._id === productId);
