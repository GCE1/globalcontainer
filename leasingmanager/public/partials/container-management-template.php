<?php
/**
 * Template for the Container Management page.
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

<div class="container-leasing-management-page">
    <div class="container-leasing-page-header">
        <h1><?php _e('Manage Containers', 'container-leasing'); ?></h1>
        <p><?php _e('Add, edit, or remove containers from your inventory.', 'container-leasing'); ?></p>
    </div>
    
    <div class="container-leasing-management-wrapper">
        <div class="container-leasing-management-tabs">
            <ul class="container-leasing-tabs">
                <li class="active" data-tab="inventory"><?php _e('My Inventory', 'container-leasing'); ?></li>
                <li data-tab="add-container"><?php _e('Add Container', 'container-leasing'); ?></li>
                <li data-tab="import-export"><?php _e('Import/Export', 'container-leasing'); ?></li>
            </ul>
        </div>
        
        <div class="container-leasing-management-content">
            <!-- Inventory Tab -->
            <div id="tab-inventory" class="container-leasing-tab-content active">
                <div class="container-leasing-inventory-filters">
                    <form id="inventory-filter-form" class="container-leasing-form">
                        <div class="container-leasing-form-row">
                            <div class="container-leasing-form-group">
                                <label for="filter-type"><?php _e('Type', 'container-leasing'); ?></label>
                                <select id="filter-type" name="filter_type">
                                    <option value=""><?php _e('All Types', 'container-leasing'); ?></option>
                                    <option value="dry"><?php _e('Dry', 'container-leasing'); ?></option>
                                    <option value="refrigerated"><?php _e('Refrigerated', 'container-leasing'); ?></option>
                                    <option value="open-top"><?php _e('Open Top', 'container-leasing'); ?></option>
                                    <option value="flat-rack"><?php _e('Flat Rack', 'container-leasing'); ?></option>
                                    <option value="tank"><?php _e('Tank', 'container-leasing'); ?></option>
                                </select>
                            </div>
                            <div class="container-leasing-form-group">
                                <label for="filter-size"><?php _e('Size', 'container-leasing'); ?></label>
                                <select id="filter-size" name="filter_size">
                                    <option value=""><?php _e('All Sizes', 'container-leasing'); ?></option>
                                    <option value="20ft"><?php _e('20ft', 'container-leasing'); ?></option>
                                    <option value="40ft"><?php _e('40ft', 'container-leasing'); ?></option>
                                    <option value="45ft"><?php _e('45ft', 'container-leasing'); ?></option>
                                </select>
                            </div>
                            <div class="container-leasing-form-group">
                                <label for="filter-status"><?php _e('Status', 'container-leasing'); ?></label>
                                <select id="filter-status" name="filter_status">
                                    <option value=""><?php _e('All Status', 'container-leasing'); ?></option>
                                    <option value="available"><?php _e('Available', 'container-leasing'); ?></option>
                                    <option value="leased"><?php _e('Leased', 'container-leasing'); ?></option>
                                    <option value="maintenance"><?php _e('Maintenance', 'container-leasing'); ?></option>
                                </select>
                            </div>
                            <div class="container-leasing-form-group">
                                <label for="filter-search"><?php _e('Search', 'container-leasing'); ?></label>
                                <input type="text" id="filter-search" name="filter_search" placeholder="<?php esc_attr_e('Search by name...', 'container-leasing'); ?>">
                            </div>
                            <div class="container-leasing-form-group">
                                <label>&nbsp;</label>
                                <button type="submit" class="container-leasing-button">
                                    <i data-feather="filter"></i> <?php _e('Filter', 'container-leasing'); ?>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
                
                <div class="container-leasing-inventory-list">
                    <table class="container-leasing-table">
                        <thead>
                            <tr>
                                <th><?php _e('ID', 'container-leasing'); ?></th>
                                <th><?php _e('Container Name', 'container-leasing'); ?></th>
                                <th><?php _e('Type', 'container-leasing'); ?></th>
                                <th><?php _e('Size', 'container-leasing'); ?></th>
                                <th><?php _e('Origin', 'container-leasing'); ?></th>
                                <th><?php _e('Destination', 'container-leasing'); ?></th>
                                <th><?php _e('Status', 'container-leasing'); ?></th>
                                <th><?php _e('Price', 'container-leasing'); ?></th>
                                <th><?php _e('Actions', 'container-leasing'); ?></th>
                            </tr>
                        </thead>
                        <tbody id="container-inventory-body">
                            <?php
                            // Get user's containers
                            $current_user_id = get_current_user_id();
                            
                            $args = array(
                                'post_type' => 'container',
                                'posts_per_page' => -1,
                                'meta_query' => array(
                                    array(
                                        'key' => '_container_user',
                                        'value' => $current_user_id,
                                        'compare' => '='
                                    )
                                )
                            );
                            
                            $containers = new WP_Query($args);
                            
                            if ($containers->have_posts()) :
                                while ($containers->have_posts()) : $containers->the_post();
                                    $container_id = get_the_ID();
                                    $container_type = get_post_meta($container_id, '_container_type', true);
                                    $container_size = get_post_meta($container_id, '_container_size', true);
                                    $container_origin = get_post_meta($container_id, '_container_origin', true);
                                    $container_destination = get_post_meta($container_id, '_container_destination', true);
                                    $container_status = get_post_meta($container_id, '_container_status', true);
                                    $container_price = get_post_meta($container_id, '_container_price', true);
                            ?>
                                <tr>
                                    <td><?php echo esc_html($container_id); ?></td>
                                    <td><?php the_title(); ?></td>
                                    <td><?php echo esc_html($container_type); ?></td>
                                    <td><?php echo esc_html($container_size); ?></td>
                                    <td><?php echo esc_html($container_origin); ?></td>
                                    <td><?php echo esc_html($container_destination); ?></td>
                                    <td>
                                        <span class="container-leasing-status container-leasing-status-<?php echo esc_attr($container_status); ?>">
                                            <?php echo esc_html($container_status); ?>
                                        </span>
                                    </td>
                                    <td><?php echo wc_price($container_price); ?></td>
                                    <td>
                                        <div class="container-leasing-actions">
                                            <a href="#" class="container-leasing-action-edit" data-id="<?php echo esc_attr($container_id); ?>">
                                                <i data-feather="edit"></i>
                                            </a>
                                            <a href="#" class="container-leasing-action-delete" data-id="<?php echo esc_attr($container_id); ?>" data-name="<?php echo esc_attr(get_the_title()); ?>">
                                                <i data-feather="trash-2"></i>
                                            </a>
                                        </div>
                                    </td>
                                </tr>
                            <?php
                                endwhile;
                                wp_reset_postdata();
                            else :
                            ?>
                                <tr>
                                    <td colspan="9" class="container-leasing-no-items">
                                        <?php _e('No containers found. Add your first container using the "Add Container" tab.', 'container-leasing'); ?>
                                    </td>
                                </tr>
                            <?php endif; ?>
                        </tbody>
                    </table>
                </div>
            </div>
            
            <!-- Add Container Tab -->
            <div id="tab-add-container" class="container-leasing-tab-content">
                <form id="container-management-form" class="container-leasing-form">
                    <input type="hidden" id="container_id" name="container_id" value="0">
                    
                    <div class="container-leasing-form-row">
                        <div class="container-leasing-form-group">
                            <label for="container_name"><?php _e('Container Name *', 'container-leasing'); ?></label>
                            <input type="text" id="container_name" name="container_name" required>
                        </div>
                        <div class="container-leasing-form-group">
                            <label for="container_type"><?php _e('Container Type *', 'container-leasing'); ?></label>
                            <select id="container_type" name="container_type" required>
                                <option value=""><?php _e('Select Type', 'container-leasing'); ?></option>
                                <option value="dry"><?php _e('Dry', 'container-leasing'); ?></option>
                                <option value="refrigerated"><?php _e('Refrigerated', 'container-leasing'); ?></option>
                                <option value="open-top"><?php _e('Open Top', 'container-leasing'); ?></option>
                                <option value="flat-rack"><?php _e('Flat Rack', 'container-leasing'); ?></option>
                                <option value="tank"><?php _e('Tank', 'container-leasing'); ?></option>
                            </select>
                        </div>
                        <div class="container-leasing-form-group">
                            <label for="container_size"><?php _e('Container Size *', 'container-leasing'); ?></label>
                            <select id="container_size" name="container_size" required>
                                <option value=""><?php _e('Select Size', 'container-leasing'); ?></option>
                                <option value="20ft"><?php _e('20ft', 'container-leasing'); ?></option>
                                <option value="40ft"><?php _e('40ft', 'container-leasing'); ?></option>
                                <option value="45ft"><?php _e('45ft', 'container-leasing'); ?></option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="container-leasing-form-row">
                        <div class="container-leasing-form-group">
                            <label for="container_origin"><?php _e('Origin Location', 'container-leasing'); ?></label>
                            <input type="text" id="container_origin" name="container_origin" placeholder="<?php esc_attr_e('e.g., Los Angeles, CA', 'container-leasing'); ?>">
                        </div>
                        <div class="container-leasing-form-group">
                            <label for="container_destination"><?php _e('Destination Location', 'container-leasing'); ?></label>
                            <input type="text" id="container_destination" name="container_destination" placeholder="<?php esc_attr_e('e.g., New York, NY', 'container-leasing'); ?>">
                        </div>
                        <div class="container-leasing-form-group">
                            <label for="container_status"><?php _e('Status', 'container-leasing'); ?></label>
                            <select id="container_status" name="container_status">
                                <option value="available"><?php _e('Available', 'container-leasing'); ?></option>
                                <option value="leased"><?php _e('Leased', 'container-leasing'); ?></option>
                                <option value="maintenance"><?php _e('Maintenance', 'container-leasing'); ?></option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="container-leasing-form-row">
                        <div class="container-leasing-form-group">
                            <label for="container_price"><?php _e('Pickup Charge (Base Price) *', 'container-leasing'); ?></label>
                            <input type="number" id="container_price" name="container_price" min="0" step="0.01" required>
                        </div>
                        <div class="container-leasing-form-group">
                            <label for="container_free_days"><?php _e('Free Days', 'container-leasing'); ?></label>
                            <input type="number" id="container_free_days" name="container_free_days" min="0" value="<?php echo esc_attr(get_option('container_leasing_default_free_days', 5)); ?>">
                        </div>
                        <div class="container-leasing-form-group">
                            <label for="container_per_diem"><?php _e('Per Diem Rate', 'container-leasing'); ?></label>
                            <input type="number" id="container_per_diem" name="container_per_diem" min="0" step="0.01" value="<?php echo esc_attr(get_option('container_leasing_default_per_diem', 25)); ?>">
                        </div>
                    </div>
                    
                    <div class="container-leasing-form-actions">
                        <button type="submit" class="container-leasing-button container-leasing-button-primary">
                            <i data-feather="save"></i> <?php _e('Save Container', 'container-leasing'); ?>
                        </button>
                        <button type="button" id="container-form-reset" class="container-leasing-button container-leasing-button-outline">
                            <i data-feather="x"></i> <?php _e('Reset Form', 'container-leasing'); ?>
                        </button>
                    </div>
                </form>
            </div>
            
            <!-- Import/Export Tab -->
            <div id="tab-import-export" class="container-leasing-tab-content">
                <div class="container-leasing-import-section">
                    <h2><?php _e('Import Containers', 'container-leasing'); ?></h2>
                    <p><?php _e('Upload a CSV file to import multiple containers at once.', 'container-leasing'); ?></p>
                    
                    <form id="container-csv-form" class="container-leasing-form" enctype="multipart/form-data">
                        <div class="container-leasing-file-upload">
                            <input type="file" name="csv_file" id="container-csv-upload" accept=".csv" class="container-leasing-file-input" required>
                            <label for="container-csv-upload" class="container-leasing-file-label">
                                <i data-feather="upload"></i>
                                <span><?php _e('Choose CSV File', 'container-leasing'); ?></span>
                            </label>
                            <div class="container-leasing-file-selected" style="display: none;">
                                <?php _e('Selected file:', 'container-leasing'); ?> <span class="container-leasing-file-name"></span>
                            </div>
                        </div>
                        
                        <div class="container-leasing-form-actions">
                            <button type="submit" class="container-leasing-button container-leasing-button-primary">
                                <i data-feather="upload-cloud"></i> <?php _e('Upload & Import', 'container-leasing'); ?>
                            </button>
                        </div>
                    </form>
                    
                    <div class="container-leasing-csv-info">
                        <h3><?php _e('CSV Format', 'container-leasing'); ?></h3>
                        <p><?php _e('Your CSV file should include the following columns:', 'container-leasing'); ?></p>
                        <pre>Container Name,Type,Size,Origin,Destination,Status,Price,Free Days,Per Diem Rate</pre>
                        <p><?php _e('Example:', 'container-leasing'); ?></p>
                        <pre>Container ABC123,Dry,20ft,Los Angeles,New York,available,500,5,25</pre>
                        <p><a href="#" id="download-sample-csv" class="container-leasing-link">
                            <i data-feather="download"></i> <?php _e('Download Sample CSV', 'container-leasing'); ?>
                        </a></p>
                    </div>
                </div>
                
                <div class="container-leasing-export-section">
                    <h2><?php _e('Export Containers', 'container-leasing'); ?></h2>
                    <p><?php _e('Export your container inventory to a CSV file.', 'container-leasing'); ?></p>
                    
                    <div class="container-leasing-form-actions">
                        <a href="#" id="export-containers-csv" class="container-leasing-button">
                            <i data-feather="download"></i> <?php _e('Export to CSV', 'container-leasing'); ?>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<!-- Edit Container Modal -->
<div id="container-edit-modal" class="container-leasing-modal">
    <div class="container-leasing-modal-content">
        <div class="container-leasing-modal-header">
            <h2><?php _e('Edit Container', 'container-leasing'); ?></h2>
            <button type="button" class="container-leasing-modal-close">&times;</button>
        </div>
        <div class="container-leasing-modal-body">
            <!-- Modal content will be loaded here via JavaScript -->
            <div class="container-leasing-loading">
                <i data-feather="loader"></i> <?php _e('Loading...', 'container-leasing'); ?>
            </div>
        </div>
    </div>
</div>

<!-- Delete Confirmation Modal -->
<div id="container-delete-modal" class="container-leasing-modal">
    <div class="container-leasing-modal-content container-leasing-modal-small">
        <div class="container-leasing-modal-header">
            <h2><?php _e('Confirm Deletion', 'container-leasing'); ?></h2>
            <button type="button" class="container-leasing-modal-close">&times;</button>
        </div>
        <div class="container-leasing-modal-body">
            <p><?php _e('Are you sure you want to delete the container:', 'container-leasing'); ?> <strong id="delete-container-name"></strong>?</p>
            <p><?php _e('This action cannot be undone.', 'container-leasing'); ?></p>
            
            <div class="container-leasing-modal-actions">
                <button type="button" id="confirm-delete" class="container-leasing-button container-leasing-button-danger" data-id="">
                    <?php _e('Delete Container', 'container-leasing'); ?>
                </button>
                <button type="button" class="container-leasing-button container-leasing-button-outline container-leasing-modal-close">
                    <?php _e('Cancel', 'container-leasing'); ?>
                </button>
            </div>
        </div>
    </div>
</div>

<?php
// Load Google Maps API if API key is available for autocomplete
$google_maps_api_key = get_option('container_leasing_google_maps_api_key', '');
if (!empty($google_maps_api_key)) {
    wp_enqueue_script('google-maps', 'https://maps.googleapis.com/maps/api/js?key=' . esc_attr($google_maps_api_key) . '&libraries=places', array(), null, true);
}

// Load container management functionality
wp_enqueue_script('container-leasing-management', plugin_dir_url(dirname(__FILE__)) . 'js/container-management.js', array('jquery'), CONTAINER_LEASING_VERSION, true);

// Localize script with AJAX URL and nonce
wp_localize_script('container-leasing-management', 'container_management', array(
    'ajax_url' => admin_url('admin-ajax.php'),
    'nonce' => wp_create_nonce('container_leasing_nonce'),
));

get_footer();
?>

<style>
    .container-leasing-management-page {
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
    
    .container-leasing-tabs {
        display: flex;
        list-style: none;
        padding: 0;
        margin: 0 0 20px 0;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .container-leasing-tabs li {
        padding: 10px 20px;
        cursor: pointer;
        margin-right: 5px;
        border: 1px solid transparent;
        border-bottom: none;
        border-radius: 4px 4px 0 0;
        background-color: #f8f9fa;
    }
    
    .container-leasing-tabs li.active {
        background-color: #ffffff;
        border-color: #e0e0e0;
        margin-bottom: -1px;
    }
    
    .container-leasing-tab-content {
        display: none;
    }
    
    .container-leasing-tab-content.active {
        display: block;
    }
    
    .container-leasing-table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 20px;
    }
    
    .container-leasing-table th, 
    .container-leasing-table td {
        padding: 12px 15px;
        text-align: left;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .container-leasing-table th {
        background-color: #f8f9fa;
        font-weight: 600;
    }
    
    .container-leasing-table tr:hover {
        background-color: #f8f9fa;
    }
    
    .container-leasing-status {
        display: inline-block;
        padding: 3px 8px;
        border-radius: 3px;
        font-size: 12px;
        font-weight: 500;
    }
    
    .container-leasing-status-available {
        background-color: #e8f5e9;
        color: #2e7d32;
    }
    
    .container-leasing-status-leased {
        background-color: #e3f2fd;
        color: #1565c0;
    }
    
    .container-leasing-status-maintenance {
        background-color: #fff8e1;
        color: #f57f17;
    }
    
    .container-leasing-actions {
        display: flex;
        gap: 10px;
    }
    
    .container-leasing-action-edit,
    .container-leasing-action-delete {
        color: #666;
        transition: color 0.2s;
    }
    
    .container-leasing-action-edit:hover {
        color: #0073aa;
    }
    
    .container-leasing-action-delete:hover {
        color: #d32f2f;
    }
    
    .container-leasing-no-items {
        text-align: center;
        padding: 30px !important;
        color: #666;
    }
    
    .container-leasing-file-upload {
        margin-bottom: 20px;
    }
    
    .container-leasing-file-input {
        width: 0.1px;
        height: 0.1px;
        opacity: 0;
        overflow: hidden;
        position: absolute;
        z-index: -1;
    }
    
    .container-leasing-file-label {
        display: inline-flex;
        align-items: center;
        padding: 10px 20px;
        background-color: #f8f9fa;
        border: 1px dashed #ccc;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s;
    }
    
    .container-leasing-file-label:hover {
        background-color: #e9ecef;
        border-color: #aaa;
    }
    
    .container-leasing-file-label svg {
        margin-right: 8px;
    }
    
    .container-leasing-file-selected {
        margin-top: 10px;
        padding: 8px 12px;
        background-color: #e8f5e9;
        border-radius: 4px;
        color: #2e7d32;
    }
    
    .container-leasing-csv-info {
        margin-top: 30px;
        padding: 20px;
        background-color: #f8f9fa;
        border-radius: 4px;
    }
    
    .container-leasing-csv-info pre {
        background-color: #ffffff;
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        overflow-x: auto;
    }
    
    .container-leasing-link {
        display: inline-flex;
        align-items: center;
        color: #0073aa;
        text-decoration: none;
    }
    
    .container-leasing-link svg {
        margin-right: 5px;
    }
    
    .container-leasing-export-section {
        margin-top: 40px;
        padding-top: 30px;
        border-top: 1px solid #e0e0e0;
    }
    
    /* Modal styles */
    .container-leasing-modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.5);
    }
    
    .container-leasing-modal-content {
        position: relative;
        background-color: #fff;
        margin: 10vh auto;
        padding: 0;
        border-radius: 6px;
        width: 80%;
        max-width: 800px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        animation: modalFade 0.3s;
    }
    
    .container-leasing-modal-small {
        max-width: 500px;
    }
    
    .container-leasing-modal-header {
        padding: 15px 20px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .container-leasing-modal-header h2 {
        margin: 0;
        font-size: 20px;
    }
    
    .container-leasing-modal-close {
        font-size: 24px;
        font-weight: bold;
        color: #666;
        background: none;
        border: none;
        cursor: pointer;
    }
    
    .container-leasing-modal-close:hover {
        color: #000;
    }
    
    .container-leasing-modal-body {
        padding: 20px;
    }
    
    .container-leasing-modal-actions {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
    
    .container-leasing-button-danger {
        background-color: #d32f2f;
    }
    
    .container-leasing-button-danger:hover {
        background-color: #b71c1c;
    }
    
    @keyframes modalFade {
        from {transform: translateY(-30px); opacity: 0;}
        to {transform: translateY(0); opacity: 1;}
    }
    
    @media (max-width: 768px) {
        .container-leasing-modal-content {
            width: 95%;
            margin: 20px auto;
        }
    }
</style>
