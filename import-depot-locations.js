import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import fs from 'fs';
import csv from 'csv-parser';
import dotenv from 'dotenv';
import * as schema from './shared/schema.js';

// Load environment variables
dotenv.config();

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set in environment variables');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle({ client: pool, schema });

async function importDepotLocations() {
  console.log('Starting depot locations import from EcommSearchKit/data/depot.csv...');
  
  const depots = [];
  let totalProcessed = 0;
  let successCount = 0;
  let errorCount = 0;

  return new Promise((resolve, reject) => {
    fs.createReadStream('EcommSearchKit/data/depot.csv')
      .pipe(csv())
      .on('data', (row) => {
        // CSV format: Country,City,Code,Depot Name,Address (Short),Latitude,Longitude,,
        const depot = {
          country: row.Country?.trim(),
          city: row.City?.trim(),
          code: row.Code?.trim(),
          depotName: row['Depot Name']?.trim(),
          address: row['Address (Short)']?.trim(),
          latitude: parseFloat(row.Latitude),
          longitude: parseFloat(row.Longitude),
          servicesOffered: ['container_storage', 'repairs', 'maintenance'], // Default services
          isActive: true
        };

        // Validate required fields
        if (depot.country && depot.city && depot.code && depot.depotName && 
            !isNaN(depot.latitude) && !isNaN(depot.longitude)) {
          depots.push(depot);
        } else {
          console.warn(`Skipping invalid depot row: ${JSON.stringify(row)}`);
          errorCount++;
        }
        totalProcessed++;
      })
      .on('end', async () => {
        try {
          console.log(`Parsed ${depots.length} valid depots from ${totalProcessed} rows`);
          
          // Clear existing depot locations
          console.log('Clearing existing depot locations...');
          await db.delete(schema.depotLocations);
          
          // Insert new depot locations in batches
          const batchSize = 50;
          for (let i = 0; i < depots.length; i += batchSize) {
            const batch = depots.slice(i, i + batchSize);
            try {
              await db.insert(schema.depotLocations).values(batch);
              successCount += batch.length;
              console.log(`Inserted batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(depots.length/batchSize)} (${batch.length} depots)`);
            } catch (error) {
              console.error(`Error inserting batch starting at index ${i}:`, error);
              // Try inserting individually to identify problem records
              for (const depot of batch) {
                try {
                  await db.insert(schema.depotLocations).values([depot]);
                  successCount++;
                } catch (individualError) {
                  console.error(`Failed to insert depot ${depot.code}:`, individualError);
                  errorCount++;
                }
              }
            }
          }
          
          console.log('\n=== Import Summary ===');
          console.log(`Total rows processed: ${totalProcessed}`);
          console.log(`Successfully imported: ${successCount} depots`);
          console.log(`Errors/Skipped: ${errorCount}`);
          console.log(`Global depot coverage: ${successCount} locations across multiple countries`);
          
          // Show sample of imported depots
          const sampleDepots = await db.select().from(schema.depotLocations).limit(5);
          console.log('\nSample imported depots:');
          sampleDepots.forEach(depot => {
            console.log(`  ${depot.code}: ${depot.depotName} (${depot.city}, ${depot.country})`);
          });
          
          await pool.end();
          resolve();
        } catch (error) {
          console.error('Error during depot import:', error);
          await pool.end();
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
}

// Run the import
importDepotLocations()
  .then(() => {
    console.log('✅ Depot locations import completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Depot locations import failed:', error);
    process.exit(1);
  });