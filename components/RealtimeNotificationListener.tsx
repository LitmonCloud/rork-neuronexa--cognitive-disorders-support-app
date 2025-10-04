import { useEffect } from 'react';
import { realtimeNotificationService } from '@/services/notifications/RealtimeNotificationService';
import { useNotifications } from '@/contexts/NotificationContext';
import { useCaregivers } from '@/contexts/CaregiverContext';

export function RealtimeNotificationListener() {
  const { addNotification } = useNotifications();
  const { caregivers } = useCaregivers();

  useEffect(() => {
    console.log('[RealtimeNotificationListener] Initializing service');
    realtimeNotificationService.initialize();

    const unsubscribe = realtimeNotificationService.subscribe(
      'global-listener',
      (notification) => {
        console.log('[RealtimeNotificationListener] Received notification:', notification.title);

        if (notification.type === 'task_update' || notification.type === 'patient_update') {
          addNotification({
            type: (notification.data?.notificationType as any) || 'system',
            title: notification.title,
            message: notification.body,
            priority: notification.priority === 'urgent' ? 'urgent' : notification.priority === 'high' ? 'high' : 'medium',
            category: 'task',
            metadata: notification.data,
          });
        }
      }
    );

    return () => {
      console.log('[RealtimeNotificationListener] Cleaning up');
      unsubscribe();
      realtimeNotificationService.cleanup();
    };
  }, [addNotification]);

  useEffect(() => {
    console.log('[RealtimeNotificationListener] Caregivers updated:', caregivers.length);
  }, [caregivers]);

  return null;
}
