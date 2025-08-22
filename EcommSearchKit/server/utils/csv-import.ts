import path from 'path';
import { db } from '../db';
import { 
  depotLocations, 
  containers, 
  insertDepotLocationSchema,
  insertContainerSchema
} from '@shared/schema';
import { eq } from 'drizzle-orm';
import { 
  parseLocationsFromCsv, 
  parseContainerTypesAndConditions, 
  getAllContainerData,
  LocationData
} from './csv-parser';

/**
 * Import depot locations from CSV file
 */
export async function importDepotLocations(csvFilePath: string): Promise<void> {
  try {
    console.log('Importing depot locations from CSV...');
    const locations = parseLocationsFromCsv(csvFilePath);
    
    if (locations.length === 0) {
      console.log('No depot locations found in CSV file.');
      return;
    }
    
    console.log(`Found ${locations.length} unique depot locations.`);
    
    // Insert each location into the database
    for (const location of locations) {
      try {
        // Check if the location already exists
        const existingLocation = await db
          .select()
          .from(depotLocations)
          .where(
            eq(depotLocations.depotName, location.depot_name)
          )
          .limit(1);
        
        // Skip if the location already exists
        if (existingLocation.length > 0) {
          console.log(`Depot location "${location.depot_name}" already exists. Skipping.`);
          continue;
        }
        
        // Insert the location
        const validLocationData = insertDepotLocationSchema.parse({
          depotName: location.depot_name,
          address: location.address,
          city: location.city,
          state: location.state,
          postalCode: location.postal_code,
          country: location.country,
          latitude: location.latitude,
          longitude: location.longitude
        });
        
        await db.insert(depotLocations).values(validLocationData);
        console.log(`Added depot location: ${location.depot_name}`);
      } catch (error) {
        console.error(`Error importing depot location ${location.depot_name}:`, error);
      }
    }
    
    console.log('Depot locations import completed.');
  } catch (error) {
    console.error('Error importing depot locations:', error);
    throw error;
  }
}

/**
 * Import container data from CSV
 */
export async function importContainerData(csvFilePath: string): Promise<void> {
  try {
    console.log('Importing container data from CSV...');
    const containerData = getAllContainerData(csvFilePath);
    
    if (containerData.length === 0) {
      console.log('No container data found in CSV file.');
      return;
    }
    
    console.log(`Found ${containerData.length} containers.`);
    
    // Get all depot locations from the database to map by name
    const depotLocationRecords = await db.select().from(depotLocations);
    const depotsByName = new Map<string, number>();
    
    // Create a map of depot names to IDs
    for (const depot of depotLocationRecords) {
      depotsByName.set(depot.depotName, depot.id);
    }
    
    // Insert each container into the database
    for (const container of containerData) {
      try {
        // Look up the depot ID by name
        const depotId = depotsByName.get(container.depot_name);
        
        if (!depotId) {
          console.log(`Depot "${container.depot_name}" not found. Skipping container.`);
          continue;
        }
        
        // Prepare container data for insertion
        const validContainerData = insertContainerSchema.parse({
          name: `${container.container_type} - ${container.container_condition}`,
          description: `${container.container_type} container in ${container.container_condition} condition, located at ${container.depot_name}.`,
          type: container.container_type,
          condition: container.container_condition,
          price: container.price.toString(),
          region: container.state,
          city: container.city,
          postalCode: container.postal_code,
          location: `${container.address}, ${container.city}, ${container.state}, ${container.postal_code}, ${container.country}`,
          depotId,
          image: "/assets/container-placeholder.jpg", // Default image
          shipping: true,
          availableImmediately: true,
          leaseAvailable: container.container_condition === "New" // Only new containers available for lease
        });
        
        await db.insert(containers).values(validContainerData);
        console.log(`Added container: ${validContainerData.name} at ${container.depot_name}`);
      } catch (error) {
        console.error(`Error importing container for ${container.depot_name}:`, error);
      }
    }
    
    console.log('Container data import completed.');
  } catch (error) {
    console.error('Error importing container data:', error);
    throw error;
  }
}

/**
 * Extract and return unique container types and conditions from CSV
 */
export async function extractContainerTypesAndConditions(csvFilePath: string): Promise<{
  types: string[];
  conditions: string[];
}> {
  const { types, conditions } = parseContainerTypesAndConditions(csvFilePath);
  return { types, conditions };
}

/**
 * Run the full import process
 */
export async function runCsvImport(): Promise<void> {
  try {
    console.log('Starting CSV import process...');
    const csvFilePath = path.resolve('data/pieceofshitfile.csv');
    
    // Import depot locations first
    await importDepotLocations(csvFilePath);
    
    // Then import container data (which needs depot locations to be imported first)
    await importContainerData(csvFilePath);
    
    console.log('CSV import process completed successfully.');
  } catch (error) {
    console.error('Error during CSV import process:', error);
    throw error;
  }
}