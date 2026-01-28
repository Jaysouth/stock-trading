const Wallet = require('../models/Wallet');
const Transaction = require('../models/Transaction');

// @desc    Get user wallet
// @route   GET /api/wallet
// @access  Private
exports.getWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    res.status(200).json({
      success: true,
      wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Deposit funds
// @route   POST /api/wallet/deposit
// @access  Private
exports.deposit = async (req, res) => {
  try {
    const { amount, paymentMethod, paymentDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Create transaction
    const transaction = await Transaction.create({
      user: req.user.id,
      type: 'deposit',
      amount,
      paymentMethod,
      paymentDetails,
      status: 'pending',
      description: 'Deposit to trading account'
    });

    res.status(201).json({
      success: true,
      message: 'Deposit request submitted. Awaiting verification.',
      transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Withdraw funds
// @route   POST /api/wallet/withdraw
// @access  Private
exports.withdraw = async (req, res) => {
  try {
    const { amount, paymentMethod, paymentDetails } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    // Get user wallet
    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Check available balance (trading + profit + referral - frozen)
    const availableBalance = wallet.tradingBalance + wallet.profitBalance + wallet.referralBalance - wallet.frozenAmount;

    if (amount > availableBalance) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Freeze amount
    wallet.frozenAmount += amount;
    await wallet.save();

    // Create transaction
    const transaction = await Transaction.create({
      user: req.user.id,
      type: 'withdrawal',
      amount,
      paymentMethod,
      paymentDetails,
      status: 'pending',
      description: 'Withdrawal from trading account'
    });

    res.status(201).json({
      success: true,
      message: 'Withdrawal request submitted. Awaiting verification.',
      transaction
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Transfer funds between wallets
// @route   POST /api/wallet/transfer
// @access  Private
exports.transfer = async (req, res) => {
  try {
    const { from, to, amount } = req.body;

    const validWalletTypes = ['trading', 'profit', 'referral'];

    if (!validWalletTypes.includes(from) || !validWalletTypes.includes(to)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid wallet type'
      });
    }

    if (from === to) {
      return res.status(400).json({
        success: false,
        message: 'Cannot transfer to the same wallet'
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    // Check source balance
    const sourceBalance = wallet[`${from}Balance`];
    if (amount > sourceBalance) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient balance'
      });
    }

    // Transfer
    wallet[`${from}Balance`] -= amount;
    wallet[`${to}Balance`] += amount;
    await wallet.save();

    // Create transaction record
    await Transaction.create({
      user: req.user.id,
      type: 'transfer',
      amount,
      status: 'completed',
      description: `Transfer from ${from} wallet to ${to} wallet`
    });

    res.status(200).json({
      success: true,
      message: 'Transfer successful',
      wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get transaction history
// @route   GET /api/wallet/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const { page = 1, limit = 20, type, status } = req.query;

    const query = { user: req.user.id };

    if (type) {
      query.type = type;
    }

    if (status) {
      query.status = status;
    }

    const transactions = await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Transaction.countDocuments(query);

    res.status(200).json({
      success: true,
      transactions,
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

// @desc    Allocate capital to trading module
// @route   POST /api/wallet/allocate
// @access  Private
exports.allocateCapital = async (req, res) => {
  try {
    const { module, amount } = req.body;

    const validModules = ['aiTrading', 'groupTrading', 'selfTrading'];

    if (!validModules.includes(module)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid module'
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amount'
      });
    }

    const wallet = await Wallet.findOne({ user: req.user.id });

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: 'Wallet not found'
      });
    }

    if (amount > wallet.tradingBalance) {
      return res.status(400).json({
        success: false,
        message: 'Insufficient trading balance'
      });
    }

    // Allocate
    wallet.tradingBalance -= amount;
    wallet[`${module}Allocation`] += amount;
    await wallet.save();

    res.status(200).json({
      success: true,
      message: 'Capital allocated successfully',
      wallet
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
