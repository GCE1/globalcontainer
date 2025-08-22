import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db.ts';
import { containers } from './shared/schema.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Flexible import function that can handle different CSV structures
async function importNewContainerData(csvFileName) {
  console.log(`🔄 Starting import of ${csvFileName}...`);
  
  // Don't clear existing containers, add to them instead
  console.log('📦 Adding new containers to existing database...');
  
  const csvFilePath = path.join(__dirname, csvFileName);
  
  // Check if file exists
  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ CSV file not found: ${csvFilePath}`);
    console.log('Available files:', fs.readdirSync(__dirname).filter(f => f.endsWith('.csv')));
    return;
  }
  
  const containerData = [];
  
  return new Promise((resolve, reject) => {
    const skuCounts = new Map();
    
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          // Auto-detect CSV format by checking available columns
          const csvColumns = Object.keys(row);
          console.log('Detected CSV columns:', csvColumns);
          
          // Flexible field mapping - adapt to your CSV structure
          const containerId = row.container_id || row.id || Date.now() + Math.random();
          const originalSku = row.container_sku || row.sku || row.container_id || 'AUTO_' + Date.now();
          const containerCondition = (row.container_condition || row.condition || 'Brand New').trim();
          const containerSize = row.container_size || row.size || row.type || '20DC';
          const locationName = row.location_name || row.location || row.city || row.depot || 'Unknown Location';
          
          // Handle different coordinate formats
          let latitude = parseFloat(row.latitude || row.lat || 0);
          let longitude = parseFloat(row.longitude || row.lng || row.lon || 0);
          
          // Skip invalid rows
          if (!originalSku || !locationName) {
            console.warn(`Skipping row with missing data: ${JSON.stringify(row)}`);
            return;
          }
          
          // Handle duplicate SKUs
          let containerSku = originalSku;
          if (skuCounts.has(originalSku)) {
            skuCounts.set(originalSku, skuCounts.get(originalSku) + 1);
            containerSku = `${originalSku}_${skuCounts.get(originalSku)}`;
          } else {
            skuCounts.set(originalSku, 1);
          }
          
          const container = {
            sku: containerSku,
            type: containerSize,
            condition: containerCondition,
            depot_name: locationName.includes('Depot') ? locationName : locationName + ' Container Depot',
            city: locationName.replace(' Container Depot', ''),
            state: getStateFromLocation(locationName),
            country: getCountryFromLocation(locationName),
            postal_code: row.zip_code || row.postal_code || row.zip || '00000',
            address: `${locationName}, ${getStateFromLocation(locationName)}, ${getCountryFromLocation(locationName)}`,
            latitude: latitude,
            longitude: longitude,
            price: calculatePrice(containerSize, containerCondition),
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          containerData.push(container);
        } catch (error) {
          console.error('Error processing row:', error, row);
        }
      })
      .on('end', async () => {
        console.log(`📦 Processed ${containerData.length} containers from CSV`);
        
        if (containerData.length === 0) {
          console.log('❌ No valid container data found. Check your CSV format.');
          resolve();
          return;
        }
        
        // Insert containers in batches
        const batchSize = 100;
        let inserted = 0;
        
        for (let i = 0; i < containerData.length; i += batchSize) {
          const batch = containerData.slice(i, i + batchSize);
          
          try {
            await db.insert(containers).values(batch);
            inserted += batch.length;
            console.log(`✅ Inserted batch: ${inserted}/${containerData.length} containers`);
          } catch (error) {
            console.error('Error inserting batch:', error);
            // Continue with next batch
          }
        }
        
        console.log(`🎉 Successfully imported ${inserted} containers!`);
        console.log(`📍 Container distribution by location:`);
        
        // Show summary
        const locationCounts = {};
        containerData.forEach(c => {
          locationCounts[c.city] = (locationCounts[c.city] || 0) + 1;
        });
        
        Object.entries(locationCounts).forEach(([city, count]) => {
          console.log(`   ${city}: ${count} containers`);
        });
        
        resolve();
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        reject(error);
      });
  });
}

// Location mapping functions (same as existing)
function getStateFromLocation(location) {
  const stateMap = {
    'Atlanta': 'GA', 'Baltimore': 'MD', 'Boston': 'MA', 'Buffalo': 'NY',
    'Charleston': 'SC', 'Chicago': 'IL', 'Cleveland': 'OH', 'Dallas': 'TX',
    'Denver': 'CO', 'Detroit': 'MI', 'Edmonton': 'AB', 'Houston': 'TX',
    'Jacksonville': 'FL', 'Kansas City': 'MO', 'Las Vegas': 'NV', 'Long Beach': 'CA',
    'Los Angeles': 'CA', 'Memphis': 'TN', 'Miami': 'FL', 'Minneapolis': 'MN',
    'Montreal': 'QC', 'Nashville': 'TN', 'New Orleans': 'LA', 'New York': 'NY',
    'Norfolk': 'VA', 'Oakland': 'CA', 'Orlando': 'FL', 'Philadelphia': 'PA',
    'Phoenix': 'AZ', 'Portland': 'OR', 'Savannah': 'GA', 'Seattle': 'WA',
    'Toronto': 'ON', 'Vancouver': 'BC'
  };
  return stateMap[location] || 'Unknown';
}

function getCountryFromLocation(location) {
  const canadianCities = ['Edmonton', 'Montreal', 'Toronto', 'Vancouver'];
  return canadianCities.includes(location) ? 'Canada' : 'USA';
}

function calculatePrice(containerSize, condition) {
  const basePrices = {
    '20DC': 2200, '20HC': 2400, '40DC': 3200, 
    '40HC': 3500, '45HC': 4200, '53HC': 5800
  };
  
  const conditionMultipliers = {
    'Brand New': 1.5, 'IICL': 1.2, 'Cargo Worthy': 1.0,
    'Wind and Water Tight': 0.8, 'AS IS': 0.6
  };
  
  const basePrice = basePrices[containerSize] || 2500;
  const multiplier = conditionMultipliers[condition] || 1.0;
  
  return Math.round(basePrice * multiplier);
}

// Export the function for external use
export { importNewContainerData };

// Run if called directly
if (process.argv[2]) {
  const csvFileName = process.argv[2];
  importNewContainerData(csvFileName)
    .then(() => {
      console.log('✅ Import completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Import failed:', error);
      process.exit(1);
    });
} else {
  console.log('Usage: node import-new-container-data.js <csv-filename>');
  console.log('Example: node import-new-container-data.js my-containers.csv');
}