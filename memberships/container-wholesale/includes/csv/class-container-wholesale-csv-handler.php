<?php
/**
 * CSV handling functionality.
 *
 * @link       https://example.com
 * @since      1.0.0
 *
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes/csv
 */

/**
 * CSV handler class.
 *
 * This class handles CSV import and export functionality.
 *
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes/csv
 */
class Container_Leasing_CSV_Handler {

    /**
     * Process CSV import.
     *
     * @since    1.0.0
     * @param    string    $file    The path to the CSV file.
     * @return   int|WP_Error       Number of imported containers or error.
     */
    public function process_import($file) {
        if (!file_exists($file)) {
            return new WP_Error('file_not_found', __('CSV file not found.', 'container-leasing'));
        }
        
        $handle = fopen($file, 'r');
        
        if (!$handle) {
            return new WP_Error('file_open_failed', __('Could not open CSV file.', 'container-leasing'));
        }
        
        // Get the header row
        $header = fgetcsv($handle, 0);
        
        if (!$header) {
            fclose($handle);
            return new WP_Error('empty_file', __('CSV file is empty or invalid.', 'container-leasing'));
        }
        
        // Expected columns (case-insensitive)
        $expected_columns = array(
            'container name',
            'type',
            'size',
            'origin',
            'destination',
            'status',
            'price',
            'free days',
            'per diem rate'
        );
        
        // Normalize header columns for comparison
        $normalized_header = array_map(function($column) {
            return strtolower(trim($column));
        }, $header);
        
        // Check if all expected columns are present
        foreach ($expected_columns as $column) {
            if (!in_array($column, $normalized_header)) {
                fclose($handle);
                return new WP_Error(
                    'invalid_format',
                    sprintf(
                        __('CSV format is invalid. Missing column: %s', 'container-leasing'),
                        $column
                    )
                );
            }
        }
        
        // Get column indexes for each expected field
        $column_indexes = array();
        foreach ($expected_columns as $column) {
            $index = array_search($column, $normalized_header);
            $column_indexes[$column] = $index;
        }
        
        // Process data rows
        $imported_count = 0;
        $current_user_id = get_current_user_id();
        
        while (($data = fgetcsv($handle, 0)) !== false) {
            // Skip empty rows
            if (empty($data[0])) {
                continue;
            }
            
            // Extract container data
            $container_name = isset($data[$column_indexes['container name']]) ? sanitize_text_field($data[$column_indexes['container name']]) : '';
            $container_type = isset($data[$column_indexes['type']]) ? sanitize_text_field($data[$column_indexes['type']]) : '';
            $container_size = isset($data[$column_indexes['size']]) ? sanitize_text_field($data[$column_indexes['size']]) : '';
            $container_origin = isset($data[$column_indexes['origin']]) ? sanitize_text_field($data[$column_indexes['origin']]) : '';
            $container_destination = isset($data[$column_indexes['destination']]) ? sanitize_text_field($data[$column_indexes['destination']]) : '';
            $container_status = isset($data[$column_indexes['status']]) ? sanitize_text_field($data[$column_indexes['status']]) : 'available';
            $container_price = isset($data[$column_indexes['price']]) ? floatval($data[$column_indexes['price']]) : 0;
            $container_free_days = isset($data[$column_indexes['free days']]) ? intval($data[$column_indexes['free days']]) : 0;
            $container_per_diem = isset($data[$column_indexes['per diem rate']]) ? floatval($data[$column_indexes['per diem rate']]) : 0;
            
            // Validate required fields
            if (empty($container_name) || empty($container_type) || empty($container_size)) {
                continue;
            }
            
            // Create container post
            $container_data = array(
                'post_title' => $container_name,
                'post_status' => 'publish',
                'post_type' => 'container',
                'post_author' => $current_user_id,
            );
            
            $container_id = wp_insert_post($container_data);
            
            if (is_wp_error($container_id)) {
                continue;
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
            update_post_meta($container_id, '_container_user', $current_user_id);
            
            // Create WooCommerce product if WooCommerce is active
            if (function_exists('wc_get_product')) {
                $this->create_woocommerce_product($container_id, $container_name, $container_price);
            }
            
            $imported_count++;
        }
        
        fclose($handle);
        
        return $imported_count;
    }
    
    /**
     * Export containers to CSV.
     *
     * @since    1.0.0
     */
    public function export_csv() {
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.', 'container-leasing'));
        }
        
        // Verify nonce
        if (!isset($_POST['container_leasing_export_nonce']) || !wp_verify_nonce($_POST['container_leasing_export_nonce'], 'container_leasing_export_csv')) {
            wp_die(__('Security check failed.', 'container-leasing'));
        }
        
        // Get all container posts
        $args = array(
            'post_type' => 'container',
            'posts_per_page' => -1,
        );
        
        $containers = new WP_Query($args);
        
        if (!$containers->have_posts()) {
            wp_die(__('No containers found to export.', 'container-leasing'));
        }
        
        // Set headers for CSV download
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=containers_export_' . date('Y-m-d') . '.csv');
        
        $output = fopen('php://output', 'w');
        
        // Add CSV header
        fputcsv($output, array(
            'Container Name',
            'Type',
            'Size',
            'Origin',
            'Destination',
            'Status',
            'Price',
            'Free Days',
            'Per Diem Rate'
        ));
        
        // Add container data
        while ($containers->have_posts()) {
            $containers->the_post();
            $container_id = get_the_ID();
            
            fputcsv($output, array(
                get_the_title(),
                get_post_meta($container_id, '_container_type', true),
                get_post_meta($container_id, '_container_size', true),
                get_post_meta($container_id, '_container_origin', true),
                get_post_meta($container_id, '_container_destination', true),
                get_post_meta($container_id, '_container_status', true),
                get_post_meta($container_id, '_container_price', true),
                get_post_meta($container_id, '_container_free_days', true),
                get_post_meta($container_id, '_container_per_diem', true)
            ));
        }
        
        wp_reset_postdata();
        
        fclose($output);
        exit;
    }
    
    /**
     * Export contracts to CSV.
     *
     * @since    1.0.0
     */
    public function export_contracts_csv() {
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.', 'container-leasing'));
        }
        
        // Verify nonce
        if (!isset($_POST['container_leasing_export_contracts_nonce']) || !wp_verify_nonce($_POST['container_leasing_export_contracts_nonce'], 'container_leasing_export_contracts_csv')) {
            wp_die(__('Security check failed.', 'container-leasing'));
        }
        
        global $wpdb;
        $table_contract = $wpdb->prefix . 'container_contracts';
        
        // Get all contracts
        $contracts = $wpdb->get_results("SELECT * FROM $table_contract ORDER BY id DESC");
        
        if (!$contracts) {
            wp_die(__('No contracts found to export.', 'container-leasing'));
        }
        
        // Set headers for CSV download
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename=contracts_export_' . date('Y-m-d') . '.csv');
        
        $output = fopen('php://output', 'w');
        
        // Add CSV header
        fputcsv($output, array(
            'ID',
            'Order ID',
            'Container ID',
            'Container Name',
            'User ID',
            'User Name',
            'Start Date',
            'End Date',
            'Free Days',
            'Per Diem Rate',
            'Pickup Charge',
            'Status'
        ));
        
        // Add contract data
        foreach ($contracts as $contract) {
            $container_name = get_the_title($contract->container_id);
            $user_info = get_userdata($contract->user_id);
            $username = $user_info ? $user_info->display_name : __('Unknown User', 'container-leasing');
            
            fputcsv($output, array(
                $contract->id,
                $contract->order_id,
                $contract->container_id,
                $container_name,
                $contract->user_id,
                $username,
                $contract->start_date,
                $contract->end_date,
                $contract->free_days,
                $contract->per_diem_rate,
                $contract->pickup_charge,
                $contract->status
            ));
        }
        
        fclose($output);
        exit;
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
    
    /**
     * Import CSV from admin post action.
     *
     * @since    1.0.0
     */
    public function import_csv() {
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.', 'container-leasing'));
        }
        
        // Verify nonce
        if (!isset($_POST['container_leasing_csv_nonce']) || !wp_verify_nonce($_POST['container_leasing_csv_nonce'], 'container_leasing_import_csv')) {
            wp_die(__('Security check failed.', 'container-leasing'));
        }
        
        // Check if file was uploaded
        if (!isset($_FILES['container_csv_file']) || empty($_FILES['container_csv_file']['tmp_name'])) {
            wp_die(__('No file uploaded.', 'container-leasing'));
        }
        
        // Process import
        $result = $this->process_import($_FILES['container_csv_file']['tmp_name']);
        
        if (is_wp_error($result)) {
            wp_die($result->get_error_message());
        }
        
        // Redirect back with success message
        wp_redirect(add_query_arg(
            array(
                'page' => 'container-leasing-csv',
                'import' => 'success',
                'count' => $result
            ),
            admin_url('admin.php')
        ));
        exit;
    }
}
