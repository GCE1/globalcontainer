/**
 * PayPal Integration JavaScript
 *
 * Handles PayPal payment integration for Container Wholesale Platform
 */

/**
 * Initialize PayPal button for checkout.
 */
function initPayPalButton() {
    const containerButton = document.getElementById('paypal-button');
    
    if (!containerButton) {
        console.error('PayPal button container not found');
        return;
    }
    
    // Get data from the container element
    const amount = containerButton.getAttribute('data-amount');
    const currency = containerButton.getAttribute('data-currency') || 'USD';
    const intent = containerButton.getAttribute('data-intent') || 'CAPTURE';
    const containerId = containerButton.getAttribute('data-container-id');
    
    // Initialize PayPal SDK
    fetch('/order/setup', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.clientToken) {
            initPayPalSDK(data.clientToken, amount, currency, intent, containerId);
        } else {
            console.error('Failed to get client token from server');
        }
    })
    .catch(error => {
        console.error('Error initializing PayPal:', error);
    });
}

/**
 * Initialize PayPal SDK with client token.
 *
 * @param {string} clientToken - PayPal client token
 * @param {string} amount - Payment amount
 * @param {string} currency - Currency code
 * @param {string} intent - Payment intent
 * @param {string} containerId - Container ID for the purchase
 */
function initPayPalSDK(clientToken, amount, currency, intent, containerId) {
    const paypalButtonContainer = document.getElementById('paypal-button');
    
    // Clear container
    paypalButtonContainer.innerHTML = '';
    
    // Render PayPal button
    renderButton(clientToken);
    
    function renderButton(clientToken) {
        // Initialize PayPal SDK with client token
        const sdkInstance = paypal.createInstance({
            clientToken,
            components: ["paypal-payments"],
        });

        const paypalCheckout = sdkInstance.createPayPalOneTimePaymentSession({
            onApprove: async function(data) {
                console.log('onApprove', data);
                
                // Capture order
                try {
                    const captureResponse = await fetch(`/order/${data.orderId}/capture`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    const captureData = await captureResponse.json();
                    console.log('Capture result', captureData);
                    
                    // Handle successful payment
                    if (captureData.status === 'COMPLETED') {
                        alert('Payment successful! Your container lease has been processed.');
                        // Redirect to confirmation page or order details
                        window.location.href = '/container-leased?id=' + containerId;
                    } else {
                        alert('Payment was not completed. Please try again.');
                    }
                } catch (error) {
                    console.error('Error capturing payment:', error);
                    alert('There was an error processing your payment. Please try again later.');
                }
            },
            onCancel: function(data) {
                console.log('Payment cancelled', data);
                alert('Payment cancelled. You can try again when you\'re ready.');
            },
            onError: function(err) {
                console.error('Payment error:', err);
                alert('There was an error with the payment. Please try again later.');
            }
        });

        const onClick = async () => {
            try {
                const checkoutOptionsPromise = createOrder(amount, currency, intent, containerId);
                await paypalCheckout.start(
                    { paymentFlow: "auto" },
                    checkoutOptionsPromise
                );
            } catch (e) {
                console.error('Error starting PayPal checkout:', e);
            }
        };

        // Set up click handler
        paypalButtonContainer.addEventListener("click", onClick);
    }
    
    // Create order through server
    async function createOrder(amount, currency, intent, containerId) {
        try {
            const response = await fetch('/order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: amount,
                    currency: currency,
                    intent: intent,
                    container_id: containerId
                })
            });
            
            const data = await response.json();
            return { orderId: data.id };
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    }
}

/**
 * Initialize PayPal subscription.
 *
 * @param {string} planId - PayPal subscription plan ID
 */
function initPayPalSubscription(planId) {
    if (!planId) {
        console.error('PayPal plan ID is required');
        return;
    }
    
    // Initialize PayPal SDK
    fetch('/order/setup', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.clientToken) {
            // Initialize subscription
            const sdkInstance = paypal.createInstance({
                clientToken: data.clientToken,
                components: ["paypal-subscriptions"],
            });
            
            const paypalSubscriptions = sdkInstance.createPayPalSubscriptionSession({
                planId: planId,
                onApprove: function(data) {
                    console.log('Subscription approved', data);
                    alert('Subscription successful! Your container subscription has been activated.');
                    window.location.href = '/subscription-active?id=' + data.subscriptionID;
                },
                onCancel: function() {
                    console.log('Subscription cancelled');
                    alert('Subscription cancelled. You can try again when you\'re ready.');
                },
                onError: function(err) {
                    console.error('Subscription error:', err);
                    alert('There was an error with the subscription. Please try again later.');
                }
            });
            
            document.getElementById('paypal-subscription-button').addEventListener('click', function() {
                paypalSubscriptions.start();
            });
        } else {
            console.error('Failed to get client token from server');
        }
    })
    .catch(error => {
        console.error('Error initializing PayPal:', error);
    });
}

// Initialize PayPal buttons when the page loads
document.addEventListener('DOMContentLoaded', function() {
    const paypalButton = document.getElementById('paypal-button');
    if (paypalButton) {
        initPayPalButton();
    }
    
    const paypalSubscriptionButton = document.getElementById('paypal-subscription-button');
    if (paypalSubscriptionButton) {
        const planId = paypalSubscriptionButton.getAttribute('data-plan-id');
        initPayPalSubscription(planId);
    }
});