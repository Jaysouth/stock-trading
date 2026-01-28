# Stock Trading WordPress Plugin

A comprehensive Forex Trading Business Web Application plugin for WordPress.

## Description

Stock Trading is a powerful WordPress plugin that brings forex and stock trading functionality to your website. Display live currency pair rates, stock quotes, and financial information with beautiful, responsive designs.

## Features

- ✅ **Live Forex Rates Display** - Show real-time currency pair rates
- ✅ **Customizable Widgets** - Add stock widgets to any widget area
- ✅ **Shortcode Support** - Easily embed trading data anywhere on your site
- ✅ **Auto-refresh Rates** - Configurable refresh intervals (30-3600 seconds)
- ✅ **Beautiful Ticker** - Scrolling ticker for forex rates
- ✅ **Admin Settings Page** - Full control over API and display settings
- ✅ **Multiple Display Modes** - Table, list, and card views
- ✅ **Responsive Design** - Works perfectly on all devices

## Installation

### Automatic Installation (Recommended)

1. Log in to your WordPress admin panel
2. Navigate to **Plugins → Add New**
3. Click **Upload Plugin** button
4. Click **Choose File** and select `stock-trading-1.0.0.zip`
5. Click **Install Now**
6. After installation, click **Activate Plugin**

### Manual Installation

1. Download the plugin ZIP file
2. Extract the ZIP file to get the `stock-trading` folder
3. Upload the `stock-trading` folder to `/wp-content/plugins/` directory via FTP
4. Log in to WordPress admin panel
5. Navigate to **Plugins**
6. Find **Stock Trading** and click **Activate**

### Building from Source

If you want to build the plugin ZIP from source:

```bash
# Clone the repository
git clone https://github.com/Jaysouth/stock-trading.git
cd stock-trading

# Run the build script
./build.sh

# The ZIP file will be created in the dist/ directory
```

## Configuration

After activating the plugin:

1. Go to **Stock Trading** in the WordPress admin menu
2. Configure your settings:
   - **API Key**: Enter your financial data API key (optional for demo)
   - **Update Interval**: Set how often rates refresh (30-3600 seconds)
   - **Default Currency**: Choose your base currency
   - **Display Mode**: Select table, list, or cards view

## Usage

### Using Shortcodes

#### Display Stock Rates Table

```php
[stock_rates symbols="EURUSD,GBPUSD,USDJPY" refresh="60"]
```

**Parameters:**
- `symbols` - Comma-separated list of currency pairs
- `refresh` - Refresh interval in seconds (default: 60)

#### Display Scrolling Ticker

```php
[forex_ticker symbols="EURUSD,GBPUSD,USDJPY" speed="normal"]
```

**Parameters:**
- `symbols` - Comma-separated list of currency pairs
- `speed` - Scroll speed: fast, normal, or slow (default: normal)

### Using Widgets

1. Go to **Appearance → Widgets**
2. Find **Stock Trading Widget**
3. Drag it to your desired widget area (e.g., Sidebar, Footer)
4. Configure:
   - **Title**: Widget title
   - **Currency Pairs**: Comma-separated pairs (e.g., EURUSD,GBPUSD)
5. Click **Save**

### Supported Currency Pairs

The plugin supports major forex pairs including:

- EUR/USD (Euro / US Dollar)
- GBP/USD (British Pound / US Dollar)
- USD/JPY (US Dollar / Japanese Yen)
- USD/CHF (US Dollar / Swiss Franc)
- AUD/USD (Australian Dollar / US Dollar)
- USD/CAD (US Dollar / Canadian Dollar)
- NZD/USD (New Zealand Dollar / US Dollar)
- EUR/GBP (Euro / British Pound)
- EUR/JPY (Euro / Japanese Yen)
- GBP/JPY (British Pound / Japanese Yen)

## Customization

### Custom CSS

Override the default styles by adding custom CSS to your theme:

```css
/* Customize table appearance */
.stock-rates-table {
    border: 2px solid #333;
}

.stock-rates-table thead {
    background: #your-color;
}

/* Customize ticker */
.stock-trading-ticker {
    background: #your-color;
}
```

### Hooks for Developers

#### Actions

```php
// Before rates display
add_action('stock_trading_before_rates_display', 'your_function');

// After rates display
add_action('stock_trading_after_rates_display', 'your_function');
```

#### Filters

```php
// Modify rate data
add_filter('stock_trading_rate_data', 'your_filter_function');

// Customize symbols
add_filter('stock_trading_symbols', 'your_filter_function');
```

## API Integration

For live data, the plugin supports integration with financial data APIs:

1. Get an API key from providers like:
   - Alpha Vantage
   - Finnhub
   - IEX Cloud
   - Others

2. Enter your API key in **Stock Trading → Settings**

3. The plugin will automatically fetch live data

**Note:** Without an API key, the plugin displays demo data for testing purposes.

## Requirements

- **WordPress Version**: 5.0 or higher
- **PHP Version**: 7.2 or higher
- **MySQL Version**: 5.6 or higher

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Troubleshooting

### Rates not updating?

1. Check that JavaScript is enabled in your browser
2. Verify refresh interval setting is not too high
3. Clear browser cache
4. Check browser console for errors

### Widget not displaying?

1. Ensure the plugin is activated
2. Check that you've added currency pairs in widget settings
3. Verify your theme supports widgets

### API not working?

1. Verify your API key is correct
2. Check API provider's rate limits
3. Ensure your server can make external API calls

## Support

For support and bug reports:
- GitHub Issues: https://github.com/Jaysouth/stock-trading/issues
- Documentation: https://github.com/Jaysouth/stock-trading

## License

This plugin is licensed under the GPL v2 or later.

```
Copyright (C) 2024 Jaysouth

This program is free software; you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation; either version 2 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU General Public License for more details.
```

## Credits

Developed by Jaysouth
GitHub: https://github.com/Jaysouth

## Changelog

### Version 1.0.0
- Initial release
- Core functionality for displaying forex rates
- Widget support
- Shortcode support
- Admin settings page
- Auto-refresh capability
- Responsive design
- Multiple display modes

## Roadmap

Future enhancements planned:
- [ ] More API integrations
- [ ] Chart/graph display
- [ ] Historical data
- [ ] Price alerts
- [ ] Multi-language support
- [ ] Custom color schemes
- [ ] Export functionality
