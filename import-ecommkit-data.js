import fs from 'fs';
import csv from 'csv-parser';
import { db } from './server/db.js';
import { containers } from './shared/schema.js';

function parseContainerType(containerType) {
  const match = containerType.match(/^(\d+[A-Z]+)/);
  return match ? match[1] : containerType;
}

function calculatePrice(containerType, condition) {
  const baseType = parseContainerType(containerType);
  
  const basePrices = {
    '10DC': 2500,
    '20DC': 3500,
    '20HC': 4000,
    '40DC': 5500,
    '40HC': 6000,
    '45HC': 7500,
    '53HC': 8500
  };

  let basePrice = basePrices[baseType] || 3500;

  const conditionMultipliers = {
    'Brand New': 1.0,
    'IICL': 0.85,
    'Cargo Worthy': 0.75,
    'Wind and Water Tight': 0.65,
    'AS IS': 0.45
  };

  const multiplier = conditionMultipliers[condition] || 0.75;
  return Math.round(basePrice * multiplier);
}

async function importEcommKitData() {
  console.log('Importing authentic container inventory from EcommSearchKit/data/sample-import.csv...');
  
  const results = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('./EcommSearchKit/data/sample-import.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          console.log(`Processing ${results.length} authentic container records...`);
          
          for (const row of results) {
            const containerType = parseContainerType(row.container_type);
            const condition = row.container_condition.trim();
            const price = calculatePrice(row.container_type, condition);
            
            const containerData = {
              sku: row.sku,
              type: containerType,
              condition: condition,
              quantity: parseInt(row.quantity) || 1,
              price: price.toString(),
              depot_name: row.depot_name,
              latitude: parseFloat(row.latitude),
              longitude: parseFloat(row.longitude),
              address: row.address,
              city: row.city,
              state: row.state,
              postal_code: row.postal_code,
              country: row.country || 'USA'
            };

            try {
              await db.insert(containers).values(containerData);
              console.log(`✓ ${containerData.sku} - ${containerData.depot_name} - $${containerData.price}`);
            } catch (error) {
              if (error.message.includes('duplicate key')) {
                // Skip duplicates
                console.log(`- ${containerData.sku} already exists`);
              } else {
                console.error(`Error importing ${row.sku}:`, error.message);
              }
            }
          }
          
          console.log(`\nImport completed! Loaded ${results.length} authentic containers`);
          resolve();
        } catch (error) {
          console.error('Import failed:', error);
          reject(error);
        }
      });
  });
}

importEcommKitData()
  .then(() => {
    console.log('Import process completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Import process failed:', error);
    process.exit(1);
  });