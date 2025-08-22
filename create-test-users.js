/**
 * Create test users with different subscription tiers
 * This script creates demo users for testing the membership redirect system
 */

import { neon } from '@neondatabase/serverless';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not found in environment variables');
  process.exit(1);
}

const db = neon(process.env.DATABASE_URL);

async function createTestUsers() {
  console.log('Creating test users with different subscription tiers...');
  
  try {
    // Hash password for all test users
    const hashedPassword = await bcrypt.hash('TestPass123!', 12);
    
    // Test user for Insights tier
    const insightsUser = {
      username: 'insights@globalcontainerexchange.com',
      email: 'insights@globalcontainerexchange.com',
      password: 'TestPass123!',
      password_hash: hashedPassword,
      first_name: 'Insights',
      last_name: 'User',
      subscription_tier: 'insights',
      subscription_status: 'active',
      subscription_start_date: new Date(),
      subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };
    
    // Test user for Expert tier (Leasing)
    const expertUser = {
      username: 'expert@globalcontainerexchange.com',
      email: 'expert@globalcontainerexchange.com',
      password: 'TestPass123!',
      password_hash: hashedPassword,
      first_name: 'Expert',
      last_name: 'User',
      subscription_tier: 'expert',
      subscription_status: 'active',
      subscription_start_date: new Date(),
      subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };
    
    // Test user for Pro tier (Wholesale)
    const proUser = {
      username: 'pro@globalcontainerexchange.com',
      email: 'pro@globalcontainerexchange.com',
      password: 'TestPass123!',
      password_hash: hashedPassword,
      first_name: 'Pro',
      last_name: 'User',
      subscription_tier: 'pro',
      subscription_status: 'active',
      subscription_start_date: new Date(),
      subscription_end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };
    
    // Test user with no subscription
    const noSubUser = {
      username: 'nosubscription@globalcontainerexchange.com',
      email: 'nosubscription@globalcontainerexchange.com',
      password: 'TestPass123!',
      password_hash: hashedPassword,
      first_name: 'No Subscription',
      last_name: 'User',
      subscription_tier: null,
      subscription_status: 'inactive',
      subscription_start_date: null,
      subscription_end_date: null
    };
    
    const users = [insightsUser, expertUser, proUser, noSubUser];
    
    for (const user of users) {
      try {
        // Check if user already exists
        const existingUser = await db`
          SELECT id FROM users WHERE email = ${user.email}
        `;
        
        if (existingUser.length > 0) {
          console.log(`User ${user.email} already exists, updating...`);
          await db`
            UPDATE users 
            SET 
              username = ${user.username},
              password = ${user.password},
              password_hash = ${user.password_hash},
              first_name = ${user.first_name},
              last_name = ${user.last_name},
              subscription_tier = ${user.subscription_tier},
              subscription_status = ${user.subscription_status},
              subscription_start_date = ${user.subscription_start_date},
              subscription_end_date = ${user.subscription_end_date},
              updated_at = NOW()
            WHERE email = ${user.email}
          `;
        } else {
          console.log(`Creating new user ${user.email}...`);
          await db`
            INSERT INTO users (
              username, email, password, password_hash, first_name, last_name,
              subscription_tier, subscription_status, subscription_start_date, subscription_end_date
            ) VALUES (
              ${user.username}, ${user.email}, ${user.password}, ${user.password_hash}, ${user.first_name}, ${user.last_name},
              ${user.subscription_tier}, ${user.subscription_status}, ${user.subscription_start_date}, ${user.subscription_end_date}
            )
          `;
        }
        
        console.log(`✓ ${user.email} (${user.subscription_tier || 'no subscription'}) - ${user.subscription_status}`);
      } catch (error) {
        console.error(`Error creating user ${user.email}:`, error);
      }
    }
    
    console.log('\n✅ Test users created successfully!');
    console.log('\nYou can now test the membership redirect system with these accounts:');
    console.log('- insights@globalcontainerexchange.com (password: TestPass123!) -> Insights Analytics');
    console.log('- expert@globalcontainerexchange.com (password: TestPass123!) -> Leasing Manager');
    console.log('- pro@globalcontainerexchange.com (password: TestPass123!) -> Wholesale Manager');
    console.log('- nosubscription@globalcontainerexchange.com (password: TestPass123!) -> Membership Required');
    
  } catch (error) {
    console.error('Error creating test users:', error);
  }
}

// Run the script
createTestUsers().catch(console.error);