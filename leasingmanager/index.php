<?php
/**
 * Container Leasing Platform Demo Page
 *
 * This page demonstrates the core features of the Container Leasing Platform plugin.
 *
 * @package Container_Leasing
 */

// Set up WordPress-like environment
define('WPINC', '');  // Define for file checking

// Include plugin files for testing
require_once 'container-leasing.php';

// Simple header
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Container Leasing Platform Demo</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background-color: #0073aa;
            color: white;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .header h1 {
            margin: 0;
        }
        .container {
            display: grid;
            grid-template-columns: 1fr 3fr;
            gap: 20px;
        }
        .sidebar {
            background-color: #f5f5f5;
            padding: 20px;
            border-radius: 5px;
        }
        .sidebar ul {
            list-style: none;
            padding: 0;
        }
        .sidebar li {
            margin-bottom: 10px;
        }
        .sidebar a {
            display: block;
            padding: 10px;
            background-color: #fff;
            text-decoration: none;
            color: #0073aa;
            border-radius: 3px;
            transition: background-color 0.2s;
        }
        .sidebar a:hover {
            background-color: #e9f5fb;
        }
        .content {
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        .dashboard-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .dashboard-card {
            background-color: #f9f9f9;
            border-radius: 5px;
            padding: 20px;
            border: 1px solid #eee;
        }
        .dashboard-card h3 {
            margin-top: 0;
            color: #0073aa;
        }
        .stats {
            font-size: 2em;
            font-weight: bold;
            color: #0073aa;
        }
        .button {
            display: inline-block;
            background-color: #0073aa;
            color: white;
            padding: 10px 15px;
            text-decoration: none;
            border-radius: 3px;
            transition: background-color 0.2s;
        }
        .button:hover {
            background-color: #005d87;
        }
        .container-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        .container-item {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 20px;
        }
        .container-item h3 {
            margin-top: 0;
            color: #0073aa;
        }
        .container-spec {
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #eee;
            padding: 5px 0;
        }
        .container-spec span:first-child {
            font-weight: bold;
        }
        .container-actions {
            margin-top: 15px;
            display: flex;
            justify-content: space-between;
        }
        .paypal-button {
            background-color: #0070ba;
            color: white;
            border: none;
            padding: 10px 15px;
            border-radius: 3px;
            cursor: pointer;
            font-weight: bold;
        }
        .login-form {
            max-width: 400px;
            margin: 0 auto;
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            border: 1px solid #ddd;
        }
        .form-group {
            margin-bottom: 15px;
        }
        .form-group label {
            display: block;
            margin-bottom: 5px;
        }
        .form-group input {
            width: 100%;
            padding: 8px;
            box-sizing: border-box;
            border: 1px solid #ddd;
            border-radius: 3px;
        }
        .hidden {
            display: none;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>Container Leasing Platform</h1>
        <a href="#" class="button login-toggle">Login</a>
    </div>

    <div class="login-form hidden">
        <h2>Login</h2>
        <form id="login-form">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" id="username" name="username" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required>
            </div>
            <button type="submit" class="button">Login</button>
        </form>
    </div>

    <div class="container">
        <div class="sidebar">
            <h2>Navigation</h2>
            <ul>
                <li><a href="#" class="nav-link" data-section="dashboard">Dashboard</a></li>
                <li><a href="#" class="nav-link" data-section="containers">Containers</a></li>
                <li><a href="#" class="nav-link" data-section="insights">Insights</a></li>
                <li><a href="#" class="nav-link" data-section="invoices">Invoices</a></li>
                <li><a href="#" class="nav-link" data-section="emails">Email Management</a></li>
            </ul>
        </div>

        <div class="content">
            <!-- Dashboard Section -->
            <div id="dashboard-section" class="content-section">
                <h2>Dashboard</h2>
                <p>Welcome to your Container Leasing Dashboard. Here's an overview of your container fleet and leasing operations.</p>
                
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3>Total Containers</h3>
                        <div class="stats">42</div>
                        <p>Containers in your fleet</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>Available</h3>
                        <div class="stats">28</div>
                        <p>Containers ready for lease</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>Leased</h3>
                        <div class="stats">14</div>
                        <p>Currently leased containers</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>Revenue</h3>
                        <div class="stats">$8,750</div>
                        <p>This month's revenue</p>
                    </div>
                </div>
                
                <h3>Recent Contracts</h3>
                <table width="100%" border="0" cellspacing="0" cellpadding="10" style="border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th align="left">Container</th>
                            <th align="left">Customer</th>
                            <th align="left">Start Date</th>
                            <th align="left">End Date</th>
                            <th align="left">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td>CONT-20-DRY-1432</td>
                            <td>Acme Shipping Co.</td>
                            <td>2025-05-01</td>
                            <td>2025-08-01</td>
                            <td>Active</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td>CONT-40-REF-0984</td>
                            <td>Global Transport Ltd.</td>
                            <td>2025-04-15</td>
                            <td>2025-07-15</td>
                            <td>Active</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td>CONT-40-DRY-2375</td>
                            <td>SeaFreight Solutions</td>
                            <td>2025-03-22</td>
                            <td>2025-06-22</td>
                            <td>Active</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Containers Section -->
            <div id="containers-section" class="content-section hidden">
                <h2>Available Containers</h2>
                <p>Browse and lease containers from our available inventory.</p>
                
                <div class="container-grid">
                    <div class="container-item">
                        <h3>20ft Dry Container</h3>
                        <div class="container-spec">
                            <span>Type:</span>
                            <span>Dry</span>
                        </div>
                        <div class="container-spec">
                            <span>Size:</span>
                            <span>20ft</span>
                        </div>
                        <div class="container-spec">
                            <span>Origin:</span>
                            <span>Shanghai, China</span>
                        </div>
                        <div class="container-spec">
                            <span>Destination:</span>
                            <span>Los Angeles, USA</span>
                        </div>
                        <div class="container-spec">
                            <span>Price:</span>
                            <span>$1,200</span>
                        </div>
                        <div class="container-actions">
                            <a href="#" class="button">Details</a>
                            <button class="paypal-button">Lease Now</button>
                        </div>
                    </div>
                    
                    <div class="container-item">
                        <h3>40ft Refrigerated Container</h3>
                        <div class="container-spec">
                            <span>Type:</span>
                            <span>Refrigerated</span>
                        </div>
                        <div class="container-spec">
                            <span>Size:</span>
                            <span>40ft</span>
                        </div>
                        <div class="container-spec">
                            <span>Origin:</span>
                            <span>Rotterdam, Netherlands</span>
                        </div>
                        <div class="container-spec">
                            <span>Destination:</span>
                            <span>New York, USA</span>
                        </div>
                        <div class="container-spec">
                            <span>Price:</span>
                            <span>$2,500</span>
                        </div>
                        <div class="container-actions">
                            <a href="#" class="button">Details</a>
                            <button class="paypal-button">Lease Now</button>
                        </div>
                    </div>
                    
                    <div class="container-item">
                        <h3>40ft Open Top Container</h3>
                        <div class="container-spec">
                            <span>Type:</span>
                            <span>Open Top</span>
                        </div>
                        <div class="container-spec">
                            <span>Size:</span>
                            <span>40ft</span>
                        </div>
                        <div class="container-spec">
                            <span>Origin:</span>
                            <span>Hamburg, Germany</span>
                        </div>
                        <div class="container-spec">
                            <span>Destination:</span>
                            <span>Montreal, Canada</span>
                        </div>
                        <div class="container-spec">
                            <span>Price:</span>
                            <span>$2,200</span>
                        </div>
                        <div class="container-actions">
                            <a href="#" class="button">Details</a>
                            <button class="paypal-button">Lease Now</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Insights Section -->
            <div id="insights-section" class="content-section hidden">
                <h2>Insights Dashboard</h2>
                <p>Analyze your container fleet performance and leasing metrics.</p>
                
                <div style="width: 100%; height: 300px; background-color: #f5f5f5; border-radius: 5px; display: flex; justify-content: center; align-items: center; margin-bottom: 20px;">
                    <p style="color: #666;">Container Utilization Chart</p>
                </div>
                
                <div class="dashboard-grid">
                    <div class="dashboard-card">
                        <h3>Utilization Rate</h3>
                        <div class="stats">72%</div>
                        <p>Fleet utilization</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>Average Lease Duration</h3>
                        <div class="stats">94</div>
                        <p>Days per lease</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>Top Container Type</h3>
                        <div class="stats">40ft Dry</div>
                        <p>Most leased type</p>
                    </div>
                    <div class="dashboard-card">
                        <h3>Average Revenue</h3>
                        <div class="stats">$1,850</div>
                        <p>Per container</p>
                    </div>
                </div>
                
                <h3>Container Locations</h3>
                <div style="width: 100%; height: 400px; background-color: #f5f5f5; border-radius: 5px; display: flex; justify-content: center; align-items: center;">
                    <p style="color: #666;">Global Container Location Map</p>
                </div>
            </div>

            <!-- Invoices Section -->
            <div id="invoices-section" class="content-section hidden">
                <h2>Invoices</h2>
                <p>View and manage your container leasing invoices.</p>
                
                <table width="100%" border="0" cellspacing="0" cellpadding="10" style="border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #f5f5f5;">
                            <th align="left">Invoice #</th>
                            <th align="left">Container</th>
                            <th align="left">Customer</th>
                            <th align="left">Date</th>
                            <th align="left">Amount</th>
                            <th align="left">Status</th>
                            <th align="left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td>INV-2025-0042</td>
                            <td>CONT-20-DRY-1432</td>
                            <td>Acme Shipping Co.</td>
                            <td>2025-05-01</td>
                            <td>$1,200.00</td>
                            <td>Paid</td>
                            <td><a href="#" class="button">View</a></td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td>INV-2025-0041</td>
                            <td>CONT-40-REF-0984</td>
                            <td>Global Transport Ltd.</td>
                            <td>2025-04-15</td>
                            <td>$2,500.00</td>
                            <td>Paid</td>
                            <td><a href="#" class="button">View</a></td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td>INV-2025-0040</td>
                            <td>CONT-40-DRY-2375</td>
                            <td>SeaFreight Solutions</td>
                            <td>2025-03-22</td>
                            <td>$1,800.00</td>
                            <td>Paid</td>
                            <td><a href="#" class="button">View</a></td>
                        </tr>
                        <tr style="border-bottom: 1px solid #eee;">
                            <td>INV-2025-0039</td>
                            <td>CONT-20-OPEN-3217</td>
                            <td>Pacific Cargo Inc.</td>
                            <td>2025-03-15</td>
                            <td>$950.00</td>
                            <td>Overdue</td>
                            <td><a href="#" class="button">View</a></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Email Management Section -->
            <div id="emails-section" class="content-section hidden">
                <h2>Email Management</h2>
                <p>Manage your email communications with customers.</p>
                
                <div style="display: grid; grid-template-columns: 1fr 3fr; gap: 20px;">
                    <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px;">
                        <button class="button" style="width: 100%; margin-bottom: 20px;">Compose</button>
                        
                        <ul style="list-style: none; padding: 0;">
                            <li style="margin-bottom: 10px; background-color: #e9f5fb; padding: 10px; border-radius: 3px;">
                                Inbox <span style="float: right; background-color: #0073aa; color: white; padding: 2px 6px; border-radius: 10px; font-size: 12px;">3</span>
                            </li>
                            <li style="margin-bottom: 10px; padding: 10px; border-radius: 3px;">
                                Sent <span style="float: right; background-color: #eee; color: #666; padding: 2px 6px; border-radius: 10px; font-size: 12px;">12</span>
                            </li>
                            <li style="margin-bottom: 10px; padding: 10px; border-radius: 3px;">
                                Drafts <span style="float: right; background-color: #eee; color: #666; padding: 2px 6px; border-radius: 10px; font-size: 12px;">2</span>
                            </li>
                            <li style="margin-bottom: 10px; padding: 10px; border-radius: 3px;">
                                Archived <span style="float: right; background-color: #eee; color: #666; padding: 2px 6px; border-radius: 10px; font-size: 12px;">5</span>
                            </li>
                        </ul>
                    </div>
                    
                    <div>
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                            <h3 style="margin: 0;">Inbox</h3>
                            <div style="display: flex; gap: 10px; align-items: center;">
                                <input type="text" placeholder="Search emails..." style="padding: 8px; border: 1px solid #ddd; border-radius: 3px;">
                                <button class="button">Search</button>
                            </div>
                        </div>
                        
                        <div style="border: 1px solid #eee; border-radius: 5px;">
                            <div style="padding: 15px; border-bottom: 1px solid #eee; cursor: pointer;">
                                <div style="display: flex; justify-content: space-between;">
                                    <div><strong>Global Transport Ltd.</strong></div>
                                    <div>May 12, 2025</div>
                                </div>
                                <div style="font-weight: bold;">Container Delivery Confirmation</div>
                                <div style="color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    This email confirms the delivery of container CONT-40-REF-0984 to the specified destination...
                                </div>
                            </div>
                            
                            <div style="padding: 15px; border-bottom: 1px solid #eee; cursor: pointer;">
                                <div style="display: flex; justify-content: space-between;">
                                    <div><strong>SeaFreight Solutions</strong></div>
                                    <div>May 10, 2025</div>
                                </div>
                                <div style="font-weight: bold;">Lease Extension Request</div>
                                <div style="color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    We would like to request a 30-day extension on our current lease for container CONT-40-DRY-2375...
                                </div>
                            </div>
                            
                            <div style="padding: 15px; cursor: pointer;">
                                <div style="display: flex; justify-content: space-between;">
                                    <div><strong>Acme Shipping Co.</strong></div>
                                    <div>May 8, 2025</div>
                                </div>
                                <div style="font-weight: bold;">Invoice Payment Confirmation</div>
                                <div style="color: #666; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                                    This email confirms the payment of invoice INV-2025-0042 for the lease of container CONT-20-DRY-1432...
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            // Navigation handling
            const navLinks = document.querySelectorAll('.nav-link');
            const contentSections = document.querySelectorAll('.content-section');
            
            navLinks.forEach(link => {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetSection = this.getAttribute('data-section');
                    
                    // Hide all sections
                    contentSections.forEach(section => {
                        section.classList.add('hidden');
                    });
                    
                    // Show target section
                    document.getElementById(`${targetSection}-section`).classList.remove('hidden');
                    
                    // Update active link
                    navLinks.forEach(link => link.classList.remove('active'));
                    this.classList.add('active');
                });
            });
            
            // Login form toggle
            const loginToggle = document.querySelector('.login-toggle');
            const loginForm = document.querySelector('.login-form');
            
            loginToggle.addEventListener('click', function(e) {
                e.preventDefault();
                loginForm.classList.toggle('hidden');
            });
            
            // Login form submission
            const loginFormElement = document.getElementById('login-form');
            
            loginFormElement.addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Login functionality would be integrated with WordPress authentication in the full plugin implementation.');
                loginForm.classList.add('hidden');
            });
            
            // PayPal button click simulation
            const paypalButtons = document.querySelectorAll('.paypal-button');
            
            paypalButtons.forEach(button => {
                button.addEventListener('click', function() {
                    alert('In the full implementation, this would trigger the PayPal checkout using the credentials from your environment variables.');
                });
            });
        });
    </script>
</body>
</html>