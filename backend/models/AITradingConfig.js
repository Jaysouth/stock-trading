const mongoose = require('mongoose');

const aiTradingConfigSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Trading Mode
  tradingMode: {
    type: String,
    enum: ['conservative', 'balanced', 'aggressive'],
    default: 'balanced'
  },
  // Capital Allocation
  allocatedCapital: {
    type: Number,
    required: true,
    min: 0
  },
  // Risk Management
  maxDailyLoss: {
    type: Number,
    default: 5, // percentage
    min: 1,
    max: 20
  },
  maxDrawdown: {
    type: Number,
    default: 10, // percentage
    min: 5,
    max: 30
  },
  stopLossPercentage: {
    type: Number,
    default: 2,
    min: 0.5,
    max: 10
  },
  takeProfitPercentage: {
    type: Number,
    default: 4,
    min: 1,
    max: 20
  },
  // Trading Parameters
  maxPositionSize: {
    type: Number,
    default: 1000
  },
  maxConcurrentTrades: {
    type: Number,
    default: 3,
    min: 1,
    max: 10
  },
  // Indicators Configuration
  useRSI: {
    type: Boolean,
    default: true
  },
  useMACD: {
    type: Boolean,
    default: true
  },
  useEMA: {
    type: Boolean,
    default: true
  },
  useBollingerBands: {
    type: Boolean,
    default: true
  },
  // Trading Pairs
  tradingPairs: [{
    type: String,
    default: ['EUR/USD', 'GBP/USD', 'USD/JPY']
  }],
  // Auto-Pause System
  autoPauseEnabled: {
    type: Boolean,
    default: true
  },
  pauseOnDailyLossReached: {
    type: Boolean,
    default: true
  },
  // Status
  isActive: {
    type: Boolean,
    default: false
  },
  isPaused: {
    type: Boolean,
    default: false
  },
  pauseReason: String,
  // Manual Override
  manualOverrideEnabled: {
    type: Boolean,
    default: true
  },
  // Performance Tracking
  currentDailyLoss: {
    type: Number,
    default: 0
  },
  currentDrawdown: {
    type: Number,
    default: 0
  },
  lastResetDate: Date
}, {
  timestamps: true
});

// Reset daily counters
aiTradingConfigSchema.methods.resetDailyCounters = function() {
  this.currentDailyLoss = 0;
  this.lastResetDate = new Date();
  this.isPaused = false;
  this.pauseReason = null;
};

module.exports = mongoose.model('AITradingConfig', aiTradingConfigSchema);
