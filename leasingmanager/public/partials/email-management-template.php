<?php
/**
 * Template for the Email Management page.
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

<div class="container-leasing-email-page">
    <div class="container-leasing-page-header">
        <h1><?php _e('Email Management', 'container-leasing'); ?></h1>
        <p><?php _e('Manage your email communications with customers.', 'container-leasing'); ?></p>
    </div>
    
    <div class="container-leasing-email-wrapper">
        <div class="container-leasing-email-sidebar">
            <div class="container-leasing-email-actions">
                <button id="compose-email" class="container-leasing-button container-leasing-button-primary container-leasing-compose-btn">
                    <i data-feather="edit"></i> <?php _e('Compose', 'container-leasing'); ?>
                </button>
            </div>
            
            <div class="container-leasing-email-folders">
                <ul>
                    <li class="container-leasing-email-tab active" data-tab="inbox">
                        <i data-feather="inbox"></i> <?php _e('Inbox', 'container-leasing'); ?>
                        <span class="container-leasing-email-count" id="inbox-count">0</span>
                    </li>
                    <li class="container-leasing-email-tab" data-tab="sent">
                        <i data-feather="send"></i> <?php _e('Sent', 'container-leasing'); ?>
                        <span class="container-leasing-email-count" id="sent-count">0</span>
                    </li>
                    <li class="container-leasing-email-tab" data-tab="drafts">
                        <i data-feather="file"></i> <?php _e('Drafts', 'container-leasing'); ?>
                        <span class="container-leasing-email-count" id="drafts-count">0</span>
                    </li>
                    <li class="container-leasing-email-tab" data-tab="archived">
                        <i data-feather="archive"></i> <?php _e('Archived', 'container-leasing'); ?>
                        <span class="container-leasing-email-count" id="archived-count">0</span>
                    </li>
                </ul>
            </div>
        </div>
        
        <div class="container-leasing-email-content-wrapper">
            <!-- Inbox Tab Content -->
            <div id="container-leasing-email-inbox" class="container-leasing-email-content active">
                <div class="container-leasing-email-header">
                    <h2><?php _e('Inbox', 'container-leasing'); ?></h2>
                    <div class="container-leasing-email-search">
                        <input type="text" id="inbox-search" placeholder="<?php esc_attr_e('Search emails...', 'container-leasing'); ?>">
                        <button class="container-leasing-button container-leasing-button-small">
                            <i data-feather="search"></i>
                        </button>
                    </div>
                </div>
                
                <div class="container-leasing-email-list" id="inbox-email-list">
                    <?php
                    // Get inbox emails
                    global $wpdb;
                    $table_email = $wpdb->prefix . 'container_emails';
                    $user_id = get_current_user_id();
                    
                    $inbox_emails = $wpdb->get_results($wpdb->prepare(
                        "SELECT * FROM $table_email WHERE user_id = %d AND folder = 'inbox' ORDER BY sent_date DESC",
                        $user_id
                    ));
                    
                    if ($inbox_emails) {
                        foreach ($inbox_emails as $email) {
                            ?>
                            <div class="container-leasing-email-item" data-id="<?php echo esc_attr($email->id); ?>">
                                <div class="container-leasing-email-item-header">
                                    <div class="container-leasing-email-sender"><?php echo esc_html($email->recipient); ?></div>
                                    <div class="container-leasing-email-date"><?php echo date_i18n(get_option('date_format'), strtotime($email->sent_date)); ?></div>
                                </div>
                                <div class="container-leasing-email-subject"><?php echo esc_html($email->subject); ?></div>
                                <div class="container-leasing-email-preview"><?php echo wp_trim_words(esc_html($email->content), 10); ?></div>
                            </div>
                            <?php
                        }
                    } else {
                        ?>
                        <div class="container-leasing-email-empty">
                            <div class="container-leasing-email-empty-icon">
                                <i data-feather="inbox"></i>
                            </div>
                            <h3><?php _e('Your inbox is empty', 'container-leasing'); ?></h3>
                            <p><?php _e('Messages from your customers will appear here.', 'container-leasing'); ?></p>
                        </div>
                        <?php
                    }
                    ?>
                </div>
            </div>
            
            <!-- Sent Tab Content -->
            <div id="container-leasing-email-sent" class="container-leasing-email-content">
                <div class="container-leasing-email-header">
                    <h2><?php _e('Sent', 'container-leasing'); ?></h2>
                    <div class="container-leasing-email-search">
                        <input type="text" id="sent-search" placeholder="<?php esc_attr_e('Search emails...', 'container-leasing'); ?>">
                        <button class="container-leasing-button container-leasing-button-small">
                            <i data-feather="search"></i>
                        </button>
                    </div>
                </div>
                
                <div class="container-leasing-email-list" id="sent-email-list">
                    <?php
                    // Get sent emails
                    $sent_emails = $wpdb->get_results($wpdb->prepare(
                        "SELECT * FROM $table_email WHERE user_id = %d AND folder = 'sent' ORDER BY sent_date DESC",
                        $user_id
                    ));
                    
                    if ($sent_emails) {
                        foreach ($sent_emails as $email) {
                            ?>
                            <div class="container-leasing-email-item" data-id="<?php echo esc_attr($email->id); ?>">
                                <div class="container-leasing-email-item-header">
                                    <div class="container-leasing-email-sender"><?php echo esc_html(__('To:', 'container-leasing')); ?> <?php echo esc_html($email->recipient); ?></div>
                                    <div class="container-leasing-email-date"><?php echo date_i18n(get_option('date_format'), strtotime($email->sent_date)); ?></div>
                                </div>
                                <div class="container-leasing-email-subject"><?php echo esc_html($email->subject); ?></div>
                                <div class="container-leasing-email-preview"><?php echo wp_trim_words(esc_html($email->content), 10); ?></div>
                            </div>
                            <?php
                        }
                    } else {
                        ?>
                        <div class="container-leasing-email-empty">
                            <div class="container-leasing-email-empty-icon">
                                <i data-feather="send"></i>
                            </div>
                            <h3><?php _e('No sent emails', 'container-leasing'); ?></h3>
                            <p><?php _e('Emails you send will appear here.', 'container-leasing'); ?></p>
                        </div>
                        <?php
                    }
                    ?>
                </div>
            </div>
            
            <!-- Drafts Tab Content -->
            <div id="container-leasing-email-drafts" class="container-leasing-email-content">
                <div class="container-leasing-email-header">
                    <h2><?php _e('Drafts', 'container-leasing'); ?></h2>
                    <div class="container-leasing-email-search">
                        <input type="text" id="drafts-search" placeholder="<?php esc_attr_e('Search drafts...', 'container-leasing'); ?>">
                        <button class="container-leasing-button container-leasing-button-small">
                            <i data-feather="search"></i>
                        </button>
                    </div>
                </div>
                
                <div class="container-leasing-email-list" id="drafts-email-list">
                    <?php
                    // Get draft emails
                    $draft_emails = $wpdb->get_results($wpdb->prepare(
                        "SELECT * FROM $table_email WHERE user_id = %d AND folder = 'drafts' ORDER BY sent_date DESC",
                        $user_id
                    ));
                    
                    if ($draft_emails) {
                        foreach ($draft_emails as $email) {
                            ?>
                            <div class="container-leasing-email-item" data-id="<?php echo esc_attr($email->id); ?>">
                                <div class="container-leasing-email-item-header">
                                    <div class="container-leasing-email-sender"><?php echo empty($email->recipient) ? __('No recipient', 'container-leasing') : esc_html($email->recipient); ?></div>
                                    <div class="container-leasing-email-date"><?php echo date_i18n(get_option('date_format'), strtotime($email->sent_date)); ?></div>
                                </div>
                                <div class="container-leasing-email-subject"><?php echo empty($email->subject) ? __('(No subject)', 'container-leasing') : esc_html($email->subject); ?></div>
                                <div class="container-leasing-email-preview"><?php echo wp_trim_words(esc_html($email->content), 10); ?></div>
                            </div>
                            <?php
                        }
                    } else {
                        ?>
                        <div class="container-leasing-email-empty">
                            <div class="container-leasing-email-empty-icon">
                                <i data-feather="file"></i>
                            </div>
                            <h3><?php _e('No drafts', 'container-leasing'); ?></h3>
                            <p><?php _e('Saved drafts will appear here.', 'container-leasing'); ?></p>
                        </div>
                        <?php
                    }
                    ?>
                </div>
            </div>
            
            <!-- Archived Tab Content -->
            <div id="container-leasing-email-archived" class="container-leasing-email-content">
                <div class="container-leasing-email-header">
                    <h2><?php _e('Archived', 'container-leasing'); ?></h2>
                    <div class="container-leasing-email-search">
                        <input type="text" id="archived-search" placeholder="<?php esc_attr_e('Search archived...', 'container-leasing'); ?>">
                        <button class="container-leasing-button container-leasing-button-small">
                            <i data-feather="search"></i>
                        </button>
                    </div>
                </div>
                
                <div class="container-leasing-email-list" id="archived-email-list">
                    <?php
                    // Get archived emails
                    $archived_emails = $wpdb->get_results($wpdb->prepare(
                        "SELECT * FROM $table_email WHERE user_id = %d AND folder = 'archived' ORDER BY sent_date DESC",
                        $user_id
                    ));
                    
                    if ($archived_emails) {
                        foreach ($archived_emails as $email) {
                            ?>
                            <div class="container-leasing-email-item" data-id="<?php echo esc_attr($email->id); ?>">
                                <div class="container-leasing-email-item-header">
                                    <div class="container-leasing-email-sender"><?php echo esc_html($email->recipient); ?></div>
                                    <div class="container-leasing-email-date"><?php echo date_i18n(get_option('date_format'), strtotime($email->sent_date)); ?></div>
                                </div>
                                <div class="container-leasing-email-subject"><?php echo esc_html($email->subject); ?></div>
                                <div class="container-leasing-email-preview"><?php echo wp_trim_words(esc_html($email->content), 10); ?></div>
                            </div>
                            <?php
                        }
                    } else {
                        ?>
                        <div class="container-leasing-email-empty">
                            <div class="container-leasing-email-empty-icon">
                                <i data-feather="archive"></i>
                            </div>
                            <h3><?php _e('No archived emails', 'container-leasing'); ?></h3>
                            <p><?php _e('Archived emails will appear here.', 'container-leasing'); ?></p>
                        </div>
                        <?php
                    }
                    ?>
                </div>
            </div>
            
            <!-- Email Detail View -->
            <div id="container-leasing-email-detail" class="container-leasing-email-content" style="display: none;">
                <div class="container-leasing-email-detail-header">
                    <button id="back-to-email-list" class="container-leasing-button container-leasing-button-small">
                        <i data-feather="arrow-left"></i> <?php _e('Back', 'container-leasing'); ?>
                    </button>
                    <div class="container-leasing-email-detail-actions">
                        <button class="container-leasing-button container-leasing-button-small email-reply-btn">
                            <i data-feather="reply"></i> <?php _e('Reply', 'container-leasing'); ?>
                        </button>
                        <button class="container-leasing-button container-leasing-button-small email-archive-btn">
                            <i data-feather="archive"></i> <?php _e('Archive', 'container-leasing'); ?>
                        </button>
                        <button class="container-leasing-button container-leasing-button-small email-delete-btn">
                            <i data-feather="trash-2"></i> <?php _e('Delete', 'container-leasing'); ?>
                        </button>
                    </div>
                </div>
                
                <div class="container-leasing-email-detail-content">
                    <div class="container-leasing-email-detail-subject"></div>
                    <div class="container-leasing-email-detail-info">
                        <div class="container-leasing-email-detail-sender"></div>
                        <div class="container-leasing-email-detail-date"></div>
                    </div>
                    <div class="container-leasing-email-detail-body"></div>
                </div>
            </div>
            
            <!-- Compose Email View -->
            <div id="container-leasing-email-compose" class="container-leasing-email-content" style="display: none;">
                <div class="container-leasing-email-compose-header">
                    <h2><?php _e('Compose Email', 'container-leasing'); ?></h2>
                    <button id="close-compose" class="container-leasing-button container-leasing-button-small">
                        <i data-feather="x"></i>
                    </button>
                </div>
                
                <form id="email-compose-form" class="container-leasing-email-compose-form">
                    <div class="container-leasing-form-group">
                        <label for="email-to"><?php _e('To:', 'container-leasing'); ?></label>
                        <input type="email" id="email-to" name="email_to" required>
                    </div>
                    
                    <div class="container-leasing-form-group">
                        <label for="email-subject"><?php _e('Subject:', 'container-leasing'); ?></label>
                        <input type="text" id="email-subject" name="email_subject" required>
                    </div>
                    
                    <div class="container-leasing-form-group">
                        <label for="email-content"><?php _e('Message:', 'container-leasing'); ?></label>
                        <textarea id="email-content" name="email_content" rows="10" required></textarea>
                    </div>
                    
                    <div class="container-leasing-email-compose-actions">
                        <button type="submit" class="container-leasing-button container-leasing-button-primary">
                            <i data-feather="send"></i> <?php _e('Send', 'container-leasing'); ?>
                        </button>
                        <button type="button" id="save-draft" class="container-leasing-button container-leasing-button-outline">
                            <i data-feather="save"></i> <?php _e('Save Draft', 'container-leasing'); ?>
                        </button>
                        <button type="button" id="discard-email" class="container-leasing-button container-leasing-button-outline">
                            <i data-feather="trash"></i> <?php _e('Discard', 'container-leasing'); ?>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>

<script>
    jQuery(document).ready(function($) {
        // Initialize Feather icons
        if (typeof feather !== 'undefined') {
            feather.replace();
        }
        
        // Update email counts
        $('#inbox-count').text('<?php echo count($inbox_emails); ?>');
        $('#sent-count').text('<?php echo count($sent_emails); ?>');
        $('#drafts-count').text('<?php echo count($draft_emails); ?>');
        $('#archived-count').text('<?php echo count($archived_emails); ?>');
        
        // Tab switching
        $('.container-leasing-email-tab').on('click', function() {
            const tab = $(this).data('tab');
            
            // Hide email detail and compose views
            $('#container-leasing-email-detail').hide();
            $('#container-leasing-email-compose').hide();
            
            // Show the appropriate tab content
            $('.container-leasing-email-tab').removeClass('active');
            $(this).addClass('active');
            
            $('.container-leasing-email-content').removeClass('active').hide();
            $(`#container-leasing-email-${tab}`).addClass('active').show();
        });
        
        // Show email detail when clicking on an email
        $('.container-leasing-email-item').on('click', function() {
            const emailId = $(this).data('id');
            
            // AJAX call to get email details
            $.ajax({
                url: container_leasing.ajax_url,
                type: 'POST',
                data: {
                    action: 'container_leasing_get_email',
                    email_id: emailId,
                    nonce: container_leasing.nonce
                },
                success: function(response) {
                    if (response.success) {
                        // Populate the email detail view
                        $('#container-leasing-email-detail .container-leasing-email-detail-subject').text(response.data.subject);
                        $('#container-leasing-email-detail .container-leasing-email-detail-sender').text(response.data.sender);
                        $('#container-leasing-email-detail .container-leasing-email-detail-date').text(response.data.date);
                        $('#container-leasing-email-detail .container-leasing-email-detail-body').html(response.data.content);
                        
                        // Store the email ID for reply/archive/delete actions
                        $('#container-leasing-email-detail').data('email-id', emailId);
                        
                        // Hide the email list and show the detail view
                        $('.container-leasing-email-content.active').removeClass('active').hide();
                        $('#container-leasing-email-detail').addClass('active').show();
                    } else {
                        alert(response.data);
                    }
                },
                error: function() {
                    alert('<?php _e('Error loading email details. Please try again.', 'container-leasing'); ?>');
                }
            });
        });
        
        // Back button in email detail view
        $('#back-to-email-list').on('click', function() {
            // Hide the detail view and show the previously active tab
            $('#container-leasing-email-detail').removeClass('active').hide();
            const activeTab = $('.container-leasing-email-tab.active').data('tab');
            $(`#container-leasing-email-${activeTab}`).addClass('active').show();
        });
        
        // Compose new email
        $('#compose-email').on('click', function() {
            // Clear the form
            $('#email-compose-form')[0].reset();
            
            // Hide any active content and show the compose form
            $('.container-leasing-email-content.active').removeClass('active').hide();
            $('#container-leasing-email-compose').addClass('active').show();
        });
        
        // Close compose form
        $('#close-compose').on('click', function() {
            // Hide compose form and show the previously active tab
            $('#container-leasing-email-compose').removeClass('active').hide();
            const activeTab = $('.container-leasing-email-tab.active').data('tab');
            $(`#container-leasing-email-${activeTab}`).addClass('active').show();
        });
        
        // Send email
        $('#email-compose-form').on('submit', function(e) {
            e.preventDefault();
            
            const to = $('#email-to').val();
            const subject = $('#email-subject').val();
            const content = $('#email-content').val();
            
            // Basic validation
            if (!to || !subject || !content) {
                alert('<?php _e('Please fill in all fields.', 'container-leasing'); ?>');
                return;
            }
            
            // Send email via AJAX
            $.ajax({
                url: container_leasing.ajax_url,
                type: 'POST',
                data: {
                    action: 'container_leasing_send_email',
                    email_to: to,
                    email_subject: subject,
                    email_content: content,
                    nonce: container_leasing.nonce
                },
                beforeSend: function() {
                    // Disable submit button and show loading indicator
                    $('#email-compose-form button[type="submit"]').prop('disabled', true).html('<i data-feather="loader"></i> <?php _e('Sending...', 'container-leasing'); ?>');
                    if (typeof feather !== 'undefined') {
                        feather.replace();
                    }
                },
                success: function(response) {
                    if (response.success) {
                        // Show success message
                        alert(response.data.message);
                        
                        // Close compose form and refresh the sent tab
                        $('#container-leasing-email-compose').removeClass('active').hide();
                        
                        // Update sent count
                        $('#sent-count').text(parseInt($('#sent-count').text()) + 1);
                        
                        // Switch to sent tab and refresh it
                        $('.container-leasing-email-tab[data-tab="sent"]').trigger('click');
                        
                        // Reload the page to refresh email lists
                        window.location.reload();
                    } else {
                        alert(response.data);
                    }
                },
                error: function() {
                    alert('<?php _e('Error sending email. Please try again.', 'container-leasing'); ?>');
                },
                complete: function() {
                    // Re-enable submit button
                    $('#email-compose-form button[type="submit"]').prop('disabled', false).html('<i data-feather="send"></i> <?php _e('Send', 'container-leasing'); ?>');
                    if (typeof feather !== 'undefined') {
                        feather.replace();
                    }
                }
            });
        });
        
        // Save draft
        $('#save-draft').on('click', function() {
            const to = $('#email-to').val();
            const subject = $('#email-subject').val();
            const content = $('#email-content').val();
            
            // Save draft via AJAX
            $.ajax({
                url: container_leasing.ajax_url,
                type: 'POST',
                data: {
                    action: 'container_leasing_save_draft',
                    email_to: to,
                    email_subject: subject,
                    email_content: content,
                    nonce: container_leasing.nonce
                },
                beforeSend: function() {
                    $(this).prop('disabled', true).html('<i data-feather="loader"></i> <?php _e('Saving...', 'container-leasing'); ?>');
                    if (typeof feather !== 'undefined') {
                        feather.replace();
                    }
                },
                success: function(response) {
                    if (response.success) {
                        alert(response.data.message);
                        
                        // Update drafts count
                        $('#drafts-count').text(parseInt($('#drafts-count').text()) + 1);
                        
                        // Close compose form and switch to drafts tab
                        $('#container-leasing-email-compose').removeClass('active').hide();
                        $('.container-leasing-email-tab[data-tab="drafts"]').trigger('click');
                        
                        // Reload the page to refresh email lists
                        window.location.reload();
                    } else {
                        alert(response.data);
                    }
                },
                error: function() {
                    alert('<?php _e('Error saving draft. Please try again.', 'container-leasing'); ?>');
                },
                complete: function() {
                    $('#save-draft').prop('disabled', false).html('<i data-feather="save"></i> <?php _e('Save Draft', 'container-leasing'); ?>');
                    if (typeof feather !== 'undefined') {
                        feather.replace();
                    }
                }
            });
        });
        
        // Discard email
        $('#discard-email').on('click', function() {
            if (confirm('<?php _e('Are you sure you want to discard this email?', 'container-leasing'); ?>')) {
                // Clear the form
                $('#email-compose-form')[0].reset();
                
                // Close compose form and show the previously active tab
                $('#container-leasing-email-compose').removeClass('active').hide();
                const activeTab = $('.container-leasing-email-tab.active').data('tab');
                $(`#container-leasing-email-${activeTab}`).addClass('active').show();
            }
        });
        
        // Reply to email
        $('.email-reply-btn').on('click', function() {
            const emailId = $('#container-leasing-email-detail').data('email-id');
            
            // Get email details for reply
            $.ajax({
                url: container_leasing.ajax_url,
                type: 'POST',
                data: {
                    action: 'container_leasing_get_email',
                    email_id: emailId,
                    nonce: container_leasing.nonce
                },
                success: function(response) {
                    if (response.success) {
                        // Populate the compose form for reply
                        $('#email-to').val(response.data.sender);
                        $('#email-subject').val('Re: ' + response.data.subject);
                        $('#email-content').val('\n\n------------------\n' + response.data.content);
                        
                        // Hide the email detail view and show the compose form
                        $('#container-leasing-email-detail').removeClass('active').hide();
                        $('#container-leasing-email-compose').addClass('active').show();
                    } else {
                        alert(response.data);
                    }
                },
                error: function() {
                    alert('<?php _e('Error loading email details for reply. Please try again.', 'container-leasing'); ?>');
                }
            });
        });
        
        // Archive email
        $('.email-archive-btn').on('click', function() {
            const emailId = $('#container-leasing-email-detail').data('email-id');
            
            if (confirm('<?php _e('Are you sure you want to archive this email?', 'container-leasing'); ?>')) {
                $.ajax({
                    url: container_leasing.ajax_url,
                    type: 'POST',
                    data: {
                        action: 'container_leasing_archive_email',
                        email_id: emailId,
                        nonce: container_leasing.nonce
                    },
                    success: function(response) {
                        if (response.success) {
                            alert(response.data.message);
                            
                            // Update inbox and archived counts
                            $('#inbox-count').text(Math.max(0, parseInt($('#inbox-count').text()) - 1));
                            $('#archived-count').text(parseInt($('#archived-count').text()) + 1);
                            
                            // Go back to the inbox
                            $('#back-to-email-list').trigger('click');
                            
                            // Reload the page to refresh email lists
                            window.location.reload();
                        } else {
                            alert(response.data);
                        }
                    },
                    error: function() {
                        alert('<?php _e('Error archiving email. Please try again.', 'container-leasing'); ?>');
                    }
                });
            }
        });
        
        // Delete email
        $('.email-delete-btn').on('click', function() {
            const emailId = $('#container-leasing-email-detail').data('email-id');
            
            if (confirm('<?php _e('Are you sure you want to delete this email? This action cannot be undone.', 'container-leasing'); ?>')) {
                $.ajax({
                    url: container_leasing.ajax_url,
                    type: 'POST',
                    data: {
                        action: 'container_leasing_delete_email',
                        email_id: emailId,
                        nonce: container_leasing.nonce
                    },
                    success: function(response) {
                        if (response.success) {
                            alert(response.data.message);
                            
                            // Update count of the active tab
                            const activeTab = $('.container-leasing-email-tab.active').data('tab');
                            $(`#${activeTab}-count`).text(Math.max(0, parseInt($(`#${activeTab}-count`).text()) - 1));
                            
                            // Go back to the active tab
                            $('#back-to-email-list').trigger('click');
                            
                            // Reload the page to refresh email lists
                            window.location.reload();
                        } else {
                            alert(response.data);
                        }
                    },
                    error: function() {
                        alert('<?php _e('Error deleting email. Please try again.', 'container-leasing'); ?>');
                    }
                });
            }
        });
        
        // Search functionality
        $('#inbox-search, #sent-search, #drafts-search, #archived-search').on('keyup', function() {
            const searchTerm = $(this).val().toLowerCase();
            const listId = $(this).attr('id').replace('-search', '-email-list');
            
            $(`#${listId} .container-leasing-email-item`).each(function() {
                const subject = $(this).find('.container-leasing-email-subject').text().toLowerCase();
                const sender = $(this).find('.container-leasing-email-sender').text().toLowerCase();
                const preview = $(this).find('.container-leasing-email-preview').text().toLowerCase();
                
                if (subject.includes(searchTerm) || sender.includes(searchTerm) || preview.includes(searchTerm)) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
        });
    });
</script>

<style>
    .container-leasing-email-page {
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
    
    .container-leasing-email-wrapper {
        display: flex;
        background-color: #ffffff;
        border: 1px solid #e0e0e0;
        border-radius: 6px;
        overflow: hidden;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
    
    .container-leasing-email-sidebar {
        width: 250px;
        background-color: #f8f9fa;
        border-right: 1px solid #e0e0e0;
        padding: 20px;
    }
    
    .container-leasing-email-compose-btn {
        width: 100%;
        margin-bottom: 20px;
    }
    
    .container-leasing-email-folders ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    
    .container-leasing-email-folders li {
        padding: 10px 15px;
        margin-bottom: 5px;
        border-radius: 4px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        transition: background-color 0.2s;
    }
    
    .container-leasing-email-folders li:hover {
        background-color: #e9ecef;
    }
    
    .container-leasing-email-folders li.active {
        background-color: #e3f2fd;
        color: #0073aa;
    }
    
    .container-leasing-email-folders li svg {
        margin-right: 10px;
    }
    
    .container-leasing-email-count {
        background-color: #e0e0e0;
        border-radius: 10px;
        padding: 2px 6px;
        font-size: 12px;
        font-weight: 500;
    }
    
    .container-leasing-email-content-wrapper {
        flex: 1;
    }
    
    .container-leasing-email-content {
        display: none;
        height: 100%;
    }
    
    .container-leasing-email-content.active {
        display: block;
    }
    
    .container-leasing-email-header {
        padding: 15px 20px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    
    .container-leasing-email-header h2 {
        margin: 0;
        font-size: 18px;
    }
    
    .container-leasing-email-search {
        display: flex;
        align-items: center;
    }
    
    .container-leasing-email-search input {
        padding: 8px 10px;
        border: 1px solid #e0e0e0;
        border-radius: 4px 0 0 4px;
        width: 200px;
    }
    
    .container-leasing-email-search button {
        border-radius: 0 4px 4px 0;
        margin-left: -1px;
    }
    
    .container-leasing-email-item {
        padding: 15px 20px;
        border-bottom: 1px solid #e0e0e0;
        cursor: pointer;
        transition: background-color 0.2s;
    }
    
    .container-leasing-email-item:hover {
        background-color: #f8f9fa;
    }
    
    .container-leasing-email-item-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
    }
    
    .container-leasing-email-sender {
        font-weight: 500;
    }
    
    .container-leasing-email-date {
        color: #666;
        font-size: 12px;
    }
    
    .container-leasing-email-subject {
        font-weight: 500;
        margin-bottom: 5px;
    }
    
    .container-leasing-email-preview {
        color: #666;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    
    .container-leasing-email-empty {
        text-align: center;
        padding: 50px 20px;
        color: #666;
    }
    
    .container-leasing-email-empty-icon {
        margin-bottom: 15px;
        color: #999;
    }
    
    .container-leasing-email-empty-icon svg {
        width: 48px;
        height: 48px;
    }
    
    .container-leasing-email-empty h3 {
        margin-top: 0;
        margin-bottom: 10px;
        font-size: 18px;
    }
    
    .container-leasing-email-empty p {
        margin-bottom: 0;
    }
    
    /* Email Detail Styles */
    .container-leasing-email-detail-header {
        padding: 15px 20px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .container-leasing-email-detail-actions {
        display: flex;
        gap: 10px;
    }
    
    .container-leasing-email-detail-content {
        padding: 20px;
    }
    
    .container-leasing-email-detail-subject {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 15px;
    }
    
    .container-leasing-email-detail-info {
        display: flex;
        justify-content: space-between;
        margin-bottom: 25px;
        padding-bottom: 15px;
        border-bottom: 1px solid #e0e0e0;
    }
    
    .container-leasing-email-detail-sender {
        font-weight: 500;
    }
    
    .container-leasing-email-detail-date {
        color: #666;
    }
    
    .container-leasing-email-detail-body {
        line-height: 1.6;
    }
    
    /* Compose Email Styles */
    .container-leasing-email-compose-header {
        padding: 15px 20px;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .container-leasing-email-compose-header h2 {
        margin: 0;
        font-size: 18px;
    }
    
    .container-leasing-email-compose-form {
        padding: 20px;
    }
    
    .container-leasing-email-compose-form .container-leasing-form-group {
        margin-bottom: 20px;
    }
    
    .container-leasing-email-compose-form label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
    }
    
    .container-leasing-email-compose-form input,
    .container-leasing-email-compose-form textarea {
        width: 100%;
        padding: 10px;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
    }
    
    .container-leasing-email-compose-actions {
        display: flex;
        gap: 10px;
    }
    
    @media (max-width: 768px) {
        .container-leasing-email-wrapper {
            flex-direction: column;
        }
        
        .container-leasing-email-sidebar {
            width: 100%;
            border-right: none;
            border-bottom: 1px solid #e0e0e0;
        }
        
        .container-leasing-email-folders ul {
            display: flex;
            flex-wrap: wrap;
        }
        
        .container-leasing-email-folders li {
            flex: 1 1 auto;
        }
        
        .container-leasing-email-header {
            flex-direction: column;
            align-items: flex-start;
        }
        
        .container-leasing-email-search {
            width: 100%;
            margin-top: 10px;
        }
        
        .container-leasing-email-search input {
            width: 100%;
        }
        
        .container-leasing-email-detail-info {
            flex-direction: column;
        }
        
        .container-leasing-email-detail-sender {
            margin-bottom: 5px;
        }
    }
</style>

<?php
get_footer();
?>
