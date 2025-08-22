// PayPal Integration Module - Demo Mode
import { Request, Response } from "express";

/* Demo token generation helpers */

export async function getClientToken() {
  // Return a mock token in demonstration mode
  return "DEMO_PAYPAL_TOKEN_FOR_TESTING";
}

/*  Process transactions - Demo Mode */

export async function createPaypalOrder(req: Request, res: Response) {
  try {
    const { amount, currency, intent } = req.body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return res
        .status(400)
        .json({
          error: "Invalid amount. Amount must be a positive number.",
        });
    }

    // In demo mode, return a simulated successful response
    res.status(200).json({
      id: "DEMO_ORDER_" + Date.now(),
      status: "CREATED",
      links: [
        {
          href: "#demo-approve-link",
          rel: "approve",
          method: "GET"
        }
      ]
    });
  } catch (error) {
    console.error("Demo mode - Order creation:", error);
    res.status(500).json({ error: "Failed to create order in demo mode." });
  }
}

export async function capturePaypalOrder(req: Request, res: Response) {
  try {
    const { orderID } = req.params;
    
    // In demo mode, return a simulated successful capture
    res.status(200).json({
      id: orderID,
      status: "COMPLETED",
      purchase_units: [
        {
          payments: {
            captures: [
              {
                id: "DEMO_CAPTURE_" + Date.now(),
                status: "COMPLETED",
                amount: {
                  value: "100.00",
                  currency_code: "USD"
                }
              }
            ]
          }
        }
      ]
    });
  } catch (error) {
    console.error("Demo mode - Order capture:", error);
    res.status(500).json({ error: "Failed to capture order in demo mode." });
  }
}

export async function loadPaypalDefault(req: Request, res: Response) {
  // Return a mock client token for demonstration purposes
  res.json({
    clientToken: "DEMO_CLIENT_TOKEN_FOR_TESTING"
  });
}