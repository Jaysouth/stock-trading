const mongoose = require('mongoose');

const tradeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Trade Type
  tradeType: {
    type: String,
    enum: ['ai-trading', 'group-trading', 'self-trading'],
    required: true
  },
  // Trade Details
  symbol: {
    type: String,
    required: true // e.g., EUR/USD
  },
  direction: {
    type: String,
    enum: ['buy', 'sell'],
    required: true
  },
  entryPrice: {
    type: Number,
    required: true
  },
  exitPrice: {
    type: Number
  },
  quantity: {
    type: Number,
    required: true
  },
  leverage: {
    type: Number,
    default: 1
  },
  // Risk Management
  stopLoss: {
    type: Number
  },
  takeProfit: {
    type: Number
  },
  // Trade Status
  status: {
    type: String,
    enum: ['pending', 'open', 'closed', 'cancelled'],
    default: 'pending'
  },
  // Profit/Loss
  profitLoss: {
    type: Number,
    default: 0
  },
  profitLossPercentage: {
    type: Number,
    default: 0
  },
  // Fees
  commission: {
    type: Number,
    default: 0
  },
  swap: {
    type: Number,
    default: 0
  },
  // Timestamps
  openedAt: Date,
  closedAt: Date,
  // AI Trading specific
  aiStrategy: {
    type: String,
    enum: ['conservative', 'balanced', 'aggressive']
  },
  aiSignal: {
    confidence: Number,
    indicators: mongoose.Schema.Types.Mixed
  },
  // Group Trading specific
  tradingGroup: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TradingGroup'
  },
  masterTrade: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trade'
  },
  copyRatio: Number,
  // Broker Information
  brokerOrderId: String,
  broker: {
    type: String,
    enum: ['MT4', 'MT5', 'cTrader']
  },
  // Notes
  notes: String
}, {
  timestamps: true
});

// Calculate P&L before saving closed trades
tradeSchema.pre('save', function(next) {
  if (this.status === 'closed' && this.exitPrice) {
    const priceDiff = this.direction === 'buy' 
      ? this.exitPrice - this.entryPrice 
      : this.entryPrice - this.exitPrice;
    
    this.profitLoss = (priceDiff * this.quantity * this.leverage) - this.commission - this.swap;
    this.profitLossPercentage = (priceDiff / this.entryPrice) * 100;
  }
  next();
});

module.exports = mongoose.model('Trade', tradeSchema);
