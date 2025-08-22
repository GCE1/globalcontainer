#!/usr/bin/env node

// Test script to verify email credentials for all 9 GCE accounts
import nodemailer from 'nodemailer';

const GCE_EMAIL_ACCOUNTS = [
  'j.stachow@globalcontainerexchange.com',
  'j.fairbank@globalcontainerexchange.com', 
  't.stel@globalcontainerexchange.com',
  'accounting@globalcontainerexchange.com',
  'info@globalcontainerexchange.com',
  'partnerships@globalcontainerexchange.com',
  'support@globalcontainerexchange.com',
  'sales@globalcontainerexchange.com',
  'admin@globalcontainerexchange.com'
];

const POSSIBLE_PASSWORDS = [
  'Greatboxx123@',  // Admin login password
  'Greatboss123@',  // User mentioned this for j.fairbank
];

async function testEmailCredentials(email, password) {
  return new Promise((resolve) => {
    console.log(`Testing ${email} with password ${password.substring(0, 4)}****`);
    
    const transporter = nodemailer.createTransport({
      host: 'server168.web-hosting.com',
      port: 465,
      secure: true,
      auth: {
        user: email,
        pass: password,
      },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
      tls: {
        rejectUnauthorized: false,
        minVersion: 'TLSv1.2'
      },
      authMethod: 'PLAIN'
    });

    // Just verify the connection, don't send
    transporter.verify((error, success) => {
      if (success) {
        console.log(`✅ ${email}: Authentication successful`);
        resolve({ email, password, success: true });
      } else {
        console.log(`❌ ${email}: ${error.message}`);
        resolve({ email, password, success: false, error: error.message });
      }
      transporter.close();
    });
  });
}

async function main() {
  console.log('🔍 Testing email credentials for all GCE accounts...\n');
  
  const results = [];
  
  for (const email of GCE_EMAIL_ACCOUNTS) {
    for (const password of POSSIBLE_PASSWORDS) {
      const result = await testEmailCredentials(email, password);
      results.push(result);
      
      if (result.success) {
        break; // Found working password for this account
      }
      
      // Wait a bit between attempts
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    console.log(''); // Empty line between accounts
  }
  
  console.log('\n📊 SUMMARY:');
  console.log('='.repeat(50));
  
  const working = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  
  console.log(`✅ Working accounts: ${working.length}`);
  working.forEach(r => console.log(`   - ${r.email} (password: ${r.password.substring(0, 4)}****)`));
  
  console.log(`\n❌ Failed accounts: ${failed.length / POSSIBLE_PASSWORDS.length}`);
  
  if (working.length === 0) {
    console.log('\n🚨 NO ACCOUNTS WORKING - Check:');
    console.log('   1. Server name: server168.web-hosting.com');
    console.log('   2. Port: 465 (SSL)');
    console.log('   3. Email passwords');
    console.log('   4. Account setup in cPanel');
  } else {
    console.log('\n✅ Ready to proceed with working accounts!');
  }
}

main().catch(console.error);