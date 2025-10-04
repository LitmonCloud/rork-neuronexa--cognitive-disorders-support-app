import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import Constants from 'expo-constants';

const isExpoGo = Constants.appOwnership === 'expo';

if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

class PushNotificationService {
  private expoPushToken: string | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    if (Platform.OS === 'web') {
      console.log('[PushNotifications] Web platform - local notifications only');
      this.isInitialized = true;
      return;
    }

    if (isExpoGo) {
      console.warn('[PushNotifications] Expo Go detected - push notifications disabled in SDK 53. Use development build for full functionality.');
      this.isInitialized = true;
      return;
    }

    if (!Device.isDevice) {
      console.warn('[PushNotifications] Must use physical device for push notifications');
      this.isInitialized = true;
      return;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('[PushNotifications] Permission not granted');
        this.isInitialized = true;
        return;
      }

      const projectId = Constants.expoConfig?.extra?.eas?.projectId;
      if (!projectId) {
        console.warn('[PushNotifications] No project ID found - using local notifications only');
        this.isInitialized = true;
        return;
      }

      const token = await Notifications.getExpoPushTokenAsync({ projectId });
      this.expoPushToken = token.data;
      this.isInitialized = true;
      console.log('[PushNotifications] Initialized successfully. Token:', this.expoPushToken);

      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }
    } catch (error) {
      console.error('[PushNotifications] Initialization failed:', error);
      this.isInitialized = true;
    }
  }

  getToken(): string | null {
    return this.expoPushToken;
  }

  async scheduleTaskReminder(taskId: string, taskTitle: string, date: Date) {
    if (!this.isInitialized) {
      console.warn('[PushNotifications] Not initialized');
      return null;
    }

    if (Platform.OS === 'web') {
      console.log('[PushNotifications] Scheduled notifications not supported on web');
      return null;
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Task Reminder',
          body: `Don't forget: ${taskTitle}`,
          data: { taskId, type: 'task_reminder' },
          sound: true,
        },
        trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date },
      });
      console.log('[PushNotifications] Task reminder scheduled:', id);
      return id;
    } catch (error) {
      console.error('[PushNotifications] Failed to schedule reminder:', error);
      return null;
    }
  }

  async scheduleWellnessReminder(time: Date) {
    if (!this.isInitialized) {
      console.warn('[PushNotifications] Not initialized');
      return null;
    }

    if (Platform.OS === 'web') {
      console.log('[PushNotifications] Scheduled notifications not supported on web');
      return null;
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Time for Wellness',
          body: 'Take a moment to breathe and relax',
          data: { type: 'wellness_reminder' },
          sound: true,
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: time.getHours(),
          minute: time.getMinutes(),
        },
      });
      console.log('[PushNotifications] Wellness reminder scheduled:', id);
      return id;
    } catch (error) {
      console.error('[PushNotifications] Failed to schedule wellness reminder:', error);
      return null;
    }
  }

  async cancelNotification(notificationId: string) {
    if (Platform.OS === 'web') return;
    
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      console.log('[PushNotifications] Notification cancelled:', notificationId);
    } catch (error) {
      console.error('[PushNotifications] Failed to cancel notification:', error);
    }
  }

  async cancelAllNotifications() {
    if (Platform.OS === 'web') return;
    
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      console.log('[PushNotifications] All notifications cancelled');
    } catch (error) {
      console.error('[PushNotifications] Failed to cancel all notifications:', error);
    }
  }

  async sendLocalNotification(title: string, body: string, data?: Record<string, any>) {
    if (!this.isInitialized) {
      console.warn('[PushNotifications] Not initialized');
      return;
    }

    if (Platform.OS === 'web') {
      console.log('[PushNotifications] Local notifications not supported on web');
      return;
    }

    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: true,
        },
        trigger: null,
      });
      console.log('[PushNotifications] Local notification sent');
    } catch (error) {
      console.error('[PushNotifications] Failed to send local notification:', error);
    }
  }
}

export const pushNotifications = new PushNotificationService();
