export type NotificationType = 
  | 'task_created'
  | 'task_completed'
  | 'task_started'
  | 'task_updated'
  | 'step_completed'
  | 'all_steps_completed'
  | 'task_overdue'
  | 'breathing_completed'
  | 'wellness_alert';

export interface CaregiverNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  taskId?: string;
  taskTitle?: string;
  timestamp: string;
  read: boolean;
  severity: 'low' | 'medium' | 'high';
  metadata?: {
    completedSteps?: number;
    totalSteps?: number;
    priority?: string;
    [key: string]: any;
  };
}
