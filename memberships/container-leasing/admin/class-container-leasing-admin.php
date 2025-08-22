<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @since      1.0.0
 * @package    Container_Leasing
 * @subpackage Container_Leasing/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two hooks for
 * enqueuing the admin-specific stylesheet and JavaScript.
 *
 * @package    Container_Leasing
 * @subpackage Container_Leasing/admin
 */
class Container_Leasing_Admin {

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
     * Register the stylesheets for the admin area.
     *
     * @since    1.0.0
     */
    public function enqueue_styles() {
        wp_enqueue_style($this->plugin_name, plugin_dir_url(__FILE__) . 'css/container-leasing-admin.css', array(), $this->version, 'all');
    }

    /**
     * Register the JavaScript for the admin area.
     *
     * @since    1.0.0
     */
    public function enqueue_scripts() {
        wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/container-leasing-admin.js', array('jquery'), $this->version, false);
        
        // Localize the script with new data
        wp_localize_script($this->plugin_name, 'container_leasing_admin', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('container_leasing_admin_nonce'),
        ));
    }
    
    /**
     * Add plugin admin menu items.
     *
     * @since    1.0.0
     */
    public function add_plugin_admin_menu() {
        // Main menu item
        add_menu_page(
            __('Container Leasing', 'container-leasing'),
            __('Container Leasing', 'container-leasing'),
            'manage_options',
            $this->plugin_name,
            array($this, 'display_plugin_admin_page'),
            'dashicons-portfolio',
            26
        );
        
        // Settings submenu
        add_submenu_page(
            $this->plugin_name,
            __('Settings', 'container-leasing'),
            __('Settings', 'container-leasing'),
            'manage_options',
            $this->plugin_name . '-settings',
            array($this, 'display_plugin_settings_page')
        );
        
        // Container Management submenu
        add_submenu_page(
            $this->plugin_name,
            __('Container Management', 'container-leasing'),
            __('Container Management', 'container-leasing'),
            'manage_options',
            $this->plugin_name . '-containers',
            array($this, 'display_container_management_page')
        );
        
        // CSV Import/Export submenu
        add_submenu_page(
            $this->plugin_name,
            __('CSV Import/Export', 'container-leasing'),
            __('CSV Import/Export', 'container-leasing'),
            'manage_options',
            $this->plugin_name . '-csv',
            array($this, 'display_csv_page')
        );
        
        // Contracts submenu
        add_submenu_page(
            $this->plugin_name,
            __('Contracts', 'container-leasing'),
            __('Contracts', 'container-leasing'),
            'manage_options',
            $this->plugin_name . '-contracts',
            array($this, 'display_contracts_page')
        );
        
        // Analytics submenu
        add_submenu_page(
            $this->plugin_name,
            __('Analytics', 'container-leasing'),
            __('Analytics', 'container-leasing'),
            'manage_options',
            $this->plugin_name . '-analytics',
            array($this, 'display_analytics_page')
        );
    }
    
    /**
     * Register plugin settings.
     *
     * @since    1.0.0
     */
    public function register_settings() {
        // Register settings
        register_setting('container_leasing_options', 'container_leasing_paypal_client_id');
        register_setting('container_leasing_options', 'container_leasing_paypal_secret');
        register_setting('container_leasing_options', 'container_leasing_paypal_sandbox');
        register_setting('container_leasing_options', 'container_leasing_default_free_days');
        register_setting('container_leasing_options', 'container_leasing_default_pickup_charge');
        register_setting('container_leasing_options', 'container_leasing_default_per_diem');
        register_setting('container_leasing_options', 'container_leasing_google_maps_api_key');
        
        // Register settings sections
        add_settings_section(
            'container_leasing_payment_section',
            __('Payment Settings', 'container-leasing'),
            array($this, 'container_leasing_payment_section_callback'),
            'container-leasing-settings'
        );
        
        add_settings_section(
            'container_leasing_defaults_section',
            __('Default Values', 'container-leasing'),
            array($this, 'container_leasing_defaults_section_callback'),
            'container-leasing-settings'
        );
        
        add_settings_section(
            'container_leasing_api_section',
            __('API Keys', 'container-leasing'),
            array($this, 'container_leasing_api_section_callback'),
            'container-leasing-settings'
        );
        
        // Add settings fields
        // PayPal fields
        add_settings_field(
            'container_leasing_paypal_client_id',
            __('PayPal Client ID', 'container-leasing'),
            array($this, 'container_leasing_paypal_client_id_render'),
            'container-leasing-settings',
            'container_leasing_payment_section'
        );
        
        add_settings_field(
            'container_leasing_paypal_secret',
            __('PayPal Secret', 'container-leasing'),
            array($this, 'container_leasing_paypal_secret_render'),
            'container-leasing-settings',
            'container_leasing_payment_section'
        );
        
        add_settings_field(
            'container_leasing_paypal_sandbox',
            __('Use PayPal Sandbox', 'container-leasing'),
            array($this, 'container_leasing_paypal_sandbox_render'),
            'container-leasing-settings',
            'container_leasing_payment_section'
        );
        
        // Default values fields
        add_settings_field(
            'container_leasing_default_free_days',
            __('Default Free Days', 'container-leasing'),
            array($this, 'container_leasing_default_free_days_render'),
            'container-leasing-settings',
            'container_leasing_defaults_section'
        );
        
        add_settings_field(
            'container_leasing_default_pickup_charge',
            __('Default Pickup Charge', 'container-leasing'),
            array($this, 'container_leasing_default_pickup_charge_render'),
            'container-leasing-settings',
            'container_leasing_defaults_section'
        );
        
        add_settings_field(
            'container_leasing_default_per_diem',
            __('Default Per Diem Rate', 'container-leasing'),
            array($this, 'container_leasing_default_per_diem_render'),
            'container-leasing-settings',
            'container_leasing_defaults_section'
        );
        
        // API Keys fields
        add_settings_field(
            'container_leasing_google_maps_api_key',
            __('Google Maps API Key', 'container-leasing'),
            array($this, 'container_leasing_google_maps_api_key_render'),
            'container-leasing-settings',
            'container_leasing_api_section'
        );
    }
    
    /**
     * Render the main plugin admin page.
     *
     * @since    1.0.0
     */
    public function display_plugin_admin_page() {
        include_once('partials/container-leasing-admin-display.php');
    }
    
    /**
     * Render the plugin settings page.
     *
     * @since    1.0.0
     */
    public function display_plugin_settings_page() {
        include_once('partials/settings-page.php');
    }
    
    /**
     * Render the container management page.
     *
     * @since    1.0.0
     */
    public function display_container_management_page() {
        echo '<div class="wrap">';
        echo '<h1>' . __('Container Management', 'container-leasing') . '</h1>';
        echo '<p>' . __('Manage your container inventory here.', 'container-leasing') . '</p>';
        
        // Get container posts
        $args = array(
            'post_type' => 'container',
            'posts_per_page' => -1,
        );
        
        $containers = new WP_Query($args);
        
        if ($containers->have_posts()) {
            echo '<table class="wp-list-table widefat fixed striped">';
            echo '<thead>';
            echo '<tr>';
            echo '<th>' . __('ID', 'container-leasing') . '</th>';
            echo '<th>' . __('Container Name', 'container-leasing') . '</th>';
            echo '<th>' . __('Type', 'container-leasing') . '</th>';
            echo '<th>' . __('Size', 'container-leasing') . '</th>';
            echo '<th>' . __('Origin', 'container-leasing') . '</th>';
            echo '<th>' . __('Destination', 'container-leasing') . '</th>';
            echo '<th>' . __('Status', 'container-leasing') . '</th>';
            echo '<th>' . __('Actions', 'container-leasing') . '</th>';
            echo '</tr>';
            echo '</thead>';
            echo '<tbody>';
            
            while ($containers->have_posts()) {
                $containers->the_post();
                $container_id = get_the_ID();
                $container_type = get_post_meta($container_id, '_container_type', true);
                $container_size = get_post_meta($container_id, '_container_size', true);
                $container_origin = get_post_meta($container_id, '_container_origin', true);
                $container_destination = get_post_meta($container_id, '_container_destination', true);
                $container_status = get_post_meta($container_id, '_container_status', true);
                
                echo '<tr>';
                echo '<td>' . $container_id . '</td>';
                echo '<td><a href="' . get_edit_post_link($container_id) . '">' . get_the_title() . '</a></td>';
                echo '<td>' . esc_html($container_type) . '</td>';
                echo '<td>' . esc_html($container_size) . '</td>';
                echo '<td>' . esc_html($container_origin) . '</td>';
                echo '<td>' . esc_html($container_destination) . '</td>';
                echo '<td>' . esc_html($container_status) . '</td>';
                echo '<td>';
                echo '<a href="' . get_edit_post_link($container_id) . '" class="button button-small">' . __('Edit', 'container-leasing') . '</a> ';
                echo '<a href="' . get_delete_post_link($container_id) . '" class="button button-small button-link-delete">' . __('Delete', 'container-leasing') . '</a>';
                echo '</td>';
                echo '</tr>';
            }
            
            echo '</tbody>';
            echo '</table>';
            
            wp_reset_postdata();
        } else {
            echo '<p>' . __('No containers found.', 'container-leasing') . '</p>';
        }
        
        echo '<p><a href="' . admin_url('post-new.php?post_type=container') . '" class="button button-primary">' . __('Add New Container', 'container-leasing') . '</a></p>';
        
        echo '</div>';
    }
    
    /**
     * Render the CSV import/export page.
     *
     * @since    1.0.0
     */
    public function display_csv_page() {
        echo '<div class="wrap">';
        echo '<h1>' . __('CSV Import/Export', 'container-leasing') . '</h1>';
        
        // Import section
        echo '<div class="card">';
        echo '<h2>' . __('Import Containers', 'container-leasing') . '</h2>';
        echo '<p>' . __('Upload a CSV file to import multiple containers at once.', 'container-leasing') . '</p>';
        echo '<form method="post" enctype="multipart/form-data" action="' . admin_url('admin-post.php') . '">';
        echo '<input type="hidden" name="action" value="container_leasing_import_csv">';
        wp_nonce_field('container_leasing_import_csv', 'container_leasing_csv_nonce');
        echo '<p><input type="file" name="container_csv_file" accept=".csv" required></p>';
        echo '<p><input type="submit" class="button button-primary" value="' . __('Import CSV', 'container-leasing') . '"></p>';
        echo '</form>';
        echo '<p>' . __('CSV Format: Container Name, Type, Size, Origin, Destination, Status, Price, Free Days, Per Diem Rate', 'container-leasing') . '</p>';
        echo '<p><a href="#" class="button" id="container_leasing_sample_csv">' . __('Download Sample CSV', 'container-leasing') . '</a></p>';
        echo '</div>';
        
        // Export section
        echo '<div class="card">';
        echo '<h2>' . __('Export Containers', 'container-leasing') . '</h2>';
        echo '<p>' . __('Export your container data to a CSV file.', 'container-leasing') . '</p>';
        echo '<form method="post" action="' . admin_url('admin-post.php') . '">';
        echo '<input type="hidden" name="action" value="container_leasing_export_csv">';
        wp_nonce_field('container_leasing_export_csv', 'container_leasing_export_nonce');
        echo '<p><input type="submit" class="button button-primary" value="' . __('Export Containers', 'container-leasing') . '"></p>';
        echo '</form>';
        echo '</div>';
        
        // Export Contracts section
        echo '<div class="card">';
        echo '<h2>' . __('Export Contracts', 'container-leasing') . '</h2>';
        echo '<p>' . __('Export your contract data to a CSV file.', 'container-leasing') . '</p>';
        echo '<form method="post" action="' . admin_url('admin-post.php') . '">';
        echo '<input type="hidden" name="action" value="container_leasing_export_contracts_csv">';
        wp_nonce_field('container_leasing_export_contracts_csv', 'container_leasing_export_contracts_nonce');
        echo '<p><input type="submit" class="button button-primary" value="' . __('Export Contracts', 'container-leasing') . '"></p>';
        echo '</form>';
        echo '</div>';
        
        echo '</div>';
    }
    
    /**
     * Render the contracts page.
     *
     * @since    1.0.0
     */
    public function display_contracts_page() {
        global $wpdb;
        $table_contract = $wpdb->prefix . 'container_contracts';
        
        echo '<div class="wrap">';
        echo '<h1>' . __('Contracts Management', 'container-leasing') . '</h1>';
        
        // Get contracts from database
        $contracts = $wpdb->get_results("SELECT * FROM $table_contract ORDER BY id DESC");
        
        if ($contracts) {
            echo '<table class="wp-list-table widefat fixed striped">';
            echo '<thead>';
            echo '<tr>';
            echo '<th>' . __('ID', 'container-leasing') . '</th>';
            echo '<th>' . __('Order ID', 'container-leasing') . '</th>';
            echo '<th>' . __('Container', 'container-leasing') . '</th>';
            echo '<th>' . __('User', 'container-leasing') . '</th>';
            echo '<th>' . __('Start Date', 'container-leasing') . '</th>';
            echo '<th>' . __('End Date', 'container-leasing') . '</th>';
            echo '<th>' . __('Free Days', 'container-leasing') . '</th>';
            echo '<th>' . __('Per Diem Rate', 'container-leasing') . '</th>';
            echo '<th>' . __('Status', 'container-leasing') . '</th>';
            echo '<th>' . __('Actions', 'container-leasing') . '</th>';
            echo '</tr>';
            echo '</thead>';
            echo '<tbody>';
            
            foreach ($contracts as $contract) {
                $container_name = get_the_title($contract->container_id);
                $user_info = get_userdata($contract->user_id);
                $username = $user_info ? $user_info->display_name : __('Unknown User', 'container-leasing');
                
                echo '<tr>';
                echo '<td>' . $contract->id . '</td>';
                echo '<td><a href="' . admin_url('post.php?post=' . $contract->order_id . '&action=edit') . '">' . $contract->order_id . '</a></td>';
                echo '<td>' . esc_html($container_name) . '</td>';
                echo '<td>' . esc_html($username) . '</td>';
                echo '<td>' . date_i18n(get_option('date_format'), strtotime($contract->start_date)) . '</td>';
                echo '<td>' . date_i18n(get_option('date_format'), strtotime($contract->end_date)) . '</td>';
                echo '<td>' . esc_html($contract->free_days) . '</td>';
                echo '<td>' . wc_price($contract->per_diem_rate) . '</td>';
                echo '<td>' . esc_html($contract->status) . '</td>';
                echo '<td>';
                if (!empty($contract->contract_file)) {
                    echo '<a href="' . esc_url($contract->contract_file) . '" class="button button-small" target="_blank">' . __('View Contract', 'container-leasing') . '</a> ';
                }
                echo '<a href="#" class="button button-small container-leasing-edit-contract" data-id="' . $contract->id . '">' . __('Edit', 'container-leasing') . '</a>';
                echo '</td>';
                echo '</tr>';
            }
            
            echo '</tbody>';
            echo '</table>';
        } else {
            echo '<p>' . __('No contracts found.', 'container-leasing') . '</p>';
        }
        
        echo '</div>';
        
        // Edit contract modal HTML
        echo '<div id="container-leasing-contract-modal" style="display:none;">';
        echo '<div class="container-leasing-modal-content">';
        echo '<h2>' . __('Edit Contract', 'container-leasing') . '</h2>';
        echo '<form id="container-leasing-edit-contract-form">';
        echo '<input type="hidden" id="contract_id" name="contract_id">';
        echo '<p>';
        echo '<label for="contract_start_date">' . __('Start Date', 'container-leasing') . '</label><br>';
        echo '<input type="date" id="contract_start_date" name="contract_start_date" required>';
        echo '</p>';
        echo '<p>';
        echo '<label for="contract_end_date">' . __('End Date', 'container-leasing') . '</label><br>';
        echo '<input type="date" id="contract_end_date" name="contract_end_date" required>';
        echo '</p>';
        echo '<p>';
        echo '<label for="contract_free_days">' . __('Free Days', 'container-leasing') . '</label><br>';
        echo '<input type="number" id="contract_free_days" name="contract_free_days" min="0" required>';
        echo '</p>';
        echo '<p>';
        echo '<label for="contract_per_diem">' . __('Per Diem Rate', 'container-leasing') . '</label><br>';
        echo '<input type="number" id="contract_per_diem" name="contract_per_diem" min="0" step="0.01" required>';
        echo '</p>';
        echo '<p>';
        echo '<label for="contract_status">' . __('Status', 'container-leasing') . '</label><br>';
        echo '<select id="contract_status" name="contract_status" required>';
        echo '<option value="active">' . __('Active', 'container-leasing') . '</option>';
        echo '<option value="completed">' . __('Completed', 'container-leasing') . '</option>';
        echo '<option value="terminated">' . __('Terminated', 'container-leasing') . '</option>';
        echo '</select>';
        echo '</p>';
        echo '<p>';
        echo '<button type="submit" class="button button-primary">' . __('Update Contract', 'container-leasing') . '</button>';
        echo '<button type="button" class="button" id="container-leasing-close-modal">' . __('Cancel', 'container-leasing') . '</button>';
        echo '</p>';
        echo '</form>';
        echo '</div>';
        echo '</div>';
    }
    
    /**
     * Render the analytics page.
     *
     * @since    1.0.0
     */
    public function display_analytics_page() {
        echo '<div class="wrap">';
        echo '<h1>' . __('Container Leasing Analytics', 'container-leasing') . '</h1>';
        
        echo '<div class="container-leasing-analytics-wrapper">';
        
        // Revenue overview
        echo '<div class="container-leasing-analytics-card">';
        echo '<h2>' . __('Revenue Overview', 'container-leasing') . '</h2>';
        echo '<div id="container-leasing-revenue-chart" style="height: 300px;"></div>';
        echo '</div>';
        
        // Container usage
        echo '<div class="container-leasing-analytics-card">';
        echo '<h2>' . __('Container Usage', 'container-leasing') . '</h2>';
        echo '<div id="container-leasing-usage-chart" style="height: 300px;"></div>';
        echo '</div>';
        
        // Location distribution
        echo '<div class="container-leasing-analytics-card">';
        echo '<h2>' . __('Location Distribution', 'container-leasing') . '</h2>';
        echo '<div id="container-leasing-location-map" style="height: 300px;"></div>';
        echo '</div>';
        
        // Top customers
        echo '<div class="container-leasing-analytics-card">';
        echo '<h2>' . __('Top Customers', 'container-leasing') . '</h2>';
        echo '<div id="container-leasing-customers-chart" style="height: 300px;"></div>';
        echo '</div>';
        
        echo '</div>'; // .container-leasing-analytics-wrapper
        
        echo '</div>'; // .wrap
        
        // Enqueue Chart.js for this page
        wp_enqueue_script('chart-js', 'https://cdn.jsdelivr.net/npm/chart.js', array(), '3.7.1', true);
        wp_enqueue_script('container-leasing-admin-charts', plugin_dir_url(__FILE__) . 'js/container-leasing-admin-charts.js', array('jquery', 'chart-js'), $this->version, true);
    }
    
    /* 
     * Settings sections callbacks
     */
    public function container_leasing_payment_section_callback() {
        echo '<p>' . __('Configure your PayPal payment settings here.', 'container-leasing') . '</p>';
    }
    
    public function container_leasing_defaults_section_callback() {
        echo '<p>' . __('Set default values for container leasing.', 'container-leasing') . '</p>';
    }
    
    public function container_leasing_api_section_callback() {
        echo '<p>' . __('Enter API keys for third-party services.', 'container-leasing') . '</p>';
    }
    
    /*
     * Settings fields callbacks
     */
    public function container_leasing_paypal_client_id_render() {
        $client_id = get_option('container_leasing_paypal_client_id');
        echo '<input type="text" name="container_leasing_paypal_client_id" value="' . esc_attr($client_id) . '" class="regular-text">';
    }
    
    public function container_leasing_paypal_secret_render() {
        $secret = get_option('container_leasing_paypal_secret');
        echo '<input type="password" name="container_leasing_paypal_secret" value="' . esc_attr($secret) . '" class="regular-text">';
    }
    
    public function container_leasing_paypal_sandbox_render() {
        $sandbox = get_option('container_leasing_paypal_sandbox', 1);
        echo '<input type="checkbox" name="container_leasing_paypal_sandbox" value="1" ' . checked(1, $sandbox, false) . '>';
        echo '<span class="description">' . __('Check to use PayPal Sandbox mode for testing.', 'container-leasing') . '</span>';
    }
    
    public function container_leasing_default_free_days_render() {
        $free_days = get_option('container_leasing_default_free_days', 5);
        echo '<input type="number" name="container_leasing_default_free_days" value="' . esc_attr($free_days) . '" min="0" class="small-text">';
        echo '<span class="description">' . __('Number of free days before per diem charges apply.', 'container-leasing') . '</span>';
    }
    
    public function container_leasing_default_pickup_charge_render() {
        $pickup_charge = get_option('container_leasing_default_pickup_charge', 200);
        echo '<input type="number" name="container_leasing_default_pickup_charge" value="' . esc_attr($pickup_charge) . '" min="0" step="0.01" class="small-text">';
        echo '<span class="description">' . __('Default pickup charge in your currency.', 'container-leasing') . '</span>';
    }
    
    public function container_leasing_default_per_diem_render() {
        $per_diem = get_option('container_leasing_default_per_diem', 25);
        echo '<input type="number" name="container_leasing_default_per_diem" value="' . esc_attr($per_diem) . '" min="0" step="0.01" class="small-text">';
        echo '<span class="description">' . __('Default per diem rate in your currency.', 'container-leasing') . '</span>';
    }
    
    public function container_leasing_google_maps_api_key_render() {
        $api_key = get_option('container_leasing_google_maps_api_key');
        echo '<input type="text" name="container_leasing_google_maps_api_key" value="' . esc_attr($api_key) . '" class="regular-text">';
        echo '<p class="description">' . __('Required for container location mapping on the insights page.', 'container-leasing') . '</p>';
    }
}
