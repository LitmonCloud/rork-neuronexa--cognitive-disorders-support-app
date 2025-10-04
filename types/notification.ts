export type NotificationType = 
  | 'task_created'
  | 'task_completed'
  | 'task_started'
  | 'task_updated'
  | 'task_assigned'
  | 'task_modified'
  | 'task_deleted'
  | 'step_completed'
  | 'all_steps_completed'
  | 'task_overdue'
  | 'task_reminder'
  | 'breathing_completed'
  | 'wellness_alert'
  | 'achievement_unlocked'
  | 'streak_milestone'
  | 'caregiver_message'
  | 'system';

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface NotificationAction {
  id: string;
  label: string;
  action: 'navigate' | 'dismiss' | 'custom';
  route?: string;
  params?: Record<string, any>;
  customHandler?: () => void;
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  priority: NotificationPriority;
  timestamp: string;
  read: boolean;
  dismissed: boolean;
  taskId?: string;
  taskTitle?: string;
  icon?: string;
  actions?: NotificationAction[];
  metadata?: {
    completedSteps?: number;
    totalSteps?: number;
    priority?: string;
    streakDays?: number;
    achievementId?: string;
    caregiverId?: string;
    [key: string]: any;
  };
  expiresAt?: string;
  category?: 'task' | 'wellness' | 'social' | 'achievement' | 'system';
  sound?: boolean;
  vibrate?: boolean;
}

export interface NotificationPreferences {
  enabled: boolean;
  taskReminders: boolean;
  taskUpdates: boolean;
  wellnessAlerts: boolean;
  achievements: boolean;
  caregiverMessages: boolean;
  systemNotifications: boolean;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  quietHoursEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  pushNotificationsEnabled: boolean;
}

export interface NotificationStats {
  total: number;
  unread: number;
  byType: Record<NotificationType, number>;
  byPriority: Record<NotificationPriority, number>;
}
