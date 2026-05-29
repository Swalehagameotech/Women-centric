import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
    },

    images: [
      {
        type: String,
        required: [true, 'Image URL is required'],
      },
    ],

    description: {
      type: String,
      required: [true, 'Description is required'],
    },

    stock: {
      type: Number,
      required: [true, 'Stock is required'],
      default: 0,
      min: 0,
    },

    categories: {
      type: [String],
      required: [true, 'At least one category is required'],
      validate: [
        {
          validator(value) {
            return value.length >= 1;
          },
          message: 'At least 1 category is required',
        },
        {
          validator(value) {
            return value.length <= 4;
          },
          message: 'Maximum 4 categories allowed',
        },
      ],
    },

    subcategory: {
      type: String,
      required: [true, 'Subcategory is required'],
      trim: true,
    },

    brand: {
      type: String,
      default: '',
      trim: true,
    },

    original_price: {
      type: Number,
      required: [true, 'Original price is required'],
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
      required: [true, 'Discounted price is required'],
      min: 0,
    },

    ratings: {
      type: Number,
      min: 0,
      max: 5,
    },
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', productSchema);

export default Product;
