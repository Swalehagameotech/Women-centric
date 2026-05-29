import mongoose from 'mongoose';

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },

    fullName: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },

    phone: {
      type: String,
      required: [true, 'Number is required'],
      trim: true,
    },

    landmark: {
      type: String,
      required: [true, 'Landmark is required'],
      trim: true,
    },

    city: {
      type: String,
      required: [true, 'City is required'],
      trim: true,
    },

    state: {
      type: String,
      required: [true, 'State is required'],
      trim: true,
    },

    postalCode: {
      type: String,
      required: [true, 'Pincode is required'],
      trim: true,
    },

    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

addressSchema.index({ user: 1, isDefault: 1 });

const Address = mongoose.model('Address', addressSchema);

export default Address;
