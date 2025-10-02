import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, router } from 'expo-router';
import { ArrowLeft, Sparkles, Filter } from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontSizes, fontWeights } from '@/theme/typography';
import { traceExercises } from '@/constants/traceExercises';
import { TraceExercise, TraceSession } from '@/types/fingerTrace';
import FingerTraceExercise from '@/components/FingerTraceExercise';

const TRACE_SESSIONS_KEY = '@neuronexa_trace_sessions';

export default function FingerTraceScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedExercise, setSelectedExercise] = useState<TraceExercise | null>(null);
  const [filterDifficulty, setFilterDifficulty] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');

  const saveSession = useCallback(async (session: TraceSession) => {
    try {
      const stored = await AsyncStorage.getItem(TRACE_SESSIONS_KEY);
      const sessions: TraceSession[] = stored ? JSON.parse(stored) : [];
      sessions.push(session);
      await AsyncStorage.setItem(TRACE_SESSIONS_KEY, JSON.stringify(sessions));
      console.log('[Progress] Finger trace session saved:', session);
    } catch (error) {
      console.error('[Progress] Error saving trace session:', error);
    }
  }, []);

  const handleExerciseComplete = useCallback((session: TraceSession) => {
    console.log('[Analytics] Exercise completed with accuracy:', session.accuracy);
    saveSession(session);
    setTimeout(() => {
      setSelectedExercise(null);
    }, 2000);
  }, [saveSession]);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      paddingTop: insets.top,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    backButton: {
      padding: spacing.sm,
    },
    headerTitle: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    content: {
      flex: 1,
    },
    intro: {
      padding: spacing.xl,
      backgroundColor: colors.primaryLight,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    introTitle: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.primary,
      marginBottom: spacing.sm,
    },
    introText: {
      fontSize: fontSizes.md,
      color: colors.text,
      lineHeight: 22,
    },
    filterContainer: {
      flexDirection: 'row',
      gap: spacing.sm,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    filterButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: borderRadius.round,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.background,
    },
    filterButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterButtonText: {
      fontSize: fontSizes.sm,
      fontWeight: fontWeights.semibold,
      color: colors.textSecondary,
    },
    filterButtonTextActive: {
      color: colors.surface,
    },
    exerciseList: {
      padding: spacing.lg,
    },
    exerciseCard: {
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      padding: spacing.lg,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: colors.border,
      borderLeftWidth: 4,
    },
    exerciseCardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing.sm,
    },
    exerciseCardTitle: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
      flex: 1,
    },
    difficultyBadge: {
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    difficultyText: {
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.bold,
    },
    exerciseDescription: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: spacing.md,
    },
    exerciseMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
    },
    metaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    metaText: {
      fontSize: fontSizes.xs,
      color: colors.textLight,
      fontWeight: fontWeights.medium,
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: spacing.xxxl,
    },
    emptyStateText: {
      fontSize: fontSizes.md,
      color: colors.textSecondary,
      textAlign: 'center' as const,
    },
  });

  const filteredExercises = traceExercises.filter(ex => 
    filterDifficulty === 'all' || ex.difficulty === filterDifficulty
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return '#50C878';
      case 'medium': return '#FFB347';
      case 'hard': return '#E74C3C';
      default: return colors.primary;
    }
  };

  if (selectedExercise) {
    return (
      <View style={styles.container}>
        <Stack.Screen options={{ headerShown: false }} />
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setSelectedExercise(null)}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Finger Trace Exercise</Text>
            <View style={{ width: 40 }} />
          </View>
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <FingerTraceExercise
              exercise={selectedExercise}
              onComplete={handleExerciseComplete}
            />
          </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <ArrowLeft size={24} color={colors.primary} />
            </TouchableOpacity>
            <Sparkles size={28} color={colors.primary} />
            <Text style={styles.headerTitle}>Finger Tracing</Text>
          </View>
        </View>

        <View style={styles.intro}>
          <Text style={styles.introTitle}>Interactive Mindfulness</Text>
          <Text style={styles.introText}>
            Trace shapes, letters, and patterns with your finger to calm your mind, 
            improve focus, and practice mindful movement. Perfect for anxiety relief 
            and sensory regulation.
          </Text>
        </View>

        <View style={styles.filterContainer}>
          <Filter size={20} color={colors.textSecondary} />
          {(['all', 'easy', 'medium', 'hard'] as const).map((difficulty) => (
            <TouchableOpacity
              key={difficulty}
              style={[
                styles.filterButton,
                filterDifficulty === difficulty && styles.filterButtonActive,
              ]}
              onPress={() => setFilterDifficulty(difficulty)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  filterDifficulty === difficulty && styles.filterButtonTextActive,
                ]}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.exerciseList}>
            {filteredExercises.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  No exercises found for this difficulty level.
                </Text>
              </View>
            ) : (
              filteredExercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.id}
                  style={[
                    styles.exerciseCard,
                    { borderLeftColor: exercise.color },
                  ]}
                  onPress={() => setSelectedExercise(exercise)}
                  activeOpacity={0.7}
                >
                  <View style={styles.exerciseCardHeader}>
                    <Text style={styles.exerciseCardTitle}>{exercise.name}</Text>
                    <View
                      style={[
                        styles.difficultyBadge,
                        { backgroundColor: getDifficultyColor(exercise.difficulty) + '20' },
                      ]}
                    >
                      <Text
                        style={[
                          styles.difficultyText,
                          { color: getDifficultyColor(exercise.difficulty) },
                        ]}
                      >
                        {exercise.difficulty.toUpperCase()}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.exerciseDescription}>
                    {exercise.description}
                  </Text>
                  <View style={styles.exerciseMeta}>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaText}>
                        {exercise.type === 'shape' ? '🔷' : exercise.type === 'letter' ? '🔤' : '🔢'} {exercise.type}
                      </Text>
                    </View>
                    <View style={styles.metaItem}>
                      <Text style={styles.metaText}>⏱️ ~{exercise.duration}s</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        </ScrollView>
    </View>
  );
}
