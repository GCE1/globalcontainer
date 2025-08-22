import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

interface WholesaleContainer {
  id: number;
  sku: string;
  country: string;
  city: string;
  sizeAndType: string;
  containerType: string;
  condition: string;
  price: number;
  location: string;
  availability: string;
  lastInspection: string;
  created_at: string;
}

let wholesaleContainers: WholesaleContainer[] = [];
let isLoaded = false;

// Parse container type from "Size and Type" field
function parseContainerType(sizeAndType: string): string {
  if (sizeAndType.includes('40HC')) return '40HC';
  if (sizeAndType.includes('40GP')) return '40GP';
  if (sizeAndType.includes('40DD')) return '40DC';
  if (sizeAndType.includes('20HC')) return '20HC';
  if (sizeAndType.includes('20GP')) return '20GP';
  if (sizeAndType.includes('20DD')) return '20DC';
  if (sizeAndType.includes('45HC')) return '45HC';
  if (sizeAndType.includes('20OT')) return '20DC';
  if (sizeAndType.includes('40OT')) return '40DC';
  return '40HC';
}

// Parse condition from "Size and Type" field
function parseCondition(sizeAndType: string): string {
  if (sizeAndType.includes('New')) return 'Brand New';
  if (sizeAndType.includes('IICL')) return 'IICL';
  if (sizeAndType.includes('Cw') || sizeAndType.includes('CW')) return 'Cargo Worthy';
  if (sizeAndType.includes('WWT')) return 'Wind and Water Tight';
  if (sizeAndType.includes('AS IS')) return 'AS IS';
  return 'Brand New'; // Default condition
}

// Generate SKU based on container details
function generateSKU(country: string, city: string, containerType: string, condition: string, index: number): string {
  const countryCode = country.substring(0, 2).toUpperCase();
  const cityCode = city.substring(0, 3).toUpperCase().replace(/[^A-Z]/g, '');
  const typeCode = containerType.replace(/[^A-Z0-9]/g, '');
  const conditionCode = condition === 'Brand New' ? 'BN' : 
                       condition === 'IICL' ? 'IC' :
                       condition === 'Cargo Worthy' ? 'CW' :
                       condition === 'Wind and Water Tight' ? 'WW' :
                       'AS';
  return `${typeCode}${conditionCode}${countryCode}${cityCode}${String(index).padStart(3, '0')}`;
}

export async function loadWholesaleContainers(): Promise<WholesaleContainer[]> {
  if (isLoaded && wholesaleContainers.length > 0) {
    return wholesaleContainers;
  }

  const csvPath = path.join(process.cwd(), 'attached_assets', 'Wholesale Containers.csv');
  
  return new Promise((resolve, reject) => {
    if (!fs.existsSync(csvPath)) {
      console.error('Wholesale Containers CSV not found at:', csvPath);
      resolve([]);
      return;
    }

    const containers: WholesaleContainer[] = [];
    let index = 1;

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          const country = row.COUNTRY?.trim() || '';
          const city = row.CITY?.trim() || '';
          const sizeAndType = row['Size and Type']?.trim() || '';
          const price = parseFloat(row.Price) || 0;

          if (!country || !city || !sizeAndType) {
            return; // Skip invalid rows
          }

          const containerType = parseContainerType(sizeAndType);
          const condition = parseCondition(sizeAndType);
          const sku = generateSKU(country, city, containerType, condition, index);
          const location = `${city}, ${country}`;

          const container: WholesaleContainer = {
            id: index,
            sku,
            country,
            city,
            sizeAndType,
            containerType,
            condition,
            price,
            location,
            availability: 'Available',
            lastInspection: '2025-01-15',
            created_at: '2025-01-01'
          };

          containers.push(container);
          index++;
        } catch (error) {
          console.error('Error processing row:', row, error);
        }
      })
      .on('end', () => {
        wholesaleContainers = containers;
        isLoaded = true;
        console.log(`Loaded ${containers.length} wholesale containers from CSV`);
        resolve(containers);
      })
      .on('error', (error) => {
        console.error('Error reading wholesale containers CSV:', error);
        reject(error);
      });
  });
}

export function searchWholesaleContainers(containers: WholesaleContainer[], query: string): WholesaleContainer[] {
  if (!query.trim()) return containers;
  
  const searchTerm = query.toLowerCase();
  return containers.filter(container => 
    container.sku.toLowerCase().includes(searchTerm) ||
    container.country.toLowerCase().includes(searchTerm) ||
    container.city.toLowerCase().includes(searchTerm) ||
    container.location.toLowerCase().includes(searchTerm) ||
    container.containerType.toLowerCase().includes(searchTerm) ||
    container.condition.toLowerCase().includes(searchTerm)
  );
}

export function filterWholesaleContainersByType(containers: WholesaleContainer[], type: string): WholesaleContainer[] {
  if (!type || type === 'all') return containers;
  return containers.filter(container => container.containerType === type);
}

export function filterWholesaleContainersByCondition(containers: WholesaleContainer[], condition: string): WholesaleContainer[] {
  if (!condition || condition === 'all') return containers;
  return containers.filter(container => container.condition === condition);
}

export function filterWholesaleContainersByCountry(containers: WholesaleContainer[], country: string): WholesaleContainer[] {
  if (!country || country === 'all') return containers;
  return containers.filter(container => container.country === country);
}

// Get unique countries for filter options
export function getUniqueCountries(containers: WholesaleContainer[]): string[] {
  const countries: string[] = [];
  const seen: { [key: string]: boolean } = {};
  
  for (const container of containers) {
    if (!seen[container.country]) {
      countries.push(container.country);
      seen[container.country] = true;
    }
  }
  
  return countries.sort();
}

// Get unique container types for filter options
export function getUniqueContainerTypes(containers: WholesaleContainer[]): string[] {
  const types: string[] = [];
  const seen: { [key: string]: boolean } = {};
  
  for (const container of containers) {
    if (!seen[container.containerType]) {
      types.push(container.containerType);
      seen[container.containerType] = true;
    }
  }
  
  return types.sort();
}

// Get unique conditions for filter options
export function getUniqueConditions(containers: WholesaleContainer[]): string[] {
  const conditions: string[] = [];
  const seen: { [key: string]: boolean } = {};
  
  for (const container of containers) {
    if (!seen[container.condition]) {
      conditions.push(container.condition);
      seen[container.condition] = true;
    }
  }
  
  return conditions.sort();
}

// Add new container to wholesale inventory
export async function addContainerToDatabase(containerData: any) {
  try {
    // Generate a new ID for the container
    const newId = wholesaleContainers.length > 0 ? Math.max(...wholesaleContainers.map(c => c.id)) + 1 : 1;
    
    // Create wholesale container object
    const wholesaleContainer: WholesaleContainer = {
      id: newId,
      sku: containerData.sku,
      country: containerData.country || 'United States',
      city: containerData.location,
      sizeAndType: `${containerData.containerSize}${containerData.containerType} ${containerData.condition}`,
      containerType: `${containerData.containerSize}${containerData.containerType}`,
      condition: containerData.condition,
      price: containerData.price,
      location: containerData.location,
      availability: containerData.availability || 'available',
      lastInspection: containerData.lastInspectionDate || new Date().toISOString().split('T')[0],
      created_at: new Date().toISOString()
    };
    
    // Add to memory cache for immediate availability
    wholesaleContainers.push(wholesaleContainer);
    
    // Return the container data
    return {
      id: newId,
      sku: containerData.sku,
      title: containerData.title,
      containerType: containerData.containerType,
      containerSize: containerData.containerSize,
      condition: containerData.condition,
      price: containerData.price,
      location: containerData.location,
      country: containerData.country,
      availability: containerData.availability,
      createdAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error adding container to wholesale inventory:', error);
    throw error;
  }
}