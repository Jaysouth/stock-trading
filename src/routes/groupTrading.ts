import { Router, Request, Response } from 'express';

const router = Router();

// Get all available trading groups
router.get('/sessions', async (req: Request, res: Response) => {
  try {
    const sessions = [
      {
        id: 'group_1',
        name: 'Conservative Traders Alliance',
        creatorId: 'user_creator_1',
        members: ['user_1', 'user_2', 'user_3'],
        memberCount: 3,
        pooledAmount: 15000,
        minContribution: 1000,
        maxMembers: 10,
        strategy: 'conservative',
        status: 'active',
        performance: {
          totalProfit: 850,
          profitPercentage: 5.67
        },
        createdAt: new Date(Date.now() - 7 * 24 * 3600000)
      },
      {
        id: 'group_2',
        name: 'Aggressive Growth Group',
        creatorId: 'user_creator_2',
        members: ['user_4', 'user_5'],
        memberCount: 2,
        pooledAmount: 8000,
        minContribution: 2000,
        maxMembers: 5,
        strategy: 'aggressive',
        status: 'open',
        performance: {
          totalProfit: 0,
          profitPercentage: 0
        },
        createdAt: new Date(Date.now() - 2 * 24 * 3600000)
      }
    ];

    res.status(200).json({ sessions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trading sessions' });
  }
});

// Create a new trading group
router.post('/sessions', async (req: Request, res: Response) => {
  try {
    const { name, minContribution, maxMembers, strategy } = req.body;
    
    if (!name || !minContribution || !maxMembers || !strategy) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate minContribution
    if (typeof minContribution !== 'number' || minContribution <= 0) {
      return res.status(400).json({ error: 'Minimum contribution must be a positive number' });
    }

    // Validate maxMembers
    if (typeof maxMembers !== 'number' || maxMembers <= 0 || !Number.isInteger(maxMembers)) {
      return res.status(400).json({ error: 'Maximum members must be a positive integer' });
    }

    // Validate strategy
    const validStrategies = ['conservative', 'moderate', 'aggressive'];
    if (!validStrategies.includes(strategy)) {
      return res.status(400).json({ error: 'Invalid strategy. Must be: conservative, moderate, or aggressive' });
    }

    const session = {
      id: `group_${Date.now()}`,
      name,
      creatorId: 'user_1',
      members: ['user_1'],
      memberCount: 1,
      pooledAmount: 0,
      minContribution,
      maxMembers,
      strategy,
      status: 'open',
      createdAt: new Date()
    };

    res.status(201).json({
      message: 'Trading group created successfully',
      session
    });
  } catch (error) {
    console.error('Group creation error:', error);
    res.status(500).json({ error: 'Failed to create trading group' });
  }
});

// Get details of a specific group
router.get('/sessions/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    const session = {
      id: sessionId,
      name: 'Conservative Traders Alliance',
      creatorId: 'user_creator_1',
      members: [
        {
          userId: 'user_1',
          username: 'trader1',
          contribution: 5000,
          profitShare: 283.33,
          joinedAt: new Date(Date.now() - 7 * 24 * 3600000)
        },
        {
          userId: 'user_2',
          username: 'trader2',
          contribution: 5000,
          profitShare: 283.33,
          joinedAt: new Date(Date.now() - 6 * 24 * 3600000)
        },
        {
          userId: 'user_3',
          username: 'trader3',
          contribution: 5000,
          profitShare: 283.34,
          joinedAt: new Date(Date.now() - 5 * 24 * 3600000)
        }
      ],
      pooledAmount: 15000,
      minContribution: 1000,
      maxMembers: 10,
      strategy: 'conservative',
      status: 'active',
      activeTrades: 2,
      closedTrades: 15,
      totalProfit: 850,
      createdAt: new Date(Date.now() - 7 * 24 * 3600000)
    };

    res.status(200).json({ session });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch session details' });
  }
});

// Join a trading group
router.post('/sessions/:sessionId/join', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { contribution } = req.body;
    
    if (!contribution) {
      return res.status(400).json({ error: 'Contribution amount is required' });
    }

    // Validate contribution amount
    if (typeof contribution !== 'number' || contribution <= 0) {
      return res.status(400).json({ error: 'Contribution must be a positive number' });
    }

    res.status(200).json({
      message: 'Successfully joined the trading group',
      sessionId,
      contribution,
      joinedAt: new Date()
    });
  } catch (error) {
    console.error('Group join error:', error);
    res.status(500).json({ error: 'Failed to join trading group' });
  }
});

// Leave a trading group
router.post('/sessions/:sessionId/leave', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    res.status(200).json({
      message: 'Successfully left the trading group',
      sessionId,
      refundAmount: 5283.33,
      leftAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to leave trading group' });
  }
});

// Get group trading performance
router.get('/sessions/:sessionId/performance', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    
    const performance = {
      sessionId,
      totalTrades: 17,
      successfulTrades: 12,
      failedTrades: 5,
      winRate: 70.59,
      totalProfit: 850,
      averageProfit: 50,
      profitPerMember: 283.33,
      activeSince: new Date(Date.now() - 7 * 24 * 3600000)
    };

    res.status(200).json({ performance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch group performance' });
  }
});

// Vote on a trade proposal in group
router.post('/sessions/:sessionId/vote', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { tradeProposalId, vote } = req.body;
    
    if (!tradeProposalId || vote === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate vote
    const validVotes = ['yes', 'no', true, false];
    if (!validVotes.includes(vote)) {
      return res.status(400).json({ error: 'Vote must be either "yes", "no", true, or false' });
    }

    res.status(200).json({
      message: 'Vote recorded successfully',
      sessionId,
      tradeProposalId,
      vote,
      currentVotes: { yes: 2, no: 1 }
    });
  } catch (error) {
    console.error('Vote recording error:', error);
    res.status(500).json({ error: 'Failed to record vote' });
  }
});

export { router as groupTradingRouter };
