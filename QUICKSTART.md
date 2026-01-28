# Quick Start Guide - Stock Trading WordPress Plugin

## 🚀 Quick Installation (3 Steps)

### Step 1: Get the Plugin ZIP
The plugin ZIP file is located at: `dist/stock-trading-1.0.0.zip`

### Step 2: Install in WordPress
1. Log in to your WordPress admin panel (e.g., `yoursite.com/wp-admin`)
2. Go to **Plugins** → **Add New** → **Upload Plugin**
3. Click **Choose File** and select `stock-trading-1.0.0.zip`
4. Click **Install Now**
5. Click **Activate Plugin**

### Step 3: Start Using
You're ready! The plugin is now active on your WordPress site.

---

## 📋 Quick Usage Examples

### Display Forex Rates with Shortcode
Add this to any page or post:
```
[stock_rates symbols="EURUSD,GBPUSD,USDJPY"]
```

### Add a Widget
1. Go to **Appearance** → **Widgets**
2. Find **Stock Trading Widget**
3. Drag it to your sidebar or footer
4. Configure and save

### Add a Ticker
Add this to display a scrolling ticker:
```
[forex_ticker symbols="EURUSD,GBPUSD,USDJPY"]
```

---

## ⚙️ Optional Configuration

Go to **Stock Trading** in the WordPress admin menu to:
- Set your API key (for live data)
- Configure refresh interval
- Choose default currency
- Select display mode

---

## 🔨 Building from Source

If you need to rebuild the ZIP file:

```bash
# Navigate to plugin directory
cd /path/to/stock-trading

# Run build script
./build.sh

# ZIP file will be created in dist/ directory
```

---

## 📊 Supported Currency Pairs

Common pairs included:
- **EURUSD** - Euro / US Dollar
- **GBPUSD** - British Pound / US Dollar  
- **USDJPY** - US Dollar / Japanese Yen
- **USDCHF** - US Dollar / Swiss Franc
- **AUDUSD** - Australian Dollar / US Dollar
- **USDCAD** - US Dollar / Canadian Dollar
- Plus many more...

---

## 🎨 Customization

The plugin includes clean CSS classes you can override:
- `.stock-trading-widget` - Widget container
- `.stock-rates-table` - Rates table
- `.stock-trading-ticker` - Ticker container

Add custom CSS in **Appearance** → **Customize** → **Additional CSS**

---

## 🆘 Need Help?

- **Full Documentation**: See [INSTALL.md](INSTALL.md)
- **Issues**: https://github.com/Jaysouth/stock-trading/issues
- **README**: See [readme.txt](readme.txt) for WordPress plugin details

---

## ✅ Requirements

- WordPress 5.0+
- PHP 7.2+
- Any modern web browser

---

**That's it! You now have a fully functional forex trading plugin on your WordPress site.** 🎉
