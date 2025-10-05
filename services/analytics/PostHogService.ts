import PostHog from 'posthog-react-native';
import { Platform } from 'react-native';

class PostHogService {
  private client: PostHog | null = null;
  private isInitialized = false;

  async initialize(): Promise<void> {
    if (this.isInitialized) return Promise.resolve();

    const apiKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;
    const host = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

    if (!apiKey) {
      console.warn('[PostHog] API key not configured. Analytics disabled.');
      return Promise.resolve();
    }

    try {
      this.client = new PostHog(apiKey, {
        host,
        captureAppLifecycleEvents: true,
      });
      this.isInitialized = true;
      console.log('[PostHog] Initialized successfully');
      return Promise.resolve();
    } catch (error) {
      console.error('[PostHog] Initialization failed:', error);
      return Promise.resolve();
    }
  }

  identify(userId: string, properties?: Record<string, any>) {
    if (!this.client) return;
    try {
      this.client.identify(userId, properties);
      console.log('[PostHog] User identified:', userId);
    } catch (error) {
      console.error('[PostHog] Identify failed:', error);
    }
  }

  capture(event: string, properties?: Record<string, any>) {
    if (!this.client) return;
    try {
      this.client.capture(event, {
        ...properties,
        platform: Platform.OS,
        timestamp: new Date().toISOString(),
      });
      console.log('[PostHog] Event captured:', event);
    } catch (error) {
      console.error('[PostHog] Capture failed:', error);
    }
  }

  screen(screenName: string, properties?: Record<string, any>) {
    if (!this.client) return;
    try {
      this.client.screen(screenName, properties);
      console.log('[PostHog] Screen viewed:', screenName);
    } catch (error) {
      console.error('[PostHog] Screen tracking failed:', error);
    }
  }

  setUserProperties(properties: Record<string, any>) {
    if (!this.client) return;
    try {
      this.client.identify(undefined, properties);
      console.log('[PostHog] User properties set');
    } catch (error) {
      console.error('[PostHog] Set properties failed:', error);
    }
  }

  reset() {
    if (!this.client) return;
    try {
      this.client.reset();
      console.log('[PostHog] User session reset');
    } catch (error) {
      console.error('[PostHog] Reset failed:', error);
    }
  }

  async flush() {
    if (!this.client) return;
    try {
      await this.client.flush();
      console.log('[PostHog] Events flushed');
    } catch (error) {
      console.error('[PostHog] Flush failed:', error);
    }
  }

  trackOnboardingStarted() {
    this.capture('onboarding_started');
  }

  trackOnboardingStepCompleted(step: number) {
    this.capture('onboarding_step_completed', { step });
  }

  trackOnboardingCompleted(duration: number) {
    this.capture('onboarding_completed', { duration });
  }

  trackTaskCreated(hasAI: boolean, priority?: string) {
    this.capture('task_created', { hasAI, priority });
  }

  trackTaskCompleted(taskId: string, duration: number, stepsCount: number) {
    this.capture('task_completed', { taskId, duration, stepsCount });
  }

  trackAIBreakdownUsed(taskComplexity: string) {
    this.capture('ai_breakdown_used', { taskComplexity });
  }

  trackBreathingExerciseCompleted(type: string, duration: number) {
    this.capture('breathing_exercise_completed', { type, duration });
  }

  trackPaywallViewed(trigger: string) {
    this.capture('paywall_viewed', { trigger });
  }

  trackSubscriptionStarted(plan: string) {
    this.capture('subscription_started', { plan });
  }

  trackSubscriptionCompleted(plan: string, price: number) {
    this.capture('subscription_completed', { plan, price });
  }

  trackFeatureUsed(feature: string, metadata?: Record<string, any>) {
    this.capture('feature_used', { feature, ...metadata });
  }

  trackError(error: string, context?: string) {
    this.capture('error_occurred', { error, context });
  }

  trackPerformance(metric: string, value: number, unit: string) {
    this.capture('performance_metric', { metric, value, unit });
  }
}

export const posthog = new PostHogService();
