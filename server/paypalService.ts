// PayPal Service - Production Ready Implementation
class PayPalService {
  private paypal: any;
  private ordersController: any;
  private isProduction: boolean;

  constructor() {
    // Lazy load PayPal SDK to avoid import issues
    this.paypal = null;
    this.ordersController = null;
    this.isProduction = false;
    
    // Initialize on first use to avoid module loading conflicts
    // Note: Constructor can't be async, so we initialize lazily
  }

  private async initializePayPal() {
    try {
      console.log('🔄 Starting PayPal initialization...');
      
      // Dynamic import to handle ES module conflicts
      this.paypal = await import('@paypal/paypal-server-sdk');
      console.log('✅ PayPal SDK imported successfully');
      
      const clientId = process.env.PAYPAL_CLIENT_ID;
      const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
      
      if (!clientId || !clientSecret) {
        throw new Error('PayPal credentials not configured');
      }
      console.log(`✅ PayPal credentials found (Client ID: ${clientId.substring(0, 10)}...)`);

      // Detect production vs sandbox environment
      this.isProduction = clientId.startsWith('A') && clientId.length === 80 && !clientId.startsWith('AV') && !clientId.startsWith('AU');
      
      console.log(`PayPal Service: ${this.isProduction ? 'PRODUCTION' : 'SANDBOX'} mode`);
      
      // Create PayPal client
      const client = new this.paypal.Client({
        clientCredentialsAuthCredentials: {
          oAuthClientId: clientId,
          oAuthClientSecret: clientSecret,
        },
        environment: this.isProduction ? this.paypal.Environment.Production : this.paypal.Environment.Sandbox,
      });
      console.log('✅ PayPal Client created successfully');

      // Initialize orders controller
      this.ordersController = new this.paypal.OrdersController(client);
      console.log('✅ PayPal OrdersController created successfully');
      
      console.log('✅ PayPal service initialization complete');
      
    } catch (error: any) {
      console.error('❌ PayPal initialization failed:', error?.message || error);
      console.error('❌ PayPal error stack:', error?.stack);
      this.paypal = null;
      this.ordersController = null;
      throw error; // Re-throw to handle in calling function
    }
  }

  async createOrder(amount: number, currency: string = 'USD', description: string = 'Membership Subscription') {
    try {
      console.log('🔄 PayPal createOrder called, checking initialization...');
      
      if (!this.ordersController) {
        console.log('⚠️ PayPal not initialized, attempting initialization...');
        // Try to initialize if not done yet
        await this.initializePayPal();
        if (!this.ordersController) {
          throw new Error('PayPal service initialization failed - ordersController is null');
        }
      }
      
      console.log('✅ PayPal OrdersController ready, creating order...');

      const request = {
        body: {
          intent: 'CAPTURE',
          purchaseUnits: [
            {
              amount: {
                currencyCode: currency,
                value: amount.toFixed(2),
              },
              description: description,
            },
          ],
          applicationContext: {
            returnUrl: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/payment-success`,
            cancelUrl: `${process.env.FRONTEND_URL || 'http://localhost:5000'}/payment-cancel`,
            brandName: 'Global Container Exchange',
            landingPage: 'BILLING',
            userAction: 'PAY_NOW',
            shippingPreference: 'NO_SHIPPING'
          },
        },
      };

      console.log('Creating PayPal order for:', { amount, currency, description });
      const response = await this.ordersController.createOrder(request);
      
      if (response.result && response.result.id) {
        console.log('✅ PayPal order created:', response.result.id);
        return {
          success: true,
          orderId: response.result.id,
          links: response.result.links || [],
          environment: this.isProduction ? 'production' : 'sandbox'
        };
      } else {
        throw new Error('PayPal order creation failed - no order ID returned');
      }
    } catch (error: any) {
      console.error('PayPal Create Order Error:', error?.message || error);
      
      // Handle authentication errors specifically
      if (error?.result?.error === 'invalid_client') {
        return {
          success: false,
          error: 'PayPal authentication failed - credentials may be invalid or expired',
          environment: this.isProduction ? 'production' : 'sandbox',
          details: 'Please check PayPal Client ID and Secret'
        };
      }
      
      return {
        success: false,
        error: error?.message || 'Failed to create PayPal order',
        environment: this.isProduction ? 'production' : 'sandbox'
      };
    }
  }

  async captureOrder(orderId: string) {
    try {
      if (!this.ordersController) {
        // Try to initialize if not done yet
        await this.initializePayPal();
        if (!this.ordersController) {
          throw new Error('PayPal service not initialized');
        }
      }

      const request = {
        id: orderId,
        body: {},
      };

      console.log('Capturing PayPal order:', orderId);
      const response = await this.ordersController.captureOrder(request);
      
      if (response.result && response.result.status === 'COMPLETED') {
        const captureId = response.result.purchaseUnits?.[0]?.payments?.captures?.[0]?.id;
        console.log('✅ PayPal order captured:', captureId);
        return {
          success: true,
          captureId: captureId,
          status: response.result.status,
          payerEmail: response.result.payer?.emailAddress,
          amount: response.result.purchaseUnits?.[0]?.payments?.captures?.[0]?.amount,
          environment: this.isProduction ? 'production' : 'sandbox'
        };
      } else {
        throw new Error(`Order capture failed with status: ${response.result?.status}`);
      }
    } catch (error: any) {
      console.error('PayPal Capture Order Error:', error?.message || error);
      return {
        success: false,
        error: error?.message || 'Failed to capture PayPal order',
        environment: this.isProduction ? 'production' : 'sandbox'
      };
    }
  }

  async generateClientToken() {
    try {
      // For client-side PayPal integration, we return the client ID
      // This is safe to expose to the frontend
      const clientId = process.env.PAYPAL_CLIENT_ID;
      
      if (!clientId) {
        throw new Error('PayPal Client ID not configured');
      }

      return {
        success: true,
        clientToken: clientId, // For PayPal JS SDK
        environment: this.isProduction ? 'production' : 'sandbox'
      };
    } catch (error: any) {
      console.error('PayPal Client Token Error:', error?.message || error);
      return {
        success: false,
        error: error?.message || 'Failed to generate client token',
        environment: this.isProduction ? 'production' : 'sandbox'
      };
    }
  }

  getEnvironment() {
    return this.isProduction;
  }
}

// Export singleton instance
const paypalServiceInstance = new PayPalService();
export default paypalServiceInstance;