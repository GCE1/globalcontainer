<?php
/**
 * The plugin bootstrap file
 *
 * @link              https://example.com
 * @since             1.0.0
 * @package           Container_Leasing
 *
 * @wordpress-plugin
 * Plugin Name:       Container Leasing Platform
 * Plugin URI:        https://example.com/container-leasing
 * Description:       A comprehensive shipping container leasing platform with PayPal integration, custom insights dashboard, and CSV data management.
 * Version:           1.0.0
 * Author:            Your Name
 * Author URI:        https://example.com
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       container-leasing
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

/**
 * Currently plugin version.
 */
define('CONTAINER_LEASING_VERSION', '1.0.0');
define('CONTAINER_LEASING_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('CONTAINER_LEASING_PLUGIN_URL', plugin_dir_url(__FILE__));

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-container-leasing-activator.php
 */
function activate_container_leasing() {
    require_once plugin_dir_path(__FILE__) . 'includes/class-container-leasing-activator.php';
    Container_Leasing_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-container-leasing-deactivator.php
 */
function deactivate_container_leasing() {
    require_once plugin_dir_path(__FILE__) . 'includes/class-container-leasing-deactivator.php';
    Container_Leasing_Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'activate_container_leasing');
register_deactivation_hook(__FILE__, 'deactivate_container_leasing');

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path(__FILE__) . 'includes/class-container-leasing.php';

/**
 * Begins execution of the plugin.
 *
 * @since    1.0.0
 */
function run_container_leasing() {
    $plugin = new Container_Leasing();
    $plugin->run();
}

// Check if WooCommerce is active
function container_leasing_check_woocommerce() {
    if (!is_plugin_active('woocommerce/woocommerce.php') && current_user_can('activate_plugins')) {
        add_action('admin_notices', 'container_leasing_woocommerce_notice');
    }
}
add_action('admin_init', 'container_leasing_check_woocommerce');

// Display notice if WooCommerce is not active
function container_leasing_woocommerce_notice() {
    ?>
    <div class="notice notice-error">
        <p><?php _e('Container Leasing Platform requires WooCommerce to be installed and activated.', 'container-leasing'); ?></p>
        <p>
            <a href="<?php echo esc_url(admin_url('plugin-install.php?tab=search&s=woocommerce')); ?>" class="button button-primary">
                <?php _e('Install WooCommerce', 'container-leasing'); ?>
            </a>
            <?php if (file_exists(WP_PLUGIN_DIR . '/woocommerce/woocommerce.php')) : ?>
                <a href="<?php echo wp_nonce_url(admin_url('plugins.php?action=activate&plugin=woocommerce/woocommerce.php'), 'activate-plugin_woocommerce/woocommerce.php'); ?>" class="button button-primary">
                    <?php _e('Activate WooCommerce', 'container-leasing'); ?>
                </a>
            <?php endif; ?>
        </p>
    </div>
    <?php
}

// Initialize the plugin
run_container_leasing();
