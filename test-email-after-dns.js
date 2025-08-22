import { SimpleMassEmail } from './server/simpleMassEmail.js';

async function testEmailAfterDNSUpdate() {
  console.log('=== TESTING EMAIL AFTER DNS UPDATE ===');
  console.log('DNS A record updated to: 34.111.179.208');
  console.log('Testing basic email functionality...\n');

  try {
    // Test basic email functionality
    const result = await SimpleMassEmail.sendSingleEmail(
      'j.fairbank@globalcontainerexchange.com',
      'DNS Update Test - ' + new Date().toISOString(),
      'Testing email delivery after updating DNS records to point to Replit deployment IP 34.111.179.208. This should resolve the previous IP authorization issues we were experiencing.',
      false
    );

    console.log('✓ Email test result:', result);
    return result;
  } catch (error) {
    console.log('✗ Email test failed:', error.message);
    
    // Check if it's still the same IP authorization error
    if (error.message.includes('Your IP:') && error.message.includes('not allowed')) {
      console.log('\n📋 ANALYSIS: Still getting IP authorization error');
      console.log('This suggests either:');
      console.log('1. DNS propagation is still in progress (can take up to 48 hours)');
      console.log('2. The email server checks different records (SPF, DKIM)');
      console.log('3. Additional email authentication records need updating');
    }
    
    return { success: false, error: error.message };
  }
}

// Run the test
testEmailAfterDNSUpdate()
  .then(result => {
    console.log('\n=== TEST COMPLETE ===');
    console.log('Result:', JSON.stringify(result, null, 2));
    process.exit(0);
  })
  .catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
  });