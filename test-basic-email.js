// Simple email test script
import nodemailer from 'nodemailer';

async function testEmail() {
  console.log('=== TESTING BASIC EMAIL FUNCTIONALITY ===');
  
  // Create transporter with GCE email settings
  const transporter = nodemailer.createTransport({
    host: 'server168.web-hosting.com',
    port: 465,
    secure: true,
    auth: {
      user: 'j.fairbank@globalcontainerexchange.com',
      pass: 'Greatboxx123@'
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  try {
    // Test the connection
    await transporter.verify();
    console.log('✓ SMTP connection successful');
    
    // Send a test email
    const info = await transporter.sendMail({
      from: '"Global Container Exchange" <j.fairbank@globalcontainerexchange.com>',
      to: 'j.fairbank@globalcontainerexchange.com', // Send to self for testing
      subject: 'Email System Test - ' + new Date().toISOString(),
      text: 'This is a test of the basic email functionality.',
      html: '<p>This is a test of the basic email functionality.</p><p>If you receive this, the email system is working!</p>'
    });
    
    console.log('✓ Test email sent successfully');
    console.log('Message ID:', info.messageId);
    return true;
    
  } catch (error) {
    console.error('✗ Email test failed:', error.message);
    return false;
  }
}

testEmail().then(success => {
  console.log('Email test result:', success ? 'SUCCESS' : 'FAILED');
  process.exit(success ? 0 : 1);
});