import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { Play, RotateCcw, CheckCircle, Award } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontSizes, fontWeights } from '@/theme/typography';
import { TraceExercise, TraceSession } from '@/types/fingerTrace';
import { TracingCanvas, TraceStats, Stroke } from './TracingCanvas';
import { GuideKind } from '../logic/shapes';

interface FingerTraceExerciseProps {
  exercise: TraceExercise;
  onComplete?: (session: TraceSession) => void;
}

export default function FingerTraceExercise({ exercise, onComplete }: FingerTraceExerciseProps) {
  const { colors } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [completedLoops, setCompletedLoops] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [key, setKey] = useState(0);

  const { width } = Dimensions.get('window');
  const canvasSize = Math.min(width * 0.85, 400);

  const styles = useMemo(() => createStyles(colors, canvasSize), [colors, canvasSize]);

  const requiredLoops = exercise.difficulty === 'easy' ? 3 : exercise.difficulty === 'medium' ? 4 : 5;

  const triggerHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  }, []);

  const triggerSuccessHaptic = useCallback(() => {
    if (Platform.OS !== 'web') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  const mapShapeToGuide = (shape?: string): GuideKind => {
    switch (shape) {
      case 'circle':
        return 'circle';
      case 'square':
        return 'square';
      case 'triangle':
        return 'triangle';
      case 'star':
        return 'star';
      case 'heart':
        return 'heart';
      case 'infinity':
        return 'infinity';
      case 'spiral':
        return 'spiral';
      default:
        return 'circle';
    }
  };

  const handleStats = useCallback(
    (stats: TraceStats) => {
      setCompletedLoops(stats.loops);
      setAccuracy(stats.accuracy);

      console.log('[Trace] Stats updated:', stats);

      if (stats.loops >= requiredLoops && !isCompleted) {
        setIsActive(false);
        setIsCompleted(true);
        triggerSuccessHaptic();

        const session: TraceSession = {
          exerciseId: exercise.id,
          startTime: startTime || Date.now(),
          endTime: Date.now(),
          accuracy: stats.accuracy,
          completed: true,
          paths: [],
        };

        const duration = Math.floor((Date.now() - (startTime || Date.now())) / 1000);

        console.log('[Analytics] Finger trace completed:', {
          exerciseId: exercise.id,
          exerciseName: exercise.name,
          difficulty: exercise.difficulty,
          type: exercise.type,
          accuracy: stats.accuracy,
          duration,
          loops: stats.loops,
        });

        onComplete?.(session);
      }
    },
    [requiredLoops, isCompleted, exercise, startTime, onComplete, triggerSuccessHaptic]
  );

  const handleStrokeEnd = useCallback(
    (stroke: Stroke, stats: TraceStats) => {
      console.log('[Trace] Stroke ended:', stroke.points.length, 'points');
      triggerHaptic();
    },
    [triggerHaptic]
  );

  const handleStart = useCallback(() => {
    setIsActive(true);
    setIsCompleted(false);
    setCompletedLoops(0);
    setAccuracy(100);
    setStartTime(Date.now());
    setKey((prev) => prev + 1);
    triggerHaptic();

    console.log('[Analytics] Finger trace started:', {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      difficulty: exercise.difficulty,
      type: exercise.type,
    });
  }, [triggerHaptic, exercise]);

  const handleReset = useCallback(() => {
    setIsActive(false);
    setIsCompleted(false);
    setCompletedLoops(0);
    setAccuracy(100);
    setStartTime(null);
    setKey((prev) => prev + 1);
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: exercise.color + '20' }]}>
            <Text style={[styles.badgeText, { color: exercise.color }]}>
              {exercise.difficulty.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.title}>{exercise.name}</Text>
        </View>

        <Text style={styles.description}>{exercise.description}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Loops</Text>
            <Text style={styles.statValue}>
              {completedLoops}/{requiredLoops}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Accuracy</Text>
            <Text style={[styles.statValue, { color: exercise.color }]}>{accuracy}%</Text>
          </View>
        </View>

        <View style={styles.canvasContainer}>
          {isActive && (
            <TracingCanvas
              key={key}
              guide={mapShapeToGuide(exercise.shape)}
              targetLoops={requiredLoops}
              strokeColor={exercise.color}
              tolerancePx={18}
              onStats={handleStats}
              onStrokeEnd={handleStrokeEnd}
            />
          )}
          {!isActive && (
            <View style={styles.placeholderCanvas}>
              <Text style={styles.placeholderText}>
                {isCompleted ? '✓ Complete!' : 'Press Start to Begin'}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.instructionContainer}>
          <Text style={styles.instructionTitle}>
            {isCompleted ? 'Great job!' : isActive ? 'Trace the shape' : 'Instructions:'}
          </Text>
          {!isActive && !isCompleted && (
            <View style={styles.instructionList}>
              {exercise.instructions.map((instruction, index) => (
                <Text key={index} style={styles.instructionText}>
                  {index + 1}. {instruction}
                </Text>
              ))}
            </View>
          )}
          {isActive && (
            <Text style={styles.activeInstruction}>
              Follow the outline with your finger. Complete {requiredLoops} loops.
            </Text>
          )}
          {isCompleted && (
            <Text style={styles.completionMessage}>
              You completed {requiredLoops} loops with {accuracy}% accuracy!
            </Text>
          )}
        </View>

        {!isActive && !isCompleted && (
          <View style={styles.benefitsContainer}>
            <View style={styles.benefitsHeader}>
              <Award size={20} color={colors.primary} />
              <Text style={styles.benefitsTitle}>Benefits:</Text>
            </View>
            {exercise.benefits.map((benefit, index) => (
              <Text key={index} style={styles.benefitText}>
                • {benefit}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={styles.controls}>
        {!isActive && !isCompleted && (
          <TouchableOpacity
            style={[styles.controlButton, styles.primaryButton, { backgroundColor: exercise.color }]}
            onPress={handleStart}
            activeOpacity={0.7}
          >
            <Play size={20} color={colors.surface} fill={colors.surface} />
            <Text style={styles.primaryButtonText}>Start Exercise</Text>
          </TouchableOpacity>
        )}

        {(isActive || isCompleted) && (
          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={handleReset}
            activeOpacity={0.7}
          >
            <RotateCcw size={20} color={exercise.color} />
            <Text style={[styles.secondaryButtonText, { color: exercise.color }]}>
              {isCompleted ? 'Try Again' : 'Reset'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {isCompleted && (
        <View style={styles.completionOverlay}>
          <CheckCircle size={80} color={exercise.color} fill={exercise.color} />
          <Text style={[styles.completionText, { color: exercise.color }]}>Complete!</Text>
        </View>
      )}
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors'], canvasSize: number) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      marginBottom: spacing.md,
      paddingHorizontal: spacing.xl,
      paddingTop: spacing.xl,
    },
    badge: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      borderRadius: borderRadius.sm,
    },
    badgeText: {
      fontSize: fontSizes.xs,
      fontWeight: fontWeights.bold,
    },
    title: {
      fontSize: fontSizes.xxl,
      fontWeight: fontWeights.bold,
      color: colors.text,
      flex: 1,
    },
    description: {
      fontSize: fontSizes.md,
      color: colors.textSecondary,
      lineHeight: 22,
      marginBottom: spacing.lg,
      paddingHorizontal: spacing.xl,
    },
    statsContainer: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.xl,
      paddingHorizontal: spacing.xl,
    },
    statBox: {
      flex: 1,
      backgroundColor: colors.surface,
      padding: spacing.md,
      borderRadius: borderRadius.md,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    statLabel: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      marginBottom: spacing.xs,
    },
    statValue: {
      fontSize: fontSizes.xl,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    canvasContainer: {
      alignItems: 'center',
      marginVertical: spacing.xl,
      paddingHorizontal: spacing.md,
    },
    placeholderCanvas: {
      width: canvasSize,
      height: 320,
      backgroundColor: 'rgba(20,20,28,0.9)',
      borderRadius: 22,
      justifyContent: 'center',
      alignItems: 'center',
    },
    placeholderText: {
      fontSize: fontSizes.lg,
      color: 'rgba(255,255,255,0.5)',
      fontWeight: fontWeights.semibold,
    },
    instructionContainer: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.lg,
      marginHorizontal: spacing.xl,
    },
    instructionTitle: {
      fontSize: fontSizes.lg,
      fontWeight: fontWeights.bold,
      color: colors.text,
      marginBottom: spacing.md,
    },
    instructionList: {
      gap: spacing.sm,
    },
    instructionText: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    activeInstruction: {
      fontSize: fontSizes.md,
      color: colors.text,
      lineHeight: 22,
    },
    completionMessage: {
      fontSize: fontSizes.md,
      color: colors.text,
      lineHeight: 22,
    },
    controls: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingBottom: spacing.lg,
      paddingHorizontal: spacing.xl,
      backgroundColor: colors.background,
      borderTopWidth: 1,
      borderTopColor: colors.border,
    },
    controlButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.sm,
      paddingVertical: spacing.lg,
      borderRadius: borderRadius.md,
    },
    primaryButton: {
      backgroundColor: colors.primary,
    },
    secondaryButton: {
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    primaryButtonText: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      color: colors.surface,
    },
    secondaryButtonText: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.semibold,
      color: colors.primary,
    },
    benefitsContainer: {
      backgroundColor: colors.surface,
      padding: spacing.lg,
      borderRadius: borderRadius.lg,
      borderWidth: 1,
      borderColor: colors.border,
      marginHorizontal: spacing.xl,
      marginBottom: spacing.xl,
    },
    benefitsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.sm,
      marginBottom: spacing.md,
    },
    benefitsTitle: {
      fontSize: fontSizes.md,
      fontWeight: fontWeights.bold,
      color: colors.text,
    },
    benefitText: {
      fontSize: fontSizes.sm,
      color: colors.textSecondary,
      lineHeight: 20,
      marginBottom: spacing.xs,
    },
    completionOverlay: {
      position: 'absolute',
      top: '40%',
      left: 0,
      right: 0,
      alignItems: 'center',
      justifyContent: 'center',
    },
    completionText: {
      fontSize: fontSizes.xxl,
      fontWeight: fontWeights.bold,
      marginTop: spacing.md,
    },
  });
