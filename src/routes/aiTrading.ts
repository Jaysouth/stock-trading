import { Router, Request, Response } from 'express';

const router = Router();

// Get AI trading configuration
router.get('/config', async (req: Request, res: Response) => {
  try {
    const config = {
      userId: 'user_1',
      algorithm: 'momentum_strategy',
      riskLevel: 'medium',
      maxTradeSize: 5000,
      stopLoss: 2.0,
      takeProfit: 4.0,
      enabled: true,
      strategies: [
        'momentum_strategy',
        'mean_reversion',
        'trend_following',
        'arbitrage'
      ]
    };

    res.status(200).json({ config });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI configuration' });
  }
});

// Update AI trading configuration
router.put('/config', async (req: Request, res: Response) => {
  try {
    const { algorithm, riskLevel, maxTradeSize, stopLoss, takeProfit, enabled } = req.body;
    
    const updatedConfig = {
      userId: 'user_1',
      algorithm: algorithm || 'momentum_strategy',
      riskLevel: riskLevel || 'medium',
      maxTradeSize: maxTradeSize || 5000,
      stopLoss: stopLoss || 2.0,
      takeProfit: takeProfit || 4.0,
      enabled: enabled !== undefined ? enabled : true
    };

    res.status(200).json({
      message: 'AI configuration updated successfully',
      config: updatedConfig
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update AI configuration' });
  }
});

// Get AI trading performance
router.get('/performance', async (req: Request, res: Response) => {
  try {
    const performance = {
      totalTrades: 147,
      successfulTrades: 98,
      failedTrades: 49,
      winRate: 66.67,
      totalProfit: 3250.75,
      averageProfit: 22.11,
      sharpeRatio: 1.85,
      maxDrawdown: 8.5,
      activeSince: new Date(Date.now() - 30 * 24 * 3600000)
    };

    res.status(200).json({ performance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI performance' });
  }
});

// Get AI recommendations
router.get('/recommendations', async (req: Request, res: Response) => {
  try {
    const recommendations = [
      {
        id: 'rec_1',
        currencyPair: 'EUR/USD',
        action: 'buy',
        confidence: 0.85,
        entryPrice: 1.0850,
        stopLoss: 1.0830,
        takeProfit: 1.0890,
        reasoning: 'Strong upward momentum detected with positive RSI divergence'
      },
      {
        id: 'rec_2',
        currencyPair: 'GBP/USD',
        action: 'sell',
        confidence: 0.72,
        entryPrice: 1.2650,
        stopLoss: 1.2670,
        takeProfit: 1.2610,
        reasoning: 'Overbought conditions with bearish candlestick pattern'
      }
    ];

    res.status(200).json({ recommendations });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch AI recommendations' });
  }
});

// Start/Stop AI trading
router.post('/toggle', async (req: Request, res: Response) => {
  try {
    const { enabled } = req.body;
    
    res.status(200).json({
      message: `AI trading ${enabled ? 'started' : 'stopped'} successfully`,
      status: enabled ? 'active' : 'inactive'
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle AI trading' });
  }
});

// Get AI active trades
router.get('/active-trades', async (req: Request, res: Response) => {
  try {
    const activeTrades = [
      {
        id: 'trade_ai_1',
        currencyPair: 'EUR/USD',
        type: 'buy',
        amount: 2000,
        entryPrice: 1.0850,
        currentPrice: 1.0865,
        profit: 30.00,
        openedAt: new Date(Date.now() - 1800000),
        algorithm: 'momentum_strategy'
      }
    ];

    res.status(200).json({ trades: activeTrades });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch active AI trades' });
  }
});

export { router as aiTradingRouter };
