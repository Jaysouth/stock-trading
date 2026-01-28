import { Router, Request, Response } from 'express';

const router = Router();

// Get user's self trading portfolio
router.get('/portfolio', async (req: Request, res: Response) => {
  try {
    const portfolio = {
      id: 'portfolio_1',
      userId: 'user_1',
      balance: 10000,
      currency: 'USD',
      availableBalance: 7500,
      usedMargin: 2500,
      equity: 10250,
      totalProfit: 250,
      totalLoss: 150,
      netProfit: 100,
      openPositions: 2,
      closedPositions: 25
    };

    res.status(200).json({ portfolio });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
});

// Get active positions
router.get('/positions', async (req: Request, res: Response) => {
  try {
    const positions = [
      {
        id: 'pos_1',
        currencyPair: 'EUR/USD',
        type: 'buy',
        amount: 1000,
        entryPrice: 1.0850,
        currentPrice: 1.0865,
        profit: 15.00,
        profitPercentage: 1.38,
        stopLoss: 1.0830,
        takeProfit: 1.0890,
        openedAt: new Date(Date.now() - 3600000),
        leverage: '1:50'
      },
      {
        id: 'pos_2',
        currencyPair: 'GBP/USD',
        type: 'sell',
        amount: 1500,
        entryPrice: 1.2650,
        currentPrice: 1.2640,
        profit: 15.00,
        profitPercentage: 1.19,
        stopLoss: 1.2670,
        takeProfit: 1.2610,
        openedAt: new Date(Date.now() - 7200000),
        leverage: '1:50'
      }
    ];

    res.status(200).json({ positions });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch positions' });
  }
});

// Open a new position
router.post('/positions', async (req: Request, res: Response) => {
  try {
    const { currencyPair, type, amount, stopLoss, takeProfit, leverage } = req.body;
    
    if (!currencyPair || !type || !amount) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const position = {
      id: `pos_${Date.now()}`,
      userId: 'user_1',
      currencyPair,
      type,
      amount,
      entryPrice: 1.0850,
      currentPrice: 1.0850,
      profit: 0,
      stopLoss: stopLoss || null,
      takeProfit: takeProfit || null,
      leverage: leverage || '1:50',
      openedAt: new Date(),
      status: 'open'
    };

    res.status(201).json({
      message: 'Position opened successfully',
      position
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to open position' });
  }
});

// Close a position
router.post('/positions/:positionId/close', async (req: Request, res: Response) => {
  try {
    const { positionId } = req.params;
    
    res.status(200).json({
      message: 'Position closed successfully',
      positionId,
      closePrice: 1.0865,
      profit: 15.00,
      closedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to close position' });
  }
});

// Update stop loss / take profit
router.put('/positions/:positionId', async (req: Request, res: Response) => {
  try {
    const { positionId } = req.params;
    const { stopLoss, takeProfit } = req.body;
    
    res.status(200).json({
      message: 'Position updated successfully',
      positionId,
      stopLoss,
      takeProfit,
      updatedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update position' });
  }
});

// Get trading history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const history = [
      {
        id: 'trade_1',
        currencyPair: 'EUR/USD',
        type: 'buy',
        amount: 1000,
        entryPrice: 1.0840,
        exitPrice: 1.0865,
        profit: 25.00,
        profitPercentage: 2.31,
        openedAt: new Date(Date.now() - 86400000),
        closedAt: new Date(Date.now() - 82800000),
        duration: '1 hour'
      },
      {
        id: 'trade_2',
        currencyPair: 'USD/JPY',
        type: 'sell',
        amount: 2000,
        entryPrice: 149.50,
        exitPrice: 149.30,
        profit: 40.00,
        profitPercentage: 2.00,
        openedAt: new Date(Date.now() - 172800000),
        closedAt: new Date(Date.now() - 169200000),
        duration: '1 hour'
      }
    ];

    res.status(200).json({ history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trading history' });
  }
});

// Get trading analytics
router.get('/analytics', async (req: Request, res: Response) => {
  try {
    const analytics = {
      totalTrades: 27,
      successfulTrades: 18,
      failedTrades: 9,
      winRate: 66.67,
      averageProfit: 22.22,
      averageLoss: 15.00,
      bestTrade: 85.50,
      worstTrade: -42.30,
      profitFactor: 1.85,
      sharpeRatio: 1.65,
      maxDrawdown: 7.5,
      averageHoldingTime: '2.5 hours',
      mostTradedPair: 'EUR/USD',
      profitableHours: ['08:00-10:00', '14:00-16:00']
    };

    res.status(200).json({ analytics });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Calculate position size based on risk
router.post('/calculate-position', async (req: Request, res: Response) => {
  try {
    const { currencyPair, accountBalance, riskPercentage, stopLossPips } = req.body;
    
    if (!accountBalance || !riskPercentage || !stopLossPips) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const riskAmount = accountBalance * (riskPercentage / 100);
    const positionSize = Math.floor(riskAmount / stopLossPips);
    
    res.status(200).json({
      currencyPair: currencyPair || 'EUR/USD',
      accountBalance,
      riskPercentage,
      riskAmount,
      stopLossPips,
      recommendedPositionSize: positionSize,
      potentialLoss: riskAmount
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to calculate position size' });
  }
});

export { router as selfTradingRouter };
