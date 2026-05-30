import Cart from '../model/cart.js';
import Order from '../model/order.js';
import Address from '../model/address.js';
import Product from '../model/product.js';

const generateOrderNumber = () => {
  const timePart = Date.now().toString(36).toUpperCase();
  const randomPart = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `SBH-${timePart}-${randomPart}`;
};

const buildShippingSnapshot = (address) => ({
  fullName: address.fullName,
  phone: address.phone,
  landmark: address.landmark,
  city: address.city,
  state: address.state,
  postalCode: address.postalCode,
});

export const createOrder = async (req, res) => {
  try {
    const { addressId, deliveryCharges = 0, paymentMethod = 'cod', notes = '' } = req.body;

    if (!addressId) {
      return res.status(400).json({
        success: false,
        message: 'addressId is required',
      });
    }

    const address = await Address.findOne({
      _id: addressId,
      user: req.user._id,
    });

    if (!address) {
      return res.status(404).json({
        success: false,
        message: 'Address not found',
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    for (const item of cart.items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product "${item.name}" is no longer available`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Not enough stock for "${item.name}"`,
        });
      }
    }

    const orderItems = cart.items.map((item) => ({
      product: item.product,
      name: item.name,
      brand: item.brand,
      image: item.image,
      quantity: item.quantity,
      original_price: item.original_price,
      discount_percent: item.discount_percent,
      discounted_price: item.discounted_price,
      line_total: item.line_total,
    }));

    const subtotal = orderItems.reduce((sum, item) => sum + item.line_total, 0);
    const delivery = Math.max(0, Number(deliveryCharges) || 0);
    const total = subtotal + delivery;

    const order = await Order.create({
      user: req.user._id,
      orderNumber: generateOrderNumber(),
      items: orderItems,
      shippingAddress: buildShippingSnapshot(address),
      address: address._id,
      subtotal,
      deliveryCharges: delivery,
      total,
      paymentMethod,
      notes,
      status: 'placed',
      paymentStatus: 'pending',
    });

    for (const item of orderItems) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.quantity },
      });
    }

    cart.items = [];
    cart.recalculateTotals();
    await cart.save();

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const CANCELLABLE_STATUSES = ['placed', 'pending', 'processing'];

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: 'Order is already cancelled',
      });
    }

    if (!CANCELLABLE_STATUSES.includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'This order can no longer be cancelled',
      });
    }

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity },
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
