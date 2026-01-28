import { Router, Request, Response } from 'express';

const router = Router();

// Get dashboard overview
router.get('/overview', async (req: Request, res: Response) => {
  try {
    const overview = {
      user: {
        id: 'user_1',
        username: 'demouser',
        role: 'intermediate',
        memberSince: new Date(Date.now() - 90 * 24 * 3600000)
      },
      modules: {
        aiTrading: {
          enabled: true,
          activeTrades: 1,
          totalProfit: 3250.75,
          winRate: 66.67,
          status: 'active'
        },
        groupTrading: {
          activeGroups: 1,
          totalInvested: 5000,
          totalProfit: 283.33,
          status: 'active'
        },
        selfTrading: {
          openPositions: 2,
          balance: 10000,
          netProfit: 100,
          status: 'active'
        }
      },
      totalBalance: 15000,
      totalProfit: 3634.08,
      totalProfitPercentage: 24.23,
      recentActivity: [
        {
          type: 'trade_closed',
          module: 'ai',
          description: 'AI closed EUR/USD position with 30.00 profit',
          timestamp: new Date(Date.now() - 3600000)
        },
        {
          type: 'group_joined',
          module: 'group',
          description: 'Joined Conservative Traders Alliance',
          timestamp: new Date(Date.now() - 7200000)
        },
        {
          type: 'position_opened',
          module: 'self',
          description: 'Opened GBP/USD sell position',
          timestamp: new Date(Date.now() - 10800000)
        }
      ]
    };

    res.status(200).json({ overview });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard overview' });
  }
});

// Get module statistics
router.get('/modules/stats', async (req: Request, res: Response) => {
  try {
    const stats = [
      {
        module: 'ai',
        name: 'AI Forex Trading',
        description: 'Automated trading using advanced algorithms',
        enabled: true,
        totalTrades: 147,
        activeTrades: 1,
        successRate: 66.67,
        profit: 3250.75,
        features: [
          'Algorithmic Trading',
          'Machine Learning Analysis',
          'Risk Management',
          'Auto-execution'
        ]
      },
      {
        module: 'group',
        name: 'Group Forex Trading',
        description: 'Collaborative trading with shared profits',
        enabled: true,
        activeGroups: 1,
        totalMembers: 3,
        invested: 5000,
        profit: 283.33,
        features: [
          'Pooled Resources',
          'Shared Decision Making',
          'Profit Distribution',
          'Community Learning'
        ]
      },
      {
        module: 'self',
        name: 'Self Forex Trading',
        description: 'Full control over your trading decisions',
        enabled: true,
        openPositions: 2,
        totalTrades: 27,
        winRate: 66.67,
        profit: 100,
        features: [
          'Manual Trading',
          'Custom Strategies',
          'Advanced Analytics',
          'Position Management'
        ]
      }
    ];

    res.status(200).json({ modules: stats });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch module statistics' });
  }
});

// Get market overview
router.get('/market', async (req: Request, res: Response) => {
  try {
    const market = {
      topMovers: [
        { pair: 'EUR/USD', change: 0.45, direction: 'up' },
        { pair: 'GBP/USD', change: -0.32, direction: 'down' },
        { pair: 'USD/JPY', change: 0.28, direction: 'up' }
      ],
      sentiment: {
        bullish: 58,
        bearish: 42
      },
      economicEvents: [
        {
          title: 'US Non-Farm Payrolls',
          currency: 'USD',
          impact: 'high',
          time: new Date(Date.now() + 7200000)
        },
        {
          title: 'ECB Interest Rate Decision',
          currency: 'EUR',
          impact: 'high',
          time: new Date(Date.now() + 86400000)
        }
      ],
      tradingVolume24h: 6500000,
      activeTraders: 12450
    };

    res.status(200).json({ market });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market overview' });
  }
});

// Get notifications
router.get('/notifications', async (req: Request, res: Response) => {
  try {
    const notifications = [
      {
        id: 'notif_1',
        type: 'trade_alert',
        title: 'AI Trade Executed',
        message: 'Your AI bot opened a new EUR/USD position',
        read: false,
        timestamp: new Date(Date.now() - 300000)
      },
      {
        id: 'notif_2',
        type: 'group_update',
        title: 'Group Trade Proposal',
        message: 'New trade proposal in Conservative Traders Alliance',
        read: false,
        timestamp: new Date(Date.now() - 600000)
      },
      {
        id: 'notif_3',
        type: 'system',
        title: 'Maintenance Notice',
        message: 'Scheduled maintenance on Sunday 2:00 AM UTC',
        read: true,
        timestamp: new Date(Date.now() - 3600000)
      }
    ];

    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Get broker connections
router.get('/brokers', async (req: Request, res: Response) => {
  try {
    const brokers = [
      {
        id: 'broker_1',
        name: 'IC Markets',
        status: 'connected',
        regulatedBy: ['ASIC', 'CySEC', 'FSA'],
        accountType: 'Standard',
        balance: 10000,
        connectedAt: new Date(Date.now() - 30 * 24 * 3600000)
      },
      {
        id: 'broker_2',
        name: 'Pepperstone',
        status: 'disconnected',
        regulatedBy: ['FCA', 'ASIC', 'DFSA'],
        accountType: null,
        balance: 0,
        connectedAt: null
      }
    ];

    res.status(200).json({ brokers });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch broker connections' });
  }
});

// Connect to a broker
router.post('/brokers/connect', async (req: Request, res: Response) => {
  try {
    const { brokerName, apiKey, accountType } = req.body;
    
    if (!brokerName || !apiKey || !accountType) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const connection = {
      id: `broker_${Date.now()}`,
      userId: 'user_1',
      brokerName,
      accountType,
      status: 'connected',
      connectedAt: new Date()
    };

    res.status(201).json({
      message: 'Successfully connected to broker',
      connection
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to connect to broker' });
  }
});

// Get compliance status
router.get('/compliance', async (req: Request, res: Response) => {
  try {
    const compliance = {
      kycStatus: 'verified',
      kycVerifiedAt: new Date(Date.now() - 60 * 24 * 3600000),
      accountVerified: true,
      tradingLimits: {
        daily: 50000,
        weekly: 250000,
        monthly: 1000000
      },
      regulatoryRegion: 'EU',
      dataProtection: 'GDPR compliant',
      auditLog: {
        enabled: true,
        retentionPeriod: '7 years'
      }
    };

    res.status(200).json({ compliance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch compliance status' });
  }
});

export { router as dashboardRouter };
