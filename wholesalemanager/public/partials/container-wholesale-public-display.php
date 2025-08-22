<?php
/**
 * Provide a public-facing view for the plugin
 *
 * This file is used to markup the public-facing aspects of the plugin.
 *
 * @link       https://example.com
 * @since      1.0.0
 *
 * @package    Container_Leasing
 * @subpackage Container_Leasing/public/partials
 */
?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->
<div class="container-leasing-public-wrapper">
    <div class="container-leasing-section">
        <h2><?php _e('Container Leasing', 'container-leasing'); ?></h2>
        <p><?php _e('Welcome to our container leasing platform. Browse available containers or manage your existing leases.', 'container-leasing'); ?></p>
        
        <div class="container-leasing-actions">
            <a href="<?php echo get_permalink(get_option('container_leasing_dashboard_page_id')); ?>" class="container-leasing-button">
                <i data-feather="grid"></i> <?php _e('Dashboard', 'container-leasing'); ?>
            </a>
            <a href="<?php echo get_permalink(get_option('container_leasing_management_page_id')); ?>" class="container-leasing-button">
                <i data-feather="package"></i> <?php _e('Manage Containers', 'container-leasing'); ?>
            </a>
            <a href="<?php echo get_permalink(get_option('container_leasing_insights_page_id')); ?>" class="container-leasing-button">
                <i data-feather="bar-chart-2"></i> <?php _e('Insights', 'container-leasing'); ?>
            </a>
            <a href="<?php echo get_permalink(get_option('container_leasing_invoices_page_id')); ?>" class="container-leasing-button">
                <i data-feather="file-text"></i> <?php _e('Invoices', 'container-leasing'); ?>
            </a>
        </div>
    </div>
    
    <div class="container-leasing-section">
        <h2><?php _e('Available Containers', 'container-leasing'); ?></h2>
        
        <?php
        // Query available containers
        $args = array(
            'post_type' => 'container',
            'posts_per_page' => 6,
            'meta_query' => array(
                array(
                    'key' => '_container_status',
                    'value' => 'available',
                    'compare' => '='
                )
            )
        );
        
        $containers = new WP_Query($args);
        
        if ($containers->have_posts()) :
        ?>
            <div class="container-leasing-grid">
                <?php while ($containers->have_posts()) : $containers->the_post(); 
                    $container_id = get_the_ID();
                    $container_type = get_post_meta($container_id, '_container_type', true);
                    $container_size = get_post_meta($container_id, '_container_size', true);
                    $container_origin = get_post_meta($container_id, '_container_origin', true);
                    $container_destination = get_post_meta($container_id, '_container_destination', true);
                    $container_price = get_post_meta($container_id, '_container_price', true);
                    $product_id = get_post_meta($container_id, '_container_product_id', true);
                ?>
                    <div class="container-leasing-item">
                        <h3><?php the_title(); ?></h3>
                        <div class="container-leasing-item-details">
                            <div class="container-leasing-item-spec">
                                <span><?php _e('Type:', 'container-leasing'); ?></span> <?php echo esc_html($container_type); ?>
                            </div>
                            <div class="container-leasing-item-spec">
                                <span><?php _e('Size:', 'container-leasing'); ?></span> <?php echo esc_html($container_size); ?>
                            </div>
                            <?php if (!empty($container_origin)) : ?>
                                <div class="container-leasing-item-spec">
                                    <span><?php _e('Origin:', 'container-leasing'); ?></span> <?php echo esc_html($container_origin); ?>
                                </div>
                            <?php endif; ?>
                            <?php if (!empty($container_destination)) : ?>
                                <div class="container-leasing-item-spec">
                                    <span><?php _e('Destination:', 'container-leasing'); ?></span> <?php echo esc_html($container_destination); ?>
                                </div>
                            <?php endif; ?>
                            <div class="container-leasing-item-price">
                                <?php echo wc_price($container_price); ?>
                            </div>
                        </div>
                        <div class="container-leasing-item-actions">
                            <a href="<?php the_permalink(); ?>" class="container-leasing-button container-leasing-button-small">
                                <?php _e('Details', 'container-leasing'); ?>
                            </a>
                            <?php if ($product_id && function_exists('wc_get_product')) : ?>
                                <a href="<?php echo esc_url(add_query_arg('add-to-cart', $product_id, wc_get_cart_url())); ?>" class="container-leasing-button container-leasing-button-small container-leasing-button-primary">
                                    <?php _e('Lease Now', 'container-leasing'); ?>
                                </a>
                            <?php endif; ?>
                        </div>
                    </div>
                <?php endwhile; ?>
            </div>
            
            <div class="container-leasing-view-all">
                <a href="<?php echo get_post_type_archive_link('container'); ?>" class="container-leasing-button container-leasing-button-outline">
                    <?php _e('View All Containers', 'container-leasing'); ?>
                </a>
            </div>
        <?php
        else :
        ?>
            <p><?php _e('No containers available at the moment.', 'container-leasing'); ?></p>
        <?php
        endif;
        wp_reset_postdata();
        ?>
    </div>
    
    <div class="container-leasing-section">
        <h2><?php _e('How It Works', 'container-leasing'); ?></h2>
        
        <div class="container-leasing-steps">
            <div class="container-leasing-step">
                <div class="container-leasing-step-icon">
                    <i data-feather="search"></i>
                </div>
                <h3><?php _e('1. Find Containers', 'container-leasing'); ?></h3>
                <p><?php _e('Browse our inventory of shipping containers available for lease.', 'container-leasing'); ?></p>
            </div>
            <div class="container-leasing-step">
                <div class="container-leasing-step-icon">
                    <i data-feather="file-text"></i>
                </div>
                <h3><?php _e('2. Sign Contract', 'container-leasing'); ?></h3>
                <p><?php _e('Complete the leasing agreement with our easy digital signature process.', 'container-leasing'); ?></p>
            </div>
            <div class="container-leasing-step">
                <div class="container-leasing-step-icon">
                    <i data-feather="credit-card"></i>
                </div>
                <h3><?php _e('3. Payment', 'container-leasing'); ?></h3>
                <p><?php _e('Secure payment processing with PayPal and other payment methods.', 'container-leasing'); ?></p>
            </div>
            <div class="container-leasing-step">
                <div class="container-leasing-step-icon">
                    <i data-feather="truck"></i>
                </div>
                <h3><?php _e('4. Delivery', 'container-leasing'); ?></h3>
                <p><?php _e('Track your container delivery and receive updates in real-time.', 'container-leasing'); ?></p>
            </div>
        </div>
    </div>
    
    <script>
        // Initialize Feather icons
        document.addEventListener('DOMContentLoaded', function() {
            if (typeof feather !== 'undefined') {
                feather.replace();
            }
        });
    </script>
</div>
