import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useEffect, useState } from 'react';
import { 
  UserSubscription, 
  UsageStats, 
  SubscriptionTier, 
  SUBSCRIPTION_FEATURES 
} from '@/types/subscription';
import { revenueCatService } from '@/services/subscriptions/RevenueCatService';
import type { CustomerInfo, PurchasesPackage } from '@/services/subscriptions/RevenueCatService';
import { logger } from '@/utils/logger';

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
    logger.error('Error loading subscription', error as Error);
    return {
      tier: 'free',
      startDate: new Date().toISOString(),
      trialUsed: false,
    };
  }
}

async function loadUserRole(): Promise<'patient' | 'caregiver'> {
  try {
    const stored = await AsyncStorage.getItem('@nexa_user_profile');
    if (stored) {
      const profile = JSON.parse(stored);
      return profile.role || 'patient';
    }
    return 'patient';
  } catch (error) {
    logger.error('Error loading user role', error as Error);
    return 'patient';
  }
}

async function saveSubscription(subscription: UserSubscription): Promise<UserSubscription> {
  try {
    await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(subscription));
    return subscription;
  } catch (error) {
    logger.error('Error saving subscription', error as Error);
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
    logger.error('Error loading usage', error as Error);
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
    logger.error('Error saving usage', error as Error);
    throw error;
  }
}

async function loadOnboardingStatus(): Promise<boolean> {
  try {
    const stored = await AsyncStorage.getItem(ONBOARDING_KEY);
    return stored === 'true';
  } catch (error) {
    logger.error('Error loading onboarding status', error as Error);
    return false;
  }
}

async function saveOnboardingStatus(completed: boolean): Promise<boolean> {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, completed.toString());
    return completed;
  } catch (error) {
    logger.error('Error saving onboarding status', error as Error);
    throw error;
  }
}

async function syncSubscriptionWithRevenueCat(): Promise<UserSubscription> {
  try {
    logger.info('[SubscriptionContext] Syncing with RevenueCat');
    const customerInfo = await revenueCatService.getCustomerInfo();
    
    if (!customerInfo) {
      logger.warn('[SubscriptionContext] No customer info available');
      return await loadSubscription();
    }

    const isPremium = revenueCatService.isPremium(customerInfo);
    
    const subscription: UserSubscription = {
      tier: isPremium ? 'premium' : 'free',
      startDate: new Date().toISOString(),
      trialUsed: customerInfo.entitlements.all['premium']?.isActive === false,
    };

    if (isPremium) {
      const expirationDate = customerInfo.entitlements.active['premium']?.expirationDate;
      if (expirationDate) {
        subscription.expiryDate = expirationDate;
      }
    }

    await saveSubscription(subscription);
    logger.info('[SubscriptionContext] Subscription synced', { tier: subscription.tier });
    
    return subscription;
  } catch (error) {
    logger.error('[SubscriptionContext] Error syncing with RevenueCat', error as Error);
    return await loadSubscription();
  }
}

export const [SubscriptionProvider, useSubscription] = createContextHook(() => {
  const queryClient = useQueryClient();
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);

  useEffect(() => {
    logger.info('[SubscriptionContext] Initializing RevenueCat');
    let unsubscribe: (() => void) | undefined;
    
    const initRevenueCat = async () => {
      try {
        await revenueCatService.initialize();
        const info = await revenueCatService.getCustomerInfo();
        setCustomerInfo(info);
        await syncSubscriptionWithRevenueCat();
        queryClient.invalidateQueries({ queryKey: ['subscription'] });
        
        unsubscribe = revenueCatService.addCustomerInfoUpdateListener((info) => {
          logger.info('[SubscriptionContext] Customer info updated');
          setCustomerInfo(info);
          syncSubscriptionWithRevenueCat().then(() => {
            queryClient.invalidateQueries({ queryKey: ['subscription'] });
          });
        });
      } catch (error) {
        logger.error('[SubscriptionContext] RevenueCat initialization error', error as Error);
      }
    };

    initRevenueCat();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, [queryClient]);

  const subscriptionQuery = useQuery({
    queryKey: ['subscription'],
    queryFn: syncSubscriptionWithRevenueCat,
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

  const purchasePackage = useCallback(async (pkg: PurchasesPackage): Promise<boolean> => {
    try {
      logger.info('[SubscriptionContext] Purchasing package', { 
        packageId: pkg.identifier 
      });
      
      const result = await revenueCatService.purchasePackage(pkg);
      
      if (result?.success) {
        logger.info('[SubscriptionContext] Purchase successful');
        await syncSubscriptionWithRevenueCat();
        queryClient.invalidateQueries({ queryKey: ['subscription'] });
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error('[SubscriptionContext] Purchase error', error as Error);
      return false;
    }
  }, [queryClient]);

  const restorePurchases = useCallback(async (): Promise<boolean> => {
    try {
      logger.info('[SubscriptionContext] Restoring purchases');
      const result = await revenueCatService.restorePurchases();
      
      if (result) {
        logger.info('[SubscriptionContext] Purchases restored');
        await syncSubscriptionWithRevenueCat();
        queryClient.invalidateQueries({ queryKey: ['subscription'] });
        return true;
      }
      
      return false;
    } catch (error) {
      logger.error('[SubscriptionContext] Restore error', error as Error);
      return false;
    }
  }, [queryClient]);

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
    customerInfo,
    canCreateTask,
    canAccessFeature,
    incrementTaskUsage,
    incrementWellnessUsage,
    purchasePackage,
    restorePurchases,
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
    customerInfo,
    canCreateTask,
    canAccessFeature,
    incrementTaskUsage,
    incrementWellnessUsage,
    purchasePackage,
    restorePurchases,
    upgradeToPremium,
    completeOnboarding,
    getRemainingTasks,
    subscriptionQuery.isLoading,
    usageQuery.isLoading,
    onboardingQuery.isLoading,
    roleQuery.isLoading,
  ]);
});
