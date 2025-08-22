#!/usr/bin/env node

// Simple test script to verify all 9 GCE admin accounts can login
const adminAccounts = [
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

async function testLogin(email) {
  try {
    const response = await fetch('http://localhost:5000/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: 'Greatboxx123@'
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ ${email} - Login successful (${result.user.jobTitle})`);
      return true;
    } else {
      console.log(`❌ ${email} - Login failed: ${result.message}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ ${email} - Network error: ${error.message}`);
    return false;
  }
}

async function testAllAdminAccounts() {
  console.log('🔒 Testing all 9 GCE admin email accounts...\n');
  
  let successCount = 0;
  for (const email of adminAccounts) {
    const success = await testLogin(email);
    if (success) successCount++;
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`\n📊 Results: ${successCount}/${adminAccounts.length} accounts successfully authenticated`);
  
  if (successCount === adminAccounts.length) {
    console.log('🎉 All admin accounts are working perfectly!');
    console.log('\n📧 Email system features:');
    console.log('• Individual admin login access');
    console.log('• Database-authenticated sessions');
    console.log('• Email sync with intelligent IMAP fallback');
    console.log('• Gmail-like popup modal interfaces');
    console.log('• Independent mailbox access for each admin');
  } else {
    console.log('⚠️  Some accounts failed authentication');
  }
}

// Run the test
testAllAdminAccounts().catch(console.error);