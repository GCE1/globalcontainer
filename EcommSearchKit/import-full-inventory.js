import fs from 'fs';
import csv from 'csv-parser';
import { db } from '../server/db.js';
import { containers } from '../shared/schema.js';

function parseContainerType(containerType) {
  // Extract the main type from strings like "10DC Brand New Container"
  const match = containerType.match(/^(\d+[A-Z]+)/);
  return match ? match[1] : containerType;
}

function calculatePrice(containerType, condition) {
  const baseType = parseContainerType(containerType);
  
  // Base prices for different container types
  const basePrices = {
    '10DC': 2500,
    '20DC': 3500,
    '20HC': 4000,
    '40DC': 5500,
    '40HC': 6000,
    '45HC': 7500,
    '53HC': 8500,
    '20SD': 4500,   // Side door
    '40HCSD': 6500, // Side door
    '20DD': 4200,   // Double door
    '40HCDD': 6200, // Double door
    '20RF': 8000,   // Refrigerated
    '40HCRF': 12000, // Refrigerated
    '20OT': 4800,   // Open top
    '40HCOT': 7200, // Open top
    '40HCPW': 6500, // Pallet wide
    '45HCPW': 8000  // Pallet wide
  };

  // Find best match for base price
  let basePrice = basePrices[baseType];
  if (!basePrice) {
    // Try partial matches
    for (const [type, price] of Object.entries(basePrices)) {
      if (baseType.includes(type.substring(0, 2))) {
        basePrice = price;
        break;
      }
    }
  }
  
  if (!basePrice) basePrice = 3500; // Default price

  // Condition multipliers
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

async function importFullInventory() {
  console.log('Starting full inventory import from EcommSearchKit/data/sample-import.csv...');
  
  const results = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('./EcommSearchKit/data/sample-import.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          console.log(`Processing ${results.length} container records...`);
          
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
              await db.insert(containers).values(containerData).onConflictDoUpdate({
                target: containers.sku,
                set: {
                  type: containerData.type,
                  condition: containerData.condition,
                  quantity: containerData.quantity,
                  price: containerData.price,
                  depot_name: containerData.depot_name,
                  latitude: containerData.latitude,
                  longitude: containerData.longitude,
                  address: containerData.address,
                  city: containerData.city,
                  state: containerData.state,
                  postal_code: containerData.postal_code,
                  country: containerData.country,
                  updatedAt: new Date()
                }
              });
              
              console.log(`✓ Imported ${containerData.sku} - ${containerData.type} ${containerData.condition} - $${containerData.price}`);
            } catch (error) {
              console.error(`Error importing ${row.sku}:`, error.message);
            }
          }
          
          console.log(`\nFull inventory import completed!`);
          console.log(`Imported ${results.length} containers from multiple depots`);
          resolve();
        } catch (error) {
          console.error('Import failed:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        reject(error);
      });
  });
}

// Run the import
importFullInventory()
  .then(() => {
    console.log('Import process completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Import process failed:', error);
    process.exit(1);
  });