import { db } from "../db";
import { containers, depotLocations } from "@shared/schema";
import { eq } from "drizzle-orm";
import * as fs from 'fs';
import * as path from 'path';
import csvParser from 'csv-parser';

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

export async function importSampleData() {
  try {
    console.log('Starting sample data import...');
    
    const csvFilePath = path.join(__dirname, '../../data/sample-import.csv');
    
    if (!fs.existsSync(csvFilePath)) {
      console.error('CSV file not found at:', csvFilePath);
      return;
    }

    const rows: CSVRow[] = [];
    
    // Read and parse CSV file
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csvParser())
        .on('data', (row: CSVRow) => {
          rows.push(row);
        })
        .on('end', () => {
          console.log(`Parsed ${rows.length} rows from CSV`);
          resolve();
        })
        .on('error', reject);
    });

    // Group data by depot
    const depotMap = new Map<string, {
      depot: Omit<CSVRow, 'container_type' | 'container_condition' | 'quantity' | 'price' | 'sku'>;
      containers: CSVRow[];
    }>();

    rows.forEach(row => {
      const depotKey = row.depot_name;
      if (!depotMap.has(depotKey)) {
        depotMap.set(depotKey, {
          depot: {
            depot_name: row.depot_name,
            latitude: row.latitude,
            longitude: row.longitude,
            address: row.address,
            city: row.city,
            state: row.state,
            postal_code: row.postal_code,
            country: row.country
          },
          containers: []
        });
      }
      depotMap.get(depotKey)!.containers.push(row);
    });

    console.log(`Found ${depotMap.size} unique depots`);

    // Import depot locations first
    const depotIds = new Map<string, number>();
    
    for (const depotEntry of Array.from(depotMap.entries())) {
      const [depotName, data] = depotEntry;
      console.log(`Importing depot: ${depotName}`);
      
      // Check if depot already exists
      const existingDepot = await db
        .select()
        .from(depotLocations)
        .where(eq(depotLocations.depotName, depotName))
        .limit(1);

      let depotId: number;
      
      if (existingDepot.length > 0) {
        depotId = existingDepot[0].id;
        console.log(`Depot ${depotName} already exists with ID: ${depotId}`);
      } else {
        const [newDepot] = await db
          .insert(depotLocations)
          .values({
            depotName: data.depot.depot_name,
            latitude: parseFloat(data.depot.latitude),
            longitude: parseFloat(data.depot.longitude),
            address: data.depot.address,
            city: data.depot.city,
            state: data.depot.state,
            postalCode: data.depot.postal_code,
            country: data.depot.country
          })
          .returning();
        
        depotId = newDepot.id;
        console.log(`Created new depot ${depotName} with ID: ${depotId}`);
      }
      
      depotIds.set(depotName, depotId);
      
      // Import containers for this depot
      console.log(`Importing ${data.containers.length} containers for depot ${depotName}`);
      
      for (const containerRow of data.containers) {
        // Check if container with this SKU already exists
        const existingContainer = await db
          .select()
          .from(containers)
          .where(eq(containers.sku, containerRow.sku))
          .limit(1);

        if (existingContainer.length === 0) {
          await db.insert(containers).values({
            name: containerRow.container_type,
            type: containerRow.container_type,
            condition: containerRow.container_condition,
            description: `${containerRow.container_type} in ${containerRow.container_condition} condition`,
            depotId: depotId,
            location: `${data.depot.city}, ${data.depot.state}`,
            region: data.depot.state,
            city: data.depot.city,
            postalCode: data.depot.postal_code,
            price: containerRow.price,
            image: generateContainerImageUrl(containerRow.container_type),
            sku: containerRow.sku,
            shipping: true,
            availableImmediately: true,
            leaseAvailable: true
          });
        }
      }
    }

    console.log('Sample data import completed successfully!');
    console.log(`Imported ${depotMap.size} depots and ${rows.length} containers`);
    
  } catch (error) {
    console.error('Error importing sample data:', error);
    throw error;
  }
}

function generateContainerImageUrl(containerType: string): string {
  // Generate appropriate image URLs based on container type
  const type = containerType.toLowerCase();
  
  if (type.includes('20') && type.includes('dc')) {
    return 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=400&h=300&fit=crop';
  } else if (type.includes('40') && type.includes('hc')) {
    return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop';
  } else if (type.includes('refrigerated') || type.includes('rf')) {
    return 'https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=400&h=300&fit=crop';
  } else if (type.includes('open top') || type.includes('ot')) {
    return 'https://images.unsplash.com/photo-1605902711834-8b11c3e3ef2d?w=400&h=300&fit=crop';
  } else {
    return 'https://images.unsplash.com/photo-1494412651409-8963ce7935a7?w=400&h=300&fit=crop';
  }
}

// Auto-run the import if this file is executed directly
if (require.main === module) {
  importSampleData()
    .then(() => {
      console.log('Import completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Import failed:', error);
      process.exit(1);
    });
}