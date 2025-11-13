import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useEffect } from 'react';
import { CaregiverNotification } from '@/types/caregiverNotification';
import { CaregiverInvite, GenerateInviteResult, RedeemInviteResult } from '@/types/caregiverInvite';
import { realtimeNotificationService } from '@/services/notifications/RealtimeNotificationService';

export interface Caregiver {
  id: string;
  name: string;
  phone: string;
  email?: string;
  relationship?: string;
  isPrimary: boolean;
  notificationsEnabled: boolean;
  createdAt: string;
}

const CAREGIVERS_KEY = '@nexa_caregivers';
const NOTIFICATIONS_KEY = '@nexa_caregiver_notifications';
const INVITES_KEY = '@nexa_caregiver_invites';

async function loadCaregivers(): Promise<Caregiver[]> {
  try {
    const stored = await AsyncStorage.getItem(CAREGIVERS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading caregivers:', error);
    return [];
  }
}

async function saveCaregivers(caregivers: Caregiver[]): Promise<Caregiver[]> {
  try {
    await AsyncStorage.setItem(CAREGIVERS_KEY, JSON.stringify(caregivers));
    return caregivers;
  } catch (error) {
    console.error('Error saving caregivers:', error);
    throw error;
  }
}

async function loadNotifications(): Promise<CaregiverNotification[]> {
  try {
    const stored = await AsyncStorage.getItem(NOTIFICATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading notifications:', error);
    return [];
  }
}

async function saveNotifications(notifications: CaregiverNotification[]): Promise<CaregiverNotification[]> {
  try {
    await AsyncStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(notifications));
    return notifications;
  } catch (error) {
    console.error('Error saving notifications:', error);
    throw error;
  }
}

async function loadInvites(): Promise<CaregiverInvite[]> {
  try {
    const stored = await AsyncStorage.getItem(INVITES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading invites:', error);
    return [];
  }
}

async function saveInvites(invites: CaregiverInvite[]): Promise<CaregiverInvite[]> {
  try {
    await AsyncStorage.setItem(INVITES_KEY, JSON.stringify(invites));
    return invites;
  } catch (error) {
    console.error('Error saving invites:', error);
    throw error;
  }
}

export const [CaregiverProvider, useCaregivers] = createContextHook(() => {
  const queryClient = useQueryClient();

  const caregiversQuery = useQuery({
    queryKey: ['caregivers'],
    queryFn: loadCaregivers,
  });

  const saveMutation = useMutation({
    mutationFn: saveCaregivers,
    onSuccess: (data) => {
      queryClient.setQueryData(['caregivers'], data);
    },
  });

  const notificationsQuery = useQuery({
    queryKey: ['caregiver-notifications'],
    queryFn: loadNotifications,
  });

  const saveNotificationsMutation = useMutation({
    mutationFn: saveNotifications,
    onSuccess: (data) => {
      queryClient.setQueryData(['caregiver-notifications'], data);
    },
  });

  const invitesQuery = useQuery({
    queryKey: ['caregiver-invites'],
    queryFn: loadInvites,
  });

  const saveInvitesMutation = useMutation({
    mutationFn: saveInvites,
    onSuccess: (data) => {
      queryClient.setQueryData(['caregiver-invites'], data);
    },
  });

  const { mutate: mutateCaregivers } = saveMutation;
  const { mutate: mutateNotifications } = saveNotificationsMutation;
  const { mutate: mutateInvites } = saveInvitesMutation;
  const caregivers = useMemo(() => caregiversQuery.data || [], [caregiversQuery.data]);
  const notifications = useMemo(() => notificationsQuery.data || [], [notificationsQuery.data]);
  const invites = useMemo(() => invitesQuery.data || [], [invitesQuery.data]);

  const addCaregiver = useCallback((
    name: string,
    phone: string,
    email?: string,
    relationship?: string
  ) => {
    const newCaregiver: Caregiver = {
      id: Date.now().toString(),
      name,
      phone,
      email,
      relationship,
      isPrimary: caregivers.length === 0,
      notificationsEnabled: true,
      createdAt: new Date().toISOString(),
    };

    const updated = [...caregivers, newCaregiver];
    mutateCaregivers(updated);
    return newCaregiver;
  }, [caregivers, mutateCaregivers]);

  const updateCaregiver = useCallback((id: string, updates: Partial<Caregiver>) => {
    const updated = caregivers.map(c =>
      c.id === id ? { ...c, ...updates } : c
    );
    mutateCaregivers(updated);
  }, [caregivers, mutateCaregivers]);

  const deleteCaregiver = useCallback((id: string) => {
    const updated = caregivers.filter(c => c.id !== id);
    mutateCaregivers(updated);
  }, [caregivers, mutateCaregivers]);

  const setPrimaryCaregiver = useCallback((id: string) => {
    const updated = caregivers.map(c => ({
      ...c,
      isPrimary: c.id === id,
    }));
    mutateCaregivers(updated);
  }, [caregivers, mutateCaregivers]);

  const addNotification = useCallback(async (notification: Omit<CaregiverNotification, 'id' | 'timestamp' | 'read'>) => {
    if (caregivers.length === 0 || !caregivers.some(c => c.notificationsEnabled)) {
      console.log('[CaregiverContext] No caregivers with notifications enabled');
      return;
    }

    const newNotification: CaregiverNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    console.log('[CaregiverContext] Adding notification:', newNotification.title);
    const updated = [newNotification, ...notifications];
    mutateNotifications(updated);

    const enabledCaregivers = caregivers.filter(c => c.notificationsEnabled);
    for (const caregiver of enabledCaregivers) {
      await realtimeNotificationService.sendCaregiverAlert({
        caregiverId: caregiver.id,
        patientId: 'current-patient-id',
        patientName: 'Patient',
        alertType: notification.type,
        title: notification.title,
        message: notification.message,
        metadata: notification.metadata,
        priority: notification.severity === 'critical' ? 'urgent' : notification.severity === 'high' ? 'high' : 'medium',
      });
    }
  }, [caregivers, notifications, mutateNotifications]);

  const markNotificationRead = useCallback((notificationId: string) => {
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    mutateNotifications(updated);
  }, [notifications, mutateNotifications]);

  const markAllNotificationsRead = useCallback(() => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    mutateNotifications(updated);
  }, [notifications, mutateNotifications]);

  const clearNotifications = useCallback(() => {
    mutateNotifications([]);
  }, [mutateNotifications]);

  const unreadCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const sendTestAlert = useCallback(async (caregiverId: string): Promise<boolean> => {
    const caregiver = caregivers.find(c => c.id === caregiverId);
    if (!caregiver) return false;

    console.log('[CaregiverContext] Sending test alert to:', caregiver.name);
    
    addNotification({
      type: 'wellness_alert',
      title: 'Test Alert',
      message: `Test alert sent to ${caregiver.name}`,
      severity: 'low',
    });
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return true;
  }, [caregivers, addNotification]);

  const generateInvite = useCallback(async (code: string, expiresAt: Date): Promise<GenerateInviteResult> => {
    try {
      const newInvite: CaregiverInvite = {
        id: Date.now().toString(),
        patientId: 'current-user-id',
        code,
        expiresAt,
        createdAt: new Date(),
      };

      const activeInvites = invites.filter(inv => 
        !inv.redeemedAt && new Date(inv.expiresAt) > new Date()
      );

      const updated = [...activeInvites, newInvite];
      mutateInvites(updated);

      console.log('[CaregiverContext] Generated invite:', code);
      return { success: true, invite: newInvite };
    } catch (error) {
      console.error('[CaregiverContext] Error generating invite:', error);
      return { success: false, error: 'Failed to generate invite' };
    }
  }, [invites, mutateInvites]);

  const redeemInvite = useCallback(async (code: string, caregiverId: string): Promise<RedeemInviteResult> => {
    try {
      const invite = invites.find(inv => inv.code === code);

      if (!invite) {
        return { success: false, error: 'Invalid invite code' };
      }

      if (invite.redeemedAt) {
        return { success: false, error: 'This code has already been used' };
      }

      if (new Date(invite.expiresAt) < new Date()) {
        return { success: false, error: 'This code has expired' };
      }

      const updatedInvite: CaregiverInvite = {
        ...invite,
        redeemedAt: new Date(),
        redeemedBy: caregiverId,
      };

      const updated = invites.map(inv => 
        inv.id === invite.id ? updatedInvite : inv
      );
      mutateInvites(updated);

      console.log('[CaregiverContext] Invite redeemed:', code);
      return { success: true, patientId: invite.patientId };
    } catch (error) {
      console.error('[CaregiverContext] Error redeeming invite:', error);
      return { success: false, error: 'Failed to redeem invite' };
    }
  }, [invites, mutateInvites]);

  const activeInvite = useMemo(() => {
    return invites.find(inv => 
      !inv.redeemedAt && new Date(inv.expiresAt) > new Date()
    );
  }, [invites]);

  useEffect(() => {
    const unsubscribe = realtimeNotificationService.subscribe(
      'caregiver-context',
      (notification) => {
        if (notification.type === 'caregiver_alert') {
          console.log('[CaregiverContext] Received real-time notification:', notification.title);
          
          const caregiverNotification: CaregiverNotification = {
            id: notification.id,
            type: (notification.data?.alertType as any) || 'task_completed',
            title: notification.title,
            message: notification.body,
            timestamp: notification.timestamp,
            read: false,
            severity: notification.priority === 'urgent' ? 'critical' : notification.priority === 'high' ? 'high' : 'medium',
            metadata: notification.data,
          };

          const updated = [caregiverNotification, ...notifications];
          mutateNotifications(updated);
        }
      }
    );

    return () => {
      unsubscribe();
    };
  }, [notifications, mutateNotifications]);

  const sendRealtimeAlert = useCallback(async (params: {
    title: string;
    message: string;
    type: CaregiverNotification['type'];
    severity?: 'low' | 'medium' | 'high' | 'critical';
    taskId?: string;
    taskTitle?: string;
    metadata?: Record<string, any>;
  }) => {
    const enabledCaregivers = caregivers.filter(c => c.notificationsEnabled);
    
    if (enabledCaregivers.length === 0) {
      console.log('[CaregiverContext] No caregivers with notifications enabled');
      return { success: false, error: 'No caregivers available' };
    }

    const results = await Promise.all(
      enabledCaregivers.map((caregiver) =>
        realtimeNotificationService.sendCaregiverAlert({
          caregiverId: caregiver.id,
          patientId: 'current-patient-id',
          patientName: 'Patient',
          alertType: params.type,
          title: params.title,
          message: params.message,
          taskId: params.taskId,
          taskTitle: params.taskTitle,
          metadata: params.metadata,
          priority: params.severity === 'critical' ? 'urgent' : params.severity === 'high' ? 'high' : 'medium',
        })
      )
    );

    const allSuccess = results.every(r => r.success);
    return {
      success: allSuccess,
      sentCount: results.filter(r => r.success).length,
      totalCount: enabledCaregivers.length,
    };
  }, [caregivers]);

  return useMemo(() => ({
    caregivers,
    notifications,
    unreadCount,
    invites,
    activeInvite,
    isLoading: caregiversQuery.isLoading,
    addCaregiver,
    updateCaregiver,
    deleteCaregiver,
    setPrimaryCaregiver,
    sendTestAlert,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    generateInvite,
    redeemInvite,
    sendRealtimeAlert,
  }), [
    caregivers,
    notifications,
    unreadCount,
    invites,
    activeInvite,
    caregiversQuery.isLoading,
    addCaregiver,
    updateCaregiver,
    deleteCaregiver,
    setPrimaryCaregiver,
    sendTestAlert,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    generateInvite,
    redeemInvite,
    sendRealtimeAlert,
  ]);
});
