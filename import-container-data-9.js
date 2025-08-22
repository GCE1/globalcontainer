import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import fs from 'fs';
import csv from 'csv-parser';

// Configure Neon WebSocket
neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL must be set. Did you forget to provision a database?');
}

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Enhanced location mapping with Canadian provinces and US states
const locationToState = {
  'atlanta': 'GA', 'savannah': 'GA', 'charleston': 'SC', 'norfolk': 'VA',
  'baltimore': 'MD', 'philadelphia': 'PA', 'newyork': 'NY', 'new york': 'NY', 'boston': 'MA',
  'portland': 'ME', 'miami': 'FL', 'tampa': 'FL', 'jacksonville': 'FL',
  'neworleans': 'LA', 'new orleans': 'LA', 'houston': 'TX', 'galveston': 'TX', 'losangeles': 'CA',
  'los angeles': 'CA', 'longbeach': 'CA', 'oakland': 'CA', 'seattle': 'WA', 'tacoma': 'WA',
  'portland': 'OR', 'chicago': 'IL', 'detroit': 'MI', 'cleveland': 'OH',
  'memphis': 'TN', 'saltlakecity': 'UT', 'denver': 'CO', 'phoenix': 'AZ',
  'lasvegas': 'NV', 'dallas': 'TX', 'fortworth': 'TX', 'saintlouis': 'MO',
  'st.louis': 'MO', 'kansascity': 'MO', 'kansas': 'KS', 'cincinnati': 'OH',
  'columbus': 'OH', 'indianapolis': 'IN', 'louisville': 'KY', 'minneapolis': 'MN',
  // Canadian locations
  'vancouver': 'BC', 'calgary': 'AB', 'edmonton': 'AB', 'toronto': 'ON',
  'montreal': 'QC', 'halifax': 'NS', 'saskatoon': 'SK'
};

// Extract location from SKU (last 3 characters)
function extractLocationFromSKU(sku) {
  if (!sku || sku.length < 3) return null;
  const locationCode = sku.slice(-3).toLowerCase();
  
  const locationMap = {
    'atl': 'atlanta', 'sav': 'savannah', 'chs': 'charleston', 'nor': 'norfolk',
    'bal': 'baltimore', 'phi': 'philadelphia', 'nyc': 'newyork', 'bos': 'boston',
    'por': 'portland', 'mia': 'miami', 'tam': 'tampa', 'jax': 'jacksonville',
    'nol': 'neworleans', 'hou': 'houston', 'gal': 'galveston', 'lax': 'losangeles',
    'lgb': 'longbeach', 'oak': 'oakland', 'sea': 'seattle', 'tac': 'tacoma',
    'pdx': 'portland', 'chi': 'chicago', 'det': 'detroit', 'cle': 'cleveland',
    'mem': 'memphis', 'slc': 'saltlakecity', 'den': 'denver', 'phx': 'phoenix',
    'las': 'lasvegas', 'dal': 'dallas', 'ftw': 'fortworth', 'stl': 'saintlouis',
    'kcy': 'kansascity', 'van': 'vancouver', 'cal': 'calgary', 'edm': 'edmonton',
    'tor': 'toronto', 'mon': 'montreal', 'hal': 'halifax'
  };
  
  return locationMap[locationCode] || null;
}

// Calculate price based on container type and condition
function calculatePrice(type, condition, basePrice = null) {
  if (basePrice && !isNaN(parseFloat(basePrice))) {
    return parseFloat(basePrice);
  }
  
  const basePrices = {
    '20DC': { 'Brand New': 4500, 'Cargo Worthy': 3000, 'IICL': 2800, 'Wind and Water Tight': 2200, 'AS IS': 1800 },
    '20HC': { 'Brand New': 4800, 'Cargo Worthy': 3200, 'IICL': 3000, 'Wind and Water Tight': 2400, 'AS IS': 2000 },
    '40DC': { 'Brand New': 6500, 'Cargo Worthy': 4500, 'IICL': 4200, 'Wind and Water Tight': 3500, 'AS IS': 2800 },
    '40HC': { 'Brand New': 7500, 'Cargo Worthy': 5200, 'IICL': 4800, 'Wind and Water Tight': 4000, 'AS IS': 3200 },
    '45HC': { 'Brand New': 12500, 'Cargo Worthy': 8500, 'IICL': 8000, 'Wind and Water Tight': 6500, 'AS IS': 5000 },
    '53HC': { 'Brand New': 22000, 'Cargo Worthy': 15000, 'IICL': 14000, 'Wind and Water Tight': 11000, 'AS IS': 8500 }
  };
  
  return basePrices[type]?.[condition] || 5000;
}

async function importContainerData() {
  console.log('Starting container data import from container-data 9.csv...');
  
  try {
    // Clear existing container data
    console.log('Clearing existing container data...');
    const client = await pool.connect();
    try {
      await client.query('DELETE FROM containers');
    } finally {
      client.release();
    }
    
    const containers = [];
    
    return new Promise((resolve, reject) => {
      fs.createReadStream('EcommSearchKit/data/container-data 9.csv')
        .pipe(csv())
        .on('data', (row) => {
          try {
            // Extract container details from CSV (using container-data 9 format)
            const sku = row.container_sku || '';
            const type = row.container_size || ''; // 20DC, 40HC, etc.
            const condition = row.container_condition || '';
            const priceRaw = row.price_usd || '';
            const locationName = row.location_name || '';
            const latitude = parseFloat(row.latitude) || 0;
            const longitude = parseFloat(row.longitude) || 0;
            const zipCode = row.zip_code || '';
            
            // Validate required fields
            if (!sku || !type || !condition || !locationName) {
              console.warn(`Missing required fields for row:`, row);
              return;
            }
            
            // Determine state from location name
            const location = locationName.toLowerCase();
            const state = locationToState[location];
            if (!state) {
              console.warn(`Unknown location: ${locationName}`);
              return;
            }
            
            // Parse price
            const price = parseFloat(priceRaw) || calculatePrice(type, condition);
            
            // Generate depot name and address
            const depotName = `${locationName} Container Depot`;
            const address = `${Math.floor(Math.random() * 9999) + 1000} Container Way`;
            
            containers.push({
              sku,
              type,
              condition,
              price,
              depot_name: depotName,
              latitude,
              longitude,
              address,
              city: locationName,
              state,
              postal_code: zipCode || '00000',
              country: ['BC', 'AB', 'ON', 'QC', 'NS'].includes(state) ? 'Canada' : 'USA',
              quantity: 1
            });
            
          } catch (error) {
            console.error('Error processing row:', error, row);
          }
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
                  SUM(price * quantity) as total_value,
                  ROUND(AVG(price), 2) as avg_price
                FROM containers
              `);
              
              const conditionStats = await client.query(`
                SELECT condition, COUNT(*) as count
                FROM containers
                GROUP BY condition
                ORDER BY count DESC
              `);
              
              const typeStats = await client.query(`
                SELECT type, COUNT(*) as count, ROUND(AVG(price), 2) as avg_price
                FROM containers
                GROUP BY type
                ORDER BY count DESC
              `);
              
              console.log('\n📊 Import Summary:');
              console.log(`Total Containers: ${stats.rows[0].total_containers}`);
              console.log(`Container Types: ${stats.rows[0].container_types}`);
              console.log(`Locations: ${stats.rows[0].locations}`);
              console.log(`Total Inventory Value: $${parseFloat(stats.rows[0].total_value).toLocaleString()}`);
              console.log(`Average Price: $${parseFloat(stats.rows[0].avg_price).toLocaleString()}`);
              
              console.log('\n📦 Condition Breakdown:');
              conditionStats.rows.forEach(row => {
                console.log(`${row.condition}: ${row.count}`);
              });
              
              console.log('\n🏗️ Container Type Distribution:');
              typeStats.rows.forEach(row => {
                console.log(`${row.type}: ${row.count} containers (avg: $${parseFloat(row.avg_price).toLocaleString()})`);
              });
              
            } finally {
              client.release();
            }
            
            console.log('✅ Container data import completed successfully');
            await pool.end();
            resolve();
            
          } catch (error) {
            console.error('Import failed:', error);
            await pool.end();
            reject(error);
          }
        })
        .on('error', (error) => {
          console.error('CSV parsing error:', error);
          reject(error);
        });
    });
    
  } catch (error) {
    console.error('Import initialization failed:', error);
    await pool.end();
    throw error;
  }
}

// Run the import
importContainerData()
  .then(() => {
    console.log('Import process completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Import process failed:', error);
    process.exit(1);
  });