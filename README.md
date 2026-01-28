# Stock Trading - WordPress Plugin

A comprehensive Forex Trading Business Web Application plugin for WordPress.

## 📦 Plugin ZIP Ready to Use

The WordPress plugin ZIP file is available in the `dist/` directory:
- **File**: `dist/stock-trading-1.0.0.zip`
- **Size**: ~15KB
- **Version**: 1.0.0

## 🚀 Quick Start

1. **Download** the plugin ZIP from `dist/stock-trading-1.0.0.zip`
2. **Install** in WordPress: Plugins → Add New → Upload Plugin
3. **Activate** the plugin
4. **Use** shortcodes or widgets to display forex rates

See [QUICKSTART.md](QUICKSTART.md) for detailed instructions.

## ✨ Features

- 📊 **Live Forex Rates** - Display real-time currency pair rates
- 🎨 **Customizable Widgets** - Add to any widget area
- 📝 **Shortcode Support** - `[stock_rates]` and `[forex_ticker]`
- 🔄 **Auto-refresh** - Configurable update intervals
- 📱 **Responsive Design** - Works on all devices
- ⚙️ **Admin Settings** - Full configuration control
- 🌐 **API Integration** - Connect to live data sources

## 📖 Documentation

- **Quick Start**: [QUICKSTART.md](QUICKSTART.md) - Get started in 3 steps
- **Full Installation Guide**: [INSTALL.md](INSTALL.md) - Complete documentation
- **WordPress Plugin Info**: [readme.txt](readme.txt) - Plugin repository format

## 🛠️ Building from Source

To rebuild the plugin ZIP:

```bash
# Run the build script
./build.sh

# Output: dist/stock-trading-1.0.0.zip
```

## 📋 Requirements

- WordPress 5.0 or higher
- PHP 7.2 or higher
- Modern web browser with JavaScript enabled

## 💡 Usage Examples

### Shortcode - Display Rates Table
```php
[stock_rates symbols="EURUSD,GBPUSD,USDJPY" refresh="60"]
```

### Shortcode - Scrolling Ticker
```php
[forex_ticker symbols="EURUSD,GBPUSD,USDJPY" speed="normal"]
```

### Widget
Go to **Appearance → Widgets** and add the **Stock Trading Widget** to your sidebar.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## 📄 License

GPL v2 or later - See plugin headers for full license information.

## 👤 Author

Developed by Jaysouth
- GitHub: [@Jaysouth](https://github.com/Jaysouth)

---

**Ready to add forex trading functionality to your WordPress site? Download the plugin ZIP from the `dist/` directory!** 🎉
