import { Request, Response } from "express";

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

if (!PAYPAL_CLIENT_ID) {
  throw new Error("Missing PAYPAL_CLIENT_ID");
}
if (!PAYPAL_CLIENT_SECRET) {
  throw new Error("Missing PAYPAL_CLIENT_SECRET");
}

const PAYPAL_BASE_URL = "https://api-m.sandbox.paypal.com";

async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`).toString('base64');
  
  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Language': 'en_US',
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials'
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('PayPal token error:', errorText);
    throw new Error(`Failed to get PayPal access token: ${response.status}`);
  }

  const data = await response.json();
  return data.access_token;
}

export async function createPaypalOrder(req: Request, res: Response) {
  try {
    const { intent, purchase_units } = req.body;

    if (!intent || !purchase_units) {
      return res.status(400).json({ 
        error: "Invalid request. Intent and purchase_units are required." 
      });
    }

    const accessToken = await getAccessToken();
    
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: intent,
        purchase_units: purchase_units
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PayPal order creation error:', errorText);
      return res.status(500).json({ error: "Failed to create PayPal order" });
    }

    const orderData = await response.json();
    res.json(orderData);
  } catch (error) {
    console.error("Failed to create order:", error);
    res.status(500).json({ error: "Failed to create order." });
  }
}

export async function capturePaypalOrder(req: Request, res: Response) {
  try {
    const { orderID } = req.params;

    const accessToken = await getAccessToken();
    
    const response = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderID}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('PayPal order capture error:', errorText);
      return res.status(500).json({ error: "Failed to capture PayPal order" });
    }

    const orderData = await response.json();
    res.json(orderData);
  } catch (error) {
    console.error("Failed to capture order:", error);
    res.status(500).json({ error: "Failed to capture order." });
  }
}

export async function loadPaypalDefault(req: Request, res: Response) {
  try {
    res.json({
      clientId: PAYPAL_CLIENT_ID,
      environment: "sandbox"
    });
  } catch (error) {
    console.error("Failed to load PayPal setup:", error);
    res.status(500).json({ error: "Failed to load PayPal setup." });
  }
}