import Cart from '../model/cart.js';
import Product from '../model/product.js';
import { buildLineItemFromProduct } from '../utils/productSnapshot.js';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }

  return cart;
};

export const getMyCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.recalculateTotals();
    await cart.save();

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'Product ID is required',
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (product.stock < 1) {
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock',
      });
    }

    const cart = await getOrCreateCart(req.user._id);
    const existingIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString(),
    );

    const nextQuantity =
      existingIndex >= 0 ? cart.items[existingIndex].quantity + Number(quantity) : Number(quantity);

    if (nextQuantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available',
      });
    }

    const lineItem = buildLineItemFromProduct(product, nextQuantity);

    if (existingIndex >= 0) {
      cart.items[existingIndex] = lineItem;
    } else {
      cart.items.push(lineItem);
    }

    cart.recalculateTotals();
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be at least 1',
      });
    }

    const cart = await getOrCreateCart(req.user._id);
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId.toString(),
    );

    if (itemIndex < 0) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    if (quantity > product.stock) {
      return res.status(400).json({
        success: false,
        message: 'Not enough stock available',
      });
    }

    cart.items[itemIndex] = buildLineItemFromProduct(product, quantity);
    cart.recalculateTotals();
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart item updated',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const cart = await getOrCreateCart(req.user._id);

    cart.items = cart.items.filter((item) => item.product.toString() !== productId.toString());
    cart.recalculateTotals();
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user._id);
    cart.items = [];
    cart.recalculateTotals();
    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
