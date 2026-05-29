import { authFetch } from './api';

export const syncCartToServer = async (items) => {
  await authFetch('/api/cart', { method: 'DELETE' });

  for (const item of items) {
    await authFetch('/api/cart/items', {
      method: 'POST',
      body: JSON.stringify({ productId: item._id, quantity: item.quantity }),
    });
  }
};

export const placeOrderWithAddress = async (addressId, deliveryCharges = 0) => {
  return authFetch('/api/orders', {
    method: 'POST',
    body: JSON.stringify({
      addressId,
      deliveryCharges,
      paymentMethod: 'cod',
    }),
  });
};
