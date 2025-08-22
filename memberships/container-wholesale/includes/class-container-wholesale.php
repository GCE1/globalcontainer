<?php
/**
 * The core plugin class.
 *
 * @since      1.0.0
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes
 */

/**
 * The core plugin class.
 *
 * This is used to define internationalization, admin-specific hooks, and
 * public-facing site hooks.
 *
 * @since      1.0.0
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes
 */
class Container_Leasing {

    /**
     * The loader that's responsible for maintaining and registering all hooks that power
     * the plugin.
     *
     * @since    1.0.0
     * @access   protected
     * @var      Container_Leasing_Loader    $loader    Maintains and registers all hooks for the plugin.
     */
    protected $loader;

    /**
     * The unique identifier of this plugin.
     *
     * @since    1.0.0
     * @access   protected
     * @var      string    $plugin_name    The string used to uniquely identify this plugin.
     */
    protected $plugin_name;

    /**
     * The current version of the plugin.
     *
     * @since    1.0.0
     * @access   protected
     * @var      string    $version    The current version of the plugin.
     */
    protected $version;

    /**
     * Define the core functionality of the plugin.
     *
     * @since    1.0.0
     */
    public function __construct() {
        if (defined('CONTAINER_LEASING_VERSION')) {
            $this->version = CONTAINER_LEASING_VERSION;
        } else {
            $this->version = '1.0.0';
        }
        $this->plugin_name = 'container-leasing';

        $this->load_dependencies();
        $this->set_locale();
        $this->define_admin_hooks();
        $this->define_public_hooks();
        $this->define_post_types();
        $this->define_shortcodes();
        $this->init_woocommerce_integration();
        $this->init_user_roles();
    }

    /**
     * Load the required dependencies for this plugin.
     *
     * @since    1.0.0
     * @access   private
     */
    private function load_dependencies() {
        /**
         * The class responsible for orchestrating the actions and filters of the
         * core plugin.
         */
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-container-leasing-loader.php';

        /**
         * The class responsible for defining internationalization functionality
         * of the plugin.
         */
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-container-leasing-i18n.php';

        /**
         * The class responsible for defining all actions that occur in the admin area.
         */
        require_once plugin_dir_path(dirname(__FILE__)) . 'admin/class-container-leasing-admin.php';

        /**
         * The class responsible for defining all actions that occur in the public-facing
         * side of the site.
         */
        require_once plugin_dir_path(dirname(__FILE__)) . 'public/class-container-leasing-public.php';

        /**
         * The class responsible for defining custom post types
         */
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-container-leasing-post-types.php';

        /**
         * The class responsible for defining shortcodes
         */
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-container-leasing-shortcodes.php';

        /**
         * The class responsible for WooCommerce integration
         */
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-container-leasing-woocommerce.php';

        /**
         * The class responsible for user roles
         */
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-container-leasing-user-roles.php';

        /**
         * The class responsible for PayPal integration
         */
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/payment/class-container-leasing-paypal.php';

        /**
         * The class responsible for CSV handling
         */
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/csv/class-container-leasing-csv-handler.php';

        /**
         * The class responsible for contract management
         */
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/class-container-leasing-contract-manager.php';

        /**
         * The class responsible for widgets
         */
        require_once plugin_dir_path(dirname(__FILE__)) . 'includes/widgets/class-container-leasing-widgets.php';

        $this->loader = new Container_Leasing_Loader();
    }

    /**
     * Define the locale for this plugin for internationalization.
     *
     * @since    1.0.0
     * @access   private
     */
    private function set_locale() {
        $plugin_i18n = new Container_Leasing_i18n();
        $this->loader->add_action('plugins_loaded', $plugin_i18n, 'load_plugin_textdomain');
    }

    /**
     * Register all of the hooks related to the admin area functionality
     * of the plugin.
     *
     * @since    1.0.0
     * @access   private
     */
    private function define_admin_hooks() {
        $plugin_admin = new Container_Leasing_Admin($this->get_plugin_name(), $this->get_version());

        $this->loader->add_action('admin_enqueue_scripts', $plugin_admin, 'enqueue_styles');
        $this->loader->add_action('admin_enqueue_scripts', $plugin_admin, 'enqueue_scripts');
        $this->loader->add_action('admin_menu', $plugin_admin, 'add_plugin_admin_menu');
        $this->loader->add_action('admin_init', $plugin_admin, 'register_settings');
    }

    /**
     * Register all of the hooks related to the public-facing functionality
     * of the plugin.
     *
     * @since    1.0.0
     * @access   private
     */
    private function define_public_hooks() {
        $plugin_public = new Container_Leasing_Public($this->get_plugin_name(), $this->get_version());

        $this->loader->add_action('wp_enqueue_scripts', $plugin_public, 'enqueue_styles');
        $this->loader->add_action('wp_enqueue_scripts', $plugin_public, 'enqueue_scripts');
        
        // Register custom templates
        $this->loader->add_filter('page_template', $plugin_public, 'register_custom_templates');
        $this->loader->add_filter('theme_page_templates', $plugin_public, 'add_custom_templates');
        
        // Ajax handlers
        $this->loader->add_action('wp_ajax_container_leasing_save_container', $plugin_public, 'handle_save_container');
        $this->loader->add_action('wp_ajax_container_leasing_load_insights', $plugin_public, 'handle_load_insights');
        $this->loader->add_action('wp_ajax_container_leasing_generate_invoice', $plugin_public, 'handle_generate_invoice');
        $this->loader->add_action('wp_ajax_container_leasing_upload_csv', $plugin_public, 'handle_upload_csv');
        
        // PayPal integration
        $paypal = new Container_Leasing_PayPal($this->get_plugin_name(), $this->get_version());
        $this->loader->add_action('wp_ajax_container_leasing_paypal_setup', $paypal, 'paypal_setup');
        $this->loader->add_action('wp_ajax_nopriv_container_leasing_paypal_setup', $paypal, 'paypal_setup');
        $this->loader->add_action('wp_ajax_container_leasing_create_order', $paypal, 'create_order');
        $this->loader->add_action('wp_ajax_nopriv_container_leasing_create_order', $paypal, 'create_order');
        $this->loader->add_action('wp_ajax_container_leasing_capture_order', $paypal, 'capture_order');
        $this->loader->add_action('wp_ajax_nopriv_container_leasing_capture_order', $paypal, 'capture_order');
        
        // CSV Handler
        $csv_handler = new Container_Leasing_CSV_Handler();
        $this->loader->add_action('wp_ajax_container_leasing_import_csv', $csv_handler, 'import_csv');
        $this->loader->add_action('wp_ajax_container_leasing_export_csv', $csv_handler, 'export_csv');
    }

    /**
     * Register custom post types.
     *
     * @since    1.0.0
     * @access   private
     */
    private function define_post_types() {
        $post_types = new Container_Leasing_Post_Types();
        $this->loader->add_action('init', $post_types, 'register_post_types');
        $this->loader->add_action('init', $post_types, 'register_taxonomies');
    }

    /**
     * Register shortcodes.
     *
     * @since    1.0.0
     * @access   private
     */
    private function define_shortcodes() {
        $shortcodes = new Container_Leasing_Shortcodes();
        $this->loader->add_action('init', $shortcodes, 'register_shortcodes');
    }

    /**
     * Initialize WooCommerce integration.
     *
     * @since    1.0.0
     * @access   private
     */
    private function init_woocommerce_integration() {
        $woocommerce = new Container_Leasing_WooCommerce();
        $this->loader->add_action('init', $woocommerce, 'init_integration');
        $this->loader->add_action('woocommerce_product_options_general_product_data', $woocommerce, 'add_container_product_fields');
        $this->loader->add_action('woocommerce_process_product_meta', $woocommerce, 'save_container_product_fields');
    }

    /**
     * Initialize user roles.
     *
     * @since    1.0.0
     * @access   private
     */
    private function init_user_roles() {
        $user_roles = new Container_Leasing_User_Roles();
        $this->loader->add_action('init', $user_roles, 'register_user_roles');
    }

    /**
     * Run the loader to execute all of the hooks with WordPress.
     *
     * @since    1.0.0
     */
    public function run() {
        $this->loader->run();
    }

    /**
     * The name of the plugin used to uniquely identify it within the context of
     * WordPress and to define internationalization functionality.
     *
     * @since     1.0.0
     * @return    string    The name of the plugin.
     */
    public function get_plugin_name() {
        return $this->plugin_name;
    }

    /**
     * The reference to the class that orchestrates the hooks with the plugin.
     *
     * @since     1.0.0
     * @return    Container_Leasing_Loader    Orchestrates the hooks of the plugin.
     */
    public function get_loader() {
        return $this->loader;
    }

    /**
     * Retrieve the version number of the plugin.
     *
     * @since     1.0.0
     * @return    string    The version number of the plugin.
     */
    public function get_version() {
        return $this->version;
    }
}
