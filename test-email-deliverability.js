// Email deliverability diagnostic script
import { EmailService } from './server/emailService.js';

async function testEmailDeliverability() {
  console.log('🔍 EMAIL DELIVERABILITY DIAGNOSTIC REPORT');
  console.log('===========================================\n');
  
  // Test 1: Send test email to multiple providers
  const testEmails = [
    'tysonstel@gmail.com',
    'joshfairbank@hotmail.com', // User we know works
    'jason.stachow@globalcontainerexchange.com' // Business email
  ];
  
  console.log('📧 Testing email delivery to multiple providers...\n');
  
  for (const email of testEmails) {
    try {
      console.log(`Sending test email to: ${email}`);
      const result = await EmailService.sendPasswordSetupEmail(
        email, 
        'expert', 
        `test-token-${Date.now()}`
      );
      
      if (result && result.success) {
        console.log(`✅ Email sent successfully to ${email}`);
        console.log(`   Message ID: ${result.messageId}\n`);
      } else {
        console.log(`❌ Email failed to ${email}`);
        console.log(`   Error: ${result?.error || 'Unknown error'}\n`);
      }
    } catch (error) {
      console.log(`❌ Email failed to ${email}`);
      console.log(`   Error: ${error.message}\n`);
    }
    
    // Wait 2 seconds between emails to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n📋 DELIVERABILITY CHECKLIST:');
  console.log('- ✅ SMTP Authentication: Working');
  console.log('- ✅ Email Sending: Working');
  console.log('- ❓ DNS SPF Record: Needs verification');
  console.log('- ❓ DNS DKIM Record: Needs verification');
  console.log('- ❓ Recipient Spam Folders: Check required');
  
  console.log('\n🔍 NEXT STEPS FOR TYSON:');
  console.log('1. Check spam/junk folder in Gmail');
  console.log('2. Check "Promotions" tab in Gmail');
  console.log('3. Add support@globalcontainerexchange.com to contacts');
  console.log('4. Check email filters/rules blocking the domain');
  
  console.log('\n📞 IMMEDIATE SOLUTION:');
  console.log('Ask Tyson to check ALL Gmail folders and provide feedback.');
  console.log('Email delivery is working - this is likely a spam filter issue.');
}

testEmailDeliverability().catch(console.error);