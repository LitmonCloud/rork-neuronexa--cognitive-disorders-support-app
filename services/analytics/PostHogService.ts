import PostHog from 'posthog-react-native';
import { Platform } from 'react-native';

class PostHogService {
  private client: PostHog | null = null;
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    const apiKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;
    const host = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

    if (!apiKey) {
      console.warn('[PostHog] API key not configured. Analytics disabled.');
      return;
    }

    try {
      this.client = new PostHog(apiKey, {
        host,
        captureAppLifecycleEvents: true,
      });
      this.isInitialized = true;
      console.log('[PostHog] Initialized successfully');
    } catch (error) {
      console.error('[PostHog] Initialization failed:', error);
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
}

export const posthog = new PostHogService();
