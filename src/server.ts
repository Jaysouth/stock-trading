import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { authRouter } from './routes/auth';
import { tradingRouter } from './routes/trading';
import { aiTradingRouter } from './routes/aiTrading';
import { groupTradingRouter } from './routes/groupTrading';
import { selfTradingRouter } from './routes/selfTrading';
import { dashboardRouter } from './routes/dashboard';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'healthy',
    service: 'SmartFX Hub',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/trading', tradingRouter);
app.use('/api/ai-trading', aiTradingRouter);
app.use('/api/group-trading', groupTradingRouter);
app.use('/api/self-trading', selfTradingRouter);
app.use('/api/dashboard', dashboardRouter);

// Welcome route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to SmartFX Hub - Multi-Module Forex Trading Platform',
    version: '1.0.0',
    modules: [
      'AI Forex Trading',
      'Group Forex Trading',
      'Self Forex Trading'
    ],
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      trading: '/api/trading',
      aiTrading: '/api/ai-trading',
      groupTrading: '/api/group-trading',
      selfTrading: '/api/self-trading',
      dashboard: '/api/dashboard'
    }
  });
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 SmartFX Hub server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}`);
});

export default app;
