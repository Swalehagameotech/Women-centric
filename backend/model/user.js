import mongoose from 'mongoose';
import { formatName, validateName } from '../utils/validateName.js';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      validate: {
        validator(value) {
          return validateName(value) === null;
        },
        message: (props) => validateName(props.value) || 'Invalid name',
      },
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },

    phone: {
      type: String,
      default: '',
      trim: true,
      validate: {
        validator(value) {
          if (!value) return true;
          const digits = value.replace(/\D/g, '');
          return digits.length >= 10 && digits.length <= 15;
        },
        message: 'Please enter a valid phone number',
      },
    },

    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
  },
  { timestamps: true }
);

userSchema.pre('save', function normalizeName() {
  if (this.isModified('name')) {
    this.name = formatName(this.name);
  }
});

const User = mongoose.model('User', userSchema);

export default User;
