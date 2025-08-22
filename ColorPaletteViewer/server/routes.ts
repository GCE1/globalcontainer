import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContainerConfigSchema } from "@shared/schema";
import { z } from "zod";
import { createPaypalOrder, capturePaypalOrder, loadPaypalDefault } from "./paypal";
import { calculateOrderTotal } from "./utils/pricing";

// For simplicity in this demo, we'll use a fixed user ID
// In a real app, this would come from authentication
const DEMO_USER_ID = 1;

export async function registerRoutes(app: Express): Promise<Server> {
  // GET container configurations for a user
  app.get("/api/container/configs", async (_req, res) => {
    try {
      const configs = await storage.getContainerConfigsByUserId(DEMO_USER_ID);
      res.json(configs);
    } catch (error) {
      console.error("Error fetching container configs:", error);
      res.status(500).json({ error: "Failed to fetch container configurations" });
    }
  });

  // GET a specific container configuration
  app.get("/api/container/config/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const config = await storage.getContainerConfig(id);
      if (!config) {
        return res.status(404).json({ error: "Configuration not found" });
      }

      res.json(config);
    } catch (error) {
      console.error("Error fetching container config:", error);
      res.status(500).json({ error: "Failed to fetch container configuration" });
    }
  });

  // CREATE a new container configuration
  app.post("/api/container/config", async (req, res) => {
    try {
      // Parse and validate request body
      const { color, requirements } = req.body;
      
      // Validate the combined data
      const containerConfigData = {
        userId: DEMO_USER_ID,
        ralCode: color.ral,
        ralName: color.name,
        hexColor: color.hex,
        doubleDoor: requirements.doubleDoor === "yes",
        openTop: requirements.openTop === "yes",
        lockingBars: requirements.lockingBars,
        lockingBox: requirements.lockingBox === "yes",
        openSideType: requirements.openSideType,
        forkLiftPocket: requirements.forkLiftPocket === "yes"
      };

      // Use schema validation
      const validatedData = insertContainerConfigSchema.parse(containerConfigData);
      
      // Save to database
      const newConfig = await storage.createContainerConfig(validatedData);
      res.status(201).json(newConfig);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid container configuration data", details: error.errors });
      }
      
      console.error("Error creating container config:", error);
      res.status(500).json({ error: "Failed to save container configuration" });
    }
  });

  // UPDATE a container configuration
  app.patch("/api/container/config/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      // Get existing config to ensure it exists
      const existingConfig = await storage.getContainerConfig(id);
      if (!existingConfig) {
        return res.status(404).json({ error: "Configuration not found" });
      }

      // Extract and validate update data
      const updateData = req.body;
      const updatedConfig = await storage.updateContainerConfig(id, updateData);
      
      res.json(updatedConfig);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid update data", details: error.errors });
      }
      
      console.error("Error updating container config:", error);
      res.status(500).json({ error: "Failed to update container configuration" });
    }
  });

  // DELETE a container configuration
  app.delete("/api/container/config/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
      }

      const success = await storage.deleteContainerConfig(id);
      if (!success) {
        return res.status(404).json({ error: "Configuration not found or already deleted" });
      }

      res.status(204).send();
    } catch (error) {
      console.error("Error deleting container config:", error);
      res.status(500).json({ error: "Failed to delete container configuration" });
    }
  });

  // PayPal Integration Routes
  app.get("/setup", async (req, res) => {
    await loadPaypalDefault(req, res);
  });

  app.post("/order", async (req, res) => {
    await createPaypalOrder(req, res);
  });

  app.post("/order/:orderID/capture", async (req, res) => {
    await capturePaypalOrder(req, res);
  });

  // Calculate Order Total
  app.post("/api/calculate-total", (req, res) => {
    try {
      const options = req.body;
      const orderDetails = calculateOrderTotal(options);
      res.json(orderDetails);
    } catch (error) {
      console.error("Error calculating order total:", error);
      res.status(500).json({ error: "Failed to calculate order total" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
