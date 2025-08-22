import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import http from "http";
import { WebSocketServer } from "ws";
import WebSocket from "ws";
import fs from "fs";
import path from "path";
import csv from "csv-parser";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { storage } from "./storage";

// Import calendar service and invoice API routes
const calendarService = require("./calendar-service");
const invoicesApi = require("./invoices-api");

// Load environment variables
dotenv.config();

// Initialize express
const app = express();
const server = http.createServer(app);

// Create WebSocket server
const wss = new WebSocketServer({ server, path: '/ws' });

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// WebSocket connection handling
wss.on('connection', (ws) => {
  console.log('WebSocket client connected');
  
  // Send welcome message
  ws.send(JSON.stringify({
    type: 'connection',
    message: 'Connected to Container Leasing WebSocket server'
  }));
  
  // Handle incoming messages
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message.toString());
      console.log('Received message:', data);
      
      // Handle different message types
      if (data.type === 'subscribe') {
        // Handle subscription requests (e.g., for real-time updates)
        ws.send(JSON.stringify({
          type: 'subscription',
          status: 'success',
          channel: data.channel
        }));
      }
    } catch (error) {
      console.error('Error handling WebSocket message:', error);
    }
  });
  
  // Handle disconnection
  ws.on('close', () => {
    console.log('WebSocket client disconnected');
  });
});

// Helper function to broadcast to all connected clients
function broadcastToAll(data) {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

// Register invoices API routes
app.use(invoicesApi);

// PayPal routes
app.get("/paypal/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
});

app.post("/paypal/order", async (req, res) => {
  // Request body should contain: { intent, amount, currency }
  await createPaypalOrder(req, res);
});

app.post("/paypal/order/:orderID/capture", async (req, res) => {
  await capturePaypalOrder(req, res);
});

// Calendar API routes
app.get("/api/calendar-events", async (req, res) => {
  try {
    const { origin, destination, containerSize, status, start, end } = req.query;
    
    // Parse filter parameters
    const filters: any = {};
    if (origin) filters.origin = origin;
    if (destination) filters.destination = destination;
    if (containerSize) filters.containerSize = containerSize;
    if (status) filters.status = status;
    
    // Parse date parameters
    const startDate = start ? new Date(start as string) : new Date();
    const endDate = end ? new Date(end as string) : new Date(startDate.getFullYear(), startDate.getMonth() + 3, startDate.getDate());
    
    // Generate calendar events
    const events = await calendarService.generateCalendarEvents(filters, startDate, endDate);
    
    res.json(events);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ error: 'Failed to fetch calendar events' });
  }
});

// API to get unique origins and destinations for dropdowns
app.get("/api/leasing-locations", async (req, res) => {
  try {
    const results: { origins: Set<string>, destinations: Set<string> } = {
      origins: new Set<string>(),
      destinations: new Set<string>()
    };
    
    // Read from CSV file
    fs.createReadStream(path.resolve(__dirname, '../data/LeasingManager.csv'))
      .pipe(csv())
      .on('data', (row) => {
        // Extract origin and destination based on different possible column names
        // First, check if the key exists directly
        let origin = '';
        let destination = '';
        
        // Handle BOM character and case variations
        for (const key of Object.keys(row)) {
          // Check for origin keys
          if (key.toLowerCase().includes('origin')) {
            origin = row[key];
            if (origin) results.origins.add(origin);
          }
          
          // Check for destination keys
          if (key.toLowerCase().includes('destination')) {
            destination = row[key];
            if (destination) results.destinations.add(destination);
          }
        }
      })
      .on('end', () => {
        // Convert Sets to Arrays for JSON response
        res.json({
          origins: Array.from(results.origins).sort(),
          destinations: Array.from(results.destinations).sort()
        });
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        res.status(500).json({ error: 'Failed to read locations from CSV' });
      });
  } catch (error) {
    console.error('Error getting leasing locations:', error);
    res.status(500).json({ error: 'Failed to get leasing locations' });
  }
});

// API to trigger daily per diem processing (typically called by a scheduled job)
app.post("/api/process-per-diem-charges", async (req, res) => {
  try {
    // Process per diem charges for all contracts
    const results = await calendarService.processDailyPerDiemCharges();
    
    // Broadcast update to all connected clients
    broadcastToAll({
      type: 'per-diem-update',
      message: `Processed ${results.length} per diem charges`,
      timestamp: new Date()
    });
    
    res.json({
      success: true,
      processed: results.length,
      invoices: results
    });
  } catch (error) {
    console.error('Error processing per diem charges:', error);
    res.status(500).json({ error: 'Failed to process per diem charges' });
  }
});

// Serve static files from public directory
app.use(express.static("public"));

// Redirect all other routes to index.html (for SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../public/index.html'));
});

// Start server
const PORT = parseInt(process.env.PORT || "5000", 10);
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Container Leasing Platform server running on port ${PORT}`);
});

export default app;