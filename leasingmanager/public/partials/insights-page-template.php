<?php
/**
 * Template for the Insights page.
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

<div class="container-leasing-insights-page">
    <div class="container-leasing-page-header">
        <h1><?php _e('Container Insights', 'container-leasing'); ?></h1>
        <p><?php _e('View insights about container locations and pricing trends.', 'container-leasing'); ?></p>
    </div>
    
    <div class="container-leasing-insights-wrapper">
        <div class="container-leasing-insights-controls">
            <div class="container-leasing-filter">
                <form id="insights-filter-form" class="container-leasing-form">
                    <div class="container-leasing-form-row">
                        <div class="container-leasing-form-group">
                            <label for="date-range"><?php _e('Date Range', 'container-leasing'); ?></label>
                            <select id="date-range" name="date_range">
                                <option value="30"><?php _e('Last 30 Days', 'container-leasing'); ?></option>
                                <option value="90"><?php _e('Last 90 Days', 'container-leasing'); ?></option>
                                <option value="180"><?php _e('Last 6 Months', 'container-leasing'); ?></option>
                                <option value="365"><?php _e('Last Year', 'container-leasing'); ?></option>
                            </select>
                        </div>
                        <div class="container-leasing-form-group">
                            <label for="container-type"><?php _e('Container Type', 'container-leasing'); ?></label>
                            <select id="container-type" name="container_type">
                                <option value=""><?php _e('All Types', 'container-leasing'); ?></option>
                                <option value="dry"><?php _e('Dry', 'container-leasing'); ?></option>
                                <option value="refrigerated"><?php _e('Refrigerated', 'container-leasing'); ?></option>
                                <option value="open-top"><?php _e('Open Top', 'container-leasing'); ?></option>
                                <option value="flat-rack"><?php _e('Flat Rack', 'container-leasing'); ?></option>
                                <option value="tank"><?php _e('Tank', 'container-leasing'); ?></option>
                            </select>
                        </div>
                        <div class="container-leasing-form-group">
                            <label for="container-size"><?php _e('Container Size', 'container-leasing'); ?></label>
                            <select id="container-size" name="container_size">
                                <option value=""><?php _e('All Sizes', 'container-leasing'); ?></option>
                                <option value="20ft"><?php _e('20ft', 'container-leasing'); ?></option>
                                <option value="40ft"><?php _e('40ft', 'container-leasing'); ?></option>
                                <option value="45ft"><?php _e('45ft', 'container-leasing'); ?></option>
                            </select>
                        </div>
                        <div class="container-leasing-form-group">
                            <label>&nbsp;</label>
                            <button type="submit" class="container-leasing-button">
                                <i data-feather="filter"></i> <?php _e('Apply Filters', 'container-leasing'); ?>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        
        <div class="container-leasing-insights-main">
            <div class="container-leasing-insight-card">
                <h2><?php _e('Container Locations Map', 'container-leasing'); ?></h2>
                <p><?php _e('This map shows all origins and destinations of containers in the system.', 'container-leasing'); ?></p>
                <div id="container-leasing-locations-map" class="container-leasing-insights-map">
                    <div class="container-leasing-loading">
                        <i data-feather="loader"></i> <?php _e('Loading map...', 'container-leasing'); ?>
                    </div>
                </div>
            </div>
            
            <div class="container-leasing-insight-card">
                <h2><?php _e('Monthly Pickup Charges', 'container-leasing'); ?></h2>
                <p><?php _e('Average pickup charges per month across all container types.', 'container-leasing'); ?></p>
                <div id="container-leasing-monthly-charges" class="container-leasing-insights-chart">
                    <div class="container-leasing-loading">
                        <i data-feather="loader"></i> <?php _e('Loading chart...', 'container-leasing'); ?>
                    </div>
                </div>
            </div>
            
            <div class="container-leasing-insights-grid">
                <div class="container-leasing-insight-card">
                    <h2><?php _e('Container Type Distribution', 'container-leasing'); ?></h2>
                    <div id="container-leasing-type-distribution" class="container-leasing-insights-chart">
                        <div class="container-leasing-loading">
                            <i data-feather="loader"></i> <?php _e('Loading chart...', 'container-leasing'); ?>
                        </div>
                    </div>
                </div>
                
                <div class="container-leasing-insight-card">
                    <h2><?php _e('Top Origin Locations', 'container-leasing'); ?></h2>
                    <div id="container-leasing-top-origins" class="container-leasing-insights-chart">
                        <div class="container-leasing-loading">
                            <i data-feather="loader"></i> <?php _e('Loading chart...', 'container-leasing'); ?>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="container-leasing-insight-card">
                <h2><?php _e('Leasing Duration Analysis', 'container-leasing'); ?></h2>
                <p><?php _e('Analysis of leasing durations and free days usage.', 'container-leasing'); ?></p>
                <div id="container-leasing-duration-analysis" class="container-leasing-insights-chart">
                    <div class="container-leasing-loading">
                        <i data-feather="loader"></i> <?php _e('Loading chart...', 'container-leasing'); ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>

<?php
// Load Google Maps API if API key is available
$google_maps_api_key = get_option('container_leasing_google_maps_api_key', '');
if (!empty($google_maps_api_key)) {
    wp_enqueue_script('google-maps', 'https://maps.googleapis.com/maps/api/js?key=' . esc_attr($google_maps_api_key) . '&libraries=places&callback=initInsightsMap', array(), null, true);
}

// Load Chart.js
wp_enqueue_script('chart-js', 'https://cdn.jsdelivr.net/npm/chart.js', array(), '3.7.1', true);

// Load insights charts functionality
wp_enqueue_script('container-leasing-insights-charts', plugin_dir_url(dirname(__FILE__)) . 'js/insights-charts.js', array('jquery', 'chart-js'), CONTAINER_LEASING_VERSION, true);

get_footer();
?>

<style>
    .container-leasing-insights-page {
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
    
    .container-leasing-insights-controls {
        margin-bottom: 20px;
    }
    
    .container-leasing-insights-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(450px, 1fr));
        gap: 20px;
        margin-bottom: 20px;
    }
    
    .container-leasing-insight-card {
        background-color: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        margin-bottom: 20px;
    }
    
    .container-leasing-insight-card h2 {
        font-size: 18px;
        margin-top: 0;
        margin-bottom: 15px;
    }
    
    .container-leasing-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 200px;
        color: #666;
    }
    
    .container-leasing-loading svg {
        margin-right: 8px;
        animation: spin 2s linear infinite;
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    
    @media (max-width: 768px) {
        .container-leasing-insights-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
