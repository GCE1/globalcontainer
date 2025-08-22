import fs from 'fs';
import path from 'path';
import { db } from './db.js';
import { containers } from '../shared/schema.js';

// Export authentic container inventory to CSV for csv-parser
async function exportContainersToCSV() {
  try {
    // Get all authentic containers from database
    const containerData = await db.select().from(containers);
    
    if (containerData.length === 0) {
      console.log('No containers found in database');
      return;
    }

    // CSV header
    const csvHeader = [
      'sku',
      'type', 
      'condition',
      'quantity',
      'price',
      'depot_name',
      'latitude',
      'longitude',
      'address',
      'city',
      'state',
      'postal_code',
      'country'
    ].join(',');

    // Convert container data to CSV rows
    const csvRows = containerData.map(container => [
      container.sku || '',
      container.type || '',
      container.condition || '',
      container.quantity || 1,
      container.price || 0,
      container.depot_name || '',
      container.latitude || 0,
      container.longitude || 0,
      `"${container.address || ''}"`, // Quote address to handle commas
      container.city || '',
      container.state || '',
      container.postal_code || '',
      container.country || 'USA'
    ].join(','));

    // Combine header and rows
    const csvContent = [csvHeader, ...csvRows].join('\n');

    // Write to CSV file
    const csvPath = path.join(__dirname, '../data/authentic-containers.csv');
    
    // Create data directory if it doesn't exist
    const dataDir = path.dirname(csvPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    fs.writeFileSync(csvPath, csvContent, 'utf8');
    
    console.log(`Exported ${containerData.length} authentic containers to CSV: ${csvPath}`);
    return csvPath;
    
  } catch (error) {
    console.error('Error exporting containers to CSV:', error);
    throw error;
  }
}

export { exportContainersToCSV };