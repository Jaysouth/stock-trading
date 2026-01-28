export interface User {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  role: 'beginner' | 'intermediate' | 'professional';
  createdAt: Date;
  updatedAt: Date;
}

export interface Trade {
  id: string;
  userId: string;
  module: 'ai' | 'group' | 'self';
  currencyPair: string;
  type: 'buy' | 'sell';
  amount: number;
  price: number;
  status: 'pending' | 'executed' | 'cancelled' | 'closed';
  openedAt: Date;
  closedAt?: Date;
  profit?: number;
}

export interface Portfolio {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  trades: Trade[];
  totalProfit: number;
  totalLoss: number;
}

export interface TradingModule {
  name: 'ai' | 'group' | 'self';
  displayName: string;
  description: string;
  features: string[];
  enabled: boolean;
}

export interface BrokerConnection {
  id: string;
  userId: string;
  brokerName: string;
  apiKey: string;
  status: 'connected' | 'disconnected' | 'error';
  regulatedBy: string[];
  connectedAt: Date;
}

export interface AITradingConfig {
  userId: string;
  algorithm: string;
  riskLevel: 'low' | 'medium' | 'high';
  maxTradeSize: number;
  stopLoss: number;
  takeProfit: number;
  enabled: boolean;
}

export interface GroupTradingSession {
  id: string;
  name: string;
  creatorId: string;
  members: string[];
  pooledAmount: number;
  minContribution: number;
  maxMembers: number;
  strategy: string;
  status: 'open' | 'active' | 'closed';
  createdAt: Date;
}

export interface AuthRequest extends Request {
  user?: User;
}
