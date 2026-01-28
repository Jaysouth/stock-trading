const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['deposit', 'withdrawal', 'transfer', 'profit', 'loss', 'fee', 'referral-bonus'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'cancelled'],
    default: 'pending'
  },
  description: {
    type: String
  },
  // For deposit/withdrawal
  paymentMethod: {
    type: String,
    enum: ['bank-transfer', 'credit-card', 'paypal', 'crypto']
  },
  paymentDetails: {
    type: mongoose.Schema.Types.Mixed
  },
  // Reference to related entities
  relatedTrade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trade'
  },
  relatedGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TradingGroup'
  },
  // Admin verification
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: Date,
  // Transaction ID from payment gateway
  externalTransactionId: String
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
