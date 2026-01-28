# System Architecture - Stock Trading Wallet System

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │  Registration │  │    Login     │  │   Dashboard  │              │
│  │   with 2FA    │  │   with 2FA   │  │   + Widgets  │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│  │     Bank     │  │ Transactions │  │   Withdraw   │              │
│  │   Accounts   │  │   History    │  │    + Fees    │              │
│  └──────────────┘  └──────────────┘  └──────────────┘              │
│                                                                       │
│  ┌──────────────┐                                                    │
│  │   Transfer   │          React 18.2 + React Router                │
│  │   Between    │          Custom CSS Styling                       │
│  │   Wallets    │          Axios for HTTP                           │
│  └──────────────┘                                                    │
│                                                                       │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                │ HTTP/HTTPS
                                │ REST API
                                │ Session Cookies
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         API LAYER                                    │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Django REST Framework                                               │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  Authentication Endpoints                                  │     │
│  │  • POST /api/users/register/                               │     │
│  │  • POST /api/users/login/                                  │     │
│  │  • POST /api/users/setup_2fa/                              │     │
│  │  • GET  /api/users/me/                                     │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  Wallet Endpoints                                          │     │
│  │  • GET  /api/wallets/my_wallets/                           │     │
│  │  • GET  /api/wallets/company_wallet/ (admin)              │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  Bank Account Endpoints                                    │     │
│  │  • GET  /api/bank-accounts/                                │     │
│  │  • POST /api/bank-accounts/                                │     │
│  │  • POST /api/bank-accounts/{id}/approve/ (admin)          │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  Transaction Endpoints                                     │     │
│  │  • POST /api/transactions/deposit/                         │     │
│  │  • POST /api/transactions/withdraw/                        │     │
│  │  • POST /api/transactions/transfer/                        │     │
│  │  • POST /api/transactions/{id}/approve/ (admin)           │     │
│  │  • GET  /api/transactions/my_statement/                    │     │
│  │  • GET  /api/transactions/admin_statement/ (admin)        │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                │ Django ORM
                                │
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                      BUSINESS LOGIC LAYER                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  accounts App                                              │     │
│  │  • User Model (with 2FA)                                   │     │
│  │  • BankAccount Model                                       │     │
│  │  • UserViewSet                                             │     │
│  │  • BankAccountViewSet                                      │     │
│  │  • 2FA QR Code Generation                                  │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  wallets App                                               │     │
│  │  • Wallet Model (Company, Savings, Trading)                │     │
│  │  • WalletViewSet                                           │     │
│  │  • Balance Management                                      │     │
│  │  • Wallet Creation Logic                                   │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  transactions App                                          │     │
│  │  • Transaction Model                                       │     │
│  │  • TransactionViewSet                                      │     │
│  │  • Fee Calculation (3.5% + 7.5%)                          │     │
│  │  • Deposit/Withdraw/Transfer Logic                         │     │
│  │  • Transaction Statement Generation                        │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
                                │ SQL Queries
                                │
                                ↓
┌─────────────────────────────────────────────────────────────────────┐
│                         DATA LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  SQLite (Development) / PostgreSQL (Production)                      │
│                                                                       │
│  ┌───────────────────┐  ┌───────────────────┐                       │
│  │  accounts_user    │  │  wallets_wallet   │                       │
│  ├───────────────────┤  ├───────────────────┤                       │
│  │ • id (PK)         │  │ • id (PK)         │                       │
│  │ • email (unique)  │  │ • user_id (FK)    │                       │
│  │ • full_name       │  │ • wallet_type     │                       │
│  │ • 2fa_secret      │  │ • balance         │                       │
│  │ • created_at      │  │ • created_at      │                       │
│  └───────────────────┘  └───────────────────┘                       │
│                                                                       │
│  ┌───────────────────┐  ┌───────────────────────────────────────┐   │
│  │ accounts_bank     │  │  transactions_transaction             │   │
│  │ account           │  ├───────────────────────────────────────┤   │
│  ├───────────────────┤  │ • id (PK)                             │   │
│  │ • id (PK)         │  │ • user_id (FK)                        │   │
│  │ • user_id (FK)    │  │ • transaction_type                    │   │
│  │ • account_name    │  │ • amount, fees, net_amount            │   │
│  │ • bank_name       │  │ • from_wallet_id, to_wallet_id (FK)   │   │
│  │ • status          │  │ • to_bank_account_id (FK)             │   │
│  │ • approved_by     │  │ • status, approved_by                 │   │
│  └───────────────────┘  │ • created_at, completed_at            │   │
│                         └───────────────────────────────────────┘   │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                      ADMIN LAYER                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  Django Admin Panel (/admin)                                         │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  User Management                                           │     │
│  │  • View/Edit Users                                         │     │
│  │  • Manage 2FA Settings                                     │     │
│  │  • Permission Management                                   │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  Bank Account Approval                                     │     │
│  │  • Approve/Reject Accounts                                 │     │
│  │  • Bulk Actions                                            │     │
│  │  • View Approval History                                   │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  Transaction Management                                    │     │
│  │  • Approve Pending Transactions                            │     │
│  │  • Complete Approved Transactions                          │     │
│  │  • Reject with Reason                                      │     │
│  │  • View Fee Breakdown                                      │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  Wallet Monitoring                                         │     │
│  │  • View All Wallet Balances                                │     │
│  │  • Monitor Company Wallet                                  │     │
│  │  • Track Fee Collections                                   │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘


┌─────────────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  Payment Gateway (Stripe)                                  │     │
│  │  • Process Deposits                                        │     │
│  │  • Webhook Callbacks                                       │     │
│  │  • Payment Confirmation                                    │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  Email Service (for 2FA)                                   │     │
│  │  • Send 2FA Setup Instructions                             │     │
│  │  • Transaction Notifications (future)                      │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
│  ┌────────────────────────────────────────────────────────────┐     │
│  │  Banking API (future)                                      │     │
│  │  • Process Withdrawals                                     │     │
│  │  • Bank Account Verification                               │     │
│  └────────────────────────────────────────────────────────────┘     │
│                                                                       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Diagrams

### User Registration Flow

```
User → Frontend Register → API POST /users/register/ → Create User
                                                      → Create Wallets
                                                      → Generate 2FA Secret
                                                      → Return QR Code
     ← Display QR Code ← Response with QR Code ←────┘
```

### Deposit Flow

```
User → Payment Gateway → Webhook → API POST /transactions/deposit/
                                  → Create Transaction (completed)
                                  → Add to Savings Wallet
                                  → Return Success
     ← Dashboard Updated ← Frontend Polls ← Response
```

### Withdrawal Flow (with Admin Approval)

```
User → Frontend Withdraw Form → Calculate Fees (11%)
                               → API POST /transactions/withdraw/
                               → Create Transaction (pending)
                               → Response: Pending Approval

Admin → Django Admin → Approve Transaction → Status: Approved
                                            → Complete Transaction
                                            → Deduct from Savings
                                            → Add Fees to Company Wallet
                                            → Status: Completed
                                            → Initiate Bank Transfer

User ← Email Notification ← Transaction Completed
```

### Transfer Flow (with Admin Approval)

```
User → Frontend Transfer → API POST /transactions/transfer/
                         → Validate Balances
                         → Create Transaction (pending)
                         → Response: Pending Approval

Admin → Django Admin → Approve & Complete → Deduct from Source Wallet
                                          → Add to Destination Wallet
                                          → Status: Completed

User ← Dashboard Updated ← Wallet Balances Changed
```

---

## Security Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Security Layers                           │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  Layer 1: Authentication                                     │
│  ├─ Session-based Auth                                       │
│  ├─ CSRF Protection                                          │
│  ├─ Password Hashing (PBKDF2)                                │
│  └─ Optional 2FA (TOTP)                                      │
│                                                               │
│  Layer 2: Authorization                                      │
│  ├─ User vs Admin Permissions                                │
│  ├─ Owner-only Resource Access                               │
│  ├─ Staff-only Endpoints                                     │
│  └─ Action-level Permissions                                 │
│                                                               │
│  Layer 3: Data Protection                                    │
│  ├─ HTTPS (production)                                       │
│  ├─ Secure Cookies                                           │
│  ├─ SQL Injection Protection (ORM)                           │
│  ├─ XSS Protection (React)                                   │
│  └─ CORS Configuration                                       │
│                                                               │
│  Layer 4: Business Logic                                     │
│  ├─ Decimal Precision for Money                              │
│  ├─ Admin Approval Required                                  │
│  ├─ Balance Validation                                       │
│  ├─ Max 2 Bank Accounts                                      │
│  └─ Audit Trail (timestamps)                                 │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Deployment Architecture (Production)

```
                    ┌──────────────────┐
                    │   Load Balancer  │
                    │   (nginx/AWS)    │
                    └────────┬─────────┘
                             │
                    ┌────────┴─────────┐
                    │                  │
         ┌──────────▼──────┐  ┌───────▼────────┐
         │   Frontend      │  │    Backend     │
         │   React Build   │  │  Django+Gunicorn│
         │   (Static CDN)  │  │  (App Servers) │
         └─────────────────┘  └───────┬────────┘
                                      │
                             ┌────────┴─────────┐
                             │                  │
                    ┌────────▼──────┐  ┌───────▼────────┐
                    │  PostgreSQL   │  │     Redis      │
                    │   (Primary)   │  │   (Sessions)   │
                    └───────────────┘  └────────────────┘
```

---

## Technology Stack Summary

```
Frontend:
├── React 18.2.0
├── React Router 6.20.0
├── Axios 1.6.2
└── Custom CSS

Backend:
├── Django 4.2.26
├── Django REST Framework 3.14.0
├── PyOTP 2.9.0 (2FA)
├── qrcode 7.4.2 (QR generation)
└── Stripe 7.8.0 (payments)

Database:
├── SQLite (development)
└── PostgreSQL (production)

Tools:
├── Git (version control)
├── npm (frontend packages)
└── pip (Python packages)
```

---

## Scalability Considerations

1. **Database**:
   - Indexes on frequently queried fields
   - Pagination for large result sets
   - Connection pooling

2. **API**:
   - Rate limiting (future)
   - Caching with Redis (future)
   - Async task processing (future)

3. **Frontend**:
   - Code splitting
   - Lazy loading
   - CDN for static assets

4. **Monitoring**:
   - Application logs
   - Error tracking
   - Performance metrics
   - Uptime monitoring

---

**End of Architecture Documentation**
