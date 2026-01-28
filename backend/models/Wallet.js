const mongoose = require('mongoose');

const walletSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Trading Capital
  tradingBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  // Profit Wallet
  profitBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  // Referral Wallet
  referralBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  // Total Balance (for display)
  totalBalance: {
    type: Number,
    default: 0,
    min: 0
  },
  // Allocated to AI Trading
  aiTradingAllocation: {
    type: Number,
    default: 0,
    min: 0
  },
  // Allocated to Group Trading
  groupTradingAllocation: {
    type: Number,
    default: 0,
    min: 0
  },
  // Allocated to Self Trading
  selfTradingAllocation: {
    type: Number,
    default: 0,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD',
    enum: ['USD', 'EUR', 'GBP', 'JPY']
  },
  // Frozen amount (pending withdrawals)
  frozenAmount: {
    type: Number,
    default: 0,
    min: 0
  }
}, {
  timestamps: true
});

// Calculate total balance before saving
walletSchema.pre('save', function(next) {
  this.totalBalance = this.tradingBalance + this.profitBalance + this.referralBalance - this.frozenAmount;
  next();
});

module.exports = mongoose.model('Wallet', walletSchema);
