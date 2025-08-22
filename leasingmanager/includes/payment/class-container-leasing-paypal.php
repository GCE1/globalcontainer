<?php
/**
 * PayPal integration functionality.
 *
 * @link       https://example.com
 * @since      1.0.0
 *
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes/payment
 */

/**
 * PayPal integration class.
 *
 * This class handles all PayPal API interactions for payment processing.
 *
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes/payment
 */
class Container_Leasing_PayPal {

    /**
     * The ID of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $plugin_name    The ID of this plugin.
     */
    private $plugin_name;

    /**
     * The version of this plugin.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $version    The current version of this plugin.
     */
    private $version;

    /**
     * PayPal Client ID.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $client_id    The PayPal client ID.
     */
    private $client_id;

    /**
     * PayPal Secret.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $client_secret    The PayPal client secret.
     */
    private $client_secret;

    /**
     * PayPal API Base URL.
     *
     * @since    1.0.0
     * @access   private
     * @var      string    $api_base    The PayPal API base URL.
     */
    private $api_base;

    /**
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     * @param    string    $plugin_name       The name of this plugin.
     * @param    string    $version           The version of this plugin.
     */
    public function __construct($plugin_name, $version) {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
        
        // Get PayPal settings
        $this->client_id = get_option('container_leasing_paypal_client_id', '');
        $this->client_secret = get_option('container_leasing_paypal_secret', '');
        $sandbox_mode = get_option('container_leasing_paypal_sandbox', 1);
        
        // Set API base URL based on mode
        if ($sandbox_mode) {
            $this->api_base = 'https://api-m.sandbox.paypal.com';
        } else {
            $this->api_base = 'https://api-m.paypal.com';
        }
    }
    
    /**
     * Get access token from PayPal API.
     *
     * @since    1.0.0
     * @return   string|WP_Error    Access token or error.
     */
    private function get_access_token() {
        if (empty($this->client_id) || empty($this->client_secret)) {
            return new WP_Error('paypal_credentials', __('PayPal credentials are not configured.', 'container-leasing'));
        }
        
        $auth = base64_encode($this->client_id . ":" . $this->client_secret);
        
        $args = array(
            'method'      => 'POST',
            'timeout'     => 45,
            'redirection' => 5,
            'httpversion' => '1.1',
            'headers'     => array(
                'Authorization' => "Basic {$auth}",
                'Content-Type'  => 'application/x-www-form-urlencoded',
            ),
            'body' => array(
                'grant_type' => 'client_credentials'
            )
        );
        
        $response = wp_remote_post("{$this->api_base}/v1/oauth2/token", $args);
        
        if (is_wp_error($response)) {
            return $response;
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if (empty($body['access_token'])) {
            return new WP_Error('paypal_token', __('Failed to get PayPal access token.', 'container-leasing'));
        }
        
        return $body['access_token'];
    }
    
    /**
     * Handle PayPal setup request.
     * 
     * Returns client token for PayPal SDK initialization.
     *
     * @since    1.0.0
     */
    public function paypal_setup() {
        // Verify nonce for security
        if (!check_ajax_referer('container_leasing_nonce', 'nonce', false)) {
            wp_send_json_error(__('Security check failed.', 'container-leasing'));
        }
        
        $access_token = $this->get_access_token();
        
        if (is_wp_error($access_token)) {
            wp_send_json_error($access_token->get_error_message());
        }
        
        // Generate client token
        $args = array(
            'method'      => 'POST',
            'timeout'     => 45,
            'redirection' => 5,
            'httpversion' => '1.1',
            'headers'     => array(
                'Authorization' => "Bearer {$access_token}",
                'Content-Type'  => 'application/json',
            ),
            'body' => json_encode(array(
                'intent' => 'sdk_init',
                'response_type' => 'client_token'
            ))
        );
        
        $response = wp_remote_post("{$this->api_base}/v1/oauth2/token", $args);
        
        if (is_wp_error($response)) {
            wp_send_json_error($response->get_error_message());
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if (empty($body['access_token'])) {
            wp_send_json_error(__('Failed to generate client token.', 'container-leasing'));
        }
        
        wp_send_json_success(array(
            'clientToken' => $body['access_token']
        ));
    }
    
    /**
     * Create a PayPal order.
     *
     * @since    1.0.0
     */
    public function create_order() {
        // Verify nonce for security
        if (!check_ajax_referer('container_leasing_nonce', 'nonce', false)) {
            wp_send_json_error(__('Security check failed.', 'container-leasing'));
        }
        
        // Validate input
        $amount = isset($_POST['amount']) ? sanitize_text_field($_POST['amount']) : '';
        $currency = isset($_POST['currency']) ? sanitize_text_field($_POST['currency']) : 'USD';
        $intent = isset($_POST['intent']) ? sanitize_text_field($_POST['intent']) : 'CAPTURE';
        
        if (empty($amount) || !is_numeric($amount) || floatval($amount) <= 0) {
            wp_send_json_error(__('Invalid amount.', 'container-leasing'));
        }
        
        $access_token = $this->get_access_token();
        
        if (is_wp_error($access_token)) {
            wp_send_json_error($access_token->get_error_message());
        }
        
        // Create order
        $args = array(
            'method'      => 'POST',
            'timeout'     => 45,
            'redirection' => 5,
            'httpversion' => '1.1',
            'headers'     => array(
                'Authorization' => "Bearer {$access_token}",
                'Content-Type'  => 'application/json',
            ),
            'body' => json_encode(array(
                'intent' => $intent,
                'purchase_units' => array(
                    array(
                        'amount' => array(
                            'currency_code' => $currency,
                            'value' => $amount
                        )
                    )
                ),
                'application_context' => array(
                    'return_url' => home_url(),
                    'cancel_url' => home_url()
                )
            ))
        );
        
        $response = wp_remote_post("{$this->api_base}/v2/checkout/orders", $args);
        
        if (is_wp_error($response)) {
            wp_send_json_error($response->get_error_message());
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if (empty($body['id'])) {
            wp_send_json_error(__('Failed to create PayPal order.', 'container-leasing'));
        }
        
        wp_send_json_success($body);
    }
    
    /**
     * Capture a PayPal order.
     *
     * @since    1.0.0
     */
    public function capture_order() {
        // Verify nonce for security
        if (!check_ajax_referer('container_leasing_nonce', 'nonce', false)) {
            wp_send_json_error(__('Security check failed.', 'container-leasing'));
        }
        
        // Get order ID
        $order_id = isset($_POST['order_id']) ? sanitize_text_field($_POST['order_id']) : '';
        
        if (empty($order_id)) {
            wp_send_json_error(__('Invalid order ID.', 'container-leasing'));
        }
        
        $access_token = $this->get_access_token();
        
        if (is_wp_error($access_token)) {
            wp_send_json_error($access_token->get_error_message());
        }
        
        // Capture order
        $args = array(
            'method'      => 'POST',
            'timeout'     => 45,
            'redirection' => 5,
            'httpversion' => '1.1',
            'headers'     => array(
                'Authorization' => "Bearer {$access_token}",
                'Content-Type'  => 'application/json',
            ),
            'body' => json_encode(array())
        );
        
        $response = wp_remote_post("{$this->api_base}/v2/checkout/orders/{$order_id}/capture", $args);
        
        if (is_wp_error($response)) {
            wp_send_json_error($response->get_error_message());
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if (empty($body['id'])) {
            wp_send_json_error(__('Failed to capture PayPal order.', 'container-leasing'));
        }
        
        // If order captured successfully, create/update container contract
        if ($body['status'] === 'COMPLETED') {
            $this->process_successful_payment($body);
        }
        
        wp_send_json_success($body);
    }
    
    /**
     * Create a PayPal subscription.
     *
     * @since    1.0.0
     */
    public function create_subscription() {
        // Verify nonce for security
        if (!check_ajax_referer('container_leasing_nonce', 'nonce', false)) {
            wp_send_json_error(__('Security check failed.', 'container-leasing'));
        }
        
        // Validate input
        $plan_id = isset($_POST['plan_id']) ? sanitize_text_field($_POST['plan_id']) : '';
        
        if (empty($plan_id)) {
            wp_send_json_error(__('Invalid plan ID.', 'container-leasing'));
        }
        
        $access_token = $this->get_access_token();
        
        if (is_wp_error($access_token)) {
            wp_send_json_error($access_token->get_error_message());
        }
        
        // Create subscription
        $args = array(
            'method'      => 'POST',
            'timeout'     => 45,
            'redirection' => 5,
            'httpversion' => '1.1',
            'headers'     => array(
                'Authorization' => "Bearer {$access_token}",
                'Content-Type'  => 'application/json',
                'PayPal-Request-Id' => uniqid('sub_'),
            ),
            'body' => json_encode(array(
                'plan_id' => $plan_id,
                'application_context' => array(
                    'return_url' => home_url(),
                    'cancel_url' => home_url()
                )
            ))
        );
        
        $response = wp_remote_post("{$this->api_base}/v1/billing/subscriptions", $args);
        
        if (is_wp_error($response)) {
            wp_send_json_error($response->get_error_message());
        }
        
        $body = json_decode(wp_remote_retrieve_body($response), true);
        
        if (empty($body['id'])) {
            wp_send_json_error(__('Failed to create PayPal subscription.', 'container-leasing'));
        }
        
        wp_send_json_success($body);
    }
    
    /**
     * Process successful payment.
     *
     * @since    1.0.0
     * @param    array    $payment_data    The payment data from PayPal.
     */
    private function process_successful_payment($payment_data) {
        // Extract order details
        $order_id = $payment_data['id'];
        $payer_id = isset($payment_data['payer']['payer_id']) ? $payment_data['payer']['payer_id'] : '';
        $payer_email = isset($payment_data['payer']['email_address']) ? $payment_data['payer']['email_address'] : '';
        $amount = isset($payment_data['purchase_units'][0]['payments']['captures'][0]['amount']['value']) ? $payment_data['purchase_units'][0]['payments']['captures'][0]['amount']['value'] : 0;
        
        // Get session data about what container is being leased
        $container_id = isset($_POST['container_id']) ? intval($_POST['container_id']) : 0;
        
        if (!$container_id) {
            return;
        }
        
        // Get container data
        $container_free_days = get_post_meta($container_id, '_container_free_days', true);
        $container_per_diem = get_post_meta($container_id, '_container_per_diem', true);
        
        // Create a contract for this lease
        global $wpdb;
        $table_contract = $wpdb->prefix . 'container_contracts';
        
        // Set default dates
        $start_date = current_time('mysql');
        $end_date = date('Y-m-d H:i:s', strtotime('+30 days', strtotime($start_date)));
        
        // Insert contract
        $wpdb->insert(
            $table_contract,
            array(
                'order_id' => $order_id,
                'container_id' => $container_id,
                'user_id' => get_current_user_id(),
                'start_date' => $start_date,
                'end_date' => $end_date,
                'free_days' => intval($container_free_days),
                'per_diem_rate' => floatval($container_per_diem),
                'pickup_charge' => floatval($amount),
                'status' => 'active'
            ),
            array('%s', '%d', '%d', '%s', '%s', '%d', '%f', '%f', '%s')
        );
        
        // Update container status to leased
        update_post_meta($container_id, '_container_status', 'leased');
        
        // Create WooCommerce order if WooCommerce is active
        if (function_exists('wc_create_order')) {
            $order = wc_create_order(array(
                'customer_id' => get_current_user_id(),
                'status' => 'completed',
            ));
            
            // Get product ID associated with this container
            $product_id = get_post_meta($container_id, '_container_product_id', true);
            
            if ($product_id) {
                $order->add_product(wc_get_product($product_id), 1);
            }
            
            $order->set_payment_method('paypal');
            $order->set_payment_method_title('PayPal');
            $order->set_transaction_id($order_id);
            $order->set_date_paid(current_time('timestamp'));
            
            // Add order note
            $order->add_order_note(sprintf(
                __('Container lease payment completed via PayPal. Transaction ID: %s', 'container-leasing'),
                $order_id
            ));
            
            // Add metadata to identify this as a container lease
            $order->update_meta_data('_container_lease', '1');
            $order->update_meta_data('_container_id', $container_id);
            
            $order->calculate_totals();
            $order->save();
        }
    }
}
