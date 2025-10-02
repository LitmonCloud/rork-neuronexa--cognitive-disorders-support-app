import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { useSubscription } from '@/contexts/SubscriptionContext';
import colors from '@/constants/colors';
import { Lock, Crown, Sparkles } from 'lucide-react-native';
import { ReactNode } from 'react';

interface PremiumGateProps {
  children: ReactNode;
  feature: string;
  featureDescription: string;
}

export default function PremiumGate({ children, feature, featureDescription }: PremiumGateProps) {
  const { isPremium, isInTrial } = useSubscription();

  if (isPremium || isInTrial) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.lockContainer}>
        <View style={styles.lockIconWrapper}>
          <Lock size={48} color={colors.primary} />
        </View>
        <Crown size={32} color={colors.primary} style={styles.crownIcon} />
      </View>

      <Text style={styles.title}>Premium Feature</Text>
      <Text style={styles.featureName}>{feature}</Text>
      <Text style={styles.description}>{featureDescription}</Text>

      <TouchableOpacity
        style={styles.upgradeButton}
        onPress={() => router.push('/paywall')}
        activeOpacity={0.8}
      >
        <Sparkles size={20} color={colors.surface} />
        <Text style={styles.upgradeButtonText}>Unlock with Premium</Text>
      </TouchableOpacity>

      <View style={styles.benefitsList}>
        <View style={styles.benefitItem}>
          <View style={styles.benefitDot} />
          <Text style={styles.benefitText}>Unlimited tasks & AI breakdowns</Text>
        </View>
        <View style={styles.benefitItem}>
          <View style={styles.benefitDot} />
          <Text style={styles.benefitText}>Advanced analytics & insights</Text>
        </View>
        <View style={styles.benefitItem}>
          <View style={styles.benefitDot} />
          <Text style={styles.benefitText}>Priority support</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  lockContainer: {
    position: 'relative' as const,
    marginBottom: 32,
  },
  lockIconWrapper: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.primaryLight + '20',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crownIcon: {
    position: 'absolute' as const,
    top: -10,
    right: -10,
  },
  title: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: colors.textSecondary,
    textTransform: 'uppercase' as const,
    letterSpacing: 1,
    marginBottom: 8,
  },
  featureName: {
    fontSize: 32,
    fontWeight: '800' as const,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 17,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 32,
  },
  upgradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 32,
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
  benefitsList: {
    gap: 12,
    alignSelf: 'stretch',
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  benefitText: {
    fontSize: 15,
    color: colors.text,
  },
});
