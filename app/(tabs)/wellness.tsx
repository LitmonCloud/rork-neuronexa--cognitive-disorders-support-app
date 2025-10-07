import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Wind, Hand, Heart } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { breathingPatterns } from '@/constants/mentalHealthResources';

const { width } = Dimensions.get('window');

export default function WellnessScreen() {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 24,
      paddingTop: 20,
      paddingBottom: 24,
      backgroundColor: colors.surface,
    },
    headerTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      marginBottom: 8,
    },
    headerIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${colors.primary}15`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 32,
      fontWeight: '800' as const,
      color: colors.text,
      flex: 1,
    },
    headerSubtitle: {
      fontSize: 16,
      color: colors.textSecondary,
      lineHeight: 24,
      marginTop: 4,
    },

    content: {
      flex: 1,
    },
    section: {
      paddingHorizontal: 20,
      paddingTop: 8,
      paddingBottom: 24,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 16,
      marginTop: 16,
    },
    heroCard: {
      backgroundColor: colors.primary,
      borderRadius: 24,
      padding: 28,
      marginBottom: 24,
      overflow: 'hidden',
    },
    heroCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 20,
    },
    heroCardIcon: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroCardText: {
      flex: 1,
    },
    heroCardTitle: {
      fontSize: 22,
      fontWeight: '800' as const,
      color: '#FFFFFF',
      marginBottom: 6,
    },
    heroCardDescription: {
      fontSize: 15,
      color: 'rgba(255, 255, 255, 0.9)',
      lineHeight: 22,
    },
    breathingGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 8,
    },
    breathingCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 20,
      width: (width - 52) / 2,
      borderWidth: 2,
      borderColor: colors.border,
      minHeight: 180,
    },
    breathingCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    breathingCardIconSmall: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    breathingCardTitle: {
      fontSize: 17,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 6,
    },
    breathingCardDescription: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 12,
      lineHeight: 18,
      flex: 1,
    },
    breathingCardMeta: {
      paddingTop: 12,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    breathingCardMetaText: {
      fontSize: 12,
      color: colors.textLight,
      fontWeight: '600' as const,
    },
    featureCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: colors.border,
    },
    featureCardContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
    },
    featureCardIcon: {
      width: 64,
      height: 64,
      borderRadius: 32,
      alignItems: 'center',
      justifyContent: 'center',
    },
    featureCardText: {
      flex: 1,
    },
    featureCardTitle: {
      fontSize: 19,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 6,
    },
    featureCardDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    featureCardArrow: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: colors.primaryLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    aiButton: {
      backgroundColor: colors.primary,
      borderRadius: 12,
      padding: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    aiButtonText: {
      fontSize: 14,
      fontWeight: '600' as const,
      color: colors.surface,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 24,
    },
    statCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
      alignItems: 'center',
    },
    statValue: {
      fontSize: 28,
      fontWeight: '800' as const,
      color: colors.primary,
      marginBottom: 4,
    },
    statLabel: {
      fontSize: 12,
      color: colors.textSecondary,
      fontWeight: '600' as const,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerIcon}>
            <Heart size={28} color={colors.primary} />
          </View>
          <Text style={styles.headerTitle}>Wellness</Text>
        </View>
        <Text style={styles.headerSubtitle}>
          Mindfulness exercises to reduce stress and improve focus
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.heroCard}
            onPress={() => router.push('/finger-trace')}
            activeOpacity={0.85}
          >
            <View style={styles.heroCardContent}>
              <View style={styles.heroCardIcon}>
                <Hand size={40} color="#FFFFFF" />
              </View>
              <View style={styles.heroCardText}>
                <Text style={styles.heroCardTitle}>Finger Tracing</Text>
                <Text style={styles.heroCardDescription}>
                  Interactive exercises for mindfulness and focus
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Breathing Exercises</Text>
          
          <View style={styles.breathingGrid}>
            {breathingPatterns.map((pattern) => (
              <TouchableOpacity
                key={pattern.id}
                style={[styles.breathingCard, { borderColor: pattern.color }]}
                onPress={() => router.push(`/breathing-exercise?patternId=${pattern.id}`)}
                activeOpacity={0.7}
              >
                <View style={styles.breathingCardHeader}>
                  <View style={[styles.breathingCardIconSmall, { backgroundColor: `${pattern.color}20` }]}>
                    <Wind size={20} color={pattern.color} />
                  </View>
                </View>
                <Text style={styles.breathingCardTitle}>{pattern.name}</Text>
                <Text style={styles.breathingCardDescription}>{pattern.description}</Text>
                <View style={styles.breathingCardMeta}>
                  <Text style={styles.breathingCardMetaText}>
                    {pattern.inhale}s • {pattern.exhale}s • {pattern.cycles}x
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}


