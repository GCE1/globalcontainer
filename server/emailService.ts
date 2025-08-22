import nodemailer from 'nodemailer';

// Configure nodemailer transporter for cPanel server (dynamic authentication)
const createTransporter = (emailAccount?: string, password?: string) => {
  // Default to j.fairbank account or use provided credentials
  const authUser = emailAccount || 'j.fairbank@globalcontainerexchange.com';
  const authPass = password || 'Greatboxx123@';
  
  const config = {
    host: 'mail.globalcontainerexchange.com', // Use mail subdomain which points to 68.65.122.145
    port: 465,
    secure: true, // Use SSL/TLS for port 465
    auth: {
      user: authUser,
      pass: authPass,
    },
    connectionTimeout: 60000, // Increased timeout for better connection stability
    greetingTimeout: 30000,
    socketTimeout: 60000,
    // Enhanced TLS settings for SSL/TLS encryption
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2',
      ciphers: 'HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA'
    },
    // Authentication method for cPanel
    authMethod: 'PLAIN',
    debug: true, // Enable debug for troubleshooting
    logger: true // Enable logging for troubleshooting
  };
  
  console.log('Email transporter config (cPanel):', {
    host: config.host,
    port: config.port,
    secure: config.secure,
    user: config.auth.user ? config.auth.user.substring(0, 10) + '...' : 'not set'
  });
  
  return nodemailer.createTransport(config);
};

// Default transporter - can be overridden per email
const transporter = createTransporter();

export class EmailService {
  // Generic email sending method for the email inbox system
  static async sendEmail({ from, to, subject, body, htmlBody }: {
    from: string;
    to: string;
    subject: string;
    body?: string;
    htmlBody?: string;
  }) {
    console.log(`Sending email from: ${from} to: ${to}`);
    
    try {
      // Use support account credentials for sending all emails
      const dynamicTransporter = createTransporter('support@globalcontainerexchange.com', 'Greatboxx123@');
      
      // Use authentication account as sender but set Reply-To to the desired account
      const authenticatedAccount = 'support@globalcontainerexchange.com'; // Use a working account as sender
      
      const mailOptions = {
        from: `"Global Container Exchange" <${authenticatedAccount}>`, // Use authenticated account
        replyTo: from, // Reply goes to the intended sender
        to: to,
        subject: subject,
        text: body,
        html: htmlBody || body,
        headers: {
          'X-Mailer': 'Global Container Exchange Email System',
          'X-Original-Sender': from, // Track original intended sender
          'X-On-Behalf-Of': from // Additional tracking
        }
      };

      // Use dynamic transporter with sender's credentials
      const info = await dynamicTransporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
      
      // Store sent email in database for sent folder
      await this.storeSentEmail({
        from,
        to,
        subject,
        body: body || htmlBody || '',
        messageId: info.messageId
      });
      
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('Error sending email:', error);
      throw new Error(error?.message || 'Failed to send email');
    }
  }

  // Store sent emails in database
  static async storeSentEmail({ from, to, subject, body, messageId }: {
    from: string;
    to: string;
    subject: string;
    body: string;
    messageId: string;
  }) {
    try {
      const { db } = await import('./db');
      const { emails, emailAccounts } = await import('../shared/schema');
      const { eq } = await import('drizzle-orm');
      
      // Find the account ID for the sender
      const [account] = await db.select().from(emailAccounts).where(eq(emailAccounts.email, from));
      
      if (account) {
        // Store the sent email
        await db.insert(emails).values({
          accountId: account.id,
          messageId,
          subject,
          fromEmail: from,
          fromName: from,
          toEmail: to,
          replyTo: from,
          body,
          htmlBody: body,
          isRead: true, // Sent emails are considered "read"
          isImportant: false,
          receivedAt: new Date(),
          isSent: true // Flag to identify sent emails
        });
      }
    } catch (error) {
      console.error('Error storing sent email:', error);
      // Don't throw error here - email was sent successfully, storage is secondary
    }
  }

  static async sendWelcomeEmail(email: string, firstName: string, tier: string) {
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com';
    
    const tierDisplayName = tier.charAt(0).toUpperCase() + tier.slice(1);
    
    const mailOptions = {
      from: `"Global Container Exchange" <${fromEmail}>`,
      to: email,
      replyTo: `"GCE Support" <${fromEmail}>`,
      subject: `Welcome to Global Container Exchange - ${tierDisplayName} Membership Activated!`,
      headers: {
        'X-Mailer': 'Global Container Exchange Platform v2.0',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'X-Entity-ID': `gce-welcome-${Date.now()}`,
        'Message-ID': `<gce-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@globalcontainerexchange.com>`,
        'List-Unsubscribe': `<mailto:unsubscribe@globalcontainerexchange.com?subject=Unsubscribe>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'Precedence': 'bulk',
        'X-Auto-Response-Suppress': 'All',
        'X-Campaign-Type': 'welcome',
        'Authentication-Results': 'spf=pass smtp.mailfrom=globalcontainerexchange.com'
      },
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #001836; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to Global Container Exchange</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-left: 4px solid #42d1bd;">
            <h2 style="color: #001836; margin-top: 0;">Hello ${firstName}!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Congratulations! Your <strong>${tierDisplayName} membership</strong> has been successfully activated.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #42d1bd; margin-top: 0;">Your Membership Benefits:</h3>
              <ul style="color: #555; line-height: 1.8;">
                ${tier === 'insights' ? `
                  <li>Access to container market insights and analytics</li>
                  <li>Basic search and filtering capabilities</li>
                  <li>Email support</li>
                ` : tier === 'expert' ? `
                  <li>Advanced container search and filtering</li>
                  <li>Premium market analytics and reports</li>
                  <li>Priority customer support</li>
                  <li>Access to wholesale pricing information</li>
                ` : `
                  <li>Full platform access with all features</li>
                  <li>Advanced analytics and custom reports</li>
                  <li>24/7 priority support</li>
                  <li>Wholesale pricing and bulk discounts</li>
                  <li>Direct access to global container inventory</li>
                `}
              </ul>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://globalcontainerexchange.com" style="background-color: #42d1bd; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Access Your Dashboard
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you have any questions, please don't hesitate to contact our support team at 
              <a href="mailto:support@globalcontainerexchange.com" style="color: #42d1bd;">support@globalcontainerexchange.com</a>
            </p>
          </div>
          
          <div style="background-color: #001836; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 Global Container Exchange. All rights reserved.</p>
            <p style="margin: 5px 0 0 0; font-size: 10px;">
              You received this email because you signed up for Global Container Exchange services.<br>
              <a href="mailto:unsubscribe@globalcontainerexchange.com?subject=Unsubscribe" style="color: #42d1bd;">Unsubscribe</a> | 
              <a href="https://globalcontainerexchange.com/privacy" style="color: #42d1bd;">Privacy Policy</a>
            </p>
          </div>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Welcome email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return { success: false, error: error.message };
    }
  }

  static async sendQuoteRequest(quoteData: any) {
    const supportEmail = process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com';
    
    const mailOptions = {
      from: `"GCE Quote System" <${supportEmail}>`,
      to: supportEmail,
      cc: 'sales@globalcontainerexchange.com',
      replyTo: `"${quoteData.firstName} ${quoteData.lastName}" <${quoteData.email}>`,
      subject: `New Quote Request - ${quoteData.serviceType} - ${quoteData.firstName} ${quoteData.lastName}`,
      headers: {
        'X-Mailer': 'Global Container Exchange Platform v2.0',
        'X-Priority': '2',
        'X-MSMail-Priority': 'High',
        'X-Entity-ID': `gce-quote-${Date.now()}`,
        'Message-ID': `<gce-quote-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@globalcontainerexchange.com>`,
        'X-Campaign-Type': 'quote-request',
        'Authentication-Results': 'spf=pass smtp.mailfrom=globalcontainerexchange.com'
      },
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #001836; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">New Quote Request</h1>
            <p style="margin: 5px 0 0 0; font-size: 14px;">Global Container Exchange</p>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-left: 4px solid #42d1bd;">
            <h2 style="color: #001836; margin-top: 0;">Customer Information</h2>
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #666; width: 150px;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${quoteData.firstName} ${quoteData.lastName}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Email:</td>
                  <td style="padding: 8px 0; color: #333;"><a href="mailto:${quoteData.email}" style="color: #42d1bd;">${quoteData.email}</a></td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Phone:</td>
                  <td style="padding: 8px 0; color: #333;"><a href="tel:${quoteData.phone}" style="color: #42d1bd;">${quoteData.phone}</a></td>
                </tr>
                ${quoteData.company ? `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Company:</td>
                  <td style="padding: 8px 0; color: #333;">${quoteData.company}</td>
                </tr>
                ` : ''}
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Location:</td>
                  <td style="padding: 8px 0; color: #333;">${quoteData.location}</td>
                </tr>
              </table>
            </div>
            
            <h2 style="color: #001836;">Container Requirements</h2>
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #666; width: 150px;">Service Type:</td>
                  <td style="padding: 8px 0; color: #333;">${quoteData.serviceType}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Container Type:</td>
                  <td style="padding: 8px 0; color: #333;">${quoteData.containerType}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Container Size:</td>
                  <td style="padding: 8px 0; color: #333;">${quoteData.containerSize}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Condition:</td>
                  <td style="padding: 8px 0; color: #333;">${quoteData.containerCondition}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Quantity:</td>
                  <td style="padding: 8px 0; color: #333;">${quoteData.quantity}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Delivery Location:</td>
                  <td style="padding: 8px 0; color: #333;">${quoteData.deliveryLocation}</td>
                </tr>
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Timeframe:</td>
                  <td style="padding: 8px 0; color: #333;">${quoteData.timeframe}</td>
                </tr>
                ${quoteData.budgetRange ? `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Budget Range:</td>
                  <td style="padding: 8px 0; color: #333;">${quoteData.budgetRange}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            ${quoteData.originPort || quoteData.destinationPort || quoteData.leaseDuration || quoteData.freeDaysPreference ? `
            <h2 style="color: #001836;">Additional Details</h2>
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <table style="width: 100%; border-collapse: collapse;">
                ${quoteData.originPort ? `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #666; width: 150px;">Origin Port:</td>
                  <td style="padding: 8px 0; color: #333;">${quoteData.originPort}</td>
                </tr>
                ` : ''}
                ${quoteData.destinationPort ? `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Destination Port:</td>
                  <td style="padding: 8px 0; color: #333;">${quoteData.destinationPort}</td>
                </tr>
                ` : ''}
                ${quoteData.leaseDuration ? `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Lease Duration:</td>
                  <td style="padding: 8px 0; color: #333;">${quoteData.leaseDuration}</td>
                </tr>
                ` : ''}
                ${quoteData.freeDaysPreference ? `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 8px 0; font-weight: bold; color: #666;">Free Days:</td>
                  <td style="padding: 8px 0; color: #333;">${quoteData.freeDaysPreference}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            ` : ''}
            
            ${quoteData.additionalRequirements ? `
            <h2 style="color: #001836;">Additional Requirements</h2>
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #333; line-height: 1.6; margin: 0;">${quoteData.additionalRequirements}</p>
            </div>
            ` : ''}
            
            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #2196f3;">
              <h3 style="color: #1976d2; margin-top: 0;">⚡ Priority Follow-up Required</h3>
              <p style="color: #333; margin-bottom: 0; font-weight: bold;">
                Customer expects response within 24 hours. Please prioritize this quote request.
              </p>
            </div>
          </div>
          
          <div style="background-color: #001836; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 Global Container Exchange. Quote Request System</p>
            <p style="margin: 5px 0 0 0; font-size: 10px;">
              Quote submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST
            </p>
          </div>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Quote request email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('Error sending quote request email:', error);
      return { success: false, error: error?.message || 'Unknown error' };
    }
  }

  static async sendContactMessage(contactData: any) {
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com';
    const toEmail = 'support@globalcontainerexchange.com';
    
    const mailOptions = {
      from: `"Global Container Exchange Contact Form" <${fromEmail}>`,
      to: toEmail,
      cc: 'sales@globalcontainerexchange.com',
      replyTo: contactData.email,
      subject: `Contact Form: ${contactData.subject} - ${contactData.firstName} ${contactData.lastName}`,
      headers: {
        'X-Mailer': 'Global Container Exchange Contact System',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'Message-ID': `<gce-contact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@globalcontainerexchange.com>`
      },
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #001836; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-left: 4px solid #42d1bd;">
            <h2 style="color: #001836; margin-top: 0;">Customer Contact Request</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              A new message has been submitted through the Global Container Exchange contact form.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #42d1bd; margin-top: 0;">Contact Information:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #001836; width: 30%;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${contactData.firstName} ${contactData.lastName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #001836;">Email:</td>
                  <td style="padding: 8px 0; color: #333;"><a href="mailto:${contactData.email}">${contactData.email}</a></td>
                </tr>
                ${contactData.company ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #001836;">Company:</td>
                  <td style="padding: 8px 0; color: #333;">${contactData.company}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #001836;">Subject:</td>
                  <td style="padding: 8px 0; color: #333;">${contactData.subject}</td>
                </tr>
                ${contactData.buysSellsRents ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #001836;">Interest:</td>
                  <td style="padding: 8px 0; color: #333;">${contactData.buysSellsRents}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <h2 style="color: #001836;">Message</h2>
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="color: #333; line-height: 1.6; margin: 0; white-space: pre-wrap;">${contactData.message}</p>
            </div>
            
            <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #2196f3;">
              <h3 style="color: #1976d2; margin-top: 0;">📞 Customer Response Required</h3>
              <p style="color: #333; margin-bottom: 0; font-weight: bold;">
                Customer expects response within 24 hours. Please follow up promptly.
              </p>
            </div>
          </div>
          
          <div style="background-color: #001836; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 Global Container Exchange. Contact Management System</p>
            <p style="margin: 5px 0 0 0; font-size: 10px;">
              Message submitted at: ${new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })} EST
            </p>
          </div>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Contact message email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error: any) {
      console.error('Error sending contact message email:', error);
      return { success: false, error: error?.message || 'Unknown error' };
    }
  }

  static async sendOrderConfirmation(email: string, firstName: string, orderDetails: any) {
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com';
    
    const mailOptions = {
      from: `"Global Container Exchange" <${fromEmail}>`,
      to: email,
      subject: `Order Confirmation - Global Container Exchange #${orderDetails.orderId}`,
      headers: {
        'X-Mailer': 'Global Container Exchange',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal'
      },
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #001836; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Order Confirmation</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-left: 4px solid #42d1bd;">
            <h2 style="color: #001836; margin-top: 0;">Thank you for your order, ${firstName}!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Your order has been successfully placed and is being processed.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #42d1bd; margin-top: 0;">Order Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Order ID:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">#${orderDetails.orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Total Amount:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">$${orderDetails.total}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Order Date:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date().toLocaleDateString()}</td>
                </tr>
              </table>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              We'll send you another email once your order has been processed and shipped.
              If you have any questions, please contact us at 
              <a href="mailto:support@globalcontainerexchange.com" style="color: #42d1bd;">support@globalcontainerexchange.com</a>
            </p>
          </div>
          
          <div style="background-color: #001836; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 Global Container Exchange. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Order confirmation email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending order confirmation email:', error);
      return { success: false, error: error.message };
    }
  }

  static async sendPasswordResetEmail(email: string, resetToken: string, baseUrl: string) {
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com';
    const resetUrl = `${baseUrl}/reset-password?token=${resetToken}`;
    
    const mailOptions = {
      from: fromEmail,
      to: email,
      subject: 'Password Reset - Global Container Exchange',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #001836; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Password Reset Request</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-left: 4px solid #42d1bd;">
            <h2 style="color: #001836; margin-top: 0;">Reset Your Password</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              You have requested to reset your password for your Global Container Exchange account.
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #42d1bd; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Reset Password
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px;">
              This link will expire in 1 hour. If you did not request a password reset, please ignore this email.
            </p>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you have any questions, please contact us at 
              <a href="mailto:support@globalcontainerexchange.com" style="color: #42d1bd;">support@globalcontainerexchange.com</a>
            </p>
          </div>
          
          <div style="background-color: #001836; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 Global Container Exchange. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Password reset email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return { success: false, error: error.message };
    }
  }

  static async testConnection() {
    try {
      await transporter.verify();
      console.log('Email service connection verified successfully');
      return { success: true };
    } catch (error) {
      console.error('Email service connection failed:', error);
      return { success: false, error: error.message };
    }
  }

  static async sendCampaignEmail(
    email: string, 
    firstName: string, 
    subject: string, 
    content: string,
    options: {
      fromEmail: string;
      fromName: string;
      replyToEmail?: string;
    }
  ) {
    // Enhanced deliverability: personalized content and proper formatting
    const personalizedHtmlContent = content
      .replace(/{{first_name}}/g, firstName || 'Valued Customer')
      .replace(/{{company_name}}/g, 'Global Container Exchange')
      .replace(/{{current_year}}/g, new Date().getFullYear().toString());

    // Create proper text version for better deliverability
    const textContent = personalizedHtmlContent
      .replace(/<[^>]*>/g, '') // Strip HTML tags
      .replace(/&nbsp;/g, ' ')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .trim();

    const mailOptions = {
      from: `"${options.fromName}" <${options.fromEmail}>`,
      to: email,
      replyTo: `"GCE Support" <${options.replyToEmail || options.fromEmail}>`,
      subject: subject,
      headers: {
        'X-Mailer': 'Global Container Exchange Platform v2.0',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'X-Entity-ID': `gce-campaign-${Date.now()}`,
        'Message-ID': `<gce-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@globalcontainerexchange.com>`,
        'List-Unsubscribe': `<mailto:unsubscribe@globalcontainerexchange.com?subject=Unsubscribe>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'Precedence': 'bulk',
        'X-Auto-Response-Suppress': 'All',
        'X-Campaign-Type': 'marketing',
        'Authentication-Results': 'spf=pass smtp.mailfrom=globalcontainerexchange.com',
        'X-SES-Configuration-Set': 'default', // For AWS SES compatibility
        'X-Mailgun-Track': 'yes', // For Mailgun compatibility
      },
      html: this.wrapEmailWithTemplate(personalizedHtmlContent, subject),
      text: textContent
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Campaign email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending campaign email:', error);
      return { success: false, error: error.message };
    }
  }

  // Enhanced email template wrapper for better deliverability
  private static wrapEmailWithTemplate(content: string, subject: string): string {
    return `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
        <!-- Preheader -->
        <div style="display: none; font-size: 1px; color: #fefefe; line-height: 1px; font-family: Arial, sans-serif; max-height: 0; max-width: 0; opacity: 0; overflow: hidden;">
          ${subject} - Global Container Exchange
        </div>
        
        <!-- Header -->
        <div style="background-color: #001836; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">Global Container Exchange</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Your Global Container Trading Partner</p>
        </div>
        
        <!-- Content -->
        <div style="background-color: #f8f9fa; padding: 30px; border-left: 4px solid #42d1bd;">
          ${content}
        </div>
        
        <!-- Footer -->
        <div style="background-color: #001836; color: white; padding: 20px; text-align: center; font-size: 12px; border-radius: 0 0 8px 8px;">
          <p style="margin: 0 0 10px 0;">© ${new Date().getFullYear()} Global Container Exchange. All rights reserved.</p>
          <p style="margin: 0; font-size: 10px; opacity: 0.8;">
            You received this email because you are subscribed to Global Container Exchange updates.<br>
            <a href="mailto:unsubscribe@globalcontainerexchange.com?subject=Unsubscribe" style="color: #42d1bd; text-decoration: underline;">Unsubscribe</a> | 
            <a href="https://globalcontainerexchange.com/privacy" style="color: #42d1bd; text-decoration: underline;">Privacy Policy</a> |
            <a href="https://globalcontainerexchange.com/contact" style="color: #42d1bd; text-decoration: underline;">Contact Us</a>
          </p>
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2);">
            <p style="margin: 0; font-size: 10px; opacity: 0.7;">
              Global Container Exchange<br>
              Email: support@globalcontainerexchange.com<br>
              This email was sent from an authenticated domain with proper SPF, DKIM, and DMARC records.
            </p>
          </div>
        </div>
      </div>
    `;
  }

  // Account setup completion email
  static async sendAccountSetupComplete(email: string, firstName: string, accountDetails: any) {
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com';
    
    const mailOptions = {
      from: `"Global Container Exchange" <${fromEmail}>`,
      to: email,
      replyTo: `"GCE Support" <${fromEmail}>`,
      subject: 'Account Setup Complete - Global Container Exchange',
      headers: {
        'X-Mailer': 'Global Container Exchange Platform v2.0',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'X-Entity-ID': `gce-setup-${Date.now()}`,
        'Message-ID': `<gce-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@globalcontainerexchange.com>`,
        'List-Unsubscribe': `<mailto:unsubscribe@globalcontainerexchange.com?subject=Unsubscribe>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'Precedence': 'bulk'
      },
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #001836; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Account Setup Complete</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-left: 4px solid #42d1bd;">
            <h2 style="color: #001836; margin-top: 0;">Welcome ${firstName}!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Your Global Container Exchange account has been successfully set up and is ready to use.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #42d1bd; margin-top: 0;">Account Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Email:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${email}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Account Type:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${accountDetails.accountType || 'Standard'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Setup Date:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date().toLocaleDateString()}</td>
                </tr>
              </table>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://globalcontainerexchange.com" style="background-color: #42d1bd; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Access Your Account
              </a>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you have any questions about your account, please contact us at 
              <a href="mailto:support@globalcontainerexchange.com" style="color: #42d1bd;">support@globalcontainerexchange.com</a>
            </p>
          </div>
          
          <div style="background-color: #001836; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 Global Container Exchange. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Account setup email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending account setup email:', error);
      return { success: false, error: error.message };
    }
  }

  // Payment confirmation email
  static async sendPaymentConfirmation(email: string, firstName: string, paymentDetails: any) {
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com';
    
    const mailOptions = {
      from: `"Global Container Exchange" <${fromEmail}>`,
      to: email,
      replyTo: `"GCE Support" <${fromEmail}>`,
      subject: `Payment Confirmed - Global Container Exchange #${paymentDetails.paymentId}`,
      headers: {
        'X-Mailer': 'Global Container Exchange Platform v2.0',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'X-Entity-ID': `gce-payment-${Date.now()}`,
        'Message-ID': `<gce-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@globalcontainerexchange.com>`
      },
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #001836; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Payment Confirmed</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-left: 4px solid #42d1bd;">
            <h2 style="color: #001836; margin-top: 0;">Thank you ${firstName}!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Your payment has been successfully processed and confirmed.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #42d1bd; margin-top: 0;">Payment Details:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Payment ID:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">#${paymentDetails.paymentId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Amount:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">$${paymentDetails.amount}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Payment Date:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${new Date().toLocaleDateString()}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Method:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${paymentDetails.method || 'Credit Card'}</td>
                </tr>
              </table>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              This payment receipt has been automatically generated. Keep this email for your records.
              If you have any questions, please contact us at 
              <a href="mailto:support@globalcontainerexchange.com" style="color: #42d1bd;">support@globalcontainerexchange.com</a>
            </p>
          </div>
          
          <div style="background-color: #001836; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 Global Container Exchange. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Payment confirmation email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending payment confirmation email:', error);
      return { success: false, error: error.message };
    }
  }

  // Shipping notification email
  static async sendShippingNotification(email: string, firstName: string, shippingDetails: any) {
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com';
    
    const mailOptions = {
      from: `"Global Container Exchange" <${fromEmail}>`,
      to: email,
      replyTo: `"GCE Support" <${fromEmail}>`,
      subject: `Your Container is on the Way - Order #${shippingDetails.orderId}`,
      headers: {
        'X-Mailer': 'Global Container Exchange Platform v2.0',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'X-Entity-ID': `gce-shipping-${Date.now()}`,
        'Message-ID': `<gce-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@globalcontainerexchange.com>`
      },
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #001836; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Container Shipment Update</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-left: 4px solid #42d1bd;">
            <h2 style="color: #001836; margin-top: 0;">Hi ${firstName}!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              Great news! Your container has shipped and is on its way to you.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #42d1bd; margin-top: 0;">Shipping Information:</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Order ID:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">#${shippingDetails.orderId}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Shipping Method:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${shippingDetails.method || 'Tilt-bed Delivery'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Estimated Delivery:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${shippingDetails.estimatedDelivery || '3-5 business days'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;"><strong>Delivery Address:</strong></td>
                  <td style="padding: 8px; border-bottom: 1px solid #eee;">${shippingDetails.address || 'Your specified address'}</td>
                </tr>
              </table>
            </div>
            
            <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; color: #1976d2; font-weight: bold;">📞 Delivery Coordination</p>
              <p style="margin: 5px 0 0 0; color: #333; font-size: 14px;">
                Our delivery team will contact you 24 hours before delivery to coordinate the best time and location.
              </p>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              Questions about your delivery? Contact us at 
              <a href="mailto:support@globalcontainerexchange.com" style="color: #42d1bd;">support@globalcontainerexchange.com</a>
              or call us at <strong>1-(249) 879-0355</strong>
            </p>
          </div>
          
          <div style="background-color: #001836; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 Global Container Exchange. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Shipping notification email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending shipping notification email:', error);
      return { success: false, error: error.message };
    }
  }

  // Password setup email for new free membership users
  static async sendPasswordSetupEmail(email: string, membershipTier: string, resetToken: string) {
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com';
    const deployedDomain = '9d8cbae9-2167-4e97-a518-f323da28b168-00-28hsn0hosvaj2.riker.replit.dev';
    const baseUrl = `https://${deployedDomain}`;
    const setupUrl = `${baseUrl}/set-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
    
    const tierDisplayName = membershipTier.charAt(0).toUpperCase() + membershipTier.slice(1);
    
    const mailOptions = {
      from: `"Global Container Exchange" <${fromEmail}>`,
      to: email,
      replyTo: `"GCE Support" <${fromEmail}>`,
      subject: `Set Your Password - ${tierDisplayName} Membership Activated`,
      headers: {
        'X-Mailer': 'Global Container Exchange Platform v2.0',
        'X-Priority': '3',
        'X-MSMail-Priority': 'Normal',
        'X-Entity-ID': `gce-password-setup-${Date.now()}`,
        'Message-ID': `<gce-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@globalcontainerexchange.com>`,
        'List-Unsubscribe': `<mailto:unsubscribe@globalcontainerexchange.com?subject=Unsubscribe>`,
        'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        'Precedence': 'bulk',
        'Content-Type': 'text/html; charset=UTF-8',
        'MIME-Version': '1.0'
      },
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Set Your Password - Global Container Exchange</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f7fa;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
            
            <div style="background: linear-gradient(135deg, #001836 0%, #42d1bd 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 600;">Welcome to Global Container Exchange</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Your ${tierDisplayName} membership is ready!</p>
            </div>
            
            <div style="padding: 40px 30px; background-color: #ffffff;">
              <h2 style="color: #001836; margin-top: 0; font-size: 22px;">Set Your Password to Get Started</h2>
              
              <p style="font-size: 16px; line-height: 1.6; color: #444; margin-bottom: 25px;">
                Congratulations! You've been granted complimentary access to our <strong>${tierDisplayName}</strong> membership tier. 
                To access your account, please set your password by clicking the button below.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${setupUrl}" class="cta-button" style="background: linear-gradient(135deg, #42d1bd 0%, #001836 100%); color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 4px 10px rgba(66, 209, 189, 0.3); transition: all 0.3s ease;">Set Your Password</a>
              </div>
              
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #42d1bd; margin: 25px 0;">
                <h3 style="color: #42d1bd; margin-top: 0; font-size: 18px;">Your Login Details:</h3>
                <p style="margin: 5px 0; color: #666;"><strong>Email (Username):</strong> ${email}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Membership Tier:</strong> ${tierDisplayName}</p>
                <p style="margin: 5px 0; color: #666;"><strong>Status:</strong> Active</p>
              </div>
              
              <p style="color: #666; font-size: 14px; line-height: 1.5; margin-top: 25px;">
                <strong>Getting Started:</strong>
              </p>
              <ol style="color: #666; font-size: 14px; line-height: 1.5; padding-left: 20px;">
                <li>Click "Set Your Password" to create your account password</li>
                <li>Use your email address (${email}) as your username</li>
                <li>Log in to access your ${tierDisplayName} membership features</li>
                <li>Contact support if you need assistance getting started</li>
              </ol>
              
              <div style="background-color: #e3f2fd; padding: 15px; border-radius: 5px; margin: 25px 0;">
                <p style="margin: 0; color: #1976d2; font-weight: bold;">🔒 Security Note</p>
                <p style="margin: 5px 0 0 0; color: #333; font-size: 14px;">
                  This password setup link will expire in 24 hours. If you need a new link, please contact our support team.
                </p>
              </div>
              
              <p style="color: #666; font-size: 14px; margin-top: 30px;">
                Questions or need help? Contact our support team at 
                <a href="mailto:support@globalcontainerexchange.com" style="color: #42d1bd; text-decoration: none;">support@globalcontainerexchange.com</a>
                or call us at <strong>1-(249) 879-0355</strong>
              </p>
            </div>
           
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Global Container Exchange | support@globalcontainerexchange.com | 1-(249) 879-0355<br>
                <a href="mailto:unsubscribe@globalcontainerexchange.com" style="color: #6b7280; text-decoration: none;">Unsubscribe</a> | 
                <a href="https://globalcontainerexchange.com/privacy" style="color: #6b7280; text-decoration: none;">Privacy Policy</a>
              </p>
            </div>
          </div>
        </body>
        </html>
     `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Password setup email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending password setup email:', error);
      return { success: false, error: error.message };
    }
  }

  // Customer alert email (price changes, new inventory, etc.)
  static async sendCustomerAlert(email: string, firstName: string, alertDetails: any) {
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com';
    
    const mailOptions = {
      from: `"Global Container Exchange" <${fromEmail}>`,
      to: email,
      replyTo: `"GCE Support" <${fromEmail}>`,
      subject: `Alert: ${alertDetails.subject} - Global Container Exchange`,
      headers: {
        'X-Mailer': 'Global Container Exchange Platform v2.0',
        'X-Priority': alertDetails.priority === 'high' ? '1' : '3',
        'X-MSMail-Priority': alertDetails.priority === 'high' ? 'High' : 'Normal',
        'X-Entity-ID': `gce-alert-${Date.now()}`,
        'Message-ID': `<gce-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@globalcontainerexchange.com>`
      },
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: ${alertDetails.priority === 'high' ? '#d32f2f' : '#001836'}; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">${alertDetails.priority === 'high' ? '🚨 ' : ''}${alertDetails.subject}</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-left: 4px solid #42d1bd;">
            <h2 style="color: #001836; margin-top: 0;">Hi ${firstName}!</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              ${alertDetails.message}
            </p>
            
            ${alertDetails.details ? `
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #42d1bd; margin-top: 0;">Details:</h3>
              <div style="color: #555; line-height: 1.6;">
                ${alertDetails.details}
              </div>
            </div>
            ` : ''}
            
            ${alertDetails.action ? `
            <div style="text-align: center; margin: 30px 0;">
              <a href="${alertDetails.actionUrl || 'https://globalcontainerexchange.com'}" style="background-color: #42d1bd; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                ${alertDetails.action}
              </a>
            </div>
            ` : ''}
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              This is an automated alert from Global Container Exchange. 
              If you have any questions, please contact us at 
              <a href="mailto:support@globalcontainerexchange.com" style="color: #42d1bd;">support@globalcontainerexchange.com</a>
            </p>
          </div>
          
          <div style="background-color: #001836; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 Global Container Exchange. All rights reserved.</p>
            <p style="margin: 5px 0 0 0;">
              <a href="mailto:unsubscribe@globalcontainerexchange.com?subject=Unsubscribe%20Alerts" style="color: #42d1bd;">Unsubscribe from alerts</a>
            </p>
          </div>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Customer alert email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending customer alert email:', error);
      return { success: false, error: error.message };
    }
  }

  // Test email endpoint for development
  static async sendTestEmail(to: string, subject: string = 'Test Email') {
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com';
    
    const mailOptions = {
      from: `"Global Container Exchange" <${fromEmail}>`,
      to,
      subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background-color: #001836; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0; font-size: 24px;">Test Email from GCE</h1>
          </div>
          
          <div style="background-color: #f8f9fa; padding: 30px; border-left: 4px solid #42d1bd;">
            <h2 style="color: #001836; margin-top: 0;">Email System Test</h2>
            <p style="font-size: 16px; line-height: 1.6; color: #333;">
              This is a test email to verify that the Global Container Exchange email system is working correctly.
            </p>
            
            <div style="background-color: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #42d1bd; margin-top: 0;">System Status:</h3>
              <ul style="color: #555; line-height: 1.8;">
                <li>SMTP Configuration: ✅ Working</li>
                <li>Email Delivery: ✅ Successful</li>
                <li>Authentication: ✅ Verified</li>
                <li>Template Rendering: ✅ Active</li>
              </ul>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              If you received this email, the GCE email system is functioning properly.
            </p>
          </div>
          
          <div style="background-color: #001836; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">© 2025 Global Container Exchange. All rights reserved.</p>
          </div>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Test email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending test email:', error);
      return { success: false, error: error.message };
    }
  }

  // Comprehensive email testing methods for customer correspondence
  static async sendAccountSetupEmail(to: string, firstName: string, accountDetails: any): Promise<{ success: boolean; error?: string }> {
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com';
    
    const mailOptions = {
      from: `"Global Container Exchange" <${fromEmail}>`,
      to: to,
      subject: "Your Account Setup is Complete - Global Container Exchange",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: #42d1bd; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Account Setup Complete</h1>
          </div>
          <div style="padding: 30px 20px; background: #f8fafc;">
            <h2 style="color: #1e3a8a;">Hello ${firstName}!</h2>
            <p>Your account has been successfully set up with the following details:</p>
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Account Type:</strong> ${accountDetails.accountType}</p>
              <p><strong>Setup Date:</strong> ${accountDetails.setupDate}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://globalcontainerexchange.com/membership" 
                 style="background: #42d1bd; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Access Your Dashboard
              </a>
            </div>
          </div>
          <div style="background: #e5e7eb; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
            © 2025 Global Container Exchange. All rights reserved.
          </div>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async sendPaymentConfirmationEmail(to: string, firstName: string, paymentDetails: any): Promise<{ success: boolean; error?: string }> {
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com';
    
    const mailOptions = {
      from: `"Global Container Exchange" <${fromEmail}>`,
      to: to,
      subject: "Payment Confirmation - Global Container Exchange",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: #10b981; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Payment Confirmed</h1>
          </div>
          <div style="padding: 30px 20px; background: #f8fafc;">
            <h2 style="color: #1e3a8a;">Hello ${firstName}!</h2>
            <p>Your payment has been successfully processed. Here are the details:</p>
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Payment ID:</strong> ${paymentDetails.paymentId}</p>
              <p><strong>Amount:</strong> $${paymentDetails.amount}</p>
              <p><strong>Method:</strong> ${paymentDetails.method}</p>
              <p><strong>Status:</strong> <span style="color: #10b981;">Confirmed</span></p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://globalcontainerexchange.com/membership" 
                 style="background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                View Account
              </a>
            </div>
          </div>
          <div style="background: #e5e7eb; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
            © 2025 Global Container Exchange. All rights reserved.
          </div>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async sendShippingNotificationEmail(to: string, firstName: string, shippingDetails: any): Promise<{ success: boolean; error?: string }> {
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com';
    
    const mailOptions = {
      from: `"Global Container Exchange" <${fromEmail}>`,
      to: to,
      subject: "Shipping Update - Your Container Order",
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: #f59e0b; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Shipping Update</h1>
          </div>
          <div style="padding: 30px 20px; background: #f8fafc;">
            <h2 style="color: #1e3a8a;">Hello ${firstName}!</h2>
            <p>Your container order is being prepared for shipment. Here are the details:</p>
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Order ID:</strong> ${shippingDetails.orderId}</p>
              <p><strong>Shipping Method:</strong> ${shippingDetails.method}</p>
              <p><strong>Estimated Delivery:</strong> ${shippingDetails.estimatedDelivery}</p>
              <p><strong>Delivery Address:</strong> ${shippingDetails.address}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="https://globalcontainerexchange.com" 
                 style="background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                Track Shipment
              </a>
            </div>
          </div>
          <div style="background: #e5e7eb; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
            © 2025 Global Container Exchange. All rights reserved.
          </div>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async sendCustomerAlertEmail(to: string, firstName: string, alertDetails: any): Promise<{ success: boolean; error?: string }> {
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com';
    
    const mailOptions = {
      from: `"Global Container Exchange" <${fromEmail}>`,
      to: to,
      subject: alertDetails.subject,
      html: `
        <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
          <div style="background: #ef4444; color: white; padding: 20px; text-align: center;">
            <h1 style="margin: 0;">Important Alert</h1>
          </div>
          <div style="padding: 30px 20px; background: #f8fafc;">
            <h2 style="color: #1e3a8a;">Hello ${firstName}!</h2>
            <p>${alertDetails.message}</p>
            <div style="background: white; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Priority:</strong> ${alertDetails.priority.toUpperCase()}</p>
              <p><strong>Details:</strong> ${alertDetails.details}</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${alertDetails.actionUrl}" 
                 style="background: #ef4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
                ${alertDetails.action}
              </a>
            </div>
          </div>
          <div style="background: #e5e7eb; padding: 15px; text-align: center; color: #6b7280; font-size: 12px;">
            © 2025 Global Container Exchange. All rights reserved.
          </div>
        </div>
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async sendMembershipIssuedEmail(email: string, membershipTier: string, duration: string, reason: string) {
    const fromEmail = process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com';
    
    const tierDisplayName = membershipTier.charAt(0).toUpperCase() + membershipTier.slice(1);
    const durationDisplay = duration === 'permanent' ? 'Permanent' : `${duration} months`;
    
    const mailOptions = {
      from: `"Global Container Exchange" <${fromEmail}>`,
      to: email,
      replyTo: `"GCE Support" <${fromEmail}>`,
      subject: `Complimentary ${tierDisplayName} Membership Issued - Global Container Exchange`,
      headers: {
        'X-Mailer': 'Global Container Exchange Platform v2.0',
        'X-Priority': '2',
        'X-MSMail-Priority': 'High',
        'X-Entity-ID': `gce-membership-issued-${Date.now()}`,
        'Message-ID': `<gce-${Date.now()}-${Math.random().toString(36).substr(2, 9)}@globalcontainerexchange.com>`,
        'List-Unsubscribe': `<mailto:unsubscribe@globalcontainerexchange.com?subject=Unsubscribe>`,
        'Precedence': 'bulk',
      },
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Complimentary Membership Issued</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; text-align: center; padding: 30px 20px; border-radius: 8px 8px 0 0; }
            .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; }
            .footer { background: #f9fafb; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
            .tier-badge { background: #42d1bd; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; margin: 10px 0; }
            .features { background: #f0f9ff; padding: 20px; border-radius: 6px; margin: 20px 0; }
            .cta-button { background: #42d1bd; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold; margin: 15px 0; }
            .highlight { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 15px 0; }
            ul { padding-left: 20px; }
            li { margin: 8px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🎉 Complimentary Membership Issued</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px;">Welcome to Your Enhanced Global Container Exchange Experience</p>
            </div>
            
            <div class="content">
              <p>Dear Valued Customer,</p>
              
              <p>We're excited to inform you that you've been granted a complimentary <span class="tier-badge">${tierDisplayName} Membership</span> on the Global Container Exchange platform!</p>
              
              <div class="highlight">
                <strong>Membership Details:</strong><br>
                • <strong>Tier:</strong> ${tierDisplayName} Membership<br>
                • <strong>Duration:</strong> ${durationDisplay}<br>
                • <strong>Reason:</strong> ${reason}<br>
                • <strong>Status:</strong> Active immediately
              </div>

              <div class="features">
                <h3 style="color: #1e40af; margin-top: 0;">Your ${tierDisplayName} Membership Includes:</h3>
                ${membershipTier === 'insights' ? `
                  <ul>
                    <li><strong>Real-time Analytics:</strong> Comprehensive performance tracking and container monitoring</li>
                    <li><strong>Market Intelligence:</strong> Industry trends and competitive analysis</li>
                    <li><strong>GPS Tracking:</strong> Live container location and status updates</li>
                    <li><strong>Performance Insights:</strong> Route optimization and efficiency metrics</li>
                  </ul>
                ` : membershipTier === 'expert' ? `
                  <ul>
                    <li><strong>All Insights Features:</strong> Complete analytics and tracking suite</li>
                    <li><strong>Advanced Container Search:</strong> EcommSearchKit discovery tools</li>
                    <li><strong>Route Optimization:</strong> Enhanced logistics planning</li>
                    <li><strong>Priority Support:</strong> Dedicated customer assistance</li>
                  </ul>
                ` : `
                  <ul>
                    <li><strong>Complete Platform Access:</strong> All Insights and Expert features</li>
                    <li><strong>Wholesale Manager:</strong> Bulk pricing and volume discounts</li>
                    <li><strong>Leasing Manager:</strong> Contract administration tools</li>
                    <li><strong>Dedicated Account Manager:</strong> Personal business relationship</li>
                    <li><strong>Priority Processing:</strong> Fast-track order fulfillment</li>
                  </ul>
                `}
              </div>

              <p style="text-align: center;">
                <a href="https://globalcontainerexchange.com/login" class="cta-button">Access Your Membership Dashboard</a>
              </p>

              <p><strong>Getting Started:</strong></p>
              <ol>
                <li>Log in to your Global Container Exchange account</li>
                <li>Navigate to your membership dashboard</li>
                <li>Explore your new ${tierDisplayName} features</li>
                <li>Contact your account manager for personalized assistance</li>
              </ol>

              <p>This complimentary membership recognizes your valuable partnership with Global Container Exchange. We appreciate your business and look forward to supporting your continued success in the container shipping industry.</p>

              <p>If you have any questions about your new membership benefits or need assistance accessing your account, please don't hesitate to contact our support team.</p>

              <p>Best regards,<br>
              <strong>The Global Container Exchange Team</strong></p>
            </div>
            
            <div class="footer">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Global Container Exchange | support@globalcontainerexchange.com | 1-(249) 879-0355<br>
                <a href="mailto:unsubscribe@globalcontainerexchange.com" style="color: #6b7280;">Unsubscribe</a> | 
                <a href="https://globalcontainerexchange.com/privacy" style="color: #6b7280;">Privacy Policy</a>
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Complimentary ${tierDisplayName} Membership Issued - Global Container Exchange

        Dear Valued Customer,

        We're excited to inform you that you've been granted a complimentary ${tierDisplayName} Membership on the Global Container Exchange platform!

        Membership Details:
        • Tier: ${tierDisplayName} Membership
        • Duration: ${durationDisplay}
        • Reason: ${reason}
        • Status: Active immediately

        Your ${tierDisplayName} Membership Includes:
        ${membershipTier === 'insights' ? `
        • Real-time Analytics: Comprehensive performance tracking and container monitoring
        • Market Intelligence: Industry trends and competitive analysis
        • GPS Tracking: Live container location and status updates
        • Performance Insights: Route optimization and efficiency metrics
        ` : membershipTier === 'expert' ? `
        • All Insights Features: Complete analytics and tracking suite
        • Advanced Container Search: EcommSearchKit discovery tools
        • Route Optimization: Enhanced logistics planning
        • Priority Support: Dedicated customer assistance
        ` : `
        • Complete Platform Access: All Insights and Expert features
        • Wholesale Manager: Bulk pricing and volume discounts
        • Leasing Manager: Contract administration tools
        • Dedicated Account Manager: Personal business relationship
        • Priority Processing: Fast-track order fulfillment
        `}

        Getting Started:
        1. Log in to your Global Container Exchange account
        2. Navigate to your membership dashboard
        3. Explore your new ${tierDisplayName} features
        4. Contact your account manager for personalized assistance

        Access your membership: https://globalcontainerexchange.com/login

        This complimentary membership recognizes your valuable partnership with Global Container Exchange. We appreciate your business and look forward to supporting your continued success in the container shipping industry.

        Best regards,
        The Global Container Exchange Team

        ---
        Global Container Exchange
        support@globalcontainerexchange.com
        1-(249) 879-0355
      `
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Membership issued email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Error sending membership issued email:', error);
      return { success: false, error: error.message };
    }
  }
}