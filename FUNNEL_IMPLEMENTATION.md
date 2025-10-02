# User Funneling System - Implementation Guide

## Overview
A comprehensive user funneling system has been implemented to improve conversion, retention, and engagement in NeuroNexa.

## Components Implemented

### 1. **Funnel Analytics & Tracking** (`contexts/FunnelContext.tsx`)
- Tracks user journey through 30+ funnel steps
- Calculates user stage (new, activated, engaged, power_user, at_risk, dormant)
- Monitors conversion readiness score (0-100)
- Tracks streaks, tasks completed, breathing sessions, coach interactions
- Persistent storage with AsyncStorage

**Key Functions:**
- `trackStep(step, metadata)` - Track funnel events
- `trackConversionTrigger(trigger)` - Log conversion opportunities
- `getConversionReadiness()` - Calculate user's readiness to convert
- `shouldShowPaywall(context)` - Smart paywall timing
- `updateStreak()` - Manage daily streaks

### 2. **Onboarding Funnel** (`app/onboarding.tsx`)
- 4-step onboarding with progress tracking
- Tracks: onboarding_start → onboarding_profile → onboarding_goals → onboarding_preferences → onboarding_complete
- Animated transitions with spring physics
- Skip option with tracking

### 3. **Feature Discovery Tooltips**
**Components:**
- `components/FeatureTooltip.tsx` - Modal tooltip UI
- `hooks/useTooltipManager.ts` - Tooltip queue management
- `constants/tooltips.ts` - 6 progressive tooltips

**Tooltips:**
1. First Task Creation (after onboarding)
2. Breathing Exercise (after first task)
3. AI Coach (after task completion)
4. Progress Tracking (after breathing session)
5. Caregiver Support (after coach interaction)
6. Wellness Hub (general)

**Usage:**
```tsx
import { useTooltipManager } from '@/hooks/useTooltipManager';
import { FeatureTooltip } from '@/components/FeatureTooltip';

const { activeTooltip, handleDismiss, showNextTooltip } = useTooltipManager();

// Show tooltip when appropriate
useEffect(() => {
  showNextTooltip();
}, []);

// Render
<FeatureTooltip 
  tooltip={activeTooltip} 
  onDismiss={handleDismiss}
  position={{ x: 100, y: 200 }} // optional
/>
```

### 4. **Smart Paywall** (`components/SmartPaywall.tsx`)
Context-aware paywall with 3 modes:
- **feature_limit**: User hits free tier limit
- **value_demo**: User engaged, show value proposition
- **achievement**: User milestone, celebrate + upgrade

**Features:**
- Dynamic messaging based on context
- Social proof (shows when conversion readiness ≥ 60%)
- Feature-specific callouts
- Conversion tracking

**Usage:**
```tsx
import { SmartPaywall } from '@/components/SmartPaywall';
import { useFunnel } from '@/contexts/FunnelContext';

const { shouldShowPaywall } = useFunnel();
const [paywallVisible, setPaywallVisible] = useState(false);

// Check if should show
if (shouldShowPaywall('feature_limit')) {
  setPaywallVisible(true);
}

<SmartPaywall
  visible={paywallVisible}
  onClose={() => setPaywallVisible(false)}
  context="feature_limit"
  featureName="AI Task Breakdown"
/>
```

### 5. **Engagement Hooks**
**Components:**
- `components/StreakBanner.tsx` - Streak celebration UI
- `components/AchievementToast.tsx` - Achievement notifications
- `constants/engagementHooks.ts` - 8 engagement triggers

**Hooks:**
- First task complete
- 3-day streak
- 7-day streak (with paywall)
- 10 tasks milestone
- 5 breathing sessions
- AI coach discovery
- Weekend challenge
- Comeback bonus

**Usage:**
```tsx
import { StreakBanner } from '@/components/StreakBanner';
import { AchievementToast } from '@/components/AchievementToast';
import { useFunnel } from '@/contexts/FunnelContext';

const { metrics } = useFunnel();
const [achievement, setAchievement] = useState<AchievementType | null>(null);

// Show streak
<StreakBanner streakDays={metrics.streakDays} animated />

// Show achievement
<AchievementToast
  type="first_task"
  visible={achievement === 'first_task'}
  onHide={() => setAchievement(null)}
/>
```

### 6. **Retention System**
**Components:**
- `hooks/useRetentionManager.ts` - Retention trigger logic
- `components/RetentionPrompt.tsx` - Re-engagement UI
- `constants/retentionTriggers.ts` - 8 retention triggers

**Triggers:**
- Inactive 1 day (streak reminder)
- Inactive 3 days (win-back)
- Inactive 7 days (what's new)
- Incomplete onboarding
- Unused breathing feature
- Unused AI coach
- Unused caregiver feature
- Streak about to break

**Usage:**
```tsx
import { useRetentionManager } from '@/hooks/useRetentionManager';
import { RetentionPrompt } from '@/components/RetentionPrompt';

const { activeRetentionTrigger, dismissRetentionTrigger } = useRetentionManager();

<RetentionPrompt
  trigger={activeRetentionTrigger}
  onDismiss={dismissRetentionTrigger}
/>
```

## Integration Points

### App Layout
FunnelProvider is wrapped at the root level in `app/_layout.tsx`:
```tsx
<FunnelProvider>
  <SubscriptionProvider>
    {/* other providers */}
  </SubscriptionProvider>
</FunnelProvider>
```

### Tracking Events
Add tracking to key user actions:

```tsx
import { useFunnel } from '@/contexts/FunnelContext';

const { trackStep, updateStreak } = useFunnel();

// Track task creation
trackStep('first_task_create');

// Track task completion
trackStep('first_task_complete');

// Track breathing session
trackStep('breathing_complete_session');

// Track coach interaction
trackStep('coach_first_interaction');

// Update daily streak
useEffect(() => {
  updateStreak();
}, []);
```

## Best Practices

### 1. **Progressive Disclosure**
- Show tooltips in order of priority
- Don't overwhelm users with multiple tooltips
- Use `showOnlyOnce` for one-time tips

### 2. **Conversion Timing**
- Check `getConversionReadiness()` before showing paywall
- Use appropriate context (feature_limit, value_demo, achievement)
- Track conversion triggers for analytics

### 3. **Engagement Loops**
- Celebrate small wins (first task, 3-day streak)
- Create urgency (streak about to break)
- Offer challenges (weekend warrior)

### 4. **Retention Strategies**
- Gentle reminders at 1 day inactive
- Value proposition at 3 days
- Feature highlights for unused features
- Social proof for re-engagement

## Metrics to Monitor

The funnel system tracks:
- **User Stage**: new → activated → engaged → power_user
- **Conversion Readiness**: 0-100 score
- **Completed Steps**: Array of funnel steps
- **Usage Stats**: tasks, breathing, coach interactions
- **Streak Data**: Current streak, last active date
- **Paywall Views**: Count and contexts
- **Dismissed Tooltips**: User preferences

## Future Enhancements

1. **A/B Testing**: Test different paywall messages
2. **Personalization**: Tailor tooltips based on user behavior
3. **Analytics Dashboard**: Visualize funnel metrics
4. **Push Notifications**: Re-engagement via notifications
5. **Email Campaigns**: Automated retention emails
6. **Referral Program**: Social sharing incentives
7. **Gamification**: Badges, levels, leaderboards

## Testing Checklist

- [ ] Onboarding flow tracks all steps
- [ ] Tooltips appear in correct order
- [ ] Paywall shows at appropriate times
- [ ] Streak banner displays correctly
- [ ] Achievement toasts animate properly
- [ ] Retention prompts trigger correctly
- [ ] Conversion readiness calculates accurately
- [ ] Funnel data persists across sessions
- [ ] All tracking events fire correctly
- [ ] Premium features properly gated

## Support

For questions or issues with the funnel system, refer to:
- `types/funnel.ts` - Type definitions
- `contexts/FunnelContext.tsx` - Core logic
- Individual component files for UI implementation
