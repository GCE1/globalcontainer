import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';

interface LeasingRecord {
  id: string;
  origin: string;
  destination: string;
  containerSize: string;
  price: string;
  freeDays: number;
  perDiem: string;
}

let leasingData: LeasingRecord[] = [];

// Load CSV data on server start
export async function loadLeasingData(): Promise<void> {
  return new Promise((resolve, reject) => {
    const csvPath = path.join(process.cwd(), 'attached_assets', 'LeasingManager.csv');
    
    if (!fs.existsSync(csvPath)) {
      console.error('LeasingManager.csv not found at:', csvPath);
      resolve();
      return;
    }

    const results: LeasingRecord[] = [];
    
    fs.createReadStream(csvPath)
      .pipe(csv({
        mapHeaders: ({ header }) => header.replace(/^\uFEFF/, '').trim() // Remove BOM
      }))
      .on('data', (data) => {
        // Clean and normalize the data
        const record: LeasingRecord = {
          id: `${data.ORIGIN?.trim()}-${data.DESTINATION?.trim()}-${data['Container Size']?.trim()}`.replace(/[^a-zA-Z0-9-]/g, ''),
          origin: data.ORIGIN?.trim() || '',
          destination: data.DESTINATION?.trim() || '',
          containerSize: data['Container Size']?.trim() || '',
          price: data.Price?.trim() || '',
          freeDays: parseInt(data['Free Days']) || 0,
          perDiem: data['Per Diem']?.trim() || ''
        };
        
        if (record.origin && record.destination && record.containerSize) {
          results.push(record);
        }
      })
      .on('end', () => {
        leasingData = results;
        console.log(`Loaded ${leasingData.length} leasing records from CSV`);
        resolve();
      })
      .on('error', (error) => {
        console.error('Error reading CSV:', error);
        reject(error);
      });
  });
}

// Search leasing data
export function searchLeasingData(originQuery: string, destinationQuery: string): LeasingRecord[] {
  // Handle empty queries - return all data limited to 50 results
  if (!originQuery?.trim() && !destinationQuery?.trim()) {
    return leasingData.slice(0, 50);
  }

  const origin = originQuery?.toLowerCase().trim() || '';
  const destination = destinationQuery?.toLowerCase().trim() || '';

  return leasingData.filter(record => {
    const recordOrigin = record.origin.toLowerCase();
    const recordDestination = record.destination.toLowerCase();
    
    // Check for partial matches - allow searching by origin OR destination
    const matchesOrigin = !origin || recordOrigin.includes(origin);
    const matchesDestination = !destination || recordDestination.includes(destination);
    
    return matchesOrigin && matchesDestination;
  }).slice(0, 50); // Limit to 50 results for better performance
}

// Get all unique origins
export function getAllOrigins(): string[] {
  const origins = new Set(leasingData.map(record => record.origin));
  return Array.from(origins).sort();
}

// Get all unique destinations
export function getAllDestinations(): string[] {
  const destinations = new Set(leasingData.map(record => record.destination));
  return Array.from(destinations).sort();
}

// Get destinations that have data for a specific origin
export function getDestinationsForOrigin(origin: string): string[] {
  if (!origin?.trim()) {
    return getAllDestinations();
  }
  
  const originLower = origin.toLowerCase().trim();
  const destinations = new Set<string>();
  
  leasingData.forEach(record => {
    if (record.origin.toLowerCase().includes(originLower)) {
      destinations.add(record.destination);
    }
  });
  
  return Array.from(destinations).sort();
}

// Get origins that have data for a specific destination
export function getOriginsForDestination(destination: string): string[] {
  if (!destination?.trim()) {
    return getAllOrigins();
  }
  
  const destinationLower = destination.toLowerCase().trim();
  const origins = new Set<string>();
  
  leasingData.forEach(record => {
    if (record.destination.toLowerCase().includes(destinationLower)) {
      origins.add(record.origin);
    }
  });
  
  return Array.from(origins).sort();
}

export { leasingData };