import fs from 'fs';
import csv from 'csv-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import { db } from './server/db.ts';
import { containers } from './shared/schema.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function importContainerData6() {
  console.log('🔄 Starting import of container-data 6.csv...');
  
  // Clear existing containers to replace with new data
  console.log('🗑️  Clearing existing containers...');
  await db.delete(containers);
  
  const csvFilePath = path.join(__dirname, 'EcommSearchKit', 'data', 'container-data 6.csv');
  const containerData = [];
  
  return new Promise((resolve, reject) => {
    const skuCounts = new Map();
    
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          // Parse the CSV row using the exact column names from container-data 6.csv
          const containerId = parseInt(row.container_id);
          const originalSku = row.container_sku;
          const containerCondition = row.container_condition.trim();
          const containerSize = row.container_size;
          const locationName = row.location_name;
          const priceUsd = parseFloat(row.price_usd) || 0;
          
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
            price: priceUsd, // Use the actual price from CSV instead of calculated price
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
          console.log('❌ No valid container data found');
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
          }
        }
        
        console.log(`🎉 Successfully imported ${inserted} containers!`);
        console.log(`📍 Container distribution by location:`);
        
        // Show summary
        const locationCounts = {};
        const typeCounts = {};
        const conditionCounts = {};
        let totalValue = 0;
        
        containerData.forEach(c => {
          locationCounts[c.city] = (locationCounts[c.city] || 0) + 1;
          typeCounts[c.type] = (typeCounts[c.type] || 0) + 1;
          conditionCounts[c.condition] = (conditionCounts[c.condition] || 0) + 1;
          totalValue += c.price;
        });
        
        console.log('\n📊 Summary Statistics:');
        console.log('   Locations:');
        Object.entries(locationCounts).forEach(([city, count]) => {
          console.log(`     ${city}: ${count} containers`);
        });
        
        console.log('\n   Container Types:');
        Object.entries(typeCounts).forEach(([type, count]) => {
          console.log(`     ${type}: ${count} containers`);
        });
        
        console.log('\n   Container Conditions:');
        Object.entries(conditionCounts).forEach(([condition, count]) => {
          console.log(`     ${condition}: ${count} containers`);
        });
        
        console.log(`\n💰 Total inventory value: $${totalValue.toLocaleString()}`);
        console.log(`📈 Average container price: $${Math.round(totalValue / containerData.length).toLocaleString()}`);
        
        resolve();
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        reject(error);
      });
  });
}

// Location mapping functions
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

// Run the import
importContainerData6()
  .then(() => {
    console.log('✅ Import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  });