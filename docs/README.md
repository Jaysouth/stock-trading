# SmartFX Hub - Multi-Module Forex Trading Platform

## Overview

SmartFX Hub is a secure, cloud-based forex trading web application designed to serve beginner, intermediate, and professional traders through three integrated trading modules:

1. **AI Forex Trading** - Automated trading using artificial intelligence
2. **Group Forex Trading** - Community-based trading and fund pooling
3. **Self Forex Trading** - Manual trading with professional tools

## Features

### 🔐 Security Features
- Two-factor authentication (2FA)
- JWT-based authentication
- Encrypted password storage
- IP protection and tracking
- Rate limiting and anti-fraud monitoring
- Helmet.js security headers

### 💰 Wallet System
- Separate wallets for trading capital, profits, and referrals
- Deposit and withdrawal management
- Capital allocation across modules
- Transaction history tracking
- Frozen balance for pending withdrawals

### 🤖 AI Forex Trading Module
- Market analysis using technical indicators (RSI, MACD, EMA, Bollinger Bands)
- Three trading modes: Conservative, Balanced, Aggressive
- Automated trade execution
- Risk management (stop-loss, take-profit, max daily loss)
- Performance dashboard with P&L tracking
- Auto-pause system
- Manual override capability

### 👥 Group Forex Trading Module
- Create and manage trading groups (public, private, signal, managed pools)
- Role-based access control (Admin, Master Trader, Investors, Observers)
- Copy trading with adjustable ratios
- Profit sharing system
- Group wallet and performance tracking
- Live trade transparency

### 📊 Self Forex Trading Module
- Manual trade execution
- Broker integration support (MT4/MT5)
- Performance tracking and analytics
- Trade history and journal

### 🎯 Admin Features
- User management
- Transaction verification
- Trade monitoring
- System analytics

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Speakeasy** for 2FA
- **Bcrypt** for password hashing
- **Helmet** for security headers
- **CORS** for cross-origin resource sharing
- **Express Rate Limit** for API protection

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
```bash
git clone https://github.com/Jaysouth/stock-trading.git
cd stock-trading
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
```

Edit `.env` file with your configuration:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smartfx-hub
JWT_SECRET=your-secret-key
# ... other configurations
```

4. **Start MongoDB**
```bash
# Linux/Mac
sudo systemctl start mongodb

# Or using Docker
docker run -d -p 27017:27017 --name mongodb mongo
```

5. **Run the application**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

6. **Access the API**
- API will be available at: `http://localhost:5000`
- Health check: `http://localhost:5000/health`

## API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "phoneNumber": "+1234567890",
  "country": "USA",
  "referralCode": "SFX12345678" // optional
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

#### Enable 2FA
```http
POST /api/auth/2fa/enable
Authorization: Bearer <token>
```

#### Verify 2FA
```http
POST /api/auth/2fa/verify
Authorization: Bearer <token>
Content-Type: application/json

{
  "token": "123456"
}
```

### Wallet Endpoints

#### Get Wallet
```http
GET /api/wallet
Authorization: Bearer <token>
```

#### Deposit Funds
```http
POST /api/wallet/deposit
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 1000,
  "paymentMethod": "bank-transfer",
  "paymentDetails": {}
}
```

#### Withdraw Funds
```http
POST /api/wallet/withdraw
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 500,
  "paymentMethod": "bank-transfer",
  "paymentDetails": {}
}
```

#### Allocate Capital
```http
POST /api/wallet/allocate
Authorization: Bearer <token>
Content-Type: application/json

{
  "module": "aiTrading",
  "amount": 500
}
```

### AI Trading Endpoints

#### Get AI Trading Configuration
```http
GET /api/ai-trading/config
Authorization: Bearer <token>
```

#### Update Configuration
```http
PUT /api/ai-trading/config
Authorization: Bearer <token>
Content-Type: application/json

{
  "tradingMode": "balanced",
  "allocatedCapital": 500,
  "maxDailyLoss": 5,
  "stopLossPercentage": 2,
  "takeProfitPercentage": 4,
  "tradingPairs": ["EUR/USD", "GBP/USD"],
  "useRSI": true,
  "useMACD": true
}
```

#### Start AI Trading
```http
POST /api/ai-trading/start
Authorization: Bearer <token>
```

#### Get Performance
```http
GET /api/ai-trading/performance?period=week
Authorization: Bearer <token>
```

### Group Trading Endpoints

#### Create Trading Group
```http
POST /api/group-trading/groups
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Pro Traders Group",
  "description": "Expert forex trading community",
  "groupType": "public",
  "profitSharePercentage": 20,
  "minimumInvestment": 100,
  "maxMembers": 50,
  "riskLevel": "medium"
}
```

#### Get All Groups
```http
GET /api/group-trading/groups?page=1&limit=20
```

#### Join Group
```http
POST /api/group-trading/groups/:id/join
Authorization: Bearer <token>
Content-Type: application/json

{
  "investmentAmount": 500,
  "copyRatio": 1
}
```

#### Get My Groups
```http
GET /api/group-trading/my-groups
Authorization: Bearer <token>
```

### Self Trading Endpoints

#### Create Manual Trade
```http
POST /api/self-trading/trades
Authorization: Bearer <token>
Content-Type: application/json

{
  "symbol": "EUR/USD",
  "direction": "buy",
  "quantity": 1000,
  "entryPrice": 1.1050,
  "stopLoss": 1.1000,
  "takeProfit": 1.1150,
  "leverage": 10
}
```

#### Close Trade
```http
PUT /api/self-trading/trades/:id/close
Authorization: Bearer <token>
Content-Type: application/json

{
  "exitPrice": 1.1120
}
```

#### Get Performance
```http
GET /api/self-trading/performance?period=month
Authorization: Bearer <token>
```

## Database Schema

### User Model
- User credentials and profile
- 2FA settings
- Trading preferences
- Broker accounts
- Referral information

### Wallet Model
- Trading balance
- Profit balance
- Referral balance
- Module allocations

### Trade Model
- Trade details (symbol, direction, prices)
- Risk management (SL/TP)
- P&L calculation
- Trade type (AI, Group, Self)

### AITradingConfig Model
- Trading mode and parameters
- Risk management settings
- Indicator preferences
- Auto-pause settings

### TradingGroup Model
- Group information
- Profit sharing settings
- Copy trading configuration
- Performance metrics

### GroupMember Model
- Membership details
- Investment tracking
- Copy trading settings
- Performance tracking

### Transaction Model
- Deposit/withdrawal records
- Transfer history
- Status tracking

## Security Best Practices

1. **Never commit the `.env` file** - Use `.env.example` as a template
2. **Change default JWT_SECRET** - Use a strong, random secret
3. **Enable 2FA** for all admin accounts
4. **Use HTTPS** in production
5. **Keep dependencies updated** - Run `npm audit` regularly
6. **Implement IP whitelisting** for admin endpoints
7. **Monitor failed login attempts**
8. **Regular database backups**

## Development

### Project Structure
```
stock-trading/
├── backend/
│   ├── config/          # Configuration files
│   ├── controllers/     # Request handlers
│   ├── middleware/      # Express middleware
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   └── server.js        # Main server file
├── frontend/            # Frontend application (future)
├── docs/                # Documentation
├── .env.example         # Environment template
├── .gitignore          # Git ignore file
├── package.json        # Dependencies
└── README.md           # This file
```

### Adding New Features

1. Create model in `backend/models/`
2. Create controller in `backend/controllers/`
3. Create routes in `backend/routes/`
4. Register routes in `backend/server.js`
5. Update documentation

## Testing

```bash
# Run tests (when implemented)
npm test

# Run linter (when implemented)
npm run lint
```

## Deployment

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Use production database
- [ ] Enable HTTPS
- [ ] Set secure JWT_SECRET
- [ ] Configure CORS properly
- [ ] Enable rate limiting
- [ ] Set up logging
- [ ] Configure backup strategy
- [ ] Set up monitoring
- [ ] Enable error tracking

### Deployment Platforms
- **Heroku**: Simple deployment with MongoDB Atlas
- **AWS**: EC2 + RDS/DocumentDB
- **DigitalOcean**: Droplets + Managed MongoDB
- **Azure**: App Service + Cosmos DB

## Roadmap

### Phase 1 (Current)
- [x] User authentication with 2FA
- [x] Wallet system
- [x] AI Trading module core
- [x] Group Trading module core
- [x] Self Trading module core
- [x] Basic API endpoints

### Phase 2 (Next)
- [ ] Frontend React application
- [ ] Real broker API integration (MT4/MT5)
- [ ] Advanced AI/ML models
- [ ] Real-time WebSocket updates
- [ ] Admin dashboard
- [ ] Email notifications

### Phase 3 (Future)
- [ ] Mobile applications (iOS/Android)
- [ ] Advanced analytics and reporting
- [ ] Social trading features
- [ ] Payment gateway integration
- [ ] KYC verification system
- [ ] Multi-language support

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@smartfx-hub.com or join our Discord community.

## Disclaimer

**IMPORTANT**: This is a trading platform. Forex trading carries a high level of risk and may not be suitable for all investors. Past performance is not indicative of future results. Please trade responsibly and never invest more than you can afford to lose.

## Acknowledgments

- Express.js team for the excellent framework
- MongoDB team for the database
- All contributors and testers

---

Built with ❤️ by the SmartFX Hub Team
