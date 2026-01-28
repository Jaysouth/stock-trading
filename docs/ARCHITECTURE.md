# SmartFX Hub - System Architecture

## Table of Contents
1. [Overview](#overview)
2. [System Design](#system-design)
3. [Technology Stack](#technology-stack)
4. [Database Schema](#database-schema)
5. [API Architecture](#api-architecture)
6. [Security Architecture](#security-architecture)
7. [Module Architecture](#module-architecture)

## Overview

SmartFX Hub is a multi-module forex trading platform built using a modern, scalable architecture. The system is designed to handle three distinct trading approaches while maintaining a unified user experience and secure transaction management.

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Client Layer                         │
│  (Web Browser / Mobile App - Future Phase 2)                │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS / WSS
┌────────────────────┴────────────────────────────────────────┐
│                      API Gateway Layer                       │
│  - CORS             - Rate Limiting      - Helmet           │
│  - JWT Auth         - Request Validation                     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                    Application Layer (Node.js)               │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ AI Trading   │  │ Group Trading│  │ Self Trading │     │
│  │   Module     │  │    Module    │  │    Module    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │  Wallet      │  │     Auth     │  │    Admin     │     │
│  │  Service     │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└────────────────────┬────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                     Data Layer (MongoDB)                     │
│  Users | Wallets | Trades | Transactions | Groups          │
└──────────────────────────────────────────────────────────────┘
                     │
┌────────────────────┴────────────────────────────────────────┐
│                  External Services Layer                     │
│  MT4/MT5 API | Payment Gateway | Email Service | AI Service│
└──────────────────────────────────────────────────────────────┘
```

## System Design

### Design Principles

1. **Modularity**: Each trading module operates independently
2. **Scalability**: Horizontal scaling capability for high traffic
3. **Security**: Multiple layers of security protection
4. **Performance**: Optimized database queries and caching
5. **Maintainability**: Clean code architecture with separation of concerns

### Architecture Patterns

- **MVC Pattern**: Model-View-Controller for organization
- **RESTful API**: Standard HTTP methods and status codes
- **Middleware Pattern**: Request processing pipeline
- **Service Layer**: Business logic separation
- **Repository Pattern**: Data access abstraction

## Technology Stack

### Backend
- **Runtime**: Node.js v14+
- **Framework**: Express.js v5
- **Database**: MongoDB v4.4+
- **ODM**: Mongoose v9

### Security
- **Authentication**: JSON Web Tokens (JWT)
- **2FA**: Speakeasy + QRCode
- **Password Hashing**: Bcrypt
- **Security Headers**: Helmet.js
- **Rate Limiting**: Express Rate Limit

### Development
- **Environment Management**: dotenv
- **CORS Handling**: cors middleware

## Database Schema

### Collections Overview

```
smartfx-hub/
├── users              # User accounts and authentication
├── wallets            # User wallet balances
├── transactions       # Financial transactions
├── trades             # All trading records
├── aitradingconfigs   # AI trading configurations
├── tradinggroups      # Trading group details
└── groupmembers       # Group membership records
```

### Data Models

#### User Model
```javascript
{
  _id: ObjectId,
  firstName: String,
  lastName: String,
  email: String (unique, indexed),
  password: String (hashed),
  phoneNumber: String,
  country: String,
  role: Enum ['user', 'admin', 'master-trader'],
  twoFactorEnabled: Boolean,
  twoFactorSecret: String,
  isActive: Boolean,
  isVerified: Boolean,
  tradingExperience: Enum,
  riskTolerance: Enum,
  kycStatus: Enum,
  brokerAccounts: Array,
  referralCode: String (unique),
  referredBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

#### Wallet Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, indexed),
  tradingBalance: Number,
  profitBalance: Number,
  referralBalance: Number,
  totalBalance: Number (calculated),
  aiTradingAllocation: Number,
  groupTradingAllocation: Number,
  selfTradingAllocation: Number,
  currency: Enum,
  frozenAmount: Number,
  createdAt: Date,
  updatedAt: Date
}
```

#### Trade Model
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: User, indexed),
  tradeType: Enum ['ai-trading', 'group-trading', 'self-trading'],
  symbol: String,
  direction: Enum ['buy', 'sell'],
  entryPrice: Number,
  exitPrice: Number,
  quantity: Number,
  leverage: Number,
  stopLoss: Number,
  takeProfit: Number,
  status: Enum ['pending', 'open', 'closed', 'cancelled'],
  profitLoss: Number,
  profitLossPercentage: Number,
  commission: Number,
  swap: Number,
  openedAt: Date,
  closedAt: Date,
  aiStrategy: String,
  tradingGroup: ObjectId (ref: TradingGroup),
  brokerOrderId: String,
  broker: Enum,
  createdAt: Date,
  updatedAt: Date
}
```

### Indexes

```javascript
// Performance optimization indexes
users: [
  { email: 1 },
  { referralCode: 1 },
  { createdAt: -1 }
]

wallets: [
  { user: 1 }
]

trades: [
  { user: 1, createdAt: -1 },
  { tradeType: 1, status: 1 },
  { tradingGroup: 1 }
]

transactions: [
  { user: 1, createdAt: -1 },
  { type: 1, status: 1 }
]
```

## API Architecture

### RESTful Endpoints Structure

```
/api
├── /auth                    # Authentication
│   ├── POST /register
│   ├── POST /login
│   ├── GET /me
│   └── /2fa
│       ├── POST /enable
│       ├── POST /verify
│       └── POST /login
│
├── /wallet                  # Wallet management
│   ├── GET /
│   ├── POST /deposit
│   ├── POST /withdraw
│   ├── POST /transfer
│   ├── POST /allocate
│   └── GET /transactions
│
├── /ai-trading             # AI Trading Module
│   ├── GET /config
│   ├── PUT /config
│   ├── POST /start
│   ├── POST /stop
│   ├── POST /pause
│   ├── POST /resume
│   ├── GET /performance
│   └── GET /trades
│
├── /group-trading          # Group Trading Module
│   ├── /groups
│   │   ├── GET /
│   │   ├── POST /
│   │   ├── GET /:id
│   │   ├── POST /:id/join
│   │   ├── POST /:id/leave
│   │   ├── GET /:id/members
│   │   ├── GET /:id/trades
│   │   └── PUT /:id/copy-settings
│   └── GET /my-groups
│
├── /self-trading           # Self Trading Module
│   ├── GET /trades
│   ├── POST /trades
│   ├── PUT /trades/:id
│   ├── PUT /trades/:id/close
│   └── GET /performance
│
└── /admin                  # Admin Dashboard
    ├── GET /dashboard
    ├── GET /users
    ├── GET /users/:id
    ├── PUT /users/:id/status
    ├── GET /transactions/pending
    ├── PUT /transactions/:id/approve
    ├── PUT /transactions/:id/reject
    ├── GET /trades
    └── GET /statistics
```

### Request/Response Flow

```
1. Client Request
   ↓
2. Rate Limiter (100 req/15min)
   ↓
3. CORS Check
   ↓
4. Route Handler
   ↓
5. Auth Middleware (if protected)
   ↓
6. Authorization Check (if role-based)
   ↓
7. Request Validation
   ↓
8. Controller Logic
   ↓
9. Service Layer (Business Logic)
   ↓
10. Model/Database Query
   ↓
11. Response Formatting
   ↓
12. Send Response
```

## Security Architecture

### Authentication Flow

```
1. User Login
   ↓
2. Validate Credentials
   ↓
3. Check 2FA Status
   ├─ Enabled → Request 2FA Token
   └─ Disabled → Generate JWT
   ↓
4. Return JWT Token
   ↓
5. Client stores token
   ↓
6. Subsequent requests include:
   Authorization: Bearer <token>
```

### Security Layers

1. **Transport Security**
   - HTTPS only in production
   - TLS 1.2+ encryption

2. **Application Security**
   - Helmet.js security headers
   - CORS configuration
   - Rate limiting
   - Input validation

3. **Authentication Security**
   - JWT with expiration
   - Bcrypt password hashing (10 rounds)
   - 2FA with TOTP
   - Secure secret storage

4. **Database Security**
   - MongoDB authentication
   - Encrypted connections
   - No sensitive data in plaintext

5. **API Security**
   - Role-based access control
   - IP tracking
   - Request signing
   - Anti-fraud monitoring

## Module Architecture

### AI Trading Module

```
User Configuration
    ↓
Trading Mode Selection (Conservative/Balanced/Aggressive)
    ↓
Capital Allocation
    ↓
Risk Parameters Setup
    ↓
AI Analysis Engine
    ├─ Technical Indicators (RSI, MACD, EMA, Bollinger)
    ├─ Market Trend Detection
    └─ Signal Generation
    ↓
Trade Decision
    ↓
Risk Check (Max Daily Loss, Drawdown)
    ├─ Pass → Execute Trade
    └─ Fail → Auto-Pause
    ↓
Position Management (SL/TP)
    ↓
Performance Tracking
```

### Group Trading Module

```
Master Trader Creates Group
    ↓
Set Profit Share & Rules
    ↓
Users Join Group
    ├─ Set Investment Amount
    └─ Configure Copy Ratio
    ↓
Master Trader Places Trade
    ↓
Copy Trading Engine
    ├─ Calculate Position Size per Member
    ├─ Apply Copy Ratio
    └─ Check Member Balance
    ↓
Execute Copied Trades
    ↓
Trade Close
    ↓
Profit Distribution
    ├─ Master Trader Share
    └─ Members Share (proportional)
```

### Self Trading Module

```
User Interface
    ↓
Manual Trade Entry
    ├─ Symbol Selection
    ├─ Direction (Buy/Sell)
    ├─ Position Size
    ├─ SL/TP Levels
    └─ Leverage
    ↓
Broker API Integration (Future)
    ├─ MT4/MT5 Connection
    ├─ Order Submission
    └─ Real-time Price Feed
    ↓
Trade Management
    ├─ Modify SL/TP
    ├─ Partial Close
    └─ Full Close
    ↓
Performance Analytics
    ├─ P&L Calculation
    ├─ Win Rate
    └─ Risk Metrics
```

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Load balancer ready
- Session management via JWT

### Database Scaling
- MongoDB replica sets
- Sharding for large datasets
- Read replicas for queries

### Caching Strategy (Future)
- Redis for session data
- API response caching
- Market data caching

### Microservices Migration (Future)
- Separate services per module
- Message queue for async tasks
- Event-driven architecture

## Monitoring & Logging

### Application Monitoring
- Request/response logging
- Error tracking
- Performance metrics
- User activity logs

### Database Monitoring
- Query performance
- Connection pool status
- Storage usage

### Security Monitoring
- Failed login attempts
- Suspicious activities
- API abuse detection

## Deployment Architecture

### Development
```
Local Machine
├── MongoDB (localhost:27017)
└── Node.js Server (localhost:5000)
```

### Production (Recommended)
```
Load Balancer
    ├── Node.js Instance 1
    ├── Node.js Instance 2
    └── Node.js Instance 3
        ↓
MongoDB Cluster
    ├── Primary
    ├── Secondary 1
    └── Secondary 2
        ↓
External Services
    ├── Email Service
    ├── Payment Gateway
    └── Broker APIs
```

---

This architecture provides a solid foundation for the SmartFX Hub platform while allowing for future enhancements and scaling.
