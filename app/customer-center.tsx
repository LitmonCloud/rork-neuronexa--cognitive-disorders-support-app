import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState } from 'react';
import { router } from 'expo-router';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { useTheme } from '@/contexts/ThemeContext';
import { revenueCatService } from '@/services/subscriptions/RevenueCatService';
import { 
  ArrowLeft, 
  Crown, 
  Calendar, 
  CreditCard, 
  RefreshCw, 
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Info
} from 'lucide-react-native';
import { logger } from '@/utils/logger';

export default function CustomerCenterScreen() {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { subscription, isPremium, customerInfo, restorePurchases } = useSubscription();
  const [restoring, setRestoring] = useState(false);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      paddingTop: insets.top + 10,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      backgroundColor: colors.surface,
    },
    backButton: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: colors.surfaceTint,
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 12,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
    },
    scrollView: {
      flex: 1,
    },
    content: {
      padding: 20,
    },
    statusCard: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 20,
      marginBottom: 24,
      borderWidth: 2,
    },
    statusCardPremium: {
      borderColor: colors.success,
      backgroundColor: colors.success + '10',
    },
    statusCardFree: {
      borderColor: colors.border,
    },
    statusHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      gap: 12,
    },
    statusIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statusIconPremium: {
      backgroundColor: colors.success + '20',
    },
    statusIconFree: {
      backgroundColor: colors.textSecondary + '20',
    },
    statusTitle: {
      fontSize: 24,
      fontWeight: '800' as const,
      color: colors.text,
    },
    statusSubtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginTop: 2,
    },
    statusDetails: {
      gap: 12,
    },
    detailRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    detailLabel: {
      fontSize: 14,
      color: colors.textSecondary,
    },
    detailValue: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.text,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 12,
    },
    actionCard: {
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: colors.border,
    },
    actionContent: {
      flex: 1,
      marginRight: 12,
    },
    actionTitle: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 4,
    },
    actionDescription: {
      fontSize: 13,
      color: colors.textSecondary,
    },
    infoCard: {
      backgroundColor: colors.primary + '10',
      borderRadius: 12,
      padding: 16,
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    infoIcon: {
      marginTop: 2,
    },
    infoContent: {
      flex: 1,
    },
    infoTitle: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.text,
      marginBottom: 4,
    },
    infoText: {
      fontSize: 13,
      color: colors.textSecondary,
      lineHeight: 18,
    },
    upgradeButton: {
      backgroundColor: colors.primary,
      paddingVertical: 16,
      paddingHorizontal: 24,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 8,
      shadowColor: colors.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
    upgradeButtonText: {
      fontSize: 16,
      fontWeight: '700' as const,
      color: colors.surface,
    },
  });

  const handleManageSubscription = async () => {
    try {
      logger.info('[CustomerCenter] Opening management URL');
      const url = await revenueCatService.getManagementURL();
      
      if (url) {
        const canOpen = await Linking.canOpenURL(url);
        if (canOpen) {
          await Linking.openURL(url);
        } else {
          Alert.alert(
            'Unable to Open',
            'Please manage your subscription through the App Store or Google Play Store.'
          );
        }
      } else {
        Alert.alert(
          'Management Unavailable',
          'Please manage your subscription through the App Store or Google Play Store.'
        );
      }
    } catch (error) {
      logger.error('[CustomerCenter] Error opening management URL', error as Error);
      Alert.alert(
        'Error',
        'Unable to open subscription management. Please try again.'
      );
    }
  };

  const handleRestore = async () => {
    try {
      setRestoring(true);
      logger.info('[CustomerCenter] Restoring purchases');

      const success = await restorePurchases();

      if (success) {
        Alert.alert(
          'Success',
          'Your purchases have been restored successfully!'
        );
      } else {
        Alert.alert(
          'No Purchases Found',
          'We couldn\'t find any previous purchases to restore.'
        );
      }
    } catch (error) {
      logger.error('[CustomerCenter] Restore error', error as Error);
      Alert.alert(
        'Restore Failed',
        'Unable to restore purchases. Please try again.'
      );
    } finally {
      setRestoring(false);
    }
  };

  const handleUpgrade = () => {
    router.push('/paywall-revenuecat');
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getSubscriptionStatus = () => {
    if (isPremium) {
      return {
        title: 'Premium Active',
        subtitle: 'Enjoying all features',
        icon: Crown,
        color: colors.success,
      };
    }
    return {
      title: 'Free Plan',
      subtitle: 'Upgrade to unlock all features',
      icon: AlertCircle,
      color: colors.textSecondary,
    };
  };

  const status = getSubscriptionStatus();
  const StatusIcon = status.icon;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Subscription</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={[
          styles.statusCard,
          isPremium ? styles.statusCardPremium : styles.statusCardFree
        ]}>
          <View style={styles.statusHeader}>
            <View style={[
              styles.statusIcon,
              isPremium ? styles.statusIconPremium : styles.statusIconFree
            ]}>
              <StatusIcon size={24} color={status.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statusTitle}>{status.title}</Text>
              <Text style={styles.statusSubtitle}>{status.subtitle}</Text>
            </View>
          </View>

          {isPremium && subscription.expiryDate && (
            <View style={styles.statusDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Renewal Date</Text>
                <Text style={styles.detailValue}>{formatDate(subscription.expiryDate)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Status</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <CheckCircle size={16} color={colors.success} />
                  <Text style={[styles.detailValue, { color: colors.success }]}>Active</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {!isPremium && (
          <View style={styles.infoCard}>
            <Info size={20} color={colors.primary} style={styles.infoIcon} />
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>Upgrade to Premium</Text>
              <Text style={styles.infoText}>
                Get unlimited access to AI features, caregiver dashboard, advanced analytics, and more!
              </Text>
              <TouchableOpacity 
                style={styles.upgradeButton} 
                onPress={handleUpgrade}
                activeOpacity={0.8}
              >
                <Text style={styles.upgradeButtonText}>View Premium Plans</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription Management</Text>

          {isPremium && (
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={handleManageSubscription}
              activeOpacity={0.7}
            >
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Manage Subscription</Text>
                <Text style={styles.actionDescription}>
                  Update payment, cancel, or change plan
                </Text>
              </View>
              <ExternalLink size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}

          <TouchableOpacity 
            style={styles.actionCard}
            onPress={handleRestore}
            disabled={restoring}
            activeOpacity={0.7}
          >
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Restore Purchases</Text>
              <Text style={styles.actionDescription}>
                {restoring ? 'Restoring...' : 'Sync purchases from another device'}
              </Text>
            </View>
            <RefreshCw size={20} color={colors.textSecondary} />
          </TouchableOpacity>
        </View>

        {customerInfo && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account Information</Text>
            
            <View style={styles.actionCard}>
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Customer ID</Text>
                <Text style={styles.actionDescription} numberOfLines={1}>
                  {customerInfo.originalAppUserId}
                </Text>
              </View>
            </View>
            
            {customerInfo.activeSubscriptions.length > 0 && (
              <View style={styles.actionCard}>
                <View style={styles.actionContent}>
                  <Text style={styles.actionTitle}>Active Subscriptions</Text>
                  <Text style={styles.actionDescription}>
                    {customerInfo.activeSubscriptions.join(', ')}
                  </Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
