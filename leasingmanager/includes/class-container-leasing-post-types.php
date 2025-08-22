<?php
/**
 * Custom post types for the Container Leasing plugin.
 *
 * @link       https://example.com
 * @since      1.0.0
 *
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes
 */

/**
 * Custom post types for the Container Leasing plugin.
 *
 * This class defines all the custom post types and taxonomies needed for the plugin.
 *
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes
 */
class Container_Leasing_Post_Types {

    /**
     * Register custom post types.
     *
     * @since    1.0.0
     */
    public function register_post_types() {
        // Container post type
        $labels = array(
            'name'                  => _x('Containers', 'Post type general name', 'container-leasing'),
            'singular_name'         => _x('Container', 'Post type singular name', 'container-leasing'),
            'menu_name'             => _x('Containers', 'Admin Menu text', 'container-leasing'),
            'name_admin_bar'        => _x('Container', 'Add New on Toolbar', 'container-leasing'),
            'add_new'               => __('Add New', 'container-leasing'),
            'add_new_item'          => __('Add New Container', 'container-leasing'),
            'new_item'              => __('New Container', 'container-leasing'),
            'edit_item'             => __('Edit Container', 'container-leasing'),
            'view_item'             => __('View Container', 'container-leasing'),
            'all_items'             => __('All Containers', 'container-leasing'),
            'search_items'          => __('Search Containers', 'container-leasing'),
            'parent_item_colon'     => __('Parent Containers:', 'container-leasing'),
            'not_found'             => __('No containers found.', 'container-leasing'),
            'not_found_in_trash'    => __('No containers found in Trash.', 'container-leasing'),
            'featured_image'        => _x('Container Image', 'Overrides the "Featured Image" phrase', 'container-leasing'),
            'set_featured_image'    => _x('Set container image', 'Overrides the "Set featured image" phrase', 'container-leasing'),
            'remove_featured_image' => _x('Remove container image', 'Overrides the "Remove featured image" phrase', 'container-leasing'),
            'use_featured_image'    => _x('Use as container image', 'Overrides the "Use as featured image" phrase', 'container-leasing'),
            'archives'              => _x('Container archives', 'The post type archive label used in nav menus', 'container-leasing'),
            'insert_into_item'      => _x('Insert into container', 'Overrides the "Insert into post" phrase', 'container-leasing'),
            'uploaded_to_this_item' => _x('Uploaded to this container', 'Overrides the "Uploaded to this post" phrase', 'container-leasing'),
            'filter_items_list'     => _x('Filter containers list', 'Screen reader text for the filter links heading on the post type listing screen', 'container-leasing'),
            'items_list_navigation' => _x('Containers list navigation', 'Screen reader text for the pagination heading on the post type listing screen', 'container-leasing'),
            'items_list'            => _x('Containers list', 'Screen reader text for the items list heading on the post type listing screen', 'container-leasing'),
        );
        
        $args = array(
            'labels'             => $labels,
            'public'             => true,
            'publicly_queryable' => true,
            'show_ui'            => true,
            'show_in_menu'       => true,
            'query_var'          => true,
            'rewrite'            => array('slug' => 'container'),
            'capability_type'    => 'post',
            'has_archive'        => true,
            'hierarchical'       => false,
            'menu_position'      => null,
            'menu_icon'          => 'dashicons-portfolio',
            'supports'           => array('title', 'editor', 'thumbnail', 'custom-fields'),
        );
        
        register_post_type('container', $args);
        
        // Contract post type
        $labels = array(
            'name'                  => _x('Contracts', 'Post type general name', 'container-leasing'),
            'singular_name'         => _x('Contract', 'Post type singular name', 'container-leasing'),
            'menu_name'             => _x('Contracts', 'Admin Menu text', 'container-leasing'),
            'name_admin_bar'        => _x('Contract', 'Add New on Toolbar', 'container-leasing'),
            'add_new'               => __('Add New', 'container-leasing'),
            'add_new_item'          => __('Add New Contract', 'container-leasing'),
            'new_item'              => __('New Contract', 'container-leasing'),
            'edit_item'             => __('Edit Contract', 'container-leasing'),
            'view_item'             => __('View Contract', 'container-leasing'),
            'all_items'             => __('All Contracts', 'container-leasing'),
            'search_items'          => __('Search Contracts', 'container-leasing'),
            'parent_item_colon'     => __('Parent Contracts:', 'container-leasing'),
            'not_found'             => __('No contracts found.', 'container-leasing'),
            'not_found_in_trash'    => __('No contracts found in Trash.', 'container-leasing'),
        );
        
        $args = array(
            'labels'             => $labels,
            'public'             => false,
            'publicly_queryable' => false,
            'show_ui'            => true,
            'show_in_menu'       => 'container-leasing',
            'query_var'          => true,
            'rewrite'            => array('slug' => 'contract'),
            'capability_type'    => 'post',
            'has_archive'        => false,
            'hierarchical'       => false,
            'menu_position'      => null,
            'supports'           => array('title', 'custom-fields'),
        );
        
        register_post_type('container_contract', $args);
    }
    
    /**
     * Register custom taxonomies.
     *
     * @since    1.0.0
     */
    public function register_taxonomies() {
        // Container Type Taxonomy
        $labels = array(
            'name'              => _x('Container Types', 'taxonomy general name', 'container-leasing'),
            'singular_name'     => _x('Container Type', 'taxonomy singular name', 'container-leasing'),
            'search_items'      => __('Search Container Types', 'container-leasing'),
            'all_items'         => __('All Container Types', 'container-leasing'),
            'parent_item'       => __('Parent Container Type', 'container-leasing'),
            'parent_item_colon' => __('Parent Container Type:', 'container-leasing'),
            'edit_item'         => __('Edit Container Type', 'container-leasing'),
            'update_item'       => __('Update Container Type', 'container-leasing'),
            'add_new_item'      => __('Add New Container Type', 'container-leasing'),
            'new_item_name'     => __('New Container Type Name', 'container-leasing'),
            'menu_name'         => __('Container Types', 'container-leasing'),
        );

        $args = array(
            'hierarchical'      => true,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'container-type'),
        );

        register_taxonomy('container_type', array('container'), $args);
        
        // Container Size Taxonomy
        $labels = array(
            'name'              => _x('Container Sizes', 'taxonomy general name', 'container-leasing'),
            'singular_name'     => _x('Container Size', 'taxonomy singular name', 'container-leasing'),
            'search_items'      => __('Search Container Sizes', 'container-leasing'),
            'all_items'         => __('All Container Sizes', 'container-leasing'),
            'parent_item'       => __('Parent Container Size', 'container-leasing'),
            'parent_item_colon' => __('Parent Container Size:', 'container-leasing'),
            'edit_item'         => __('Edit Container Size', 'container-leasing'),
            'update_item'       => __('Update Container Size', 'container-leasing'),
            'add_new_item'      => __('Add New Container Size', 'container-leasing'),
            'new_item_name'     => __('New Container Size Name', 'container-leasing'),
            'menu_name'         => __('Container Sizes', 'container-leasing'),
        );

        $args = array(
            'hierarchical'      => true,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'container-size'),
        );

        register_taxonomy('container_size', array('container'), $args);
        
        // Container Status Taxonomy
        $labels = array(
            'name'              => _x('Container Statuses', 'taxonomy general name', 'container-leasing'),
            'singular_name'     => _x('Container Status', 'taxonomy singular name', 'container-leasing'),
            'search_items'      => __('Search Container Statuses', 'container-leasing'),
            'all_items'         => __('All Container Statuses', 'container-leasing'),
            'parent_item'       => __('Parent Container Status', 'container-leasing'),
            'parent_item_colon' => __('Parent Container Status:', 'container-leasing'),
            'edit_item'         => __('Edit Container Status', 'container-leasing'),
            'update_item'       => __('Update Container Status', 'container-leasing'),
            'add_new_item'      => __('Add New Container Status', 'container-leasing'),
            'new_item_name'     => __('New Container Status Name', 'container-leasing'),
            'menu_name'         => __('Container Statuses', 'container-leasing'),
        );

        $args = array(
            'hierarchical'      => true,
            'labels'            => $labels,
            'show_ui'           => true,
            'show_admin_column' => true,
            'query_var'         => true,
            'rewrite'           => array('slug' => 'container-status'),
        );

        register_taxonomy('container_status', array('container'), $args);
        
        // Create default terms for taxonomies
        $this->create_default_terms();
    }
    
    /**
     * Create default terms for container taxonomies.
     *
     * @since    1.0.0
     */
    private function create_default_terms() {
        // Default container types
        $default_types = array(
            'dry' => __('Dry', 'container-leasing'),
            'refrigerated' => __('Refrigerated', 'container-leasing'),
            'open-top' => __('Open Top', 'container-leasing'),
            'flat-rack' => __('Flat Rack', 'container-leasing'),
            'tank' => __('Tank', 'container-leasing'),
        );
        
        foreach ($default_types as $slug => $name) {
            if (!term_exists($name, 'container_type')) {
                wp_insert_term($name, 'container_type', array('slug' => $slug));
            }
        }
        
        // Default container sizes
        $default_sizes = array(
            '20ft' => __('20ft', 'container-leasing'),
            '40ft' => __('40ft', 'container-leasing'),
            '45ft' => __('45ft', 'container-leasing'),
        );
        
        foreach ($default_sizes as $slug => $name) {
            if (!term_exists($name, 'container_size')) {
                wp_insert_term($name, 'container_size', array('slug' => $slug));
            }
        }
        
        // Default container statuses
        $default_statuses = array(
            'available' => __('Available', 'container-leasing'),
            'leased' => __('Leased', 'container-leasing'),
            'maintenance' => __('Maintenance', 'container-leasing'),
        );
        
        foreach ($default_statuses as $slug => $name) {
            if (!term_exists($name, 'container_status')) {
                wp_insert_term($name, 'container_status', array('slug' => $slug));
            }
        }
    }
    
    /**
     * Add custom meta boxes for container post type.
     *
     * @since    1.0.0
     */
    public function add_container_meta_boxes() {
        // Container details meta box
        add_meta_box(
            'container_details_meta_box',
            __('Container Details', 'container-leasing'),
            array($this, 'render_container_details_meta_box'),
            'container',
            'normal',
            'high'
        );
        
        // Container pricing meta box
        add_meta_box(
            'container_pricing_meta_box',
            __('Container Pricing', 'container-leasing'),
            array($this, 'render_container_pricing_meta_box'),
            'container',
            'normal',
            'high'
        );
        
        // Container location meta box
        add_meta_box(
            'container_location_meta_box',
            __('Container Location', 'container-leasing'),
            array($this, 'render_container_location_meta_box'),
            'container',
            'normal',
            'high'
        );
    }
    
    /**
     * Render container details meta box.
     *
     * @since    1.0.0
     * @param    WP_Post    $post    The post object.
     */
    public function render_container_details_meta_box($post) {
        // Get saved meta data
        $container_type = get_post_meta($post->ID, '_container_type', true);
        $container_size = get_post_meta($post->ID, '_container_size', true);
        $container_status = get_post_meta($post->ID, '_container_status', true);
        
        // Add nonce for security
        wp_nonce_field('container_leasing_meta_box', 'container_leasing_meta_box_nonce');
        
        ?>
        <table class="form-table">
            <tr>
                <th scope="row">
                    <label for="container_type"><?php _e('Container Type', 'container-leasing'); ?></label>
                </th>
                <td>
                    <select name="container_type" id="container_type">
                        <option value=""><?php _e('Select Type', 'container-leasing'); ?></option>
                        <option value="dry" <?php selected($container_type, 'dry'); ?>><?php _e('Dry', 'container-leasing'); ?></option>
                        <option value="refrigerated" <?php selected($container_type, 'refrigerated'); ?>><?php _e('Refrigerated', 'container-leasing'); ?></option>
                        <option value="open-top" <?php selected($container_type, 'open-top'); ?>><?php _e('Open Top', 'container-leasing'); ?></option>
                        <option value="flat-rack" <?php selected($container_type, 'flat-rack'); ?>><?php _e('Flat Rack', 'container-leasing'); ?></option>
                        <option value="tank" <?php selected($container_type, 'tank'); ?>><?php _e('Tank', 'container-leasing'); ?></option>
                    </select>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label for="container_size"><?php _e('Container Size', 'container-leasing'); ?></label>
                </th>
                <td>
                    <select name="container_size" id="container_size">
                        <option value=""><?php _e('Select Size', 'container-leasing'); ?></option>
                        <option value="20ft" <?php selected($container_size, '20ft'); ?>><?php _e('20ft', 'container-leasing'); ?></option>
                        <option value="40ft" <?php selected($container_size, '40ft'); ?>><?php _e('40ft', 'container-leasing'); ?></option>
                        <option value="45ft" <?php selected($container_size, '45ft'); ?>><?php _e('45ft', 'container-leasing'); ?></option>
                    </select>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label for="container_status"><?php _e('Container Status', 'container-leasing'); ?></label>
                </th>
                <td>
                    <select name="container_status" id="container_status">
                        <option value="available" <?php selected($container_status, 'available'); ?>><?php _e('Available', 'container-leasing'); ?></option>
                        <option value="leased" <?php selected($container_status, 'leased'); ?>><?php _e('Leased', 'container-leasing'); ?></option>
                        <option value="maintenance" <?php selected($container_status, 'maintenance'); ?>><?php _e('Maintenance', 'container-leasing'); ?></option>
                    </select>
                </td>
            </tr>
        </table>
        <?php
    }
    
    /**
     * Render container pricing meta box.
     *
     * @since    1.0.0
     * @param    WP_Post    $post    The post object.
     */
    public function render_container_pricing_meta_box($post) {
        // Get saved meta data
        $container_price = get_post_meta($post->ID, '_container_price', true);
        $container_free_days = get_post_meta($post->ID, '_container_free_days', true);
        $container_per_diem = get_post_meta($post->ID, '_container_per_diem', true);
        
        // Set defaults if empty
        $container_price = !empty($container_price) ? $container_price : get_option('container_leasing_default_pickup_charge', 200);
        $container_free_days = !empty($container_free_days) ? $container_free_days : get_option('container_leasing_default_free_days', 5);
        $container_per_diem = !empty($container_per_diem) ? $container_per_diem : get_option('container_leasing_default_per_diem', 25);
        
        ?>
        <table class="form-table">
            <tr>
                <th scope="row">
                    <label for="container_price"><?php _e('Pickup Charge (Base Price)', 'container-leasing'); ?></label>
                </th>
                <td>
                    <input type="number" name="container_price" id="container_price" value="<?php echo esc_attr($container_price); ?>" step="0.01" min="0" class="regular-text">
                    <p class="description"><?php _e('Initial charge for the container lease.', 'container-leasing'); ?></p>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label for="container_free_days"><?php _e('Free Days', 'container-leasing'); ?></label>
                </th>
                <td>
                    <input type="number" name="container_free_days" id="container_free_days" value="<?php echo esc_attr($container_free_days); ?>" min="0" class="regular-text">
                    <p class="description"><?php _e('Number of days included in the base price before per diem charges apply.', 'container-leasing'); ?></p>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label for="container_per_diem"><?php _e('Per Diem Rate', 'container-leasing'); ?></label>
                </th>
                <td>
                    <input type="number" name="container_per_diem" id="container_per_diem" value="<?php echo esc_attr($container_per_diem); ?>" step="0.01" min="0" class="regular-text">
                    <p class="description"><?php _e('Daily rate charged after free days are used.', 'container-leasing'); ?></p>
                </td>
            </tr>
        </table>
        <?php
    }
    
    /**
     * Render container location meta box.
     *
     * @since    1.0.0
     * @param    WP_Post    $post    The post object.
     */
    public function render_container_location_meta_box($post) {
        // Get saved meta data
        $container_origin = get_post_meta($post->ID, '_container_origin', true);
        $container_destination = get_post_meta($post->ID, '_container_destination', true);
        
        ?>
        <table class="form-table">
            <tr>
                <th scope="row">
                    <label for="container_origin"><?php _e('Origin Location', 'container-leasing'); ?></label>
                </th>
                <td>
                    <input type="text" name="container_origin" id="container_origin" value="<?php echo esc_attr($container_origin); ?>" class="regular-text">
                    <p class="description"><?php _e('Where the container is currently located (e.g., Los Angeles, CA).', 'container-leasing'); ?></p>
                </td>
            </tr>
            <tr>
                <th scope="row">
                    <label for="container_destination"><?php _e('Destination Location', 'container-leasing'); ?></label>
                </th>
                <td>
                    <input type="text" name="container_destination" id="container_destination" value="<?php echo esc_attr($container_destination); ?>" class="regular-text">
                    <p class="description"><?php _e('Where the container is headed (e.g., New York, NY).', 'container-leasing'); ?></p>
                </td>
            </tr>
        </table>
        <?php
    }
    
    /**
     * Save container meta box data.
     *
     * @since    1.0.0
     * @param    int       $post_id    The post ID.
     * @param    WP_Post   $post       The post object.
     */
    public function save_container_meta_box_data($post_id, $post) {
        // Check if our nonce is set
        if (!isset($_POST['container_leasing_meta_box_nonce'])) {
            return;
        }
        
        // Verify that the nonce is valid
        if (!wp_verify_nonce($_POST['container_leasing_meta_box_nonce'], 'container_leasing_meta_box')) {
            return;
        }
        
        // If this is an autosave, our form has not been submitted, so we don't want to do anything
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }
        
        // Check the user's permissions
        if (isset($_POST['post_type']) && 'container' == $_POST['post_type']) {
            if (!current_user_can('edit_post', $post_id)) {
                return;
            }
        }
        
        // Save container type
        if (isset($_POST['container_type'])) {
            update_post_meta($post_id, '_container_type', sanitize_text_field($_POST['container_type']));
        }
        
        // Save container size
        if (isset($_POST['container_size'])) {
            update_post_meta($post_id, '_container_size', sanitize_text_field($_POST['container_size']));
        }
        
        // Save container status
        if (isset($_POST['container_status'])) {
            update_post_meta($post_id, '_container_status', sanitize_text_field($_POST['container_status']));
        }
        
        // Save container price
        if (isset($_POST['container_price'])) {
            update_post_meta($post_id, '_container_price', floatval($_POST['container_price']));
        }
        
        // Save container free days
        if (isset($_POST['container_free_days'])) {
            update_post_meta($post_id, '_container_free_days', intval($_POST['container_free_days']));
        }
        
        // Save container per diem rate
        if (isset($_POST['container_per_diem'])) {
            update_post_meta($post_id, '_container_per_diem', floatval($_POST['container_per_diem']));
        }
        
        // Save container origin
        if (isset($_POST['container_origin'])) {
            update_post_meta($post_id, '_container_origin', sanitize_text_field($_POST['container_origin']));
        }
        
        // Save container destination
        if (isset($_POST['container_destination'])) {
            update_post_meta($post_id, '_container_destination', sanitize_text_field($_POST['container_destination']));
        }
        
        // Set the container user if not already set
        $container_user = get_post_meta($post_id, '_container_user', true);
        if (empty($container_user)) {
            update_post_meta($post_id, '_container_user', get_current_user_id());
        }
        
        // Create or update WooCommerce product if WooCommerce is active
        if (function_exists('wc_get_product')) {
            $this->create_woocommerce_product($post_id, $post->post_title, floatval($_POST['container_price']));
        }
    }
    
    /**
     * Create a WooCommerce product for a container.
     *
     * @since    1.0.0
     * @param    int       $container_id     The container post ID.
     * @param    string    $container_name   The container name.
     * @param    float     $container_price  The container price.
     */
    private function create_woocommerce_product($container_id, $container_name, $container_price) {
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
                __('Type: %s, Size: %s', 'container-leasing'),
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
}
