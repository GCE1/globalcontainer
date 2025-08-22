import { importDepotLocations, importContainerData } from '../utils/csv-import';
import { parseContainersForWooCommerce } from '../utils/csv-parser';
import { wooCommerce } from '../utils/woocommerce';
import path from 'path';

async function importAttachedData() {
  try {
    console.log('Starting import process for the attached CSV file...');
    
    // Path to the attached CSV file
    const csvFilePath = path.resolve('attached_assets/sample-import.csv');
    
    // Import depot locations from the CSV file
    await importDepotLocations(csvFilePath);
    
    // Import container data from the CSV file
    await importContainerData(csvFilePath);
    
    // Import WooCommerce products if configured
    if (wooCommerce.isConfigured()) {
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
importAttachedData();