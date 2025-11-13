import React, { useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { X, Check, Sparkles, Zap, Shield, TrendingUp } from 'lucide-react-native';
import { useFunnel } from '@/contexts/FunnelContext';
import { useSubscription } from '@/contexts/SubscriptionContext';
import colors from '@/constants/colors';

type PaywallContext = 'feature_limit' | 'value_demo' | 'achievement';

type SmartPaywallProps = {
  visible: boolean;
  onClose: () => void;
  context: PaywallContext;
  featureName?: string;
};

const CONTEXT_MESSAGES = {
  feature_limit: {
    title: 'Unlock Premium Features',
    subtitle: 'You\'ve reached the free tier limit',
    icon: Zap,
    color: colors.warning,
  },
  value_demo: {
    title: 'Upgrade to Premium',
    subtitle: 'Get the most out of Nexa',
    icon: Sparkles,
    color: colors.primary,
  },
  achievement: {
    title: 'You\'re Doing Great!',
    subtitle: 'Unlock premium to reach your full potential',
    icon: TrendingUp,
    color: colors.success,
  },
};

const PREMIUM_FEATURES = [
  { icon: Sparkles, text: 'Unlimited AI task breakdowns' },
  { icon: Zap, text: 'Advanced AI coaching & insights' },
  { icon: Shield, text: 'Caregiver dashboard access' },
  { icon: TrendingUp, text: 'Detailed progress analytics' },
  { icon: Check, text: 'Priority support' },
  { icon: Check, text: 'Ad-free experience' },
];

export function SmartPaywall({ visible, onClose, context, featureName }: SmartPaywallProps) {
  const { trackStep, trackConversionTrigger, getConversionReadiness } = useFunnel();
  const { upgradeToPremium, isPremium } = useSubscription();

  useEffect(() => {
    if (visible) {
      trackStep('paywall_view', { context, featureName });
      
      if (context === 'feature_limit') trackConversionTrigger('feature_limit');
      if (context === 'value_demo') trackConversionTrigger('value_demonstration');
      if (context === 'achievement') trackConversionTrigger('achievement');
    }
  }, [visible, context, featureName, trackStep, trackConversionTrigger]);

  const handleUpgrade = () => {
    trackStep('paywall_premium_tap', { context });
    upgradeToPremium('month');
    trackStep('paywall_convert');
    onClose();
  };

  if (isPremium) return null;

  const contextConfig = CONTEXT_MESSAGES[context];
  const IconComponent = contextConfig.icon;
  const readiness = getConversionReadiness();

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color={colors.textSecondary} />
        </TouchableOpacity>

        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={[styles.iconContainer, { backgroundColor: contextConfig.color + '20' }]}>
            <IconComponent size={48} color={contextConfig.color} />
          </View>

          <Text style={styles.title}>{contextConfig.title}</Text>
          <Text style={styles.subtitle}>{contextConfig.subtitle}</Text>

          {featureName && (
            <View style={styles.featureCallout}>
              <Text style={styles.featureCalloutText}>
                Unlock <Text style={styles.featureCalloutBold}>{featureName}</Text> and more
              </Text>
            </View>
          )}

          {readiness >= 60 && (
            <View style={styles.socialProof}>
              <Text style={styles.socialProofText}>
                Join 10,000+ users who upgraded to premium
              </Text>
            </View>
          )}

          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Premium includes:</Text>
            {PREMIUM_FEATURES.map((feature, index) => {
              const FeatureIcon = feature.icon;
              return (
                <View key={index} style={styles.featureRow}>
                  <View style={styles.featureIconContainer}>
                    <FeatureIcon size={20} color={colors.primary} />
                  </View>
                  <Text style={styles.featureText}>{feature.text}</Text>
                </View>
              );
            })}
          </View>

          <View style={styles.pricingContainer}>
            <View style={styles.trialBadge}>
              <Text style={styles.trialBadgeText}>7-DAY FREE TRIAL</Text>
            </View>
            <Text style={styles.priceText}>
              $9.99<Text style={styles.pricePeriod}>/month</Text>
            </Text>
            <Text style={styles.priceSubtext}>Cancel anytime • No commitment</Text>
          </View>

          <TouchableOpacity style={styles.upgradeButton} onPress={handleUpgrade}>
            <Text style={styles.upgradeButtonText}>Start Free Trial</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.restoreButton} onPress={onClose}>
            <Text style={styles.restoreButtonText}>Maybe Later</Text>
          </TouchableOpacity>

          <Text style={styles.disclaimer}>
            Your free trial starts now. You won&apos;t be charged until the trial ends. Cancel anytime in settings.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    padding: 8,
  },
  content: {
    padding: 24,
    paddingTop: 60,
  },
  iconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '800' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  featureCallout: {
    backgroundColor: colors.primaryLight + '30',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 16,
  },
  featureCalloutText: {
    fontSize: 15,
    color: colors.text,
    textAlign: 'center',
  },
  featureCalloutBold: {
    fontWeight: '700' as const,
    color: colors.primary,
  },
  socialProof: {
    backgroundColor: colors.success + '20',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  socialProofText: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    fontWeight: '600' as const,
  },
  featuresContainer: {
    marginBottom: 32,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.text,
    marginBottom: 16,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  featureIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  pricingContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  trialBadge: {
    backgroundColor: colors.success,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginBottom: 12,
  },
  trialBadgeText: {
    fontSize: 12,
    fontWeight: '800' as const,
    color: colors.surface,
    letterSpacing: 1,
  },
  priceText: {
    fontSize: 40,
    fontWeight: '800' as const,
    color: colors.text,
    marginBottom: 4,
  },
  pricePeriod: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  priceSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  upgradeButtonText: {
    fontSize: 18,
    fontWeight: '700' as const,
    color: colors.surface,
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  restoreButtonText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textSecondary,
  },
  disclaimer: {
    fontSize: 12,
    color: colors.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
});
