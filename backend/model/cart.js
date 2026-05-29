import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      default: '',
      trim: true,
    },

    image: {
      type: String,
      default: '',
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },

    original_price: {
      type: Number,
      required: true,
      min: 0,
    },

    discount_percent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    discounted_price: {
      type: Number,
      required: true,
      min: 0,
    },

    line_total: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: true },
);

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      unique: true,
      index: true,
    },

    items: {
      type: [cartItemSchema],
      default: [],
    },

    subtotal: {
      type: Number,
      default: 0,
      min: 0,
    },

    itemCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true },
);

cartSchema.methods.recalculateTotals = function recalculateTotals() {
  this.subtotal = this.items.reduce((sum, item) => sum + item.line_total, 0);
  this.itemCount = this.items.reduce((sum, item) => sum + item.quantity, 0);
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
