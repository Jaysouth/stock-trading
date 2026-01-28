/**
 * AI Trading Service
 * Simulates AI-based market analysis and trading signals
 * In production, this would integrate with real AI/ML models
 */

class AITradingService {
  /**
   * Calculate RSI (Relative Strength Index)
   * @param {Array} prices - Array of price data
   * @param {Number} period - RSI period (default 14)
   */
  calculateRSI(prices, period = 14) {
    if (prices.length < period + 1) {
      return null;
    }

    let gains = 0;
    let losses = 0;

    // Calculate initial average gain/loss
    for (let i = 1; i <= period; i++) {
      const change = prices[i] - prices[i - 1];
      if (change >= 0) {
        gains += change;
      } else {
        losses += Math.abs(change);
      }
    }

    let avgGain = gains / period;
    let avgLoss = losses / period;

    // Handle division by zero
    if (avgLoss === 0) {
      return avgGain === 0 ? 50 : 100; // If no losses and no gains = neutral, if gains but no losses = 100
    }

    // Calculate RSI
    const rs = avgGain / avgLoss;
    const rsi = 100 - (100 / (1 + rs));

    return rsi;
  }

  /**
   * Calculate MACD (Moving Average Convergence Divergence)
   * @param {Array} prices - Array of price data
   */
  calculateMACD(prices) {
    const ema12 = this.calculateEMA(prices, 12);
    const ema26 = this.calculateEMA(prices, 26);
    
    if (!ema12 || !ema26) {
      return null;
    }

    const macdLine = ema12 - ema26;
    
    return {
      macdLine,
      signal: macdLine > 0 ? 'bullish' : 'bearish',
      strength: Math.abs(macdLine)
    };
  }

  /**
   * Calculate EMA (Exponential Moving Average)
   * @param {Array} prices - Array of price data
   * @param {Number} period - EMA period
   */
  calculateEMA(prices, period) {
    if (prices.length < period) {
      return null;
    }

    const multiplier = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period;

    for (let i = period; i < prices.length; i++) {
      ema = (prices[i] - ema) * multiplier + ema;
    }

    return ema;
  }

  /**
   * Calculate Bollinger Bands
   * @param {Array} prices - Array of price data
   * @param {Number} period - Period (default 20)
   * @param {Number} stdDev - Standard deviation multiplier (default 2)
   */
  calculateBollingerBands(prices, period = 20, stdDev = 2) {
    if (prices.length < period) {
      return null;
    }

    const recentPrices = prices.slice(-period);
    const sma = recentPrices.reduce((sum, price) => sum + price, 0) / period;

    // Calculate standard deviation
    const squaredDiffs = recentPrices.map(price => Math.pow(price - sma, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / period;
    const standardDeviation = Math.sqrt(variance);

    const upperBand = sma + (stdDev * standardDeviation);
    const lowerBand = sma - (stdDev * standardDeviation);

    const currentPrice = prices[prices.length - 1];
    let signal = 'neutral';

    if (currentPrice >= upperBand) {
      signal = 'overbought';
    } else if (currentPrice <= lowerBand) {
      signal = 'oversold';
    }

    return {
      upper: upperBand,
      middle: sma,
      lower: lowerBand,
      signal
    };
  }

  /**
   * Analyze market and generate trading signal
   * @param {String} symbol - Trading pair (e.g., EUR/USD)
   * @param {Object} config - Trading configuration
   */
  async analyzeMarket(symbol, config) {
    // In production, fetch real market data from broker API
    // For demo, generate simulated price data
    const prices = this.generateSimulatedPrices(100);
    
    const indicators = {};

    // Calculate indicators based on config
    if (config.useRSI) {
      indicators.rsi = this.calculateRSI(prices);
    }

    if (config.useMACD) {
      indicators.macd = this.calculateMACD(prices);
    }

    if (config.useEMA) {
      indicators.ema = this.calculateEMA(prices, 20);
    }

    if (config.useBollingerBands) {
      indicators.bollingerBands = this.calculateBollingerBands(prices);
    }

    // Generate trading signal based on indicators
    const signal = this.generateTradingSignal(indicators, config);

    return {
      symbol,
      currentPrice: prices[prices.length - 1],
      signal,
      indicators,
      timestamp: new Date()
    };
  }

  /**
   * Generate trading signal based on indicators
   * @param {Object} indicators - Calculated indicators
   * @param {Object} config - Trading configuration
   */
  generateTradingSignal(indicators, config) {
    let bullishScore = 0;
    let bearishScore = 0;
    let confidence = 0;

    // RSI analysis
    if (indicators.rsi) {
      if (indicators.rsi < 30) {
        bullishScore += 2; // Oversold - buy signal
      } else if (indicators.rsi > 70) {
        bearishScore += 2; // Overbought - sell signal
      }
      confidence += 20;
    }

    // MACD analysis
    if (indicators.macd) {
      if (indicators.macd.signal === 'bullish') {
        bullishScore += indicators.macd.strength > 0.5 ? 2 : 1;
      } else {
        bearishScore += indicators.macd.strength > 0.5 ? 2 : 1;
      }
      confidence += 25;
    }

    // Bollinger Bands analysis
    if (indicators.bollingerBands) {
      if (indicators.bollingerBands.signal === 'oversold') {
        bullishScore += 1;
      } else if (indicators.bollingerBands.signal === 'overbought') {
        bearishScore += 1;
      }
      confidence += 20;
    }

    // Determine action
    let action = 'hold';
    let direction = null;

    const threshold = config.tradingMode === 'conservative' ? 4 : 
                     config.tradingMode === 'balanced' ? 3 : 2;

    if (bullishScore >= threshold && bullishScore > bearishScore) {
      action = 'buy';
      direction = 'buy';
      confidence += 35;
    } else if (bearishScore >= threshold && bearishScore > bullishScore) {
      action = 'sell';
      direction = 'sell';
      confidence += 35;
    }

    return {
      action,
      direction,
      confidence: Math.min(confidence, 95),
      bullishScore,
      bearishScore
    };
  }

  /**
   * Generate simulated price data
   * In production, this would fetch real data from broker API
   * @param {Number} count - Number of data points
   */
  generateSimulatedPrices(count) {
    const prices = [];
    let price = 1.1000 + Math.random() * 0.1; // Start around 1.1000

    for (let i = 0; i < count; i++) {
      // Random walk with slight trend
      const change = (Math.random() - 0.48) * 0.001;
      price += change;
      prices.push(price);
    }

    return prices;
  }

  /**
   * Calculate position size based on risk management
   * @param {Number} accountBalance - Trading account balance
   * @param {Number} riskPercentage - Risk percentage per trade
   * @param {Number} stopLossPips - Stop loss in pips
   */
  calculatePositionSize(accountBalance, riskPercentage, stopLossPips) {
    const riskAmount = accountBalance * (riskPercentage / 100);
    const pipValue = 10; // Standard lot pip value (simplified)
    const positionSize = riskAmount / (stopLossPips * pipValue);
    
    return Math.max(0.01, Math.min(positionSize, accountBalance / 1000));
  }

  /**
   * Check if trading should be paused due to losses
   * @param {Object} config - AI trading configuration
   * @param {Number} currentLoss - Current daily loss percentage
   */
  shouldPauseTradingDueToLoss(config, currentLoss) {
    if (!config.autoPauseEnabled || !config.pauseOnDailyLossReached) {
      return false;
    }

    return currentLoss >= config.maxDailyLoss;
  }
}

module.exports = new AITradingService();
