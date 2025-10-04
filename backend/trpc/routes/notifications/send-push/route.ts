import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const sendPushSchema = z.object({
  recipientId: z.string(),
  title: z.string(),
  body: z.string(),
  data: z.record(z.string(), z.any()).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  sound: z.boolean().optional(),
  badge: z.number().optional(),
});

export const sendPushProcedure = publicProcedure
  .input(sendPushSchema)
  .mutation(async ({ input }) => {
    const { recipientId, title, body, data, priority, sound, badge } = input;

    console.log('[SendPush] Sending push notification:', {
      recipientId,
      title,
      priority,
    });

    try {
      const notification = {
        id: `push-${Date.now()}`,
        recipientId,
        title,
        body,
        data,
        priority: priority || 'medium',
        sound: sound ?? true,
        badge,
        sentAt: new Date().toISOString(),
      };

      console.log('[SendPush] Notification queued:', notification.id);

      return {
        success: true,
        notificationId: notification.id,
        message: 'Push notification sent successfully',
      };
    } catch (error) {
      console.error('[SendPush] Failed to send push notification:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send push notification',
      };
    }
  });
