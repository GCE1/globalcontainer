<?php
/**
 * Widgets for the Container Leasing plugin.
 *
 * @link       https://example.com
 * @since      1.0.0
 *
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes/widgets
 */

/**
 * Widgets for the Container Leasing plugin.
 *
 * This class registers all the widgets for the Container Leasing plugin.
 *
 * @package    Container_Leasing
 * @subpackage Container_Leasing/includes/widgets
 */
class Container_Leasing_Widgets {

    /**
     * Initialize the widgets.
     *
     * @since    1.0.0
     */
    public function __construct() {
        add_action('widgets_init', array($this, 'register_widgets'));
    }
    
    /**
     * Register the widgets.
     *
     * @since    1.0.0
     */
    public function register_widgets() {
        register_widget('Container_Leasing_Available_Containers_Widget');
        register_widget('Container_Leasing_User_Dashboard_Widget');
        register_widget('Container_Leasing_Container_Stats_Widget');
    }
}

/**
 * Widget for displaying available containers.
 */
class Container_Leasing_Available_Containers_Widget extends WP_Widget {

    /**
     * Register widget with WordPress.
     */
    public function __construct() {
        parent::__construct(
            'container_leasing_available_containers', // Base ID
            __('Available Containers', 'container-leasing'), // Name
            array('description' => __('Display a list of available containers for lease.', 'container-leasing')) // Args
        );
    }

    /**
     * Front-end display of widget.
     *
     * @see WP_Widget::widget()
     *
     * @param array $args     Widget arguments.
     * @param array $instance Saved values from database.
     */
    public function widget($args, $instance) {
        echo $args['before_widget'];
        
        if (!empty($instance['title'])) {
            echo $args['before_title'] . apply_filters('widget_title', $instance['title']) . $args['after_title'];
        }
        
        $limit = !empty($instance['limit']) ? (int) $instance['limit'] : 5;
        $container_type = !empty($instance['container_type']) ? $instance['container_type'] : '';
        
        // Query available containers
        $query_args = array(
            'post_type' => 'container',
            'posts_per_page' => $limit,
            'meta_query' => array(
                array(
                    'key' => '_container_status',
                    'value' => 'available',
                    'compare' => '='
                )
            )
        );
        
        // Add type filter if specified
        if (!empty($container_type)) {
            $query_args['meta_query'][] = array(
                'key' => '_container_type',
                'value' => $container_type,
                'compare' => '='
            );
        }
        
        $containers = new WP_Query($query_args);
        
        if ($containers->have_posts()) {
            echo '<ul class="container-leasing-widget-containers">';
            
            while ($containers->have_posts()) {
                $containers->the_post();
                $container_id = get_the_ID();
                $container_type = get_post_meta($container_id, '_container_type', true);
                $container_size = get_post_meta($container_id, '_container_size', true);
                $container_price = get_post_meta($container_id, '_container_price', true);
                
                echo '<li class="container-leasing-widget-container">';
                echo '<a href="' . get_permalink() . '" class="container-leasing-widget-container-title">' . get_the_title() . '</a>';
                echo '<div class="container-leasing-widget-container-details">';
                echo '<span class="container-leasing-widget-container-type">' . esc_html($container_type) . ', ' . esc_html($container_size) . '</span>';
                echo '<span class="container-leasing-widget-container-price">' . wc_price($container_price) . '</span>';
                echo '</div>';
                echo '</li>';
            }
            
            echo '</ul>';
            
            // Show view all link if archive page exists
            $container_archive = get_post_type_archive_link('container');
            if ($container_archive) {
                echo '<a href="' . esc_url($container_archive) . '" class="container-leasing-widget-view-all">' . __('View All Containers', 'container-leasing') . '</a>';
            }
            
            wp_reset_postdata();
        } else {
            echo '<p>' . __('No containers available at the moment.', 'container-leasing') . '</p>';
        }
        
        echo $args['after_widget'];
    }

    /**
     * Back-end widget form.
     *
     * @see WP_Widget::form()
     *
     * @param array $instance Previously saved values from database.
     */
    public function form($instance) {
        $title = !empty($instance['title']) ? $instance['title'] : __('Available Containers', 'container-leasing');
        $limit = !empty($instance['limit']) ? (int) $instance['limit'] : 5;
        $container_type = !empty($instance['container_type']) ? $instance['container_type'] : '';
        ?>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('title')); ?>"><?php esc_html_e('Title:', 'container-leasing'); ?></label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" type="text" value="<?php echo esc_attr($title); ?>">
        </p>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('limit')); ?>"><?php esc_html_e('Number of containers to show:', 'container-leasing'); ?></label>
            <input class="tiny-text" id="<?php echo esc_attr($this->get_field_id('limit')); ?>" name="<?php echo esc_attr($this->get_field_name('limit')); ?>" type="number" min="1" max="20" value="<?php echo esc_attr($limit); ?>">
        </p>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('container_type')); ?>"><?php esc_html_e('Container Type:', 'container-leasing'); ?></label>
            <select class="widefat" id="<?php echo esc_attr($this->get_field_id('container_type')); ?>" name="<?php echo esc_attr($this->get_field_name('container_type')); ?>">
                <option value="" <?php selected('', $container_type); ?>><?php esc_html_e('All Types', 'container-leasing'); ?></option>
                <option value="dry" <?php selected('dry', $container_type); ?>><?php esc_html_e('Dry', 'container-leasing'); ?></option>
                <option value="refrigerated" <?php selected('refrigerated', $container_type); ?>><?php esc_html_e('Refrigerated', 'container-leasing'); ?></option>
                <option value="open-top" <?php selected('open-top', $container_type); ?>><?php esc_html_e('Open Top', 'container-leasing'); ?></option>
                <option value="flat-rack" <?php selected('flat-rack', $container_type); ?>><?php esc_html_e('Flat Rack', 'container-leasing'); ?></option>
                <option value="tank" <?php selected('tank', $container_type); ?>><?php esc_html_e('Tank', 'container-leasing'); ?></option>
            </select>
        </p>
        <?php
    }

    /**
     * Sanitize widget form values as they are saved.
     *
     * @see WP_Widget::update()
     *
     * @param array $new_instance Values just sent to be saved.
     * @param array $old_instance Previously saved values from database.
     *
     * @return array Updated safe values to be saved.
     */
    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = (!empty($new_instance['title'])) ? sanitize_text_field($new_instance['title']) : '';
        $instance['limit'] = (!empty($new_instance['limit'])) ? (int) $new_instance['limit'] : 5;
        $instance['container_type'] = (!empty($new_instance['container_type'])) ? sanitize_text_field($new_instance['container_type']) : '';

        return $instance;
    }
}

/**
 * Widget for displaying user dashboard information.
 */
class Container_Leasing_User_Dashboard_Widget extends WP_Widget {

    /**
     * Register widget with WordPress.
     */
    public function __construct() {
        parent::__construct(
            'container_leasing_user_dashboard', // Base ID
            __('Container Leasing Dashboard', 'container-leasing'), // Name
            array('description' => __('Display a user dashboard with links to container management pages.', 'container-leasing')) // Args
        );
    }

    /**
     * Front-end display of widget.
     *
     * @see WP_Widget::widget()
     *
     * @param array $args     Widget arguments.
     * @param array $instance Saved values from database.
     */
    public function widget($args, $instance) {
        // Only show for logged in users
        if (!is_user_logged_in()) {
            return;
        }
        
        echo $args['before_widget'];
        
        if (!empty($instance['title'])) {
            echo $args['before_title'] . apply_filters('widget_title', $instance['title']) . $args['after_title'];
        }
        
        // Get page IDs from settings
        $dashboard_page_id = get_option('container_leasing_dashboard_page_id');
        $management_page_id = get_option('container_leasing_management_page_id');
        $insights_page_id = get_option('container_leasing_insights_page_id');
        $invoices_page_id = get_option('container_leasing_invoices_page_id');
        $email_page_id = get_option('container_leasing_email_page_id');
        
        echo '<div class="container-leasing-widget-dashboard">';
        
        // User greeting
        $current_user = wp_get_current_user();
        echo '<div class="container-leasing-widget-greeting">';
        echo __('Hello, ', 'container-leasing') . esc_html($current_user->display_name);
        echo '</div>';
        
        // Dashboard links
        echo '<ul class="container-leasing-widget-links">';
        
        if ($dashboard_page_id) {
            echo '<li><a href="' . get_permalink($dashboard_page_id) . '">';
            echo '<i data-feather="grid"></i> ' . __('Dashboard', 'container-leasing');
            echo '</a></li>';
        }
        
        if ($management_page_id) {
            echo '<li><a href="' . get_permalink($management_page_id) . '">';
            echo '<i data-feather="package"></i> ' . __('Manage Containers', 'container-leasing');
            echo '</a></li>';
        }
        
        if ($insights_page_id) {
            echo '<li><a href="' . get_permalink($insights_page_id) . '">';
            echo '<i data-feather="bar-chart-2"></i> ' . __('Insights', 'container-leasing');
            echo '</a></li>';
        }
        
        if ($invoices_page_id) {
            echo '<li><a href="' . get_permalink($invoices_page_id) . '">';
            echo '<i data-feather="file-text"></i> ' . __('Invoices', 'container-leasing');
            echo '</a></li>';
        }
        
        if ($email_page_id) {
            echo '<li><a href="' . get_permalink($email_page_id) . '">';
            echo '<i data-feather="mail"></i> ' . __('Email Management', 'container-leasing');
            echo '</a></li>';
        }
        
        echo '</ul>';
        
        echo '</div>';
        
        // Initialize Feather icons
        echo '<script>';
        echo 'jQuery(document).ready(function($) {';
        echo '  if (typeof feather !== "undefined") {';
        echo '    feather.replace();';
        echo '  }';
        echo '});';
        echo '</script>';
        
        echo $args['after_widget'];
    }

    /**
     * Back-end widget form.
     *
     * @see WP_Widget::form()
     *
     * @param array $instance Previously saved values from database.
     */
    public function form($instance) {
        $title = !empty($instance['title']) ? $instance['title'] : __('Container Dashboard', 'container-leasing');
        ?>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('title')); ?>"><?php esc_html_e('Title:', 'container-leasing'); ?></label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" type="text" value="<?php echo esc_attr($title); ?>">
        </p>
        <p>
            <?php esc_html_e('This widget displays links to container management pages for logged in users.', 'container-leasing'); ?>
        </p>
        <?php
    }

    /**
     * Sanitize widget form values as they are saved.
     *
     * @see WP_Widget::update()
     *
     * @param array $new_instance Values just sent to be saved.
     * @param array $old_instance Previously saved values from database.
     *
     * @return array Updated safe values to be saved.
     */
    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = (!empty($new_instance['title'])) ? sanitize_text_field($new_instance['title']) : '';

        return $instance;
    }
}

/**
 * Widget for displaying container statistics.
 */
class Container_Leasing_Container_Stats_Widget extends WP_Widget {

    /**
     * Register widget with WordPress.
     */
    public function __construct() {
        parent::__construct(
            'container_leasing_container_stats', // Base ID
            __('Container Statistics', 'container-leasing'), // Name
            array('description' => __('Display statistics about containers in the system.', 'container-leasing')) // Args
        );
    }

    /**
     * Front-end display of widget.
     *
     * @see WP_Widget::widget()
     *
     * @param array $args     Widget arguments.
     * @param array $instance Saved values from database.
     */
    public function widget($args, $instance) {
        echo $args['before_widget'];
        
        if (!empty($instance['title'])) {
            echo $args['before_title'] . apply_filters('widget_title', $instance['title']) . $args['after_title'];
        }
        
        // Calculate container stats
        $container_count = wp_count_posts('container');
        $total_containers = $container_count->publish;
        
        // Get available containers count
        $available_containers = new WP_Query(array(
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
        $available_count = $available_containers->post_count;
        
        // Get leased containers count
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
        
        // Display stats
        echo '<div class="container-leasing-widget-stats">';
        
        echo '<div class="container-leasing-widget-stat-item">';
        echo '<span class="container-leasing-widget-stat-number">' . esc_html($total_containers) . '</span>';
        echo '<span class="container-leasing-widget-stat-label">' . __('Total Containers', 'container-leasing') . '</span>';
        echo '</div>';
        
        echo '<div class="container-leasing-widget-stat-item">';
        echo '<span class="container-leasing-widget-stat-number">' . esc_html($available_count) . '</span>';
        echo '<span class="container-leasing-widget-stat-label">' . __('Available', 'container-leasing') . '</span>';
        echo '</div>';
        
        echo '<div class="container-leasing-widget-stat-item">';
        echo '<span class="container-leasing-widget-stat-number">' . esc_html($leased_count) . '</span>';
        echo '<span class="container-leasing-widget-stat-label">' . __('Currently Leased', 'container-leasing') . '</span>';
        echo '</div>';
        
        echo '</div>';
        
        echo $args['after_widget'];
    }

    /**
     * Back-end widget form.
     *
     * @see WP_Widget::form()
     *
     * @param array $instance Previously saved values from database.
     */
    public function form($instance) {
        $title = !empty($instance['title']) ? $instance['title'] : __('Container Statistics', 'container-leasing');
        ?>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('title')); ?>"><?php esc_html_e('Title:', 'container-leasing'); ?></label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('title')); ?>" name="<?php echo esc_attr($this->get_field_name('title')); ?>" type="text" value="<?php echo esc_attr($title); ?>">
        </p>
        <p>
            <?php esc_html_e('This widget displays statistics about containers in the system.', 'container-leasing'); ?>
        </p>
        <?php
    }

    /**
     * Sanitize widget form values as they are saved.
     *
     * @see WP_Widget::update()
     *
     * @param array $new_instance Values just sent to be saved.
     * @param array $old_instance Previously saved values from database.
     *
     * @return array Updated safe values to be saved.
     */
    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = (!empty($new_instance['title'])) ? sanitize_text_field($new_instance['title']) : '';

        return $instance;
    }
}
