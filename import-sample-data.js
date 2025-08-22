import fs from 'fs';
import csv from 'csv-parser';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

function parseContainerType(containerType) {
  // Extract the basic container type from the full description
  if (containerType.includes('10DC')) return '10DC';
  if (containerType.includes('20DC')) return '20DC';
  if (containerType.includes('20HC')) return '20HC';
  if (containerType.includes('40DC')) return '40DC';
  if (containerType.includes('40HC')) return '40HC';
  if (containerType.includes('45HC')) return '45HC';
  if (containerType.includes('53HC')) return '53HC';
  if (containerType.includes('20RF')) return '20RF';
  if (containerType.includes('40RF')) return '40RF';
  if (containerType.includes('20OT')) return '20OT';
  if (containerType.includes('40OT')) return '40OT';
  if (containerType.includes('20SD')) return '20SD';
  if (containerType.includes('40SD')) return '40SD';
  if (containerType.includes('20DD')) return '20DD';
  if (containerType.includes('40DD')) return '40DD';
  if (containerType.includes('40PW')) return '40PW';
  if (containerType.includes('45PW')) return '45PW';
  return '20DC'; // Default fallback
}

function calculatePrice(containerType, condition) {
  const basePrice = {
    '10DC': 2500,
    '20DC': 3500,
    '20HC': 4000,
    '40DC': 5500,
    '40HC': 6000,
    '45HC': 7500,
    '53HC': 8500,
    '20RF': 8000,
    '40RF': 12000,
    '20OT': 4500,
    '40OT': 7000,
    '20SD': 4200,
    '40SD': 6500,
    '20DD': 4300,
    '40DD': 6600,
    '40PW': 6200,
    '45PW': 7800
  };

  const conditionMultiplier = {
    'Brand New': 1.0,
    'IICL': 0.85,
    'Cargo Worthy': 0.75,
    'Wind and Water Tight': 0.65,
    'AS IS': 0.45
  };

  const base = basePrice[containerType] || 3500;
  const multiplier = conditionMultiplier[condition] || 0.75;
  return Math.round(base * multiplier);
}

async function importSampleData() {
  try {
    console.log('Starting CSV import...');

    // First, clear existing data
    await sql`DELETE FROM containers`;
    console.log('Cleared existing container data');

    const containers = [];

    // Read and parse CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream('./attached_assets/sample-import.csv')
        .pipe(csv())
        .on('data', (row) => {
          const containerType = parseContainerType(row.container_type);
          const condition = row.container_condition.trim();
          const price = calculatePrice(containerType, condition);

          containers.push({
            sku: row.sku,
            type: containerType,
            condition: condition,
            price: price,
            quantity: parseInt(row.quantity) || 1,
            depot_name: row.depot_name,
            latitude: parseFloat(row.latitude),
            longitude: parseFloat(row.longitude),
            address: row.address,
            city: row.city,
            state: row.state,
            postal_code: row.postal_code,
            country: row.country || 'USA'
          });
        })
        .on('end', resolve)
        .on('error', reject);
    });

    console.log(`Parsed ${containers.length} containers from CSV`);

    // Insert containers in batches
    const batchSize = 50;
    for (let i = 0; i < containers.length; i += batchSize) {
      const batch = containers.slice(i, i + batchSize);
      
      for (const container of batch) {
        await sql`
          INSERT INTO containers (
            sku, type, condition, price, quantity, depot_name, 
            latitude, longitude, address, city, state, postal_code, country
          ) VALUES (
            ${container.sku}, ${container.type}, ${container.condition}, 
            ${container.price}, ${container.quantity}, ${container.depot_name},
            ${container.latitude}, ${container.longitude}, ${container.address},
            ${container.city}, ${container.state}, ${container.postal_code}, ${container.country}
          )
        `;
      }
      
      console.log(`Imported batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(containers.length/batchSize)}`);
    }

    console.log('✅ Sample data import completed successfully!');
    console.log(`Imported ${containers.length} containers`);

    // Show summary
    const summary = await sql`
      SELECT 
        type,
        condition,
        COUNT(*) as count,
        AVG(price) as avg_price
      FROM containers 
      GROUP BY type, condition 
      ORDER BY type, condition
    `;

    console.log('\n📊 Import Summary:');
    summary.forEach(row => {
      console.log(`${row.type} ${row.condition}: ${row.count} containers (avg $${Math.round(row.avg_price)})`);
    });

  } catch (error) {
    console.error('Import failed:', error);
    process.exit(1);
  }
}

importSampleData();