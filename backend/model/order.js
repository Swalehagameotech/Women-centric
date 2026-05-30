import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
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
  { _id: false },
);

const shippingAddressSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    landmark: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },

    orderNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    items: {
      type: [orderItemSchema],
      validate: {
        validator(value) {
          return value.length >= 1;
        },
        message: 'Order must contain at least one product',
      },
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: [true, 'Shipping address is required'],
    },

    address: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryCharges: {
      type: Number,
      default: 0,
      min: 0,
    },

    total: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ['placed', 'processing', 'shipped', 'delivered', 'cancelled', 'pending', 'confirmed'],
      default: 'placed',
    },

    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },

    paymentMethod: {
      type: String,
      default: 'cod',
      trim: true,
    },

    notes: {
      type: String,
      default: '',
      trim: true,
    },
  },
  { timestamps: true },
);

orderSchema.index({ user: 1, createdAt: -1 });

orderSchema.pre('save', function applyPaidOnDelivered() {
  if (this.isModified('status') && this.status === 'delivered') {
    this.paymentStatus = 'paid';
  }
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
