import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';

import { Wind, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { breathingPatterns } from '@/constants/mentalHealthResources';
import { BreathingPattern } from '@/types/mentalHealth';
import BreathingExercise from '@/components/BreathingExercise';

export default function WellnessScreen() {
  const { colors } = useTheme();
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern | null>(null);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: colors.text,
    },
    backButton: {
      width: 60,
    },
    backButtonText: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: '600' as const,
    },
    exerciseHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingVertical: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    exerciseHeaderTitle: {
      fontSize: 20,
      fontWeight: '700' as const,
      color: colors.text,
      flex: 1,
      textAlign: 'center' as const,
    },
    backButtonLarge: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 12,
      backgroundColor: colors.primaryLight,
      minWidth: 80,
    },
    backButtonTextLarge: {
      fontSize: 16,
      color: colors.primary,
      fontWeight: '600' as const,
    },

    content: {
      flex: 1,
    },
    section: {
      paddingHorizontal: 20,
      paddingTop: 24,
      paddingBottom: 16,
    },

    sectionDescription: {
      fontSize: 15,
      color: colors.textSecondary,
      marginBottom: 24,
      lineHeight: 22,
    },
    breathingCard: {
      backgroundColor: colors.surface,
      borderRadius: 20,
      padding: 24,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 5,
    },
    breathingCardContent: {
      marginBottom: 12,
    },
    breathingCardTitle: {
      fontSize: 18,
      fontWeight: '700' as const,
      color: colors.text,
      marginBottom: 6,
    },
    breathingCardDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 12,
      lineHeight: 20,
    },
    breathingCardMeta: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    breathingCardMetaText: {
      fontSize: 13,
      color: colors.textLight,
      fontWeight: '500' as const,
    },
    breathingCardIndicator: {
      position: 'absolute' as const,
      right: 24,
      top: 24,
      width: 16,
      height: 16,
      borderRadius: 8,
    },
  });

  if (selectedPattern) {
    return (
      <View style={styles.container}>
        <View style={styles.exerciseHeader}>
          <TouchableOpacity
            style={styles.backButtonLarge}
            onPress={() => setSelectedPattern(null)}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={colors.primary} />
            <Text style={styles.backButtonTextLarge}>Back</Text>
          </TouchableOpacity>
          <Text style={styles.exerciseHeaderTitle}>{selectedPattern.name}</Text>
          <View style={styles.backButtonLarge} />
        </View>
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <BreathingExercise
            pattern={selectedPattern}
            onComplete={() => {
              console.log('Breathing exercise completed');
            }}
          />
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Wind size={28} color={colors.primary} />
        <Text style={styles.headerTitle}>Breathing Exercises</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionDescription}>
            Guided breathing exercises to reduce stress, calm anxiety, and improve focus. 
            Choose an exercise below to begin.
          </Text>
          {breathingPatterns.map((pattern) => (
            <TouchableOpacity
              key={pattern.id}
              style={[styles.breathingCard, { borderLeftColor: pattern.color }]}
              onPress={() => setSelectedPattern(pattern)}
              activeOpacity={0.7}
            >
              <View style={styles.breathingCardContent}>
                <Text style={styles.breathingCardTitle}>{pattern.name}</Text>
                <Text style={styles.breathingCardDescription}>{pattern.description}</Text>
                <View style={styles.breathingCardMeta}>
                  <Text style={styles.breathingCardMetaText}>
                    {pattern.inhale}s in • {pattern.exhale}s out • {pattern.cycles} cycles
                  </Text>
                </View>
              </View>
              <View style={[styles.breathingCardIndicator, { backgroundColor: pattern.color }]} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}


