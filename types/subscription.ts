export type SubscriptionTier = 'free' | 'premium' | 'lifetime';

export interface SubscriptionFeatures {
  maxTasks: number;
  maxTasksPerDay: number;
  aiBreakdown: boolean;
  caregiverMode: boolean;
  advancedAnalytics: boolean;
  customReminders: boolean;
  prioritySupport: boolean;
  offlineMode: boolean;
  exportData: boolean;
  unlimitedWellness: boolean;
  premiumResources: boolean;
}

export interface UserSubscription {
  tier: SubscriptionTier;
  startDate: string;
  expiryDate?: string;
  trialUsed: boolean;
  trialEndDate?: string;
}

export interface UsageStats {
  tasksCreatedToday: number;
  totalTasks: number;
  lastResetDate: string;
  aiBreakdownsUsed: number;
  wellnessSessionsToday: number;
}

export const SUBSCRIPTION_FEATURES: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    maxTasks: 5,
    maxTasksPerDay: 3,
    aiBreakdown: true,
    caregiverMode: false,
    advancedAnalytics: false,
    customReminders: false,
    prioritySupport: false,
    offlineMode: false,
    exportData: false,
    unlimitedWellness: false,
    premiumResources: false,
  },
  premium: {
    maxTasks: -1,
    maxTasksPerDay: -1,
    aiBreakdown: true,
    caregiverMode: true,
    advancedAnalytics: true,
    customReminders: true,
    prioritySupport: true,
    offlineMode: true,
    exportData: true,
    unlimitedWellness: true,
    premiumResources: true,
  },
  lifetime: {
    maxTasks: -1,
    maxTasksPerDay: -1,
    aiBreakdown: true,
    caregiverMode: true,
    advancedAnalytics: true,
    customReminders: true,
    prioritySupport: true,
    offlineMode: true,
    exportData: true,
    unlimitedWellness: true,
    premiumResources: true,
  },
};

export interface PricingPlan {
  id: string;
  tier: SubscriptionTier;
  name: string;
  price: number;
  period: 'month' | 'year' | 'lifetime';
  description: string;
  features: string[];
  popular?: boolean;
  savings?: string;
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'free',
    tier: 'free',
    name: 'Free',
    price: 0,
    period: 'month',
    description: 'Get started with basic features',
    features: [
      'Up to 5 tasks',
      '3 new tasks per day',
      'AI task breakdown',
      'Basic wellness exercises',
      'Community support',
    ],
  },
  {
    id: 'premium-monthly',
    tier: 'premium',
    name: 'Premium',
    price: 9.99,
    period: 'month',
    description: 'Full access to all features',
    features: [
      'Unlimited tasks',
      'Caregiver mode',
      'Advanced analytics',
      'Custom reminders',
      'Priority support',
      'Offline mode',
      'Export your data',
      'Premium wellness content',
      'Mental health resources',
    ],
    popular: true,
  },
  {
    id: 'premium-yearly',
    tier: 'premium',
    name: 'Premium Annual',
    price: 79.99,
    period: 'year',
    description: 'Save 33% with annual billing',
    features: [
      'Everything in Premium',
      'Save $40 per year',
      'Priority feature requests',
      'Early access to new features',
    ],
    savings: 'Save 33%',
  },
  {
    id: 'lifetime',
    tier: 'lifetime',
    name: 'Lifetime',
    price: 199.99,
    period: 'lifetime',
    description: 'One-time payment, forever access',
    features: [
      'Everything in Premium',
      'Lifetime updates',
      'VIP support',
      'Exclusive community access',
      'Shape the future of NeuroNexa',
    ],
  },
];
