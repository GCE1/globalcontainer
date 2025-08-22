(function($) {
    'use strict';

    /**
     * All of the code for your public-facing JavaScript source
     * should reside in this file.
     */

    $(document).ready(function() {
        
        // Initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Container filter functionality
        $('#container-filter-form').on('submit', function(e) {
            e.preventDefault();
            const filterData = $(this).serialize();
            
            $.ajax({
                url: container_leasing.ajax_url,
                type: 'POST',
                data: filterData + '&action=container_leasing_filter_containers&nonce=' + container_leasing.nonce,
                beforeSend: function() {
                    $('#container-results').html('<div class="container-leasing-loading"><i data-feather="loader"></i> Loading...</div>');
                    if (typeof feather !== 'undefined') {
                        feather.replace();
                    }
                },
                success: function(response) {
                    if (response.success) {
                        $('#container-results').html(response.data.html);
                        if (typeof feather !== 'undefined') {
                            feather.replace();
                        }
                    } else {
                        $('#container-results').html('<div class="container-leasing-error">' + response.data + '</div>');
                    }
                },
                error: function() {
                    $('#container-results').html('<div class="container-leasing-error">Error loading containers. Please try again.</div>');
                }
            });
        });
        
        // CSV file upload validation
        $('#container-csv-upload').on('change', function() {
            const fileInput = $(this)[0];
            const filePath = fileInput.value;
            const allowedExtensions = /(\.csv)$/i;
            
            if (!allowedExtensions.exec(filePath)) {
                alert('Please upload a CSV file only.');
                fileInput.value = '';
                return false;
            }
            
            // Display file name
            if (fileInput.files.length > 0) {
                $('.container-leasing-file-name').text(fileInput.files[0].name);
                $('.container-leasing-file-selected').show();
            }
        });
        
        // Contract accordion
        $('.container-leasing-contract-toggle').on('click', function() {
            $(this).toggleClass('active');
            const content = $(this).next('.container-leasing-contract-content');
            
            if (content.css('max-height') !== '0px') {
                content.css('max-height', '0');
            } else {
                content.css('max-height', content.prop('scrollHeight') + 'px');
            }
        });
        
        // Print invoice
        $('.container-leasing-print-invoice').on('click', function(e) {
            e.preventDefault();
            window.print();
        });
        
        // Email tab switching
        $('.container-leasing-email-tab').on('click', function(e) {
            e.preventDefault();
            const tab = $(this).data('tab');
            
            $('.container-leasing-email-tab').removeClass('active');
            $(this).addClass('active');
            
            $('.container-leasing-email-content').hide();
            $('#container-leasing-email-' + tab).show();
        });
        
        // Tooltip initialization
        $('[data-toggle="tooltip"]').each(function() {
            $(this).tooltip({
                container: 'body',
                trigger: 'hover'
            });
        });
        
        // Handle dashboard chart initialization if on dashboard page
        if ($('#container-leasing-usage-chart').length) {
            if (typeof initDashboardCharts === 'function') {
                initDashboardCharts();
            }
        }
        
        // Handle insights chart initialization if on insights page
        if ($('#container-leasing-locations-map').length) {
            if (typeof initInsightsMap === 'function') {
                initInsightsMap();
            }
        }
        
        // PayPal button initialization
        if ($('#paypal-button').length) {
            if (typeof initPayPalButton === 'function') {
                initPayPalButton();
            }
        }
        
        // Handle container management form if on container management page
        if ($('#container-management-form').length) {
            if (typeof initContainerManagement === 'function') {
                initContainerManagement();
            }
        }
    });

})(jQuery);
