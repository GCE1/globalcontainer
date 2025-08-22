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

// Database API routes

// Database API placeholders
// These will be implemented when the database is properly connected
// For now, using simple in-memory data storage for demonstration

// In-memory data store for demonstration
const memoryStore = {
  users: [
    {
      id: 1,
      username: 'admin',
      email: 'admin@container-leasing.com',
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
      name: 'Container Leasing, Inc.',
      email: 'info@container-leasing.com',
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
      subject: 'Welcome to Container Leasing Platform',
      content: 'Thank you for joining our Container Leasing Platform. We\'re excited to help you manage your shipping containers efficiently.',
      sender: 'admin@container-leasing.com',
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

// API to get unique origins from CSV
app.get('/api/origins', (req, res) => {
  const origins = new Set();
  
  try {
    const csvPath = path.join(__dirname, '..', 'data', 'LeasingManager.csv');
    
    console.log('Reading origins from CSV file:', csvPath);
    
    // Check if the file exists
    if (!fs.existsSync(csvPath)) {
      console.error('CSV file not found at path:', csvPath);
      return res.status(404).json({ error: 'Leasing rates file not found' });
    }
    
    // Read a small portion of the file to check for encoding issues or special characters
    const sample = fs.readFileSync(csvPath, 'utf8', { start: 0, end: 200 });
    console.log('CSV sample (first 200 bytes):', sample);
    console.log('CSV sample (hex):', Buffer.from(sample).toString('hex'));
    
    
    // Process the CSV file
    let rowCount = 0;
    let originColumnFound = false;
    
    // Create an array to store any column header that might contain origin data
    let possibleOriginColumns = [];
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('headers', (headers) => {
        console.log('CSV Headers:', headers);
        
        // Find all headers that might be origin-related
        headers.forEach(header => {
          const normalizedHeader = header.toString().toLowerCase().trim();
          console.log(`Checking header: ${header}, normalized: ${normalizedHeader}`);
          
          if (normalizedHeader.includes('origin') || 
              normalizedHeader === 'from' || 
              normalizedHeader === 'source' || 
              normalizedHeader === 'departure') {
            console.log(`Found possible origin column: ${header}`);
            possibleOriginColumns.push(header);
          }
        });
        
        console.log('Possible origin columns:', possibleOriginColumns);
      })
      .on('data', (data) => {
        // Log sample data for debugging
        if (rowCount < 5) {
          console.log('Sample CSV Row:', data);
          rowCount++;
        }
        
        // Try to find origin values from all possible origin columns
        for (const column of possibleOriginColumns) {
          const originValue = data[column];
          
          if (originValue && originValue.trim() !== '') {
            originColumnFound = true;
            
            // Only log for the first few entries to avoid console clutter
            if (origins.size < 20) {
              console.log(`Found origin value: ${originValue} from column: ${column}`);
            }
            
            origins.add(originValue);
            // Don't break here - we want to collect from all possible origin columns
          }
        }
        
        // Fallback approach: check all columns if we can't find designated origin columns
        if (!originColumnFound && possibleOriginColumns.length === 0) {
          for (const key of Object.keys(data)) {
            const normalizedKey = key.toLowerCase().trim();
            
            if (normalizedKey.includes('origin') || 
                normalizedKey === 'from' || 
                normalizedKey === 'source' || 
                normalizedKey === 'departure') {
              
              const originValue = data[key];
              if (originValue && originValue.trim() !== '') {
                if (origins.size < 20) {
                  console.log(`Fallback: Found origin value: ${originValue} from column: ${key}`);
                }
                origins.add(originValue);
              }
            }
          }
        }
      })
      .on('end', () => {
        console.log(`Total unique origins found: ${origins.size}`);
        const sortedOrigins = Array.from(origins).sort();
        res.json(sortedOrigins);
      });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    res.status(500).json({ error: 'Failed to read origins' });
  }
});

// API to get unique destinations from CSV
app.get('/api/destinations', (req, res) => {
  const destinations = new Set();
  
  try {
    const csvPath = path.join(__dirname, '..', 'data', 'LeasingManager.csv');
    
    // Check if the file exists
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ error: 'Leasing rates file not found' });
    }
    
    // Process the CSV file
    let destinationColumnFound = false;
    
    // Create an array to store any column header that might contain destination data
    let possibleDestinationColumns = [];
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('headers', (headers) => {
        console.log('CSV Headers (destinations):', headers);
        
        // Find all headers that might be destination-related
        headers.forEach(header => {
          const normalizedHeader = header.toString().toLowerCase().trim();
          
          if (normalizedHeader.includes('destination') || 
              normalizedHeader === 'to' || 
              normalizedHeader === 'target' || 
              normalizedHeader === 'arrival') {
            console.log(`Found possible destination column: ${header}`);
            possibleDestinationColumns.push(header);
          }
        });
        
        console.log('Possible destination columns:', possibleDestinationColumns);
      })
      .on('data', (data) => {
        // Try to find destination values from all possible destination columns
        for (const column of possibleDestinationColumns) {
          const destinationValue = data[column];
          
          if (destinationValue && destinationValue.trim() !== '') {
            destinationColumnFound = true;
            
            // Only log for the first few entries to avoid console clutter
            if (destinations.size < 20) {
              console.log(`Found destination value: ${destinationValue} from column: ${column}`);
            }
            
            destinations.add(destinationValue);
            // Don't break here - we want to collect from all possible destination columns
          }
        }
        
        // Fallback approach: check all columns if we can't find designated destination columns
        if (!destinationColumnFound && possibleDestinationColumns.length === 0) {
          for (const key of Object.keys(data)) {
            const normalizedKey = key.toLowerCase().trim();
            
            if (normalizedKey.includes('destination') || 
                normalizedKey === 'to' || 
                normalizedKey === 'target' || 
                normalizedKey === 'arrival') {
              
              const destinationValue = data[key];
              if (destinationValue && destinationValue.trim() !== '') {
                if (destinations.size < 20) {
                  console.log(`Fallback: Found destination value: ${destinationValue} from column: ${key}`);
                }
                destinations.add(destinationValue);
              }
            }
          }
        }
      })
      .on('end', () => {
        console.log(`Total unique destinations found: ${destinations.size}`);
        const sortedDestinations = Array.from(destinations).sort();
        res.json(sortedDestinations);
      });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    res.status(500).json({ error: 'Failed to read destinations' });
  }
});

// CSV Leasing Rates API
app.get('/api/leasing-rates', (req, res) => {
  const results = [];
  const origin = req.query.origin ? req.query.origin.toLowerCase() : '';
  const destination = req.query.destination ? req.query.destination.toLowerCase() : '';
  
  try {
    const csvPath = path.join(__dirname, '..', 'data', 'LeasingManager.csv');
    
    // If both origin and destination are empty, return all rates (with a reasonable limit)
    if (!origin && !destination) {
      // Instead of returning an empty array, load all rates with a limit
      let allResults = [];
      fs.createReadStream(csvPath)
        .pipe(csv())
        .on('data', (data) => {
          allResults.push(data);
        })
        .on('end', () => {
          console.log(`Total rates found: ${allResults.length}`);
          // Limit to first 100 rates to avoid overwhelming the client
          res.json(allResults.slice(0, 100));
        });
      return;
    }
    
    // Debug log for specific origin search
    if (origin && !destination) {
      console.log(`Searching for origin: "${origin}"`);
    }
    
    // Check if the file exists
    if (!fs.existsSync(csvPath)) {
      return res.status(404).json({ error: 'Leasing rates file not found' });
    }
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => {
        // Get origin and destination values, considering different possible key cases
        let rowOriginValue = '';
        let rowDestinationValue = '';
        
        // Get the correct column for Origin
        for (const key of Object.keys(data)) {
          if (key.toLowerCase().trim() === 'origin') {
            rowOriginValue = data[key];
            break;
          }
        }
        
        // Get the correct column for Destination
        for (const key of Object.keys(data)) {
          if (key.toLowerCase().trim() === 'destination') {
            rowDestinationValue = data[key];
            break;
          }
        }
        
        const rowOrigin = rowOriginValue ? rowOriginValue.toLowerCase() : '';
        const rowDestination = rowDestinationValue ? rowDestinationValue.toLowerCase() : '';
        
        // Debugging for origin matches
        if (origin && rowOrigin === origin) {
          console.log(`Found exact match for origin ${origin}: ${rowOriginValue} -> ${rowDestination}`);
        }
        
        // Filter by exact origin and/or destination, case-insensitive, handling null values
        const originMatch = !origin || rowOrigin === origin;
        const destinationMatch = !destination || rowDestination === destination;
        
        if (originMatch && destinationMatch) {
          results.push(data);
        }
      })
      .on('end', () => {
        res.json(results);
      });
  } catch (error) {
    console.error('Error reading CSV file:', error);
    res.status(500).json({ error: 'Failed to read leasing rates' });
  }
});

// Add search-csv endpoint
app.post('/search-csv', (req, res) => {
  try {
    const { origin, destination } = req.body;
    
    // Convert search parameters to lowercase for case-insensitive matching
    const lowerOrigin = origin ? origin.toLowerCase() : '';
    const lowerDestination = destination ? destination.toLowerCase() : '';
    
    const results = [];
    
    // Read and parse the CSV file with the new path
    fs.createReadStream(path.join(__dirname, '..', 'data', 'LeasingManager.csv'))
      .pipe(csv())
      .on('data', (data) => {
        // Get origin and destination values, considering different possible key cases
        let rowOriginValue = '';
        let rowDestinationValue = '';
        
        // Get the correct column for Origin
        for (const key of Object.keys(data)) {
          if (key.toLowerCase().trim() === 'origin') {
            rowOriginValue = data[key];
            break;
          }
        }
        
        // Get the correct column for Destination
        for (const key of Object.keys(data)) {
          if (key.toLowerCase().trim() === 'destination') {
            rowDestinationValue = data[key];
            break;
          }
        }
        
        const rowOrigin = rowOriginValue ? rowOriginValue.toLowerCase() : '';
        const rowDestination = rowDestinationValue ? rowDestinationValue.toLowerCase() : '';
        
        // Debugging for origin matches
        if (lowerOrigin && rowOrigin === lowerOrigin) {
          console.log(`POST search-csv: Found exact match for origin ${lowerOrigin}: ${rowOriginValue} -> ${rowDestination}`);
        }
        
        // Filter by exact origin and/or destination, case-insensitive, handling null values
        const originMatch = !lowerOrigin || rowOrigin === lowerOrigin;
        const destinationMatch = !lowerDestination || rowDestination === lowerDestination;
        
        if (originMatch && destinationMatch) {
          results.push(data);
        }
      })
      .on('end', () => {
        res.json(results);
      });
  } catch (error) {
    console.error('Error searching CSV:', error);
    res.status(500).json({ error: 'Failed to search leasing rates' });
  }
});

// Debug endpoint to count rows for a specific origin
app.get('/api/debug/count-origin/:origin', (req, res) => {
  const targetOrigin = req.params.origin.toLowerCase();
  let count = 0;
  let matches = [];
  
  try {
    const csvPath = path.join(__dirname, '..', 'data', 'LeasingManager.csv');
    
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => {
        // Get the correct column for Origin
        let rowOriginValue = '';
        
        for (const key of Object.keys(data)) {
          if (key.toLowerCase().trim() === 'origin') {
            rowOriginValue = data[key];
            break;
          }
        }
        
        if (rowOriginValue && rowOriginValue.toLowerCase() === targetOrigin) {
          count++;
          matches.push(data);
        }
      })
      .on('end', () => {
        res.json({
          count,
          matches
        });
      });
  } catch (error) {
    console.error('Error counting origins:', error);
    res.status(500).json({ error: 'Failed to count origins', details: error.message });
  }
});

// We'll implement scheduler later
console.log('Per diem scheduler will be implemented in the next phase');

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Container Leasing Platform server running on port ${PORT}`);
});