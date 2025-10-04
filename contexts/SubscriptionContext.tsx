import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';
import { 
  UserSubscription, 
  UsageStats, 
  SubscriptionTier, 
  SUBSCRIPTION_FEATURES 
} from '@/types/subscription';

const SUBSCRIPTION_KEY = '@neuronexa_subscription';
const USAGE_KEY = '@neuronexa_usage';
const ONBOARDING_KEY = '@neuronexa_onboarding_completed';

async function loadSubscription(): Promise<UserSubscription> {
  try {
    const stored = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    const trialEndDate = new Date();
    trialEndDate.setDate(trialEndDate.getDate() + 7);
    
    return {
      tier: 'free',
      startDate: new Date().toISOString(),
      trialUsed: false,
      trialEndDate: trialEndDate.toISOString(),
    };
  } catch (error) {
    console.error('Error loading subscription:', error);
    return {
      tier: 'free',
      startDate: new Date().toISOString(),
      trialUsed: false,
    };
  }
}

async function loadUserRole(): Promise<'patient' | 'caregiver' | undefined> {
  try {
    const stored = await AsyncStorage.getItem('@nexa_user_profile');
    if (stored) {
      const profile = JSON.parse(stored);
      return profile.role;
    }
    return undefined;
  } catch (error) {
    console.error('Error loading user role:', error);
    return undefined;
  }
}

async function saveSubscription(subscription: UserSubscription): Promise<UserSubscription> {
  try {
    await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
    return subscription;
  } catch (error) {
    console.error('Error saving subscription:', error);
    throw error;
  }
}

async function loadUsage(): Promise<UsageStats> {
  try {
    const stored = await AsyncStorage.getItem(USAGE_KEY);
    if (stored) {
      const usage = JSON.parse(stored);
      const today = new Date().toDateString();
      if (usage.lastResetDate !== today) {
        return {
          tasksCreatedToday: 0,
          totalTasks: usage.totalTasks || 0,
          lastResetDate: today,
          aiBreakdownsUsed: 0,
          wellnessSessionsToday: 0,
        };
      }
      return usage;
    }
    return {
      tasksCreatedToday: 0,
      totalTasks: 0,
      lastResetDate: new Date().toDateString(),
      aiBreakdownsUsed: 0,
      wellnessSessionsToday: 0,
    };
  } catch (error) {
    console.error('Error loading usage:', error);
    return {
      tasksCreatedToday: 0,
      totalTasks: 0,
      lastResetDate: new Date().toDateString(),
      aiBreakdownsUsed: 0,
      wellnessSessionsToday: 0,
    };
  }
}

async function saveUsage(usage: UsageStats): Promise<UsageStats> {
  try {
    await AsyncStorage.setItem(USAGE_KEY, JSON.stringify(usage));
    return usage;
  } catch (error) {
    console.error('Error saving usage:', error);
    throw error;
  }
}

async function loadOnboardingStatus(): Promise<boolean> {
  try {
    const stored = await AsyncStorage.getItem(ONBOARDING_KEY);
    return stored === 'true';
  } catch (error) {
    console.error('Error loading onboarding status:', error);
    return false;
  }
}

async function saveOnboardingStatus(completed: boolean): Promise<boolean> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, completed.toString());
    return completed;
  } catch (error) {
    console.error('Error saving onboarding status:', error);
    throw error;
  }
}

export const [SubscriptionProvider, useSubscription] = createContextHook(() => {
  const queryClient = useQueryClient();

  const subscriptionQuery = useQuery({
    queryKey: ['subscription'],
    queryFn: loadSubscription,
  });

  const usageQuery = useQuery({
    queryKey: ['usage'],
    queryFn: loadUsage,
  });

  const onboardingQuery = useQuery({
    queryKey: ['onboarding'],
    queryFn: loadOnboardingStatus,
  });

  const roleQuery = useQuery({
    queryKey: ['userRole'],
    queryFn: loadUserRole,
  });

  const subscriptionMutation = useMutation({
    mutationFn: saveSubscription,
    onSuccess: (data) => {
      queryClient.setQueryData(['subscription'], data);
    },
  });

  const usageMutation = useMutation({
    mutationFn: saveUsage,
    onSuccess: (data) => {
      queryClient.setQueryData(['usage'], data);
    },
  });

  const onboardingMutation = useMutation({
    mutationFn: saveOnboardingStatus,
    onSuccess: (data) => {
      queryClient.setQueryData(['onboarding'], data);
    },
  });

  const { mutate: mutateUsage } = usageMutation;
  const { mutate: mutateSubscription } = subscriptionMutation;
  const { mutate: mutateOnboarding } = onboardingMutation;

  const subscription = useMemo(() => subscriptionQuery.data || {
    tier: 'free' as SubscriptionTier,
    startDate: new Date().toISOString(),
    trialUsed: false,
  }, [subscriptionQuery.data]);

  const usage = useMemo(() => usageQuery.data || {
    tasksCreatedToday: 0,
    totalTasks: 0,
    lastResetDate: new Date().toDateString(),
    aiBreakdownsUsed: 0,
    wellnessSessionsToday: 0,
  }, [usageQuery.data]);

  const onboardingCompleted = useMemo(() => onboardingQuery.data || false, [onboardingQuery.data]);

  const features = useMemo(() => SUBSCRIPTION_FEATURES[subscription.tier], [subscription.tier]);

  const isPremium = useMemo(() => 
    subscription.tier === 'premium',
    [subscription.tier]
  );

  const isInTrial = useMemo(() => {
    const userRole = roleQuery.data;
    if (userRole === 'caregiver') return false;
    if (!subscription.trialEndDate || subscription.trialUsed) return false;
    return new Date(subscription.trialEndDate) > new Date();
  }, [subscription.trialEndDate, subscription.trialUsed, roleQuery.data]);

  const requiresSubscription = useMemo(() => {
    const userRole = roleQuery.data;
    if (userRole === 'caregiver') {
      return !isPremium;
    }
    return false;
  }, [roleQuery.data, isPremium]);

  const canCreateTask = useCallback(() => {
    if (isPremium || isInTrial) return true;
    
    if (features.maxTasks !== -1 && usage.totalTasks >= features.maxTasks) {
      return false;
    }
    
    if (features.maxTasksPerDay !== -1 && usage.tasksCreatedToday >= features.maxTasksPerDay) {
      return false;
    }
    
    return true;
  }, [isPremium, isInTrial, features, usage]);

  const canAccessFeature = useCallback((feature: keyof typeof features) => {
    if (isPremium || isInTrial) return true;
    return features[feature] === true;
  }, [isPremium, isInTrial, features]);

  const incrementTaskUsage = useCallback(() => {
    const today = new Date().toDateString();
    const newUsage: UsageStats = {
      ...usage,
      tasksCreatedToday: usage.lastResetDate === today ? usage.tasksCreatedToday + 1 : 1,
      totalTasks: usage.totalTasks + 1,
      lastResetDate: today,
    };
    mutateUsage(newUsage);
  }, [usage, mutateUsage]);

  const incrementWellnessUsage = useCallback(() => {
    const today = new Date().toDateString();
    const newUsage: UsageStats = {
      ...usage,
      wellnessSessionsToday: usage.lastResetDate === today ? usage.wellnessSessionsToday + 1 : 1,
      lastResetDate: today,
    };
    mutateUsage(newUsage);
  }, [usage, mutateUsage]);

  const upgradeToPremium = useCallback((period: 'month' | 'year') => {
    const newSubscription: UserSubscription = {
      tier: 'premium',
      startDate: new Date().toISOString(),
      expiryDate: period === 'year' ? 
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() :
        new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      trialUsed: true,
    };
    mutateSubscription(newSubscription);
  }, [mutateSubscription]);

  const completeOnboarding = useCallback(() => {
    mutateOnboarding(true);
  }, [mutateOnboarding]);

  const getRemainingTasks = useCallback(() => {
    if (isPremium || isInTrial) return -1;
    
    const dailyRemaining = features.maxTasksPerDay === -1 ? -1 : 
      Math.max(0, features.maxTasksPerDay - usage.tasksCreatedToday);
    
    const totalRemaining = features.maxTasks === -1 ? -1 : 
      Math.max(0, features.maxTasks - usage.totalTasks);
    
    if (dailyRemaining === -1) return totalRemaining;
    if (totalRemaining === -1) return dailyRemaining;
    
    return Math.min(dailyRemaining, totalRemaining);
  }, [isPremium, isInTrial, features, usage]);

  return useMemo(() => ({
    subscription,
    usage,
    features,
    isPremium,
    isInTrial,
    onboardingCompleted,
    requiresSubscription,
    canCreateTask,
    canAccessFeature,
    incrementTaskUsage,
    incrementWellnessUsage,
    upgradeToPremium,
    completeOnboarding,
    getRemainingTasks,
    isLoading: subscriptionQuery.isLoading || usageQuery.isLoading || onboardingQuery.isLoading || roleQuery.isLoading,
  }), [
    subscription,
    usage,
    features,
    isPremium,
    isInTrial,
    onboardingCompleted,
    requiresSubscription,
    canCreateTask,
    canAccessFeature,
    incrementTaskUsage,
    incrementWellnessUsage,
    upgradeToPremium,
    completeOnboarding,
    getRemainingTasks,
    subscriptionQuery.isLoading,
    usageQuery.isLoading,
    onboardingQuery.isLoading,
    roleQuery.isLoading,
  ]);
});
