#!/usr/bin/env node

/**
 * Admin Setup Script for Global Container Exchange Platform
 * Creates initial admin user and configures admin backend console
 */

const { Pool } = require('@neondatabase/serverless');
const ws = require('ws');
const bcrypt = require('bcryptjs');
const speakeasy = require('speakeasy');
const readline = require('readline');

// Configure Neon with WebSocket
const neonConfig = require('@neondatabase/serverless').neonConfig;
neonConfig.webSocketConstructor = ws;

// Database connection
const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Utility function to ask questions
function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

// Utility function to ask for password (hidden input)
function askPassword(question) {
  return new Promise((resolve) => {
    process.stdout.write(question);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding('utf8');
    
    let password = '';
    process.stdin.on('data', function(char) {
      char = char + '';
      switch(char) {
        case '\n':
        case '\r':
        case '\u0004':
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdout.write('\n');
          resolve(password);
          break;
        case '\u0003':
          process.exit();
          break;
        case '\u007f': // Backspace
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

async function createAdminTables() {
  console.log('Creating admin database tables...');
  
  try {
    // Create admin roles table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_roles (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE,
        description TEXT,
        permissions JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admin activity logs table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_activity_logs (
        id SERIAL PRIMARY KEY,
        admin_id VARCHAR(255) NOT NULL,
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(100),
        resource_id VARCHAR(255),
        details JSONB DEFAULT '{}',
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create system settings table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS system_settings (
        id SERIAL PRIMARY KEY,
        key VARCHAR(255) NOT NULL UNIQUE,
        value JSONB,
        description TEXT,
        category VARCHAR(100) DEFAULT 'general',
        is_sensitive BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admin notifications table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_notifications (
        id SERIAL PRIMARY KEY,
        admin_id VARCHAR(255),
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create admin backup codes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_backup_codes (
        id SERIAL PRIMARY KEY,
        admin_id VARCHAR(255) NOT NULL,
        code VARCHAR(20) NOT NULL,
        is_used BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        used_at TIMESTAMP
      )
    `);

    console.log('✓ Admin database tables created successfully');
  } catch (error) {
    console.error('Error creating admin tables:', error);
    throw error;
  }
}

async function insertDefaultRoles() {
  console.log('Creating default admin roles...');
  
  const defaultRoles = [
    {
      name: 'super_admin',
      description: 'Full system access with all permissions',
      permissions: {
        users: ['read', 'write', 'delete'],
        orders: ['read', 'write', 'delete'],
        containers: ['read', 'write', 'delete'],
        analytics: ['read', 'export'],
        settings: ['read', 'write'],
        security: ['read', 'write'],
        roles: ['read', 'write', 'delete']
      }
    },
    {
      name: 'admin',
      description: 'Standard admin access with most permissions',
      permissions: {
        users: ['read', 'write'],
        orders: ['read', 'write'],
        containers: ['read', 'write'],
        analytics: ['read'],
        settings: ['read'],
        security: ['read']
      }
    },
    {
      name: 'pricing_manager',
      description: 'Manage container pricing and rates',
      permissions: {
        containers: ['read', 'write'],
        orders: ['read'],
        analytics: ['read'],
        pricing: ['read', 'write']
      }
    },
    {
      name: 'user_manager',
      description: 'Manage user accounts and subscriptions',
      permissions: {
        users: ['read', 'write'],
        analytics: ['read']
      }
    },
    {
      name: 'content_manager',
      description: 'Manage website content and container listings',
      permissions: {
        containers: ['read', 'write'],
        content: ['read', 'write']
      }
    }
  ];

  try {
    for (const role of defaultRoles) {
      await pool.query(`
        INSERT INTO admin_roles (name, description, permissions)
        VALUES ($1, $2, $3)
        ON CONFLICT (name) DO UPDATE SET
          description = EXCLUDED.description,
          permissions = EXCLUDED.permissions,
          updated_at = CURRENT_TIMESTAMP
      `, [role.name, role.description, JSON.stringify(role.permissions)]);
    }
    
    console.log('✓ Default admin roles created successfully');
  } catch (error) {
    console.error('Error creating default roles:', error);
    throw error;
  }
}

async function createAdminUser() {
  console.log('\n=== Admin User Setup ===');
  
  try {
    // Get admin user details
    const firstName = await askQuestion('Enter admin first name: ');
    const lastName = await askQuestion('Enter admin last name: ');
    const email = await askQuestion('Enter admin email: ');
    
    // Validate password
    let password, confirmPassword;
    do {
      password = await askPassword('Enter admin password (min 8 characters): ');
      if (password.length < 8) {
        console.log('Password must be at least 8 characters long. Please try again.');
        continue;
      }
      confirmPassword = await askPassword('Confirm admin password: ');
      if (password !== confirmPassword) {
        console.log('Passwords do not match. Please try again.');
      }
    } while (password !== confirmPassword || password.length < 8);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate user ID
    const adminId = `admin-${Date.now()}`;

    // Check if user already exists in users table
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      // Update existing user to admin
      await pool.query(`
        UPDATE users SET
          first_name = $1,
          last_name = $2,
          role = 'super_admin',
          updated_at = CURRENT_TIMESTAMP
        WHERE email = $3
      `, [firstName, lastName, email]);
      
      console.log('✓ Existing user updated to super admin');
    } else {
      // Create new admin user
      await pool.query(`
        INSERT INTO users (id, email, first_name, last_name, role, created_at, updated_at)
        VALUES ($1, $2, $3, $4, 'super_admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [adminId, email, firstName, lastName]);
      
      console.log('✓ New admin user created successfully');
    }

    // Setup Two-Factor Authentication
    const setup2fa = await askQuestion('Setup Two-Factor Authentication? (y/n): ');
    
    if (setup2fa.toLowerCase() === 'y' || setup2fa.toLowerCase() === 'yes') {
      const secret = speakeasy.generateSecret({
        name: `GCE Admin (${email})`,
        issuer: 'Global Container Exchange'
      });

      console.log('\n=== Two-Factor Authentication Setup ===');
      console.log('QR Code URL:', secret.otpauth_url);
      console.log('Manual Entry Key:', secret.base32);
      console.log('\nScan the QR code with your authenticator app or enter the manual key.');
      
      // Generate backup codes
      const backupCodes = [];
      for (let i = 0; i < 10; i++) {
        const code = Math.random().toString(36).substring(2, 10).toUpperCase();
        backupCodes.push(code);
        
        await pool.query(`
          INSERT INTO admin_backup_codes (admin_id, code)
          VALUES ($1, $2)
        `, [adminId, code]);
      }

      console.log('\n=== Backup Codes ===');
      console.log('Save these backup codes securely:');
      backupCodes.forEach((code, index) => {
        console.log(`${index + 1}. ${code}`);
      });

      // Update user with 2FA secret
      await pool.query(`
        UPDATE users SET
          two_factor_secret = $1,
          two_factor_enabled = TRUE
        WHERE email = $2
      `, [secret.base32, email]);

      console.log('\n✓ Two-Factor Authentication configured');
    }

    // Log admin creation activity
    await pool.query(`
      INSERT INTO admin_activity_logs (admin_id, action, resource_type, details)
      VALUES ($1, 'admin_user_created', 'user', $2)
    `, [adminId, JSON.stringify({ email, role: 'super_admin' })]);

    console.log('\n=== Admin Setup Complete ===');
    console.log(`Admin Email: ${email}`);
    console.log(`Admin Role: super_admin`);
    console.log('Access URL: /admin');
    console.log('\nYou can now log in to the admin dashboard.');

  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

async function insertSystemSettings() {
  console.log('Creating default system settings...');
  
  const defaultSettings = [
    {
      key: 'platform_name',
      value: 'Global Container Exchange',
      description: 'Platform display name',
      category: 'general'
    },
    {
      key: 'admin_session_timeout',
      value: 3600000, // 1 hour in milliseconds
      description: 'Admin session timeout duration',
      category: 'security'
    },
    {
      key: 'max_login_attempts',
      value: 5,
      description: 'Maximum failed login attempts before lockout',
      category: 'security'
    },
    {
      key: 'lockout_duration',
      value: 900000, // 15 minutes in milliseconds
      description: 'Account lockout duration after failed attempts',
      category: 'security'
    },
    {
      key: 'require_2fa_for_admin',
      value: true,
      description: 'Require two-factor authentication for admin accounts',
      category: 'security'
    },
    {
      key: 'backup_retention_days',
      value: 90,
      description: 'Number of days to retain backup files',
      category: 'maintenance'
    }
  ];

  try {
    for (const setting of defaultSettings) {
      await pool.query(`
        INSERT INTO system_settings (key, value, description, category)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (key) DO NOTHING
      `, [setting.key, JSON.stringify(setting.value), setting.description, setting.category]);
    }
    
    console.log('✓ Default system settings created successfully');
  } catch (error) {
    console.error('Error creating system settings:', error);
    throw error;
  }
}

async function verifySetup() {
  console.log('\nVerifying admin setup...');
  
  try {
    // Check tables exist
    const tables = ['admin_roles', 'admin_activity_logs', 'system_settings', 'admin_notifications', 'admin_backup_codes'];
    for (const table of tables) {
      const result = await pool.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_name = $1
        )
      `, [table]);
      
      if (!result.rows[0].exists) {
        throw new Error(`Table ${table} does not exist`);
      }
    }

    // Check roles exist
    const rolesResult = await pool.query('SELECT COUNT(*) FROM admin_roles');
    if (parseInt(rolesResult.rows[0].count) === 0) {
      throw new Error('No admin roles found');
    }

    // Check admin user exists
    const adminResult = await pool.query("SELECT COUNT(*) FROM users WHERE role = 'super_admin'");
    if (parseInt(adminResult.rows[0].count) === 0) {
      throw new Error('No super admin user found');
    }

    // Check system settings exist
    const settingsResult = await pool.query('SELECT COUNT(*) FROM system_settings');
    if (parseInt(settingsResult.rows[0].count) === 0) {
      throw new Error('No system settings found');
    }

    console.log('✓ Admin setup verification completed successfully');
    
    return true;
  } catch (error) {
    console.error('Setup verification failed:', error);
    return false;
  }
}

async function main() {
  console.log('Global Container Exchange - Admin Setup');
  console.log('=====================================\n');

  if (!process.env.DATABASE_URL) {
    console.error('ERROR: DATABASE_URL environment variable is not set');
    process.exit(1);
  }

  try {
    // Create admin database structure
    await createAdminTables();
    await insertDefaultRoles();
    await insertSystemSettings();
    
    // Create admin user
    await createAdminUser();
    
    // Verify setup
    const verified = await verifySetup();
    
    if (verified) {
      console.log('\n🎉 Admin backend console setup completed successfully!');
      console.log('\nNext steps:');
      console.log('1. Start the application: npm run dev');
      console.log('2. Navigate to: /admin');
      console.log('3. Log in with your admin credentials');
      console.log('4. Configure additional settings as needed');
      console.log('\nFor more information, see: ADMIN_BACKEND_CONSOLE_GUIDE.md');
    } else {
      console.log('\n❌ Setup verification failed. Please check the errors above.');
      process.exit(1);
    }
    
  } catch (error) {
    console.error('Setup failed:', error);
    process.exit(1);
  } finally {
    rl.close();
    await pool.end();
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nSetup interrupted by user');
  rl.close();
  await pool.end();
  process.exit(0);
});

// Run setup
if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  createAdminTables,
  insertDefaultRoles,
  createAdminUser,
  insertSystemSettings,
  verifySetup
};