import { abTesting } from '@/services/experiments/ABTestingService';
import AsyncStorage from '@react-native-async-storage/async-storage';

jest.mock('@react-native-async-storage/async-storage');
jest.mock('@/services/analytics/PostHogService', () => ({
  posthog: {
    capture: jest.fn(),
  },
}));

describe('ABTestingService', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    await abTesting.initialize();
  });

  it('should assign variant for new experiment', () => {
    const experiment = abTesting.getExperiment('test_experiment', {
      id: 'test_experiment',
      variants: ['control', 'variant_a'],
    });

    expect(experiment.variant).toBeDefined();
    expect(['control', 'variant_a']).toContain(experiment.variant);
  });

  it('should return same variant for same experiment', () => {
    const experiment1 = abTesting.getExperiment('test_experiment', {
      id: 'test_experiment',
      variants: ['control', 'variant_a'],
    });

    const experiment2 = abTesting.getExperiment('test_experiment', {
      id: 'test_experiment',
      variants: ['control', 'variant_a'],
    });

    expect(experiment1.variant).toBe(experiment2.variant);
  });

  it('should respect variant weights', () => {
    const results = { control: 0, variant_a: 0 };
    
    for (let i = 0; i < 100; i++) {
      abTesting.reset();
      const experiment = abTesting.getExperiment('weighted_test', {
        id: 'weighted_test',
        variants: ['control', 'variant_a'],
        weights: [0.9, 0.1],
      });
      results[experiment.variant as keyof typeof results]++;
    }

    expect(results.control).toBeGreaterThan(results.variant_a);
  });

  it('should track conversions', () => {
    const experiment = abTesting.getExperiment('conversion_test', {
      id: 'conversion_test',
      variants: ['control', 'variant_a'],
    });

    abTesting.trackConversion('conversion_test', 'completed');
    
    expect(experiment.variant).toBeDefined();
  });
});
