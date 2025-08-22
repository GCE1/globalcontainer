<?php
/**
 * Shortcodes for the Container Leasing plugin.
 *
 * @link       https://example.com
 * @since      1.0.0
 *
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes
 */

/**
 * Shortcodes for the Container Leasing plugin.
 *
 * This class defines all the shortcodes used to display container leasing functionality on the front end.
 *
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes
 */
class Container_Leasing_Shortcodes {

    /**
     * Register shortcodes.
     *
     * @since    1.0.0
     */
    public function register_shortcodes() {
        add_shortcode('container_dashboard', array($this, 'container_dashboard_shortcode'));
        add_shortcode('container_insights', array($this, 'container_insights_shortcode'));
        add_shortcode('container_management', array($this, 'container_management_shortcode'));
        add_shortcode('container_invoices', array($this, 'container_invoices_shortcode'));
        add_shortcode('email_management', array($this, 'email_management_shortcode'));
        add_shortcode('container_listing', array($this, 'container_listing_shortcode'));
        add_shortcode('container_checkout', array($this, 'container_checkout_shortcode'));
        add_shortcode('container_contracts', array($this, 'container_contracts_shortcode'));
    }
    
    /**
     * Shortcode for container dashboard.
     *
     * @since    1.0.0
     * @param    array     $atts    Shortcode attributes.
     * @return   string             Shortcode output.
     */
    public function container_dashboard_shortcode($atts) {
        // Check if user is logged in
        if (!is_user_logged_in()) {
            return $this->login_required_message();
        }
        
        // Buffer output
        ob_start();
        
        // Include dashboard template
        include_once(CONTAINER_LEASING_PLUGIN_DIR . 'public/partials/dashboard-template.php');
        
        return ob_get_clean();
    }
    
    /**
     * Shortcode for container insights.
     *
     * @since    1.0.0
     * @param    array     $atts    Shortcode attributes.
     * @return   string             Shortcode output.
     */
    public function container_insights_shortcode($atts) {
        // Check if user is logged in
        if (!is_user_logged_in()) {
            return $this->login_required_message();
        }
        
        // Buffer output
        ob_start();
        
        // Include insights template
        include_once(CONTAINER_LEASING_PLUGIN_DIR . 'public/partials/insights-page-template.php');
        
        return ob_get_clean();
    }
    
    /**
     * Shortcode for container management.
     *
     * @since    1.0.0
     * @param    array     $atts    Shortcode attributes.
     * @return   string             Shortcode output.
     */
    public function container_management_shortcode($atts) {
        // Check if user is logged in
        if (!is_user_logged_in()) {
            return $this->login_required_message();
        }
        
        // Buffer output
        ob_start();
        
        // Include container management template
        include_once(CONTAINER_LEASING_PLUGIN_DIR . 'public/partials/container-management-template.php');
        
        return ob_get_clean();
    }
    
    /**
     * Shortcode for container invoices.
     *
     * @since    1.0.0
     * @param    array     $atts    Shortcode attributes.
     * @return   string             Shortcode output.
     */
    public function container_invoices_shortcode($atts) {
        // Check if user is logged in
        if (!is_user_logged_in()) {
            return $this->login_required_message();
        }
        
        // Buffer output
        ob_start();
        
        // Include invoice template
        include_once(CONTAINER_LEASING_PLUGIN_DIR . 'public/partials/invoice-template.php');
        
        return ob_get_clean();
    }
    
    /**
     * Shortcode for email management.
     *
     * @since    1.0.0
     * @param    array     $atts    Shortcode attributes.
     * @return   string             Shortcode output.
     */
    public function email_management_shortcode($atts) {
        // Check if user is logged in
        if (!is_user_logged_in()) {
            return $this->login_required_message();
        }
        
        // Buffer output
        ob_start();
        
        // Include email management template
        include_once(CONTAINER_LEASING_PLUGIN_DIR . 'public/partials/email-management-template.php');
        
        return ob_get_clean();
    }
    
    /**
     * Shortcode for container listing.
     *
     * @since    1.0.0
     * @param    array     $atts    Shortcode attributes.
     * @return   string             Shortcode output.
     */
    public function container_listing_shortcode($atts) {
        // Parse shortcode attributes
        $atts = shortcode_atts(
            array(
                'limit' => 10,
                'type' => '',
                'size' => '',
                'status' => 'available',
            ),
            $atts,
            'container_listing'
        );
        
        // Buffer output
        ob_start();
        
        // Build query args
        $args = array(
            'post_type' => 'container',
            'posts_per_page' => intval($atts['limit']),
            'meta_query' => array(),
        );
        
        // Add type filter if specified
        if (!empty($atts['type'])) {
            $args['meta_query'][] = array(
                'key' => '_container_type',
                'value' => $atts['type'],
                'compare' => '=',
            );
        }
        
        // Add size filter if specified
        if (!empty($atts['size'])) {
            $args['meta_query'][] = array(
                'key' => '_container_size',
                'value' => $atts['size'],
                'compare' => '=',
            );
        }
        
        // Add status filter
        $args['meta_query'][] = array(
            'key' => '_container_status',
            'value' => $atts['status'],
            'compare' => '=',
        );
        
        // Run the query
        $containers = new WP_Query($args);
        
        // Display container list
        if ($containers->have_posts()) :
            ?>
            <div class="container-leasing-container-list">
                <div class="container-leasing-grid">
                    <?php
                    while ($containers->have_posts()) : $containers->the_post();
                        $container_id = get_the_ID();
                        $container_type = get_post_meta($container_id, '_container_type', true);
                        $container_size = get_post_meta($container_id, '_container_size', true);
                        $container_origin = get_post_meta($container_id, '_container_origin', true);
                        $container_destination = get_post_meta($container_id, '_container_destination', true);
                        $container_price = get_post_meta($container_id, '_container_price', true);
                        $product_id = get_post_meta($container_id, '_container_product_id', true);
                        ?>
                        <div class="container-leasing-item">
                            <h3><?php the_title(); ?></h3>
                            <div class="container-leasing-item-details">
                                <div class="container-leasing-item-spec">
                                    <span><?php _e('Type:', 'container-leasing'); ?></span> <?php echo esc_html($container_type); ?>
                                </div>
                                <div class="container-leasing-item-spec">
                                    <span><?php _e('Size:', 'container-leasing'); ?></span> <?php echo esc_html($container_size); ?>
                                </div>
                                <?php if (!empty($container_origin)) : ?>
                                    <div class="container-leasing-item-spec">
                                        <span><?php _e('Origin:', 'container-leasing'); ?></span> <?php echo esc_html($container_origin); ?>
                                    </div>
                                <?php endif; ?>
                                <?php if (!empty($container_destination)) : ?>
                                    <div class="container-leasing-item-spec">
                                        <span><?php _e('Destination:', 'container-leasing'); ?></span> <?php echo esc_html($container_destination); ?>
                                    </div>
                                <?php endif; ?>
                                <div class="container-leasing-item-price">
                                    <?php echo wc_price($container_price); ?>
                                </div>
                            </div>
                            <div class="container-leasing-item-actions">
                                <a href="<?php the_permalink(); ?>" class="container-leasing-button container-leasing-button-small">
                                    <?php _e('Details', 'container-leasing'); ?>
                                </a>
                                <?php if ($product_id && function_exists('wc_get_product')) : ?>
                                    <a href="<?php echo esc_url(add_query_arg('add-to-cart', $product_id, wc_get_cart_url())); ?>" class="container-leasing-button container-leasing-button-small container-leasing-button-primary">
                                        <?php _e('Lease Now', 'container-leasing'); ?>
                                    </a>
                                <?php endif; ?>
                            </div>
                        </div>
                    <?php
                    endwhile;
                    wp_reset_postdata();
                    ?>
                </div>
            </div>
            <?php
        else :
            ?>
            <p><?php _e('No containers available at the moment.', 'container-leasing'); ?></p>
            <?php
        endif;
        
        return ob_get_clean();
    }
    
    /**
     * Shortcode for container checkout with PayPal.
     *
     * @since    1.0.0
     * @param    array     $atts    Shortcode attributes.
     * @return   string             Shortcode output.
     */
    public function container_checkout_shortcode($atts) {
        // Parse shortcode attributes
        $atts = shortcode_atts(
            array(
                'container_id' => 0,
            ),
            $atts,
            'container_checkout'
        );
        
        // Check if user is logged in
        if (!is_user_logged_in()) {
            return $this->login_required_message();
        }
        
        // Get container ID
        $container_id = intval($atts['container_id']);
        
        // If no container ID specified and there's a URL parameter, use that
        if ($container_id === 0 && isset($_GET['container_id'])) {
            $container_id = intval($_GET['container_id']);
        }
        
        // If still no container ID, show error
        if ($container_id === 0) {
            return '<div class="container-leasing-error">' . __('No container specified for checkout.', 'container-leasing') . '</div>';
        }
        
        // Check if container exists and is available
        $container = get_post($container_id);
        $container_status = get_post_meta($container_id, '_container_status', true);
        
        if (!$container || $container->post_type !== 'container' || $container_status !== 'available') {
            return '<div class="container-leasing-error">' . __('The specified container is not available for lease.', 'container-leasing') . '</div>';
        }
        
        // Get container details
        $container_name = $container->post_title;
        $container_type = get_post_meta($container_id, '_container_type', true);
        $container_size = get_post_meta($container_id, '_container_size', true);
        $container_price = get_post_meta($container_id, '_container_price', true);
        $container_free_days = get_post_meta($container_id, '_container_free_days', true);
        $container_per_diem = get_post_meta($container_id, '_container_per_diem', true);
        
        // Buffer output
        ob_start();
        
        // Include necessary scripts
        wp_enqueue_script('container-leasing-paypal', CONTAINER_LEASING_PLUGIN_URL . 'public/js/paypal-integration.js', array('jquery'), CONTAINER_LEASING_VERSION, true);
        
        ?>
        <div class="container-leasing-checkout">
            <h2><?php _e('Checkout', 'container-leasing'); ?></h2>
            
            <div class="container-leasing-checkout-details">
                <h3><?php _e('Container Details', 'container-leasing'); ?></h3>
                <div class="container-leasing-checkout-item">
                    <div class="container-leasing-checkout-item-name">
                        <?php echo esc_html($container_name); ?>
                    </div>
                    <div class="container-leasing-checkout-item-specs">
                        <span><?php _e('Type:', 'container-leasing'); ?> <?php echo esc_html($container_type); ?></span>
                        <span><?php _e('Size:', 'container-leasing'); ?> <?php echo esc_html($container_size); ?></span>
                    </div>
                    <div class="container-leasing-checkout-item-pricing">
                        <div class="container-leasing-checkout-item-price">
                            <span><?php _e('Pickup Charge:', 'container-leasing'); ?></span> <?php echo wc_price($container_price); ?>
                        </div>
                        <div class="container-leasing-checkout-item-free-days">
                            <span><?php _e('Free Days:', 'container-leasing'); ?></span> <?php echo esc_html($container_free_days); ?>
                        </div>
                        <div class="container-leasing-checkout-item-per-diem">
                            <span><?php _e('Per Diem Rate:', 'container-leasing'); ?></span> <?php echo wc_price($container_per_diem); ?>
                        </div>
                    </div>
                </div>
                
                <div class="container-leasing-checkout-total">
                    <span><?php _e('Total:', 'container-leasing'); ?></span> <?php echo wc_price($container_price); ?>
                </div>
            </div>
            
            <div class="container-leasing-checkout-payment">
                <h3><?php _e('Payment Method', 'container-leasing'); ?></h3>
                <p><?php _e('Please select a payment method:', 'container-leasing'); ?></p>
                
                <div class="container-leasing-payment-methods">
                    <div class="container-leasing-payment-method active">
                        <input type="radio" name="payment_method" id="payment-paypal" value="paypal" checked>
                        <label for="payment-paypal"><?php _e('PayPal', 'container-leasing'); ?></label>
                    </div>
                </div>
                
                <div class="container-leasing-payment-button">
                    <div id="paypal-button" data-amount="<?php echo esc_attr($container_price); ?>" data-currency="USD" data-intent="CAPTURE" data-container-id="<?php echo esc_attr($container_id); ?>">
                        <?php _e('Pay with PayPal', 'container-leasing'); ?>
                    </div>
                </div>
            </div>
            
            <div class="container-leasing-checkout-terms">
                <p><?php _e('By completing this payment, you agree to our Terms and Conditions, including the following:', 'container-leasing'); ?></p>
                <ul>
                    <li><?php _e('Initial payment includes the pickup charge only.', 'container-leasing'); ?></li>
                    <li><?php printf(__('You have %d free days included in this lease.', 'container-leasing'), $container_free_days); ?></li>
                    <li><?php printf(__('After the free days, a per diem rate of %s will be charged.', 'container-leasing'), wc_price($container_per_diem)); ?></li>
                    <li><?php _e('Contracts are automatically generated upon successful payment.', 'container-leasing'); ?></li>
                </ul>
            </div>
        </div>
        
        <script>
            jQuery(document).ready(function($) {
                if (typeof initPayPalButton === 'function') {
                    initPayPalButton();
                }
            });
        </script>
        <?php
        
        return ob_get_clean();
    }
    
    /**
     * Shortcode for container contracts list.
     *
     * @since    1.0.0
     * @param    array     $atts    Shortcode attributes.
     * @return   string             Shortcode output.
     */
    public function container_contracts_shortcode($atts) {
        // Check if user is logged in
        if (!is_user_logged_in()) {
            return $this->login_required_message();
        }
        
        // Buffer output
        ob_start();
        
        // Get user's contracts
        global $wpdb;
        $table_contract = $wpdb->prefix . 'container_contracts';
        $user_id = get_current_user_id();
        
        $contracts = $wpdb->get_results($wpdb->prepare(
            "SELECT * FROM $table_contract WHERE user_id = %d ORDER BY start_date DESC",
            $user_id
        ));
        
        ?>
        <div class="container-leasing-contracts">
            <h2><?php _e('My Contracts', 'container-leasing'); ?></h2>
            
            <?php if ($contracts) : ?>
                <div class="container-leasing-contracts-list">
                    <table>
                        <thead>
                            <tr>
                                <th><?php _e('Contract ID', 'container-leasing'); ?></th>
                                <th><?php _e('Container', 'container-leasing'); ?></th>
                                <th><?php _e('Start Date', 'container-leasing'); ?></th>
                                <th><?php _e('End Date', 'container-leasing'); ?></th>
                                <th><?php _e('Status', 'container-leasing'); ?></th>
                                <th><?php _e('Actions', 'container-leasing'); ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($contracts as $contract) : ?>
                                <?php $container_name = get_the_title($contract->container_id); ?>
                                <tr>
                                    <td><?php echo esc_html($contract->id); ?></td>
                                    <td><?php echo esc_html($container_name); ?></td>
                                    <td><?php echo date_i18n(get_option('date_format'), strtotime($contract->start_date)); ?></td>
                                    <td><?php echo date_i18n(get_option('date_format'), strtotime($contract->end_date)); ?></td>
                                    <td><?php echo esc_html($contract->status); ?></td>
                                    <td>
                                        <?php if (!empty($contract->contract_file)) : ?>
                                            <a href="<?php echo esc_url($contract->contract_file); ?>" class="container-leasing-button container-leasing-button-small" target="_blank">
                                                <?php _e('View Contract', 'container-leasing'); ?>
                                            </a>
                                        <?php endif; ?>
                                        <a href="<?php echo esc_url(add_query_arg('invoice', 'INV-' . $contract->id . '-' . date('Ymd', strtotime($contract->start_date)), get_permalink(get_option('container_leasing_invoices_page_id')))); ?>" class="container-leasing-button container-leasing-button-small">
                                            <?php _e('View Invoice', 'container-leasing'); ?>
                                        </a>
                                    </td>
                                </tr>
                            <?php endforeach; ?>
                        </tbody>
                    </table>
                </div>
            <?php else : ?>
                <p><?php _e('You do not have any active contracts. Contracts will appear here once you lease a container.', 'container-leasing'); ?></p>
            <?php endif; ?>
        </div>
        <?php
        
        return ob_get_clean();
    }
    
    /**
     * Display login required message.
     *
     * @since    1.0.0
     * @return   string    Login required message.
     */
    private function login_required_message() {
        $login_url = wp_login_url(get_permalink());
        $register_url = wp_registration_url();
        
        $message = '<div class="container-leasing-login-required">';
        $message .= '<h2>' . __('Login Required', 'container-leasing') . '</h2>';
        $message .= '<p>' . __('You must be logged in to access this page.', 'container-leasing') . '</p>';
        $message .= '<div class="container-leasing-login-buttons">';
        $message .= '<a href="' . esc_url($login_url) . '" class="container-leasing-button">' . __('Login', 'container-leasing') . '</a> ';
        $message .= '<a href="' . esc_url($register_url) . '" class="container-leasing-button container-leasing-button-outline">' . __('Register', 'container-leasing') . '</a>';
        $message .= '</div>';
        $message .= '</div>';
        
        return $message;
    }
}
