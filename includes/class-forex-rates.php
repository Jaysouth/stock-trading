<?php
/**
 * Forex Rates Handler
 *
 * @package StockTrading
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Forex Rates Class
 */
class Stock_Trading_Forex_Rates {

    /**
     * Constructor.
     */
    public function __construct() {
        add_action( 'wp_ajax_get_forex_rates', array( $this, 'ajax_get_forex_rates' ) );
        add_action( 'wp_ajax_nopriv_get_forex_rates', array( $this, 'ajax_get_forex_rates' ) );
    }

    /**
     * AJAX handler for getting forex rates.
     */
    public function ajax_get_forex_rates() {
        check_ajax_referer( 'stock_trading_nonce', 'nonce' );

        $symbols = isset( $_POST['symbols'] ) ? sanitize_text_field( $_POST['symbols'] ) : 'EURUSD,GBPUSD,USDJPY';
        $symbols_array = array_map( 'trim', explode( ',', $symbols ) );

        $rates = $this->get_rates( $symbols_array );

        wp_send_json_success( $rates );
    }

    /**
     * Get forex rates for specified symbols.
     *
     * @param array $symbols Array of currency pair symbols.
     * @return array Array of rates.
     */
    public function get_rates( $symbols ) {
        $rates = array();

        foreach ( $symbols as $symbol ) {
            // Check cache first.
            $cache_key = 'stock_trading_rate_' . sanitize_key( $symbol );
            $cached_rate = get_transient( $cache_key );

            if ( false !== $cached_rate ) {
                $rates[ $symbol ] = $cached_rate;
                continue;
            }

            // Fetch rate - this is mock data for demonstration.
            // In production, integrate with a real API like Alpha Vantage, Finnhub, etc.
            $rate_data = $this->fetch_rate( $symbol );

            // Cache for 1 minute.
            set_transient( $cache_key, $rate_data, 60 );

            $rates[ $symbol ] = $rate_data;
        }

        return $rates;
    }

    /**
     * Fetch rate for a single symbol.
     *
     * @param string $symbol Currency pair symbol.
     * @return array Rate data.
     */
    private function fetch_rate( $symbol ) {
        // Mock data for demonstration.
        // Replace with actual API call in production.
        return array(
            'symbol'    => $symbol,
            'rate'      => number_format( 1 + ( mt_rand( -1000, 1000 ) / 10000 ), 4 ),
            'change'    => number_format( mt_rand( -100, 100 ) / 100, 2 ),
            'timestamp' => current_time( 'mysql' ),
        );
    }

    /**
     * Get available currency pairs.
     *
     * @return array Array of currency pairs.
     */
    public static function get_available_pairs() {
        return array(
            'EURUSD' => 'EUR/USD',
            'GBPUSD' => 'GBP/USD',
            'USDJPY' => 'USD/JPY',
            'USDCHF' => 'USD/CHF',
            'AUDUSD' => 'AUD/USD',
            'USDCAD' => 'USD/CAD',
            'NZDUSD' => 'NZD/USD',
            'EURGBP' => 'EUR/GBP',
            'EURJPY' => 'EUR/JPY',
            'GBPJPY' => 'GBP/JPY',
        );
    }
}

// Initialize the class.
new Stock_Trading_Forex_Rates();
