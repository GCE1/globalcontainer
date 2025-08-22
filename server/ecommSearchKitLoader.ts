import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

interface EcommSearchKitContainer {
  container_id: string;
  container_sku: string;
  Type: string;
  container_size: string;
  container_condition: string;
  location_name: string;
  latitude: string;
  longitude: string;
  available_date: string;
  price_usd: string;
  owner_id: string;
  zip_code: string;
  last_inspection_date: string;
}

interface ProductCatalogContainer {
  id: number;
  sku: string;
  type: string;
  condition: string;
  location: string;
  city: string;
  state: string;
  price: number;
  quantity: number;
  depot_name: string;
  image?: string;
}

let cachedContainers: ProductCatalogContainer[] = [];
let isLoaded = false;

export async function loadEcommSearchKitContainers(): Promise<ProductCatalogContainer[]> {
  if (isLoaded && cachedContainers.length > 0) {
    return cachedContainers;
  }

  return new Promise((resolve, reject) => {
    const containers: ProductCatalogContainer[] = [];
    const csvPath = path.join(process.cwd(), 'EcommSearchKit/data/container-data 4.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.error('EcommSearchKit container data file not found:', csvPath);
      resolve([]);
      return;
    }

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row: EcommSearchKitContainer) => {
        try {
          const container: ProductCatalogContainer = {
            id: parseInt(row.container_id) || containers.length + 1,
            sku: row.container_sku || `CONT-${containers.length + 1}`,
            type: row.container_size || row.Type || 'Standard Container',
            condition: row.container_condition?.trim() || 'Unknown',
            location: row.location_name || 'Unknown Location',
            city: row.location_name?.split(',')[0] || 'Unknown',
            state: getStateFromLocation(row.location_name || ''),
            price: calculateContainerPrice(row.container_size, row.container_condition),
            quantity: Math.floor(Math.random() * 10) + 1, // Random quantity 1-10
            depot_name: `${row.location_name} Depot` || 'GCE Depot',
            image: `/attached_assets/container-${(row.container_size || 'standard').toLowerCase()}-${(row.container_condition || 'standard').toLowerCase().replace(/\s+/g, '-')}.jpg`
          };
          containers.push(container);
        } catch (error) {
          console.error('Error parsing container row:', error);
        }
      })
      .on('end', () => {
        console.log(`Loaded ${containers.length} containers from EcommSearchKit data`);
        cachedContainers = containers;
        isLoaded = true;
        resolve(containers);
      })
      .on('error', (error) => {
        console.error('Error reading EcommSearchKit CSV:', error);
        reject(error);
      });
  });
}

function getStateFromLocation(location: string): string {
  const stateMap: Record<string, string> = {
    'Atlanta': 'GA',
    'Los Angeles': 'CA',
    'New York': 'NY',
    'Chicago': 'IL',
    'Houston': 'TX',
    'Miami': 'FL',
    'Seattle': 'WA',
    'Boston': 'MA',
    'Denver': 'CO',
    'Phoenix': 'AZ'
  };
  
  for (const [city, state] of Object.entries(stateMap)) {
    if (location.includes(city)) {
      return state;
    }
  }
  return 'Unknown';
}

function calculateContainerPrice(size: string, condition: string): number {
  let basePrice = 2500; // Base price for 20ft container
  
  // Adjust for size
  if (size?.includes('40')) {
    basePrice = 3500;
  } else if (size?.includes('45')) {
    basePrice = 4200;
  } else if (size?.includes('53')) {
    basePrice = 5000;
  }
  
  // Adjust for condition
  const conditionMultiplier: Record<string, number> = {
    'Brand New': 1.5,
    'IICL': 1.2,
    'Cargo Worthy': 1.0,
    'Wind and Water Tight': 0.8,
    'AS IS': 0.6
  };
  
  const multiplier = conditionMultiplier[condition?.trim()] || 1.0;
  return Math.round(basePrice * multiplier);
}

export function searchContainers(containers: ProductCatalogContainer[], query: string): ProductCatalogContainer[] {
  if (!query) return containers;
  
  const lowerQuery = query.toLowerCase();
  return containers.filter(container =>
    container.sku.toLowerCase().includes(lowerQuery) ||
    container.type.toLowerCase().includes(lowerQuery) ||
    container.condition.toLowerCase().includes(lowerQuery) ||
    container.location.toLowerCase().includes(lowerQuery) ||
    container.city.toLowerCase().includes(lowerQuery)
  );
}

export function filterContainersByType(containers: ProductCatalogContainer[], type: string): ProductCatalogContainer[] {
  if (!type || type === 'all') return containers;
  return containers.filter(container => container.type === type);
}

export function filterContainersByCondition(containers: ProductCatalogContainer[], condition: string): ProductCatalogContainer[] {
  if (!condition || condition === 'all') return containers;
  return containers.filter(container => container.condition === condition);
}