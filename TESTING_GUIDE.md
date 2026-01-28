# Testing Guide - Stock Trading Wallet System

## Prerequisites
- Python 3.8+
- Node.js 14+
- npm or yarn

## Initial Setup

Run the setup script:
```bash
chmod +x setup.sh
./setup.sh
```

Or manually:

### Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
```

### Frontend Setup
```bash
cd frontend
npm install
```

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
source venv/bin/activate
python manage.py runserver
```
Backend runs at: http://localhost:8000

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```
Frontend runs at: http://localhost:3000

---

## Test Scenarios

### 1. User Registration with 2FA

**Steps:**
1. Navigate to http://localhost:3000/register
2. Fill in registration form:
   - Full Name: "Test User"
   - Email: "test@example.com"
   - Username: "testuser"
   - Contact Number: "+1234567890"
   - Password: "TestPass123"
   - Confirm Password: "TestPass123"
   - Check "Enable Two-Factor Authentication"
3. Click "Register"
4. A QR code should appear
5. Scan QR code with authenticator app (Google Authenticator, Authy, etc.)
6. Click "Continue to Login"

**Expected Result:**
- User registered successfully
- QR code displayed for 2FA setup
- Two wallets created automatically (Savings & Trading)

---

### 2. User Login with 2FA

**Steps:**
1. Navigate to http://localhost:3000/login
2. Enter email: "test@example.com"
3. Enter password: "TestPass123"
4. Click "Login"
5. Enter 6-digit 2FA code from authenticator app
6. Click "Login" again

**Expected Result:**
- User logged in successfully
- Redirected to dashboard
- Dashboard shows wallet balances (both $0.00 initially)

---

### 3. Add Bank Account

**Steps:**
1. From dashboard, click "Bank Accounts" in navigation
2. Click "+ Add Bank Account"
3. Fill in bank details:
   - Account Name: "John Doe"
   - Bank Name: "Chase Bank"
   - Account Number: "1234567890"
   - Routing Number: "021000021"
   - SWIFT Code: "CHASUS33"
4. Click "Add Bank Account"

**Expected Result:**
- Bank account added with status "Pending Admin Approval"
- Maximum 2 bank accounts can be added

---

### 4. Admin Approval - Bank Account

**Steps:**
1. Open http://localhost:8000/admin
2. Login with superuser credentials
3. Go to "Bank Accounts"
4. Select the pending bank account
5. In the form, change status to "Approved"
6. Click "Save"

OR use bulk action:
1. Select pending bank accounts
2. Choose "Approve selected bank accounts" from Actions dropdown
3. Click "Go"

**Expected Result:**
- Bank account status changed to "Approved"
- User can now use this account for withdrawals

---

### 5. Deposit Funds (Simulated)

**Note:** This requires actual payment gateway integration. For testing, we'll use Django shell.

**Steps (Django Shell):**
```bash
cd backend
source venv/bin/activate
python manage.py shell
```

```python
from accounts.models import User
from transactions.models import Transaction

user = User.objects.get(email='test@example.com')
Transaction.create_deposit(
    user=user,
    amount=1000.00,
    payment_gateway_id='test_payment_123'
)
```

**Expected Result:**
- Deposit transaction created with status "Completed"
- Savings wallet balance increased by $1000.00

---

### 6. Withdraw Funds

**Steps:**
1. From dashboard, click "Withdraw Funds"
2. Enter amount: "100"
3. Select approved bank account
4. Review fee breakdown:
   - Withdrawal Fee (3.5%): $3.50
   - VAT Fee (7.5%): $7.50
   - Total Fees: $11.00
   - You will receive: $89.00
5. Click "Submit Withdrawal Request"

**Expected Result:**
- Withdrawal transaction created with status "Pending"
- Awaiting admin approval

---

### 7. Admin Approval - Withdrawal Transaction

**Steps:**
1. Open http://localhost:8000/admin
2. Go to "Transactions"
3. Select the pending withdrawal transaction
4. In the form, review details
5. Use action dropdown or click transaction
6. Approve the transaction:
   - Select "Approve selected transactions"
   - Click "Go"
7. Complete the transaction:
   - Select the approved transaction
   - Select "Complete approved transactions"
   - Click "Go"

**Expected Result:**
- Transaction status changes to "Approved" then "Completed"
- User's Savings wallet decreased by $100.00
- Company wallet increased by $11.00 (fees)
- Net $89.00 marked for transfer to bank account

---

### 8. Transfer Between Wallets

**Steps:**
1. From dashboard, click "Transfer to Trading"
2. Enter amount: "500"
3. Verify direction (Savings → Trading)
4. Click "Submit Transfer Request"

**Expected Result:**
- Transfer transaction created with status "Pending"
- No fees charged (transfers are free)

---

### 9. Admin Approval - Transfer Transaction

**Steps:**
1. Open http://localhost:8000/admin
2. Go to "Transactions"
3. Select pending transfer
4. Approve and complete (same as withdrawal)

**Expected Result:**
- Transfer completed
- $500 moved from Savings to Trading wallet
- No fees charged

---

### 10. View Transaction Statement

**Steps:**
1. From dashboard, click "Transactions"
2. Review transaction history

**Expected Result:**
- All transactions displayed with:
  - Type (Deposit, Withdrawal, Transfer)
  - Amount
  - Fees (if applicable)
  - Net amount
  - Status
  - Date

---

### 11. Admin Transaction Statement

**Steps:**
1. Open http://localhost:8000/admin
2. Go to "Transactions"
3. Review all transactions with fee details
4. Check Company Wallet balance in "Wallets" section

**Expected Result:**
- Admin can see all user transactions
- Fee breakdown visible for withdrawals
- Company wallet shows collected fees

---

## Fee Verification Tests

### Test Case 1: $100 Withdrawal
- Amount: $100.00
- Withdrawal Fee (3.5%): $3.50
- VAT Fee (7.5%): $7.50
- Total Fees: $11.00
- Net to Bank: $89.00

### Test Case 2: $1000 Withdrawal
- Amount: $1000.00
- Withdrawal Fee (3.5%): $35.00
- VAT Fee (7.5%): $75.00
- Total Fees: $110.00
- Net to Bank: $890.00

### Test Case 3: $50 Withdrawal
- Amount: $50.00
- Withdrawal Fee (3.5%): $1.75
- VAT Fee (7.5%): $3.75
- Total Fees: $5.50
- Net to Bank: $44.50

---

## Security Tests

### 2FA Testing
1. Enable 2FA during registration
2. Attempt login without 2FA token → Should fail
3. Login with correct 2FA token → Should succeed
4. Attempt login with invalid 2FA token → Should fail

### Bank Account Limits
1. Add first bank account → Should succeed
2. Add second bank account → Should succeed
3. Attempt to add third bank account → Should fail with error

### Transaction Approval
1. Create withdrawal without admin approval
2. Attempt to complete directly → Should fail
3. Approve then complete → Should succeed

---

## Common Issues & Solutions

### Issue: Cannot login
**Solution:** Check that user exists and password is correct. If 2FA enabled, ensure authenticator app time is synced.

### Issue: Bank account not showing in withdrawal
**Solution:** Ensure bank account status is "Approved" by admin.

### Issue: Withdrawal fails
**Solution:** Check that Savings wallet has sufficient balance.

### Issue: Frontend can't connect to backend
**Solution:** 
- Ensure backend is running on port 8000
- Check CORS settings in backend/config/settings.py
- Verify frontend API URL in frontend/src/services/api.js

---

## API Testing with cURL

### Register User
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "curl@example.com",
    "username": "curluser",
    "full_name": "Curl User",
    "contact_number": "+1234567890",
    "password": "CurlPass123",
    "password_confirm": "CurlPass123",
    "two_factor_enabled": false
  }'
```

### Login
```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -c cookies.txt \
  -d '{
    "email": "curl@example.com",
    "password": "CurlPass123"
  }'
```

### Get Wallets
```bash
curl -X GET http://localhost:8000/api/wallets/my_wallets/ \
  -b cookies.txt
```

---

## Production Deployment Checklist

- [ ] Change SECRET_KEY in settings.py
- [ ] Set DEBUG=False
- [ ] Configure PostgreSQL database
- [ ] Set up real Stripe API keys
- [ ] Configure email settings for 2FA
- [ ] Set up HTTPS
- [ ] Configure proper CORS settings
- [ ] Set up backup system
- [ ] Configure logging
- [ ] Set up monitoring
- [ ] Configure rate limiting
- [ ] Set up CDN for static files

---

## Support

For issues or questions during testing, refer to:
- README.md - General documentation
- API_DOCUMENTATION.md - API endpoints reference
- Django admin logs - Check for backend errors
- Browser console - Check for frontend errors
