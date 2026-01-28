const AITradingConfig = require('../models/AITradingConfig');
const Trade = require('../models/Trade');
const Wallet = require('../models/Wallet');

// @desc    Get AI trading configuration
// @route   GET /api/ai-trading/config
// @access  Private
exports.getConfig = async (req, res) => {
  try {
    let config = await AITradingConfig.findOne({ user: req.user.id });

    if (!config) {
      // Create default config
      config = await AITradingConfig.create({
        user: req.user.id,
        tradingMode: 'balanced',
        allocatedCapital: 0
      });
    }

    res.status(200).json({
      success: true,
      config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update AI trading configuration
// @route   PUT /api/ai-trading/config
// @access  Private
exports.updateConfig = async (req, res) => {
  try {
    const {
      tradingMode,
      allocatedCapital,
      maxDailyLoss,
      maxDrawdown,
      stopLossPercentage,
      takeProfitPercentage,
      maxPositionSize,
      maxConcurrentTrades,
      tradingPairs,
      useRSI,
      useMACD,
      useEMA,
      useBollingerBands,
      autoPauseEnabled,
      manualOverrideEnabled
    } = req.body;

    let config = await AITradingConfig.findOne({ user: req.user.id });

    if (!config) {
      config = await AITradingConfig.create({
        user: req.user.id,
        ...req.body
      });
    } else {
      config = await AITradingConfig.findOneAndUpdate(
        { user: req.user.id },
        req.body,
        { new: true, runValidators: true }
      );
    }

    res.status(200).json({
      success: true,
      config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Start AI trading
// @route   POST /api/ai-trading/start
// @access  Private
exports.startTrading = async (req, res) => {
  try {
    const config = await AITradingConfig.findOne({ user: req.user.id });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'AI trading configuration not found'
      });
    }

    if (config.allocatedCapital <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please allocate capital before starting AI trading'
      });
    }

    config.isActive = true;
    config.isPaused = false;
    config.lastResetDate = new Date();
    await config.save();

    res.status(200).json({
      success: true,
      message: 'AI trading started successfully',
      config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Stop AI trading
// @route   POST /api/ai-trading/stop
// @access  Private
exports.stopTrading = async (req, res) => {
  try {
    const config = await AITradingConfig.findOne({ user: req.user.id });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'AI trading configuration not found'
      });
    }

    config.isActive = false;
    await config.save();

    res.status(200).json({
      success: true,
      message: 'AI trading stopped successfully',
      config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Pause AI trading
// @route   POST /api/ai-trading/pause
// @access  Private
exports.pauseTrading = async (req, res) => {
  try {
    const { reason } = req.body;
    const config = await AITradingConfig.findOne({ user: req.user.id });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'AI trading configuration not found'
      });
    }

    config.isPaused = true;
    config.pauseReason = reason || 'Manual pause';
    await config.save();

    res.status(200).json({
      success: true,
      message: 'AI trading paused successfully',
      config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Resume AI trading
// @route   POST /api/ai-trading/resume
// @access  Private
exports.resumeTrading = async (req, res) => {
  try {
    const config = await AITradingConfig.findOne({ user: req.user.id });

    if (!config) {
      return res.status(404).json({
        success: false,
        message: 'AI trading configuration not found'
      });
    }

    config.isPaused = false;
    config.pauseReason = null;
    await config.save();

    res.status(200).json({
      success: true,
      message: 'AI trading resumed successfully',
      config
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get AI trading performance
// @route   GET /api/ai-trading/performance
// @access  Private
exports.getPerformance = async (req, res) => {
  try {
    const { period = 'all' } = req.query;

    const query = {
      user: req.user.id,
      tradeType: 'ai-trading'
    };

    // Filter by period
    if (period !== 'all') {
      const now = new Date();
      let startDate;

      switch (period) {
        case 'today':
          startDate = new Date(now.setHours(0, 0, 0, 0));
          break;
        case 'week':
          startDate = new Date(now.setDate(now.getDate() - 7));
          break;
        case 'month':
          startDate = new Date(now.setMonth(now.getMonth() - 1));
          break;
        default:
          startDate = null;
      }

      if (startDate) {
        query.createdAt = { $gte: startDate };
      }
    }

    const trades = await Trade.find(query);

    // Calculate statistics
    const totalTrades = trades.length;
    const closedTrades = trades.filter(t => t.status === 'closed');
    const winTrades = closedTrades.filter(t => t.profitLoss > 0);
    const lossTrades = closedTrades.filter(t => t.profitLoss < 0);

    const totalProfit = closedTrades.reduce((sum, t) => sum + Math.max(0, t.profitLoss), 0);
    const totalLoss = closedTrades.reduce((sum, t) => sum + Math.min(0, t.profitLoss), 0);
    const netProfit = totalProfit + totalLoss;

    const winRate = closedTrades.length > 0 
      ? ((winTrades.length / closedTrades.length) * 100).toFixed(2)
      : '0.00';

    // Get config for drawdown
    const config = await AITradingConfig.findOne({ user: req.user.id });

    res.status(200).json({
      success: true,
      performance: {
        totalTrades,
        closedTrades: closedTrades.length,
        openTrades: totalTrades - closedTrades.length,
        winTrades: winTrades.length,
        lossTrades: lossTrades.length,
        winRate: winRate.toFixed(2),
        totalProfit: totalProfit.toFixed(2),
        totalLoss: Math.abs(totalLoss).toFixed(2),
        netProfit: netProfit.toFixed(2),
        currentDrawdown: config ? config.currentDrawdown : 0,
        currentDailyLoss: config ? config.currentDailyLoss : 0
      },
      trades: closedTrades.slice(0, 10) // Last 10 trades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get AI trading trades
// @route   GET /api/ai-trading/trades
// @access  Private
exports.getTrades = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = {
      user: req.user.id,
      tradeType: 'ai-trading'
    };

    if (status) {
      query.status = status;
    }

    const trades = await Trade.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Trade.countDocuments(query);

    res.status(200).json({
      success: true,
      trades,
      totalPages: Math.ceil(count / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
