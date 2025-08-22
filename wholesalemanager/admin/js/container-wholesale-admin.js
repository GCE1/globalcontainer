(function( $ ) {
	'use strict';

	/**
	 * All of the code for your admin-facing JavaScript source
	 * should reside in this file.
	 */
    
    $(document).ready(function() {
        
        // Contract modal functionality
        $('.container-leasing-edit-contract').on('click', function(e) {
            e.preventDefault();
            var contractId = $(this).data('id');
            
            // Fetch contract data via AJAX
            $.ajax({
                url: container_leasing_admin.ajax_url,
                type: 'POST',
                data: {
                    action: 'container_leasing_get_contract',
                    contract_id: contractId,
                    nonce: container_leasing_admin.nonce
                },
                success: function(response) {
                    if (response.success) {
                        var contract = response.data;
                        
                        // Populate form
                        $('#contract_id').val(contract.id);
                        $('#contract_start_date').val(contract.start_date);
                        $('#contract_end_date').val(contract.end_date);
                        $('#contract_free_days').val(contract.free_days);
                        $('#contract_per_diem').val(contract.per_diem_rate);
                        $('#contract_status').val(contract.status);
                        
                        // Show modal
                        $('#container-leasing-contract-modal').show();
                    } else {
                        alert(response.data);
                    }
                },
                error: function() {
                    alert('An error occurred while fetching contract data.');
                }
            });
        });
        
        // Close modal
        $('#container-leasing-close-modal').on('click', function() {
            $('#container-leasing-contract-modal').hide();
        });
        
        // Contract form submission
        $('#container-leasing-edit-contract-form').on('submit', function(e) {
            e.preventDefault();
            
            var formData = $(this).serialize();
            formData += '&action=container_leasing_update_contract';
            formData += '&nonce=' + container_leasing_admin.nonce;
            
            $.ajax({
                url: container_leasing_admin.ajax_url,
                type: 'POST',
                data: formData,
                success: function(response) {
                    if (response.success) {
                        $('#container-leasing-contract-modal').hide();
                        window.location.reload();
                    } else {
                        alert(response.data);
                    }
                },
                error: function() {
                    alert('An error occurred while updating the contract.');
                }
            });
        });
        
        // Generate and download sample CSV
        $('#container_leasing_sample_csv').on('click', function(e) {
            e.preventDefault();
            
            // CSV header and sample data
            var csvContent = "Container Name,Type,Size,Origin,Destination,Status,Price,Free Days,Per Diem Rate\n";
            csvContent += "Sample Container 1,Dry,20ft,New York,Los Angeles,available,500,5,25\n";
            csvContent += "Sample Container 2,Refrigerated,40ft,Los Angeles,Miami,available,800,7,35\n";
            csvContent += "Sample Container 3,Open Top,40ft,Houston,Chicago,available,600,6,30\n";
            
            // Create download link
            var encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
            var link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", "sample_containers.csv");
            document.body.appendChild(link);
            
            // Trigger download
            link.click();
            document.body.removeChild(link);
        });
        
        // Close notices
        $('.container-leasing-notice .notice-dismiss').on('click', function() {
            var noticeId = $(this).parent().data('notice-id');
            
            $.ajax({
                url: container_leasing_admin.ajax_url,
                type: 'POST',
                data: {
                    action: 'container_leasing_dismiss_notice',
                    notice_id: noticeId,
                    nonce: container_leasing_admin.nonce
                }
            });
        });
    });

})( jQuery );
