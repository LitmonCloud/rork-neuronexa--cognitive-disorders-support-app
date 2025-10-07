import React from 'react';
import { renderHook, act, waitFor } from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubscriptionProvider, useSubscription } from '@/contexts/SubscriptionContext';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      <SubscriptionProvider>{children}</SubscriptionProvider>
    </QueryClientProvider>
  );
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};



describe('SubscriptionContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
  });

  it('should initialize with free tier', async () => {
    const { result } = renderHook(() => useSubscription(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.subscription.tier).toBe('free');
    expect(result.current.isPremium).toBe(false);
  });

  it('should load subscription from storage', async () => {
    const mockSubscription = {
      tier: 'premium',
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 86400000).toISOString(),
      trialUsed: false,
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockSubscription));

    const { result } = renderHook(() => useSubscription(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.subscription.tier).toBe('premium');
    });

    expect(result.current.isPremium).toBe(true);
  });

  it('should handle subscription data', async () => {
    const mockSubscription = {
      tier: 'premium',
      startDate: new Date().toISOString(),
      expiryDate: new Date(Date.now() + 86400000).toISOString(),
      trialUsed: false,
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(JSON.stringify(mockSubscription));

    const { result } = renderHook(() => useSubscription(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.subscription.tier).toBe('premium');
    });

    expect(result.current.isPremium).toBe(true);
  });

  it('should check feature access correctly', async () => {
    const { result } = renderHook(() => useSubscription(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.canAccessFeature('aiBreakdown')).toBe(true);
    expect(result.current.canCreateTask()).toBe(true);
  });

  it('should upgrade to premium', async () => {
    const { result } = renderHook(() => useSubscription(), { wrapper: createWrapper() });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    act(() => {
      result.current.upgradeToPremium('month');
    });

    await waitFor(() => {
      expect(result.current.isPremium).toBe(true);
    });

    expect(result.current.subscription.tier).toBe('premium');
  });
});
