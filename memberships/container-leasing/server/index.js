require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const { execSync } = require('child_process');

// Initialize express
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// PayPal API setup
const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

// Validate PayPal credentials
if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
  console.error("PayPal credentials missing. Please set PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET");
}

// Simple PayPal routes for demonstration
app.get('/paypal/setup', (req, res) => {
  res.json({
    clientToken: 'DEMO_TOKEN_FOR_TESTING',
    clientId: PAYPAL_CLIENT_ID
  });
});

app.post('/paypal/order', (req, res) => {
  const { amount, currency, intent } = req.body;
  
  if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
    return res.status(400).json({
      error: "Invalid amount. Must be a positive number."
    });
  }
  
  // This is a mock implementation for demonstration
  res.json({
    id: 'ORDER_ID_' + Date.now(),
    status: 'CREATED',
    links: [
      {
        href: '/paypal/order/capture',
        rel: 'capture',
        method: 'POST'
      }
    ]
  });
});

app.post('/paypal/order/:orderId/capture', (req, res) => {
  const { orderId } = req.params;
  
  // This is a mock implementation for demonstration
  res.json({
    id: orderId,
    status: 'COMPLETED',
    payer: {
      email_address: 'customer@example.com',
      payer_id: 'PAYER123'
    },
    purchase_units: [
      {
        payments: {
          captures: [
            {
              id: 'CAPTURE_' + Date.now(),
              status: 'COMPLETED',
              amount: {
                value: '100.00',
                currency_code: 'USD'
              }
            }
          ]
        }
      }
    ]
  });
});

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '..', 'public')));

// Route for the demo page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

// Support direct access to HTML files
app.get('/:page.html', (req, res) => {
  const page = req.params.page;
  res.sendFile(path.join(__dirname, '..', 'public', `${page}.html`));
});

// API endpoint to check if leasing membership is active
app.get('/api/check-leasing-membership', (req, res) => {
  // For demonstration purposes, we'll set this to false by default
  // In a real implementation, this would check against user accounts in a database
  const hasPaidMembership = false;
  
  res.json({
    hasPaidMembership: hasPaidMembership,
    message: hasPaidMembership ? 
      "You have access to the Leasing Manager Platform." : 
      "Please upgrade your membership to access the Leasing Manager Platform."
  });
});

// Database API routes

// Database API placeholders
// These will be implemented when the database is properly connected
// For now, using simple in-memory data storage for demonstration

// In-memory data store for demonstration
const memoryStore = {
  // Store for wholesale container data from CSV
  wholesaleContainers: [],
  users: [
    {
      id: 1,
      username: 'admin',
      email: 'admin@container-wholesale.com',
      passwordHash: 'admin123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      username: 'customer',
      email: 'customer@example.com',
      passwordHash: 'customer123',
      firstName: 'Sample',
      lastName: 'Customer',
      role: 'customer',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  organizations: [
    {
      id: 1,
      name: 'Container Wholesale, Inc.',
      email: 'info@container-wholesale.com',
      phone: '+1 (555) 123-4567',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  containers: [
    {
      id: 1,
      name: '40ft Dry Container',
      containerType: 'dry',
      containerSize: '40ft',
      containerStatus: 'available',
      origin: 'Shanghai, China',
      destination: 'Los Angeles, USA',
      price: 2500,
      freeDays: 10,
      perDiemRate: 50,
      ownerId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 2,
      name: '20ft Refrigerated Container',
      containerType: 'refrigerated',
      containerSize: '20ft',
      containerStatus: 'available',
      origin: 'Rotterdam, Netherlands',
      destination: 'New York, USA',
      price: 3200,
      freeDays: 7,
      perDiemRate: 75,
      ownerId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 3,
      name: '40ft Open Top Container',
      containerType: 'open-top',
      containerSize: '40ft',
      containerStatus: 'leased',
      origin: 'Singapore',
      destination: 'Sydney, Australia',
      price: 2800,
      freeDays: 5,
      perDiemRate: 60,
      ownerId: 1,
      currentLessee: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 4,
      name: '45ft Dry Container',
      containerType: 'dry',
      containerSize: '45ft',
      containerStatus: 'maintenance',
      origin: 'Hamburg, Germany',
      destination: 'Istanbul, Turkey',
      price: 2700,
      freeDays: 7,
      perDiemRate: 55,
      ownerId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: 5,
      name: '20ft Tank Container',
      containerType: 'tank',
      containerSize: '20ft',
      containerStatus: 'available',
      origin: 'Dubai, UAE',
      destination: 'Mumbai, India',
      price: 3500,
      freeDays: 3,
      perDiemRate: 90,
      ownerId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ],
  contracts: [],
  emails: [
    {
      id: 1,
      userId: 2,
      subject: 'Welcome to Container Wholesale Platform',
      content: 'Thank you for joining our Container Wholesale Platform. We\'re excited to help you manage your shipping containers efficiently.',
      sender: 'admin@container-wholesale.com',
      recipient: 'customer@example.com',
      folder: 'inbox',
      isRead: false,
      sentDate: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]
};

// Users
app.get('/api/users/:id', (req, res) => {
  const user = memoryStore.users.find(user => user.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  // Don't send password hash
  const { passwordHash, ...userData } = user;
  res.json(userData);
});

app.post('/api/users', (req, res) => {
  const newUser = {
    id: memoryStore.users.length + 1,
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  memoryStore.users.push(newUser);
  // Don't send password hash
  const { passwordHash, ...userData } = newUser;
  res.status(201).json(userData);
});

// Organizations
app.get('/api/organizations/:id', (req, res) => {
  const organization = memoryStore.organizations.find(org => org.id === parseInt(req.params.id));
  if (!organization) {
    return res.status(404).json({ error: 'Organization not found' });
  }
  res.json(organization);
});

app.post('/api/organizations', (req, res) => {
  const newOrganization = {
    id: memoryStore.organizations.length + 1,
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  memoryStore.organizations.push(newOrganization);
  res.status(201).json(newOrganization);
});

// Containers
app.get('/api/containers', (req, res) => {
  // Simple filtering by query parameters
  let containers = [...memoryStore.containers];
  const filters = req.query;
  
  // Filter by container type
  if (filters.containerType) {
    containers = containers.filter(c => c.containerType === filters.containerType);
  }
  
  // Filter by container size
  if (filters.containerSize) {
    containers = containers.filter(c => c.containerSize === filters.containerSize);
  }
  
  // Filter by container status
  if (filters.containerStatus) {
    containers = containers.filter(c => c.containerStatus === filters.containerStatus);
  }
  
  // Filter by owner ID
  if (filters.ownerId) {
    containers = containers.filter(c => c.ownerId === parseInt(filters.ownerId));
  }
  
  // Filter by origin (case-insensitive partial match)
  if (filters.origin) {
    const originLower = filters.origin.toLowerCase();
    containers = containers.filter(c => 
      c.origin && c.origin.toLowerCase().includes(originLower)
    );
  }
  
  // Filter by destination (case-insensitive partial match)
  if (filters.destination) {
    const destinationLower = filters.destination.toLowerCase();
    containers = containers.filter(c => 
      c.destination && c.destination.toLowerCase().includes(destinationLower)
    );
  }
  
  res.json(containers);
});

app.get('/api/containers/:id', (req, res) => {
  const container = memoryStore.containers.find(container => container.id === parseInt(req.params.id));
  if (!container) {
    return res.status(404).json({ error: 'Container not found' });
  }
  res.json(container);
});

app.post('/api/containers', (req, res) => {
  const newContainer = {
    id: memoryStore.containers.length + 1,
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  memoryStore.containers.push(newContainer);
  res.status(201).json(newContainer);
});

app.put('/api/containers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const containerIndex = memoryStore.containers.findIndex(c => c.id === id);
  
  if (containerIndex === -1) {
    return res.status(404).json({ error: 'Container not found' });
  }
  
  const updatedContainer = {
    ...memoryStore.containers[containerIndex],
    ...req.body,
    id,
    updatedAt: new Date()
  };
  
  memoryStore.containers[containerIndex] = updatedContainer;
  res.json(updatedContainer);
});

// Contracts
app.get('/api/contracts/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId);
  const contracts = memoryStore.contracts.filter(contract => contract.userId === userId);
  res.json(contracts);
});

app.post('/api/contracts', (req, res) => {
  const newContract = {
    id: memoryStore.contracts.length + 1,
    ...req.body,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  memoryStore.contracts.push(newContract);
  res.status(201).json(newContract);
});

// Emails
app.get('/api/emails/user/:userId/:folder', (req, res) => {
  const userId = parseInt(req.params.userId);
  const folder = req.params.folder;
  
  const emails = memoryStore.emails.filter(email => 
    (email.userId === userId || email.recipientId === userId) && email.folder === folder
  );
  
  res.json(emails);
});

app.post('/api/emails', (req, res) => {
  const newEmail = {
    id: memoryStore.emails.length + 1,
    ...req.body,
    sentDate: new Date(),
    createdAt: new Date(),
    updatedAt: new Date()
  };
  memoryStore.emails.push(newEmail);
  res.status(201).json(newEmail);
});

// API to get unique countries from CSV for the search dropdown
app.get('/api/origins', (req, res) => {
  // Get countries from wholesale containers data
  const countries = [];
  
  // If we have wholesale container data, use it
  if (memoryStore.wholesaleContainers.length > 0) {
    // Log the first few entries to debug structure
    console.log('First wholesale container entry:', JSON.stringify(memoryStore.wholesaleContainers[0]));
    
    memoryStore.wholesaleContainers.forEach(container => {
      // Get property names for this container
      const propNames = Object.keys(container);
      
      // Use the first property (should be COUNTRY)
      if (propNames.length > 0 && propNames[0]) {
        const countryValue = container[propNames[0]];
        if (countryValue) {
          countries.push(countryValue);
        }
      }
    });
    
    // Return unique, sorted countries
    const uniqueCountries = [...new Set(countries)];
    console.log('Returning countries from wholesale containers:', uniqueCountries.length);
    res.json(uniqueCountries.sort());
  } else {
    // Fallback to predefined origins if CSV data is not available
    const predefinedOrigins = [
      ...new Set(memoryStore.containers.map(container => container.origin).filter(Boolean))
    ];
    
    console.log('Returning predefined origins from memory store:', predefinedOrigins);
    res.json(predefinedOrigins.sort());
  }
});

// API to get unique cities from CSV for the search dropdown
app.get('/api/destinations', (req, res) => {
  // Get cities from wholesale containers data
  const cities = [];
  
  // If we have wholesale container data, use it
  if (memoryStore.wholesaleContainers.length > 0) {
    memoryStore.wholesaleContainers.forEach(container => {
      // Get property names for this container
      const propNames = Object.keys(container);
      
      // Use the second property (should be CITY)
      if (propNames.length > 1 && propNames[1]) {
        const cityValue = container[propNames[1]];
        if (cityValue) {
          cities.push(cityValue);
        }
      }
    });
    
    // Return unique, sorted cities
    const uniqueCities = [...new Set(cities)];
    console.log('Returning cities from wholesale containers:', uniqueCities.length);
    res.json(uniqueCities.sort());
  } else {
    // Fallback to predefined destinations if CSV data is not available
    const predefinedDestinations = [
      ...new Set(memoryStore.containers.map(container => container.destination).filter(Boolean))
    ];
    
    console.log('Returning predefined destinations from memory store:', predefinedDestinations);
    res.json(predefinedDestinations.sort());
  }
});

// CSV Wholesale Rates API
app.get('/api/wholesale-rates', (req, res) => {
  // Use country and city for searching instead of origin and destination
  const country = req.query.origin ? req.query.origin.toLowerCase() : '';
  const city = req.query.destination ? req.query.destination.toLowerCase() : '';
  
  try {
    let ratesToReturn = [];
    
    // If we have wholesale container data, use it
    if (memoryStore.wholesaleContainers.length > 0) {
      // Filter containers by country and/or city
      const matchingContainers = memoryStore.wholesaleContainers.filter(container => {
        // Get property names for this container
        const propNames = Object.keys(container);
        
        // Skip containers with invalid structure
        if (propNames.length < 2) return false;
        
        // Use the first property (should be COUNTRY)
        const countryValue = container[propNames[0]];
        // Use the second property (should be CITY)
        const cityValue = container[propNames[1]];
        // Use the third property (should be Size and Type)
        const sizeTypeValue = propNames.length > 2 ? container[propNames[2]] : '';
        // Use the fourth property (should be Price)
        const priceValue = propNames.length > 3 ? container[propNames[3]] : '';
        
        // Skip entries without country or city
        if (!countryValue || !cityValue) return false;
        
        const containerCountry = countryValue.toLowerCase();
        const containerCity = cityValue.toLowerCase();
        
        // Match by country and/or city
        const countryMatch = !country || containerCountry === country;
        const cityMatch = !city || containerCity === city;
        
        return countryMatch && cityMatch;
      });
      
      // Format containers for display
      ratesToReturn = matchingContainers.map(container => {
        // Get property names for this container
        const propNames = Object.keys(container);
        
        // Use the property positions based on the CSV structure
        const countryValue = propNames.length > 0 ? container[propNames[0]] : '';
        const cityValue = propNames.length > 1 ? container[propNames[1]] : '';
        const sizeTypeValue = propNames.length > 2 ? container[propNames[2]] : '';
        const priceValue = propNames.length > 3 ? container[propNames[3]] : '';
        
        return {
          'Country': countryValue,
          'City': cityValue,
          'Container Type': sizeTypeValue || '',
          'Price': priceValue || ''
        };
      });
      
      console.log(`Found ${ratesToReturn.length} wholesale rates matching country: "${country}", city: "${city}"`);
    } else {
      // Fallback to using container data if no wholesale data is available
      const generatedRates = memoryStore.containers.map(container => {
        return {
          'ORIGIN': container.origin || '',
          'DESTINATION': container.destination || '',
          'Container Size': container.containerSize || '',
          'Price': `$${container.price || 0}`,
          'Free Days': container.freeDays?.toString() || '0',
          'Per Diem': `$${container.perDiemRate?.toFixed(2) || '0.00'}`
        };
      });
      
      // Filter rates by origin and/or destination
      ratesToReturn = generatedRates.filter(rate => {
        const rateOrigin = (rate['ORIGIN'] || '').toLowerCase();
        const rateDestination = (rate['DESTINATION'] || '').toLowerCase();
        
        const originMatch = !country || rateOrigin.includes(country);
        const destinationMatch = !city || rateDestination.includes(city);
        
        return originMatch && destinationMatch;
      });
      
      console.log(`Fallback: Found ${ratesToReturn.length} rates matching origin: "${country}", destination: "${city}"`);
    }
    
    // If both country and city are empty, return limited results to avoid overwhelming
    if (!country && !city && ratesToReturn.length > 100) {
      console.log(`Limiting results to 100 (out of ${ratesToReturn.length} total)`);
      return res.json(ratesToReturn.slice(0, 100));
    }
    
    res.json(ratesToReturn);
  } catch (error) {
    console.error('Error generating wholesale rates:', error);
    res.status(500).json({ error: 'Failed to generate wholesale rates' });
  }
});

// Add search-csv endpoint
app.post('/search-csv', (req, res) => {
  try {
    // Rename parameters for clarity but maintain compatibility
    const { origin: country, destination: city } = req.body;
    
    // Convert search parameters to lowercase for case-insensitive matching
    const lowerCountry = country ? country.toLowerCase() : '';
    const lowerCity = city ? city.toLowerCase() : '';
    
    let results = [];
    
    // If we have wholesale container data, use it
    if (memoryStore.wholesaleContainers.length > 0) {
      // Filter containers by country and/or city
      const matchingContainers = memoryStore.wholesaleContainers.filter(container => {
        // Get property names for this container
        const propNames = Object.keys(container);
        
        // Skip containers with invalid structure
        if (propNames.length < 2) return false;
        
        // Use the first property (should be COUNTRY)
        const countryValue = container[propNames[0]];
        // Use the second property (should be CITY)
        const cityValue = container[propNames[1]];
        
        // Skip entries without country or city
        if (!countryValue || !cityValue) return false;
        
        const containerCountry = countryValue.toLowerCase();
        const containerCity = cityValue.toLowerCase();
        
        // Match by country and/or city
        const countryMatch = !lowerCountry || containerCountry === lowerCountry;
        const cityMatch = !lowerCity || containerCity === lowerCity;
        
        return countryMatch && cityMatch;
      });
      
      // Format containers for display
      results = matchingContainers.map(container => {
        // Get property names for this container
        const propNames = Object.keys(container);
        
        // Use the property positions based on the CSV structure
        const countryValue = propNames.length > 0 ? container[propNames[0]] : '';
        const cityValue = propNames.length > 1 ? container[propNames[1]] : '';
        const sizeTypeValue = propNames.length > 2 ? container[propNames[2]] : '';
        const priceValue = propNames.length > 3 ? container[propNames[3]] : '';
        
        return {
          'Country': countryValue,
          'City': cityValue,
          'Container Type': sizeTypeValue || '',
          'Price': priceValue || ''
        };
      });
      
      console.log(`Found ${results.length} wholesale rates for search with country: "${lowerCountry}", city: "${lowerCity}"`);
    } else {
      // Fallback to using container data if no wholesale data is available
      const generatedRates = memoryStore.containers.map(container => {
        return {
          'ORIGIN': container.origin || '',
          'DESTINATION': container.destination || '',
          'Container Size': container.containerSize || '',
          'Price': `$${container.price || 0}`,
          'Free Days': container.freeDays?.toString() || '0',
          'Per Diem': `$${container.perDiemRate?.toFixed(2) || '0.00'}`
        };
      });
      
      // Filter rates by origin and/or destination
      results = generatedRates.filter(rate => {
        const rowOrigin = (rate['ORIGIN'] || '').toLowerCase();
        const rowDestination = (rate['DESTINATION'] || '').toLowerCase();
        
        const originMatch = !lowerCountry || rowOrigin.includes(lowerCountry);
        const destinationMatch = !lowerCity || rowDestination.includes(lowerCity);
        
        return originMatch && destinationMatch;
      });
      
      console.log(`Fallback: Found ${results.length} results for search-csv with country: "${lowerCountry}", city: "${lowerCity}"`);
    }
    
    res.json(results);
  } catch (error) {
    console.error('Error searching wholesale rates:', error);
    res.status(500).json({ error: 'Failed to search wholesale rates' });
  }
});

// Debug endpoint to count rows for a specific origin
app.get('/api/debug/count-origin/:origin', (req, res) => {
  const targetOrigin = req.params.origin.toLowerCase();
  
  try {
    // Filter containers by the target origin
    const matches = memoryStore.containers.filter(container => {
      const origin = (container.origin || '').toLowerCase();
      return origin === targetOrigin;
    });
    
    // Format the matches for response
    const formattedMatches = matches.map(container => ({
      'ORIGIN': container.origin || '',
      'DESTINATION': container.destination || '',
      'Container Size': container.containerSize || '',
      'Price': `$${container.price || 0}`,
      'Free Days': container.freeDays?.toString() || '0',
      'Per Diem': `$${container.perDiemRate?.toFixed(2) || '0.00'}`
    }));
    
    // Return the count and matches
    console.log(`Found ${matches.length} containers with origin: ${targetOrigin}`);
    res.json({
      count: matches.length,
      matches: formattedMatches
    });
  } catch (error) {
    console.error('Error counting origins:', error);
    res.status(500).json({ error: 'Failed to count origins', details: error.message });
  }
});

// Subdirectory routing for WordPress integration
// Route for /leasing - Leasing Manager Platform
app.get('/leasing', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});

app.get('/leasing/:path(*)', (req, res) => {
  const filePath = req.params.path;
  const fullPath = path.join(__dirname, '..', 'public', filePath);
  
  // Check if file exists, otherwise serve index.html for SPA routing
  if (fs.existsSync(fullPath)) {
    res.sendFile(fullPath);
  } else {
    res.sendFile(path.join(__dirname, '..', 'public', 'index.html'));
  }
});

// Route for /wholesale - Wholesale Manager Platform  
app.get('/wholesale', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'container-wholesale', 'public', 'index.html'));
});

app.get('/wholesale/*', (req, res) => {
  const filePath = req.url.replace('/wholesale/', '');
  const fullPath = path.join(__dirname, '..', '..', 'container-wholesale', 'public', filePath);
  
  // Check if file exists, otherwise serve index.html for SPA routing
  if (fs.existsSync(fullPath)) {
    res.sendFile(fullPath);
  } else {
    res.sendFile(path.join(__dirname, '..', '..', 'container-wholesale', 'public', 'index.html'));
  }
});

// We'll implement scheduler later
console.log('Per diem scheduler will be implemented in the next phase');

// Function to load wholesale containers from CSV
function loadWholesaleContainersFromCSV() {
  const csvPath = path.join(__dirname, '..', 'data', 'Wholesale Containers.csv');
  
  console.log('Loading wholesale containers from CSV file:', csvPath);
  
  if (!fs.existsSync(csvPath)) {
    console.error('Wholesale Containers CSV file not found at path:', csvPath);
    return;
  }
  
  // Clear the wholesale containers array before reloading
  memoryStore.wholesaleContainers = [];
  
  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (data) => {
      // Log the first row headers to see column names
      if (memoryStore.wholesaleContainers.length === 0) {
        console.log('CSV columns:', Object.keys(data));
      }
      
      // Add the CSV row data to the wholesaleContainers array
      memoryStore.wholesaleContainers.push(data);
    })
    .on('end', () => {
      console.log(`Loaded ${memoryStore.wholesaleContainers.length} wholesale container entries from CSV`);
      
      // Debug log the first few entries to check the structure
      if (memoryStore.wholesaleContainers.length > 0) {
        console.log('Sample data (first entry):', JSON.stringify(memoryStore.wholesaleContainers[0]));
        
        // Count unique countries and cities for debugging
        const countries = new Set();
        const cities = new Set();
        
        // Debug property names in the container object
        console.log('Object.keys for first container:', Object.keys(memoryStore.wholesaleContainers[0]));
        
        // Try direct JSON property access
        const firstObj = JSON.parse(JSON.stringify(memoryStore.wholesaleContainers[0]));
        console.log('Converted to JSON and back:', firstObj);
        console.log('COUNTRY property from JSON object:', firstObj.COUNTRY);
        
        // Use Object.keys to directly access the property
        const keys = Object.keys(memoryStore.wholesaleContainers[0]);
        console.log('First property name:', keys[0]);
        console.log('First property value:', memoryStore.wholesaleContainers[0][keys[0]]);
        
        memoryStore.wholesaleContainers.forEach((container) => {
          // Get property names for this container
          const propNames = Object.keys(container);
          
          // Use the first property (should be COUNTRY)
          if (propNames.length > 0 && propNames[0]) {
            const countryValue = container[propNames[0]];
            if (countryValue) countries.add(countryValue);
          }
          
          // Use the second property (should be CITY)
          if (propNames.length > 1 && propNames[1]) {
            const cityValue = container[propNames[1]];
            if (cityValue) cities.add(cityValue);
          }
        });
        
        console.log(`Found ${countries.size} unique countries and ${cities.size} unique cities in CSV data`);
      }
    })
    .on('error', (err) => {
      console.error('Error loading wholesale containers CSV:', err);
    });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Container Wholesale Platform server running on port ${PORT}`);
  
  // Load wholesale containers data on server start
  loadWholesaleContainersFromCSV();
});