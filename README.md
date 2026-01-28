# SmartFX Hub

**Multi-Module Forex Trading Platform**

SmartFX Hub is a comprehensive forex trading web application with three integrated modules:

1. **AI Forex Trading** - Automated trading powered by artificial intelligence
2. **Group Forex Trading** - Community-based trading with copy trading and profit sharing
3. **Self Forex Trading** - Manual trading with professional tools

## Features

- 🔐 **Secure Authentication** - JWT + Two-Factor Authentication (2FA)
- 💰 **Multi-Wallet System** - Separate wallets for trading, profits, and referrals
- 🤖 **AI Trading** - Automated trading with RSI, MACD, EMA, and Bollinger Bands analysis
- 👥 **Group Trading** - Create/join trading groups with copy trading
- 📊 **Self Trading** - Manual trading with performance tracking
- 💳 **Deposit/Withdrawal** - Secure fund management
- 🎯 **Risk Management** - Stop-loss, take-profit, and daily loss limits

## Quick Start

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

3. **Start MongoDB**
```bash
# Using Docker
docker run -d -p 27017:27017 mongo

# Or local MongoDB
sudo systemctl start mongodb
```

4. **Run the application**
```bash
npm start
```

5. **Access the API**
- API: `http://localhost:5000`
- Health Check: `http://localhost:5000/health`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/2fa/enable` - Enable 2FA
- `GET /api/auth/me` - Get current user

### Wallet
- `GET /api/wallet` - Get wallet balance
- `POST /api/wallet/deposit` - Deposit funds
- `POST /api/wallet/withdraw` - Withdraw funds
- `POST /api/wallet/allocate` - Allocate capital to modules

### AI Trading
- `GET /api/ai-trading/config` - Get configuration
- `PUT /api/ai-trading/config` - Update configuration
- `POST /api/ai-trading/start` - Start AI trading
- `GET /api/ai-trading/performance` - Get performance metrics

### Group Trading
- `GET /api/group-trading/groups` - List all groups
- `POST /api/group-trading/groups` - Create new group
- `POST /api/group-trading/groups/:id/join` - Join group
- `GET /api/group-trading/my-groups` - Get my groups

### Self Trading
- `POST /api/self-trading/trades` - Create manual trade
- `PUT /api/self-trading/trades/:id/close` - Close trade
- `GET /api/self-trading/performance` - Get performance

## Documentation

Full documentation is available in the [docs/README.md](docs/README.md) file.

## Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT, Speakeasy (2FA)
- **Security**: Helmet, CORS, Rate Limiting

## License

MIT License - see LICENSE file for details

## Disclaimer

Forex trading carries substantial risk. This platform is for educational purposes. Trade responsibly.

---

For detailed documentation, API references, and development guides, see [docs/README.md](docs/README.md).

