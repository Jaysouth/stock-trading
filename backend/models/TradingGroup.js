const mongoose = require('mongoose');

const tradingGroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  // Group Type
  groupType: {
    type: String,
    enum: ['public', 'private', 'signal', 'managed-pool'],
    required: true
  },
  // Group Admin/Master Trader
  masterTrader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Group Settings
  isActive: {
    type: Boolean,
    default: true
  },
  isAcceptingMembers: {
    type: Boolean,
    default: true
  },
  maxMembers: {
    type: Number,
    default: 100
  },
  minimumInvestment: {
    type: Number,
    default: 100
  },
  // Profit Sharing
  profitSharePercentage: {
    type: Number,
    required: true,
    min: 0,
    max: 50 // Master trader's share
  },
  // Copy Trading Settings
  copyTradingEnabled: {
    type: Boolean,
    default: true
  },
  defaultCopyRatio: {
    type: Number,
    default: 1,
    min: 0.1,
    max: 10
  },
  // Group Statistics
  totalMembers: {
    type: Number,
    default: 0
  },
  totalCapital: {
    type: Number,
    default: 0
  },
  totalProfit: {
    type: Number,
    default: 0
  },
  winRate: {
    type: Number,
    default: 0
  },
  totalTrades: {
    type: Number,
    default: 0
  },
  // Performance Metrics
  monthlyROI: {
    type: Number,
    default: 0
  },
  weeklyROI: {
    type: Number,
    default: 0
  },
  maxDrawdown: {
    type: Number,
    default: 0
  },
  // Subscription/Access
  subscriptionFee: {
    type: Number,
    default: 0
  },
  subscriptionPeriod: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    default: 'monthly'
  },
  // Approval Settings (for private groups)
  requiresApproval: {
    type: Boolean,
    default: false
  },
  // Trading Strategy
  tradingStrategy: {
    type: String
  },
  riskLevel: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('TradingGroup', tradingGroupSchema);
