const Trade = require('../models/Trade');

// @desc    Get self trading trades
// @route   GET /api/self-trading/trades
// @access  Private
exports.getTrades = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;

    const query = {
      user: req.user.id,
      tradeType: 'self-trading'
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

// @desc    Create manual trade
// @route   POST /api/self-trading/trades
// @access  Private
exports.createTrade = async (req, res) => {
  try {
    const {
      symbol,
      direction,
      quantity,
      entryPrice,
      stopLoss,
      takeProfit,
      leverage,
      broker,
      notes
    } = req.body;

    const trade = await Trade.create({
      user: req.user.id,
      tradeType: 'self-trading',
      symbol,
      direction,
      quantity,
      entryPrice,
      stopLoss,
      takeProfit,
      leverage: leverage || 1,
      broker,
      notes,
      status: 'open',
      openedAt: new Date()
    });

    res.status(201).json({
      success: true,
      trade
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Close trade
// @route   PUT /api/self-trading/trades/:id/close
// @access  Private
exports.closeTrade = async (req, res) => {
  try {
    const { exitPrice } = req.body;
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found'
      });
    }

    if (trade.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to close this trade'
      });
    }

    if (trade.status !== 'open') {
      return res.status(400).json({
        success: false,
        message: 'Trade is not open'
      });
    }

    trade.exitPrice = exitPrice;
    trade.status = 'closed';
    trade.closedAt = new Date();
    await trade.save();

    res.status(200).json({
      success: true,
      trade
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update trade
// @route   PUT /api/self-trading/trades/:id
// @access  Private
exports.updateTrade = async (req, res) => {
  try {
    const { stopLoss, takeProfit, notes } = req.body;
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({
        success: false,
        message: 'Trade not found'
      });
    }

    if (trade.user.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this trade'
      });
    }

    if (stopLoss) trade.stopLoss = stopLoss;
    if (takeProfit) trade.takeProfit = takeProfit;
    if (notes) trade.notes = notes;

    await trade.save();

    res.status(200).json({
      success: true,
      trade
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get trading performance
// @route   GET /api/self-trading/performance
// @access  Private
exports.getPerformance = async (req, res) => {
  try {
    const { period = 'all' } = req.query;

    const query = {
      user: req.user.id,
      tradeType: 'self-trading'
    };

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

    const totalTrades = trades.length;
    const closedTrades = trades.filter(t => t.status === 'closed');
    const winTrades = closedTrades.filter(t => t.profitLoss > 0);
    const lossTrades = closedTrades.filter(t => t.profitLoss < 0);

    const totalProfit = closedTrades.reduce((sum, t) => sum + Math.max(0, t.profitLoss), 0);
    const totalLoss = closedTrades.reduce((sum, t) => sum + Math.min(0, t.profitLoss), 0);
    const netProfit = totalProfit + totalLoss;

    const winRate = closedTrades.length > 0 ? (winTrades.length / closedTrades.length) * 100 : 0;

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
        netProfit: netProfit.toFixed(2)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
