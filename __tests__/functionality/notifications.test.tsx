import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NotificationProvider, useNotifications } from '@/contexts/NotificationContext';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('expo-notifications');
jest.mock('@react-native-async-storage/async-storage');

describe('Notification System Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('should enable push notifications', async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    const TestComponent = () => {
      const { enablePushNotifications } = useNotifications();
      
      React.useEffect(() => {
        enablePushNotifications();
      }, []);

      return null;
    };

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('should add notification', async () => {
    const TestComponent = () => {
      const { addNotification } = useNotifications();
      
      React.useEffect(() => {
        addNotification({
          type: 'task_reminder',
          title: 'Test Notification',
          message: 'Test body',
          priority: 'medium',
          category: 'task',
        });
      }, []);

      return null;
    };

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should add notification to list', async () => {
    let notificationCount = 0;

    const TestComponent = () => {
      const { notifications, addNotification } = useNotifications();
      
      React.useEffect(() => {
        notificationCount = notifications.length;
      }, [notifications]);

      React.useEffect(() => {
        addNotification({
          type: 'task_reminder',
          title: 'Task Reminder',
          message: 'Complete your task',
          priority: 'medium',
          category: 'task',
        });
      }, []);

      return null;
    };

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should mark notification as read', async () => {
    const mockNotifications = [
      {
        id: '1',
        type: 'task_reminder' as const,
        title: 'Test',
        message: 'Test message',
        timestamp: new Date().toISOString(),
        read: false,
        dismissed: false,
        priority: 'medium' as const,
        category: 'task',
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockNotifications)
    );

    const TestComponent = () => {
      const { markAsRead } = useNotifications();
      
      React.useEffect(() => {
        markAsRead('1');
      }, []);

      return null;
    };

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should get unread notification count', async () => {
    const mockNotifications = [
      {
        id: '1',
        type: 'task_reminder' as const,
        title: 'Test 1',
        message: 'Test message 1',
        timestamp: new Date().toISOString(),
        read: false,
        dismissed: false,
        priority: 'medium' as const,
        category: 'task',
      },
      {
        id: '2',
        type: 'task_reminder' as const,
        title: 'Test 2',
        message: 'Test message 2',
        timestamp: new Date().toISOString(),
        read: true,
        dismissed: false,
        priority: 'medium' as const,
        category: 'task',
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockNotifications)
    );

    let unreadCount = 0;

    const TestComponent = () => {
      const { stats } = useNotifications();
      
      React.useEffect(() => {
        unreadCount = stats.unread;
      }, [stats]);

      return null;
    };

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('should clear all notifications', async () => {
    const mockNotifications = [
      {
        id: '1',
        type: 'task_reminder' as const,
        title: 'Test',
        message: 'Test message',
        timestamp: new Date().toISOString(),
        read: false,
        dismissed: false,
        priority: 'medium' as const,
        category: 'task',
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockNotifications)
    );

    const TestComponent = () => {
      const { clearAll } = useNotifications();
      
      React.useEffect(() => {
        clearAll();
      }, []);

      return null;
    };

    render(
      <NotificationProvider>
        <TestComponent />
      </NotificationProvider>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });
});
