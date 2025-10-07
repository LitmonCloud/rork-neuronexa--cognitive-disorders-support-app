export type FunnelStep = 
  | 'app_open'
  | 'onboarding_start'
  | 'onboarding_profile'
  | 'onboarding_goals'
  | 'onboarding_patient_type'
  | 'onboarding_preferences'
  | 'onboarding_complete'
  | 'first_task_view'
  | 'first_task_create'
  | 'first_task_complete'
  | 'breathing_discover'
  | 'breathing_first_session'
  | 'breathing_complete_session'
  | 'wellness_discover'
  | 'wellness_first_visit'
  | 'coach_discover'
  | 'coach_first_interaction'
  | 'caregiver_discover'
  | 'caregiver_invite_view'
  | 'caregiver_invite_send'
  | 'paywall_view'
  | 'paywall_premium_tap'
  | 'paywall_convert'
  | 'feature_locked_encounter'
  | 'settings_visit'
  | 'progress_view'
  | 'streak_milestone'
  | 'achievement_unlock';

export type FunnelEvent = {
  step: FunnelStep;
  timestamp: number;
  metadata?: Record<string, any>;
  sessionId: string;
};

export type UserJourneyStage = 
  | 'new'
  | 'activated'
  | 'engaged'
  | 'power_user'
  | 'at_risk'
  | 'dormant';

export type ConversionTrigger = 
  | 'feature_limit'
  | 'value_demonstration'
  | 'social_proof'
  | 'urgency'
  | 'scarcity'
  | 'achievement';

export type TooltipConfig = {
  id: string;
  title: string;
  description: string;
  targetFeature: string;
  priority: number;
  showAfterStep?: FunnelStep;
  showOnlyOnce: boolean;
  delayMs?: number;
};

export type EngagementHook = {
  id: string;
  type: 'streak' | 'achievement' | 'milestone' | 'social' | 'challenge';
  title: string;
  description: string;
  triggerCondition: string;
  reward?: string;
  ctaText: string;
  ctaAction: string;
};

export type RetentionTrigger = {
  id: string;
  type: 'reminder' | 'win_back' | 'feature_highlight' | 'social';
  condition: 'inactive_1d' | 'inactive_3d' | 'inactive_7d' | 'incomplete_onboarding' | 'unused_feature';
  message: string;
  action: string;
  priority: number;
};

export type FunnelMetrics = {
  userId: string;
  stage: UserJourneyStage;
  completedSteps: FunnelStep[];
  lastActiveAt: number;
  daysActive: number;
  tasksCompleted: number;
  breathingSessions: number;
  coachInteractions: number;
  hasSeenPaywall: boolean;
  paywallViews: number;
  isPremium: boolean;
  conversionTriggers: ConversionTrigger[];
  dismissedTooltips: string[];
  streakDays: number;
  lastStreakDate?: string;
};
