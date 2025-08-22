import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import { MemStorage } from './storage';
import { DepotLocation, Container } from '../shared/schema';

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
  'AS IS': 'as-is',
  'Wind and Water Tight': 'wind-water-tight',
  'Cargo Worthy': 'cargo-worthy',
  'IICL': 'iicl'
};

// Extract container type from container_type field
function parseContainerType(containerType: string): string {
  if (containerType.includes('10DC')) return '10ft';
  if (containerType.includes('20DC')) return '20ft';
  if (containerType.includes('20HC')) return '20ft-hc';
  if (containerType.includes('40DC')) return '40ft';
  if (containerType.includes('40HC')) return '40ft-hc';
  if (containerType.includes('45HC')) return '45ft-hc';
  if (containerType.includes('53HC')) return '53ft-hc';
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
    '53ft-hc': 9000
  };

  const conditionMultiplier: Record<string, number> = {
    'new': 1.5,
    'iicl': 1.2,
    'cargo-worthy': 1.0,
    'wind-water-tight': 0.8,
    'as-is': 0.6
  };

  const type = parseContainerType(containerType);
  const base = basePrice[type] || 3500;
  const multiplier = conditionMultiplier[condition] || 1.0;
  
  // Add variation for special features
  let finalPrice = base * multiplier;
  if (containerType.includes('Refrigerated')) finalPrice *= 2.5;
  if (containerType.includes('Open Top')) finalPrice *= 1.3;
  if (containerType.includes('Side Door')) finalPrice *= 1.2;
  if (containerType.includes('Double Door')) finalPrice *= 1.15;
  if (containerType.includes('Pallet Wide')) finalPrice *= 1.1;
  
  return Math.round(finalPrice).toString();
}

export async function importCSVData() {
  const storage = new MemStorage();
  const csvPath = path.join(process.cwd(), 'EcommSearchKit/data/sample-import.csv');
  
  console.log('Starting CSV import...');
  
  // First, clear existing data
  await storage.clearAllData();
  console.log('Cleared existing data');
  
  const depotsMap = new Map<string, number>();
  const rows: CSVRow[] = [];
  
  // Read and parse CSV
  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row: CSVRow) => {
        rows.push(row);
      })
      .on('end', async () => {
        console.log(`Parsed ${rows.length} rows from CSV`);
        
        try {
          // Create depots first
          for (const row of rows) {
            if (!depotsMap.has(row.depot_name)) {
              const depot = await storage.createDepot({
                name: row.depot_name,
                location: `${row.city}, ${row.state}`,
                address: row.address,
                city: row.city,
                state: row.state,
                postalCode: row.postal_code,
                country: row.country,
                latitude: parseFloat(row.latitude),
                longitude: parseFloat(row.longitude),
                phone: '+1-800-CONTAINERS',
                email: `${row.city.toLowerCase().replace(/\s+/g, '')}@globalcontainer.exchange`,
                operatingHours: 'Mon-Fri 8AM-6PM, Sat 9AM-4PM'
              });
              depotsMap.set(row.depot_name, depot.id);
              console.log(`Created depot: ${row.depot_name}`);
            }
          }
          
          // Create containers
          let containerCount = 0;
          for (const row of rows) {
            const depotId = depotsMap.get(row.depot_name);
            if (!depotId) continue;
            
            const condition = conditionMap[row.container_condition.trim()] || 'used';
            const type = parseContainerType(row.container_type);
            const price = calculatePrice(row.container_type, condition);
            
            // Generate a proper description
            let description = `${row.container_type} in ${row.container_condition} condition.`;
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
            
            await storage.createContainer({
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
            });
            
            containerCount++;
            if (containerCount % 50 === 0) {
              console.log(`Imported ${containerCount} containers...`);
            }
          }
          
          console.log(`Successfully imported ${containerCount} containers from ${depotsMap.size} depots`);
          resolve();
        } catch (error) {
          console.error('Error importing CSV data:', error);
          reject(error);
        }
      })
      .on('error', reject);
  });
}

// Run the import if this file is executed directly
if (require.main === module) {
  importCSVData()
    .then(() => {
      console.log('CSV import completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('CSV import failed:', error);
      process.exit(1);
    });
}