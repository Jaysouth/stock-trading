<?php
/**
 * Stock Trading Widget
 *
 * @package StockTrading
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

/**
 * Stock Trading Widget Class
 */
class Stock_Trading_Widget extends WP_Widget {

    /**
     * Constructor.
     */
    public function __construct() {
        parent::__construct(
            'stock_trading_widget',
            __( 'Stock Trading Widget', 'stock-trading' ),
            array(
                'description' => __( 'Display stock quotes and forex rates.', 'stock-trading' ),
            )
        );
    }

    /**
     * Front-end display of widget.
     *
     * @param array $args     Widget arguments.
     * @param array $instance Saved values from database.
     */
    public function widget( $args, $instance ) {
        echo $args['before_widget'];

        if ( ! empty( $instance['title'] ) ) {
            echo $args['before_title'] . esc_html( apply_filters( 'widget_title', $instance['title'] ) ) . $args['after_title'];
        }

        $symbols = ! empty( $instance['symbols'] ) ? $instance['symbols'] : 'EURUSD,GBPUSD,USDJPY';
        $symbols_array = array_map( 'trim', explode( ',', $symbols ) );

        echo '<div class="stock-trading-widget">';
        echo '<table class="stock-rates-table">';
        echo '<thead><tr><th>' . esc_html__( 'Pair', 'stock-trading' ) . '</th><th>' . esc_html__( 'Rate', 'stock-trading' ) . '</th><th>' . esc_html__( 'Change', 'stock-trading' ) . '</th></tr></thead>';
        echo '<tbody>';

        foreach ( $symbols_array as $symbol ) {
            // Mock data for demonstration - in production, this would fetch from an API.
            $rate = number_format( 1 + ( mt_rand( -1000, 1000 ) / 10000 ), 4 );
            $change = number_format( mt_rand( -100, 100 ) / 100, 2 );
            $change_class = $change >= 0 ? 'positive' : 'negative';
            $change_sign = $change >= 0 ? '+' : '';

            echo '<tr>';
            echo '<td class="symbol">' . esc_html( $symbol ) . '</td>';
            echo '<td class="rate">' . esc_html( $rate ) . '</td>';
            echo '<td class="change ' . esc_attr( $change_class ) . '">' . esc_html( $change_sign . $change ) . '%</td>';
            echo '</tr>';
        }

        echo '</tbody>';
        echo '</table>';
        echo '</div>';

        echo $args['after_widget'];
    }

    /**
     * Back-end widget form.
     *
     * @param array $instance Previously saved values from database.
     */
    public function form( $instance ) {
        $title = ! empty( $instance['title'] ) ? $instance['title'] : __( 'Forex Rates', 'stock-trading' );
        $symbols = ! empty( $instance['symbols'] ) ? $instance['symbols'] : 'EURUSD,GBPUSD,USDJPY';
        ?>
        <p>
            <label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>">
                <?php esc_html_e( 'Title:', 'stock-trading' ); ?>
            </label>
            <input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"
                   name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>" type="text"
                   value="<?php echo esc_attr( $title ); ?>">
        </p>
        <p>
            <label for="<?php echo esc_attr( $this->get_field_id( 'symbols' ) ); ?>">
                <?php esc_html_e( 'Currency Pairs (comma-separated):', 'stock-trading' ); ?>
            </label>
            <input class="widefat" id="<?php echo esc_attr( $this->get_field_id( 'symbols' ) ); ?>"
                   name="<?php echo esc_attr( $this->get_field_name( 'symbols' ) ); ?>" type="text"
                   value="<?php echo esc_attr( $symbols ); ?>">
        </p>
        <?php
    }

    /**
     * Sanitize widget form values as they are saved.
     *
     * @param array $new_instance Values just sent to be saved.
     * @param array $old_instance Previously saved values from database.
     *
     * @return array Updated safe values to be saved.
     */
    public function update( $new_instance, $old_instance ) {
        $instance = array();
        $instance['title'] = ! empty( $new_instance['title'] ) ? sanitize_text_field( $new_instance['title'] ) : '';
        $instance['symbols'] = ! empty( $new_instance['symbols'] ) ? sanitize_text_field( $new_instance['symbols'] ) : '';
        return $instance;
    }
}
