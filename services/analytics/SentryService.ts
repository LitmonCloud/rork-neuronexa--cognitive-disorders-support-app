import * as Sentry from '@sentry/react-native';
import { Platform } from 'react-native';

class SentryService {
  private isInitialized = false;

  initialize() {
    if (this.isInitialized) return;

    const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;
    const environment = process.env.EXPO_PUBLIC_ENV || 'development';

    if (!dsn) {
      console.warn('[Sentry] DSN not configured. Crash reporting disabled.');
      return;
    }

    try {
      Sentry.init({
        dsn,
        environment,
        enableAutoSessionTracking: true,
        sessionTrackingIntervalMillis: 30000,
        tracesSampleRate: environment === 'production' ? 0.2 : 1.0,
        beforeSend(event) {
          if (environment === 'development') {
            console.log('[Sentry] Event captured:', event);
          }
          return event;
        },
        integrations: [],
      });
      this.isInitialized = true;
      console.log('[Sentry] Initialized successfully');
    } catch (error) {
      console.error('[Sentry] Initialization failed:', error);
    }
  }

  captureException(error: Error, context?: Record<string, any>) {
    if (!this.isInitialized) {
      console.error('[Sentry] Not initialized. Error:', error);
      return;
    }

    try {
      Sentry.captureException(error, {
        contexts: context,
        tags: {
          platform: Platform.OS,
        },
      });
      console.log('[Sentry] Exception captured:', error.message);
    } catch (e) {
      console.error('[Sentry] Failed to capture exception:', e);
    }
  }

  captureMessage(message: string, level: Sentry.SeverityLevel = 'info', context?: Record<string, any>) {
    if (!this.isInitialized) {
      console.log('[Sentry] Not initialized. Message:', message);
      return;
    }

    try {
      Sentry.captureMessage(message, {
        level,
        contexts: context,
        tags: {
          platform: Platform.OS,
        },
      });
      console.log('[Sentry] Message captured:', message);
    } catch (error) {
      console.error('[Sentry] Failed to capture message:', error);
    }
  }

  setUser(user: { id: string; email?: string; username?: string }) {
    if (!this.isInitialized) return;

    try {
      Sentry.setUser(user);
      console.log('[Sentry] User set:', user.id);
    } catch (error) {
      console.error('[Sentry] Failed to set user:', error);
    }
  }

  setContext(key: string, context: Record<string, any>) {
    if (!this.isInitialized) return;

    try {
      Sentry.setContext(key, context);
      console.log('[Sentry] Context set:', key);
    } catch (error) {
      console.error('[Sentry] Failed to set context:', error);
    }
  }

  addBreadcrumb(breadcrumb: { message: string; category?: string; level?: Sentry.SeverityLevel; data?: Record<string, any> }) {
    if (!this.isInitialized) return;

    try {
      Sentry.addBreadcrumb(breadcrumb);
    } catch (error) {
      console.error('[Sentry] Failed to add breadcrumb:', error);
    }
  }

  clearUser() {
    if (!this.isInitialized) return;

    try {
      Sentry.setUser(null);
      console.log('[Sentry] User cleared');
    } catch (error) {
      console.error('[Sentry] Failed to clear user:', error);
    }
  }
}

export const sentry = new SentryService();
