const mongoose = require('mongoose');

const groupMemberSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TradingGroup',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Member Role
  role: {
    type: String,
    enum: ['admin', 'master-trader', 'investor', 'observer'],
    default: 'investor'
  },
  // Investment Details
  investedAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  currentBalance: {
    type: Number,
    default: 0
  },
  totalProfit: {
    type: Number,
    default: 0
  },
  totalLoss: {
    type: Number,
    default: 0
  },
  // Copy Trading Settings
  copyTradingEnabled: {
    type: Boolean,
    default: true
  },
  copyRatio: {
    type: Number,
    default: 1
  },
  maxCopyAmount: {
    type: Number
  },
  // Status
  status: {
    type: String,
    enum: ['pending', 'active', 'suspended', 'left'],
    default: 'pending'
  },
  // Dates
  joinedAt: Date,
  leftAt: Date,
  lastActivityAt: Date,
  // Subscription (if applicable)
  subscriptionStatus: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  subscriptionExpiresAt: Date,
  // Performance Tracking
  winTrades: {
    type: Number,
    default: 0
  },
  lossTrades: {
    type: Number,
    default: 0
  },
  winRate: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Update win rate on save
groupMemberSchema.pre('save', function(next) {
  const totalTrades = this.winTrades + this.lossTrades;
  if (totalTrades > 0) {
    this.winRate = (this.winTrades / totalTrades) * 100;
  } else {
    this.winRate = 0;
  }
  next();
});

module.exports = mongoose.model('GroupMember', groupMemberSchema);
