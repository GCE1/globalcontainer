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
    console.log('Starting container data import from container-data 8.csv...');
    
    // Clear existing container data
    console.log('Clearing existing container data...');
    const client = await pool.connect();
    await client.query('DELETE FROM containers');
    client.release();
    
    const containers = [];
    
    // Read and parse CSV
    return new Promise((resolve, reject) => {
      fs.createReadStream('./EcommSearchKit/data/container-data 8.csv')
        .pipe(csv())
        .on('data', (row) => {
          // Skip rows with missing essential data
          if (!row.container_sku || !row.latitude || !row.longitude) {
            return;
          }
          
          // Extract location from SKU if missing (e.g., 20DCWWATL -> Atlanta)
          let locationName = row.location_name?.trim();
          if (!locationName) {
            locationName = extractLocationFromSKU(row.container_sku);
          }
          
          if (!locationName) {
            return;
          }
          
          // Map CSV fields to database fields
          const container = {
            sku: row.container_sku.trim(),
            type: mapContainerType(row.container_type || row.container_size),
            condition: mapCondition(row.container_condition),
            price: parseFloat(row.price_usd) || 0,
            depot_name: locationName + ' Container Depot',
            latitude: parseFloat(row.latitude) || 0,
            longitude: parseFloat(row.longitude) || 0,
            address: generateAddress(locationName, row.zip_code),
            city: locationName,
            state: getStateFromLocation(locationName),
            postal_code: row.zip_code || '00000',
            country: 'USA',
            quantity: 1
          };
          
          containers.push(container);
        })
        .on('end', async () => {
          try {
            console.log(`Parsed ${containers.length} containers from CSV`);
            
            // Batch insert containers using smaller batches
            let insertedCount = 0;
            const batchSize = 50;
            
            for (let i = 0; i < containers.length; i += batchSize) {
              const batch = containers.slice(i, i + batchSize);
              const client = await pool.connect();
              
              try {
                await client.query('BEGIN');
                
                for (const container of batch) {
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
                console.log(`Batch ${Math.floor(i/batchSize) + 1}: Inserted ${batch.length} containers (${insertedCount} total)`);
                
              } catch (txError) {
                await client.query('ROLLBACK');
                console.error(`Batch error:`, txError.message);
              } finally {
                client.release();
              }
            }
            console.log(`✅ Successfully imported ${insertedCount} containers`);
            
            // Calculate statistics
            const client = await pool.connect();
            try {
              const stats = await client.query(`
                SELECT 
                  COUNT(*) as total_containers,
                  COUNT(DISTINCT type) as container_types,
                  COUNT(DISTINCT city) as locations,
                  SUM(price::numeric) as total_inventory_value,
                  AVG(price::numeric) as average_price,
                  COUNT(CASE WHEN condition = 'Brand New' THEN 1 END) as brand_new_count,
                  COUNT(CASE WHEN condition = 'Cargo Worthy' THEN 1 END) as cargo_worthy_count,
                  COUNT(CASE WHEN condition = 'IICL' THEN 1 END) as iicl_count,
                  COUNT(CASE WHEN condition = 'Wind and Water Tight' THEN 1 END) as wwt_count,
                  COUNT(CASE WHEN condition = 'AS IS' THEN 1 END) as as_is_count
                FROM containers
              `);
              
              const summary = stats.rows[0];
              console.log('\n📊 Import Summary:');
              console.log(`Total Containers: ${summary.total_containers}`);
              console.log(`Container Types: ${summary.container_types}`);
              console.log(`Locations: ${summary.locations}`);
              console.log(`Total Inventory Value: $${parseFloat(summary.total_inventory_value).toLocaleString()}`);
              console.log(`Average Price: $${parseFloat(summary.average_price).toLocaleString()}`);
              console.log('\n📦 Condition Breakdown:');
              console.log(`Brand New: ${summary.brand_new_count}`);
              console.log(`Cargo Worthy: ${summary.cargo_worthy_count}`);
              console.log(`IICL: ${summary.iicl_count}`);
              console.log(`Wind and Water Tight: ${summary.wwt_count}`);
              console.log(`AS IS: ${summary.as_is_count}`);
              
              // Container type breakdown
              const typeStats = await client.query(`
                SELECT type, COUNT(*) as count, AVG(price::numeric) as avg_price
                FROM containers 
                GROUP BY type
                ORDER BY count DESC
              `);
              
              console.log('\n🏗️ Container Type Distribution:');
              typeStats.rows.forEach(row => {
                console.log(`${row.type}: ${row.count} containers (avg: $${parseFloat(row.avg_price).toLocaleString()})`);
              });
              
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
function extractLocationFromSKU(sku) {
  // Extract location codes from SKU (e.g., 20DCWWATL -> ATL -> Atlanta)
  const locationCodes = {
    'ATL': 'Atlanta',
    'BAL': 'Baltimore', 
    'BOS': 'Boston',
    'CGY': 'Calgary',
    'CHA': 'Charleston',
    'CHI': 'Chicago',
    'CIN': 'Cincinnati',
    'CLE': 'Cleveland',
    'COL': 'Columbus',
    'DAL': 'Dallas',
    'DEN': 'Denver',
    'DET': 'Detroit',
    'EDM': 'Edmonton',
    'HAX': 'Halifax',  
    'HOU': 'Houston',
    'IND': 'Indianapolis',
    'JAC': 'Jacksonville',
    'KAS': 'Kansas',
    'LAS': 'Las Vegas',
    'LGB': 'Long Beach',
    'LOS': 'Los Angeles',
    'LOU': 'Louisville',
    'MEM': 'Memphis',
    'MIA': 'Miami',
    'MIN': 'Minneapolis',
    'MTL': 'Montreal',
    'ORL': 'New Orleans',
    'NEW': 'New York',
    'NOR': 'Norfolk',
    'OAK': 'Oakland',
    'PHX': 'Phoenix',
    'POR': 'Portland',
    'SAS': 'Saskatoon',
    'SAV': 'Savannah',
    'SEA': 'Seattle',
    'STL': 'St.Louis',
    'TAM': 'Tampa',
    'TOR': 'Toronto',
    'VAN': 'Vancouver'
  };
  
  // Extract last 3 characters as location code
  const locationCode = sku?.slice(-3);
  return locationCodes[locationCode] || null;
}

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
    'Calgary': '1500 Trans-Canada Terminal Way',
    'Charleston': '2500 Port Access Rd',
    'Chicago': '4200 Intermodal Dr',
    'Cincinnati': '2700 Ohio River Port Rd',
    'Cleveland': '1900 Lakefront Blvd',
    'Columbus': '2300 Central Ohio Terminal Dr',
    'Dallas': '3300 Freight Terminal Way',
    'Denver': '2800 Cargo Center Dr',
    'Detroit': '2100 Industrial Park Rd',
    'Edmonton': '1600 CN Rail Yard',
    'Halifax': '1200 Halifax Harbour Terminal',
    'Houston': '4100 Ship Channel Dr',
    'Indianapolis': '2900 Indiana Port Terminal',
    'Jacksonville': '2700 Port Authority Rd',
    'Kansas': '3200 Rail Terminal Dr',
    'Las Vegas': '2400 Logistics Center Blvd',
    'Long Beach': '4500 Terminal Island Way',
    'Los Angeles': '4600 Harbor Freight Rd',
    'Louisville': '3000 Ohio River Terminal',
    'Memphis': '3500 Distribution Center Dr',
    'Miami': '2900 Port Miami Blvd',
    'Minneapolis': '2600 Mississippi River Port',
    'Montreal': '1700 Port de Montreal',
    'New Orleans': '3400 Mississippi River Port',
    'New York': '5100 Container Terminal Dr',
    'Norfolk': '2300 Naval Base Rd',
    'Oakland': '4300 Maritime St',
    'Phoenix': '2600 Desert Port Dr',
    'Portland': '1500 Columbia River Dr',
    'Saskatoon': '1400 Saskatchewan Terminal',
    'Savannah': '2800 Garden City Terminal',
    'Seattle': '1400 Harbor Island Dr',
    'St.Louis': '3100 River Port Dr',
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
    'Calgary': 'AB',
    'Charleston': 'SC',
    'Chicago': 'IL',
    'Cincinnati': 'OH',
    'Cleveland': 'OH',
    'Columbus': 'OH',
    'Dallas': 'TX',
    'Denver': 'CO',
    'Detroit': 'MI',
    'Edmonton': 'AB',
    'Halifax': 'NS',
    'Houston': 'TX',
    'Indianapolis': 'IN',
    'Jacksonville': 'FL',
    'Kansas': 'MO',
    'Las Vegas': 'NV',
    'Long Beach': 'CA',
    'Los Angeles': 'CA',
    'Louisville': 'KY',
    'Memphis': 'TN',
    'Miami': 'FL',
    'Minneapolis': 'MN',
    'Montreal': 'QC',
    'New Orleans': 'LA',
    'New York': 'NY',
    'Norfolk': 'VA',
    'Oakland': 'CA',
    'Phoenix': 'AZ',
    'Portland': 'OR',
    'Saskatoon': 'SK',
    'Savannah': 'GA',
    'Seattle': 'WA',
    'St.Louis': 'MO',
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