/**
 * Stock Trading Plugin - Frontend JavaScript
 */

(function($) {
    'use strict';

    /**
     * Auto-refresh stock rates
     */
    function initAutoRefresh() {
        $('.stock-trading-rates').each(function() {
            var $container = $(this);
            var refreshInterval = parseInt($container.data('refresh')) * 1000 || 60000;
            var symbols = $container.data('symbols') || '';

            // Enforce minimum refresh interval of 30 seconds.
            refreshInterval = Math.max(30000, refreshInterval);

            if (refreshInterval && symbols) {
                setInterval(function() {
                    refreshRates($container, symbols);
                }, refreshInterval);
            }
        });
    }

    /**
     * Refresh rates via AJAX
     */
    function refreshRates($container, symbols) {
        if (typeof stockTradingData === 'undefined') {
            return;
        }

        $container.addClass('loading');

        $.ajax({
            url: stockTradingData.ajaxurl,
            type: 'POST',
            data: {
                action: 'get_forex_rates',
                nonce: stockTradingData.nonce,
                symbols: symbols
            },
            success: function(response) {
                if (response.success && response.data) {
                    updateRatesDisplay($container, response.data);
                }
            },
            error: function(xhr, status, error) {
                console.error('Stock Trading: Error refreshing rates', error);
            },
            complete: function() {
                $container.removeClass('loading');
            }
        });
    }

    /**
     * Update rates display
     */
    function updateRatesDisplay($container, rates) {
        $.each(rates, function(symbol, data) {
            var $row = $container.find('tr[data-symbol="' + symbol + '"]');
            
            if ($row.length) {
                // Update rate
                var $rate = $row.find('.rate');
                $rate.text(data.rate).addClass('rate-update');
                
                setTimeout(function() {
                    $rate.removeClass('rate-update');
                }, 500);

                // Update change
                var $change = $row.find('.change');
                var changeText = (data.change >= 0 ? '+' : '') + data.change + '%';
                var changeClass = data.change >= 0 ? 'positive' : 'negative';
                
                $change
                    .removeClass('positive negative')
                    .addClass(changeClass)
                    .text(changeText);

                // Update timestamp
                var $timestamp = $row.find('.timestamp');
                if ($timestamp.length) {
                    var now = new Date();
                    var timeString = now.getHours().toString().padStart(2, '0') + ':' +
                                   now.getMinutes().toString().padStart(2, '0') + ':' +
                                   now.getSeconds().toString().padStart(2, '0');
                    $timestamp.text(timeString);
                }
            }
        });
    }

    /**
     * Initialize ticker animation
     */
    function initTicker() {
        $('.stock-trading-ticker').each(function() {
            var $ticker = $(this);
            var $items = $ticker.find('.ticker-items');
            
            // Clone items for seamless loop
            var $clone = $items.clone();
            $ticker.find('.ticker-wrap').append($clone);

            // Adjust animation speed based on data attribute
            var speed = $ticker.data('speed') || 'normal';
            var duration = speed === 'fast' ? 20 : speed === 'slow' ? 40 : 30;
            
            $items.css('animation-duration', duration + 's');
            $clone.css('animation-duration', duration + 's');
        });
    }

    /**
     * Initialize on document ready
     */
    $(document).ready(function() {
        initAutoRefresh();
        initTicker();
    });

    /**
     * Re-initialize on AJAX complete (for dynamic content)
     */
    $(document).ajaxComplete(function() {
        initTicker();
    });

})(jQuery);
