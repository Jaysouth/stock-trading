import { Router, Request, Response } from 'express';

const router = Router();

// Get all available currency pairs
router.get('/pairs', async (req: Request, res: Response) => {
  try {
    const pairs = [
      { pair: 'EUR/USD', bid: 1.0850, ask: 1.0852, spread: 0.0002 },
      { pair: 'GBP/USD', bid: 1.2650, ask: 1.2653, spread: 0.0003 },
      { pair: 'USD/JPY', bid: 149.50, ask: 149.53, spread: 0.03 },
      { pair: 'AUD/USD', bid: 0.6550, ask: 0.6552, spread: 0.0002 },
      { pair: 'USD/CAD', bid: 1.3520, ask: 1.3523, spread: 0.0003 },
      { pair: 'EUR/GBP', bid: 0.8580, ask: 0.8582, spread: 0.0002 }
    ];

    res.status(200).json({ pairs });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch currency pairs' });
  }
});

// Get market data for a specific pair
router.get('/market/:pair', async (req: Request, res: Response) => {
  try {
    const { pair } = req.params;
    
    const marketData = {
      pair: pair.replace('-', '/'),
      current: 1.0850,
      high24h: 1.0890,
      low24h: 1.0820,
      volume24h: 1250000,
      change24h: 0.23,
      timestamp: new Date()
    };

    res.status(200).json({ market: marketData });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
});

// Get trade history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const history = [
      {
        id: 'trade_1',
        currencyPair: 'EUR/USD',
        type: 'buy',
        amount: 1000,
        price: 1.0850,
        status: 'closed',
        profit: 25.50,
        openedAt: new Date(Date.now() - 3600000),
        closedAt: new Date()
      }
    ];

    res.status(200).json({ trades: history });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trade history' });
  }
});

// Execute a trade
router.post('/execute', async (req: Request, res: Response) => {
  try {
    const { currencyPair, type, amount, module } = req.body;
    
    if (!currencyPair || !type || !amount || !module) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate type
    if (type !== 'buy' && type !== 'sell') {
      return res.status(400).json({ error: 'Type must be either "buy" or "sell"' });
    }

    // Validate module
    const validModules = ['ai', 'group', 'self'];
    if (!validModules.includes(module)) {
      return res.status(400).json({ error: 'Invalid module. Must be: ai, group, or self' });
    }

    // Validate amount
    if (typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    const trade = {
      id: `trade_${Date.now()}`,
      userId: 'user_1',
      module,
      currencyPair,
      type,
      amount,
      price: 1.0850,
      status: 'executed',
      openedAt: new Date()
    };

    res.status(201).json({
      message: 'Trade executed successfully',
      trade
    });
  } catch (error) {
    console.error('Trade execution error:', error);
    res.status(500).json({ error: 'Failed to execute trade' });
  }
});

// Close a trade
router.post('/close/:tradeId', async (req: Request, res: Response) => {
  try {
    const { tradeId } = req.params;
    
    res.status(200).json({
      message: 'Trade closed successfully',
      tradeId,
      profit: 25.50,
      closedAt: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to close trade' });
  }
});

export { router as tradingRouter };
