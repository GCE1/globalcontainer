import { runCsvImport } from '../utils/csv-import';
import { parseContainersForWooCommerce } from '../utils/csv-parser';
import { wooCommerce } from '../utils/woocommerce';
import path from 'path';

async function importData() {
  try {
    console.log('Starting data import process...');
    
    // Run CSV import for depot locations and containers
    await runCsvImport();
    
    // Import WooCommerce products if configured
    if (wooCommerce.isConfigured()) {
      const csvFilePath = path.resolve('data/sample-import.csv');
      const wooProducts = parseContainersForWooCommerce(csvFilePath);
      await wooCommerce.syncProductsFromCsv(wooProducts);
    } else {
      console.log('WooCommerce API not configured. Skipping WooCommerce sync.');
    }
    
    console.log('Data import process completed successfully.');
  } catch (error) {
    console.error('Error during data import:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the import
importData();