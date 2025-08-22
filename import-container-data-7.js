import fs from 'fs';
import csv from 'csv-parser';
import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

// Configure Neon WebSocket
neonConfig.webSocketConstructor = ws;

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function importContainerData() {
  try {
    console.log('Starting container data import...');
    
    // Clear existing container data
    console.log('Clearing existing container data...');
    await pool.query('DELETE FROM containers');
    
    const containers = [];
    
    // Read and parse CSV
    return new Promise((resolve, reject) => {
      fs.createReadStream('./EcommSearchKit/data/container-data 6.csv')
        .pipe(csv())
        .on('data', (row) => {
          // Map CSV fields to database fields
          const container = {
            sku: row.container_sku || `UNKNOWN_${Date.now()}`,
            type: mapContainerType(row.container_type || row.container_size),
            condition: mapCondition(row.container_condition),
            price: parseFloat(row.price_usd) || 0,
            depot_name: row.location_name + ' Container Depot',
            latitude: parseFloat(row.latitude) || 0,
            longitude: parseFloat(row.longitude) || 0,
            address: generateAddress(row.location_name, row.zip_code),
            city: row.location_name,
            state: getStateFromLocation(row.location_name),
            postal_code: row.zip_code || '00000',
            country: 'USA',
            quantity: 1
          };
          
          containers.push(container);
        })
        .on('end', async () => {
          try {
            console.log(`Parsed ${containers.length} containers from CSV`);
            
            // Batch insert containers using a single transaction
            let insertedCount = 0;
            const client = await pool.connect();
            
            try {
              await client.query('BEGIN');
              
              for (const container of containers) {
                try {
                  await client.query(`
                    INSERT INTO containers (
                      sku, type, condition, price, depot_name, latitude, longitude,
                      address, city, state, postal_code, country, quantity
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
                    ON CONFLICT (sku) DO UPDATE SET
                      type = EXCLUDED.type,
                      condition = EXCLUDED.condition,
                      price = EXCLUDED.price,
                      depot_name = EXCLUDED.depot_name,
                      latitude = EXCLUDED.latitude,
                      longitude = EXCLUDED.longitude,
                      address = EXCLUDED.address,
                      city = EXCLUDED.city,
                      state = EXCLUDED.state,
                      postal_code = EXCLUDED.postal_code,
                      country = EXCLUDED.country,
                      quantity = EXCLUDED.quantity
                  `, [
                    container.sku, container.type, container.condition, container.price,
                    container.depot_name, container.latitude, container.longitude,
                    container.address, container.city, container.state, container.postal_code,
                    container.country, container.quantity
                  ]);
                  insertedCount++;
                } catch (err) {
                  console.error(`Error inserting container ${container.sku}:`, err.message);
                }
              }
              
              await client.query('COMMIT');
              console.log(`✅ Successfully imported ${insertedCount} containers`);
              
              // Calculate statistics
              const stats = await client.query(`
                SELECT 
                  COUNT(*) as total_containers,
                  COUNT(DISTINCT type) as container_types,
                  COUNT(DISTINCT city) as locations,
                  SUM(price::numeric) as total_inventory_value,
                  AVG(price::numeric) as average_price
                FROM containers
              `);
              
              const summary = stats.rows[0];
              console.log('\n📊 Import Summary:');
              console.log(`Total Containers: ${summary.total_containers}`);
              console.log(`Container Types: ${summary.container_types}`);
              console.log(`Locations: ${summary.locations}`);
              console.log(`Total Inventory Value: $${parseFloat(summary.total_inventory_value).toLocaleString()}`);
              console.log(`Average Price: $${parseFloat(summary.average_price).toLocaleString()}`);
              
            } catch (txError) {
              await client.query('ROLLBACK');
              throw txError;
            } finally {
              client.release();
            }
            
            resolve();
          } catch (error) {
            reject(error);
          }
        })
        .on('error', reject);
    });
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
}

// Helper functions
function mapContainerType(csvType) {
  if (!csvType) return '20DC';
  
  // Map various CSV formats to standard types
  const typeMap = {
    '20DC': '20DC',
    '40DC': '40DC', 
    '40HC': '40HC',
    '20HC': '20HC',
    '45HC': '45HC',
    '53HC': '53HC'
  };
  
  // Extract type from CSV (e.g., "20DC Wind and Water Tight Container" -> "20DC")
  for (const [key, value] of Object.entries(typeMap)) {
    if (csvType.includes(key)) {
      return value;
    }
  }
  
  return '20DC'; // Default fallback
}

function mapCondition(csvCondition) {
  if (!csvCondition) return 'Brand New';
  
  const condition = csvCondition.trim();
  
  // Map various condition formats
  if (condition.includes('Brand New') || condition.includes('New')) return 'Brand New';
  if (condition.includes('Cargo Worthy')) return 'Cargo Worthy';
  if (condition.includes('Wind and Water Tight') || condition.includes('WWT')) return 'Wind and Water Tight';
  if (condition.includes('IICL')) return 'IICL';
  if (condition.includes('AS IS') || condition.includes('As-Is')) return 'AS IS';
  
  return 'Brand New'; // Default fallback
}

function generateAddress(locationName, zipCode) {
  // Generate realistic depot addresses
  const addressMap = {
    'Atlanta': '2200 Container Terminal Rd',
    'Baltimore': '3100 Port Terminal Ave',
    'Boston': '1800 Harbor View St',
    'Charleston': '2500 Port Access Rd',
    'Chicago': '4200 Intermodal Dr',
    'Cleveland': '1900 Lakefront Blvd',
    'Dallas': '3300 Freight Terminal Way',
    'Denver': '2800 Cargo Center Dr',
    'Detroit': '2100 Industrial Park Rd',
    'Edmonton': '1600 CN Rail Yard',
    'Houston': '4100 Ship Channel Dr',
    'Jacksonville': '2700 Port Authority Rd',
    'Kansas City': '3200 Rail Terminal Dr',
    'Las Vegas': '2400 Logistics Center Blvd',
    'Long Beach': '4500 Terminal Island Way',
    'Los Angeles': '4600 Harbor Freight Rd',
    'Memphis': '3500 Distribution Center Dr',
    'Miami': '2900 Port Miami Blvd',
    'Montreal': '1700 Port de Montreal',
    'New York': '5100 Container Terminal Dr',
    'Norfolk': '2300 Naval Base Rd',
    'Oakland': '4300 Maritime St',
    'Phoenix': '2600 Desert Port Dr',
    'Portland': '1500 Columbia River Dr',
    'Savannah': '2800 Garden City Terminal',
    'Seattle': '1400 Harbor Island Dr',
    'St. Louis': '3100 River Port Dr',
    'Tampa': '2200 Port Tampa Bay',
    'Toronto': '1800 Port Union Rd',
    'Vancouver': '1200 Waterfront Dr'
  };
  
  return addressMap[locationName] || `1000 ${locationName} Container Terminal`;
}

function getStateFromLocation(locationName) {
  // Map cities to states/provinces
  const stateMap = {
    'Atlanta': 'GA',
    'Baltimore': 'MD', 
    'Boston': 'MA',
    'Charleston': 'SC',
    'Chicago': 'IL',
    'Cleveland': 'OH',
    'Dallas': 'TX',
    'Denver': 'CO',
    'Detroit': 'MI',
    'Edmonton': 'AB',
    'Houston': 'TX',
    'Jacksonville': 'FL',
    'Kansas City': 'MO',
    'Las Vegas': 'NV',
    'Long Beach': 'CA',
    'Los Angeles': 'CA',
    'Memphis': 'TN',
    'Miami': 'FL',
    'Montreal': 'QC',
    'New York': 'NY',
    'Norfolk': 'VA',
    'Oakland': 'CA',
    'Phoenix': 'AZ',
    'Portland': 'OR',
    'Savannah': 'GA',
    'Seattle': 'WA',
    'St. Louis': 'MO',
    'Tampa': 'FL',
    'Toronto': 'ON',
    'Vancouver': 'BC'
  };
  
  return stateMap[locationName] || 'CA';
}

// Run the import
importContainerData()
  .then(async () => {
    console.log('✅ Container data import completed successfully');
    await pool.end();
    process.exit(0);
  })
  .catch(async (error) => {
    console.error('❌ Container data import failed:', error);
    await pool.end();
    process.exit(1);
  });

export { importContainerData };