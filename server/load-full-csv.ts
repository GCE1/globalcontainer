import { db } from "./db";
import { containers, depotLocations } from "../shared/schema";
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

interface CSVRow {
  depot_name: string;
  container_type: string;
  container_condition: string;
  quantity: string;
  price: string;
  sku: string;
  latitude: string;
  longitude: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

// Map CSV condition names to our schema
const conditionMap: Record<string, string> = {
  'Brand New': 'new',
  'AS IS ': 'as-is',
  'AS IS': 'as-is',
  'Wind and Water Tight': 'wind-water-tight',
  'Cargo Worthy ': 'cargo-worthy',
  'Cargo Worthy': 'cargo-worthy',
  'IICL': 'iicl'
};

// Extract container type from container_type field
function parseContainerType(containerType: string): string {
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

// Calculate price based on container type and condition
function calculatePrice(containerType: string, condition: string): string {
  const basePrice: Record<string, number> = {
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

  const conditionMultiplier: Record<string, number> = {
    'new': 1.8,
    'iicl': 1.4,
    'cargo-worthy': 1.0,
    'wind-water-tight': 0.8,
    'as-is': 0.5
  };

  const type = parseContainerType(containerType);
  const base = basePrice[type] || 3500;
  const multiplier = conditionMultiplier[condition] || 1.0;
  
  // Add variation for special features
  let finalPrice = base * multiplier;
  if (containerType.includes('Refrigerated')) finalPrice *= 2.2;
  if (containerType.includes('Open Top')) finalPrice *= 1.3;
  if (containerType.includes('Side Door')) finalPrice *= 1.2;
  if (containerType.includes('Double Door')) finalPrice *= 1.15;
  if (containerType.includes('Pallet Wide')) finalPrice *= 1.1;
  
  return Math.round(finalPrice).toString();
}

// Load complete CSV data
export async function loadFullCSVData() {
  try {
    console.log('Clearing existing data...');
    await db.delete(containers);
    await db.delete(depotLocations);

    const csvPath = path.join(process.cwd(), 'EcommSearchKit/data/sample-import.csv');
    console.log('Reading complete CSV file from:', csvPath);
    
    const depotsMap = new Map<string, number>();
    const rows: CSVRow[] = [];
    
    // Read and parse CSV
    return new Promise<{ success: boolean; message?: string; error?: string }>((resolve) => {
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row: CSVRow) => {
          rows.push(row);
        })
        .on('end', async () => {
          console.log(`Parsed ${rows.length} rows from complete CSV`);
          
          try {
            // Create depots first
            const uniqueDepots = new Set<string>();
            for (const row of rows) {
              uniqueDepots.add(row.depot_name);
            }
            
            console.log(`Found ${uniqueDepots.size} unique depots`);
            
            for (const row of rows) {
              if (!depotsMap.has(row.depot_name)) {
                console.log(`Creating depot: ${row.depot_name} in ${row.city}, ${row.state}`);
                try {
                  const depot = await db.insert(depotLocations).values({
                    depotName: row.depot_name,
                    latitude: parseFloat(row.latitude) || 0,
                    longitude: parseFloat(row.longitude) || 0,
                    address: row.address || '',
                    city: row.city || '',
                    state: row.state || '',
                    postalCode: row.postal_code || '',
                    country: row.country || 'USA'
                  }).returning();
                  
                  depotsMap.set(row.depot_name, depot[0].id);
                } catch (depotError) {
                  console.error(`Error creating depot ${row.depot_name}:`, depotError);
                }
              }
            }
            
            // Create containers
            let containerCount = 0;
            let batchSize = 100;
            let batch = [];
            
            for (const row of rows) {
              const depotId = depotsMap.get(row.depot_name);
              if (!depotId) continue;
              
              const condition = conditionMap[row.container_condition.trim()] || 'used';
              const type = parseContainerType(row.container_type);
              const price = calculatePrice(row.container_type, condition);
              
              // Generate a proper description
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
              
              const containerData = {
                name: row.container_type,
                type: type,
                condition: condition,
                description: description,
                depotId: depotId,
                location: `${row.city}, ${row.state}`,
                region: row.state,
                city: row.city,
                postalCode: row.postal_code,
                price: price,
                image: '/api/placeholder/400/300',
                sku: row.sku,
                shipping: true,
                availableImmediately: condition === 'new' || condition === 'iicl',
                leaseAvailable: true
              };
              
              batch.push(containerData);
              
              if (batch.length >= batchSize) {
                try {
                  await db.insert(containers).values(batch);
                  containerCount += batch.length;
                  console.log(`Imported ${containerCount} containers...`);
                  batch = [];
                } catch (batchError) {
                  console.error('Error inserting container batch:', batchError);
                }
              }
            }
            
            // Insert remaining containers
            if (batch.length > 0) {
              try {
                await db.insert(containers).values(batch);
                containerCount += batch.length;
              } catch (finalBatchError) {
                console.error('Error inserting final container batch:', finalBatchError);
              }
            }
            
            console.log(`Successfully imported ${containerCount} containers from ${depotsMap.size} depots`);
            resolve({ success: true, message: `Loaded ${containerCount} containers from ${depotsMap.size} depots` });
          } catch (error) {
            console.error('Error importing CSV data:', error);
            resolve({ success: false, error: String(error) });
          }
        })
        .on('error', (error) => {
          console.error('Error reading CSV file:', error);
          resolve({ success: false, error: String(error) });
        });
    });
  } catch (error) {
    console.error('Error loading CSV data:', error);
    return { success: false, error: String(error) };
  }
}