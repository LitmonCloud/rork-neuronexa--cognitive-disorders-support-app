import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useSegments: jest.fn(),
  Stack: ({ children }: any) => children,
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
}));

jest.mock('@/contexts/SubscriptionContext', () => ({
  useSubscription: jest.fn(() => ({
    isLoading: false,
    requiresSubscription: false,
  })),
  SubscriptionProvider: ({ children }: any) => children,
}));

jest.mock('@/contexts/UserProfileContext', () => ({
  useUserProfile: jest.fn(() => ({
    profile: { onboardingCompleted: true, role: 'patient' },
    isLoading: false,
  })),
  UserProfileProvider: ({ children }: any) => children,
}));

describe('Navigation Routing', () => {
  const mockRouter = {
    replace: jest.fn(),
    push: jest.fn(),
    back: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (useSegments as jest.Mock).mockReturnValue(['(tabs)']);
  });

  describe('Terms Agreement Flow', () => {
    it('should redirect to terms-agreement when not accepted', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
      (useSegments as jest.Mock).mockReturnValue(['(tabs)']);

      const { useSubscription } = require('@/contexts/SubscriptionContext');
      const { useUserProfile } = require('@/contexts/UserProfileContext');
      
      useSubscription.mockReturnValue({
        isLoading: false,
        requiresSubscription: false,
      });
      
      useUserProfile.mockReturnValue({
        profile: { onboardingCompleted: true, role: 'patient' },
        isLoading: false,
      });

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/terms-agreement');
      }, { timeout: 10000 });
    }, 15000);

    it('should allow access when terms are accepted', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ accepted: true, timestamp: Date.now() })
      );
      (useSegments as jest.Mock).mockReturnValue(['(tabs)']);

      const { useSubscription } = require('@/contexts/SubscriptionContext');
      const { useUserProfile } = require('@/contexts/UserProfileContext');
      
      useSubscription.mockReturnValue({
        isLoading: false,
        requiresSubscription: false,
      });
      
      useUserProfile.mockReturnValue({
        profile: { onboardingCompleted: true, role: 'patient' },
        isLoading: false,
      });

      await waitFor(() => {
        expect(mockRouter.replace).not.toHaveBeenCalled();
      }, { timeout: 2000 });
    });
  });

  describe('Onboarding Flow', () => {
    it('should redirect to onboarding when not completed', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ accepted: true, timestamp: Date.now() })
      );
      (useSegments as jest.Mock).mockReturnValue(['(tabs)']);

      const { useSubscription } = require('@/contexts/SubscriptionContext');
      const { useUserProfile } = require('@/contexts/UserProfileContext');
      
      useSubscription.mockReturnValue({
        isLoading: false,
        requiresSubscription: false,
      });
      
      useUserProfile.mockReturnValue({
        profile: { onboardingCompleted: false, role: 'patient' },
        isLoading: false,
      });

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/onboarding');
      }, { timeout: 10000 });
    }, 15000);
  });

  describe('Caregiver Routes', () => {
    it('should allow caregiver access to caregiver routes', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ accepted: true, timestamp: Date.now() })
      );
      (useSegments as jest.Mock).mockReturnValue(['caregiver-dashboard']);

      const { useSubscription } = require('@/contexts/SubscriptionContext');
      const { useUserProfile } = require('@/contexts/UserProfileContext');
      
      useSubscription.mockReturnValue({
        isLoading: false,
        requiresSubscription: false,
      });
      
      useUserProfile.mockReturnValue({
        profile: { onboardingCompleted: true, role: 'caregiver' },
        isLoading: false,
      });

      await waitFor(() => {
        expect(mockRouter.replace).not.toHaveBeenCalled();
      }, { timeout: 2000 });
    });

    it('should block patient from caregiver routes', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ accepted: true, timestamp: Date.now() })
      );
      (useSegments as jest.Mock).mockReturnValue(['caregiver-dashboard']);

      const { useSubscription } = require('@/contexts/SubscriptionContext');
      const { useUserProfile } = require('@/contexts/UserProfileContext');
      
      useSubscription.mockReturnValue({
        isLoading: false,
        requiresSubscription: false,
      });
      
      useUserProfile.mockReturnValue({
        profile: { onboardingCompleted: true, role: 'patient' },
        isLoading: false,
      });

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)');
      }, { timeout: 10000 });
    }, 15000);
  });

  describe('Subscription Paywall', () => {
    it('should redirect caregiver to paywall when subscription required', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
        JSON.stringify({ accepted: true, timestamp: Date.now() })
      );
      (useSegments as jest.Mock).mockReturnValue(['caregiver-dashboard']);

      const { useSubscription } = require('@/contexts/SubscriptionContext');
      const { useUserProfile } = require('@/contexts/UserProfileContext');
      
      useSubscription.mockReturnValue({
        isLoading: false,
        requiresSubscription: true,
      });
      
      useUserProfile.mockReturnValue({
        profile: { onboardingCompleted: true, role: 'caregiver' },
        isLoading: false,
      });

      await waitFor(() => {
        expect(mockRouter.replace).toHaveBeenCalledWith('/paywall');
      }, { timeout: 10000 });
    }, 15000);
  });

  describe('Loading States', () => {
    it('should show loading indicator while initializing', async () => {
      (AsyncStorage.getItem as jest.Mock).mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve(null), 100))
      );

      const { useSubscription } = require('@/contexts/SubscriptionContext');
      const { useUserProfile } = require('@/contexts/UserProfileContext');
      
      useSubscription.mockReturnValue({
        isLoading: true,
        requiresSubscription: false,
      });
      
      useUserProfile.mockReturnValue({
        profile: null,
        isLoading: true,
      });

      expect(mockRouter.replace).not.toHaveBeenCalled();
    });
  });
});
