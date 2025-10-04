import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const batchSendSchema = z.object({
  recipientIds: z.array(z.string()),
  title: z.string(),
  body: z.string(),
  data: z.record(z.string(), z.any()).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

export const batchSendProcedure = publicProcedure
  .input(batchSendSchema)
  .mutation(async ({ input }) => {
    const { recipientIds, title, body, data, priority } = input;

    console.log('[BatchSend] Sending batch notifications:', {
      recipientCount: recipientIds.length,
      title,
    });

    try {
      const notifications = recipientIds.map((recipientId) => ({
        id: `batch-${Date.now()}-${recipientId}`,
        recipientId,
        title,
        body,
        data,
        priority: priority || 'medium',
        sentAt: new Date().toISOString(),
      }));

      console.log('[BatchSend] Batch notifications created:', notifications.length);

      return {
        success: true,
        notificationIds: notifications.map((n) => n.id),
        message: `Sent ${notifications.length} notifications successfully`,
      };
    } catch (error) {
      console.error('[BatchSend] Failed to send batch notifications:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send batch notifications',
      };
    }
  });
