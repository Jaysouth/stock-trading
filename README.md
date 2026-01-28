# SmartFX Hub - Multi-Module Forex Trading Platform

A secure, cloud-based forex trading web application designed to serve beginner, intermediate, and professional traders through three integrated trading modules.

## 🌟 Overview

SmartFX Hub is a comprehensive forex trading platform that allows users to trade, invest, learn, and manage forex activities from one unified dashboard while ensuring transparency, risk control, and regulatory compliance.

## 🚀 Features

### Three Integrated Trading Modules

#### 1. **AI Forex Trading**
- Automated algorithmic trading using advanced machine learning
- Multiple trading strategies (momentum, mean reversion, trend following, arbitrage)
- Configurable risk management parameters
- Real-time performance analytics
- AI-powered trade recommendations with confidence scores
- Auto-execution based on predefined rules

#### 2. **Group Forex Trading**
- Collaborative trading with pooled resources
- Create or join trading groups with like-minded traders
- Democratic decision-making through voting system
- Transparent profit distribution among members
- Multiple strategy options (conservative, moderate, aggressive)
- Group performance tracking and analytics

#### 3. **Self Forex Trading**
- Full manual control over trading decisions
- Advanced position management
- Real-time market data and charts
- Customizable stop-loss and take-profit levels
- Comprehensive trading analytics
- Position size calculator based on risk percentage

### Core Features

- **Unified Dashboard**: Single interface to manage all trading modules
- **Broker Integration**: Connect to regulated forex brokers (IC Markets, Pepperstone, etc.)
- **Real-time Market Data**: Live forex prices and market analysis
- **Risk Management**: Built-in risk controls and position sizing tools
- **Portfolio Management**: Track all trades and positions across modules
- **Compliance**: KYC/AML verification, audit logging, regulatory compliance
- **Security**: JWT authentication, encrypted data, secure API endpoints
- **Transparency**: Complete trade history and audit trails

## 📋 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MongoDB (optional, for production use)
- A regulated forex broker account

## 🔧 Installation

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
# Edit .env with your configuration
```

4. **Build the project**
```bash
npm run build
```

## 🏃 Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000` (or the port specified in your `.env` file).

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register a new user
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "trader123",
  "password": "securePassword123",
  "firstName": "John",
  "lastName": "Doe",
  "role": "beginner"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

#### Get user profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Trading Endpoints

#### Get currency pairs
```http
GET /api/trading/pairs
```

#### Get market data
```http
GET /api/trading/market/EUR-USD
```

#### Execute a trade
```http
POST /api/trading/execute
Content-Type: application/json

{
  "currencyPair": "EUR/USD",
  "type": "buy",
  "amount": 1000,
  "module": "self"
}
```

### AI Trading Endpoints

#### Get AI configuration
```http
GET /api/ai-trading/config
```

#### Update AI configuration
```http
PUT /api/ai-trading/config
Content-Type: application/json

{
  "algorithm": "momentum_strategy",
  "riskLevel": "medium",
  "maxTradeSize": 5000,
  "stopLoss": 2.0,
  "takeProfit": 4.0,
  "enabled": true
}
```

#### Get AI recommendations
```http
GET /api/ai-trading/recommendations
```

#### Get AI performance
```http
GET /api/ai-trading/performance
```

### Group Trading Endpoints

#### Get all trading groups
```http
GET /api/group-trading/sessions
```

#### Create a trading group
```http
POST /api/group-trading/sessions
Content-Type: application/json

{
  "name": "Conservative Traders",
  "minContribution": 1000,
  "maxMembers": 10,
  "strategy": "conservative"
}
```

#### Join a trading group
```http
POST /api/group-trading/sessions/:sessionId/join
Content-Type: application/json

{
  "contribution": 5000
}
```

### Self Trading Endpoints

#### Get portfolio
```http
GET /api/self-trading/portfolio
```

#### Get open positions
```http
GET /api/self-trading/positions
```

#### Open a position
```http
POST /api/self-trading/positions
Content-Type: application/json

{
  "currencyPair": "EUR/USD",
  "type": "buy",
  "amount": 1000,
  "stopLoss": 1.0830,
  "takeProfit": 1.0890,
  "leverage": "1:50"
}
```

#### Close a position
```http
POST /api/self-trading/positions/:positionId/close
```

### Dashboard Endpoints

#### Get dashboard overview
```http
GET /api/dashboard/overview
```

#### Get module statistics
```http
GET /api/dashboard/modules/stats
```

#### Get broker connections
```http
GET /api/dashboard/brokers
```

#### Connect to a broker
```http
POST /api/dashboard/brokers/connect
Content-Type: application/json

{
  "brokerName": "IC Markets",
  "apiKey": "your-api-key",
  "accountType": "Standard"
}
```

## 🧪 Testing

Run the test suite:
```bash
npm test
```

Run tests with coverage:
```bash
npm test -- --coverage
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Input validation using Joi
- CORS protection
- Rate limiting
- Secure API key management
- Audit logging for compliance
- KYC/AML verification integration

## 🎯 Trading Modules Comparison

| Feature | AI Trading | Group Trading | Self Trading |
|---------|-----------|---------------|--------------|
| Control Level | Automated | Collaborative | Manual |
| Decision Making | AI Algorithm | Group Vote | Individual |
| Best For | Beginners | Social Traders | Experienced |
| Risk Management | AI-powered | Shared | Custom |
| Learning Curve | Low | Medium | High |
| Time Commitment | Low | Medium | High |

## 📊 Supported Currency Pairs

- EUR/USD (Euro / US Dollar)
- GBP/USD (British Pound / US Dollar)
- USD/JPY (US Dollar / Japanese Yen)
- AUD/USD (Australian Dollar / US Dollar)
- USD/CAD (US Dollar / Canadian Dollar)
- EUR/GBP (Euro / British Pound)
- And more...

## 🏢 Regulatory Compliance

SmartFX Hub ensures compliance with major financial regulations:

- **KYC (Know Your Customer)**: User verification process
- **AML (Anti-Money Laundering)**: Transaction monitoring
- **GDPR**: Data protection and privacy
- **MiFID II**: European financial regulation compliance
- **Audit Logging**: 7-year retention of all transactions

## 🔗 Broker Integration

Connect to regulated forex brokers:

- **IC Markets** (ASIC, CySEC, FSA regulated)
- **Pepperstone** (FCA, ASIC, DFSA regulated)
- **OANDA** (FCA, ASIC, NFA regulated)
- **IG Group** (FCA regulated)
- And more...

## 🛠️ Technology Stack

- **Backend**: Node.js, TypeScript, Express
- **Database**: MongoDB (optional)
- **Authentication**: JWT, bcrypt
- **Validation**: Joi
- **Testing**: Jest
- **API**: RESTful architecture

## 📈 Future Enhancements

- [ ] Real-time WebSocket support for live updates
- [ ] Mobile application (iOS/Android)
- [ ] Advanced charting and technical indicators
- [ ] Social trading features (copy trading)
- [ ] Educational resources and tutorials
- [ ] Multi-language support
- [ ] Advanced backtesting tools
- [ ] Cryptocurrency trading support

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## ⚠️ Disclaimer

**Trading forex carries a high level of risk and may not be suitable for all investors. The high degree of leverage can work against you as well as for you. Before deciding to trade forex, you should carefully consider your investment objectives, level of experience, and risk appetite. SmartFX Hub is a technology platform and does not provide investment advice.**

## 📧 Support

For support, email support@smartfxhub.com or join our community forum.

## 🙏 Acknowledgments

- Forex broker partners for API integration
- Open-source community for excellent tools and libraries
- Our beta testers and early adopters

---

**Built with ❤️ for traders worldwide**
