import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Animated, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useRef, useEffect } from 'react';
import { router } from 'expo-router';
import { PurchasesPackage } from 'react-native-purchases';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { useTheme } from '@/contexts/ThemeContext';
import { revenueCatService } from '@/services/subscriptions/RevenueCatService';
import { X, Check, Sparkles, Crown, Zap, Shield, TrendingUp, RefreshCw } from 'lucide-react-native';
import { logger } from '@/utils/logger';

export default function RevenueCatPaywallScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { isPremium, isInTrial, purchasePackage, restorePurchases } = useSubscription();
  const { profile } = useUserProfile();
  const [packages, setPackages] = useState<PurchasesPackage[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<PurchasesPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);
  const [restoring, setRestoring] = useState(false);
  
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
    upgradeButtonDisabled: {
      backgroundColor: colors.textSecondary,
      opacity: 0.5,
    },
    upgradeButtonText: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.surface,
    },
    restoreButton: {
      paddingVertical: 12,
      marginBottom: 8,
      alignItems: 'center',
    },
    restoreButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.primary,
    },
    disclaimer: {
      fontSize: 13,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    loadingText: {
      fontSize: 16,
      color: colors.textSecondary,
      marginTop: 12,
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

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      setLoading(true);
      logger.info('[Paywall] Loading offerings');
      
      const offerings = await revenueCatService.getOfferings();
      
      if (offerings?.current) {
        const availablePackages = offerings.current.availablePackages;
        logger.info('[Paywall] Offerings loaded', { 
          packagesCount: availablePackages.length 
        });
        
        setPackages(availablePackages);
        
        if (availablePackages.length > 0) {
          const monthlyPackage = availablePackages.find(
            pkg => pkg.packageType === 'MONTHLY'
          ) || availablePackages[0];
          setSelectedPackage(monthlyPackage);
        }
      } else {
        logger.warn('[Paywall] No offerings available');
        Alert.alert(
          'No Products Available',
          'Unable to load subscription products. Please try again later or contact support.'
        );
      }
    } catch (error) {
      logger.error('[Paywall] Error loading offerings', error as Error);
      Alert.alert(
        'Error',
        'Failed to load subscription options. Please try again later.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async () => {
    if (!selectedPackage || purchasing) return;

    try {
      setPurchasing(true);
      logger.info('[Paywall] Starting purchase', { 
        packageId: selectedPackage.identifier 
      });

      const success = await purchasePackage(selectedPackage);

      if (success) {
        logger.info('[Paywall] Purchase successful');
        Alert.alert(
          'Welcome to Premium!',
          'Your subscription has been activated. Enjoy all premium features!',
          [
            {
              text: 'Get Started',
              onPress: () => router.replace('/(tabs)'),
            },
          ]
        );
      } else {
        logger.warn('[Paywall] Purchase was not completed');
      }
    } catch (error) {
      logger.error('[Paywall] Purchase error', error as Error);
      Alert.alert(
        'Purchase Failed',
        'Unable to complete your purchase. Please try again.'
      );
    } finally {
      setPurchasing(false);
    }
  };

  const handleRestore = async () => {
    try {
      setRestoring(true);
      logger.info('[Paywall] Restoring purchases');

      const success = await restorePurchases();

      if (success) {
        logger.info('[Paywall] Purchases restored successfully');
        Alert.alert(
          'Purchases Restored',
          'Your purchases have been restored successfully!',
          [
            {
              text: 'Continue',
              onPress: () => {
                if (isPremium) {
                  router.replace('/(tabs)');
                }
              },
            },
          ]
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'We couldn\'t find any previous purchases to restore.'
        );
      }
    } catch (error) {
      logger.error('[Paywall] Restore error', error as Error);
      Alert.alert(
        'Restore Failed',
        'Unable to restore purchases. Please try again.'
      );
    } finally {
      setRestoring(false);
    }
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

  const formatPrice = (pkg: PurchasesPackage): string => {
    return pkg.product.priceString;
  };

  const getPeriodText = (pkg: PurchasesPackage): string => {
    switch (pkg.packageType) {
      case 'MONTHLY':
        return '/month';
      case 'ANNUAL':
        return '/year';
      case 'WEEKLY':
        return '/week';
      case 'LIFETIME':
        return 'lifetime';
      default:
        return '';
    }
  };

  const getPackageName = (pkg: PurchasesPackage): string => {
    switch (pkg.packageType) {
      case 'MONTHLY':
        return 'Monthly';
      case 'ANNUAL':
        return 'Annual';
      case 'WEEKLY':
        return 'Weekly';
      case 'LIFETIME':
        return 'Lifetime';
      default:
        return pkg.identifier;
    }
  };

  const benefits = [
    {
      icon: Zap,
      title: 'AI-Powered Support',
      description: 'Personalized memory prompts, task breakdowns, and gentle guidance',
    },
    {
      icon: Crown,
      title: 'Memory & Cognitive Support',
      description: 'AI memory exercises, orientation reminders, and medication tracking',
    },
    {
      icon: Shield,
      title: 'Caregiver Features',
      description: 'Full access to caregiver dashboard and patient management',
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Track progress with detailed insights and reports',
    },
  ];

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
                : 'Get access to all premium features'}
          </Text>
        </Animated.View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <Sparkles size={32} color={colors.primary} />
            <Text style={styles.loadingText}>Loading subscription options...</Text>
          </View>
        ) : packages.length === 0 ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>No subscription options available</Text>
            <TouchableOpacity 
              style={[styles.restoreButton, { marginTop: 20 }]} 
              onPress={loadOfferings}
            >
              <Text style={styles.restoreButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.plansContainer}>
              {packages.map((pkg, index) => {
                const isSelected = selectedPackage?.identifier === pkg.identifier;
                const isPopular = pkg.packageType === 'MONTHLY';
                
                return (
                  <TouchableOpacity
                    key={pkg.identifier}
                    style={[
                      styles.planCard,
                      isSelected && styles.planCardSelected,
                    ]}
                    onPress={() => setSelectedPackage(pkg)}
                    activeOpacity={0.7}
                  >
                    {isPopular && (
                      <View style={styles.popularBadge}>
                        <Sparkles size={14} color={colors.surface} />
                        <Text style={styles.popularText}>Most Popular</Text>
                      </View>
                    )}
                    <View style={styles.planHeader}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.planName}>{getPackageName(pkg)}</Text>
                        <Text style={styles.planDescription}>
                          {pkg.product.introPrice?.priceString 
                            ? `Start with ${pkg.product.introPrice.priceString} trial` 
                            : 'Full access to all features'}
                        </Text>
                      </View>
                      <View style={styles.planPriceContainer}>
                        <View style={styles.planPriceRow}>
                          <Text style={styles.planPrice}>{formatPrice(pkg)}</Text>
                          <Text style={styles.planPeriod}>{getPeriodText(pkg)}</Text>
                        </View>
                      </View>
                    </View>
                    <View style={{ gap: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Check size={16} color={colors.success} />
                        <Text style={{ fontSize: 14, color: colors.text }}>
                          Unlimited AI features
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Check size={16} color={colors.success} />
                        <Text style={{ fontSize: 14, color: colors.text }}>
                          Caregiver dashboard
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <Check size={16} color={colors.success} />
                        <Text style={{ fontSize: 14, color: colors.text }}>
                          Priority support
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <View style={styles.benefitsSection}>
              <Text style={styles.benefitsTitle}>Why Go Premium?</Text>
              <View style={styles.benefitsList}>
                {benefits.map((benefit, index) => {
                  const IconComponent = benefit.icon;
                  return (
                    <View key={index} style={styles.benefitItem}>
                      <View style={styles.benefitIcon}>
                        <IconComponent size={20} color={colors.primary} />
                      </View>
                      <View style={styles.benefitContent}>
                        <Text style={styles.benefitTitle}>{benefit.title}</Text>
                        <Text style={styles.benefitDescription}>{benefit.description}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </View>
          </>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={[
            styles.upgradeButton,
            (purchasing || !selectedPackage) && styles.upgradeButtonDisabled,
          ]}
          onPress={handlePurchase}
          disabled={purchasing || !selectedPackage}
          activeOpacity={0.8}
        >
          {purchasing ? (
            <RefreshCw size={20} color={colors.surface} />
          ) : (
            <Sparkles size={20} color={colors.surface} />
          )}
          <Text style={styles.upgradeButtonText}>
            {purchasing ? 'Processing...' : 'Subscribe Now'}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.restoreButton}
          onPress={handleRestore}
          disabled={restoring}
        >
          <Text style={styles.restoreButtonText}>
            {restoring ? 'Restoring...' : 'Restore Purchases'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          {selectedPackage?.product.introPrice
            ? `Free trial converts to ${formatPrice(selectedPackage)}${getPeriodText(selectedPackage)}. Cancel anytime.`
            : 'Subscription renews automatically. Cancel anytime in settings.'}
        </Text>
      </View>
    </View>
  );
}
