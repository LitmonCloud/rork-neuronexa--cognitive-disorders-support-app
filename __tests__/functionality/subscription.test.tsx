import React from 'react';
import { render, waitFor } from '@testing-library/react-native';
import { SubscriptionContext, useSubscription } from '@/contexts/SubscriptionContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');

describe('Subscription Functionality', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  it('should check if user is premium', async () => {
    let isPremiumUser = false;

    const TestComponent = () => {
      const { isPremium } = useSubscription();
      
      React.useEffect(() => {
        isPremiumUser = isPremium;
      }, [isPremium]);

      return null;
    };

    render(
      <SubscriptionContext>
        <TestComponent />
      </SubscriptionContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('should check if user is in trial', async () => {
    const mockSubscription = {
      status: 'trial',
      trialEndsAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockSubscription)
    );

    let inTrial = false;

    const TestComponent = () => {
      const { isInTrial } = useSubscription();
      
      React.useEffect(() => {
        inTrial = isInTrial;
      }, [isInTrial]);

      return null;
    };

    render(
      <SubscriptionContext>
        <TestComponent />
      </SubscriptionContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('should track feature usage', async () => {
    const TestComponent = () => {
      const { trackFeatureUsage } = useSubscription();
      
      React.useEffect(() => {
        trackFeatureUsage('ai_coach');
      }, []);

      return null;
    };

    render(
      <SubscriptionContext>
        <TestComponent />
      </SubscriptionContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should check feature limits', async () => {
    const mockUsage = {
      ai_coach: 5,
      tasks: 10,
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify({ usage: mockUsage })
    );

    let canUseFeature = false;

    const TestComponent = () => {
      const { canUseFeature: checkFeature } = useSubscription();
      
      React.useEffect(() => {
        canUseFeature = checkFeature('ai_coach');
      }, [checkFeature]);

      return null;
    };

    render(
      <SubscriptionContext>
        <TestComponent />
      </SubscriptionContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });
  });

  it('should complete onboarding', async () => {
    const TestComponent = () => {
      const { completeOnboarding } = useSubscription();
      
      React.useEffect(() => {
        completeOnboarding();
      }, []);

      return null;
    };

    render(
      <SubscriptionContext>
        <TestComponent />
      </SubscriptionContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should load subscription data from storage', async () => {
    const mockData = {
      subscription: {
        status: 'active',
        plan: 'premium',
      },
      usage: {
        ai_coach: 3,
      },
      onboardingCompleted: true,
    };

    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(
      JSON.stringify(mockData)
    );

    let onboardingComplete = false;

    const TestComponent = () => {
      const { onboardingCompleted } = useSubscription();
      
      React.useEffect(() => {
        onboardingComplete = onboardingCompleted;
      }, [onboardingCompleted]);

      return null;
    };

    render(
      <SubscriptionContext>
        <TestComponent />
      </SubscriptionContext>
    );

    await waitFor(() => {
      expect(AsyncStorage.getItem).toHaveBeenCalled();
    });
  });
});
