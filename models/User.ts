import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userPreferencesSchema = new mongoose.Schema({
  currency: {
    type: String,
    default: 'USD',
  },
  language: {
    type: String,
    default: 'en',
  },
  theme: {
    type: String,
    enum: ['light', 'dark'],
    default: 'light',
  },
  incomeSources: [{
    name: String,
    isRecurring: Boolean,
    frequency: {
      type: String,
      enum: ['weekly', 'monthly', 'yearly'],
      default: 'monthly'
    }
  }],
  defaultCategories: [{
    name: String,
    type: {
      type: String,
      enum: ['income', 'expense']
    },
    color: String
  }]
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  preferences: {
    type: userPreferencesSchema,
    default: () => ({})
  },
  isOnboarded: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', userSchema); 