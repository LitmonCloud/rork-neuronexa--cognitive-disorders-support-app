import AsyncStorage from '@react-native-async-storage/async-storage';
import { posthog } from '../analytics/PostHogService';

interface Experiment {
  id: string;
  variants: string[];
  weights?: number[];
}

interface ExperimentAssignment {
  experimentId: string;
  variant: string;
  assignedAt: string;
}

class ABTestingService {
  private assignments: Map<string, string> = new Map();
  private isInitialized = false;

  async initialize() {
    if (this.isInitialized) return;

    try {
      const stored = await AsyncStorage.getItem('ab_test_assignments');
      if (stored) {
        const assignments: ExperimentAssignment[] = JSON.parse(stored);
        assignments.forEach(({ experimentId, variant }) => {
          this.assignments.set(experimentId, variant);
        });
      }
      this.isInitialized = true;
      console.log('[ABTesting] Initialized with', this.assignments.size, 'assignments');
    } catch (error) {
      console.error('[ABTesting] Initialization failed:', error);
    }
  }

  getExperiment(experimentId: string, config: Experiment): { variant: string; isControl: boolean } {
    if (!this.isInitialized) {
      console.warn('[ABTesting] Not initialized, using control variant');
      return { variant: config.variants[0], isControl: true };
    }

    let variant = this.assignments.get(experimentId);

    if (!variant) {
      variant = this.assignVariant(experimentId, config);
      this.saveAssignment(experimentId, variant);
      
      posthog.capture('experiment_assigned', {
        experimentId,
        variant,
      });
    }

    return {
      variant,
      isControl: variant === config.variants[0],
    };
  }

  private assignVariant(experimentId: string, config: Experiment): string {
    const { variants, weights } = config;

    if (!weights || weights.length !== variants.length) {
      const randomIndex = Math.floor(Math.random() * variants.length);
      return variants[randomIndex];
    }

    const random = Math.random();
    let cumulativeWeight = 0;

    for (let i = 0; i < variants.length; i++) {
      cumulativeWeight += weights[i];
      if (random <= cumulativeWeight) {
        return variants[i];
      }
    }

    return variants[variants.length - 1];
  }

  private async saveAssignment(experimentId: string, variant: string) {
    try {
      this.assignments.set(experimentId, variant);

      const assignments: ExperimentAssignment[] = Array.from(this.assignments.entries()).map(
        ([id, v]) => ({
          experimentId: id,
          variant: v,
          assignedAt: new Date().toISOString(),
        })
      );

      await AsyncStorage.setItem('ab_test_assignments', JSON.stringify(assignments));
      console.log('[ABTesting] Assignment saved:', experimentId, variant);
    } catch (error) {
      console.error('[ABTesting] Failed to save assignment:', error);
    }
  }

  trackConversion(experimentId: string, conversionEvent: string, metadata?: Record<string, any>) {
    const variant = this.assignments.get(experimentId);
    
    if (!variant) {
      console.warn('[ABTesting] No variant assigned for experiment:', experimentId);
      return;
    }

    posthog.capture('experiment_conversion', {
      experimentId,
      variant,
      conversionEvent,
      ...metadata,
    });

    console.log('[ABTesting] Conversion tracked:', experimentId, conversionEvent);
  }

  getVariant(experimentId: string): string | undefined {
    return this.assignments.get(experimentId);
  }

  async reset() {
    try {
      this.assignments.clear();
      await AsyncStorage.removeItem('ab_test_assignments');
      console.log('[ABTesting] All assignments cleared');
    } catch (error) {
      console.error('[ABTesting] Reset failed:', error);
    }
  }

  async resetExperiment(experimentId: string) {
    try {
      this.assignments.delete(experimentId);
      
      const assignments: ExperimentAssignment[] = Array.from(this.assignments.entries()).map(
        ([id, variant]) => ({
          experimentId: id,
          variant,
          assignedAt: new Date().toISOString(),
        })
      );

      await AsyncStorage.setItem('ab_test_assignments', JSON.stringify(assignments));
      console.log('[ABTesting] Experiment reset:', experimentId);
    } catch (error) {
      console.error('[ABTesting] Failed to reset experiment:', error);
    }
  }
}

export const abTesting = new ABTestingService();
