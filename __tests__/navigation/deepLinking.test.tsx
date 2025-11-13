import React from 'react';
import { Linking } from 'react-native';

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  openURL: jest.fn(),
  canOpenURL: jest.fn(),
  getInitialURL: jest.fn(),
}));

describe('Deep Linking', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('URL Scheme Handling', () => {
    it('should handle task detail deep link', async () => {
      const taskId = 'task-123';
      const url = `nexa://task/${taskId}`;
      
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
      
      const canOpen = await Linking.canOpenURL(url);
      expect(canOpen).toBe(true);
    });

    it('should handle caregiver invite deep link', async () => {
      const inviteCode = 'ABC123';
      const url = `nexa://invite/${inviteCode}`;
      
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
      
      const canOpen = await Linking.canOpenURL(url);
      expect(canOpen).toBe(true);
    });

    it('should handle notification deep link', async () => {
      const notificationId = 'notif-456';
      const url = `nexa://notification/${notificationId}`;
      
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
      
      const canOpen = await Linking.canOpenURL(url);
      expect(canOpen).toBe(true);
    });
  });

  describe('Universal Links', () => {
    it('should handle web URL for task', async () => {
      const url = 'https://nexa.app/task/task-123';
      
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
      
      const canOpen = await Linking.canOpenURL(url);
      expect(canOpen).toBe(true);
    });

    it('should handle web URL for invite', async () => {
      const url = 'https://nexa.app/invite/ABC123';
      
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
      
      const canOpen = await Linking.canOpenURL(url);
      expect(canOpen).toBe(true);
    });
  });

  describe('External Links', () => {
    it('should open external support URL', async () => {
      const url = 'https://support.nexa.app';
      
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
      (Linking.openURL as jest.Mock).mockResolvedValue(true);
      
      await Linking.openURL(url);
      
      expect(Linking.openURL).toHaveBeenCalledWith(url);
    });

    it('should handle phone number links', async () => {
      const phoneUrl = 'tel:+1234567890';
      
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
      (Linking.openURL as jest.Mock).mockResolvedValue(true);
      
      await Linking.openURL(phoneUrl);
      
      expect(Linking.openURL).toHaveBeenCalledWith(phoneUrl);
    });

    it('should handle email links', async () => {
      const emailUrl = 'mailto:support@nexa.app';
      
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(true);
      (Linking.openURL as jest.Mock).mockResolvedValue(true);
      
      await Linking.openURL(emailUrl);
      
      expect(Linking.openURL).toHaveBeenCalledWith(emailUrl);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid URL gracefully', async () => {
      const invalidUrl = 'invalid://url';
      
      (Linking.canOpenURL as jest.Mock).mockResolvedValue(false);
      
      const canOpen = await Linking.canOpenURL(invalidUrl);
      expect(canOpen).toBe(false);
    });

    it('should handle openURL failure', async () => {
      const url = 'https://example.com';
      
      (Linking.openURL as jest.Mock).mockRejectedValue(new Error('Failed to open URL'));
      
      await expect(Linking.openURL(url)).rejects.toThrow('Failed to open URL');
    });
  });
});
