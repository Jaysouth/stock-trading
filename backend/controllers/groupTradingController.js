const TradingGroup = require('../models/TradingGroup');
const GroupMember = require('../models/GroupMember');
const Trade = require('../models/Trade');

// @desc    Create trading group
// @route   POST /api/group-trading/groups
// @access  Private
exports.createGroup = async (req, res) => {
  try {
    const {
      name,
      description,
      groupType,
      profitSharePercentage,
      minimumInvestment,
      maxMembers,
      subscriptionFee,
      subscriptionPeriod,
      tradingStrategy,
      riskLevel
    } = req.body;

    const group = await TradingGroup.create({
      name,
      description,
      groupType,
      masterTrader: req.user.id,
      profitSharePercentage,
      minimumInvestment,
      maxMembers,
      subscriptionFee,
      subscriptionPeriod,
      tradingStrategy,
      riskLevel
    });

    // Add creator as admin member
    await GroupMember.create({
      group: group._id,
      user: req.user.id,
      role: 'admin',
      status: 'active',
      joinedAt: new Date()
    });

    res.status(201).json({
      success: true,
      group
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all trading groups
// @route   GET /api/group-trading/groups
// @access  Public
exports.getGroups = async (req, res) => {
  try {
    const { groupType, search, page = 1, limit = 20 } = req.query;

    const query = { isActive: true };

    if (groupType) {
      query.groupType = groupType;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const groups = await TradingGroup.find(query)
      .populate('masterTrader', 'firstName lastName')
      .sort({ totalMembers: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await TradingGroup.countDocuments(query);

    res.status(200).json({
      success: true,
      groups,
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

// @desc    Get single trading group
// @route   GET /api/group-trading/groups/:id
// @access  Public
exports.getGroup = async (req, res) => {
  try {
    const group = await TradingGroup.findById(req.params.id)
      .populate('masterTrader', 'firstName lastName email');

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    // Get recent trades
    const recentTrades = await Trade.find({
      tradingGroup: group._id,
      status: 'closed'
    })
      .sort({ closedAt: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      group,
      recentTrades
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Join trading group
// @route   POST /api/group-trading/groups/:id/join
// @access  Private
exports.joinGroup = async (req, res) => {
  try {
    const { investmentAmount, copyRatio } = req.body;
    const groupId = req.params.id;

    const group = await TradingGroup.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: 'Group not found'
      });
    }

    if (!group.isActive || !group.isAcceptingMembers) {
      return res.status(400).json({
        success: false,
        message: 'Group is not accepting new members'
      });
    }

    if (investmentAmount < group.minimumInvestment) {
      return res.status(400).json({
        success: false,
        message: `Minimum investment is ${group.minimumInvestment}`
      });
    }

    if (group.totalMembers >= group.maxMembers) {
      return res.status(400).json({
        success: false,
        message: 'Group is full'
      });
    }

    // Check if user is already a member
    const existingMember = await GroupMember.findOne({
      group: groupId,
      user: req.user.id,
      status: { $ne: 'left' }
    });

    if (existingMember) {
      return res.status(400).json({
        success: false,
        message: 'Already a member of this group'
      });
    }

    // Create membership
    const member = await GroupMember.create({
      group: groupId,
      user: req.user.id,
      role: 'investor',
      investedAmount: investmentAmount,
      currentBalance: investmentAmount,
      copyRatio: copyRatio || group.defaultCopyRatio,
      status: group.requiresApproval ? 'pending' : 'active',
      joinedAt: group.requiresApproval ? null : new Date()
    });

    // Update group stats
    if (!group.requiresApproval) {
      group.totalMembers += 1;
      group.totalCapital += investmentAmount;
      await group.save();
    }

    res.status(201).json({
      success: true,
      message: group.requiresApproval ? 'Join request submitted' : 'Successfully joined group',
      member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Leave trading group
// @route   POST /api/group-trading/groups/:id/leave
// @access  Private
exports.leaveGroup = async (req, res) => {
  try {
    const groupId = req.params.id;

    const member = await GroupMember.findOne({
      group: groupId,
      user: req.user.id,
      status: 'active'
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }

    if (member.role === 'admin' || member.role === 'master-trader') {
      return res.status(400).json({
        success: false,
        message: 'Group admin/master trader cannot leave the group'
      });
    }

    // Update member status
    member.status = 'left';
    member.leftAt = new Date();
    await member.save();

    // Update group stats
    const group = await TradingGroup.findById(groupId);
    group.totalMembers -= 1;
    group.totalCapital -= member.currentBalance;
    await group.save();

    res.status(200).json({
      success: true,
      message: 'Successfully left the group'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's group memberships
// @route   GET /api/group-trading/my-groups
// @access  Private
exports.getMyGroups = async (req, res) => {
  try {
    const memberships = await GroupMember.find({
      user: req.user.id,
      status: { $in: ['active', 'pending'] }
    })
      .populate('group')
      .sort({ joinedAt: -1 });

    res.status(200).json({
      success: true,
      memberships
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get group members
// @route   GET /api/group-trading/groups/:id/members
// @access  Private
exports.getGroupMembers = async (req, res) => {
  try {
    const groupId = req.params.id;

    const members = await GroupMember.find({
      group: groupId,
      status: 'active'
    })
      .populate('user', 'firstName lastName')
      .sort({ investedAmount: -1 });

    res.status(200).json({
      success: true,
      members
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get group trades
// @route   GET /api/group-trading/groups/:id/trades
// @access  Private
exports.getGroupTrades = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const groupId = req.params.id;

    const query = {
      tradingGroup: groupId
    };

    if (status) {
      query.status = status;
    }

    const trades = await Trade.find(query)
      .populate('user', 'firstName lastName')
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

// @desc    Update member copy settings
// @route   PUT /api/group-trading/groups/:id/copy-settings
// @access  Private
exports.updateCopySettings = async (req, res) => {
  try {
    const { copyTradingEnabled, copyRatio, maxCopyAmount } = req.body;
    const groupId = req.params.id;

    const member = await GroupMember.findOne({
      group: groupId,
      user: req.user.id,
      status: 'active'
    });

    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'You are not a member of this group'
      });
    }

    member.copyTradingEnabled = copyTradingEnabled !== undefined ? copyTradingEnabled : member.copyTradingEnabled;
    member.copyRatio = copyRatio || member.copyRatio;
    member.maxCopyAmount = maxCopyAmount || member.maxCopyAmount;

    await member.save();

    res.status(200).json({
      success: true,
      message: 'Copy settings updated successfully',
      member
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
