// Comprehensive email delivery testing script
const { EmailService } = require('./server/emailService');
const { AuthService } = require('./server/auth');

async function testEmailDelivery() {
  console.log('🔍 Testing email delivery system...');
  
  try {
    // Test 1: SMTP Connection
    console.log('\n1. Testing SMTP connection...');
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.titan.email',
      port: parseInt(process.env.SMTP_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
    
    await transporter.verify();
    console.log('✅ SMTP connection successful');
    
    // Test 2: Send test email to Tyson
    console.log('\n2. Testing email delivery to Tyson...');
    const testResult = await EmailService.sendPasswordSetupEmail(
      'tysonstel@gmail.com', 
      'expert', 
      'test-token-123'
    );
    
    console.log('Email send result:', testResult);
    
    // Test 3: DNS and deliverability check
    console.log('\n3. Checking DNS configuration...');
    const dns = require('dns').promises;
    
    try {
      const mxRecords = await dns.resolveMx('globalcontainerexchange.com');
      console.log('MX Records:', mxRecords);
      
      const txtRecords = await dns.resolveTxt('globalcontainerexchange.com');
      console.log('TXT Records (SPF/DKIM):', txtRecords);
      
      // Check DKIM specifically
      const dkimRecords = await dns.resolveTxt('titan1._domainkey.globalcontainerexchange.com');
      console.log('DKIM Records:', dkimRecords);
      
    } catch (dnsError) {
      console.error('DNS lookup failed:', dnsError.message);
    }
    
  } catch (error) {
    console.error('❌ Email test failed:', error);
  }
}

testEmailDelivery();