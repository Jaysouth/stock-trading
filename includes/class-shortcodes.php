<?php
/**
 * Shortcodes
 *
 * @package StockTrading
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Shortcodes Class
 */
class Stock_Trading_Shortcodes {

    /**
     * Constructor.
     */
    public function __construct() {
        add_shortcode( 'stock_rates', array( $this, 'stock_rates_shortcode' ) );
        add_shortcode( 'forex_ticker', array( $this, 'forex_ticker_shortcode' ) );
    }

    /**
     * Stock rates shortcode.
     *
     * @param array $atts Shortcode attributes.
     * @return string Shortcode output.
     */
    public function stock_rates_shortcode( $atts ) {
        $atts = shortcode_atts(
            array(
                'symbols' => 'EURUSD,GBPUSD,USDJPY',
                'refresh' => 60,
            ),
            $atts,
            'stock_rates'
        );

        $symbols = array_map( 'trim', explode( ',', $atts['symbols'] ) );
        $refresh = absint( $atts['refresh'] );

        ob_start();
        ?>
        <div class="stock-trading-rates" data-refresh="<?php echo esc_attr( $refresh ); ?>" data-symbols="<?php echo esc_attr( $atts['symbols'] ); ?>">
            <table class="stock-rates-table">
                <thead>
                    <tr>
                        <th><?php esc_html_e( 'Currency Pair', 'stock-trading' ); ?></th>
                        <th><?php esc_html_e( 'Rate', 'stock-trading' ); ?></th>
                        <th><?php esc_html_e( 'Change', 'stock-trading' ); ?></th>
                        <th><?php esc_html_e( 'Updated', 'stock-trading' ); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ( $symbols as $symbol ) : ?>
                        <?php
                        // Mock data for demonstration.
                        $rate = number_format( 1 + ( mt_rand( -1000, 1000 ) / 10000 ), 4 );
                        $change = number_format( mt_rand( -100, 100 ) / 100, 2 );
                        $change_class = $change >= 0 ? 'positive' : 'negative';
                        $change_sign = $change >= 0 ? '+' : '';
                        ?>
                        <tr data-symbol="<?php echo esc_attr( $symbol ); ?>">
                            <td class="symbol"><strong><?php echo esc_html( $symbol ); ?></strong></td>
                            <td class="rate"><?php echo esc_html( $rate ); ?></td>
                            <td class="change <?php echo esc_attr( $change_class ); ?>">
                                <?php echo esc_html( $change_sign . $change ); ?>%
                            </td>
                            <td class="timestamp"><?php echo esc_html( current_time( 'H:i:s' ) ); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Forex ticker shortcode.
     *
     * @param array $atts Shortcode attributes.
     * @return string Shortcode output.
     */
    public function forex_ticker_shortcode( $atts ) {
        $atts = shortcode_atts(
            array(
                'symbols' => 'EURUSD,GBPUSD,USDJPY',
                'speed'   => 'normal',
            ),
            $atts,
            'forex_ticker'
        );

        $symbols = array_map( 'trim', explode( ',', $atts['symbols'] ) );

        ob_start();
        ?>
        <div class="stock-trading-ticker" data-speed="<?php echo esc_attr( $atts['speed'] ); ?>">
            <div class="ticker-wrap">
                <div class="ticker-items">
                    <?php foreach ( $symbols as $symbol ) : ?>
                        <?php
                        // Mock data for demonstration.
                        $rate = number_format( 1 + ( mt_rand( -1000, 1000 ) / 10000 ), 4 );
                        $change = number_format( mt_rand( -100, 100 ) / 100, 2 );
                        $change_class = $change >= 0 ? 'positive' : 'negative';
                        $change_sign = $change >= 0 ? '+' : '';
                        ?>
                        <div class="ticker-item <?php echo esc_attr( $change_class ); ?>" data-symbol="<?php echo esc_attr( $symbol ); ?>">
                            <span class="ticker-symbol"><?php echo esc_html( $symbol ); ?></span>
                            <span class="ticker-rate"><?php echo esc_html( $rate ); ?></span>
                            <span class="ticker-change"><?php echo esc_html( $change_sign . $change ); ?>%</span>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}

// Initialize the class.
new Stock_Trading_Shortcodes();
