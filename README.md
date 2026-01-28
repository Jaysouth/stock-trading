# Stock Trading - Forex Trading Web Application

A comprehensive forex trading platform with an advanced wallet system, featuring user registration with 2FA, multiple wallet types, admin approval workflows, and transaction management.

## Features

### 1. Wallet System
- **Three Wallet Types**:
  - **Company Wallet**: Admin-only wallet that stores fees from withdrawal transactions
  - **Savings Wallet**: User deposit wallet receiving funds from payment gateway
  - **Trading Wallet**: User trading wallet for forex trading purposes

### 2. User Authentication & Security
- Standard registration with full name, email, password, and contact number
- Two-Factor Authentication (2FA) support
- Secure login with 2FA verification
- Session-based authentication

### 3. Bank Account Management
- Users can register up to 2 bank accounts
- Admin approval required before use
- Display approval status (Pending/Approved/Rejected)
- Support for routing numbers and SWIFT codes

### 4. Transaction System
- **Deposits**: Direct deposit to Savings Wallet via payment gateway
- **Withdrawals**: From Savings Wallet to registered bank accounts
  - **Fee Structure**: 11% total (3.5% withdrawal fee + 7.5% VAT)
  - Example: $100 withdrawal → $89 to bank, $11 to Company Wallet
- **Transfers**: Between Savings and Trading wallets (fee-free)
- All transactions require admin approval

### 5. Transaction Statements
- **User Statement**: View all transactions with status tracking
- **Admin Statement**: Detailed view with fees, VAT breakdown, and user information

## Technology Stack

### Backend
- **Framework**: Django 4.2.26 (security patches applied)
- **API**: Django REST Framework
- **Database**: SQLite (development) / PostgreSQL (production)
- **Authentication**: Session-based with 2FA support (PyOTP)
- **Payment Gateway**: Stripe integration ready

### Frontend
- **Framework**: React 18.2
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Custom CSS

## Installation & Setup

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

5. Run migrations:
```bash
python manage.py migrate
```

6. Create superuser:
```bash
python manage.py createsuperuser
```

7. Start development server:
```bash
python manage.py runserver
```

The API will be available at `http://localhost:8000/api/`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm start
```

The app will open at `http://localhost:3000/`

## API Endpoints

### Authentication
- `POST /api/users/register/` - User registration
- `POST /api/users/login/` - User login
- `POST /api/users/logout/` - User logout
- `GET /api/users/me/` - Get current user
- `POST /api/users/setup_2fa/` - Enable/disable 2FA
- `POST /api/users/verify_2fa/` - Verify 2FA token

### Wallets
- `GET /api/wallets/` - List wallets
- `GET /api/wallets/my_wallets/` - Get user's wallets
- `GET /api/wallets/company_wallet/` - Get company wallet (admin only)

### Bank Accounts
- `GET /api/bank-accounts/` - List bank accounts
- `POST /api/bank-accounts/` - Create bank account
- `PUT /api/bank-accounts/{id}/` - Update bank account
- `DELETE /api/bank-accounts/{id}/` - Delete bank account
- `POST /api/bank-accounts/{id}/approve/` - Approve/reject (admin only)

### Transactions
- `GET /api/transactions/` - List transactions
- `POST /api/transactions/deposit/` - Create deposit
- `POST /api/transactions/withdraw/` - Create withdrawal
- `POST /api/transactions/transfer/` - Create transfer
- `POST /api/transactions/{id}/approve/` - Approve/reject/complete (admin only)
- `GET /api/transactions/my_statement/` - User transaction statement
- `GET /api/transactions/admin_statement/` - Admin transaction statement

## Admin Panel

Access the Django admin panel at `http://localhost:8000/admin/`

### Admin Capabilities
1. **User Management**: View and manage all users
2. **Bank Account Approval**: Approve or reject bank account registrations
3. **Transaction Approval**: Three-step process:
   - Approve pending transactions
   - Complete approved transactions (executes wallet operations)
   - View transaction history with fee breakdowns
4. **Wallet Monitoring**: View all wallet balances including Company Wallet
5. **Transaction Statements**: Access detailed reports with fee collections

## Workflow Examples

### User Registration with 2FA
1. User fills registration form with personal details
2. User enables 2FA option
3. System generates QR code
4. User scans QR code with authenticator app
5. User can now login with email, password, and 2FA token

### Withdrawal Process
1. User requests withdrawal from Savings Wallet
2. System calculates fees (3.5% + 7.5% = 11%)
3. Transaction enters "Pending" status
4. Admin reviews and approves transaction
5. Admin completes transaction
6. Net amount transferred to bank account
7. Fees transferred to Company Wallet

### Transfer Between Wallets
1. User transfers from Savings to Trading Wallet
2. Transaction enters "Pending" status (requires approval)
3. Admin approves transaction
4. Admin completes transaction
5. Funds moved between wallets (no fees)

## Fee Structure

- **Withdrawal Fee**: 3.5% of withdrawal amount
- **VAT Fee**: 7.5% of withdrawal amount
- **Total Fee**: 11% of withdrawal amount
- **Transfer Fee**: Free for transfers between own wallets

Example:
- User withdraws $100
- Withdrawal fee: $3.50 (3.5%)
- VAT fee: $7.50 (7.5%)
- Total fees: $11.00
- Amount to bank: $89.00
- Fees to Company Wallet: $11.00

## Security Considerations

1. **Two-Factor Authentication**: Optional 2FA for enhanced security
2. **Admin Approval**: All transactions require admin approval
3. **Session Security**: Secure session-based authentication
4. **CORS Protection**: Configured CORS for frontend-backend communication
5. **Password Validation**: Django's built-in password validators

## Development Notes

- Database uses SQLite for development (easily replaceable with PostgreSQL)
- Payment gateway integration placeholder for Stripe
- Frontend uses session-based auth (cookies)
- All monetary values stored as Decimal for precision

## Future Enhancements

1. Real Stripe payment gateway integration
2. Email notifications for transactions
3. Real-time balance updates
4. Transaction filters and search
5. Export statements to PDF
6. Mobile app version
7. Multi-currency support
8. Advanced trading features

## License

This project is proprietary software for Forex Trading Business.

## Support

For issues or questions, please contact the development team.
