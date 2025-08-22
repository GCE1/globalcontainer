import fs from 'fs';
import { parse } from 'csv-parse/sync';
import path from 'path';

export interface LocationData {
  depot_name: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface ContainerData {
  depot_name: string;
  container_type: string;
  container_condition: string;
  quantity: number;
  price: number;
  sku: string;
  latitude: number;
  longitude: number;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export interface WooCommerceProduct {
  sku: string;
  product_id?: number; // Will be populated after syncing with WooCommerce
  container_type: string;
  container_condition: string;
  price: number;
}

/**
 * Parse CSV file and extract unique depot locations
 */
export function parseLocationsFromCsv(filePath: string): LocationData[] {
  try {
    // Read the CSV file
    const csvContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the CSV content
    const records: any[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    // Create a map to store unique locations by depot_name
    const locationsMap = new Map<string, LocationData>();
    
    // Extract unique locations from records
    for (const record of records) {
      const depotName = record.depot_name;
      
      // Skip if this depot has already been processed
      if (locationsMap.has(depotName)) {
        continue;
      }
      
      // Add this location to the map
      locationsMap.set(depotName, {
        depot_name: depotName,
        latitude: parseFloat(record.latitude),
        longitude: parseFloat(record.longitude),
        address: record.address,
        city: record.city,
        state: record.state,
        postal_code: record.postal_code,
        country: record.country
      });
    }
    
    // Convert map to array and return
    return Array.from(locationsMap.values());
  } catch (error) {
    console.error('Error parsing CSV locations:', error);
    return [];
  }
}

/**
 * Parse CSV file and extract unique container types and conditions
 */
export function parseContainerTypesAndConditions(filePath: string): {
  types: string[];
  conditions: string[];
} {
  try {
    // Read the CSV file
    const csvContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the CSV content
    const records: any[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    // Use Sets to store unique values
    const typesSet = new Set<string>();
    const conditionsSet = new Set<string>();
    
    // Extract unique container types and conditions
    for (const record of records) {
      typesSet.add(record.container_type);
      conditionsSet.add(record.container_condition);
    }
    
    // Convert Sets to arrays and return
    return {
      types: Array.from(typesSet),
      conditions: Array.from(conditionsSet)
    };
  } catch (error) {
    console.error('Error parsing container types and conditions:', error);
    return { types: [], conditions: [] };
  }
}

/**
 * Parse CSV file and extract all container data for WooCommerce integration
 */
export function parseContainersForWooCommerce(filePath: string): WooCommerceProduct[] {
  try {
    // Read the CSV file
    const csvContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the CSV content
    const records: any[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    // Create a map to store unique products by SKU
    const productsMap = new Map<string, WooCommerceProduct>();
    
    // Extract unique products from records
    for (const record of records) {
      const sku = record.sku;
      
      productsMap.set(sku, {
        sku,
        container_type: record.container_type,
        container_condition: record.container_condition,
        price: parseFloat(record.price)
      });
    }
    
    // Convert map to array and return
    return Array.from(productsMap.values());
  } catch (error) {
    console.error('Error parsing WooCommerce products:', error);
    return [];
  }
}

/**
 * Get all container data with location information
 */
export function getAllContainerData(filePath: string): ContainerData[] {
  try {
    // Read the CSV file
    const csvContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse the CSV content
    const records: any[] = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    // Map the records to ContainerData
    return records.map((record: any): ContainerData => ({
      depot_name: record.depot_name,
      container_type: record.container_type,
      container_condition: record.container_condition,
      quantity: parseInt(record.quantity),
      price: parseFloat(record.price),
      sku: record.sku,
      latitude: parseFloat(record.latitude),
      longitude: parseFloat(record.longitude),
      address: record.address,
      city: record.city,
      state: record.state,
      postal_code: record.postal_code,
      country: record.country
    }));
  } catch (error) {
    console.error('Error parsing container data:', error);
    return [];
  }
}