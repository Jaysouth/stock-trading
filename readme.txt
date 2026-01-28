=== Stock Trading ===
Contributors: jaysouth
Tags: stock, forex, trading, finance, currency, rates, ticker
Requires at least: 5.0
Tested up to: 6.4
Stable tag: 1.0.0
Requires PHP: 7.2
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

A comprehensive Forex Trading Business Web Application plugin for WordPress. Display stock quotes, forex rates, and trading information.

== Description ==

Stock Trading is a powerful WordPress plugin that brings forex and stock trading functionality to your website. Perfect for financial blogs, trading platforms, and investment websites.

= Features =

* **Live Forex Rates Display** - Show real-time currency pair rates
* **Customizable Widgets** - Add stock widgets to any widget area
* **Shortcode Support** - Easily embed trading data anywhere
* **Auto-refresh Rates** - Configurable refresh intervals
* **Beautiful Ticker** - Scrolling ticker for forex rates
* **Admin Settings** - Full control over API and display settings
* **Multiple Display Modes** - Table, list, and card views
* **Responsive Design** - Works perfectly on all devices

= Shortcodes =

Display stock rates table:
`[stock_rates symbols="EURUSD,GBPUSD,USDJPY" refresh="60"]`

Display scrolling ticker:
`[forex_ticker symbols="EURUSD,GBPUSD,USDJPY" speed="normal"]`

= Supported Currency Pairs =

* EUR/USD
* GBP/USD
* USD/JPY
* USD/CHF
* AUD/USD
* USD/CAD
* NZD/USD
* EUR/GBP
* EUR/JPY
* GBP/JPY
* And many more...

= Widget =

The plugin includes a widget that you can add to any widget area:
1. Go to Appearance > Widgets
2. Find "Stock Trading Widget"
3. Drag it to your desired widget area
4. Configure the title and currency pairs
5. Save and view on your site

= API Integration =

This plugin is designed to work with popular financial data APIs. Configure your API key in the settings page to fetch live data.

== Installation ==

1. Upload the `stock-trading` folder to the `/wp-content/plugins/` directory
2. Activate the plugin through the 'Plugins' menu in WordPress
3. Go to Settings > Stock Trading to configure the plugin
4. (Optional) Add your API key for live data
5. Use shortcodes or widgets to display stock information

== Frequently Asked Questions ==

= Do I need an API key? =

For demonstration purposes, the plugin works with mock data. For live data, you'll need to configure an API key from a supported financial data provider.

= Which APIs are supported? =

The plugin is designed to work with popular APIs like Alpha Vantage, Finnhub, and others. You can extend it to support additional providers.

= Can I customize the appearance? =

Yes! The plugin includes CSS classes that you can override in your theme to customize the appearance.

= How often do rates refresh? =

You can configure the refresh interval in the settings page. The minimum is 30 seconds, maximum is 3600 seconds (1 hour).

= Can I display multiple currency pairs? =

Yes! Just separate the currency pairs with commas in the shortcode or widget settings.

= Is it mobile responsive? =

Yes! The plugin is fully responsive and works great on mobile devices.

== Screenshots ==

1. Stock rates table display
2. Admin settings page
3. Widget configuration
4. Scrolling ticker display
5. Mobile responsive view

== Changelog ==

= 1.0.0 =
* Initial release
* Live forex rates display
* Customizable widgets
* Shortcode support
* Admin settings page
* Auto-refresh functionality
* Scrolling ticker
* Multiple display modes
* Responsive design

== Upgrade Notice ==

= 1.0.0 =
Initial release of Stock Trading plugin. Install to add forex and stock trading functionality to your WordPress site.

== Developer Notes ==

= Hooks and Filters =

The plugin provides several hooks for developers:

**Actions:**
* `stock_trading_before_rates_display` - Before rates table
* `stock_trading_after_rates_display` - After rates table
* `stock_trading_widget_display` - Custom widget display

**Filters:**
* `stock_trading_rate_data` - Modify rate data
* `stock_trading_symbols` - Modify available symbols
* `stock_trading_display_format` - Customize display format

= Extending the Plugin =

You can extend the plugin by creating custom modules in the `/includes/` directory or by using the provided hooks and filters.

== Support ==

For support, please visit: https://github.com/Jaysouth/stock-trading

== Privacy Policy ==

This plugin does not collect or store any personal data. If you configure an API key, that data is stored in your WordPress database and is only used to fetch stock data from your chosen provider.
