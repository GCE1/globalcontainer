<?php
/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://example.com
 * @since      1.0.0
 *
 * @package    Container_Leasing
 * @subpackage Container_Leasing/admin/partials
 */
?>

<div class="wrap container-leasing-admin">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>
    
    <div class="container-leasing-admin-overview">
        <div class="container-leasing-admin-card">
            <h2><span class="dashicons dashicons-portfolio"></span> <?php _e('Container Overview', 'container-leasing'); ?></h2>
            
            <?php
            // Get container stats
            $container_count = wp_count_posts('container');
            $active_containers = new WP_Query(array(
                'post_type' => 'container',
                'meta_query' => array(
                    array(
                        'key' => '_container_status',
                        'value' => 'available',
                        'compare' => '='
                    )
                ),
                'posts_per_page' => -1
            ));
            $active_count = $active_containers->post_count;
            
            $leased_containers = new WP_Query(array(
                'post_type' => 'container',
                'meta_query' => array(
                    array(
                        'key' => '_container_status',
                        'value' => 'leased',
                        'compare' => '='
                    )
                ),
                'posts_per_page' => -1
            ));
            $leased_count = $leased_containers->post_count;
            ?>
            
            <div class="container-leasing-stats">
                <div class="container-leasing-stat-item">
                    <span class="container-leasing-stat-number"><?php echo esc_html($container_count->publish); ?></span>
                    <span class="container-leasing-stat-label"><?php _e('Total Containers', 'container-leasing'); ?></span>
                </div>
                <div class="container-leasing-stat-item">
                    <span class="container-leasing-stat-number"><?php echo esc_html($active_count); ?></span>
                    <span class="container-leasing-stat-label"><?php _e('Available', 'container-leasing'); ?></span>
                </div>
                <div class="container-leasing-stat-item">
                    <span class="container-leasing-stat-number"><?php echo esc_html($leased_count); ?></span>
                    <span class="container-leasing-stat-label"><?php _e('Currently Leased', 'container-leasing'); ?></span>
                </div>
            </div>
            
            <a href="<?php echo admin_url('edit.php?post_type=container'); ?>" class="button button-primary"><?php _e('Manage Containers', 'container-leasing'); ?></a>
        </div>
        
        <div class="container-leasing-admin-card">
            <h2><span class="dashicons dashicons-chart-line"></span> <?php _e('Leasing Activity', 'container-leasing'); ?></h2>
            
            <?php
            // Get some basic order stats
            $orders = wc_get_orders(array(
                'limit' => -1,
                'type' => 'shop_order',
                'status' => array('wc-completed', 'wc-processing'),
                'date_created' => '>' . date('Y-m-d', strtotime('-30 days'))
            ));
            
            $total_revenue = 0;
            foreach ($orders as $order) {
                $total_revenue += $order->get_total();
            }
            
            // Get contracts in last 30 days
            global $wpdb;
            $table_contract = $wpdb->prefix . 'container_contracts';
            $recent_contracts = $wpdb->get_var("
                SELECT COUNT(*) 
                FROM $table_contract 
                WHERE start_date >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            ");
            ?>
            
            <div class="container-leasing-stats">
                <div class="container-leasing-stat-item">
                    <span class="container-leasing-stat-number"><?php echo count($orders); ?></span>
                    <span class="container-leasing-stat-label"><?php _e('Orders (30 days)', 'container-leasing'); ?></span>
                </div>
                <div class="container-leasing-stat-item">
                    <span class="container-leasing-stat-number"><?php echo wc_price($total_revenue); ?></span>
                    <span class="container-leasing-stat-label"><?php _e('Revenue (30 days)', 'container-leasing'); ?></span>
                </div>
                <div class="container-leasing-stat-item">
                    <span class="container-leasing-stat-number"><?php echo esc_html($recent_contracts); ?></span>
                    <span class="container-leasing-stat-label"><?php _e('New Contracts (30 days)', 'container-leasing'); ?></span>
                </div>
            </div>
            
            <a href="<?php echo admin_url('admin.php?page=container-leasing-analytics'); ?>" class="button button-primary"><?php _e('View Analytics', 'container-leasing'); ?></a>
        </div>
    </div>
    
    <div class="container-leasing-admin-overview">
        <div class="container-leasing-admin-card">
            <h2><span class="dashicons dashicons-admin-tools"></span> <?php _e('Quick Actions', 'container-leasing'); ?></h2>
            
            <div class="container-leasing-quick-actions">
                <a href="<?php echo admin_url('post-new.php?post_type=container'); ?>" class="button">
                    <span class="dashicons dashicons-plus"></span> <?php _e('Add Container', 'container-leasing'); ?>
                </a>
                <a href="<?php echo admin_url('admin.php?page=container-leasing-csv'); ?>" class="button">
                    <span class="dashicons dashicons-media-spreadsheet"></span> <?php _e('Import/Export', 'container-leasing'); ?>
                </a>
                <a href="<?php echo admin_url('admin.php?page=container-leasing-settings'); ?>" class="button">
                    <span class="dashicons dashicons-admin-settings"></span> <?php _e('Settings', 'container-leasing'); ?>
                </a>
                <a href="<?php echo admin_url('admin.php?page=container-leasing-contracts'); ?>" class="button">
                    <span class="dashicons dashicons-media-document"></span> <?php _e('Contracts', 'container-leasing'); ?>
                </a>
            </div>
        </div>
        
        <div class="container-leasing-admin-card">
            <h2><span class="dashicons dashicons-info"></span> <?php _e('Plugin Information', 'container-leasing'); ?></h2>
            
            <p><strong><?php _e('Version:', 'container-leasing'); ?></strong> <?php echo CONTAINER_LEASING_VERSION; ?></p>
            <p><strong><?php _e('WooCommerce:', 'container-leasing'); ?></strong> 
                <?php 
                if (function_exists('WC')) {
                    echo WC()->version;
                } else {
                    echo '<span class="container-leasing-error">' . __('Not Active', 'container-leasing') . '</span>';
                }
                ?>
            </p>
            
            <p><?php _e('A comprehensive shipping container leasing platform with PayPal integration, custom insights dashboard, and CSV data management.', 'container-leasing'); ?></p>
            
            <p><?php _e('Need help? Check out the', 'container-leasing'); ?> 
            <a href="https://example.com/documentation" target="_blank"><?php _e('documentation', 'container-leasing'); ?></a>.</p>
        </div>
    </div>
    
    <?php
    // Recent activity
    global $wpdb;
    $table_contract = $wpdb->prefix . 'container_contracts';
    $recent_activity = $wpdb->get_results("
        SELECT * 
        FROM $table_contract 
        ORDER BY start_date DESC
        LIMIT 5
    ");
    
    if ($recent_activity) {
        echo '<div class="container-leasing-admin-card container-leasing-full-width">';
        echo '<h2><span class="dashicons dashicons-clipboard"></span> ' . __('Recent Contracts', 'container-leasing') . '</h2>';
        
        echo '<table class="wp-list-table widefat fixed striped">';
        echo '<thead>';
        echo '<tr>';
        echo '<th>' . __('ID', 'container-leasing') . '</th>';
        echo '<th>' . __('Container', 'container-leasing') . '</th>';
        echo '<th>' . __('Customer', 'container-leasing') . '</th>';
        echo '<th>' . __('Start Date', 'container-leasing') . '</th>';
        echo '<th>' . __('End Date', 'container-leasing') . '</th>';
        echo '<th>' . __('Status', 'container-leasing') . '</th>';
        echo '</tr>';
        echo '</thead>';
        echo '<tbody>';
        
        foreach ($recent_activity as $contract) {
            $container_name = get_the_title($contract->container_id);
            $user_info = get_userdata($contract->user_id);
            $username = $user_info ? $user_info->display_name : __('Unknown User', 'container-leasing');
            
            echo '<tr>';
            echo '<td>' . $contract->id . '</td>';
            echo '<td>' . esc_html($container_name) . '</td>';
            echo '<td>' . esc_html($username) . '</td>';
            echo '<td>' . date_i18n(get_option('date_format'), strtotime($contract->start_date)) . '</td>';
            echo '<td>' . date_i18n(get_option('date_format'), strtotime($contract->end_date)) . '</td>';
            echo '<td>' . esc_html($contract->status) . '</td>';
            echo '</tr>';
        }
        
        echo '</tbody>';
        echo '</table>';
        
        echo '<p><a href="' . admin_url('admin.php?page=container-leasing-contracts') . '" class="button">' . __('View All Contracts', 'container-leasing') . '</a></p>';
        echo '</div>';
    }
    ?>
</div>
