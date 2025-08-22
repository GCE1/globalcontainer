import fs from 'fs';
import csv from 'csv-parser';
import { db } from './server/db.ts';
import { containers } from './shared/schema.ts';

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

function getStateFromLocation(locationName) {
  const locationToState = {
    'Atlanta': 'GA',
    'Baltimore': 'MD',
    'Calgary': 'AB',
    'Charleston': 'SC',
    'Chicago': 'IL',
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
    'Portland': 'OR',
    'Saskatoon': 'SK',
    'Savannah': 'GA',
    'Seattle': 'WA',
    'Tampa': 'FL',
    'Toronto': 'ON',
    'Vancouver': 'BC'
  };
  
  return locationToState[locationName] || 'Unknown';
}

async function importEcommKitContainerData4() {
  console.log('Importing authentic container inventory from EcommSearchKit/data/container-data 4.csv...');
  
  const results = [];
  
  return new Promise((resolve, reject) => {
    fs.createReadStream('./EcommSearchKit/data/container-data 4.csv')
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          console.log(`Processing ${results.length} authentic container records...`);
          
          // Clear existing containers to avoid duplicates
          await db.delete(containers);
          console.log('Cleared existing container data');
          
          // Verify deletion worked
          const remainingCount = await db.select().from(containers);
          console.log(`Remaining containers after deletion: ${remainingCount.length}`);
          
          for (const row of results) {
            const containerType = parseContainerType(row.container_type);
            const condition = row.container_condition.trim();
            const price = calculatePrice(row.container_type, condition);
            
            // Fix longitude for North American locations (should be negative)
            let longitude = parseFloat(row.longitude);
            if (longitude > 0 && ['Calgary', 'Edmonton', 'Montreal', 'Saskatoon', 'Toronto', 'Vancouver'].includes(row.location_name)) {
              longitude = -longitude;
            }
            
            const containerData = {
              sku: row.container_sku,
              type: containerType,
              condition: condition,
              quantity: 1,
              price: price.toString(),
              depot_name: `${row.location_name} Container Depot`,
              latitude: parseFloat(row.latitude),
              longitude: longitude,
              address: `${row.location_name} Container Location`,
              city: row.location_name,
              state: getStateFromLocation(row.location_name),
              postal_code: row.zip_code,
              country: ['Calgary', 'Edmonton', 'Montreal', 'Saskatoon', 'Toronto', 'Vancouver'].includes(row.location_name) ? 'Canada' : 'USA'
            };

            try {
              await db.insert(containers).values(containerData).onConflictDoUpdate({
                target: containers.sku,
                set: containerData
              });
              if (parseInt(row.container_id) % 50 === 0) {
                console.log(`✓ ${containerData.sku} - ${containerData.depot_name} - $${containerData.price}`);
              }
            } catch (error) {
              console.error(`Error inserting container ${containerData.sku}:`, error);
            }
          }
          
          console.log(`✅ Successfully imported ${results.length} containers from EcommSearchKit container-data 4.csv`);
          resolve();
        } catch (error) {
          console.error('Error processing CSV data:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
}

importEcommKitContainerData4().catch(console.error);