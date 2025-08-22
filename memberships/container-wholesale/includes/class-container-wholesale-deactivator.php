<?php
/**
 * Fired during plugin deactivation.
 *
 * @since      1.0.0
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes
 */

/**
 * Fired during plugin deactivation.
 *
 * This class defines all code necessary to run during the plugin's deactivation.
 *
 * @since      1.0.0
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes
 */
class Container_Leasing_Deactivator {

    /**
     * Deactivate the plugin.
     *
     * @since    1.0.0
     */
    public static function deactivate() {
        // Flush rewrite rules
        flush_rewrite_rules();
        
        // Remove custom user roles (optional)
        // self::remove_user_roles();
        
        // We don't remove tables or pages to prevent data loss
    }
    
    /**
     * Remove custom user roles.
     *
     * Note: This is commented out by default to prevent issues with
     * users assigned to these roles. Uncomment if needed.
     *
     * @since    1.0.0
     */
    /*
    private static function remove_user_roles() {
        remove_role('container_lessor');
        remove_role('container_lessee');
    }
    */
}
