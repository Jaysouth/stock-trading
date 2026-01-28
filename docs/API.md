# SmartFX Hub - API Documentation

## Base URL
```
Development: http://localhost:5000
Production: https://api.smartfx-hub.com
```

## Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Endpoints

## Authentication Endpoints

### Register User
Creates a new user account.

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "phoneNumber": "+1234567890",
  "country": "USA",
  "referralCode": "SFX12345678"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    "referralCode": "SFX12345678"
  }
}
```

### Login
Authenticates a user and returns a JWT token.

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    "twoFactorEnabled": false
  }
}
```

If 2FA is enabled:
```json
{
  "success": true,
  "require2FA": true,
  "userId": "507f1f77bcf86cd799439011"
}
```

### Get Current User
Returns the currently authenticated user's information.

```http
GET /api/auth/me
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user",
    "twoFactorEnabled": false,
    "tradingExperience": "intermediate",
    "riskTolerance": "balanced"
  }
}
```

### Enable 2FA
Generates a 2FA secret and QR code.

```http
POST /api/auth/2fa/enable
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCode": "data:image/png;base64,iVBORw0KG..."
}
```

### Verify 2FA
Verifies the 2FA token and activates 2FA.

```http
POST /api/auth/2fa/verify
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "token": "123456"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "2FA enabled successfully"
}
```

### 2FA Login
Completes login with 2FA verification.

```http
POST /api/auth/2fa/login
```

**Request Body:**
```json
{
  "userId": "507f1f77bcf86cd799439011",
  "token": "123456"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

## Wallet Endpoints

### Get Wallet
Retrieves user's wallet information.

```http
GET /api/wallet
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "wallet": {
    "user": "507f1f77bcf86cd799439011",
    "tradingBalance": 1000.00,
    "profitBalance": 250.50,
    "referralBalance": 50.00,
    "totalBalance": 1300.50,
    "aiTradingAllocation": 500.00,
    "groupTradingAllocation": 300.00,
    "selfTradingAllocation": 200.00,
    "frozenAmount": 0,
    "currency": "USD"
  }
}
```

### Deposit Funds
Creates a deposit request.

```http
POST /api/wallet/deposit
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 1000,
  "paymentMethod": "bank-transfer",
  "paymentDetails": {
    "bankName": "Chase Bank",
    "accountNumber": "****1234"
  }
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Deposit request submitted. Awaiting verification.",
  "transaction": {
    "id": "507f1f77bcf86cd799439012",
    "type": "deposit",
    "amount": 1000,
    "status": "pending",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### Withdraw Funds
Creates a withdrawal request.

```http
POST /api/wallet/withdraw
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "amount": 500,
  "paymentMethod": "bank-transfer",
  "paymentDetails": {
    "bankName": "Chase Bank",
    "accountNumber": "****1234"
  }
}
```

**Response:** `201 Created`

### Transfer Between Wallets
Transfer funds between trading, profit, and referral wallets.

```http
POST /api/wallet/transfer
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "from": "profit",
  "to": "trading",
  "amount": 100
}
```

**Response:** `200 OK`

### Allocate Capital
Allocate capital to a trading module.

```http
POST /api/wallet/allocate
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "module": "aiTrading",
  "amount": 500
}
```

Valid modules: `aiTrading`, `groupTrading`, `selfTrading`

**Response:** `200 OK`

### Get Transactions
Retrieves transaction history.

```http
GET /api/wallet/transactions?page=1&limit=20&type=deposit&status=completed
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Results per page (default: 20)
- `type` (optional) - Filter by type: `deposit`, `withdrawal`, `transfer`, `profit`, `loss`
- `status` (optional) - Filter by status: `pending`, `completed`, `failed`

**Response:** `200 OK`

## AI Trading Endpoints

### Get Configuration
Retrieves AI trading configuration.

```http
GET /api/ai-trading/config
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
{
  "success": true,
  "config": {
    "user": "507f1f77bcf86cd799439011",
    "tradingMode": "balanced",
    "allocatedCapital": 500,
    "maxDailyLoss": 5,
    "maxDrawdown": 10,
    "stopLossPercentage": 2,
    "takeProfitPercentage": 4,
    "maxPositionSize": 1000,
    "maxConcurrentTrades": 3,
    "useRSI": true,
    "useMACD": true,
    "useEMA": true,
    "useBollingerBands": true,
    "tradingPairs": ["EUR/USD", "GBP/USD", "USD/JPY"],
    "isActive": false,
    "isPaused": false
  }
}
```

### Update Configuration
Updates AI trading settings.

```http
PUT /api/ai-trading/config
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "tradingMode": "aggressive",
  "allocatedCapital": 1000,
  "maxDailyLoss": 10,
  "stopLossPercentage": 3,
  "takeProfitPercentage": 6,
  "tradingPairs": ["EUR/USD", "GBP/USD"],
  "useRSI": true,
  "useMACD": true
}
```

**Response:** `200 OK`

### Start AI Trading
Activates AI trading.

```http
POST /api/ai-trading/start
Authorization: Bearer <token>
```

**Response:** `200 OK`

### Stop AI Trading
Deactivates AI trading.

```http
POST /api/ai-trading/stop
Authorization: Bearer <token>
```

**Response:** `200 OK`

### Pause AI Trading
Temporarily pauses AI trading.

```http
POST /api/ai-trading/pause
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "Market volatility"
}
```

**Response:** `200 OK`

### Resume AI Trading
Resumes paused AI trading.

```http
POST /api/ai-trading/resume
Authorization: Bearer <token>
```

**Response:** `200 OK`

### Get Performance
Retrieves AI trading performance metrics.

```http
GET /api/ai-trading/performance?period=week
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` - `today`, `week`, `month`, `all` (default: `all`)

**Response:** `200 OK`
```json
{
  "success": true,
  "performance": {
    "totalTrades": 45,
    "closedTrades": 40,
    "openTrades": 5,
    "winTrades": 28,
    "lossTrades": 12,
    "winRate": "70.00",
    "totalProfit": "1250.50",
    "totalLoss": "450.25",
    "netProfit": "800.25",
    "currentDrawdown": 3.5,
    "currentDailyLoss": 1.2
  },
  "trades": []
}
```

### Get Trades
Retrieves AI trading trades.

```http
GET /api/ai-trading/trades?page=1&limit=20&status=closed
Authorization: Bearer <token>
```

**Query Parameters:**
- `page` (optional) - Page number
- `limit` (optional) - Results per page
- `status` (optional) - `pending`, `open`, `closed`, `cancelled`

**Response:** `200 OK`

## Group Trading Endpoints

### Get All Groups
Retrieves list of trading groups.

```http
GET /api/group-trading/groups?page=1&limit=20&groupType=public
```

**Query Parameters:**
- `page` (optional) - Page number
- `limit` (optional) - Results per page
- `groupType` (optional) - `public`, `private`, `signal`, `managed-pool`
- `search` (optional) - Search query

**Response:** `200 OK`

### Get Single Group
Retrieves detailed information about a group.

```http
GET /api/group-trading/groups/:id
```

**Response:** `200 OK`

### Create Group
Creates a new trading group.

```http
POST /api/group-trading/groups
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Pro Traders Group",
  "description": "Expert forex trading community",
  "groupType": "public",
  "profitSharePercentage": 20,
  "minimumInvestment": 100,
  "maxMembers": 50,
  "subscriptionFee": 0,
  "tradingStrategy": "Swing trading with technical analysis",
  "riskLevel": "medium"
}
```

**Response:** `201 Created`

### Join Group
Join a trading group.

```http
POST /api/group-trading/groups/:id/join
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "investmentAmount": 500,
  "copyRatio": 1
}
```

**Response:** `201 Created`

### Leave Group
Leave a trading group.

```http
POST /api/group-trading/groups/:id/leave
Authorization: Bearer <token>
```

**Response:** `200 OK`

### Get My Groups
Retrieves user's group memberships.

```http
GET /api/group-trading/my-groups
Authorization: Bearer <token>
```

**Response:** `200 OK`

### Get Group Members
Retrieves members of a group.

```http
GET /api/group-trading/groups/:id/members
Authorization: Bearer <token>
```

**Response:** `200 OK`

### Get Group Trades
Retrieves trades of a group.

```http
GET /api/group-trading/groups/:id/trades?page=1&limit=20
Authorization: Bearer <token>
```

**Response:** `200 OK`

### Update Copy Settings
Updates copy trading settings for a group.

```http
PUT /api/group-trading/groups/:id/copy-settings
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "copyTradingEnabled": true,
  "copyRatio": 0.5,
  "maxCopyAmount": 1000
}
```

**Response:** `200 OK`

## Self Trading Endpoints

### Get Trades
Retrieves self trading trades.

```http
GET /api/self-trading/trades?page=1&limit=20&status=open
Authorization: Bearer <token>
```

**Response:** `200 OK`

### Create Trade
Creates a manual trade.

```http
POST /api/self-trading/trades
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "symbol": "EUR/USD",
  "direction": "buy",
  "quantity": 1000,
  "entryPrice": 1.1050,
  "stopLoss": 1.1000,
  "takeProfit": 1.1150,
  "leverage": 10,
  "broker": "MT4",
  "notes": "Bullish trend continuation"
}
```

**Response:** `201 Created`

### Update Trade
Updates an existing trade.

```http
PUT /api/self-trading/trades/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "stopLoss": 1.1020,
  "takeProfit": 1.1180,
  "notes": "Adjusted targets"
}
```

**Response:** `200 OK`

### Close Trade
Closes an open trade.

```http
PUT /api/self-trading/trades/:id/close
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "exitPrice": 1.1120
}
```

**Response:** `200 OK`

### Get Performance
Retrieves self trading performance.

```http
GET /api/self-trading/performance?period=month
Authorization: Bearer <token>
```

**Response:** `200 OK`

## Admin Endpoints

All admin endpoints require admin role.

### Get Dashboard
Retrieves admin dashboard statistics.

```http
GET /api/admin/dashboard
Authorization: Bearer <admin-token>
```

**Response:** `200 OK`

### Get Users
Retrieves all users.

```http
GET /api/admin/users?page=1&limit=20&status=active
Authorization: Bearer <admin-token>
```

**Response:** `200 OK`

### Get User Details
Retrieves detailed information about a user.

```http
GET /api/admin/users/:id
Authorization: Bearer <admin-token>
```

**Response:** `200 OK`

### Update User Status
Activates or deactivates a user.

```http
PUT /api/admin/users/:id/status
Authorization: Bearer <admin-token>
```

**Request Body:**
```json
{
  "isActive": false
}
```

**Response:** `200 OK`

### Get Pending Transactions
Retrieves pending transactions.

```http
GET /api/admin/transactions/pending?type=deposit
Authorization: Bearer <admin-token>
```

**Response:** `200 OK`

### Approve Transaction
Approves a pending transaction.

```http
PUT /api/admin/transactions/:id/approve
Authorization: Bearer <admin-token>
```

**Response:** `200 OK`

### Reject Transaction
Rejects a pending transaction.

```http
PUT /api/admin/transactions/:id/reject
Authorization: Bearer <admin-token>
```

**Response:** `200 OK`

### Get All Trades
Retrieves all trades in the system.

```http
GET /api/admin/trades?page=1&limit=20&tradeType=ai-trading
Authorization: Bearer <admin-token>
```

**Response:** `200 OK`

### Get Statistics
Retrieves platform statistics.

```http
GET /api/admin/statistics?period=month
Authorization: Bearer <admin-token>
```

**Response:** `200 OK`

## Error Codes

| Code | Description |
|------|-------------|
| `AUTH_001` | Invalid credentials |
| `AUTH_002` | Token expired |
| `AUTH_003` | 2FA required |
| `WALLET_001` | Insufficient balance |
| `WALLET_002` | Invalid amount |
| `TRADE_001` | Invalid symbol |
| `TRADE_002` | Trade not found |
| `GROUP_001` | Group not found |
| `GROUP_002` | Group is full |

## Rate Limiting

- Default: 100 requests per 15 minutes
- Applies to all `/api/*` endpoints
- Exceeding the limit returns `429 Too Many Requests`

## WebSocket Events (Future)

Coming in Phase 2:
- Real-time price updates
- Trade notifications
- Group activity updates
