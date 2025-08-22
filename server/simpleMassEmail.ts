import nodemailer from 'nodemailer';
import { db } from './db';
import { users, emailCampaigns } from '../shared/schema';
import { eq } from 'drizzle-orm';

// Simple, reliable email configuration
const createEmailTransporter = () => {
  return nodemailer.createTransport({
    host: 'mail.globalcontainerexchange.com', // Use mail subdomain which points to 68.65.122.145
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
};

export class SimpleMassEmail {
  
  // Send a single email (basic functionality test)
  static async sendSingleEmail(to: string, subject: string, content: string, isHtml = false) {
    try {
      const transporter = createEmailTransporter();
      
      // Verify connection first
      await transporter.verify();
      
      const mailOptions = {
        from: 'j.fairbank@globalcontainerexchange.com', // Simple format to avoid domain issues
        to: to,
        subject: subject,
        [isHtml ? 'html' : 'text']: content
      };
      
      const info = await transporter.sendMail(mailOptions);
      console.log(`✓ Email sent to ${to}: ${info.messageId}`);
      
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error(`✗ Failed to send email to ${to}:`, error.message);
      throw error;
    }
  }
  
  // Send mass email to all customers
  static async sendMassEmailToCustomers(subject: string, content: string, isHtml = false) {
    try {
      console.log('=== STARTING MASS EMAIL TO CUSTOMERS ===');
      
      // Get all customer email addresses
      const customers = await db.select({
        email: users.email,
        firstName: users.firstName,
        lastName: users.lastName
      }).from(users).where(eq(users.role, 'customer'));
      
      console.log(`Found ${customers.length} customers to email`);
      
      const results = {
        successful: 0,
        failed: 0,
        total: customers.length,
        errors: [] as string[]
      };
      
      // Send emails in batches to avoid overwhelming the SMTP server
      const batchSize = 5;
      for (let i = 0; i < customers.length; i += batchSize) {
        const batch = customers.slice(i, i + batchSize);
        
        console.log(`Sending batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(customers.length/batchSize)}`);
        
        const batchPromises = batch.map(async (customer) => {
          try {
            // Personalize content if possible
            let personalizedContent = content;
            if (customer.firstName) {
              personalizedContent = content.replace(/{{firstName}}/g, customer.firstName);
              personalizedContent = personalizedContent.replace(/{{name}}/g, customer.firstName);
            }
            
            await this.sendSingleEmail(customer.email, subject, personalizedContent, isHtml);
            results.successful++;
          } catch (error: any) {
            results.failed++;
            results.errors.push(`${customer.email}: ${error.message}`);
          }
        });
        
        await Promise.all(batchPromises);
        
        // Small delay between batches to be respectful to the SMTP server
        if (i + batchSize < customers.length) {
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      }
      
      console.log(`=== MASS EMAIL COMPLETE ===`);
      console.log(`Successful: ${results.successful}`);
      console.log(`Failed: ${results.failed}`);
      
      return results;
      
    } catch (error: any) {
      console.error('Mass email failed:', error.message);
      throw error;
    }
  }
  
  // Send email to preferred contacts (admin team)
  static async sendToPreferredContacts(subject: string, content: string, isHtml = false) {
    const preferredContacts = [
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
    
    console.log('=== SENDING TO PREFERRED CONTACTS ===');
    
    const results = {
      successful: 0,
      failed: 0,
      total: preferredContacts.length,
      errors: [] as string[]
    };
    
    for (const email of preferredContacts) {
      try {
        await this.sendSingleEmail(email, subject, content, isHtml);
        results.successful++;
      } catch (error: any) {
        results.failed++;
        results.errors.push(`${email}: ${error.message}`);
      }
    }
    
    console.log(`Preferred contacts email complete: ${results.successful}/${results.total} successful`);
    return results;
  }
  
  // Test basic email functionality
  static async testEmailSystem() {
    try {
      console.log('=== TESTING EMAIL SYSTEM ===');
      
      const testEmail = 'j.fairbank@globalcontainerexchange.com';
      const subject = 'GCE Email System Test - ' + new Date().toISOString();
      const content = 'This is a test of the Global Container Exchange email system. If you receive this, the system is working correctly!';
      
      await this.sendSingleEmail(testEmail, subject, content);
      
      console.log('✓ Email system test successful');
      return true;
    } catch (error: any) {
      console.error('✗ Email system test failed:', error.message);
      return false;
    }
  }
}