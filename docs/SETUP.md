# Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** v14 or higher ([Download](https://nodejs.org/))
- **MongoDB** v4.4 or higher ([Download](https://www.mongodb.com/try/download/community))
- **npm** (comes with Node.js)

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Jaysouth/stock-trading.git
cd stock-trading
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- speakeasy (for 2FA)
- qrcode
- helmet
- cors
- express-rate-limit
- dotenv

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/smartfx-hub

# JWT Configuration  
JWT_SECRET=change-this-to-a-very-long-random-secret-key
JWT_EXPIRE=7d

# Two-Factor Authentication
TWO_FACTOR_APP_NAME=SmartFX Hub

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

**Important**: Change `JWT_SECRET` to a strong random string in production!

### 4. Start MongoDB

#### Option A: Using Docker (Recommended)

```bash
docker run -d -p 27017:27017 --name smartfx-mongodb mongo:latest
```

#### Option B: Local MongoDB Installation

**Linux:**
```bash
sudo systemctl start mongodb
sudo systemctl enable mongodb  # Auto-start on boot
```

**macOS:**
```bash
brew services start mongodb-community
```

**Windows:**
MongoDB should start automatically after installation. Check Services panel.

#### Verify MongoDB is Running

```bash
# Try connecting with mongo shell
mongosh  # or 'mongo' for older versions

# You should see:
# > MongoDB shell version...
# > connecting to: mongodb://127.0.0.1:27017
```

### 5. Start the Application

#### Development Mode (with auto-reload)

First, install nodemon globally:
```bash
npm install -g nodemon
```

Then run:
```bash
npm run dev
```

#### Production Mode

```bash
npm start
```

### 6. Verify Installation

The server should start successfully and display:

```
MongoDB Connected: localhost
Server running in development mode on port 5000
```

Test the API:

```bash
# Health check
curl http://localhost:5000/health

# Should return:
# {"success":true,"message":"SmartFX Hub API is running","timestamp":"..."}
```

## First Steps After Installation

### 1. Create an Admin User

Use an API client (Postman, Insomnia, or curl) to register an admin user:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@smartfx-hub.com",
    "password": "AdminPassword123!",
    "phoneNumber": "+1234567890",
    "country": "USA"
  }'
```

Save the returned JWT token!

### 2. Update User to Admin Role

Connect to MongoDB and update the user role:

```bash
mongosh smartfx-hub

# In MongoDB shell:
db.users.updateOne(
  { email: "admin@smartfx-hub.com" },
  { $set: { role: "admin" } }
)
```

### 3. Enable 2FA (Recommended)

```bash
curl -X POST http://localhost:5000/api/auth/2fa/enable \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Scan the QR code with Google Authenticator or Authy.

## Testing the API

### Register a User

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

### Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123!"
  }'
```

Save the token from the response.

### Get Wallet Information

```bash
curl http://localhost:5000/api/wallet \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## Troubleshooting

### MongoDB Connection Error

**Error:** `MongoNetworkError: connect ECONNREFUSED`

**Solution:**
- Ensure MongoDB is running: `sudo systemctl status mongodb`
- Check MongoDB URI in `.env` file
- Try connecting manually: `mongosh`

### Port Already in Use

**Error:** `Error: listen EADDRINUSE: address already in use :::5000`

**Solution:**
- Change PORT in `.env` to another port (e.g., 5001)
- Or kill the process using port 5000:
  ```bash
  # Find process
  lsof -i :5000
  # Kill it
  kill -9 <PID>
  ```

### JWT Token Invalid

**Error:** `"message": "Not authorized to access this route"`

**Solution:**
- Ensure token is included in Authorization header
- Check token hasn't expired (default: 7 days)
- Login again to get a fresh token

### Module Not Found

**Error:** `Cannot find module 'express'`

**Solution:**
- Delete `node_modules` and `package-lock.json`
- Run `npm install` again

## Development Tips

### Watch Logs

```bash
# In development mode, logs appear in terminal
npm run dev

# For production, you might want to use PM2:
npm install -g pm2
pm2 start backend/server.js --name smartfx-hub
pm2 logs smartfx-hub
```

### Database Management

```bash
# View all databases
mongosh
> show dbs

# Use SmartFX database
> use smartfx-hub

# View collections
> show collections

# View users
> db.users.find().pretty()

# Clear all data (DANGER!)
> db.dropDatabase()
```

### Testing API Endpoints

Use tools like:
- **Postman** - GUI tool with collections
- **Insomnia** - Lightweight REST client
- **curl** - Command line
- **Thunder Client** - VS Code extension

### Environment Modes

```bash
# Development (verbose logging)
NODE_ENV=development npm start

# Production (optimized)
NODE_ENV=production npm start
```

## Next Steps

1. **Read the API Documentation**: See [docs/API.md](API.md)
2. **Explore the Features**: Test all three trading modules
3. **Set Up Frontend**: Coming in Phase 2
4. **Configure Broker APIs**: For live trading (MT4/MT5)
5. **Deploy to Production**: See deployment guides

## Support

If you encounter issues:

1. Check the logs in terminal
2. Review [docs/README.md](README.md) for detailed info
3. Check MongoDB connection
4. Verify all dependencies are installed
5. Ensure `.env` file is properly configured

## Security Checklist

Before deploying to production:

- [ ] Change `JWT_SECRET` to a strong random value
- [ ] Set `NODE_ENV=production`
- [ ] Use production MongoDB instance
- [ ] Enable HTTPS
- [ ] Configure firewall rules
- [ ] Set up regular backups
- [ ] Enable monitoring and logging
- [ ] Review rate limiting settings
- [ ] Update CORS settings for your domain

---

You're now ready to use SmartFX Hub! 🚀
