import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db.ts';
import { containers } from './shared/schema.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importContainerData5() {
  console.log('🔄 Starting import of container-data 5.csv...');
  
  // Clear existing containers
  console.log('🗑️  Clearing existing containers...');
  await db.delete(containers);
  
  const csvFilePath = path.join(__dirname, 'EcommSearchKit', 'data', 'container-data 5.csv');
  const containerData = [];
  
  return new Promise((resolve, reject) => {
    const skuCounts = new Map(); // Track SKU occurrences to handle duplicates
    
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Parse the CSV row and create container object
        const containerId = parseInt(row.container_id);
        const originalSku = row.container_sku;
        const containerCondition = row.container_condition.trim();
        const containerSize = row.container_size;
        const locationName = row.location_name;
        
        // Skip row if required fields are missing
        if (!originalSku || !containerSize || !containerCondition || !locationName) {
          console.warn(`Skipping row with missing data: ${JSON.stringify(row)}`);
          return;
        }
        
        // Handle duplicate SKUs by adding suffix
        let containerSku = originalSku;
        if (skuCounts.has(originalSku)) {
          skuCounts.set(originalSku, skuCounts.get(originalSku) + 1);
          containerSku = `${originalSku}_${skuCounts.get(originalSku)}`;
          console.log(`Duplicate SKU found: ${originalSku}, using ${containerSku}`);
        } else {
          skuCounts.set(originalSku, 1);
        }
        
        const container = {
          sku: containerSku,
          type: containerSize, // Use container_size for type (20DC, 40HC, etc.)
          condition: containerCondition,
          depot_name: locationName + ' Container Depot',
          city: locationName,
          state: getStateFromLocation(locationName),
          country: getCountryFromLocation(locationName),
          postal_code: row.zip_code,
          address: locationName + ', ' + getStateFromLocation(locationName) + ', ' + getCountryFromLocation(locationName),
          latitude: parseFloat(row.latitude),
          longitude: parseFloat(row.longitude),
          price: calculatePrice(containerSize, containerCondition),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        containerData.push(container);
      })
      .on('end', async () => {
        console.log(`📦 Processed ${containerData.length} containers from CSV`);
        
        // Insert containers in batches
        const batchSize = 100;
        let inserted = 0;
        
        for (let i = 0; i < containerData.length; i += batchSize) {
          const batch = containerData.slice(i, i + batchSize);
          try {
            await db.insert(containers)
              .values(batch)
              .onConflictDoUpdate({
                target: containers.sku,
                set: {
                  type: containers.type,
                  condition: containers.condition,
                  depot_name: containers.depot_name,
                  city: containers.city,
                  state: containers.state,
                  country: containers.country,
                  postal_code: containers.postal_code,
                  address: containers.address,
                  latitude: containers.latitude,
                  longitude: containers.longitude,
                  price: containers.price,
                  updatedAt: new Date()
                }
              });
            inserted += batch.length;
            console.log(`✅ Inserted batch ${Math.ceil(i / batchSize) + 1}, total: ${inserted} containers`);
          } catch (error) {
            console.error(`❌ Error inserting batch ${Math.ceil(i / batchSize) + 1}:`, error);
          }
        }
        
        console.log(`🎉 Successfully imported ${inserted} containers from container-data 5.csv`);
        resolve(inserted);
      })
      .on('error', (error) => {
        console.error('❌ Error reading CSV file:', error);
        reject(error);
      });
  });
}

function getStateFromLocation(location) {
  const stateMap = {
    'Atlanta': 'GA',
    'Baltimore': 'MD',
    'Calgary': 'AB',
    'Charleston': 'SC',
    'Chicago': 'IL',
    'Columbus': 'OH',
    'Dallas': 'TX',
    'Denver': 'CO',
    'Detroit': 'MI',
    'Edmonton': 'AB',
    'Houston': 'TX',
    'Jacksonville': 'FL',
    'Kansas City': 'MO',
    'Las Vegas': 'NV',
    'Los Angeles': 'CA',
    'Memphis': 'TN',
    'Miami': 'FL',
    'Minneapolis': 'MN',
    'Montreal': 'QC',
    'Nashville': 'TN',
    'New Orleans': 'LA',
    'New York': 'NY',
    'Norfolk': 'VA',
    'Oakland': 'CA',
    'Phoenix': 'AZ',
    'Portland': 'OR',
    'Raleigh': 'NC',
    'Salt Lake City': 'UT',
    'San Antonio': 'TX',
    'Savannah': 'GA',
    'Seattle': 'WA',
    'Tampa': 'FL',
    'Toronto': 'ON',
    'Vancouver': 'BC'
  };
  
  return stateMap[location] || 'Unknown';
}

function getCountryFromLocation(location) {
  const canadianCities = ['Calgary', 'Edmonton', 'Montreal', 'Toronto', 'Vancouver'];
  return canadianCities.includes(location) ? 'Canada' : 'USA';
}

function calculatePrice(containerSize, condition) {
  const basePrices = {
    '20DC': 2800,
    '20HC': 3200,
    '40DC': 4500,
    '40HC': 5000,
    '45HC': 6500,
    '53HC': 7500
  };
  
  const conditionMultipliers = {
    'Brand New': 1.25,
    'IICL': 1.06,
    'Cargo Worthy': 0.94,
    'Wind and Water Tight': 0.81,
    'AS IS': 0.67
  };
  
  const basePrice = basePrices[containerSize] || 2800;
  const multiplier = conditionMultipliers[condition] || 1.0;
  
  return Math.round(basePrice * multiplier);
}

// Run the import
importContainerData5()
  .then((count) => {
    console.log(`✅ Import completed successfully! Imported ${count} containers.`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  });