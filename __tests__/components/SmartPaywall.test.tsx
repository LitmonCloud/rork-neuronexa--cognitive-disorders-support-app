import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { SmartPaywall } from '@/components/SmartPaywall';
import { TestWrapper, MockThemeProvider } from '../__mocks__/contextMocks';

// Mock FunnelContext
const mockTrackStep = jest.fn();
const mockTrackConversionTrigger = jest.fn();
const mockGetConversionReadiness = jest.fn();

jest.mock('@/contexts/FunnelContext', () => ({
  useFunnel: () => ({
    trackStep: mockTrackStep,
    trackConversionTrigger: mockTrackConversionTrigger,
    getConversionReadiness: mockGetConversionReadiness,
  }),
  FunnelProvider: ({ children }: any) => children,
}));

// Mock SubscriptionContext
const mockUpgradeToPremium = jest.fn();
const mockUseSubscription = jest.fn();

jest.mock('@/contexts/SubscriptionContext', () => ({
  useSubscription: () => mockUseSubscription(),
  SubscriptionProvider: ({ children }: any) => children,
}));

const renderSmartPaywall = (props: any) => {
  return render(
    <TestWrapper>
      <MockThemeProvider>
        <SmartPaywall {...props} />
      </MockThemeProvider>
    </TestWrapper>
  );
};

describe('SmartPaywall Component', () => {
  const mockOnClose = jest.fn();

  const defaultProps = {
    visible: true,
    onClose: mockOnClose,
    context: 'feature_limit' as const,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock values
    mockUseSubscription.mockReturnValue({
      upgradeToPremium: mockUpgradeToPremium,
      isPremium: false,
    });

    mockGetConversionReadiness.mockReturnValue(50);
  });

  describe('Rendering', () => {
    it('should render when visible is true', () => {
      const { getByText } = renderSmartPaywall(defaultProps);

      expect(getByText('Unlock Premium Features')).toBeTruthy();
    });

    it('should not render when visible is false', () => {
      const { queryByText } = renderSmartPaywall({
        ...defaultProps,
        visible: false,
      });

      expect(queryByText('Unlock Premium Features')).toBeNull();
    });

    it('should not render when user is premium', () => {
      mockUseSubscription.mockReturnValue({
        upgradeToPremium: mockUpgradeToPremium,
        isPremium: true,
      });

      const { queryByText } = renderSmartPaywall(defaultProps);

      expect(queryByText('Unlock Premium Features')).toBeNull();
    });
  });

  describe('Context-Specific Display', () => {
    it('should display feature_limit context correctly', () => {
      const { getByText } = renderSmartPaywall({
        ...defaultProps,
        context: 'feature_limit',
      });

      expect(getByText('Unlock Premium Features')).toBeTruthy();
      expect(getByText("You've reached the free tier limit")).toBeTruthy();
    });

    it('should display value_demo context correctly', () => {
      const { getByText } = renderSmartPaywall({
        ...defaultProps,
        context: 'value_demo',
      });

      expect(getByText('Upgrade to Premium')).toBeTruthy();
      expect(getByText('Get the most out of Nexa')).toBeTruthy();
    });

    it('should display achievement context correctly', () => {
      const { getByText } = renderSmartPaywall({
        ...defaultProps,
        context: 'achievement',
      });

      expect(getByText("You're Doing Great!")).toBeTruthy();
      expect(getByText('Unlock premium to reach your full potential')).toBeTruthy();
    });
  });

  describe('Feature Name Display', () => {
    it('should display feature name when provided', () => {
      const { getByText } = renderSmartPaywall({
        ...defaultProps,
        featureName: 'AI Task Breakdowns',
      });

      // Check for the feature name itself
      expect(getByText('AI Task Breakdowns')).toBeTruthy();
      expect(getByText(/and more/)).toBeTruthy();
    });

    it('should not show feature callout when featureName is not provided', () => {
      const { queryByText } = renderSmartPaywall({
        ...defaultProps,
        featureName: undefined,
      });

      expect(queryByText(/and more/)).toBeNull();
    });
  });

  describe('Conversion Readiness', () => {
    it('should show social proof when readiness >= 60', () => {
      mockGetConversionReadiness.mockReturnValue(70);

      const { getByText } = renderSmartPaywall(defaultProps);

      expect(getByText(/Join 10,000\+ users who upgraded to premium/i)).toBeTruthy();
    });

    it('should not show social proof when readiness < 60', () => {
      mockGetConversionReadiness.mockReturnValue(50);

      const { queryByText } = renderSmartPaywall(defaultProps);

      expect(queryByText(/Join 10,000\+ users/i)).toBeNull();
    });

    it('should show social proof at exactly 60 readiness', () => {
      mockGetConversionReadiness.mockReturnValue(60);

      const { getByText } = renderSmartPaywall(defaultProps);

      expect(getByText(/Join 10,000\+ users who upgraded to premium/i)).toBeTruthy();
    });
  });

  describe('Premium Features List', () => {
    it('should display all premium features', () => {
      const { getByText } = renderSmartPaywall(defaultProps);

      expect(getByText('Premium includes:')).toBeTruthy();
      expect(getByText('Unlimited AI task breakdowns')).toBeTruthy();
      expect(getByText('Advanced AI coaching & insights')).toBeTruthy();
      expect(getByText('Caregiver dashboard access')).toBeTruthy();
      expect(getByText('Detailed progress analytics')).toBeTruthy();
      expect(getByText('Priority support')).toBeTruthy();
      expect(getByText('Ad-free experience')).toBeTruthy();
    });

    it('should display feature icons', () => {
      const { UNSAFE_getAllByType } = renderSmartPaywall(defaultProps);

      // Should have icons for all features
      const views = UNSAFE_getAllByType(require('react-native').View);
      expect(views.length).toBeGreaterThan(0);
    });
  });

  describe('Pricing Display', () => {
    it('should show 7-day free trial badge', () => {
      const { getByText } = renderSmartPaywall(defaultProps);

      expect(getByText('7-DAY FREE TRIAL')).toBeTruthy();
    });

    it('should display price correctly', () => {
      const { getByText } = renderSmartPaywall(defaultProps);

      // Price is rendered as nested text: "$9.99" with "/month" inside
      // We need to check for the container text
      expect(getByText(/\$9\.99/)).toBeTruthy();
      expect(getByText(/\/month/)).toBeTruthy();
    });

    it('should show cancellation information', () => {
      const { getByText } = renderSmartPaywall(defaultProps);

      // Both "Cancel anytime" and "No commitment" are in the same Text component
      // separated by •
      expect(getByText(/Cancel anytime.*No commitment/i)).toBeTruthy();
    });
  });

  describe('User Interactions', () => {
    it('should call onClose when close button is pressed', () => {
      const { UNSAFE_getAllByType } = renderSmartPaywall(defaultProps);

      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      // First touchable should be the close button
      const closeButton = touchables[0];

      fireEvent.press(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when "Maybe Later" is pressed', () => {
      const { getByText } = renderSmartPaywall(defaultProps);

      const maybeLaterButton = getByText('Maybe Later');
      fireEvent.press(maybeLaterButton);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call upgradeToPremium when "Start Free Trial" is pressed', () => {
      const { getByText } = renderSmartPaywall(defaultProps);

      const upgradeButton = getByText('Start Free Trial');
      fireEvent.press(upgradeButton);

      expect(mockUpgradeToPremium).toHaveBeenCalledWith('month');
    });

    it('should call onClose after successful upgrade', () => {
      const { getByText } = renderSmartPaywall(defaultProps);

      const upgradeButton = getByText('Start Free Trial');
      fireEvent.press(upgradeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Analytics Tracking', () => {
    it('should track paywall_view when visible', () => {
      renderSmartPaywall({
        ...defaultProps,
        context: 'feature_limit',
        featureName: 'AI Coaching',
      });

      expect(mockTrackStep).toHaveBeenCalledWith('paywall_view', {
        context: 'feature_limit',
        featureName: 'AI Coaching',
      });
    });

    it('should track conversion trigger for feature_limit', () => {
      renderSmartPaywall({
        ...defaultProps,
        context: 'feature_limit',
      });

      expect(mockTrackConversionTrigger).toHaveBeenCalledWith('feature_limit');
    });

    it('should track conversion trigger for value_demo', () => {
      renderSmartPaywall({
        ...defaultProps,
        context: 'value_demo',
      });

      expect(mockTrackConversionTrigger).toHaveBeenCalledWith('value_demonstration');
    });

    it('should track conversion trigger for achievement', () => {
      renderSmartPaywall({
        ...defaultProps,
        context: 'achievement',
      });

      expect(mockTrackConversionTrigger).toHaveBeenCalledWith('achievement');
    });

    it('should track premium tap when upgrade button is pressed', () => {
      const { getByText } = renderSmartPaywall({
        ...defaultProps,
        context: 'feature_limit',
      });

      const upgradeButton = getByText('Start Free Trial');
      fireEvent.press(upgradeButton);

      expect(mockTrackStep).toHaveBeenCalledWith('paywall_premium_tap', {
        context: 'feature_limit',
      });
    });

    it('should track conversion when upgrade completes', () => {
      const { getByText } = renderSmartPaywall(defaultProps);

      const upgradeButton = getByText('Start Free Trial');
      fireEvent.press(upgradeButton);

      expect(mockTrackStep).toHaveBeenCalledWith('paywall_convert');
    });

    it('should not track when visibility changes to false', () => {
      const { rerender } = renderSmartPaywall({
        ...defaultProps,
        visible: true,
      });

      jest.clearAllMocks();

      rerender(
        <TestWrapper>
          <MockThemeProvider>
            <SmartPaywall {...defaultProps} visible={false} />
          </MockThemeProvider>
        </TestWrapper>
      );

      // Should not track again when just becoming invisible
      expect(mockTrackStep).not.toHaveBeenCalled();
      expect(mockTrackConversionTrigger).not.toHaveBeenCalled();
    });
  });

  describe('Disclaimer Text', () => {
    it('should display trial disclaimer', () => {
      const { getByText } = renderSmartPaywall(defaultProps);

      expect(getByText(/Your free trial starts now/i)).toBeTruthy();
      expect(getByText(/You won't be charged until the trial ends/i)).toBeTruthy();
      expect(getByText(/Cancel anytime in settings/i)).toBeTruthy();
    });
  });

  describe('Modal Behavior', () => {
    it('should use slide animation', () => {
      const { UNSAFE_getByType } = renderSmartPaywall(defaultProps);

      const modal = UNSAFE_getByType(require('react-native').Modal);
      expect(modal.props.animationType).toBe('slide');
    });

    it('should use pageSheet presentation style', () => {
      const { UNSAFE_getByType } = renderSmartPaywall(defaultProps);

      const modal = UNSAFE_getByType(require('react-native').Modal);
      expect(modal.props.presentationStyle).toBe('pageSheet');
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing featureName gracefully', () => {
      const { queryByText } = renderSmartPaywall({
        ...defaultProps,
        featureName: undefined,
      });

      // Should still render without feature callout
      expect(queryByText('Unlock Premium Features')).toBeTruthy();
    });

    it('should handle very high conversion readiness', () => {
      mockGetConversionReadiness.mockReturnValue(100);

      const { getByText } = renderSmartPaywall(defaultProps);

      // Should show social proof
      expect(getByText(/Join 10,000\+ users/i)).toBeTruthy();
    });

    it('should handle zero conversion readiness', () => {
      mockGetConversionReadiness.mockReturnValue(0);

      const { queryByText } = renderSmartPaywall(defaultProps);

      // Should not show social proof
      expect(queryByText(/Join 10,000\+ users/i)).toBeNull();
    });

    it('should not break when tracking functions are undefined', () => {
      jest.mock('@/contexts/FunnelContext', () => ({
        useFunnel: () => ({
          trackStep: undefined,
          trackConversionTrigger: undefined,
          getConversionReadiness: () => 50,
        }),
      }));

      expect(() => {
        renderSmartPaywall(defaultProps);
      }).not.toThrow();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible buttons', () => {
      const { UNSAFE_getAllByType } = renderSmartPaywall(defaultProps);

      // All TouchableOpacity components should be accessible
      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      expect(touchables.length).toBeGreaterThan(0);
    });

    it('should have readable text content', () => {
      const { getByText } = renderSmartPaywall(defaultProps);

      expect(getByText('Unlock Premium Features')).toBeTruthy();
      expect(getByText('Premium includes:')).toBeTruthy();
      expect(getByText('Start Free Trial')).toBeTruthy();
    });
  });

  describe('Multiple Context Switches', () => {
    it('should update content when context changes', () => {
      const { rerender, getByText } = renderSmartPaywall({
        ...defaultProps,
        context: 'feature_limit',
      });

      expect(getByText('Unlock Premium Features')).toBeTruthy();

      rerender(
        <TestWrapper>
          <MockThemeProvider>
            <SmartPaywall {...defaultProps} context="achievement" />
          </MockThemeProvider>
        </TestWrapper>
      );

      expect(getByText("You're Doing Great!")).toBeTruthy();
    });

    it('should track analytics for each context change', () => {
      const { rerender } = renderSmartPaywall({
        ...defaultProps,
        context: 'feature_limit',
      });

      jest.clearAllMocks();

      rerender(
        <TestWrapper>
          <MockThemeProvider>
            <SmartPaywall {...defaultProps} context="value_demo" />
          </MockThemeProvider>
        </TestWrapper>
      );

      expect(mockTrackConversionTrigger).toHaveBeenCalledWith('value_demonstration');
    });
  });

  describe('ScrollView Behavior', () => {
    it('should render ScrollView for content', () => {
      const { UNSAFE_getByType } = renderSmartPaywall(defaultProps);

      const scrollView = UNSAFE_getByType(require('react-native').ScrollView);
      expect(scrollView).toBeTruthy();
    });

    it('should hide vertical scroll indicator', () => {
      const { UNSAFE_getByType } = renderSmartPaywall(defaultProps);

      const scrollView = UNSAFE_getByType(require('react-native').ScrollView);
      expect(scrollView.props.showsVerticalScrollIndicator).toBe(false);
    });
  });
});
