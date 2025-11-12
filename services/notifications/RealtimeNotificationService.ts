import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { trpcClient } from '@/lib/trpc';

const isExpoGo = Constants.appOwnership === 'expo';

export interface RealtimeNotification {
  id: string;
  type: 'caregiver_alert' | 'task_update' | 'patient_update' | 'system';
  title: string;
  body: string;
  data?: Record<string, any>;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
}

class RealtimeNotificationService {
  private listeners: Map<string, (notification: RealtimeNotification) => void> = new Map();
  private notificationSubscription: Notifications.Subscription | null = null;
  private responseSubscription: Notifications.Subscription | null = null;

  async initialize(): Promise<void> {
    if (Platform.OS === 'web') {
      console.log('[RealtimeNotification] Web platform - using local notifications only');
      return Promise.resolve();
    }

    if (isExpoGo) {
      console.log('[RealtimeNotification] Expo Go detected - using local notifications only (SDK 53 limitation)');
    }

    try {
      this.notificationSubscription = Notifications.addNotificationReceivedListener(
        this.handleNotificationReceived
      );

      this.responseSubscription = Notifications.addNotificationResponseReceivedListener(
        this.handleNotificationResponse
      );

      console.log('[RealtimeNotification] Service initialized');
      return Promise.resolve();
    } catch {
      console.log('[RealtimeNotification] Listener setup skipped (Expo Go limitation)');
      return Promise.resolve();
    }
  }

  cleanup() {
    // Defensive cleanup for Expo Go compatibility (SDK 53+ removeNotificationSubscription may not exist)
    if (this.notificationSubscription && typeof Notifications.removeNotificationSubscription === 'function') {
      try {
        Notifications.removeNotificationSubscription(this.notificationSubscription);
        this.notificationSubscription = null;
      } catch (error) {
        console.log('[RealtimeNotification] Notification subscription cleanup skipped:', error);
        this.notificationSubscription = null;
      }
    }

    if (this.responseSubscription && typeof Notifications.removeNotificationSubscription === 'function') {
      try {
        Notifications.removeNotificationSubscription(this.responseSubscription);
        this.responseSubscription = null;
      } catch (error) {
        console.log('[RealtimeNotification] Response subscription cleanup skipped:', error);
        this.responseSubscription = null;
      }
    }

    this.listeners.clear();
    console.log('[RealtimeNotification] Service cleaned up');
  }

  private handleNotificationReceived = (notification: Notifications.Notification) => {
    console.log('[RealtimeNotification] Notification received:', notification);

    const realtimeNotification: RealtimeNotification = {
      id: notification.request.identifier,
      type: (notification.request.content.data?.type as any) || 'system',
      title: notification.request.content.title || '',
      body: notification.request.content.body || '',
      data: notification.request.content.data,
      priority: (notification.request.content.data?.priority as any) || 'medium',
      timestamp: new Date().toISOString(),
    };

    this.notifyListeners(realtimeNotification);
  };

  private handleNotificationResponse = (response: Notifications.NotificationResponse) => {
    console.log('[RealtimeNotification] Notification response:', response);
  };

  private notifyListeners(notification: RealtimeNotification) {
    this.listeners.forEach((listener) => {
      try {
        listener(notification);
      } catch (error) {
        console.error('[RealtimeNotification] Error in listener:', error);
      }
    });
  }

  subscribe(id: string, callback: (notification: RealtimeNotification) => void) {
    this.listeners.set(id, callback);
    console.log('[RealtimeNotification] Listener subscribed:', id);

    return () => {
      this.listeners.delete(id);
      console.log('[RealtimeNotification] Listener unsubscribed:', id);
    };
  }

  async sendCaregiverAlert(params: {
    caregiverId: string;
    patientId: string;
    patientName: string;
    alertType: string;
    title: string;
    message: string;
    taskId?: string;
    taskTitle?: string;
    metadata?: Record<string, any>;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }) {
    try {
      console.log('[RealtimeNotification] Sending caregiver alert:', params.title);

      const result = await trpcClient.notifications.caregiverAlert.mutate({
        caregiverId: params.caregiverId,
        patientId: params.patientId,
        patientName: params.patientName,
        alertType: params.alertType as any,
        title: params.title,
        message: params.message,
        taskId: params.taskId,
        taskTitle: params.taskTitle,
        metadata: params.metadata,
        priority: params.priority,
      });

      if (result.success) {
        console.log('[RealtimeNotification] Caregiver alert sent:', result.alertId);

        if (Platform.OS !== 'web' && !isExpoGo) {
          try {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: params.title,
                body: params.message,
                data: {
                  type: 'caregiver_alert',
                  alertType: params.alertType,
                  caregiverId: params.caregiverId,
                  patientId: params.patientId,
                  taskId: params.taskId,
                  ...params.metadata,
                },
                sound: true,
                priority: params.priority === 'urgent' ? 'high' : 'default',
              },
              trigger: null,
            });
          } catch {
            console.log('[RealtimeNotification] Local notification skipped (Expo Go limitation)');
          }
        }

        return { success: true, alertId: result.alertId };
      }

      return { success: false, error: result.message };
    } catch (error) {
      console.error('[RealtimeNotification] Failed to send caregiver alert:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send alert',
      };
    }
  }

  async sendPushNotification(params: {
    recipientId: string;
    title: string;
    body: string;
    data?: Record<string, any>;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    sound?: boolean;
    badge?: number;
  }) {
    try {
      console.log('[RealtimeNotification] Sending push notification:', params.title);

      const result = await trpcClient.notifications.sendPush.mutate({
        recipientId: params.recipientId,
        title: params.title,
        body: params.body,
        data: params.data,
        priority: params.priority,
        sound: params.sound,
        badge: params.badge,
      });

      if (result.success) {
        console.log('[RealtimeNotification] Push notification sent:', result.notificationId);

        if (Platform.OS !== 'web' && !isExpoGo) {
          try {
            await Notifications.scheduleNotificationAsync({
              content: {
                title: params.title,
                body: params.body,
                data: params.data,
                sound: params.sound ?? true,
                badge: params.badge,
                priority: params.priority === 'urgent' ? 'high' : 'default',
              },
              trigger: null,
            });
          } catch {
            console.log('[RealtimeNotification] Local notification skipped (Expo Go limitation)');
          }
        }

        return { success: true, notificationId: result.notificationId };
      }

      return { success: false, error: result.message };
    } catch (error) {
      console.error('[RealtimeNotification] Failed to send push notification:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send notification',
      };
    }
  }

  async sendBatchNotifications(params: {
    recipientIds: string[];
    title: string;
    body: string;
    data?: Record<string, any>;
    priority?: 'low' | 'medium' | 'high' | 'urgent';
  }) {
    try {
      console.log('[RealtimeNotification] Sending batch notifications:', params.recipientIds.length);

      const result = await trpcClient.notifications.batchSend.mutate({
        recipientIds: params.recipientIds,
        title: params.title,
        body: params.body,
        data: params.data,
        priority: params.priority,
      });

      if (result.success) {
        console.log('[RealtimeNotification] Batch notifications sent:', result.notificationIds?.length || 0);
        return { success: true, notificationIds: result.notificationIds || [] };
      }

      return { success: false, error: result.message };
    } catch (error) {
      console.error('[RealtimeNotification] Failed to send batch notifications:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to send notifications',
      };
    }
  }
}

export const realtimeNotificationService = new RealtimeNotificationService();
