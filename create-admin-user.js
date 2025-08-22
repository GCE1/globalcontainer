import { Pool, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';
import bcrypt from 'bcryptjs';

neonConfig.webSocketConstructor = ws;

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function createAdminUser() {
  console.log('Creating admin user for GCE platform...');
  
  try {
    // Create admin tables if they don't exist
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

    // Insert default super admin role
    await pool.query(`
      INSERT INTO admin_roles (name, description, permissions)
      VALUES ('super_admin', 'Full system access with all permissions', $1)
      ON CONFLICT (name) DO NOTHING
    `, [JSON.stringify({
      users: ['read', 'write', 'delete'],
      orders: ['read', 'write', 'delete'],
      containers: ['read', 'write', 'delete'],
      analytics: ['read', 'export'],
      settings: ['read', 'write'],
      security: ['read', 'write'],
      roles: ['read', 'write', 'delete']
    })]);

    // Create or update admin user
    const adminEmail = 'admin@globalcontainerexchange.com';
    const adminPassword = 'Admin123!GCE';
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    const adminId = 'admin-gce-' + Date.now();

    // Check if admin user exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [adminEmail]
    );

    if (existingUser.rows.length > 0) {
      // Update existing user to admin
      await pool.query(`
        UPDATE users SET
          role = 'super_admin',
          updated_at = CURRENT_TIMESTAMP
        WHERE email = $1
      `, [adminEmail]);
      console.log('✓ Updated existing user to super admin');
    } else {
      // Create new admin user
      await pool.query(`
        INSERT INTO users (id, email, first_name, last_name, role, created_at, updated_at)
        VALUES ($1, $2, 'GCE', 'Administrator', 'super_admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `, [adminId, adminEmail]);
      console.log('✓ Created new admin user');
    }

    // Add default system settings
    const defaultSettings = [
      ['platform_name', 'Global Container Exchange', 'Platform display name'],
      ['admin_session_timeout', '3600000', 'Admin session timeout in milliseconds'],
      ['require_2fa_for_admin', 'false', 'Require 2FA for admin accounts']
    ];

    for (const [key, value, description] of defaultSettings) {
      await pool.query(`
        INSERT INTO system_settings (key, value, description)
        VALUES ($1, $2, $3)
        ON CONFLICT (key) DO NOTHING
      `, [key, JSON.stringify(value), description]);
    }

    console.log('\n=== Admin Access Credentials ===');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);
    console.log('Role: super_admin');
    console.log('Access URL: /admin');
    console.log('\n✓ Admin setup completed successfully!');

  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

createAdminUser().catch(console.error);