<?php
/**
 * Admin Settings
 *
 * @package StockTrading
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Admin Settings Class
 */
class Stock_Trading_Admin_Settings {

    /**
     * Constructor.
     */
    public function __construct() {
        add_action( 'admin_menu', array( $this, 'add_admin_menu' ) );
        add_action( 'admin_init', array( $this, 'register_settings' ) );
    }

    /**
     * Add admin menu.
     */
    public function add_admin_menu() {
        add_menu_page(
            __( 'Stock Trading', 'stock-trading' ),
            __( 'Stock Trading', 'stock-trading' ),
            'manage_options',
            'stock-trading',
            array( $this, 'render_settings_page' ),
            'dashicons-chart-line',
            30
        );
    }

    /**
     * Register settings.
     */
    public function register_settings() {
        register_setting(
            'stock_trading_options_group',
            'stock_trading_options',
            array( $this, 'sanitize_options' )
        );

        add_settings_section(
            'stock_trading_api_section',
            __( 'API Settings', 'stock-trading' ),
            array( $this, 'render_api_section' ),
            'stock-trading'
        );

        add_settings_field(
            'api_key',
            __( 'API Key', 'stock-trading' ),
            array( $this, 'render_api_key_field' ),
            'stock-trading',
            'stock_trading_api_section'
        );

        add_settings_field(
            'update_interval',
            __( 'Update Interval (seconds)', 'stock-trading' ),
            array( $this, 'render_update_interval_field' ),
            'stock-trading',
            'stock_trading_api_section'
        );

        add_settings_section(
            'stock_trading_display_section',
            __( 'Display Settings', 'stock-trading' ),
            array( $this, 'render_display_section' ),
            'stock-trading'
        );

        add_settings_field(
            'default_currency',
            __( 'Default Currency', 'stock-trading' ),
            array( $this, 'render_default_currency_field' ),
            'stock-trading',
            'stock_trading_display_section'
        );

        add_settings_field(
            'display_mode',
            __( 'Display Mode', 'stock-trading' ),
            array( $this, 'render_display_mode_field' ),
            'stock-trading',
            'stock_trading_display_section'
        );
    }

    /**
     * Sanitize options.
     *
     * @param array $input Input options.
     * @return array Sanitized options.
     */
    public function sanitize_options( $input ) {
        $sanitized = array();

        if ( isset( $input['api_key'] ) ) {
            $sanitized['api_key'] = sanitize_text_field( $input['api_key'] );
        }

        if ( isset( $input['update_interval'] ) ) {
            $interval = absint( $input['update_interval'] );
            // Enforce minimum 30 seconds, maximum 3600 seconds.
            $sanitized['update_interval'] = max( 30, min( 3600, $interval ) );
        }

        if ( isset( $input['default_currency'] ) ) {
            $currency = sanitize_text_field( $input['default_currency'] );
            $allowed_currencies = array( 'USD', 'EUR', 'GBP', 'JPY' );
            $sanitized['default_currency'] = in_array( $currency, $allowed_currencies, true ) ? $currency : 'USD';
        }

        if ( isset( $input['display_mode'] ) ) {
            $mode = sanitize_text_field( $input['display_mode'] );
            $allowed_modes = array( 'table', 'list', 'cards' );
            $sanitized['display_mode'] = in_array( $mode, $allowed_modes, true ) ? $mode : 'table';
        }

        return $sanitized;
    }

    /**
     * Render settings page.
     */
    public function render_settings_page() {
        if ( ! current_user_can( 'manage_options' ) ) {
            return;
        }
        ?>
        <div class="wrap">
            <h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
            <form action="options.php" method="post">
                <?php
                settings_fields( 'stock_trading_options_group' );
                do_settings_sections( 'stock-trading' );
                submit_button();
                ?>
            </form>
            <div class="stock-trading-info">
                <h2><?php esc_html_e( 'Usage Instructions', 'stock-trading' ); ?></h2>
                <p><?php esc_html_e( 'Use the following shortcode to display stock rates:', 'stock-trading' ); ?></p>
                <code>[stock_rates symbols="EURUSD,GBPUSD,USDJPY"]</code>
                <p><?php esc_html_e( 'You can also use the Stock Trading widget in the Appearance > Widgets section.', 'stock-trading' ); ?></p>
            </div>
        </div>
        <?php
    }

    /**
     * Render API section.
     */
    public function render_api_section() {
        echo '<p>' . esc_html__( 'Configure API settings for fetching stock and forex data.', 'stock-trading' ) . '</p>';
    }

    /**
     * Render display section.
     */
    public function render_display_section() {
        echo '<p>' . esc_html__( 'Configure display settings for stock and forex rates.', 'stock-trading' ) . '</p>';
    }

    /**
     * Render API key field.
     */
    public function render_api_key_field() {
        $options = get_option( 'stock_trading_options' );
        $value = isset( $options['api_key'] ) ? $options['api_key'] : '';
        ?>
        <input type="text" name="stock_trading_options[api_key]" value="<?php echo esc_attr( $value ); ?>" class="regular-text">
        <p class="description"><?php esc_html_e( 'Enter your API key from your stock data provider.', 'stock-trading' ); ?></p>
        <?php
    }

    /**
     * Render update interval field.
     */
    public function render_update_interval_field() {
        $options = get_option( 'stock_trading_options' );
        $value = isset( $options['update_interval'] ) ? $options['update_interval'] : 60;
        ?>
        <input type="number" name="stock_trading_options[update_interval]" value="<?php echo esc_attr( $value ); ?>" min="30" max="3600">
        <p class="description"><?php esc_html_e( 'How often to update rates (in seconds). Minimum: 30, Maximum: 3600.', 'stock-trading' ); ?></p>
        <?php
    }

    /**
     * Render default currency field.
     */
    public function render_default_currency_field() {
        $options = get_option( 'stock_trading_options' );
        $value = isset( $options['default_currency'] ) ? $options['default_currency'] : 'USD';
        ?>
        <select name="stock_trading_options[default_currency]">
            <option value="USD" <?php selected( $value, 'USD' ); ?>>USD</option>
            <option value="EUR" <?php selected( $value, 'EUR' ); ?>>EUR</option>
            <option value="GBP" <?php selected( $value, 'GBP' ); ?>>GBP</option>
            <option value="JPY" <?php selected( $value, 'JPY' ); ?>>JPY</option>
        </select>
        <?php
    }

    /**
     * Render display mode field.
     */
    public function render_display_mode_field() {
        $options = get_option( 'stock_trading_options' );
        $value = isset( $options['display_mode'] ) ? $options['display_mode'] : 'table';
        ?>
        <select name="stock_trading_options[display_mode]">
            <option value="table" <?php selected( $value, 'table' ); ?>><?php esc_html_e( 'Table', 'stock-trading' ); ?></option>
            <option value="list" <?php selected( $value, 'list' ); ?>><?php esc_html_e( 'List', 'stock-trading' ); ?></option>
            <option value="cards" <?php selected( $value, 'cards' ); ?>><?php esc_html_e( 'Cards', 'stock-trading' ); ?></option>
        </select>
        <?php
    }
}

// Initialize the class.
new Stock_Trading_Admin_Settings();
