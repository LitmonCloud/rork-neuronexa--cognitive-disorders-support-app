import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { PRICING_PLANS, PricingPlan } from '@/types/subscription';
import { useTheme } from '@/contexts/ThemeContext';
import { X, Check, Sparkles, Crown, Zap } from 'lucide-react-native';

export default function PaywallScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { upgradeToPremium, isInTrial } = useSubscription();
  const { profile } = useUserProfile();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan>(PRICING_PLANS[1]);
  
  const isCaregiver = profile?.role === 'caregiver';
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 20,
      paddingTop: 10,
      alignItems: 'flex-end',
    },
    closeButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    scrollView: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    heroSection: {
      alignItems: 'center',
      paddingVertical: 32,
    },
    crownContainer: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: colors.primaryLight + '30',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    heroTitle: {
      fontSize: 32,
      fontWeight: '800' as const,
      color: colors.text,
      textAlign: 'center',
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    heroSubtitle: {
      fontSize: 17,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    plansContainer: {
      gap: 16,
      marginBottom: 32,
    },
    planCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      borderWidth: 2,
      borderColor: colors.border,
      position: 'relative' as const,
    },
    planCardSelected: {
      borderColor: colors.success,
      backgroundColor: colors.success + '10',
      shadowColor: colors.success,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 4,
    },
    planCardPopular: {
      borderColor: colors.border,
    },
    popularBadge: {
      position: 'absolute' as const,
      top: -12,
      alignSelf: 'center',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: colors.primary,
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 12,
    },
    popularText: {
      fontSize: 12,
      fontWeight: '700' as const,
      color: colors.surface,
    },
    savingsBadge: {
      backgroundColor: colors.success + '20',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 8,
      alignSelf: 'flex-end',
      marginTop: 4,
    },
    savingsText: {
      fontSize: 12,
      fontWeight: '700' as const,
      color: colors.success,
    },
    planHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: 16,
    },
    planName: {
      fontSize: 22,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 4,
    },
    planDescription: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    planPriceContainer: {
      alignItems: 'flex-end',
    },
    planPriceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
    },
    planPrice: {
      fontSize: 28,
      fontWeight: '800' as const,
      color: colors.text,
    },
    planPeriod: {
      fontSize: 16,
      color: colors.textSecondary,
      marginLeft: 2,
    },
    planFeatures: {
      gap: 10,
    },
    featureRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    featureText: {
      fontSize: 15,
      color: colors.text,
      flex: 1,
    },

    benefitsSection: {
      marginBottom: 20,
    },
    benefitsTitle: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 16,
    },
    benefitsList: {
      gap: 16,
    },
    benefitItem: {
      flexDirection: 'row',
      gap: 12,
    },
    benefitIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.primaryLight + '30',
      alignItems: 'center',
      justifyContent: 'center',
    },
    benefitContent: {
      flex: 1,
    },
    benefitTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 4,
    },
    benefitDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    footer: {
      paddingHorizontal: 20,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      backgroundColor: colors.background,
    },
    upgradeButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: colors.primary,
      paddingVertical: 18,
      borderRadius: 16,
      marginBottom: 12,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    upgradeButtonText: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.surface,
    },
    disclaimer: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
    },
  });

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [scaleAnim]);

  const handleUpgrade = () => {
    upgradeToPremium(selectedPlan.period);
    router.replace('/(tabs)');
  };

  const handleClose = () => {
    if (isCaregiver) {
      return;
    }
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const paidPlans = PRICING_PLANS.filter(p => p.tier !== 'free');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {!isCaregiver && (
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={colors.text} />
          </TouchableOpacity>
        </View>
      )}

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Animated.View style={[styles.heroSection, { transform: [{ scale: scaleAnim }] }]}>
          <View style={styles.crownContainer}>
            <Crown size={48} color={colors.primary} />
          </View>
          <Text style={styles.heroTitle}>
            {isCaregiver ? 'Subscribe to Continue' : 'Unlock Your Full Potential'}
          </Text>
          <Text style={styles.heroSubtitle}>
            {isCaregiver
              ? 'Caregiver features require a premium subscription'
              : isInTrial 
                ? 'Continue your journey with Premium' 
                : 'Start your 7-day free trial'}
          </Text>
        </Animated.View>

        <View style={styles.plansContainer}>
          {paidPlans.map((plan) => {
            const isSelected = selectedPlan.id === plan.id;
            return (
              <TouchableOpacity
                key={plan.id}
                style={[
                  styles.planCard,
                  plan.popular && styles.planCardPopular,
                  isSelected && styles.planCardSelected,
                ]}
                onPress={() => setSelectedPlan(plan)}
                activeOpacity={0.7}
              >
                {plan.popular && (
                  <View style={styles.popularBadge}>
                    <Sparkles size={14} color={colors.surface} />
                    <Text style={styles.popularText}>Most Popular</Text>
                  </View>
                )}
                <View style={styles.planHeader}>
                  <View>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planDescription}>{plan.description}</Text>
                  </View>
                  <View style={styles.planPriceContainer}>
                    <View style={styles.planPriceRow}>
                      <Text style={styles.planPrice}>${plan.price}</Text>
                      <Text style={styles.planPeriod}>/{plan.period}</Text>
                    </View>
                    {plan.savings && (
                      <View style={styles.savingsBadge}>
                        <Text style={styles.savingsText}>{plan.savings}</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.planFeatures}>
                  {plan.features.map((feature, index) => (
                    <View key={index} style={styles.featureRow}>
                      <Check size={18} color={colors.success} />
                      <Text style={styles.featureText}>{feature}</Text>
                    </View>
                  ))}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.benefitsSection}>
          <Text style={styles.benefitsTitle}>Why Go Premium?</Text>
          <View style={styles.benefitsList}>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Zap size={20} color={colors.primary} />
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Unlimited Everything</Text>
                <Text style={styles.benefitDescription}>
                  Create unlimited tasks with AI-powered breakdowns
                </Text>
              </View>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Crown size={20} color={colors.primary} />
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Premium Features</Text>
                <Text style={styles.benefitDescription}>
                  Caregiver mode, analytics, custom reminders, and more
                </Text>
              </View>
            </View>
            <View style={styles.benefitItem}>
              <View style={styles.benefitIcon}>
                <Sparkles size={20} color={colors.primary} />
              </View>
              <View style={styles.benefitContent}>
                <Text style={styles.benefitTitle}>Priority Support</Text>
                <Text style={styles.benefitDescription}>
                  Get help when you need it with dedicated support
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={styles.upgradeButton}
          onPress={handleUpgrade}
          activeOpacity={0.8}
        >
          <Sparkles size={20} color={colors.surface} />
          <Text style={styles.upgradeButtonText}>
            {isCaregiver ? 'Subscribe Now' : isInTrial ? 'Continue with Premium' : 'Start Free Trial'}
          </Text>
        </TouchableOpacity>
        <Text style={styles.disclaimer}>
          {isCaregiver
            ? 'Subscription required for caregiver features'
            : isInTrial 
              ? 'Your trial will convert to the selected plan' 
              : 'Cancel anytime during your 7-day trial'}
        </Text>
      </View>
    </View>
  );
}
