<?php
/**
 * Plugin Name: Stock Trading
 * Plugin URI: https://github.com/Jaysouth/stock-trading
 * Description: A comprehensive Forex Trading Business Web Application plugin for WordPress. Display stock quotes, forex rates, and trading information on your WordPress site.
 * Version: 1.0.0
 * Author: Jaysouth
 * Author URI: https://github.com/Jaysouth
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: stock-trading
 * Domain Path: /languages
 *
 * @package StockTrading
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Define plugin constants.
define( 'STOCK_TRADING_VERSION', '1.0.0' );
define( 'STOCK_TRADING_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
define( 'STOCK_TRADING_PLUGIN_URL', plugin_dir_url( __FILE__ ) );
define( 'STOCK_TRADING_PLUGIN_FILE', __FILE__ );

/**
 * Main Stock Trading Plugin Class
 */
class Stock_Trading_Plugin {
    
    /**
     * Instance of this class.
     *
     * @var object
     */
    protected static $instance = null;

    /**
     * Initialize the plugin.
     */
    private function __construct() {
        // Load plugin text domain.
        add_action( 'init', array( $this, 'load_plugin_textdomain' ) );
        
        // Register activation and deactivation hooks.
        register_activation_hook( __FILE__, array( $this, 'activate' ) );
        register_deactivation_hook( __FILE__, array( $this, 'deactivate' ) );
        
        // Initialize plugin components.
        $this->init_includes();
        $this->init_hooks();
    }

    /**
     * Return an instance of this class.
     *
     * @return object A single instance of this class.
     */
    public static function get_instance() {
        if ( null === self::$instance ) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Load the plugin text domain for translation.
     */
    public function load_plugin_textdomain() {
        load_plugin_textdomain(
            'stock-trading',
            false,
            dirname( plugin_basename( __FILE__ ) ) . '/languages/'
        );
    }

    /**
     * Include required files.
     */
    private function init_includes() {
        require_once STOCK_TRADING_PLUGIN_DIR . 'includes/class-stock-widget.php';
        require_once STOCK_TRADING_PLUGIN_DIR . 'includes/class-forex-rates.php';
        require_once STOCK_TRADING_PLUGIN_DIR . 'includes/class-admin-settings.php';
        require_once STOCK_TRADING_PLUGIN_DIR . 'includes/class-shortcodes.php';
    }

    /**
     * Initialize WordPress hooks.
     */
    private function init_hooks() {
        // Enqueue scripts and styles.
        add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_frontend_assets' ) );
        add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_admin_assets' ) );
        
        // Register widgets.
        add_action( 'widgets_init', array( $this, 'register_widgets' ) );
    }

    /**
     * Enqueue frontend scripts and styles.
     */
    public function enqueue_frontend_assets() {
        wp_enqueue_style(
            'stock-trading-frontend',
            STOCK_TRADING_PLUGIN_URL . 'assets/css/frontend.css',
            array(),
            STOCK_TRADING_VERSION
        );
        
        wp_enqueue_script(
            'stock-trading-frontend',
            STOCK_TRADING_PLUGIN_URL . 'assets/js/frontend.js',
            array( 'jquery' ),
            STOCK_TRADING_VERSION,
            true
        );
        
        wp_localize_script(
            'stock-trading-frontend',
            'stockTradingData',
            array(
                'ajaxurl' => admin_url( 'admin-ajax.php' ),
                'nonce'   => wp_create_nonce( 'stock_trading_nonce' ),
            )
        );
    }

    /**
     * Enqueue admin scripts and styles.
     */
    public function enqueue_admin_assets( $hook ) {
        if ( 'toplevel_page_stock-trading' !== $hook ) {
            return;
        }
        
        wp_enqueue_style(
            'stock-trading-admin',
            STOCK_TRADING_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            STOCK_TRADING_VERSION
        );
        
        wp_enqueue_script(
            'stock-trading-admin',
            STOCK_TRADING_PLUGIN_URL . 'assets/js/admin.js',
            array( 'jquery' ),
            STOCK_TRADING_VERSION,
            true
        );
    }

    /**
     * Register widgets.
     */
    public function register_widgets() {
        register_widget( 'Stock_Trading_Widget' );
    }

    /**
     * Plugin activation.
     */
    public function activate() {
        // Create default options.
        $default_options = array(
            'api_key'           => '',
            'update_interval'   => 60,
            'default_currency'  => 'USD',
            'display_mode'      => 'table',
        );
        
        add_option( 'stock_trading_options', $default_options );
        
        // Flush rewrite rules.
        flush_rewrite_rules();
    }

    /**
     * Plugin deactivation.
     */
    public function deactivate() {
        // Flush rewrite rules.
        flush_rewrite_rules();
    }
}

// Initialize the plugin.
add_action( 'plugins_loaded', array( 'Stock_Trading_Plugin', 'get_instance' ) );
