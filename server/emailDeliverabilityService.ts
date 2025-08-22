import nodemailer from 'nodemailer';
import { EmailService } from './emailService';

export class EmailDeliverabilityService {
  
  // Test email deliverability and spam score
  static async testEmailDeliverability(testEmail: string) {
    try {
      // Send a comprehensive test email
      const testResult = await EmailService.sendCampaignEmail(
        testEmail,
        'Test User',
        'Email Deliverability Test - Global Container Exchange',
        `
          <h2>Email Deliverability Test</h2>
          <p>This is a test email to verify email deliverability for Global Container Exchange marketing campaigns.</p>
          
          <div style="background-color: #f0f8ff; padding: 15px; border-left: 4px solid #42d1bd; margin: 20px 0;">
            <h3>Test Parameters:</h3>
            <ul>
              <li>✅ SPF Authentication</li>
              <li>✅ DKIM Signing</li>
              <li>✅ Professional HTML Template</li>
              <li>✅ Plain Text Version</li>
              <li>✅ Proper Headers</li>
              <li>✅ Unsubscribe Links</li>
            </ul>
          </div>
          
          <p><strong>Action Required:</strong> Please check where this email landed:</p>
          <ul>
            <li>📬 <strong>Primary Inbox</strong> - Excellent deliverability</li>
            <li>📁 <strong>Promotions Tab</strong> (Gmail) - Good deliverability</li>
            <li>⚠️ <strong>Spam/Junk Folder</strong> - Needs improvement</li>
          </ul>
          
          <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <p><strong>Next Steps if in Spam:</strong></p>
            <ol>
              <li>Add DKIM DNS record to globalcontainerexchange.com</li>
              <li>Configure SPF record for Titan SMTP</li>
              <li>Set up DMARC policy</li>
              <li>Wait 24 hours for DNS propagation</li>
              <li>Retest email delivery</li>
            </ol>
          </div>
          
          <p>For technical support, contact: <a href="mailto:support@globalcontainerexchange.com">support@globalcontainerexchange.com</a></p>
        `,
        {
          fromEmail: process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com',
          fromName: 'Global Container Exchange',
          replyToEmail: process.env.SMTP_FROM_EMAIL || 'support@globalcontainerexchange.com'
        }
      );
      
      return {
        success: testResult.success,
        messageId: testResult.messageId,
        message: 'Deliverability test email sent successfully. Please check your inbox and spam folder.',
        recommendations: this.getDeliverabilityRecommendations()
      };
      
    } catch (error) {
      return {
        success: false,
        error: error.message,
        recommendations: this.getDeliverabilityRecommendations()
      };
    }
  }

  // Get deliverability recommendations
  static getDeliverabilityRecommendations() {
    return {
      critical: [
        'Add DKIM DNS record: titan1._domainkey.globalcontainerexchange.com',
        'Configure SPF record: v=spf1 include:_spf.titan.email ~all',
        'Set up DMARC policy: v=DMARC1; p=quarantine'
      ],
      important: [
        'Use consistent sender name and email address',
        'Maintain good text-to-image ratio in emails',
        'Include clear unsubscribe link in all emails',
        'Monitor bounce rates and remove invalid addresses'
      ],
      optimization: [
        'Warm up domain reputation gradually',
        'Segment email lists for better targeting',
        'A/B test subject lines for engagement',
        'Monitor email metrics with postmaster tools'
      ]
    };
  }

  // Check email authentication status
  static async checkEmailAuthentication() {
    const results = {
      smtp_connection: false,
      dkim_configured: false,
      spf_configured: false,
      dmarc_configured: false,
      recommendations: []
    };

    try {
      // Test SMTP connection
      const connectionTest = await EmailService.testConnection();
      results.smtp_connection = connectionTest.success;
      
      // Check for DKIM private key
      results.dkim_configured = !!process.env.DKIM_PRIVATE_KEY;
      
      // These would need DNS lookup in production
      results.spf_configured = false; // TODO: Implement DNS SPF check
      results.dmarc_configured = false; // TODO: Implement DNS DMARC check
      
      // Generate recommendations
      if (!results.dkim_configured) {
        results.recommendations.push('CRITICAL: Add DKIM DNS record for email authentication');
      }
      if (!results.spf_configured) {
        results.recommendations.push('IMPORTANT: Configure SPF record for sender validation');
      }
      if (!results.dmarc_configured) {
        results.recommendations.push('RECOMMENDED: Set up DMARC policy for domain protection');
      }
      
      return results;
      
    } catch (error) {
      return {
        ...results,
        error: error.message,
        recommendations: ['ERROR: Unable to check email authentication status']
      };
    }
  }

  // Get spam score estimation
  static analyzeEmailContent(subject: string, htmlContent: string, textContent: string) {
    let spamScore = 0;
    const warnings = [];
    const recommendations = [];

    // Subject line analysis
    const spamWords = [
      'free', 'urgent', 'act now', 'limited time', 'click here',
      'buy now', 'special offer', 'guarantee', 'no obligation',
      'winner', 'congratulations', 'amazing', 'incredible'
    ];
    
    const subjectLower = subject.toLowerCase();
    spamWords.forEach(word => {
      if (subjectLower.includes(word)) {
        spamScore += 1;
        warnings.push(`Spam word detected in subject: "${word}"`);
      }
    });

    // Subject length check
    if (subject.length > 60) {
      spamScore += 0.5;
      warnings.push('Subject line is too long (over 60 characters)');
    }

    // Excessive capitalization
    const capsRatio = (subject.match(/[A-Z]/g) || []).length / subject.length;
    if (capsRatio > 0.3) {
      spamScore += 1;
      warnings.push('Excessive capitalization in subject line');
    }

    // HTML content analysis
    if (htmlContent) {
      // Image to text ratio
      const imageCount = (htmlContent.match(/<img/gi) || []).length;
      const textLength = textContent.length;
      
      if (imageCount > 0 && textLength < 100) {
        spamScore += 1;
        warnings.push('Too many images with insufficient text content');
      }

      // External links check
      const externalLinks = (htmlContent.match(/href="http(?!s?:\/\/globalcontainerexchange\.com)/gi) || []).length;
      if (externalLinks > 3) {
        spamScore += 0.5;
        warnings.push('Many external links detected');
      }
    }

    // Generate recommendations based on score
    if (spamScore >= 3) {
      recommendations.push('HIGH RISK: Revise email content to reduce spam indicators');
      recommendations.push('Remove spam trigger words from subject and content');
      recommendations.push('Ensure proper text-to-image ratio');
    } else if (spamScore >= 1.5) {
      recommendations.push('MEDIUM RISK: Consider optimizing content for better deliverability');
      recommendations.push('Review subject line for professional language');
    } else {
      recommendations.push('LOW RISK: Content appears professional and legitimate');
    }

    return {
      spamScore,
      riskLevel: spamScore >= 3 ? 'HIGH' : spamScore >= 1.5 ? 'MEDIUM' : 'LOW',
      warnings,
      recommendations,
      analysis: {
        subjectLength: subject.length,
        capsRatio: Math.round(capsRatio * 100),
        textLength: textContent.length,
        imageCount: htmlContent ? (htmlContent.match(/<img/gi) || []).length : 0
      }
    };
  }

  // Monitor email metrics (placeholder for future implementation)
  static async getEmailMetrics() {
    // TODO: Implement email metrics tracking
    return {
      sent: 0,
      delivered: 0,
      bounced: 0,
      spam_reports: 0,
      inbox_rate: 0,
      spam_rate: 0,
      message: 'Email metrics tracking will be implemented with campaign analytics'
    };
  }
}