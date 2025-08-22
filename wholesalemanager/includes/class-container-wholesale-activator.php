<?php
/**
 * Fired during plugin activation.
 *
 * @since      1.0.0
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes
 */

/**
 * Fired during plugin activation.
 *
 * This class defines all code necessary to run during the plugin's activation.
 *
 * @since      1.0.0
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes
 */
class Container_Leasing_Activator {

    /**
     * Activate the plugin.
     *
     * @since    1.0.0
     */
    public static function activate() {
        // Create necessary database tables
        self::create_tables();
        
        // Create necessary pages
        self::create_pages();
        
        // Register custom user roles
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-container-leasing-user-roles.php';
        $user_roles = new Container_Leasing_User_Roles();
        $user_roles->register_user_roles();
        
        // Flush rewrite rules to account for custom post types
        flush_rewrite_rules();
    }
    
    /**
     * Create necessary database tables.
     *
     * @since    1.0.0
     */
    private static function create_tables() {
        global $wpdb;
        
        $charset_collate = $wpdb->get_charset_collate();
        
        // Container tracking table
        $table_name = $wpdb->prefix . 'container_tracking';
        
        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            container_id mediumint(9) NOT NULL,
            user_id mediumint(9) NOT NULL,
            location VARCHAR(255) NOT NULL,
            destination VARCHAR(255) NOT NULL,
            status VARCHAR(50) NOT NULL,
            tracking_date datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";
        
        // Container contract table
        $table_contract = $wpdb->prefix . 'container_contracts';
        
        $sql_contract = "CREATE TABLE $table_contract (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            order_id mediumint(9) NOT NULL,
            container_id mediumint(9) NOT NULL,
            user_id mediumint(9) NOT NULL,
            start_date datetime NOT NULL,
            end_date datetime NOT NULL,
            free_days mediumint(9) DEFAULT 0 NOT NULL,
            per_diem_rate decimal(10,2) NOT NULL,
            pickup_charge decimal(10,2) NOT NULL,
            status VARCHAR(50) NOT NULL,
            contract_file VARCHAR(255) DEFAULT '',
            PRIMARY KEY  (id)
        ) $charset_collate;";
        
        // Email management table
        $table_email = $wpdb->prefix . 'container_emails';
        
        $sql_email = "CREATE TABLE $table_email (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            user_id mediumint(9) NOT NULL,
            recipient VARCHAR(255) NOT NULL,
            subject VARCHAR(255) NOT NULL,
            content text NOT NULL,
            sent_date datetime DEFAULT CURRENT_TIMESTAMP NOT NULL,
            status VARCHAR(50) DEFAULT 'sent' NOT NULL,
            folder VARCHAR(50) DEFAULT 'sent' NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";
        
        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
        dbDelta($sql_contract);
        dbDelta($sql_email);
    }
    
    /**
     * Create necessary pages for the plugin.
     *
     * @since    1.0.0
     */
    private static function create_pages() {
        $pages = array(
            'container-dashboard' => array(
                'title' => __('Container Dashboard', 'container-leasing'),
                'content' => '[container_dashboard]',
            ),
            'container-insights' => array(
                'title' => __('Container Insights', 'container-leasing'),
                'content' => '[container_insights]',
            ),
            'container-management' => array(
                'title' => __('Manage Containers', 'container-leasing'),
                'content' => '[container_management]',
            ),
            'container-invoices' => array(
                'title' => __('Container Invoices', 'container-leasing'),
                'content' => '[container_invoices]',
            ),
            'email-management' => array(
                'title' => __('Email Management', 'container-leasing'),
                'content' => '[email_management]',
            ),
        );
        
        foreach ($pages as $slug => $page) {
            $page_exists = get_page_by_path($slug);
            
            if (!$page_exists) {
                $page_id = wp_insert_post(array(
                    'post_title' => $page['title'],
                    'post_content' => $page['content'],
                    'post_status' => 'publish',
                    'post_type' => 'page',
                    'post_name' => $slug
                ));
                
                if ($slug === 'container-dashboard') {
                    update_option('container_leasing_dashboard_page_id', $page_id);
                } elseif ($slug === 'container-insights') {
                    update_option('container_leasing_insights_page_id', $page_id);
                } elseif ($slug === 'container-management') {
                    update_option('container_leasing_management_page_id', $page_id);
                } elseif ($slug === 'container-invoices') {
                    update_option('container_leasing_invoices_page_id', $page_id);
                } elseif ($slug === 'email-management') {
                    update_option('container_leasing_email_page_id', $page_id);
                }
            }
        }
    }
}
