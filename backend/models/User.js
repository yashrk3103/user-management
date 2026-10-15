const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  USER: 'user',
};

const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email'],
    },
    avatar: {
      type: String,
      default: '',
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(ROLES),
      default: ROLES.USER,
    },
    status: {
      type: String,
      enum: Object.values(STATUS),
      default: STATUS.ACTIVE,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    isOnline: {
      type: Boolean,
      default: false,
      index: true,
    },
    lastSeenAt: {
      type: Date,
      default: null,
      index: true,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    lastLogoutAt: {
      type: Date,
      default: null,
    },
    lastBrowser: {
      type: String,
      default: 'Other',
    },
    lastDeviceType: {
      type: String,
      default: 'unknown',
    },
    lastUserAgent: {
      type: String,
      default: '',
    },
    lastIp: {
      type: String,
      default: '',
    },
    sessionInvalidAfter: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// High-performance indexes for search, filtering, and dashboard analytics
userSchema.index({ name: 'text', email: 'text' }, { weights: { name: 3, email: 1 } });
userSchema.index({ role: 1, status: 1, createdAt: -1 });
userSchema.index({ status: 1, isOnline: 1, lastSeenAt: -1 });
userSchema.index({ createdAt: -1 });

userSchema.pre('save', async function () {
  if (!this.isModified('passwordHash')) return;

  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
