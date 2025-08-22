import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';

interface PricingItem {
  item_code: string;
  description: string;
  base_price: number;
  option_price: number;
  category: string;
}

// Read and parse the CSV file
export function getPricingData(): PricingItem[] {
  const csvFilePath = path.join(__dirname, '../data/container_pricing.csv');
  const fileContent = fs.readFileSync(csvFilePath, 'utf8');
  
  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    cast: (value, context) => {
      if (context.column === 'base_price' || context.column === 'option_price') {
        return parseFloat(value);
      }
      return value;
    }
  });
  
  return records as PricingItem[];
}

// Get price for a specific item
export function getItemPrice(itemCode: string): PricingItem | undefined {
  const items = getPricingData();
  return items.find(item => item.item_code === itemCode);
}

// Calculate order total based on selected options
export function calculateOrderTotal(options: {
  containerSize: string;
  containerFeature: string;
  lockingBox: string;
  forkLiftPocket: string;
  easyOpenDoor: string;
  ventOpen: string;
  logo: string;
  quantity: number;
}): { 
  lineItems: Array<{ description: string; price: number }>;
  subtotal: number;
  total: number;
} {
  const items = getPricingData();
  const lineItems: Array<{ description: string; price: number }> = [];
  
  // Add base container price
  const baseContainer = items.find(item => item.item_code === 'BASE-CONTAINER');
  if (baseContainer) {
    lineItems.push({
      description: baseContainer.description,
      price: baseContainer.base_price
    });
  }
  
  // Add container size price if not standard
  if (options.containerSize !== '20GP') {
    const sizeItem = items.find(item => item.item_code === `SIZE-${options.containerSize}`);
    if (sizeItem) {
      lineItems.push({
        description: sizeItem.description,
        price: sizeItem.option_price
      });
    }
  }
  
  // Add container feature price if selected
  if (options.containerFeature !== 'standard') {
    const featureCode = options.containerFeature.toUpperCase().replace(/-/g, '-');
    const featureItem = items.find(item => item.item_code === featureCode);
    if (featureItem) {
      lineItems.push({
        description: featureItem.description,
        price: featureItem.option_price
      });
    }
  }
  
  // Add other optional features
  if (options.lockingBox === 'yes') {
    const item = items.find(item => item.item_code === 'LOCKING-BOX');
    if (item) {
      lineItems.push({
        description: item.description,
        price: item.option_price
      });
    }
  }
  
  if (options.forkLiftPocket === 'yes') {
    const item = items.find(item => item.item_code === 'FORKLIFT-POCKET');
    if (item) {
      lineItems.push({
        description: item.description,
        price: item.option_price
      });
    }
  }
  
  if (options.easyOpenDoor === 'yes') {
    const item = items.find(item => item.item_code === 'EASY-OPEN-DOOR');
    if (item) {
      lineItems.push({
        description: item.description,
        price: item.option_price
      });
    }
  }
  
  if (options.ventOpen !== '0') {
    const item = items.find(item => item.item_code === `VENTS-${options.ventOpen}`);
    if (item) {
      lineItems.push({
        description: item.description,
        price: item.option_price
      });
    }
  }
  
  if (options.logo === 'yes') {
    const item = items.find(item => item.item_code === 'LOGO-CUSTOM');
    if (item) {
      lineItems.push({
        description: item.description,
        price: item.option_price
      });
    }
  }
  
  // Calculate subtotal
  const subtotal = lineItems.reduce((sum, item) => sum + item.price, 0);
  
  // Apply quantity
  const total = subtotal * options.quantity;
  
  return {
    lineItems,
    subtotal,
    total
  };
}