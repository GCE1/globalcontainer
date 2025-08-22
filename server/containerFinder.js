import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// CSV-based container finder for "Find Your Perfect Container" feature
class ContainerFinder {
  constructor() {
    this.containers = [];
    this.loaded = false;
  }

  // Load containers from CSV using csv-parser
  async loadContainersFromCSV(csvPath) {
    return new Promise((resolve, reject) => {
      const containers = [];
      
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (row) => {
          // Parse container data from CSV
          const container = {
            sku: row.sku || row.SKU,
            type: row.type || row.container_type,
            condition: row.condition || row.container_condition,
            price: parseFloat(row.price) || 0,
            depot_name: row.depot_name,
            latitude: parseFloat(row.latitude),
            longitude: parseFloat(row.longitude),
            city: row.city,
            state: row.state,
            postal_code: row.postal_code,
            address: row.address,
            quantity: parseInt(row.quantity) || 1
          };
          
          if (container.sku && container.type) {
            containers.push(container);
          }
        })
        .on('end', () => {
          this.containers = containers;
          this.loaded = true;
          console.log(`Loaded ${containers.length} containers from CSV using csv-parser`);
          resolve(containers);
        })
        .on('error', (error) => {
          console.error('Error reading CSV with csv-parser:', error);
          reject(error);
        });
    });
  }

  // Find perfect container matches based on criteria
  findPerfectContainer(criteria) {
    if (!this.loaded) {
      throw new Error('Container data not loaded. Call loadContainersFromCSV first.');
    }

    let matches = [...this.containers];

    // Filter by container type
    if (criteria.type) {
      matches = matches.filter(container => 
        container.type.toLowerCase().includes(criteria.type.toLowerCase())
      );
    }

    // Filter by condition
    if (criteria.condition) {
      matches = matches.filter(container =>
        container.condition.toLowerCase().includes(criteria.condition.toLowerCase())
      );
    }

    // Filter by price range
    if (criteria.maxPrice) {
      matches = matches.filter(container => container.price <= criteria.maxPrice);
    }

    if (criteria.minPrice) {
      matches = matches.filter(container => container.price >= criteria.minPrice);
    }

    // Filter by location (state)
    if (criteria.state) {
      matches = matches.filter(container =>
        container.state.toLowerCase() === criteria.state.toLowerCase()
      );
    }

    // Filter by depot
    if (criteria.depot) {
      matches = matches.filter(container =>
        container.depot_name.toLowerCase().includes(criteria.depot.toLowerCase())
      );
    }

    // Sort by price (ascending by default)
    matches.sort((a, b) => a.price - b.price);

    return matches;
  }

  // Get container recommendations based on user preferences
  getRecommendations(userPreferences) {
    const recommendations = [];

    // Budget-friendly options
    if (userPreferences.budget === 'low') {
      const budgetOptions = this.findPerfectContainer({ maxPrice: 3000 });
      recommendations.push({
        category: 'Budget-Friendly Options',
        containers: budgetOptions.slice(0, 5)
      });
    }

    // Premium options
    if (userPreferences.budget === 'high') {
      const premiumOptions = this.findPerfectContainer({ minPrice: 5000 });
      recommendations.push({
        category: 'Premium Options',
        containers: premiumOptions.slice(0, 5)
      });
    }

    // New condition containers
    if (userPreferences.condition === 'new') {
      const newContainers = this.findPerfectContainer({ condition: 'new' });
      recommendations.push({
        category: 'Brand New Containers',
        containers: newContainers.slice(0, 5)
      });
    }

    // Location-based recommendations
    if (userPreferences.preferredState) {
      const localOptions = this.findPerfectContainer({ 
        state: userPreferences.preferredState 
      });
      recommendations.push({
        category: `Available in ${userPreferences.preferredState}`,
        containers: localOptions.slice(0, 5)
      });
    }

    return recommendations;
  }

  // Get all available container types
  getAvailableTypes() {
    if (!this.loaded) return [];
    
    const types = [...new Set(this.containers.map(c => c.type))];
    return types.sort();
  }

  // Get all available conditions
  getAvailableConditions() {
    if (!this.loaded) return [];
    
    const conditions = [...new Set(this.containers.map(c => c.condition))];
    return conditions.sort();
  }

  // Get depot statistics
  getDepotStats() {
    if (!this.loaded) return {};

    const stats = {};
    this.containers.forEach(container => {
      if (!stats[container.depot_name]) {
        stats[container.depot_name] = {
          count: 0,
          location: `${container.city}, ${container.state}`,
          averagePrice: 0,
          types: new Set()
        };
      }
      
      stats[container.depot_name].count++;
      stats[container.depot_name].types.add(container.type);
    });

    // Calculate average prices
    Object.keys(stats).forEach(depot => {
      const depotContainers = this.containers.filter(c => c.depot_name === depot);
      const avgPrice = depotContainers.reduce((sum, c) => sum + c.price, 0) / depotContainers.length;
      stats[depot].averagePrice = Math.round(avgPrice);
      stats[depot].types = Array.from(stats[depot].types);
    });

    return stats;
  }
}

export default ContainerFinder;