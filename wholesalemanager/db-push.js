const { exec } = require('child_process');
const path = require('path');

console.log('Pushing database schema to PostgreSQL...');

// Execute drizzle-kit push command
const command = 'npx drizzle-kit push:pg';
exec(command, { cwd: path.join(__dirname, '..') }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error executing database push: ${error.message}`);
    return;
  }
  
  if (stderr) {
    console.error(`Database push stderr: ${stderr}`);
    return;
  }
  
  console.log(`Database schema pushed successfully:\n${stdout}`);
});