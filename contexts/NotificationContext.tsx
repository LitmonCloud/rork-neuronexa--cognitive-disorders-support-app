import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { AppNotification, NotificationPreferences, NotificationStats, NotificationType, NotificationPriority } from '@/types/notification';

const NOTIFICATIONS_KEY = '@neuronexa_notifications';
const PREFERENCES_KEY = '@neuronexa_notification_preferences';
const PUSH_TOKEN_KEY = '@neuronexa_push_token';

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  taskReminders: true,
  taskUpdates: true,
  wellnessAlerts: true,
  achievements: true,
  caregiverMessages: true,
  systemNotifications: true,
  soundEnabled: true,
  vibrationEnabled: true,
  quietHoursEnabled: false,
  pushNotificationsEnabled: false,
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

async function loadNotifications(): Promise<AppNotification[]> {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    const notifications = stored ? JSON.parse(stored) : [];
    const now = new Date();
    return notifications.filter((n: AppNotification) => 
      !n.expiresAt || new Date(n.expiresAt) > now
    );
  } catch (error) {
    console.error('[NotificationContext] Error loading notifications:', error);
    return [];
  }
}

async function saveNotifications(notifications: AppNotification[]): Promise<AppNotification[]> {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    await Notifications.setBadgeCountAsync(
      notifications.filter(n => !n.read && !n.dismissed).length
    );
    return notifications;
  } catch (error) {
    console.error('[NotificationContext] Error saving notifications:', error);
    throw error;
  }
}

async function loadPreferences(): Promise<NotificationPreferences> {
  try {
    const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
    return stored ? { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) } : DEFAULT_PREFERENCES;
  } catch (error) {
    console.error('[NotificationContext] Error loading preferences:', error);
    return DEFAULT_PREFERENCES;
  }
}

async function savePreferences(preferences: NotificationPreferences): Promise<NotificationPreferences> {
  try {
    await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
    return preferences;
  } catch (error) {
    console.error('[NotificationContext] Error saving preferences:', error);
    throw error;
  }
}

async function registerForPushNotificationsAsync(): Promise<string | null> {
  if (!Device.isDevice) {
    console.log('[NotificationContext] Push notifications only work on physical devices');
    return null;
  }

  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('[NotificationContext] Permission not granted for push notifications');
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    
    const token = tokenData.data;
    await AsyncStorage.setItem(PUSH_TOKEN_KEY, token);
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    console.log('[NotificationContext] Push token:', token);
    return token;
  } catch (error) {
    console.error('[NotificationContext] Error registering for push notifications:', error);
    return null;
  }
}

export const [NotificationProvider, useNotifications] = createContextHook(() => {
  const queryClient = useQueryClient();
  const notificationListener = useRef<Notifications.Subscription | undefined>(undefined);
  const responseListener = useRef<Notifications.Subscription | undefined>(undefined);

  const notificationsQuery = useQuery({
    queryKey: ['notifications'],
    queryFn: loadNotifications,
  });

  const preferencesQuery = useQuery({
    queryKey: ['notification-preferences'],
    queryFn: loadPreferences,
  });

  const saveNotificationsMutation = useMutation({
    mutationFn: saveNotifications,
    onSuccess: (data) => {
      queryClient.setQueryData(['notifications'], data);
    },
  });

  const savePreferencesMutation = useMutation({
    mutationFn: savePreferences,
    onSuccess: (data) => {
      queryClient.setQueryData(['notification-preferences'], data);
    },
  });

  const { mutate: mutateNotifications } = saveNotificationsMutation;
  const { mutate: mutatePreferences } = savePreferencesMutation;
  
  const notifications = useMemo(() => notificationsQuery.data || [], [notificationsQuery.data]);
  const preferences = useMemo(() => preferencesQuery.data || DEFAULT_PREFERENCES, [preferencesQuery.data]);

  useEffect(() => {
    if (preferences.pushNotificationsEnabled && Platform.OS !== 'web') {
      registerForPushNotificationsAsync();

      notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
        console.log('[NotificationContext] Notification received:', notification);
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
        console.log('[NotificationContext] Notification response:', response);
      });

      return () => {
        if (notificationListener.current) {
          Notifications.removeNotificationSubscription(notificationListener.current);
        }
        if (responseListener.current) {
          Notifications.removeNotificationSubscription(responseListener.current);
        }
      };
    }
  }, [preferences.pushNotificationsEnabled]);

  const isInQuietHours = useCallback(() => {
    if (!preferences.quietHoursEnabled || !preferences.quietHoursStart || !preferences.quietHoursEnd) {
      return false;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const [startHour, startMin] = preferences.quietHoursStart.split(':').map(Number);
    const [endHour, endMin] = preferences.quietHoursEnd.split(':').map(Number);
    
    const startTime = startHour * 60 + startMin;
    const endTime = endHour * 60 + endMin;

    if (startTime <= endTime) {
      return currentTime >= startTime && currentTime <= endTime;
    } else {
      return currentTime >= startTime || currentTime <= endTime;
    }
  }, [preferences]);

  const shouldShowNotification = useCallback((type: NotificationType): boolean => {
    if (!preferences.enabled) return false;
    if (isInQuietHours()) return false;

    switch (type) {
      case 'task_created':
      case 'task_updated':
      case 'task_started':
        return preferences.taskUpdates;
      case 'task_reminder':
      case 'task_overdue':
        return preferences.taskReminders;
      case 'breathing_completed':
      case 'wellness_alert':
        return preferences.wellnessAlerts;
      case 'achievement_unlocked':
      case 'streak_milestone':
        return preferences.achievements;
      case 'caregiver_message':
        return preferences.caregiverMessages;
      case 'system':
        return preferences.systemNotifications;
      default:
        return true;
    }
  }, [preferences, isInQuietHours]);

  const addNotification = useCallback(async (
    notification: Omit<AppNotification, 'id' | 'timestamp' | 'read' | 'dismissed'>
  ) => {
    if (!shouldShowNotification(notification.type)) {
      console.log('[NotificationContext] Notification blocked by preferences:', notification.type);
      return null;
    }

    const newNotification: AppNotification = {
      ...notification,
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      read: false,
      dismissed: false,
      sound: notification.sound ?? preferences.soundEnabled,
      vibrate: notification.vibrate ?? preferences.vibrationEnabled,
    };

    console.log('[NotificationContext] Adding notification:', newNotification.title);
    const updated = [newNotification, ...notifications];
    mutateNotifications(updated);

    if (Platform.OS !== 'web' && preferences.pushNotificationsEnabled) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: newNotification.title,
          body: newNotification.message,
          data: { notificationId: newNotification.id, ...newNotification.metadata },
          sound: newNotification.sound,
          priority: newNotification.priority === 'urgent' ? 'high' : 'default',
        },
        trigger: null,
      });
    }

    return newNotification;
  }, [notifications, preferences, shouldShowNotification, mutateNotifications]);

  const markAsRead = useCallback((notificationId: string) => {
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    mutateNotifications(updated);
  }, [notifications, mutateNotifications]);

  const markAllAsRead = useCallback(() => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    mutateNotifications(updated);
  }, [notifications, mutateNotifications]);

  const dismissNotification = useCallback((notificationId: string) => {
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, dismissed: true } : n
    );
    mutateNotifications(updated);
  }, [notifications, mutateNotifications]);

  const deleteNotification = useCallback((notificationId: string) => {
    const updated = notifications.filter(n => n.id !== notificationId);
    mutateNotifications(updated);
  }, [notifications, mutateNotifications]);

  const clearAll = useCallback(() => {
    mutateNotifications([]);
  }, [mutateNotifications]);

  const clearRead = useCallback(() => {
    const updated = notifications.filter(n => !n.read);
    mutateNotifications(updated);
  }, [notifications, mutateNotifications]);

  const updatePreferences = useCallback((updates: Partial<NotificationPreferences>) => {
    const updated = { ...preferences, ...updates };
    mutatePreferences(updated);
  }, [preferences, mutatePreferences]);

  const enablePushNotifications = useCallback(async () => {
    const token = await registerForPushNotificationsAsync();
    if (token) {
      updatePreferences({ pushNotificationsEnabled: true });
      return token;
    }
    return null;
  }, [updatePreferences]);

  const activeNotifications = useMemo(() => 
    notifications.filter(n => !n.dismissed),
    [notifications]
  );

  const unreadNotifications = useMemo(() => 
    activeNotifications.filter(n => !n.read),
    [activeNotifications]
  );

  const stats: NotificationStats = useMemo(() => {
    const byType: Record<string, number> = {};
    const byPriority: Record<string, number> = {};

    activeNotifications.forEach(n => {
      byType[n.type] = (byType[n.type] || 0) + 1;
      byPriority[n.priority] = (byPriority[n.priority] || 0) + 1;
    });

    return {
      total: activeNotifications.length,
      unread: unreadNotifications.length,
      byType: byType as Record<NotificationType, number>,
      byPriority: byPriority as Record<NotificationPriority, number>,
    };
  }, [activeNotifications, unreadNotifications]);

  const getNotificationsByType = useCallback((type: NotificationType) => {
    return activeNotifications.filter(n => n.type === type);
  }, [activeNotifications]);

  const getNotificationsByCategory = useCallback((category: string) => {
    return activeNotifications.filter(n => n.category === category);
  }, [activeNotifications]);

  return useMemo(() => ({
    notifications: activeNotifications,
    unreadNotifications,
    preferences,
    stats,
    isLoading: notificationsQuery.isLoading || preferencesQuery.isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    deleteNotification,
    clearAll,
    clearRead,
    updatePreferences,
    enablePushNotifications,
    getNotificationsByType,
    getNotificationsByCategory,
  }), [
    activeNotifications,
    unreadNotifications,
    preferences,
    stats,
    notificationsQuery.isLoading,
    preferencesQuery.isLoading,
    addNotification,
    markAsRead,
    markAllAsRead,
    dismissNotification,
    deleteNotification,
    clearAll,
    clearRead,
    updatePreferences,
    enablePushNotifications,
    getNotificationsByType,
    getNotificationsByCategory,
  ]);
});
