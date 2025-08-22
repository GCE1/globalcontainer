import { db } from "./db";
import { containers } from "@shared/schema";
import fs from "fs";
import csv from "csv-parser";

interface CSVRow {
  sku: string;
  type: string;
  condition: string;
  quantity: string;
  price: string;
  depot_name: string;
  latitude: string;
  longitude: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

async function loadAuthenticCSV() {
  try {
    console.log("Loading authentic container data from complete-containers.csv...");
    
    // Clear existing data
    await db.delete(containers);
    console.log("Cleared existing container data");

    const containerData: any[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream('./complete-containers.csv')
        .pipe(csv())
        .on('data', (row: CSVRow) => {
          containerData.push({
            sku: row.sku,
            type: row.type,
            condition: row.condition,
            quantity: parseInt(row.quantity) || 1,
            price: parseFloat(row.price) || 0,
            depot_name: row.depot_name,
            latitude: parseFloat(row.latitude) || 0,
            longitude: parseFloat(row.longitude) || 0,
            address: row.address,
            city: row.city,
            state: row.state,
            postal_code: row.postal_code,
            country: row.country
          });
        })
        .on('end', async () => {
          try {
            // Insert all containers in batches
            const batchSize = 50;
            for (let i = 0; i < containerData.length; i += batchSize) {
              const batch = containerData.slice(i, i + batchSize);
              await db.insert(containers).values(batch);
              console.log(`Inserted batch ${Math.floor(i/batchSize) + 1} (${batch.length} containers)`);
            }
            
            console.log(`✓ Successfully loaded ${containerData.length} authentic containers`);
            resolve(containerData.length);
          } catch (error) {
            console.error("Error inserting container data:", error);
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error("Error reading CSV file:", error);
          reject(error);
        });
    });
  } catch (error) {
    console.error("Error loading authentic CSV data:", error);
    throw error;
  }
}

// Run if called directly
loadAuthenticCSV()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to load data:", error);
    process.exit(1);
  });

export { loadAuthenticCSV };