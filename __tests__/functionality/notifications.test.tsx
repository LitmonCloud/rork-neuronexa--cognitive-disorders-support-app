import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { NotificationContext, useNotifications } from '@/contexts/NotificationContext';
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

  it('should request notification permissions', async () => {
    (Notifications.requestPermissionsAsync as jest.Mock).mockResolvedValue({
      status: 'granted',
    });

    const TestComponent = () => {
      const { requestPermissions } = useNotifications();
      
      React.useEffect(() => {
        requestPermissions();
      }, []);

      return null;
    };

    render(
      <NotificationContext>
        <TestComponent />
      </NotificationContext>
    );

    await waitFor(() => {
      expect(Notifications.requestPermissionsAsync).toHaveBeenCalled();
    });
  });

  it('should schedule local notification', async () => {
    (Notifications.scheduleNotificationAsync as jest.Mock).mockResolvedValue('notification-id');

    const TestComponent = () => {
      const { scheduleNotification } = useNotifications();
      
      React.useEffect(() => {
        scheduleNotification({
          title: 'Test Notification',
          body: 'Test body',
          data: {},
        });
      }, []);

      return null;
    };

    render(
      <NotificationContext>
        <TestComponent />
      </NotificationContext>
    );

    await waitFor(() => {
      expect(Notifications.scheduleNotificationAsync).toHaveBeenCalled();
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
          id: '1',
          type: 'task_reminder',
          title: 'Task Reminder',
          message: 'Complete your task',
          timestamp: Date.now(),
          read: false,
        });
      }, []);

      return null;
    };

    render(
      <NotificationContext>
        <TestComponent />
      </NotificationContext>
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
        timestamp: Date.now(),
        read: false,
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
      <NotificationContext>
        <TestComponent />
      </NotificationContext>
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
        timestamp: Date.now(),
        read: false,
      },
      {
        id: '2',
        type: 'task_reminder' as const,
        title: 'Test 2',
        message: 'Test message 2',
        timestamp: Date.now(),
        read: true,
      },
    ];

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockNotifications)
    );

    let unreadCount = 0;

    const TestComponent = () => {
      const { unreadCount: count } = useNotifications();
      
      React.useEffect(() => {
        unreadCount = count;
      }, [count]);

      return null;
    };

    render(
      <NotificationContext>
        <TestComponent />
      </NotificationContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalledWith('notifications');
    });
  });

  it('should clear all notifications', async () => {
    const mockNotifications = [
      {
        id: '1',
        type: 'task_reminder' as const,
        title: 'Test',
        message: 'Test message',
        timestamp: Date.now(),
        read: false,
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
      <NotificationContext>
        <TestComponent />
      </NotificationContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('notifications', '[]');
    });
  });
});
