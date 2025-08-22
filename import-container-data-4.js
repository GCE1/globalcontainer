import fs from 'fs';
import csv from 'csv-parser';
import { drizzle } from 'drizzle-orm/node-postgres';
import pkg from 'pg';
const { Pool } = pkg;

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

function parseContainerType(containerType) {
  if (!containerType) return 'Standard Container';
  return containerType.trim();
}

function parseContainerSize(containerSize) {
  if (!containerSize) return '20DC';
  return containerSize.trim();
}

function parseContainerCondition(condition) {
  if (!condition) return 'AS IS';
  return condition.trim();
}

function calculatePrice(containerType, condition, containerSize) {
  // Base prices by size
  const basePrices = {
    '20DC': 2500,
    '20HC': 2800,
    '40DC': 3200,
    '40HC': 3500,
    '45HC': 4200,
    '53HC': 5500
  };

  // Type multipliers
  const typeMultipliers = {
    'Standard Container': 1.0,
    'Open Top Container': 1.15,
    'Side Door Container': 1.25,
    'Double Door Container': 1.20,
    'Refrigerated Container': 1.80
  };

  // Condition multipliers
  const conditionMultipliers = {
    'AS IS': 0.6,
    'Wind and Water Tight': 0.75,
    'Cargo Worthy': 0.85,
    'IICL': 0.95,
    'Brand New': 1.0
  };

  const basePrice = basePrices[containerSize] || 2500;
  const typeMultiplier = typeMultipliers[containerType] || 1.0;
  const conditionMultiplier = conditionMultipliers[condition] || 0.6;

  return Math.round(basePrice * typeMultiplier * conditionMultiplier);
}

async function importContainerData4() {
  console.log('Starting import of container-data 4.csv...');
  
  try {
    // Clear existing data
    await db.execute('DELETE FROM containers');
    console.log('Cleared existing container data');

    const containers = [];
    const filePath = './attached_assets/container-data 4.csv';
    let skuCounter = 1;

    return new Promise((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
          try {
            // Parse the data from CSV
            const containerType = parseContainerType(row.Type);
            const containerSize = parseContainerSize(row.container_size);
            const containerCondition = parseContainerCondition(row.container_condition);
            const price = calculatePrice(containerType, containerCondition, containerSize);

            const container = {
              sku: `NEW-${skuCounter++}-${containerSize}-${containerCondition.replace(/\s+/g, '')}-${row.location_name || 'UNK'}`,
              depot_name: row.location_name || 'Unknown Depot',
              type: `${containerType} - ${containerSize}`,
              condition: containerCondition,
              quantity: 1,
              price: price,
              latitude: parseFloat(row.latitude) || 0,
              longitude: parseFloat(row.longitude) || 0,
              address: `${row.location_name || 'Unknown'} Depot`,
              city: row.location_name || 'Unknown',
              state: getStateFromLocation(row.location_name),
              country: 'USA',
              postal_code: row.zip_code || '00000'
            };

            containers.push(container);
          } catch (error) {
            console.error('Error parsing row:', error, row);
          }
        })
        .on('end', async () => {
          try {
            console.log(`Parsed ${containers.length} containers from CSV`);

            // Insert containers in batches
            const batchSize = 100;
            for (let i = 0; i < containers.length; i += batchSize) {
              const batch = containers.slice(i, i + batchSize);
              
              const values = batch.map(container => 
                `(${[
                  `'${container.sku.replace(/'/g, "''")}'`,
                  `'${container.type.replace(/'/g, "''")}'`,
                  `'${container.condition.replace(/'/g, "''")}'`,
                  container.quantity,
                  container.price,
                  `'${container.depot_name.replace(/'/g, "''")}'`,
                  container.latitude,
                  container.longitude,
                  `'${container.address.replace(/'/g, "''")}'`,
                  `'${container.city.replace(/'/g, "''")}'`,
                  `'${container.state.replace(/'/g, "''")}'`,
                  `'${container.postal_code}'`,
                  `'${container.country}'`
                ].join(', ')})`
              ).join(', ');

              await db.execute(`
                INSERT INTO containers (
                  sku, type, condition, quantity, price, depot_name,
                  latitude, longitude, address, city, state, postal_code, country
                ) VALUES ${values}
              `);
            }

            console.log(`Successfully imported ${containers.length} containers from container-data 4.csv`);
            resolve();
          } catch (error) {
            console.error('Error inserting containers:', error);
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('Error reading CSV file:', error);
          reject(error);
        });
    });
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
}

function getStateFromLocation(location) {
  const stateMap = {
    'Atlanta': 'GA',
    'Baltimore': 'MD',
    'Boston': 'MA',
    'Chicago': 'IL',
    'Dallas': 'TX',
    'Denver': 'CO',
    'Detroit': 'MI',
    'Houston': 'TX',
    'Jacksonville': 'FL',
    'Kansas City': 'MO',
    'Los Angeles': 'CA',
    'Memphis': 'TN',
    'Miami': 'FL',
    'Minneapolis': 'MN',
    'New York': 'NY',
    'Norfolk': 'VA',
    'Oakland': 'CA',
    'Philadelphia': 'PA',
    'Phoenix': 'AZ',
    'Portland': 'OR',
    'Salt Lake City': 'UT',
    'San Antonio': 'TX',
    'Savannah': 'GA',
    'Seattle': 'WA',
    'St. Louis': 'MO',
    'Tampa': 'FL',
    'Toronto': 'ON',
    'Vancouver': 'BC',
    'Montreal': 'QC',
    'Calgary': 'AB',
    'Edmonton': 'AB'
  };
  
  return stateMap[location] || 'Unknown';
}

// Run the import
if (import.meta.url === `file://${process.argv[1]}`) {
  importContainerData4()
    .then(() => {
      console.log('Import completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Import failed:', error);
      process.exit(1);
    });
}

export { importContainerData4 };