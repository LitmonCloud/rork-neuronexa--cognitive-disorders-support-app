import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Play, Pause, RotateCcw, Hand } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontSizes, fontWeights } from '@/theme/typography';

type FingerPhase = 'thumb' | 'index' | 'middle' | 'ring' | 'pinky' | 'complete';

interface FingerTraceBreathingProps {
  onComplete?: () => void;
}

export default function FingerTraceBreathing({ onComplete }: FingerTraceBreathingProps) {
  const { colors } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<FingerPhase>('thumb');
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [timeLeft, setTimeLeft] = useState(4);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;

  const { width } = Dimensions.get('window');
  const handSize = Math.min(width * 0.7, 300);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const fingerSequence: FingerPhase[] = ['thumb', 'index', 'middle', 'ring', 'pinky'];

  const triggerHaptic = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          triggerHaptic();
          
          if (direction === 'up') {
            const currentIndex = fingerSequence.indexOf(phase as FingerPhase);
            if (currentIndex === fingerSequence.length - 1) {
              setDirection('down');
              return 4;
            } else {
              setPhase(fingerSequence[currentIndex + 1]);
              return 4;
            }
          } else {
            const currentIndex = fingerSequence.indexOf(phase as FingerPhase);
            if (currentIndex === 0) {
              setPhase('complete');
              setIsActive(false);
              onComplete?.();
              return 4;
            } else {
              setPhase(fingerSequence[currentIndex - 1]);
              return 4;
            }
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, phase, direction]);

  useEffect(() => {
    if (!isActive) return;

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [isActive]);

  const handleStart = () => {
    setIsActive(true);
    setPhase('thumb');
    setDirection('up');
    setTimeLeft(4);
    triggerHaptic();
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('thumb');
    setDirection('up');
    setTimeLeft(4);
    scaleAnim.setValue(1);
    glowAnim.setValue(0);
  };

  const getInstructionText = (): string => {
    if (phase === 'complete') {
      return 'Great job! You completed the exercise.';
    }
    
    const fingerName = phase.charAt(0).toUpperCase() + phase.slice(1);
    return direction === 'up' 
      ? `Trace up your ${fingerName} finger - Breathe In`
      : `Trace down your ${fingerName} finger - Breathe Out`;
  };

  const getFingerPosition = (finger: FingerPhase): { left: number; bottom: number } => {
    const positions = {
      thumb: { left: 0.15, bottom: 0.2 },
      index: { left: 0.3, bottom: 0.5 },
      middle: { left: 0.5, bottom: 0.6 },
      ring: { left: 0.7, bottom: 0.5 },
      pinky: { left: 0.85, bottom: 0.3 },
      complete: { left: 0.5, bottom: 0.5 },
    };
    
    return {
      left: positions[finger].left * handSize,
      bottom: positions[finger].bottom * handSize,
    };
  };

  const currentPosition = getFingerPosition(phase);
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.8],
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Hand size={28} color={colors.primary} />
        <Text style={styles.title}>Finger Trace Breathing</Text>
      </View>

      <Text style={styles.description}>
        Trace along your fingers with your other hand as you breathe. 
        This combines touch and breath for a calming effect.
      </Text>

      <View style={styles.handContainer}>
        <View style={[styles.handOutline, { width: handSize, height: handSize }]}>
          <Text style={styles.handEmoji}>🖐️</Text>
          
          {isActive && phase !== 'complete' && (
            <Animated.View
              style={[
                styles.activeIndicator,
                {
                  left: currentPosition.left - 20,
                  bottom: currentPosition.bottom - 20,
                  opacity: glowOpacity,
                },
              ]}
            />
          )}
        </View>
      </View>

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>{getInstructionText()}</Text>
        {isActive && phase !== 'complete' && (
          <Text style={styles.timerText}>{timeLeft}s</Text>
        )}
      </View>

      <View style={styles.controls}>
        {!isActive ? (
          <TouchableOpacity
            style={[styles.controlButton, styles.primaryButton]}
            onPress={handleStart}
            activeOpacity={0.7}
          >
            <Play size={20} color={colors.surface} fill={colors.surface} />
            <Text style={styles.primaryButtonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={handlePause}
            activeOpacity={0.7}
          >
            <Pause size={20} color={colors.primary} />
            <Text style={styles.secondaryButtonText}>Pause</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton]}
          onPress={handleReset}
          activeOpacity={0.7}
        >
          <RotateCcw size={20} color={colors.primary} />
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.stepsContainer}>
        <Text style={styles.stepsTitle}>How it works:</Text>
        <Text style={styles.stepText}>1. Hold up one hand in front of you</Text>
        <Text style={styles.stepText}>2. Use your other hand to trace</Text>
        <Text style={styles.stepText}>3. Breathe in as you trace up each finger</Text>
        <Text style={styles.stepText}>4. Breathe out as you trace down</Text>
      </View>
    </View>
  );
}

const createStyles = (colors: ReturnType<typeof useTheme>['colors']) => StyleSheet.create({
  container: {
    flex: 1,
    padding: spacing.xl,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: fontSizes.xxl,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  description: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: spacing.xxl,
  },
  handContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.xxxl,
  },
  handOutline: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative' as const,
  },
  handEmoji: {
    fontSize: 200,
  },
  activeIndicator: {
    position: 'absolute' as const,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 20,
    elevation: 8,
  },
  instructionContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
    minHeight: 80,
  },
  instructionText: {
    fontSize: fontSizes.lg,
    color: colors.text,
    textAlign: 'center' as const,
    fontWeight: fontWeights.semibold,
    marginBottom: spacing.md,
  },
  timerText: {
    fontSize: fontSizes.huge,
    fontWeight: fontWeights.bold,
    color: colors.primary,
  },
  controls: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.xxl,
  },
  controlButton: {
    flex: 1,
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
  stepsContainer: {
    backgroundColor: colors.surface,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  stepsTitle: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  stepText: {
    fontSize: fontSizes.sm,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: spacing.xs,
  },
});
