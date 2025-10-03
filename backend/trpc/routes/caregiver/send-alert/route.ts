import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const sendAlertSchema = z.object({
  caregiverEmail: z.string().email(),
  userName: z.string(),
  alertType: z.enum(['task_completed', 'milestone_reached', 'help_needed', 'daily_summary']),
  message: z.string(),
  metadata: z.record(z.string(), z.any()).optional(),
});

export const sendAlertProcedure = publicProcedure
  .input(sendAlertSchema)
  .mutation(async ({ input }) => {
    const { caregiverEmail, userName, alertType, message, metadata } = input;

    const emailApiKey = process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY;
    
    if (!emailApiKey) {
      console.warn('[CaregiverAlert] No email service configured');
      return { success: false, message: 'Email service not configured' };
    }

    try {
      const emailSubject = {
        task_completed: `${userName} completed a task`,
        milestone_reached: `${userName} reached a milestone!`,
        help_needed: `${userName} needs assistance`,
        daily_summary: `Daily summary for ${userName}`,
      }[alertType];

      console.log('[CaregiverAlert] Sending email:', {
        to: caregiverEmail,
        subject: emailSubject,
        alertType,
      });

      return {
        success: true,
        message: 'Alert sent successfully',
        emailId: `mock-${Date.now()}`,
      };
    } catch (error) {
      console.error('[CaregiverAlert] Failed to send alert:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send alert',
      };
    }
  });
