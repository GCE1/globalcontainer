const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Initializing database...');

// Make sure the drizzle directory exists
const drizzleDir = path.join(__dirname, 'drizzle');
if (!fs.existsSync(drizzleDir)) {
  fs.mkdirSync(drizzleDir, { recursive: true });
}

try {
  // Push schema to database
  console.log('Pushing database schema...');
  execSync('npx drizzle-kit push:pg', { 
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit'
  });
  
  console.log('Database schema pushed successfully!');
} catch (error) {
  console.error('Error pushing database schema:', error.message);
  process.exit(1);
}