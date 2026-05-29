export const buildLineItemFromProduct = (product, quantity = 1) => {
  const qty = Math.max(1, Math.floor(quantity));
  const discountedPrice = product.discounted_price ?? 0;

  return {
    product: product._id,
    name: product.name,
    brand: product.brand || '',
    image: product.images?.[0] || '',
    quantity: qty,
    original_price: product.original_price ?? 0,
    discount_percent: product.discount_percent ?? 0,
    discounted_price: discountedPrice,
    line_total: discountedPrice * qty,
  };
};

export const calcItemsSubtotal = (items) =>
  items.reduce((sum, item) => sum + (item.line_total || 0), 0);
