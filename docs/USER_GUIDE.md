# SmartFX Hub - User Guide

## Getting Started

Welcome to SmartFX Hub! This guide will help you get started with our multi-module forex trading platform.

## Table of Contents

1. [Account Setup](#account-setup)
2. [Dashboard Overview](#dashboard-overview)
3. [AI Trading Module](#ai-trading-module)
4. [Group Trading Module](#group-trading-module)
5. [Self Trading Module](#self-trading-module)
6. [Risk Management](#risk-management)
7. [FAQ](#faq)

## Account Setup

### Registration

1. Navigate to the registration page
2. Provide the following information:
   - Email address
   - Username
   - Password (minimum 8 characters)
   - First and last name
   - Trading experience level (beginner, intermediate, professional)
3. Verify your email address
4. Complete KYC verification (required for regulatory compliance)

### Connecting a Broker

Before you can start trading, you need to connect a regulated forex broker:

1. Go to Dashboard → Broker Connections
2. Click "Connect New Broker"
3. Select your broker from the list of supported brokers
4. Enter your broker API credentials
5. Verify the connection

**Supported Brokers:**
- IC Markets (ASIC, CySEC, FSA regulated)
- Pepperstone (FCA, ASIC, DFSA regulated)
- OANDA (FCA, ASIC, NFA regulated)
- IG Group (FCA regulated)

## Dashboard Overview

The unified dashboard provides a comprehensive view of all your trading activities:

### Key Sections

**Account Summary**
- Total balance across all modules
- Net profit/loss
- Active positions and trades
- Recent activity feed

**Module Status**
- AI Trading: Status, active trades, performance
- Group Trading: Active groups, contributions, profits
- Self Trading: Open positions, portfolio value

**Market Overview**
- Top movers
- Market sentiment indicators
- Upcoming economic events
- Trading volume

**Notifications**
- Trade alerts
- Group updates
- System messages
- Market news

## AI Trading Module

### What is AI Trading?

AI Trading uses advanced algorithms and machine learning to automatically execute trades based on market analysis and predefined strategies.

### Best For
- Beginners who want automated trading
- Traders who don't have time for constant monitoring
- Those who want to leverage algorithmic strategies

### Getting Started

1. Navigate to AI Trading section
2. Choose a trading strategy:
   - **Momentum Strategy**: Follows price trends
   - **Mean Reversion**: Trades based on price returns to average
   - **Trend Following**: Identifies and follows market trends
   - **Arbitrage**: Exploits price differences

3. Configure your settings:
   - **Risk Level**: Low, Medium, or High
   - **Max Trade Size**: Maximum amount per trade
   - **Stop Loss**: Percentage to limit losses
   - **Take Profit**: Target profit percentage

4. Review and activate

### AI Configuration Example

```json
{
  "algorithm": "momentum_strategy",
  "riskLevel": "medium",
  "maxTradeSize": 5000,
  "stopLoss": 2.0,
  "takeProfit": 4.0,
  "enabled": true
}
```

### Monitoring AI Performance

Track your AI trading performance:
- **Win Rate**: Percentage of profitable trades
- **Total Profit/Loss**: Overall performance
- **Sharpe Ratio**: Risk-adjusted returns
- **Max Drawdown**: Largest peak-to-trough decline

### AI Recommendations

The AI provides trade recommendations with:
- Currency pair
- Buy/Sell action
- Confidence score (0-1)
- Entry price
- Stop loss and take profit levels
- Reasoning behind the recommendation

## Group Trading Module

### What is Group Trading?

Group Trading allows you to pool resources with other traders, make collective decisions, and share profits proportionally.

### Best For
- Traders who want to learn from others
- Those who want to trade with pooled capital
- Social traders who prefer collaborative approaches

### Creating a Trading Group

1. Go to Group Trading → Create New Group
2. Set parameters:
   - **Group Name**: Descriptive name
   - **Minimum Contribution**: Entry amount
   - **Maximum Members**: Group size limit
   - **Strategy**: Conservative, Moderate, or Aggressive

3. Wait for members to join

### Joining a Trading Group

1. Browse available groups
2. Review group details:
   - Strategy
   - Current members
   - Performance history
   - Minimum contribution
3. Contribute funds to join
4. Participate in voting

### Group Decision Making

Trading decisions in groups are made democratically:

1. A member proposes a trade
2. All members are notified
3. Voting period (usually 24 hours)
4. If majority approves, trade executes
5. Profits/losses distributed proportionally

### Profit Distribution

Profits and losses are distributed based on:
- Your contribution percentage
- Time in the group
- Group performance

**Example:**
- Group pool: $15,000
- Your contribution: $5,000 (33.33%)
- Group profit: $900
- Your share: $300 (33.33% of $900)

## Self Trading Module

### What is Self Trading?

Self Trading gives you complete control over your trading decisions with advanced tools and analytics.

### Best For
- Experienced traders
- Those who want full control
- Traders with proven strategies

### Opening a Position

1. Navigate to Self Trading → Open Position
2. Select currency pair (e.g., EUR/USD)
3. Choose Buy or Sell
4. Enter amount
5. Set optional parameters:
   - Stop Loss: Limit your losses
   - Take Profit: Lock in profits
   - Leverage: Amplify your position (use cautiously)
6. Confirm and execute

### Position Management

**Monitoring Open Positions**
- Real-time P&L updates
- Current price vs. entry price
- Time in trade
- Profit/loss percentage

**Modifying Positions**
- Adjust stop loss
- Adjust take profit
- Add to position (scaling in)
- Partial close

**Closing Positions**
- Close all or partial amount
- Review final P&L
- Transaction recorded in history

### Trading Analytics

Access comprehensive analytics:
- **Win Rate**: Successful vs. failed trades
- **Average Profit/Loss**: Per trade statistics
- **Profit Factor**: Gross profit / Gross loss
- **Best/Worst Trade**: Peak performance
- **Average Holding Time**: Trade duration
- **Most Traded Pairs**: Your preferences
- **Profitable Hours**: Best trading times

### Position Size Calculator

Use the built-in calculator to determine optimal position size:

**Input:**
- Account balance: $10,000
- Risk percentage: 2%
- Stop loss: 50 pips

**Output:**
- Risk amount: $200
- Recommended position size: 4,000 units
- Potential loss: $200

## Risk Management

### Key Principles

1. **Never Risk More Than 2% Per Trade**
   - Protects your capital
   - Allows recovery from losses

2. **Use Stop Losses**
   - Every trade should have a stop loss
   - Never move stop loss to increase risk

3. **Diversify**
   - Don't put all capital in one module
   - Trade different currency pairs

4. **Position Sizing**
   - Use the position calculator
   - Account for volatility

5. **Know Your Leverage**
   - Higher leverage = higher risk
   - Recommended: 1:20 to 1:50 for beginners

### Risk Management by Module

**AI Trading**
- Set conservative risk levels initially
- Monitor performance regularly
- Adjust settings based on results

**Group Trading**
- Diversify across multiple groups
- Review group strategy alignment
- Start with smaller contributions

**Self Trading**
- Strictly follow your trading plan
- Use stop losses on every trade
- Keep a trading journal

## Trading Hours

Forex markets operate 24/5:
- **Sydney**: 10 PM - 7 AM UTC
- **Tokyo**: 12 AM - 9 AM UTC
- **London**: 8 AM - 5 PM UTC
- **New York**: 1 PM - 10 PM UTC

**Most Active Times:**
- London/New York overlap: 1 PM - 5 PM UTC
- Highest liquidity and volatility

## Currency Pairs Guide

### Major Pairs (Lowest spreads, highest liquidity)
- EUR/USD: Euro vs. US Dollar
- GBP/USD: British Pound vs. US Dollar
- USD/JPY: US Dollar vs. Japanese Yen
- USD/CHF: US Dollar vs. Swiss Franc

### Minor Pairs
- EUR/GBP: Euro vs. British Pound
- EUR/JPY: Euro vs. Japanese Yen
- GBP/JPY: British Pound vs. Japanese Yen

### Exotic Pairs (Higher spreads, lower liquidity)
- USD/ZAR: US Dollar vs. South African Rand
- EUR/TRY: Euro vs. Turkish Lira

## FAQ

### General Questions

**Q: Is forex trading risky?**
A: Yes, forex trading carries significant risk. Never invest money you cannot afford to lose. Always use risk management tools.

**Q: How much money do I need to start?**
A: Minimum amounts vary by module:
- AI Trading: $500 minimum
- Group Trading: Depends on group (typically $1,000+)
- Self Trading: $500 minimum

**Q: Are profits guaranteed?**
A: No. Trading involves risk, and losses are possible. Past performance does not guarantee future results.

**Q: How do I withdraw my funds?**
A: Navigate to Settings → Withdraw. Funds are typically processed within 1-3 business days.

### AI Trading Questions

**Q: Can I customize the AI algorithm?**
A: You can configure risk parameters and strategy selection, but the core algorithm is pre-built.

**Q: How often does the AI trade?**
A: Frequency depends on market conditions and your settings. Typically 2-10 trades per week.

**Q: Can I stop the AI anytime?**
A: Yes, you can pause/stop AI trading at any time. Open positions will be maintained.

### Group Trading Questions

**Q: What happens if the group loses money?**
A: Losses are shared proportionally based on contribution percentage.

**Q: Can I leave a group anytime?**
A: Yes, but there may be a notice period (typically 7 days) to avoid disrupting active trades.

**Q: How are group leaders chosen?**
A: The group creator is the initial leader. Some groups vote on leadership changes.

### Self Trading Questions

**Q: What leverage should I use?**
A: Beginners: 1:20, Intermediate: 1:50, Advanced: 1:100. Higher leverage = higher risk.

**Q: Can I automate self trading?**
A: Self trading is manual, but you can use the AI module for automation.

**Q: Are there trading fees?**
A: Fees depend on your broker. Typical spreads range from 0.1 to 2 pips.

## Support

Need help?
- Email: support@smartfxhub.com
- Live Chat: Available 24/5
- Community Forum: forum.smartfxhub.com
- Knowledge Base: help.smartfxhub.com

---

**Disclaimer**: Trading forex involves substantial risk of loss. SmartFX Hub is a technology platform and does not provide investment advice. Always trade responsibly and within your means.
