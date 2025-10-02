import { useEffect, useState, useCallback } from 'react';
import { useFunnel } from '@/contexts/FunnelContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { RetentionTrigger } from '@/types/funnel';
import { RETENTION_TRIGGERS } from '@/constants/retentionTriggers';

export function useRetentionManager() {
  const { metrics } = useFunnel();
  const { onboardingCompleted } = useSubscription();
  const [activeRetentionTrigger, setActiveRetentionTrigger] = useState<RetentionTrigger | null>(null);

  const checkRetentionTriggers = useCallback(() => {
    const now = Date.now();
    const daysSinceActive = (now - metrics.lastActiveAt) / (1000 * 60 * 60 * 24);

    const eligibleTriggers = RETENTION_TRIGGERS.filter(trigger => {
      switch (trigger.condition) {
        case 'inactive_1d':
          return daysSinceActive >= 1 && daysSinceActive < 3;
        case 'inactive_3d':
          return daysSinceActive >= 3 && daysSinceActive < 7;
        case 'inactive_7d':
          return daysSinceActive >= 7;
        case 'incomplete_onboarding':
          return !onboardingCompleted;
        case 'unused_feature':
          if (trigger.id === 'unused_breathing') {
            return metrics.breathingSessions === 0 && metrics.tasksCompleted >= 3;
          }
          if (trigger.id === 'unused_coach') {
            return metrics.coachInteractions === 0 && metrics.tasksCompleted >= 5;
          }
          if (trigger.id === 'unused_caregiver') {
            return metrics.tasksCompleted >= 10;
          }
          return false;
        default:
          return false;
      }
    });

    if (eligibleTriggers.length > 0) {
      const highestPriority = eligibleTriggers.sort((a, b) => a.priority - b.priority)[0];
      setActiveRetentionTrigger(highestPriority);
    }
  }, [metrics, onboardingCompleted]);

  useEffect(() => {
    checkRetentionTriggers();
    
    const interval = setInterval(checkRetentionTriggers, 60 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [checkRetentionTriggers]);

  const dismissRetentionTrigger = useCallback(() => {
    setActiveRetentionTrigger(null);
  }, []);

  return {
    activeRetentionTrigger,
    dismissRetentionTrigger,
    checkRetentionTriggers,
  };
}
