# Database Schema Documentation

## Overview
The Stock Trading application uses a relational database with the following main entities:
- Users (with 2FA support)
- Wallets (Company, Savings, Trading)
- Bank Accounts
- Transactions

---

## Entity Relationship Diagram (Text Format)

```
┌─────────────────────────┐
│         User            │
├─────────────────────────┤
│ id (PK)                 │
│ username                │
│ email (unique)          │
│ password (hashed)       │
│ full_name               │
│ contact_number          │
│ two_factor_enabled      │
│ two_factor_secret       │
│ is_staff                │
│ created_at              │
│ updated_at              │
└─────────────────────────┘
         │
         │ 1:N
         ├──────────────────────────┐
         │                          │
         ↓                          ↓
┌─────────────────────────┐  ┌─────────────────────────┐
│       Wallet            │  │     BankAccount         │
├─────────────────────────┤  ├─────────────────────────┤
│ id (PK)                 │  │ id (PK)                 │
│ user_id (FK)            │  │ user_id (FK)            │
│ wallet_type             │  │ account_name            │
│ balance (decimal)       │  │ account_number          │
│ created_at              │  │ bank_name               │
│ updated_at              │  │ routing_number          │
└─────────────────────────┘  │ swift_code              │
         │                   │ status                  │
         │                   │ rejection_reason        │
         │ N:N               │ approved_by (FK->User)  │
         ↓                   │ approved_at             │
┌─────────────────────────┐  │ created_at              │
│     Transaction         │  │ updated_at              │
├─────────────────────────┤  └─────────────────────────┘
│ id (PK)                 │           │
│ user_id (FK)            │           │
│ transaction_type        │           │ N:1
│ status                  │←──────────┘
│ amount (decimal)        │
│ withdrawal_fee          │
│ vat_fee                 │
│ total_fees              │
│ net_amount              │
│ from_wallet_id (FK)     │
│ to_wallet_id (FK)       │
│ to_bank_account_id (FK) │
│ payment_gateway_id      │
│ approved_by (FK->User)  │
│ approved_at             │
│ rejection_reason        │
│ notes                   │
│ created_at              │
│ updated_at              │
│ completed_at            │
└─────────────────────────┘
```

---

## Table Definitions

### User Table (accounts_user)

Custom user model extending Django's AbstractUser.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | PK, Auto-increment | Primary key |
| username | String(150) | Unique, Not Null | Username for login |
| email | String(254) | Unique, Not Null | Email address (also used for login) |
| password | String(128) | Not Null | Hashed password |
| full_name | String(255) | Not Null | User's full name |
| contact_number | String(20) | Not Null | Phone number |
| two_factor_enabled | Boolean | Default: False | 2FA status |
| two_factor_secret | String(32) | Nullable | TOTP secret for 2FA |
| is_staff | Boolean | Default: False | Admin access flag |
| is_active | Boolean | Default: True | Account active status |
| date_joined | DateTime | Auto-now-add | Registration timestamp |
| created_at | DateTime | Auto-now-add | Record creation |
| updated_at | DateTime | Auto-now | Last update |

**Indexes:**
- Primary Key on `id`
- Unique Index on `email`
- Unique Index on `username`

---

### Wallet Table (wallets_wallet)

Stores wallet balances for users and the company.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | PK, Auto-increment | Primary key |
| user_id | Integer | FK->User, Nullable | Owner (null for company wallet) |
| wallet_type | String(20) | Not Null | Type: company/savings/trading |
| balance | Decimal(15,2) | Default: 0.00 | Current balance |
| created_at | DateTime | Auto-now-add | Creation timestamp |
| updated_at | DateTime | Auto-now | Last update timestamp |

**Indexes:**
- Primary Key on `id`
- Foreign Key on `user_id`
- Unique Index on `(user_id, wallet_type)`

**Wallet Types:**
- `company` - Admin-only wallet for fee collection
- `savings` - User deposit/withdrawal wallet
- `trading` - User forex trading wallet

---

### BankAccount Table (accounts_bankaccount)

User registered bank accounts for withdrawals.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | PK, Auto-increment | Primary key |
| user_id | Integer | FK->User, Not Null | Account owner |
| account_name | String(255) | Not Null | Account holder name |
| account_number | String(50) | Not Null | Bank account number |
| bank_name | String(255) | Not Null | Name of bank |
| routing_number | String(50) | Nullable | Routing/sort code |
| swift_code | String(50) | Nullable | International transfers |
| status | String(20) | Default: pending | Approval status |
| rejection_reason | Text | Nullable | If rejected |
| approved_by | Integer | FK->User, Nullable | Admin who approved |
| approved_at | DateTime | Nullable | Approval timestamp |
| created_at | DateTime | Auto-now-add | Creation timestamp |
| updated_at | DateTime | Auto-now | Last update |

**Indexes:**
- Primary Key on `id`
- Foreign Key on `user_id`
- Foreign Key on `approved_by`
- Index on `status`

**Status Values:**
- `pending` - Awaiting admin approval
- `approved` - Ready for use
- `rejected` - Not approved

**Constraints:**
- Maximum 2 bank accounts per user (enforced in application logic)

---

### Transaction Table (transactions_transaction)

All financial transactions in the system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | Integer | PK, Auto-increment | Primary key |
| user_id | Integer | FK->User, Not Null | Transaction owner |
| transaction_type | String(20) | Not Null | Type of transaction |
| status | String(20) | Default: pending | Transaction status |
| amount | Decimal(15,2) | Not Null | Transaction amount |
| withdrawal_fee | Decimal(15,2) | Default: 0.00 | Withdrawal fee (3.5%) |
| vat_fee | Decimal(15,2) | Default: 0.00 | VAT fee (7.5%) |
| total_fees | Decimal(15,2) | Default: 0.00 | Sum of all fees |
| net_amount | Decimal(15,2) | Not Null | Amount after fees |
| from_wallet_id | Integer | FK->Wallet, Nullable | Source wallet |
| to_wallet_id | Integer | FK->Wallet, Nullable | Destination wallet |
| to_bank_account_id | Integer | FK->BankAccount, Nullable | Destination bank |
| payment_gateway_id | String(255) | Nullable | Payment reference |
| approved_by | Integer | FK->User, Nullable | Admin who approved |
| approved_at | DateTime | Nullable | Approval timestamp |
| rejection_reason | Text | Nullable | If rejected |
| notes | Text | Nullable | Additional notes |
| created_at | DateTime | Auto-now-add | Creation timestamp |
| updated_at | DateTime | Auto-now | Last update |
| completed_at | DateTime | Nullable | Completion timestamp |

**Indexes:**
- Primary Key on `id`
- Foreign Key on `user_id`
- Foreign Key on `from_wallet_id`
- Foreign Key on `to_wallet_id`
- Foreign Key on `to_bank_account_id`
- Foreign Key on `approved_by`
- Index on `status`
- Index on `transaction_type`
- Index on `created_at`

**Transaction Types:**
- `deposit` - Payment gateway → Savings wallet
- `withdrawal` - Savings wallet → Bank account
- `transfer` - Savings ↔ Trading wallet
- `fee` - Reserved for future use

**Status Values:**
- `pending` - Awaiting admin approval
- `approved` - Approved, awaiting execution
- `completed` - Successfully executed
- `rejected` - Rejected by admin
- `failed` - Execution failed

---

## Data Flow Examples

### Deposit Flow
1. User initiates deposit via payment gateway
2. Payment gateway confirms payment
3. System creates Transaction (type: deposit, status: completed)
4. Savings Wallet balance increased
5. Transaction completed_at timestamp set

### Withdrawal Flow
1. User requests withdrawal
2. System calculates fees (3.5% + 7.5% = 11%)
3. Transaction created (status: pending)
4. Admin approves transaction (status: approved)
5. Admin completes transaction:
   - Savings Wallet decreased by full amount
   - Company Wallet increased by fees
   - Transaction status: completed
6. Net amount marked for bank transfer

### Transfer Flow
1. User requests transfer (Savings → Trading)
2. Transaction created (status: pending, no fees)
3. Admin approves (status: approved)
4. Admin completes:
   - Source wallet decreased
   - Destination wallet increased
   - Transaction status: completed

---

## Fee Calculation Logic

```python
# For withdrawals only
withdrawal_amount = 100.00
withdrawal_fee = amount * 0.035  # 3.5% = $3.50
vat_fee = amount * 0.075         # 7.5% = $7.50
total_fees = withdrawal_fee + vat_fee  # $11.00
net_amount = amount - total_fees       # $89.00

# Wallet operations:
# - Deduct full amount ($100) from Savings Wallet
# - Add fees ($11) to Company Wallet
# - Transfer net ($89) to bank account
```

---

## Constraints and Business Rules

### User Constraints
- Email must be unique
- Username must be unique
- Password minimum length: 8 characters
- 2FA is optional

### Bank Account Rules
- Maximum 2 bank accounts per user
- Must be approved before use in withdrawals
- Can be deleted by user if not in active transactions

### Wallet Rules
- Each user has exactly 2 wallets (Savings, Trading)
- Company has 1 wallet (Company)
- Balance cannot go negative (enforced in code)
- All amounts use Decimal(15,2) for precision

### Transaction Rules
- Deposits: Auto-completed after payment confirmation
- Withdrawals: Require admin approval and completion
- Transfers: Require admin approval and completion
- All monetary values rounded to 2 decimal places
- Withdrawal fees: 3.5% + 7.5% VAT = 11% total
- Transfer fees: 0% (free between own wallets)

---

## Security Considerations

1. **Password Storage**: Hashed using Django's PBKDF2 algorithm
2. **2FA Secrets**: Stored encrypted, used for TOTP generation
3. **Session Management**: Secure session cookies with CSRF protection
4. **Foreign Keys**: Cascading deletes prevented where appropriate
5. **Decimal Precision**: All monetary values use Decimal type to avoid floating-point errors
6. **Admin Approval**: Two-step process (approve + complete) for audit trail

---

## Indexes and Performance

Key indexes for query optimization:
- User email (for login)
- Transaction status + created_at (for pending transactions)
- Wallet user_id + wallet_type (for balance queries)
- BankAccount user_id + status (for approved accounts)

---

## Backup and Recovery

Recommended backup strategy:
1. Daily full database backup
2. Transaction log backups every 15 minutes
3. Keep backups for 30 days minimum
4. Test restoration quarterly

---

## Future Schema Considerations

Potential additions:
- Transaction limits table (daily/monthly limits per user)
- Audit log table (all wallet balance changes)
- Exchange rate table (for multi-currency)
- Trading positions table (forex trades)
- Notifications table (email/SMS alerts)
