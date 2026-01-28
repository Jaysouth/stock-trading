const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Trade = require('../models/Trade');
const TradingGroup = require('../models/TradingGroup');
const Wallet = require('../models/Wallet');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
exports.getDashboard = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalGroups = await TradingGroup.countDocuments();
    const totalTrades = await Trade.countDocuments();

    // Get pending transactions
    const pendingDeposits = await Transaction.countDocuments({ 
      type: 'deposit', 
      status: 'pending' 
    });
    const pendingWithdrawals = await Transaction.countDocuments({ 
      type: 'withdrawal', 
      status: 'pending' 
    });

    // Calculate total platform balance
    const wallets = await Wallet.find();
    const totalPlatformBalance = wallets.reduce((sum, wallet) => sum + wallet.totalBalance, 0);

    // Get recent activities
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('firstName lastName email createdAt');

    const recentTrades = await Trade.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('user', 'firstName lastName email');

    // Calculate daily stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayTrades = await Trade.countDocuments({
      createdAt: { $gte: today }
    });

    const todayUsers = await User.countDocuments({
      createdAt: { $gte: today }
    });

    res.status(200).json({
      success: true,
      statistics: {
        users: {
          total: totalUsers,
          active: activeUsers,
          newToday: todayUsers
        },
        trades: {
          total: totalTrades,
          today: todayTrades
        },
        groups: {
          total: totalGroups
        },
        transactions: {
          pendingDeposits,
          pendingWithdrawals
        },
        platform: {
          totalBalance: totalPlatformBalance.toFixed(2)
        }
      },
      recentActivity: {
        users: recentUsers,
        trades: recentTrades
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, status } = req.query;

    const query = {};

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    if (status) {
      query.isActive = status === 'active';
    }

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      users,
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

// @desc    Get user details
// @route   GET /api/admin/users/:id
// @access  Private/Admin
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const wallet = await Wallet.findOne({ user: user._id });
    const trades = await Trade.find({ user: user._id }).limit(10);
    const transactions = await Transaction.find({ user: user._id }).limit(10);

    res.status(200).json({
      success: true,
      user,
      wallet,
      recentTrades: trades,
      recentTransactions: transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update user status
// @route   PUT /api/admin/users/:id/status
// @access  Private/Admin
exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get pending transactions
// @route   GET /api/admin/transactions/pending
// @access  Private/Admin
exports.getPendingTransactions = async (req, res) => {
  try {
    const { type } = req.query;

    const query = { status: 'pending' };

    if (type) {
      query.type = type;
    }

    const transactions = await Transaction.find(query)
      .populate('user', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      transactions
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Approve transaction
// @route   PUT /api/admin/transactions/:id/approve
// @access  Private/Admin
exports.approveTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Transaction is not pending'
      });
    }

    transaction.status = 'completed';
    transaction.verifiedBy = req.user.id;
    transaction.verifiedAt = new Date();
    await transaction.save();

    // Update wallet based on transaction type
    const wallet = await Wallet.findOne({ user: transaction.user });

    if (transaction.type === 'deposit') {
      wallet.tradingBalance += transaction.amount;
      await wallet.save();
    } else if (transaction.type === 'withdrawal') {
      wallet.frozenAmount -= transaction.amount;
      await wallet.save();
    }

    res.status(200).json({
      success: true,
      message: 'Transaction approved successfully',
      transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Reject transaction
// @route   PUT /api/admin/transactions/:id/reject
// @access  Private/Admin
exports.rejectTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    if (transaction.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Transaction is not pending'
      });
    }

    transaction.status = 'failed';
    transaction.verifiedBy = req.user.id;
    transaction.verifiedAt = new Date();
    await transaction.save();

    // Unfreeze amount for withdrawal
    if (transaction.type === 'withdrawal') {
      const wallet = await Wallet.findOne({ user: transaction.user });
      wallet.frozenAmount -= transaction.amount;
      await wallet.save();
    }

    res.status(200).json({
      success: true,
      message: 'Transaction rejected',
      transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all trades
// @route   GET /api/admin/trades
// @access  Private/Admin
exports.getAllTrades = async (req, res) => {
  try {
    const { page = 1, limit = 20, tradeType, status } = req.query;

    const query = {};

    if (tradeType) {
      query.tradeType = tradeType;
    }

    if (status) {
      query.status = status;
    }

    const trades = await Trade.find(query)
      .populate('user', 'firstName lastName email')
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

// @desc    Get platform statistics
// @route   GET /api/admin/statistics
// @access  Private/Admin
exports.getStatistics = async (req, res) => {
  try {
    const { period = 'month' } = req.query;

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
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(0);
    }

    // Get trades statistics
    const trades = await Trade.find({
      createdAt: { $gte: startDate },
      status: 'closed'
    });

    const totalProfit = trades.reduce((sum, t) => sum + Math.max(0, t.profitLoss), 0);
    const totalLoss = trades.reduce((sum, t) => sum + Math.min(0, t.profitLoss), 0);
    const winTrades = trades.filter(t => t.profitLoss > 0).length;

    // Get new users
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate }
    });

    // Get transactions
    const deposits = await Transaction.find({
      type: 'deposit',
      status: 'completed',
      createdAt: { $gte: startDate }
    });

    const withdrawals = await Transaction.find({
      type: 'withdrawal',
      status: 'completed',
      createdAt: { $gte: startDate }
    });

    const totalDeposits = deposits.reduce((sum, t) => sum + t.amount, 0);
    const totalWithdrawals = withdrawals.reduce((sum, t) => sum + t.amount, 0);

    res.status(200).json({
      success: true,
      period,
      statistics: {
        trades: {
          total: trades.length,
          winTrades,
          lossTrades: trades.length - winTrades,
          winRate: trades.length > 0 ? ((winTrades / trades.length) * 100).toFixed(2) : 0,
          totalProfit: totalProfit.toFixed(2),
          totalLoss: Math.abs(totalLoss).toFixed(2),
          netProfit: (totalProfit + totalLoss).toFixed(2)
        },
        users: {
          new: newUsers
        },
        transactions: {
          deposits: {
            count: deposits.length,
            total: totalDeposits.toFixed(2)
          },
          withdrawals: {
            count: withdrawals.length,
            total: totalWithdrawals.toFixed(2)
          }
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
