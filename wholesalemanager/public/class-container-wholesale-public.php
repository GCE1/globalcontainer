<?php
/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://example.com
 * @since      1.0.0
 * @package    Container_Wholesale
 * @subpackage Container_Wholesale/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two hooks for
 * enqueuing the public-facing stylesheet and JavaScript.
 *
 * @package    Container_Wholesale
 * @subpackage Container_Wholesale/public
 */
class Container_Wholesale_Public {

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
     * Initialize the class and set its properties.
     *
     * @since    1.0.0
     * @param    string    $plugin_name       The name of this plugin.
     * @param    string    $version           The version of this plugin.
     */
    public function __construct($plugin_name, $version) {
        $this->plugin_name = $plugin_name;
        $this->version = $version;
    }

    /**
     * Register the stylesheets for the public-facing side of the site.
     *
     * @since    1.0.0
     */
    public function enqueue_styles() {
        wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/container-wholesale-public.css', array(), $this->version, 'all');
        wp_enqueue_style('feather-icons', 'https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.css', array(), '4.28.0', 'all');
        wp_enqueue_style('bootstrap', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css', array(), '5.1.3', 'all');
    }

    /**
     * Register the JavaScript for the public-facing side of the site.
     *
     * @since    1.0.0
     */
    public function enqueue_scripts() {
        wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/container-wholesale-public.js', array('jquery'), $this->version, false);
        wp_enqueue_script('feather-icons', 'https://cdn.jsdelivr.net/npm/feather-icons/dist/feather.min.js', array(), '4.28.0', true);
        wp_enqueue_script('bootstrap-js', 'https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js', array('jquery'), '5.1.3', true);
        
        // Localize script with data needed for AJAX
        wp_localize_script($this->plugin_name, 'container_leasing', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('container_leasing_nonce'),
            'google_maps_api_key' => get_option('container_wholesale_google_maps_api_key', ''),
            'plugin_url' => CONTAINER_LEASING_PLUGIN_URL,
        ));
    }
    
    /**
     * Register custom page templates for the plugin.
     *
     * @param string $page_template The current page template
     * @return string The modified page template
     */
    public function register_custom_templates($page_template) {
        if (is_page('container-insights') || get_page_template_slug() === 'template-insights.php') {
            $page_template = plugin_dir_path(__FILE__) . 'partials/insights-page-template.php';
        }
        
        if (is_page('container-management') || get_page_template_slug() === 'template-container-management.php') {
            $page_template = plugin_dir_path(__FILE__) . 'partials/container-management-template.php';
        }
        
        if (is_page('container-invoices') || get_page_template_slug() === 'template-invoices.php') {
            $page_template = plugin_dir_path(__FILE__) . 'partials/invoice-template.php';
        }
        
        if (is_page('email-management') || get_page_template_slug() === 'template-email-management.php') {
            $page_template = plugin_dir_path(__FILE__) . 'partials/email-management-template.php';
        }
        
        if (is_page('container-dashboard') || get_page_template_slug() === 'template-dashboard.php') {
            $page_template = plugin_dir_path(__FILE__) . 'partials/dashboard-template.php';
        }
        
        return $page_template;
    }
    
    /**
     * Add our custom page templates to the templates dropdown.
     *
     * @param array $templates The current templates
     * @return array The modified templates
     */
    public function add_custom_templates($templates) {
        $templates['template-insights.php'] = __('Container Insights', 'container-wholesale');
        $templates['template-container-management.php'] = __('Container Management', 'container-leasing');
        $templates['template-invoices.php'] = __('Container Invoices', 'container-wholesale');
        $templates['template-email-management.php'] = __('Email Management', 'container-leasing');
        $templates['template-dashboard.php'] = __('Container Dashboard', 'container-wholesale');
        
        return $templates;
    }
    
    /**
     * Handle AJAX request to save container data.
     */
    public function handle_save_container() {
        // Check nonce for security
        check_ajax_referer('container_wholesale_nonce', 'nonce');
        
        // Check if user is logged in
        if (!is_user_logged_in()) {
            wp_send_json_error(__('You must be logged in to save a container.', 'container-wholesale'));
        }
        
        // Extract and sanitize form data
        $container_name = isset($_POST['container_name']) ? sanitize_text_field($_POST['container_name']) : '';
        $container_type = isset($_POST['container_type']) ? sanitize_text_field($_POST['container_type']) : '';
        $container_size = isset($_POST['container_size']) ? sanitize_text_field($_POST['container_size']) : '';
        $container_origin = isset($_POST['container_origin']) ? sanitize_text_field($_POST['container_origin']) : '';
        $container_destination = isset($_POST['container_destination']) ? sanitize_text_field($_POST['container_destination']) : '';
        $container_status = isset($_POST['container_status']) ? sanitize_text_field($_POST['container_status']) : 'available';
        $container_price = isset($_POST['container_price']) ? floatval($_POST['container_price']) : 0;
        $container_free_days = isset($_POST['container_free_days']) ? intval($_POST['container_free_days']) : 0;
        $container_per_diem = isset($_POST['container_per_diem']) ? floatval($_POST['container_per_diem']) : 0;
        $container_id = isset($_POST['container_id']) ? intval($_POST['container_id']) : 0;
        
        // Validate required fields
        if (empty($container_name) || empty($container_type) || empty($container_size)) {
            wp_send_json_error(__('Name, type, and size are required fields.', 'container-leasing'));
        }
        
        // Create or update container post
        $container_data = array(
            'post_title' => $container_name,
            'post_status' => 'publish',
            'post_type' => 'container',
        );
        
        if ($container_id > 0) {
            // Update existing container
            $container_data['ID'] = $container_id;
            $container_id = wp_update_post($container_data);
        } else {
            // Create new container
            $container_data['post_author'] = get_current_user_id();
            $container_id = wp_insert_post($container_data);
        }
        
        if (is_wp_error($container_id)) {
            wp_send_json_error($container_id->get_error_message());
        }
        
        // Update container meta data
        update_post_meta($container_id, '_container_type', $container_type);
        update_post_meta($container_id, '_container_size', $container_size);
        update_post_meta($container_id, '_container_origin', $container_origin);
        update_post_meta($container_id, '_container_destination', $container_destination);
        update_post_meta($container_id, '_container_status', $container_status);
        update_post_meta($container_id, '_container_price', $container_price);
        update_post_meta($container_id, '_container_free_days', $container_free_days);
        update_post_meta($container_id, '_container_per_diem', $container_per_diem);
        update_post_meta($container_id, '_container_user', get_current_user_id());
        
        // Create WooCommerce product if needed
        $this->create_woocommerce_product($container_id, $container_name, $container_price);
        
        // Return success with container ID
        wp_send_json_success(array(
            'container_id' => $container_id,
            'message' => __('Container saved successfully.', 'container-wholesale')
        ));
    }
    
    /**
     * Create a WooCommerce product for a container.
     *
     * @param int $container_id The container post ID
     * @param string $container_name The container name
     * @param float $container_price The container price
     */
    private function create_woocommerce_product($container_id, $container_name, $container_price) {
        // Check if WooCommerce is active
        if (!function_exists('wc_get_product')) {
            return;
        }
        
        // Check if a product already exists for this container
        $product_id = get_post_meta($container_id, '_container_product_id', true);
        
        if ($product_id && get_post_type($product_id) === 'product') {
            // Update existing product
            $product = wc_get_product($product_id);
            $product->set_name($container_name);
            $product->set_regular_price($container_price);
            $product->save();
        } else {
            // Create new product
            $product = new WC_Product();
            $product->set_name($container_name);
            $product->set_regular_price($container_price);
            $product->set_status('publish');
            $product->set_catalog_visibility('visible');
            $product->set_description(sprintf(
                __('This is a shipping container available for lease. Container ID: %s', 'container-leasing'),
                $container_id
            ));
            
            // Set container-specific meta
            $container_type = get_post_meta($container_id, '_container_type', true);
            $container_size = get_post_meta($container_id, '_container_size', true);
            $container_meta = sprintf(
                __('Type: %s, Size: %s', 'container-wholesale'),
                $container_type,
                $container_size
            );
            $product->set_short_description($container_meta);
            
            // Save the product
            $product_id = $product->save();
            
            // Link the container to the product
            update_post_meta($container_id, '_container_product_id', $product_id);
            
            // Link the product to the container
            update_post_meta($product_id, '_product_container_id', $container_id);
        }
    }
    
    /**
     * Handle AJAX request to load insights data.
     */
    public function handle_load_insights() {
        // Check nonce for security
        check_ajax_referer('container_wholesale_nonce', 'nonce');
        
        // Check if user is logged in
        if (!is_user_logged_in()) {
            wp_send_json_error(__('You must be logged in to view insights.', 'container-wholesale'));
        }
        
        // Get container location data
        $location_data = $this->get_container_locations();
        
        // Get monthly pickup charges
        $monthly_data = $this->get_monthly_pickup_charges();
        
        // Return data
        wp_send_json_success(array(
            'locations' => $location_data,
            'monthly_charges' => $monthly_data
        ));
    }
    
    /**
     * Get container location data for insights.
     *
     * @return array Array of container locations
     */
    private function get_container_locations() {
        $locations = array();
        
        // Get all container posts
        $args = array(
            'post_type' => 'container',
            'posts_per_page' => -1,
        );
        
        $containers = new WP_Query($args);
        
        if ($containers->have_posts()) {
            while ($containers->have_posts()) {
                $containers->the_post();
                $container_id = get_the_ID();
                $container_origin = get_post_meta($container_id, '_container_origin', true);
                $container_destination = get_post_meta($container_id, '_container_destination', true);
                
                if (!empty($container_origin)) {
                    $locations[] = array(
                        'type' => 'origin',
                        'location' => $container_origin,
                        'container_id' => $container_id,
                        'container_name' => get_the_title()
                    );
                }
                
                if (!empty($container_destination)) {
                    $locations[] = array(
                        'type' => 'destination',
                        'location' => $container_destination,
                        'container_id' => $container_id,
                        'container_name' => get_the_title()
                    );
                }
            }
            
            wp_reset_postdata();
        }
        
        return $locations;
    }
    
    /**
     * Get monthly pickup charge data for insights.
     *
     * @return array Array of monthly pickup charges
     */
    private function get_monthly_pickup_charges() {
        global $wpdb;
        $table_contract = $wpdb->prefix . 'container_contracts';
        
        // Get monthly averages for the past 12 months
        $results = $wpdb->get_results("
            SELECT 
                DATE_FORMAT(start_date, '%Y-%m') as month,
                AVG(pickup_charge) as avg_pickup_charge,
                COUNT(*) as contract_count
            FROM $table_contract
            WHERE start_date >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(start_date, '%Y-%m')
            ORDER BY month ASC
        ");
        
        $monthly_data = array();
        
        if ($results) {
            foreach ($results as $row) {
                $monthly_data[] = array(
                    'month' => $row->month,
                    'avg_pickup_charge' => round($row->avg_pickup_charge, 2),
                    'contract_count' => $row->contract_count
                );
            }
        }
        
        return $monthly_data;
    }
    
    /**
     * Handle AJAX request to generate an invoice.
     */
    public function handle_generate_invoice() {
        // Check nonce for security
        check_ajax_referer('container_wholesale_nonce', 'nonce');
        
        // Check if user is logged in
        if (!is_user_logged_in()) {
            wp_send_json_error(__('You must be logged in to generate an invoice.', 'container-wholesale'));
        }
        
        // Get contract ID
        $contract_id = isset($_POST['contract_id']) ? intval($_POST['contract_id']) : 0;
        
        if ($contract_id <= 0) {
            wp_send_json_error(__('Invalid contract ID.', 'container-wholesale'));
        }
        
        // Get contract data
        global $wpdb;
        $table_contract = $wpdb->prefix . 'container_contracts';
        
        $contract = $wpdb->get_row($wpdb->prepare("
            SELECT * FROM $table_contract WHERE id = %d
        ", $contract_id));
        
        if (!$contract) {
            wp_send_json_error(__('Contract not found.', 'container-wholesale'));
        }
        
        // Check if user owns this contract
        if ($contract->user_id != get_current_user_id() && !current_user_can('administrator')) {
            wp_send_json_error(__('You do not have permission to access this contract.', 'container-wholesale'));
        }
        
        // Generate invoice data
        $container_name = get_the_title($contract->container_id);
        $container_type = get_post_meta($contract->container_id, '_container_type', true);
        $container_size = get_post_meta($contract->container_id, '_container_size', true);
        
        $start_date = new DateTime($contract->start_date);
        $end_date = new DateTime($contract->end_date);
        $current_date = new DateTime();
        
        // Calculate days used
        $days_used = $start_date->diff($current_date)->days;
        
        // Calculate if beyond free days
        $extra_days = max(0, $days_used - $contract->free_days);
        $extra_charges = $extra_days * $contract->per_diem_rate;
        
        // Calculate total
        $total = $contract->pickup_charge + $extra_charges;
        
        // Invoice data
        $invoice_data = array(
            'invoice_id' => 'INV-' . $contract_id . '-' . date('Ymd'),
            'date' => date_i18n(get_option('date_format')),
            'user_id' => $contract->user_id,
            'contract_id' => $contract_id,
            'container_name' => $container_name,
            'container_details' => sprintf(
                __('Type: %s, Size: %s', 'container-wholesale'),
                $container_type,
                $container_size
            ),
            'start_date' => date_i18n(get_option('date_format'), strtotime($contract->start_date)),
            'end_date' => date_i18n(get_option('date_format'), strtotime($contract->end_date)),
            'days_used' => $days_used,
            'free_days' => $contract->free_days,
            'extra_days' => $extra_days,
            'pickup_charge' => $contract->pickup_charge,
            'per_diem_rate' => $contract->per_diem_rate,
            'extra_charges' => $extra_charges,
            'total' => $total
        );
        
        // Return invoice data
        wp_send_json_success($invoice_data);
    }
    
    /**
     * Handle AJAX request to upload CSV file.
     */
    public function handle_upload_csv() {
        // Check nonce for security
        check_ajax_referer('container_wholesale_nonce', 'nonce');
        
        // Check if user is logged in
        if (!is_user_logged_in()) {
            wp_send_json_error(__('You must be logged in to upload CSV.', 'container-leasing'));
        }
        
        // Check for file
        if (!isset($_FILES['csv_file']) || empty($_FILES['csv_file']['tmp_name'])) {
            wp_send_json_error(__('No file uploaded.', 'container-leasing'));
        }
        
        // Get file contents
        $file = $_FILES['csv_file']['tmp_name'];
        
        // Instantiate CSV handler
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/csv/class-container-leasing-csv-handler.php';
        $csv_handler = new Container_Leasing_CSV_Handler();
        
        // Import CSV
        $result = $csv_handler->process_import($file);
        
        if (is_wp_error($result)) {
            wp_send_json_error($result->get_error_message());
        }
        
        wp_send_json_success(array(
            'message' => sprintf(
                __('CSV import completed. %d containers imported successfully.', 'container-wholesale'),
                $result
            )
        ));
    }
}
