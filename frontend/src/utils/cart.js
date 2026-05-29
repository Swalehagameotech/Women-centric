const CART_KEY = 'basket_items';

export const getCart = () => {
  const raw = localStorage.getItem(CART_KEY);
  if (!raw) return [];

  try {
    const items = JSON.parse(raw);
    return Array.isArray(items) ? items : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem(CART_KEY, JSON.stringify(items));
};

export const toCartItem = (product) => ({
  _id: product._id,
  name: product.name,
  brand: product.brand || '',
  images: product.images || [],
  discounted_price: product.discounted_price,
  original_price: product.original_price,
  discount_percent: product.discount_percent || 0,
  quantity: 1,
});

export const addItem = (product, quantity = 1) => {
  const cart = getCart();
  const existing = cart.find((item) => item._id === product._id);
  const amount = Math.max(1, Math.floor(quantity));

  if (existing) {
    existing.quantity += amount;
  } else {
    cart.push({ ...toCartItem(product), quantity: amount });
  }

  saveCart(cart);
  return cart;
};

export const updateItemQuantity = (productId, quantity) => {
  const cart = getCart();
  const nextQuantity = Math.max(0, Math.floor(quantity));

  const updated = cart
    .map((item) =>
      item._id === productId ? { ...item, quantity: nextQuantity } : item,
    )
    .filter((item) => item.quantity > 0);

  saveCart(updated);
  return updated;
};

export const removeItem = (productId) => {
  const updated = getCart().filter((item) => item._id !== productId);
  saveCart(updated);
  return updated;
};

export const clearCart = () => {
  saveCart([]);
  return [];
};

export const getCartCount = (items = getCart()) =>
  items.reduce((total, item) => total + (item.quantity || 0), 0);
