# Stock Trading API Documentation

## Base URL
```
http://localhost:8000/api
```

## Authentication
The API uses session-based authentication with cookie support. Include credentials in all requests after login.

---

## Authentication Endpoints

### Register User
**POST** `/users/register/`

Register a new user with optional 2FA.

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "full_name": "John Doe",
  "contact_number": "+1234567890",
  "password": "SecurePassword123",
  "password_confirm": "SecurePassword123",
  "two_factor_enabled": true
}
```

**Response (201 Created):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "username": "johndoe",
    "full_name": "John Doe",
    "contact_number": "+1234567890",
    "two_factor_enabled": true,
    "created_at": "2024-01-28T12:00:00Z"
  },
  "message": "User registered successfully",
  "qr_code": "data:image/png;base64,...",
  "secret": "JBSWY3DPEHPK3PXP"
}
```

### Login
**POST** `/users/login/`

Login with email, password, and optional 2FA token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "two_factor_token": "123456"
}
```

**Response (200 OK):**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe"
  },
  "message": "Login successful"
}
```

### Logout
**POST** `/users/logout/`

Logout current user.

**Response (200 OK):**
```json
{
  "message": "Logout successful"
}
```

### Get Current User
**GET** `/users/me/`

Get currently authenticated user details.

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "full_name": "John Doe",
  "contact_number": "+1234567890",
  "two_factor_enabled": true,
  "created_at": "2024-01-28T12:00:00Z"
}
```

### Setup 2FA
**POST** `/users/setup_2fa/`

Enable or disable 2FA.

**Request Body:**
```json
{
  "enable": true
}
```

**Response (200 OK):**
```json
{
  "message": "2FA enabled successfully",
  "qr_code": "data:image/png;base64,...",
  "secret": "JBSWY3DPEHPK3PXP"
}
```

---

## Wallet Endpoints

### Get My Wallets
**GET** `/wallets/my_wallets/`

Get current user's savings and trading wallets.

**Response (200 OK):**
```json
{
  "savings_wallet": {
    "id": 1,
    "user": 1,
    "user_name": "John Doe",
    "wallet_type": "savings",
    "wallet_type_display": "Savings Wallet",
    "balance": "1000.00",
    "created_at": "2024-01-28T12:00:00Z",
    "updated_at": "2024-01-28T12:00:00Z"
  },
  "trading_wallet": {
    "id": 2,
    "user": 1,
    "user_name": "John Doe",
    "wallet_type": "trading",
    "wallet_type_display": "Trading Wallet",
    "balance": "500.00",
    "created_at": "2024-01-28T12:00:00Z",
    "updated_at": "2024-01-28T12:00:00Z"
  }
}
```

### Get Company Wallet (Admin Only)
**GET** `/wallets/company_wallet/`

Get company wallet details.

**Response (200 OK):**
```json
{
  "id": 3,
  "user": null,
  "user_name": "Company (Admin)",
  "wallet_type": "company",
  "wallet_type_display": "Company Wallet",
  "balance": "1100.00",
  "created_at": "2024-01-28T12:00:00Z",
  "updated_at": "2024-01-28T12:00:00Z"
}
```

---

## Bank Account Endpoints

### List Bank Accounts
**GET** `/bank-accounts/`

List user's bank accounts.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user": 1,
    "user_name": "John Doe",
    "account_name": "John Doe",
    "account_number": "1234567890",
    "bank_name": "Chase Bank",
    "routing_number": "021000021",
    "swift_code": "CHASUS33",
    "status": "approved",
    "status_display": "Approved",
    "rejection_reason": "",
    "created_at": "2024-01-28T12:00:00Z",
    "approved_at": "2024-01-28T13:00:00Z"
  }
]
```

### Create Bank Account
**POST** `/bank-accounts/`

Create a new bank account (max 2 per user).

**Request Body:**
```json
{
  "account_name": "John Doe",
  "account_number": "1234567890",
  "bank_name": "Chase Bank",
  "routing_number": "021000021",
  "swift_code": "CHASUS33"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "account_name": "John Doe",
  "account_number": "1234567890",
  "bank_name": "Chase Bank",
  "status": "pending",
  "status_display": "Pending Admin Approval"
}
```

### Delete Bank Account
**DELETE** `/bank-accounts/{id}/`

Delete a bank account.

**Response (204 No Content)**

### Approve Bank Account (Admin Only)
**POST** `/bank-accounts/{id}/approve/`

Approve or reject a bank account.

**Request Body:**
```json
{
  "action": "approve",
  "rejection_reason": ""
}
```

**Response (200 OK):**
```json
{
  "message": "Bank account approved successfully"
}
```

---

## Transaction Endpoints

### Create Deposit
**POST** `/transactions/deposit/`

Create a deposit transaction.

**Request Body:**
```json
{
  "amount": 1000.00,
  "payment_gateway_id": "pi_1234567890"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "user": 1,
  "user_name": "John Doe",
  "transaction_type": "deposit",
  "transaction_type_display": "Deposit",
  "status": "completed",
  "status_display": "Completed",
  "amount": "1000.00",
  "withdrawal_fee": "0.00",
  "vat_fee": "0.00",
  "total_fees": "0.00",
  "net_amount": "1000.00",
  "created_at": "2024-01-28T12:00:00Z"
}
```

### Create Withdrawal
**POST** `/transactions/withdraw/`

Create a withdrawal request.

**Request Body:**
```json
{
  "amount": 100.00,
  "bank_account_id": 1
}
```

**Response (201 Created):**
```json
{
  "id": 2,
  "transaction_type": "withdrawal",
  "status": "pending",
  "amount": "100.00",
  "withdrawal_fee": "3.50",
  "vat_fee": "7.50",
  "total_fees": "11.00",
  "net_amount": "89.00",
  "to_bank_account": 1
}
```

### Create Transfer
**POST** `/transactions/transfer/`

Create a wallet-to-wallet transfer.

**Request Body:**
```json
{
  "amount": 500.00,
  "from_wallet_type": "savings",
  "to_wallet_type": "trading"
}
```

**Response (201 Created):**
```json
{
  "id": 3,
  "transaction_type": "transfer",
  "status": "pending",
  "amount": "500.00",
  "total_fees": "0.00",
  "net_amount": "500.00"
}
```

### Get My Statement
**GET** `/transactions/my_statement/`

Get user's transaction statement.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "transaction_type_display": "Deposit",
    "amount": "1000.00",
    "total_fees": "0.00",
    "net_amount": "1000.00",
    "status": "completed",
    "created_at": "2024-01-28T12:00:00Z"
  }
]
```

### Get Admin Statement (Admin Only)
**GET** `/transactions/admin_statement/`

Get detailed transaction statement with fee breakdown.

**Response (200 OK):**
```json
{
  "transactions": [
    {
      "id": 2,
      "user_id": 1,
      "user_name": "John Doe",
      "transaction_type": "withdrawal",
      "amount": "100.00",
      "withdrawal_fee": "3.50",
      "vat_fee": "7.50",
      "total_fees": "11.00",
      "net_amount": "89.00",
      "status": "completed"
    }
  ],
  "summary": {
    "total_fees_collected": 11.00,
    "total_withdrawal_fees": 3.50,
    "total_vat_fees": 7.50
  }
}
```

### Approve Transaction (Admin Only)
**POST** `/transactions/{id}/approve/`

Approve, reject, or complete a transaction.

**Request Body:**
```json
{
  "action": "approve",
  "rejection_reason": ""
}
```

Actions: `approve`, `reject`, `complete`

**Response (200 OK):**
```json
{
  "message": "Transaction approved successfully"
}
```

---

## Fee Structure

### Withdrawal Fees
- **Withdrawal Fee**: 3.5% of amount
- **VAT Fee**: 7.5% of amount
- **Total**: 11% of amount

**Example:**
- Withdrawal Amount: $100.00
- Withdrawal Fee (3.5%): $3.50
- VAT Fee (7.5%): $7.50
- Total Fees: $11.00
- **Net Amount to Bank**: $89.00
- **Fees to Company Wallet**: $11.00

### Transfer Fees
Transfers between user's own wallets are **free** (0% fee).

---

## Error Responses

All error responses follow this format:

```json
{
  "error": "Error message here",
  "detail": "Additional details if available"
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `204` - No Content (successful deletion)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
