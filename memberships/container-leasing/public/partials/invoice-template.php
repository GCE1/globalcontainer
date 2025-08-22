<?php
/**
 * Template for the Invoice page.
 *
 * @link       https://example.com
 * @since      1.0.0
 *
 * @package    Container_Leasing
 * @subpackage Container_Leasing/public/partials
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
    die;
}

// Ensure user is logged in
if (!is_user_logged_in()) {
    wp_redirect(wp_login_url(get_permalink()));
    exit;
}

get_header();
?>

<div class="container-leasing-invoices-page">
    <div class="container-leasing-page-header">
        <h1><?php _e('Container Invoices', 'container-leasing'); ?></h1>
        <p><?php _e('Manage and download invoices for your container leases.', 'container-leasing'); ?></p>
    </div>
    
    <?php
    // Check if viewing a specific invoice
    $invoice_id = isset($_GET['invoice']) ? sanitize_text_field($_GET['invoice']) : '';
    
    if (!empty($invoice_id)) {
        // Get contract data
        global $wpdb;
        $table_contract = $wpdb->prefix . 'container_contracts';
        
        $contract_id = intval(str_replace('INV-', '', $invoice_id));
        $contract = $wpdb->get_row($wpdb->prepare("
            SELECT * FROM $table_contract WHERE id = %d
        ", $contract_id));
        
        if (!$contract) {
            echo '<div class="container-leasing-error">' . __('Invoice not found.', 'container-leasing') . '</div>';
        } elseif ($contract->user_id != get_current_user_id() && !current_user_can('administrator')) {
            echo '<div class="container-leasing-error">' . __('You do not have permission to view this invoice.', 'container-leasing') . '</div>';
        } else {
            // Get container data
            $container_name = get_the_title($contract->container_id);
            $container_type = get_post_meta($contract->container_id, '_container_type', true);
            $container_size = get_post_meta($contract->container_id, '_container_size', true);
            
            // Calculate days and charges
            $start_date = new DateTime($contract->start_date);
            $end_date = new DateTime($contract->end_date);
            $current_date = new DateTime();
            
            $days_used = $start_date->diff($current_date)->days;
            $extra_days = max(0, $days_used - $contract->free_days);
            $extra_charges = $extra_days * $contract->per_diem_rate;
            $total = $contract->pickup_charge + $extra_charges;
            
            // Get user info
            $user_info = get_userdata($contract->user_id);
            ?>
            
            <div class="container-leasing-invoice-detail" id="invoice-print-area">
                <div class="container-leasing-invoice-header">
                    <div class="container-leasing-invoice-company">
                        <h2><?php echo get_bloginfo('name'); ?></h2>
                        <p><?php echo get_bloginfo('description'); ?></p>
                    </div>
                    <div class="container-leasing-invoice-info">
                        <div class="container-leasing-invoice-number">
                            <h3><?php _e('Invoice', 'container-leasing'); ?> #<?php echo esc_html($invoice_id); ?></h3>
                            <p><?php _e('Date:', 'container-leasing'); ?> <?php echo date_i18n(get_option('date_format')); ?></p>
                        </div>
                    </div>
                </div>
                
                <div class="container-leasing-invoice-addresses">
                    <div class="container-leasing-invoice-from">
                        <h4><?php _e('From:', 'container-leasing'); ?></h4>
                        <p><?php echo get_bloginfo('name'); ?></p>
                        <p><?php echo get_option('woocommerce_store_address'); ?></p>
                        <p><?php echo get_option('woocommerce_store_city'); ?>, <?php echo get_option('woocommerce_default_country'); ?></p>
                        <p><?php echo get_option('woocommerce_store_postcode'); ?></p>
                    </div>
                    <div class="container-leasing-invoice-to">
                        <h4><?php _e('To:', 'container-leasing'); ?></h4>
                        <p><?php echo esc_html($user_info->display_name); ?></p>
                        <p><?php echo esc_html($user_info->user_email); ?></p>
                        <?php 
                        $billing_address = get_user_meta($contract->user_id, 'billing_address_1', true);
                        $billing_city = get_user_meta($contract->user_id, 'billing_city', true);
                        $billing_state = get_user_meta($contract->user_id, 'billing_state', true);
                        $billing_postcode = get_user_meta($contract->user_id, 'billing_postcode', true);
                        $billing_country = get_user_meta($contract->user_id, 'billing_country', true);
                        
                        if (!empty($billing_address)) {
                            echo '<p>' . esc_html($billing_address) . '</p>';
                        }
                        if (!empty($billing_city) || !empty($billing_state)) {
                            echo '<p>';
                            if (!empty($billing_city)) {
                                echo esc_html($billing_city);
                                if (!empty($billing_state)) echo ', ';
                            }
                            if (!empty($billing_state)) echo esc_html($billing_state);
                            echo '</p>';
                        }
                        if (!empty($billing_postcode)) {
                            echo '<p>' . esc_html($billing_postcode) . '</p>';
                        }
                        if (!empty($billing_country)) {
                            echo '<p>' . esc_html($billing_country) . '</p>';
                        }
                        ?>
                    </div>
                </div>
                
                <div class="container-leasing-invoice-details">
                    <h4><?php _e('Container Lease Details', 'container-leasing'); ?></h4>
                    <p><strong><?php _e('Container:', 'container-leasing'); ?></strong> <?php echo esc_html($container_name); ?> (<?php echo esc_html($container_type); ?>, <?php echo esc_html($container_size); ?>)</p>
                    <p><strong><?php _e('Lease Period:', 'container-leasing'); ?></strong> <?php echo date_i18n(get_option('date_format'), strtotime($contract->start_date)); ?> - <?php echo date_i18n(get_option('date_format'), strtotime($contract->end_date)); ?></p>
                    <p><strong><?php _e('Contract ID:', 'container-leasing'); ?></strong> <?php echo esc_html($contract->id); ?></p>
                    <p><strong><?php _e('Order ID:', 'container-leasing'); ?></strong> <?php echo esc_html($contract->order_id); ?></p>
                </div>
                
                <div class="container-leasing-invoice-items">
                    <table>
                        <thead>
                            <tr>
                                <th><?php _e('Description', 'container-leasing'); ?></th>
                                <th><?php _e('Quantity', 'container-leasing'); ?></th>
                                <th><?php _e('Unit Price', 'container-leasing'); ?></th>
                                <th><?php _e('Amount', 'container-leasing'); ?></th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><?php _e('Container Pickup Charge', 'container-leasing'); ?></td>
                                <td>1</td>
                                <td><?php echo wc_price($contract->pickup_charge); ?></td>
                                <td><?php echo wc_price($contract->pickup_charge); ?></td>
                            </tr>
                            <?php if ($extra_days > 0) : ?>
                            <tr>
                                <td><?php _e('Additional Days (beyond free days)', 'container-leasing'); ?></td>
                                <td><?php echo esc_html($extra_days); ?></td>
                                <td><?php echo wc_price($contract->per_diem_rate); ?></td>
                                <td><?php echo wc_price($extra_charges); ?></td>
                            </tr>
                            <?php endif; ?>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="3" class="container-leasing-invoice-total-label"><?php _e('Subtotal', 'container-leasing'); ?></td>
                                <td><?php echo wc_price($total); ?></td>
                            </tr>
                            <tr>
                                <td colspan="3" class="container-leasing-invoice-total-label"><?php _e('Tax', 'container-leasing'); ?></td>
                                <td><?php echo wc_price(0); ?></td>
                            </tr>
                            <tr>
                                <td colspan="3" class="container-leasing-invoice-total-label"><strong><?php _e('Total', 'container-leasing'); ?></strong></td>
                                <td><strong><?php echo wc_price($total); ?></strong></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                
                <div class="container-leasing-invoice-notes">
                    <h4><?php _e('Notes', 'container-leasing'); ?></h4>
                    <p><?php _e('Free Days: ', 'container-leasing'); echo esc_html($contract->free_days); ?> <?php _e('days', 'container-leasing'); ?></p>
                    <p><?php _e('Days Used: ', 'container-leasing'); echo esc_html($days_used); ?> <?php _e('days', 'container-leasing'); ?></p>
                    <p><?php _e('Per Diem Rate: ', 'container-leasing'); echo wc_price($contract->per_diem_rate); ?> <?php _e('per day after free days', 'container-leasing'); ?></p>
                    <p><?php _e('Thank you for your business!', 'container-leasing'); ?></p>
                </div>
            </div>
            
            <div class="container-leasing-invoice-actions">
                <a href="#" class="container-leasing-button container-leasing-print-invoice">
                    <i data-feather="printer"></i> <?php _e('Print Invoice', 'container-leasing'); ?>
                </a>
                <a href="#" class="container-leasing-button container-leasing-download-pdf" data-invoice="<?php echo esc_attr($invoice_id); ?>">
                    <i data-feather="download"></i> <?php _e('Download PDF', 'container-leasing'); ?>
                </a>
                <a href="<?php echo get_permalink(); ?>" class="container-leasing-button container-leasing-button-outline">
                    <i data-feather="arrow-left"></i> <?php _e('Back to Invoices', 'container-leasing'); ?>
                </a>
            </div>
            
            <?php
        }
    } else {
        // Display list of invoices
        ?>
        <div class="container-leasing-invoices-wrapper">
            <div class="container-leasing-invoices-list">
                <table>
                    <thead>
                        <tr>
                            <th><?php _e('Invoice ID', 'container-leasing'); ?></th>
                            <th><?php _e('Container', 'container-leasing'); ?></th>
                            <th><?php _e('Date', 'container-leasing'); ?></th>
                            <th><?php _e('Start Date', 'container-leasing'); ?></th>
                            <th><?php _e('End Date', 'container-leasing'); ?></th>
                            <th><?php _e('Total', 'container-leasing'); ?></th>
                            <th><?php _e('Status', 'container-leasing'); ?></th>
                            <th><?php _e('Actions', 'container-leasing'); ?></th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php
                        // Get user's contracts
                        global $wpdb;
                        $table_contract = $wpdb->prefix . 'container_contracts';
                        $user_id = get_current_user_id();
                        
                        $contracts = $wpdb->get_results($wpdb->prepare(
                            "SELECT * FROM $table_contract WHERE user_id = %d ORDER BY start_date DESC",
                            $user_id
                        ));
                        
                        if ($contracts) {
                            foreach ($contracts as $contract) {
                                $container_name = get_the_title($contract->container_id);
                                $invoice_id = 'INV-' . $contract->id . '-' . date('Ymd', strtotime($contract->start_date));
                                
                                // Calculate total based on current date
                                $start_date = new DateTime($contract->start_date);
                                $current_date = new DateTime();
                                $days_used = $start_date->diff($current_date)->days;
                                $extra_days = max(0, $days_used - $contract->free_days);
                                $extra_charges = $extra_days * $contract->per_diem_rate;
                                $total = $contract->pickup_charge + $extra_charges;
                                ?>
                                <tr>
                                    <td><?php echo esc_html($invoice_id); ?></td>
                                    <td><?php echo esc_html($container_name); ?></td>
                                    <td><?php echo date_i18n(get_option('date_format')); ?></td>
                                    <td><?php echo date_i18n(get_option('date_format'), strtotime($contract->start_date)); ?></td>
                                    <td><?php echo date_i18n(get_option('date_format'), strtotime($contract->end_date)); ?></td>
                                    <td><?php echo wc_price($total); ?></td>
                                    <td><?php echo esc_html($contract->status); ?></td>
                                    <td>
                                        <a href="<?php echo add_query_arg('invoice', $invoice_id, get_permalink()); ?>" class="container-leasing-button container-leasing-button-small">
                                            <i data-feather="eye"></i> <?php _e('View', 'container-leasing'); ?>
                                        </a>
                                    </td>
                                </tr>
                                <?php
                            }
                        } else {
                            ?>
                            <tr>
                                <td colspan="8" class="container-leasing-no-items">
                                    <?php _e('No invoices found. Invoices will appear here once you lease a container.', 'container-leasing'); ?>
                                </td>
                            </tr>
                            <?php
                        }
                        ?>
                    </tbody>
                </table>
            </div>
        </div>
        <?php
    }
    ?>
</div>

<?php get_footer(); ?>

<style>
    .container-leasing-invoices-page {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
    }
    
    .container-leasing-page-header {
        margin-bottom: 30px;
    }
    
    .container-leasing-page-header h1 {
        font-size: 32px;
        margin-bottom: 10px;
    }
    
    .container-leasing-invoices-list table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
    }
    
    .container-leasing-invoices-list th, 
    .container-leasing-invoices-list td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .container-leasing-invoices-list th {
        background-color: #f8f9fa;
        font-weight: 600;
    }
    
    .container-leasing-invoices-list tr:hover {
        background-color: #f8f9fa;
    }
    
    .container-leasing-no-items {
        text-align: center;
        padding: 30px !important;
        color: #666;
    }
    
    .container-leasing-invoice-detail {
        background-color: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        padding: 25px;
        margin-bottom: 30px;
    }
    
    .container-leasing-invoice-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
    }
    
    .container-leasing-invoice-company h2 {
        margin-top: 0;
        margin-bottom: 5px;
    }
    
    .container-leasing-invoice-company p {
        margin-top: 0;
        color: #666;
    }
    
    .container-leasing-invoice-number h3 {
        margin-top: 0;
        margin-bottom: 5px;
        text-align: right;
    }
    
    .container-leasing-invoice-number p {
        margin-top: 0;
        text-align: right;
        color: #666;
    }
    
    .container-leasing-invoice-addresses {
        display: flex;
        justify-content: space-between;
        margin-bottom: 30px;
    }
    
    .container-leasing-invoice-from,
    .container-leasing-invoice-to {
        flex: 1;
    }
    
    .container-leasing-invoice-to {
        text-align: right;
    }
    
    .container-leasing-invoice-addresses h4 {
        margin-top: 0;
        margin-bottom: 10px;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 5px;
    }
    
    .container-leasing-invoice-addresses p {
        margin: 5px 0;
    }
    
    .container-leasing-invoice-details {
        margin-bottom: 30px;
    }
    
    .container-leasing-invoice-details h4 {
        margin-top: 0;
        margin-bottom: 15px;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 5px;
    }
    
    .container-leasing-invoice-details p {
        margin: 8px 0;
    }
    
    .container-leasing-invoice-items table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 30px;
    }
    
    .container-leasing-invoice-items th,
    .container-leasing-invoice-items td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .container-leasing-invoice-items th {
        background-color: #f8f9fa;
        font-weight: 600;
    }
    
    .container-leasing-invoice-items tfoot td {
        border-top: 2px solid #e0e0e0;
        border-bottom: none;
    }
    
    .container-leasing-invoice-total-label {
        text-align: right;
        font-weight: 500;
    }
    
    .container-leasing-invoice-notes {
        margin-top: 30px;
    }
    
    .container-leasing-invoice-notes h4 {
        margin-top: 0;
        margin-bottom: 15px;
        border-bottom: 1px solid #e0e0e0;
        padding-bottom: 5px;
    }
    
    .container-leasing-invoice-actions {
        display: flex;
        gap: 10px;
        margin-bottom: 30px;
    }
    
    /* Print styles */
    @media print {
        body * {
            visibility: hidden;
        }
        #invoice-print-area, #invoice-print-area * {
            visibility: visible;
        }
        #invoice-print-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            padding: 15px;
        }
        .container-leasing-invoice-actions {
            display: none;
        }
    }
    
    @media (max-width: 768px) {
        .container-leasing-invoice-header,
        .container-leasing-invoice-addresses {
            flex-direction: column;
        }
        
        .container-leasing-invoice-to {
            text-align: left;
            margin-top: 20px;
        }
        
        .container-leasing-invoice-number h3,
        .container-leasing-invoice-number p {
            text-align: left;
            margin-top: 20px;
        }
    }
</style>
