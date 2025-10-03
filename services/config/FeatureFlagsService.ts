import AsyncStorage from '@react-native-async-storage/async-storage';

interface FeatureFlag {
  key: string;
  enabled: boolean;
  value?: any;
  rolloutPercentage?: number;
  enabledForUsers?: string[];
}

class FeatureFlagsService {
  private flags: Map<string, FeatureFlag> = new Map();
  private userId: string | null = null;
  private isInitialized = false;

  private defaultFlags: FeatureFlag[] = [
    { key: 'new_ai_coach', enabled: false, rolloutPercentage: 0 },
    { key: 'advanced_breathing', enabled: true },
    { key: 'caregiver_alerts', enabled: false },
    { key: 'cloud_sync', enabled: false },
    { key: 'push_notifications', enabled: false },
    { key: 'premium_features', enabled: true },
    { key: 'beta_features', enabled: false },
    { key: 'max_free_tasks', enabled: true, value: 3 },
    { key: 'trial_duration_days', enabled: true, value: 7 },
  ];

  async initialize(userId?: string) {
    if (this.isInitialized) return;

    this.userId = userId || null;

    try {
      const stored = await AsyncStorage.getItem('feature_flags');
      if (stored) {
        const flags: FeatureFlag[] = JSON.parse(stored);
        flags.forEach((flag) => {
          this.flags.set(flag.key, flag);
        });
      } else {
        this.defaultFlags.forEach((flag) => {
          this.flags.set(flag.key, flag);
        });
        await this.saveFlags();
      }

      this.isInitialized = true;
      console.log('[FeatureFlags] Initialized with', this.flags.size, 'flags');
    } catch (error) {
      console.error('[FeatureFlags] Initialization failed:', error);
      this.defaultFlags.forEach((flag) => {
        this.flags.set(flag.key, flag);
      });
    }
  }

  isEnabled(key: string): boolean {
    const flag = this.flags.get(key);
    
    if (!flag) {
      console.warn('[FeatureFlags] Flag not found:', key);
      return false;
    }

    if (!flag.enabled) {
      return false;
    }

    if (flag.enabledForUsers && this.userId) {
      return flag.enabledForUsers.includes(this.userId);
    }

    if (flag.rolloutPercentage !== undefined) {
      const hash = this.hashUserId(this.userId || 'anonymous');
      return hash < flag.rolloutPercentage;
    }

    return true;
  }

  getValue<T = any>(key: string, defaultValue: T): T {
    const flag = this.flags.get(key);
    
    if (!flag || !flag.enabled) {
      return defaultValue;
    }

    return (flag.value as T) ?? defaultValue;
  }

  async setFlag(key: string, enabled: boolean, value?: any) {
    try {
      const flag = this.flags.get(key) || { key, enabled: false };
      flag.enabled = enabled;
      if (value !== undefined) {
        flag.value = value;
      }
      
      this.flags.set(key, flag);
      await this.saveFlags();
      
      console.log('[FeatureFlags] Flag updated:', key, enabled);
    } catch (error) {
      console.error('[FeatureFlags] Failed to set flag:', error);
    }
  }

  async enableForUser(key: string, userId: string) {
    try {
      const flag = this.flags.get(key);
      if (!flag) {
        console.warn('[FeatureFlags] Flag not found:', key);
        return;
      }

      if (!flag.enabledForUsers) {
        flag.enabledForUsers = [];
      }

      if (!flag.enabledForUsers.includes(userId)) {
        flag.enabledForUsers.push(userId);
        await this.saveFlags();
        console.log('[FeatureFlags] Flag enabled for user:', key, userId);
      }
    } catch (error) {
      console.error('[FeatureFlags] Failed to enable for user:', error);
    }
  }

  async setRolloutPercentage(key: string, percentage: number) {
    try {
      const flag = this.flags.get(key);
      if (!flag) {
        console.warn('[FeatureFlags] Flag not found:', key);
        return;
      }

      flag.rolloutPercentage = Math.max(0, Math.min(100, percentage));
      await this.saveFlags();
      
      console.log('[FeatureFlags] Rollout percentage set:', key, percentage);
    } catch (error) {
      console.error('[FeatureFlags] Failed to set rollout percentage:', error);
    }
  }

  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return Math.abs(hash) % 100;
  }

  private async saveFlags() {
    try {
      const flags = Array.from(this.flags.values());
      await AsyncStorage.setItem('feature_flags', JSON.stringify(flags));
    } catch (error) {
      console.error('[FeatureFlags] Failed to save flags:', error);
    }
  }

  async reset() {
    try {
      this.flags.clear();
      this.defaultFlags.forEach((flag) => {
        this.flags.set(flag.key, flag);
      });
      await this.saveFlags();
      console.log('[FeatureFlags] Reset to defaults');
    } catch (error) {
      console.error('[FeatureFlags] Reset failed:', error);
    }
  }

  getAllFlags(): FeatureFlag[] {
    return Array.from(this.flags.values());
  }
}

export const featureFlags = new FeatureFlagsService();
