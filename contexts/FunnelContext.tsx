import createContextHook from '@nkzw/create-context-hook';
import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  FunnelStep, 
  FunnelEvent, 
  FunnelMetrics, 
  UserJourneyStage,
  ConversionTrigger,
  TooltipConfig 
} from '@/types/funnel';

const FUNNEL_STORAGE_KEY = '@nexa_funnel_metrics';
const SESSION_ID_KEY = '@nexa_session_id';

function generateSessionId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function calculateUserStage(metrics: FunnelMetrics): UserJourneyStage {
  const daysSinceActive = (Date.now() - metrics.lastActiveAt) / (1000 * 60 * 60 * 24);
  
  if (daysSinceActive > 14) return 'dormant';
  if (daysSinceActive > 7) return 'at_risk';
  
  if (metrics.tasksCompleted >= 50 && metrics.breathingSessions >= 20) return 'power_user';
  if (metrics.tasksCompleted >= 10 && metrics.breathingSessions >= 5) return 'engaged';
  if (metrics.tasksCompleted >= 1 || metrics.breathingSessions >= 1) return 'activated';
  
  return 'new';
}

export const [FunnelProvider, useFunnel] = createContextHook(() => {
  const [metrics, setMetrics] = useState<FunnelMetrics>({
    userId: 'anonymous',
    stage: 'new',
    completedSteps: [],
    lastActiveAt: Date.now(),
    daysActive: 0,
    tasksCompleted: 0,
    breathingSessions: 0,
    coachInteractions: 0,
    hasSeenPaywall: false,
    paywallViews: 0,
    isPremium: false,
    conversionTriggers: [],
    dismissedTooltips: [],
    streakDays: 0,
  });

  const [sessionId, setSessionId] = useState<string>('');
  const [events, setEvents] = useState<FunnelEvent[]>([]);
  const [activeTooltip, setActiveTooltip] = useState<TooltipConfig | null>(null);

  const loadMetrics = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(FUNNEL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setMetrics(parsed);
      }
    } catch (error) {
      console.error('Failed to load funnel metrics:', error);
    }
  }, []);

  const saveMetrics = useCallback(async () => {
    try {
      await AsyncStorage.setItem(FUNNEL_STORAGE_KEY, JSON.stringify(metrics));
    } catch (error) {
      console.error('Failed to save funnel metrics:', error);
    }
  }, [metrics]);

  const initSession = useCallback(async () => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    await AsyncStorage.setItem(SESSION_ID_KEY, newSessionId);
  }, []);

  useEffect(() => {
    loadMetrics();
    initSession();
  }, [loadMetrics, initSession]);

  useEffect(() => {
    saveMetrics();
  }, [saveMetrics]);

  const trackStep = useCallback((step: FunnelStep, metadata?: Record<string, any>) => {
    console.log('📊 Funnel Step:', step, metadata);

    const event: FunnelEvent = {
      step,
      timestamp: Date.now(),
      metadata,
      sessionId,
    };

    setEvents(prev => [...prev, event]);

    setMetrics(prev => {
      const updated = {
        ...prev,
        completedSteps: prev.completedSteps.includes(step) 
          ? prev.completedSteps 
          : [...prev.completedSteps, step],
        lastActiveAt: Date.now(),
      };

      if (step === 'first_task_complete') updated.tasksCompleted++;
      if (step === 'breathing_complete_session') updated.breathingSessions++;
      if (step === 'coach_first_interaction') updated.coachInteractions++;
      if (step === 'paywall_view') {
        updated.hasSeenPaywall = true;
        updated.paywallViews++;
      }
      if (step === 'paywall_convert') updated.isPremium = true;

      updated.stage = calculateUserStage(updated);

      return updated;
    });
  }, [sessionId]);

  const trackConversionTrigger = useCallback((trigger: ConversionTrigger) => {
    setMetrics(prev => ({
      ...prev,
      conversionTriggers: [...prev.conversionTriggers, trigger],
    }));
  }, []);

  const dismissTooltip = useCallback((tooltipId: string) => {
    setMetrics(prev => ({
      ...prev,
      dismissedTooltips: [...prev.dismissedTooltips, tooltipId],
    }));
    setActiveTooltip(null);
  }, []);

  const shouldShowTooltip = useCallback((tooltip: TooltipConfig): boolean => {
    if (metrics.dismissedTooltips.includes(tooltip.id)) return false;
    if (tooltip.showAfterStep && !metrics.completedSteps.includes(tooltip.showAfterStep)) {
      return false;
    }
    return true;
  }, [metrics]);

  const updateStreak = useCallback(() => {
    const today = new Date().toDateString();
    const lastStreak = metrics.lastStreakDate;

    if (lastStreak === today) return;

    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    const isConsecutive = lastStreak === yesterday;

    setMetrics(prev => ({
      ...prev,
      streakDays: isConsecutive ? prev.streakDays + 1 : 1,
      lastStreakDate: today,
    }));

    if (isConsecutive && (metrics.streakDays + 1) % 7 === 0) {
      trackStep('streak_milestone', { days: metrics.streakDays + 1 });
    }
  }, [metrics, trackStep]);

  const getConversionReadiness = useCallback((): number => {
    let score = 0;
    
    if (metrics.tasksCompleted >= 5) score += 20;
    if (metrics.breathingSessions >= 3) score += 20;
    if (metrics.coachInteractions >= 2) score += 15;
    if (metrics.streakDays >= 3) score += 15;
    if (metrics.paywallViews >= 2) score += 10;
    if (metrics.stage === 'engaged' || metrics.stage === 'power_user') score += 20;

    return Math.min(score, 100);
  }, [metrics]);

  const shouldShowPaywall = useCallback((context: 'feature_limit' | 'value_demo' | 'achievement'): boolean => {
    if (metrics.isPremium) return false;
    
    const readiness = getConversionReadiness();
    
    if (context === 'feature_limit' && readiness >= 40) return true;
    if (context === 'value_demo' && readiness >= 60) return true;
    if (context === 'achievement' && readiness >= 80) return true;
    
    return false;
  }, [metrics, getConversionReadiness]);

  return useMemo(() => ({
    metrics,
    sessionId,
    events,
    activeTooltip,
    trackStep,
    trackConversionTrigger,
    dismissTooltip,
    shouldShowTooltip,
    setActiveTooltip,
    updateStreak,
    getConversionReadiness,
    shouldShowPaywall,
  }), [
    metrics,
    sessionId,
    events,
    activeTooltip,
    trackStep,
    trackConversionTrigger,
    dismissTooltip,
    shouldShowTooltip,
    updateStreak,
    getConversionReadiness,
    shouldShowPaywall,
  ]);
});
