<?php
/**
 * Define the internationalization functionality.
 *
 * @link       https://example.com
 * @since      1.0.0
 *
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes
 */
class Container_Leasing_i18n {

    /**
     * Load the plugin text domain for translation.
     *
     * @since    1.0.0
     */
    public function load_plugin_textdomain() {
        load_plugin_textdomain(
            'container-leasing',
            false,
            dirname(dirname(plugin_basename(__FILE__))) . '/languages/'
        );
    }
}
