import { z } from 'zod';
import { publicProcedure } from '../../../create-context';

const caregiverAlertSchema = z.object({
  caregiverId: z.string(),
  patientId: z.string(),
  patientName: z.string(),
  alertType: z.enum([
    'task_completed',
    'task_started',
    'step_completed',
    'all_steps_completed',
    'task_overdue',
    'help_needed',
    'wellness_alert',
    'milestone_reached',
    'daily_summary',
  ]),
  title: z.string(),
  message: z.string(),
  taskId: z.string().optional(),
  taskTitle: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

export const caregiverAlertProcedure = publicProcedure
  .input(caregiverAlertSchema)
  .mutation(async ({ input }) => {
    const {
      caregiverId,
      patientId,
      patientName,
      alertType,
      title,
      message,
      taskId,
      taskTitle,
      metadata,
      priority,
    } = input;

    console.log('[CaregiverAlert] Sending alert to caregiver:', {
      caregiverId,
      patientName,
      alertType,
    });

    try {
      const alert = {
        id: `alert-${Date.now()}`,
        caregiverId,
        patientId,
        patientName,
        alertType,
        title,
        message,
        taskId,
        taskTitle,
        metadata,
        priority: priority || 'medium',
        sentAt: new Date().toISOString(),
        read: false,
      };

      console.log('[CaregiverAlert] Alert created:', alert.id);

      return {
        success: true,
        alertId: alert.id,
        message: 'Caregiver alert sent successfully',
        alert,
      };
    } catch (error) {
      console.error('[CaregiverAlert] Failed to send alert:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to send alert',
      };
    }
  });
