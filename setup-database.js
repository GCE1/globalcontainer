import fs from 'fs';
import csv from 'csv-parser';
import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function setupDatabase() {
  try {
    console.log('Setting up database schema...');

    // Drop and recreate containers table with correct structure
    await sql`DROP TABLE IF EXISTS containers CASCADE`;
    
    await sql`
      CREATE TABLE containers (
        id SERIAL PRIMARY KEY,
        sku TEXT NOT NULL UNIQUE,
        type TEXT NOT NULL,
        condition TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        price DECIMAL(10,2) NOT NULL,
        depot_name TEXT NOT NULL,
        latitude DOUBLE PRECISION NOT NULL,
        longitude DOUBLE PRECISION NOT NULL,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        state TEXT NOT NULL,
        postal_code TEXT NOT NULL,
        country TEXT DEFAULT 'USA',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      )
    `;

    console.log('Database schema created successfully');

    // Import CSV data
    const containers = [];

    await new Promise((resolve, reject) => {
      fs.createReadStream('./attached_assets/sample-import.csv')
        .pipe(csv())
        .on('data', (row) => {
          // Parse container type from CSV description
          let containerType = '20DC'; // default
          if (row.container_type.includes('10DC')) containerType = '10DC';
          else if (row.container_type.includes('20DC')) containerType = '20DC';
          else if (row.container_type.includes('20HC')) containerType = '20HC';
          else if (row.container_type.includes('40DC')) containerType = '40DC';
          else if (row.container_type.includes('40HC')) containerType = '40HC';
          else if (row.container_type.includes('45HC')) containerType = '45HC';
          else if (row.container_type.includes('53HC')) containerType = '53HC';

          // Calculate realistic pricing
          const basePrice = {
            '10DC': 2500, '20DC': 3500, '20HC': 4000, 
            '40DC': 5500, '40HC': 6000, '45HC': 7500, '53HC': 8500
          };

          const conditionMultiplier = {
            'Brand New': 1.0, 'IICL': 0.85, 'Cargo Worthy': 0.75,
            'Wind and Water Tight': 0.65, 'AS IS': 0.45
          };

          const condition = row.container_condition.trim();
          const price = Math.round((basePrice[containerType] || 3500) * (conditionMultiplier[condition] || 0.75));

          containers.push({
            sku: row.sku,
            type: containerType,
            condition: condition,
            quantity: parseInt(row.quantity) || 1,
            price: price,
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

    console.log(`Importing ${containers.length} containers...`);

    // Insert containers
    for (const container of containers) {
      await sql`
        INSERT INTO containers (
          sku, type, condition, quantity, price, depot_name,
          latitude, longitude, address, city, state, postal_code, country
        ) VALUES (
          ${container.sku}, ${container.type}, ${container.condition}, 
          ${container.quantity}, ${container.price}, ${container.depot_name},
          ${container.latitude}, ${container.longitude}, ${container.address},
          ${container.city}, ${container.state}, ${container.postal_code}, ${container.country}
        )
      `;
    }

    console.log('✅ Database setup and import completed!');

    // Show available types and conditions
    const types = await sql`SELECT DISTINCT type FROM containers ORDER BY type`;
    const conditions = await sql`SELECT DISTINCT condition FROM containers ORDER BY condition`;

    console.log('\n📦 Available Container Types:');
    types.forEach(row => console.log(`- ${row.type}`));

    console.log('\n🔧 Available Conditions:');
    conditions.forEach(row => console.log(`- ${row.condition}`));

    console.log(`\n📍 Total containers imported: ${containers.length}`);

  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  }
}

setupDatabase();