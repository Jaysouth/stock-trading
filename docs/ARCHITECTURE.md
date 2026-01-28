# SmartFX Hub - Architecture Documentation

## System Architecture

### Overview
SmartFX Hub follows a modular, microservices-inspired architecture with clear separation of concerns between different trading modules while maintaining a unified user experience.

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│                    (React/Dashboard UI)                      │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTPS/REST API
                            │
┌─────────────────────────────────────────────────────────────┐
│                      API Gateway/Server                      │
│                   (Express.js + TypeScript)                  │
└─────────────────────────────────────────────────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐ ┌────────▼────────┐ ┌───────▼────────┐
│  AI Trading    │ │ Group Trading   │ │ Self Trading   │
│    Module      │ │    Module       │ │    Module      │
└───────┬────────┘ └────────┬────────┘ └───────┬────────┘
        │                   │                   │
        └───────────────────┼───────────────────┘
                            │
        ┌───────────────────┼───────────────────┐
        │                   │                   │
┌───────▼────────┐ ┌────────▼────────┐ ┌───────▼────────┐
│   Database     │ │  Broker APIs    │ │   AI Service   │
│   (MongoDB)    │ │  (External)     │ │   (External)   │
└────────────────┘ └─────────────────┘ └────────────────┘
```

## Module Architecture

### 1. AI Trading Module
**Purpose**: Provide automated trading using AI algorithms

**Components**:
- Configuration Manager: Manages AI trading settings and parameters
- Strategy Engine: Executes various trading strategies
- Performance Monitor: Tracks and analyzes trading performance
- Recommendation Engine: Generates trade suggestions

**Key Features**:
- Multiple algorithm support (momentum, mean reversion, trend following)
- Real-time performance analytics
- Risk management integration
- Auto-execution capabilities

### 2. Group Trading Module
**Purpose**: Enable collaborative trading with shared resources

**Components**:
- Session Manager: Handles group creation and management
- Member Manager: Manages group membership and contributions
- Voting System: Democratic decision-making for trades
- Profit Distribution: Fair allocation of profits/losses

**Key Features**:
- Pooled resource management
- Democratic voting mechanism
- Transparent profit sharing
- Group performance tracking

### 3. Self Trading Module
**Purpose**: Provide full manual control for experienced traders

**Components**:
- Position Manager: Handles opening/closing positions
- Portfolio Manager: Tracks user's trading portfolio
- Analytics Engine: Provides trading insights
- Risk Calculator: Calculates position sizes and risk

**Key Features**:
- Real-time position management
- Advanced analytics
- Custom risk parameters
- Trading history and reporting

## Data Flow

### Trade Execution Flow
```
User Request → Authentication → Validation → Module Router
    ↓
Trading Engine → Broker API → Order Execution
    ↓
Database Update → Notification → User Response
```

### AI Trading Flow
```
Market Data → AI Analysis → Strategy Evaluation
    ↓
Risk Assessment → Trade Signal Generation
    ↓
Auto Execution → Position Management → Performance Tracking
```

### Group Trading Flow
```
Trade Proposal → Member Notification → Voting Period
    ↓
Vote Aggregation → Decision (Execute/Reject)
    ↓
Trade Execution → Profit Distribution → Member Update
```

## Security Architecture

### Authentication & Authorization
- JWT-based token authentication
- Role-based access control (RBAC)
- Secure password hashing (bcrypt)
- API key management for broker integration

### Data Security
- Encrypted data transmission (HTTPS)
- Encrypted sensitive data at rest
- Secure environment variable management
- Regular security audits

### Compliance
- KYC/AML verification integration
- Audit logging (7-year retention)
- GDPR compliance
- Regulatory reporting capabilities

## Database Schema

### Users Collection
```typescript
{
  _id: ObjectId,
  email: string,
  username: string,
  passwordHash: string,
  firstName: string,
  lastName: string,
  role: 'beginner' | 'intermediate' | 'professional',
  kycStatus: 'pending' | 'verified' | 'rejected',
  createdAt: Date,
  updatedAt: Date
}
```

### Trades Collection
```typescript
{
  _id: ObjectId,
  userId: ObjectId,
  module: 'ai' | 'group' | 'self',
  currencyPair: string,
  type: 'buy' | 'sell',
  amount: number,
  entryPrice: number,
  exitPrice?: number,
  stopLoss?: number,
  takeProfit?: number,
  status: 'open' | 'closed' | 'cancelled',
  profit?: number,
  openedAt: Date,
  closedAt?: Date
}
```

### Group Sessions Collection
```typescript
{
  _id: ObjectId,
  name: string,
  creatorId: ObjectId,
  members: [
    {
      userId: ObjectId,
      contribution: number,
      joinedAt: Date
    }
  ],
  pooledAmount: number,
  strategy: string,
  status: 'open' | 'active' | 'closed',
  createdAt: Date
}
```

## API Design Principles

### RESTful Architecture
- Resource-based URLs
- HTTP methods for CRUD operations
- Consistent response formats
- Proper status codes

### Response Format
```typescript
// Success Response
{
  message: string,
  data: object,
  timestamp: Date
}

// Error Response
{
  error: string,
  message: string,
  statusCode: number
}
```

### Rate Limiting
- 100 requests per 15 minutes per IP
- Separate limits for authenticated users
- Graceful degradation

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Load balancer ready
- Session management with Redis
- Database sharding support

### Performance Optimization
- Caching strategy (Redis)
- Database indexing
- Query optimization
- Lazy loading

### Monitoring
- Application performance monitoring
- Error tracking and logging
- Real-time alerts
- Usage analytics

## Development Practices

### Code Organization
```
src/
├── routes/          # API route handlers
├── controllers/     # Business logic
├── models/          # Data models
├── services/        # External service integrations
├── middleware/      # Express middleware
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
└── __tests__/       # Test files
```

### Testing Strategy
- Unit tests for individual functions
- Integration tests for API endpoints
- End-to-end tests for user flows
- Performance testing

### CI/CD Pipeline
```
Code Push → Lint → Build → Test → Security Scan → Deploy
```

## Deployment Architecture

### Production Environment
- Container-based deployment (Docker)
- Kubernetes orchestration
- Auto-scaling based on load
- Blue-green deployment strategy

### Infrastructure
- Load balancer (AWS ELB / Azure Load Balancer)
- Application servers (Node.js instances)
- Database cluster (MongoDB replica set)
- Cache layer (Redis cluster)
- CDN for static assets

## Future Architecture Enhancements

1. **WebSocket Integration**: Real-time updates and push notifications
2. **Microservices**: Split modules into independent services
3. **Message Queue**: Async processing with RabbitMQ/Kafka
4. **GraphQL API**: Alternative to REST for flexible data fetching
5. **Event Sourcing**: Complete audit trail and replay capabilities
