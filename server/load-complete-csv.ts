import { db } from "./db";
import { containers } from "@shared/schema";
import fs from "fs";
import csv from "csv-parser";

interface CSVRow {
  container_id: string;
  container_sku: string;
  Type: string;
  container_size: string;
  container_condition: string;
  location_name: string;
  latitude: string;
  longitude: string;
  available_date: string;
  price_usd: string;
  owner_id: string;
  zip_code: string;
  last_inspection_date: string;
}

async function loadCompleteCSV() {
  try {
    console.log("Loading complete container data from container-data 4.csv...");
    
    // Clear existing data
    await db.delete(containers);
    console.log("Cleared existing container data");

    const containerData: any[] = [];

    return new Promise((resolve, reject) => {
      fs.createReadStream('../attached_assets/container-data 4.csv')
        .pipe(csv())
        .on('data', (row: CSVRow) => {
          // Skip rows with missing essential data
          if (!row.container_sku || !row.container_size || !row.location_name) {
            return;
          }

          // Parse price - handle various price formats
          let price = parseFloat(row.price_usd) || 0;
          if (price <= 1) {
            // If price is 1 or 0, generate realistic pricing based on type and condition
            const size = row.container_size;
            const condition = row.container_condition?.trim();
            
            if (size === '20DC') {
              switch (condition) {
                case 'AS IS': price = 1575; break;
                case 'Wind and Water Tight': price = 2275; break;
                case 'Cargo Worthy': price = 2625; break;
                case 'IICL': price = 2975; break;
                case 'Brand New': price = 3500; break;
                default: price = 2275;
              }
            } else if (size === '20HC') {
              switch (condition) {
                case 'AS IS': price = 1800; break;
                case 'Wind and Water Tight': price = 2600; break;
                case 'Cargo Worthy': price = 3000; break;
                case 'IICL': price = 3400; break;
                case 'Brand New': price = 4000; break;
                default: price = 2600;
              }
            } else if (size === '40DC') {
              switch (condition) {
                case 'AS IS': price = 2475; break;
                case 'Wind and Water Tight': price = 3575; break;
                case 'Cargo Worthy': price = 4125; break;
                case 'IICL': price = 4675; break;
                case 'Brand New': price = 5500; break;
                default: price = 3575;
              }
            } else if (size === '40HC') {
              switch (condition) {
                case 'AS IS': price = 2700; break;
                case 'Wind and Water Tight': price = 3900; break;
                case 'Cargo Worthy': price = 4500; break;
                case 'IICL': price = 5100; break;
                case 'Brand New': price = 6000; break;
                default: price = 3900;
              }
            } else if (size === '45HC') {
              switch (condition) {
                case 'AS IS': price = 3375; break;
                case 'Wind and Water Tight': price = 4875; break;
                case 'Cargo Worthy': price = 5625; break;
                case 'IICL': price = 6375; break;
                case 'Brand New': price = 7500; break;
                default: price = 4875;
              }
            } else if (size === '53HC') {
              switch (condition) {
                case 'AS IS': price = 3825; break;
                case 'Wind and Water Tight': price = 5525; break;
                case 'Cargo Worthy': price = 6375; break;
                case 'IICL': price = 7225; break;
                case 'Brand New': price = 8500; break;
                default: price = 5525;
              }
            }
          }

          // Handle duplicate SKUs by appending container_id
          const uniqueSku = `${row.container_sku}-${row.container_id}`;
          
          containerData.push({
            sku: uniqueSku,
            type: row.container_size,
            condition: row.container_condition?.trim(),
            quantity: 1,
            price: price,
            depot_name: `${row.location_name} Depot`,
            latitude: parseFloat(row.latitude) || 0,
            longitude: parseFloat(row.longitude) || 0,
            address: `Container Depot`,
            city: row.location_name,
            state: '', // Will be inferred from location
            postal_code: row.zip_code || '',
            country: 'USA'
          });
        })
        .on('end', async () => {
          try {
            // Insert all containers in batches
            const batchSize = 100;
            for (let i = 0; i < containerData.length; i += batchSize) {
              const batch = containerData.slice(i, i + batchSize);
              await db.insert(containers).values(batch);
              console.log(`Inserted batch ${Math.floor(i/batchSize) + 1} (${batch.length} containers)`);
            }
            
            console.log(`✓ Successfully loaded ${containerData.length} complete containers from container-data 4.csv`);
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
    console.error("Error loading complete CSV data:", error);
    throw error;
  }
}

// Run if called directly
loadCompleteCSV()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Failed to load data:", error);
    process.exit(1);
  });

export { loadCompleteCSV };