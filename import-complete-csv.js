import fs from 'fs';
import csv from 'csv-parser';
import { Client } from 'pg';

// Database connection
const client = new Client({
  connectionString: process.env.DATABASE_URL
});

const conditionMap = {
  'Brand New': 'new',
  'AS IS ': 'as-is',
  'AS IS': 'as-is',
  'Wind and Water Tight': 'wind-water-tight',
  'Cargo Worthy ': 'cargo-worthy',
  'Cargo Worthy': 'cargo-worthy',
  'IICL': 'iicl'
};

function parseContainerType(containerType) {
  if (containerType.includes('10DC')) return '10ft';
  if (containerType.includes('20DC') && !containerType.includes('20HC')) return '20ft';
  if (containerType.includes('20HC')) return '20ft-hc';
  if (containerType.includes('40DC') && !containerType.includes('40HC')) return '40ft';
  if (containerType.includes('40HC')) return '40ft-hc';
  if (containerType.includes('45HC')) return '45ft-hc';
  if (containerType.includes('53HC')) return '53ft-hc';
  if (containerType.includes('Refrigerated')) return 'refrigerated';
  if (containerType.includes('Open Top')) return 'open-top';
  if (containerType.includes('Side Door')) return 'side-door';
  if (containerType.includes('Double Door')) return 'double-door';
  if (containerType.includes('Pallet Wide')) return 'pallet-wide';
  return 'standard';
}

function calculatePrice(containerType, condition) {
  const basePrice = {
    '10ft': 2500,
    '20ft': 3500,
    '20ft-hc': 3800,
    '40ft': 5500,
    '40ft-hc': 6000,
    '45ft-hc': 7500,
    '53ft-hc': 9000,
    'refrigerated': 12500,
    'open-top': 4200,
    'side-door': 4200,
    'double-door': 4000,
    'pallet-wide': 6500
  };

  const conditionMultiplier = {
    'new': 1.8,
    'iicl': 1.4,
    'cargo-worthy': 1.0,
    'wind-water-tight': 0.8,
    'as-is': 0.5
  };

  const type = parseContainerType(containerType);
  const base = basePrice[type] || 3500;
  const multiplier = conditionMultiplier[condition] || 1.0;
  
  let finalPrice = base * multiplier;
  if (containerType.includes('Refrigerated')) finalPrice *= 2.2;
  if (containerType.includes('Open Top')) finalPrice *= 1.3;
  if (containerType.includes('Side Door')) finalPrice *= 1.2;
  if (containerType.includes('Double Door')) finalPrice *= 1.15;
  if (containerType.includes('Pallet Wide')) finalPrice *= 1.1;
  
  return Math.round(finalPrice);
}

async function importCompleteCSV() {
  try {
    await client.connect();
    console.log('Connected to database');

    // Clear existing data
    console.log('Clearing existing data...');
    await client.query('DELETE FROM containers');
    await client.query('DELETE FROM depot_locations');
    
    const depotsMap = new Map();
    const rows = [];
    
    // Read CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream('./EcommSearchKit/data/sample-import.csv')
        .pipe(csv())
        .on('data', (row) => {
          rows.push(row);
        })
        .on('end', () => {
          console.log(`Parsed ${rows.length} rows from CSV`);
          resolve();
        })
        .on('error', reject);
    });

    // Create depots
    console.log('Creating depots...');
    for (const row of rows) {
      if (!depotsMap.has(row.depot_name)) {
        const result = await client.query(`
          INSERT INTO depot_locations (depot_name, latitude, longitude, address, city, state, postal_code, country, created_at, updated_at)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
          RETURNING id
        `, [
          row.depot_name,
          parseFloat(row.latitude) || 0,
          parseFloat(row.longitude) || 0,
          row.address || '',
          row.city || '',
          row.state || '',
          row.postal_code || '',
          row.country || 'USA'
        ]);
        
        depotsMap.set(row.depot_name, result.rows[0].id);
        console.log(`Created depot: ${row.depot_name} in ${row.city}, ${row.state}`);
      }
    }

    // Create containers in batches
    console.log('Creating containers...');
    let containerCount = 0;
    const batchSize = 100;
    
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      const values = [];
      const placeholders = [];
      
      for (let j = 0; j < batch.length; j++) {
        const row = batch[j];
        const depotId = depotsMap.get(row.depot_name);
        if (!depotId) continue;
        
        const condition = conditionMap[row.container_condition.trim()] || 'used';
        const type = parseContainerType(row.container_type);
        const price = calculatePrice(row.container_type, condition);
        
        let description = `${row.container_type} in ${row.container_condition.trim()} condition.`;
        if (row.container_type.includes('Refrigerated')) {
          description += ' Temperature-controlled container perfect for perishable goods.';
        } else if (row.container_type.includes('Open Top')) {
          description += ' Open-top design for oversized cargo loading.';
        } else if (row.container_type.includes('Side Door')) {
          description += ' Side door access for convenient loading and unloading.';
        } else if (row.container_type.includes('Double Door')) {
          description += ' Double door configuration for enhanced accessibility.';
        } else if (row.container_type.includes('Pallet Wide')) {
          description += ' Pallet-wide design optimized for standard pallet configurations.';
        } else {
          description += ' Versatile container suitable for storage and shipping applications.';
        }
        
        const baseIndex = j * 14;
        placeholders.push(`($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5}, $${baseIndex + 6}, $${baseIndex + 7}, $${baseIndex + 8}, $${baseIndex + 9}, $${baseIndex + 10}, $${baseIndex + 11}, $${baseIndex + 12}, $${baseIndex + 13}, $${baseIndex + 14})`);
        
        values.push(
          row.container_type,
          type,
          condition,
          description,
          depotId,
          `${row.city}, ${row.state}`,
          row.state,
          row.city,
          row.postal_code,
          price.toString(),
          '/api/placeholder/400/300',
          row.sku,
          condition === 'new' || condition === 'iicl',
          true
        );
      }
      
      if (values.length > 0) {
        const query = `
          INSERT INTO containers (name, type, condition, description, depot_id, location, region, city, postal_code, price, image, sku, available_immediately, lease_available)
          VALUES ${placeholders.join(', ')}
        `;
        
        await client.query(query, values);
        containerCount += batch.length;
        console.log(`Imported ${containerCount} containers...`);
      }
    }

    console.log(`Successfully imported ${containerCount} containers from ${depotsMap.size} depots`);
    await client.end();
    
  } catch (error) {
    console.error('Error importing CSV:', error);
    await client.end();
  }
}

importCompleteCSV();