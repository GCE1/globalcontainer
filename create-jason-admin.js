#!/usr/bin/env node

/**
 * Create Admin User Account for Jason Stachow
 * Sets up admin user with full access to the admin backend console
 */

const { Pool, neonConfig } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-serverless');
const { eq } = require('drizzle-orm');
const bcrypt = require('bcryptjs');
const readline = require('readline');
const ws = require('ws');

neonConfig.webSocketConstructor = ws;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function askPassword(question) {
  return new Promise((resolve) => {
    const stdin = process.stdin;
    stdin.setRawMode(true);
    stdin.resume();
    stdin.setEncoding('utf8');
    
    let password = '';
    process.stdout.write(question);
    
    stdin.on('data', function handler(char) {
      char = char + '';
      
      switch(char) {
        case '\n':
        case '\r':
        case '\u0004':
          stdin.setRawMode(false);
          stdin.pause();
          stdin.removeListener('data', handler);
          process.stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // backspace
          if (password.length > 0) {
            password = password.slice(0, -1);
            process.stdout.write('\b \b');
          }
          break;
        default:
          password += char;
          process.stdout.write('*');
          break;
      }
    });
  });
}

async function createAdminUser() {
  try {
    console.log('\n🔧 Setting up Admin User Account for Jason Stachow\n');
    
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is required');
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle({ client: pool, schema: { users, adminRoles } });

    // Get user input
    const email = await askQuestion('Enter your email address (username): ');
    const password = await askPassword('Enter your password: ');
    const confirmPassword = await askPassword('Confirm your password: ');

    if (password !== confirmPassword) {
      console.log('\n❌ Passwords do not match. Please try again.');
      return;
    }

    if (password.length < 8) {
      console.log('\n❌ Password must be at least 8 characters long.');
      return;
    }

    // Check if user already exists
    const existingUser = await db.select().from(users).where(eq(users.email, email));
    
    if (existingUser.length > 0) {
      console.log('\n❌ User with this email already exists.');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create admin user
    const [newUser] = await db.insert(users).values({
      id: `admin-${Date.now()}`,
      email: email,
      firstName: 'Jason',
      lastName: 'Stachow',
      role: 'admin',
      profileImageUrl: null,
      subscriptionTier: 'expert',
      subscriptionStatus: 'active',
      adminPermissions: JSON.stringify({
        users: true,
        orders: true,
        containers: true,
        analytics: true,
        settings: true,
        security: true,
        billing: true,
        system: true
      }),
      twoFactorEnabled: false,
      lastLogin: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();

    // Create admin role entry
    await db.insert(adminRoles).values({
      userId: newUser.id,
      role: 'super_admin',
      permissions: JSON.stringify({
        users: ['create', 'read', 'update', 'delete'],
        orders: ['create', 'read', 'update', 'delete'],
        containers: ['create', 'read', 'update', 'delete'],
        analytics: ['read'],
        settings: ['create', 'read', 'update', 'delete'],
        security: ['create', 'read', 'update', 'delete'],
        billing: ['read', 'update'],
        system: ['read', 'update']
      }),
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    console.log('\n✅ Admin user account created successfully!');
    console.log('\n📋 Account Details:');
    console.log(`   Name: Jason Stachow`);
    console.log(`   Email: ${email}`);
    console.log(`   Role: Super Admin`);
    console.log(`   User ID: ${newUser.id}`);
    console.log(`   Subscription: Expert (Active)`);
    console.log('\n🎯 Admin Permissions:');
    console.log('   ✓ User Management');
    console.log('   ✓ Order Management');
    console.log('   ✓ Container Management');
    console.log('   ✓ Analytics & Reports');
    console.log('   ✓ System Settings');
    console.log('   ✓ Security Settings');
    console.log('   ✓ Billing Management');
    console.log('   ✓ System Administration');
    
    console.log('\n🚀 You can now access the admin dashboard at: /admin');
    console.log('   Use your email and password to log in.');

    await pool.end();
    rl.close();

  } catch (error) {
    console.error('\n❌ Error creating admin user:', error.message);
    rl.close();
    process.exit(1);
  }
}

createAdminUser();