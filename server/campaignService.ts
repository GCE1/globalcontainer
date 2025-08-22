import { EmailService } from './emailService';
import { 
  emailCampaigns, 
  emailTemplates, 
  campaignRecipients, 
  emailAnalytics, 
  emailSubscribers,
  users,
  userRoles,
  type EmailCampaign,
  type InsertEmailCampaign,
  type EmailTemplate,
  type InsertEmailTemplate,
  type CampaignRecipient,
  type InsertCampaignRecipient
} from '../shared/schema';
import { db } from './db';
import { eq, and, inArray, sql } from 'drizzle-orm';

export class CampaignService {
  // Create a new email campaign
  static async createCampaign(campaignData: Omit<InsertEmailCampaign, 'createdBy'>, userId: number): Promise<EmailCampaign> {
    // For new_recipients, start with 0 count as recipients will be added manually
    const recipientCount = campaignData.audience === 'new_recipients' ? 0 : await this.getAudienceCount(campaignData.audience);
    
    const [campaign] = await db
      .insert(emailCampaigns)
      .values({
        ...campaignData,
        recipientCount,
        createdBy: userId
      })
      .returning();
    
    return campaign;
  }

  // Update an existing campaign
  static async updateCampaign(campaignId: number, updates: Partial<InsertEmailCampaign>): Promise<EmailCampaign | null> {
    const [updated] = await db
      .update(emailCampaigns)
      .set({
        ...updates,
        updatedAt: sql`NOW()`
      })
      .where(eq(emailCampaigns.id, campaignId))
      .returning();
    
    return updated || null;
  }

  // Delete a campaign
  static async deleteCampaign(campaignId: number): Promise<boolean> {
    // Delete related recipients and analytics first
    await db.delete(campaignRecipients).where(eq(campaignRecipients.campaignId, campaignId));
    await db.delete(emailAnalytics).where(eq(emailAnalytics.campaignId, campaignId));
    
    const result = await db
      .delete(emailCampaigns)
      .where(eq(emailCampaigns.id, campaignId));
    
    return (result.rowCount || 0) > 0;
  }

  // Get all campaigns
  static async getCampaigns(limit = 50, offset = 0): Promise<EmailCampaign[]> {
    const campaigns = await db
      .select()
      .from(emailCampaigns)
      .limit(limit)
      .offset(offset)
      .orderBy(sql`${emailCampaigns.createdAt} DESC`);
    
    return campaigns;
  }

  // Get campaign by ID
  static async getCampaignById(campaignId: number): Promise<EmailCampaign | null> {
    const [campaign] = await db
      .select()
      .from(emailCampaigns)
      .where(eq(emailCampaigns.id, campaignId));
    
    return campaign || null;
  }

  // Send a campaign
  static async sendCampaign(campaignId: number): Promise<{ success: boolean; sentCount: number; failedCount: number }> {
    const campaign = await this.getCampaignById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // Allow re-sending campaigns for testing purposes
    // Only block if campaign is currently in the process of sending
    if (campaign.status === 'sending') {
      throw new Error('Campaign is currently being sent. Please wait for completion.');
    }

    // Update campaign status to sending
    await this.updateCampaign(campaignId, { status: 'sending' });

    // Check if there are existing recipients (manual or already added)
    let existingRecipients = await db
      .select()
      .from(campaignRecipients)
      .where(eq(campaignRecipients.campaignId, campaignId));

    // If no recipients exist, try to get from audience (except for new_recipients which are manually added)
    if (existingRecipients.length === 0 && campaign.audience !== 'new_recipients') {
      const audienceRecipients = await this.getAudienceRecipients(campaign.audience, campaignId);
      
      if (audienceRecipients.length > 0) {
        // Create recipient records from audience
        const recipientData: InsertCampaignRecipient[] = audienceRecipients.map(recipient => ({
          campaignId,
          userId: recipient.userId,
          email: recipient.email,
          status: 'pending'
        }));

        existingRecipients = await db
          .insert(campaignRecipients)
          .values(recipientData)
          .returning();
      }
    }

    const insertedRecipients = existingRecipients;
    
    if (insertedRecipients.length === 0) {
      // Update status back to draft since we can't send
      await this.updateCampaign(campaignId, { status: 'draft' });
      const message = campaign.audience === 'new_recipients' 
        ? 'No recipients found. Please add recipients manually using the Recipient Manager below.'
        : 'No recipients found for the selected audience. Please choose a different audience or add recipients manually.';
      throw new Error(message);
    }

    // Send emails in batches
    let sentCount = 0;
    let failedCount = 0;
    const batchSize = 10; // Send 10 emails at a time to avoid overwhelming SMTP

    for (let i = 0; i < insertedRecipients.length; i += batchSize) {
      const batch = insertedRecipients.slice(i, i + batchSize);
      
      await Promise.allSettled(
        batch.map(async (recipient) => {
          try {
            // For manual recipients, use a default name or try to find user info
            const userName = recipient.userId ? 
              (await db.select({ firstName: users.firstName })
                .from(users)
                .where(eq(users.id, recipient.userId))
                .then(rows => rows[0]?.firstName)) || 'Valued Customer'
              : 'Valued Customer';
            
            // Send the email
            const result = await EmailService.sendCampaignEmail(
              recipient.email,
              userName,
              campaign.subject,
              campaign.htmlContent || campaign.plainTextContent || '',
              {
                fromEmail: campaign.fromEmail,
                fromName: campaign.fromName,
                replyToEmail: campaign.replyToEmail
              }
            );

            if (result.success) {
              // Update recipient status
              await db
                .update(campaignRecipients)
                .set({ 
                  status: 'sent', 
                  sentAt: new Date() 
                })
                .where(eq(campaignRecipients.id, recipient.id));
              
              // Log analytics event
              await db
                .insert(emailAnalytics)
                .values({
                  campaignId,
                  recipientId: recipient.id,
                  eventType: 'sent'
                });
              
              sentCount++;
            } else {
              // Update recipient status with failure
              await db
                .update(campaignRecipients)
                .set({ 
                  status: 'failed', 
                  failureReason: result.error || 'Unknown error' 
                })
                .where(eq(campaignRecipients.id, recipient.id));
              
              failedCount++;
            }
          } catch (error) {
            console.error(`Failed to send email to ${recipient.email}:`, error);
            failedCount++;
          }
        })
      );

      // Small delay between batches
      if (i + batchSize < insertedRecipients.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    // Update campaign with final statistics
    await this.updateCampaign(campaignId, {
      status: 'sent',
      sentAt: new Date(),
      emailsSent: sentCount
    });

    return { success: true, sentCount, failedCount };
  }

  // Get audience count for targeting
  private static async getAudienceCount(audience: string, campaignId?: number): Promise<number> {
    let query;
    
    switch (audience) {
      case 'new_recipients':
        if (campaignId) {
          query = db
            .select({ count: sql`COUNT(*)` })
            .from(campaignRecipients)
            .where(eq(campaignRecipients.campaignId, campaignId));
        } else {
          return 0; // No campaign ID means no manually added recipients yet
        }
        break;
        
      case 'all_users':
        query = db.select({ count: sql`COUNT(*)` }).from(users);
        break;
        
      case 'active_customers':
        query = db
          .select({ count: sql`COUNT(DISTINCT ${users.id})` })
          .from(users)
          .innerJoin(userRoles, eq(users.id, userRoles.userId))
          .where(eq(userRoles.subscriptionStatus, 'active'));
        break;
        
      case 'new_customers':
        query = db
          .select({ count: sql`COUNT(*)` })
          .from(users)
          .where(sql`${users.createdAt} >= NOW() - INTERVAL '30 days'`);
        break;
        
      case 'subscribers':
        query = db
          .select({ count: sql`COUNT(*)` })
          .from(emailSubscribers)
          .where(eq(emailSubscribers.status, 'active'));
        break;
        
      default:
        query = db.select({ count: sql`COUNT(*)` }).from(users);
    }
    
    const [result] = await query;
    return Number(result.count);
  }

  // Get recipients for specific audience
  private static async getAudienceRecipients(audience: string, campaignId?: number): Promise<Array<{ userId: number; email: string; firstName?: string }>> {
    let query;
    
    switch (audience) {
      case 'new_recipients':
        if (campaignId) {
          // Return manually added recipients for this campaign
          const recipients = await db
            .select({
              userId: campaignRecipients.userId,
              email: campaignRecipients.email,
              firstName: sql<string>`NULL` // Manual recipients don't have firstName from users table
            })
            .from(campaignRecipients)
            .where(eq(campaignRecipients.campaignId, campaignId));
          return recipients.map(r => ({ 
            userId: r.userId || 0, 
            email: r.email, 
            firstName: undefined 
          }));
        } else {
          return []; // No campaign ID means no manually added recipients
        }
        
      case 'all_users':
        query = db
          .select({
            userId: users.id,
            email: users.email,
            firstName: users.firstName
          })
          .from(users)
          .where(sql`${users.email} IS NOT NULL`);
        break;
        
      case 'active_customers':
        query = db
          .selectDistinct({
            userId: users.id,
            email: users.email,
            firstName: users.firstName
          })
          .from(users)
          .innerJoin(userRoles, eq(users.id, userRoles.userId))
          .where(and(
            eq(userRoles.subscriptionStatus, 'active'),
            sql`${users.email} IS NOT NULL`
          ));
        break;
        
      case 'new_customers':
        query = db
          .select({
            userId: users.id,
            email: users.email,
            firstName: users.firstName
          })
          .from(users)
          .where(and(
            sql`${users.createdAt} >= NOW() - INTERVAL '30 days'`,
            sql`${users.email} IS NOT NULL`
          ));
        break;
        
      case 'subscribers':
        query = db
          .select({
            userId: sql<number>`0`, // Default for email-only subscribers
            email: emailSubscribers.email,
            firstName: emailSubscribers.firstName
          })
          .from(emailSubscribers)
          .where(eq(emailSubscribers.status, 'active'));
        break;
        
      default:
        query = db
          .select({
            userId: users.id,
            email: users.email,
            firstName: users.firstName
          })
          .from(users)
          .where(sql`${users.email} IS NOT NULL`);
    }
    
    const results = await query;
    return results.map(r => ({
      userId: r.userId,
      email: r.email,
      firstName: r.firstName || undefined
    }));
  }

  // Template Management
  static async createTemplate(templateData: Omit<InsertEmailTemplate, 'createdBy'>, userId: number): Promise<EmailTemplate> {
    const [template] = await db
      .insert(emailTemplates)
      .values({
        ...templateData,
        createdBy: userId
      })
      .returning();
    
    return template;
  }

  static async getTemplates(): Promise<EmailTemplate[]> {
    return await db
      .select()
      .from(emailTemplates)
      .where(eq(emailTemplates.isActive, true))
      .orderBy(sql`${emailTemplates.createdAt} DESC`);
  }

  static async getTemplateById(templateId: number): Promise<EmailTemplate | null> {
    const [template] = await db
      .select()
      .from(emailTemplates)
      .where(eq(emailTemplates.id, templateId));
    
    return template || null;
  }

  // Validate email format
  private static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Recipient Management
  static async addRecipientsToCampaign(campaignId: number, emails: string[]): Promise<void> {
    const campaign = await this.getCampaignById(campaignId);
    if (!campaign) {
      throw new Error('Campaign not found');
    }

    // Remove duplicates and validate emails
    const uniqueEmails = [...new Set(emails)];
    const validEmails = uniqueEmails.filter(email => this.isValidEmail(email));
    
    if (validEmails.length === 0) {
      throw new Error('No valid email addresses provided');
    }

    // Check for existing users with these emails
    const existingUsers = await db
      .select({ id: users.id, email: users.email })
      .from(users)
      .where(inArray(users.email, validEmails));

    const userEmailMap = new Map(existingUsers.map(user => [user.email, user.id]));

    // Prepare recipient data
    const recipientData: InsertCampaignRecipient[] = validEmails.map(email => ({
      campaignId,
      userId: userEmailMap.get(email) || 0, // Use 0 for manually added recipients without user accounts
      email,
      status: 'pending'
    }));

    // Insert recipients (ignore duplicates)
    try {
      await db.insert(campaignRecipients).values(recipientData);
      
      // Get current recipient count from database
      const currentCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(campaignRecipients)
        .where(eq(campaignRecipients.campaignId, campaignId));
      
      // Update campaign recipient count with actual count
      await db
        .update(emailCampaigns)
        .set({ 
          recipientCount: currentCount[0]?.count || 0,
          updatedAt: new Date()
        })
        .where(eq(emailCampaigns.id, campaignId));
        
    } catch (error) {
      // Handle duplicate entries gracefully
      console.error('Error adding recipients to campaign:', error);
      
      // Still try to update the count accurately
      const currentCount = await db
        .select({ count: sql<number>`count(*)` })
        .from(campaignRecipients)
        .where(eq(campaignRecipients.campaignId, campaignId));
      
      await db
        .update(emailCampaigns)
        .set({ 
          recipientCount: currentCount[0]?.count || 0,
          updatedAt: new Date()
        })
        .where(eq(emailCampaigns.id, campaignId));
    }
  }

  static async getCampaignRecipients(campaignId: number): Promise<CampaignRecipient[]> {
    return await db
      .select()
      .from(campaignRecipients)
      .where(eq(campaignRecipients.campaignId, campaignId))
      .orderBy(sql`${campaignRecipients.createdAt} DESC`);
  }

  static async removeRecipientsFromCampaign(campaignId: number, emails: string[]): Promise<void> {
    await db
      .delete(campaignRecipients)
      .where(and(
        eq(campaignRecipients.campaignId, campaignId),
        inArray(campaignRecipients.email, emails)
      ));
  }

  // Campaign Analytics
  static async getCampaignAnalytics(campaignId: number): Promise<{
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
    bounced: number;
    unsubscribed: number;
    openRate: number;
    clickRate: number;
    bounceRate: number;
  }> {
    const analytics = await db
      .select({
        eventType: emailAnalytics.eventType,
        count: sql`COUNT(*)`.as('count')
      })
      .from(emailAnalytics)
      .where(eq(emailAnalytics.campaignId, campaignId))
      .groupBy(emailAnalytics.eventType);

    const stats = {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      bounced: 0,
      unsubscribed: 0,
      openRate: 0,
      clickRate: 0,
      bounceRate: 0
    };

    analytics.forEach(stat => {
      const count = Number(stat.count);
      switch (stat.eventType) {
        case 'sent':
          stats.sent = count;
          break;
        case 'delivered':
          stats.delivered = count;
          break;
        case 'opened':
          stats.opened = count;
          break;
        case 'clicked':
          stats.clicked = count;
          break;
        case 'bounced':
          stats.bounced = count;
          break;
        case 'unsubscribed':
          stats.unsubscribed = count;
          break;
      }
    });

    // Calculate rates
    if (stats.sent > 0) {
      stats.openRate = (stats.opened / stats.sent) * 100;
      stats.clickRate = (stats.clicked / stats.sent) * 100;
      stats.bounceRate = (stats.bounced / stats.sent) * 100;
    }

    return stats;
  }
}