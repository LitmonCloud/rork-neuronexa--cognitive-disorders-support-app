import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { Play, Pause, RotateCcw } from 'lucide-react-native';
import { BreathingPattern } from '@/types/mentalHealth';
import { useTheme } from '@/contexts/ThemeContext';

interface BreathingExerciseProps {
  pattern: BreathingPattern;
  onComplete?: () => void;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'holdAfterExhale';

export default function BreathingExercise({ pattern, onComplete }: BreathingExerciseProps) {
  const { colors } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [currentCycle, setCurrentCycle] = useState(0);
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [timeLeft, setTimeLeft] = useState(pattern.inhale);
  
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const opacityAnim = useRef(new Animated.Value(0.3)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const { width } = Dimensions.get('window');
  const circleSize = Math.min(width * 0.6, 280);

  const getNextPhaseDuration = useCallback((): number => {
    switch (phase) {
      case 'inhale':
        return pattern.hold;
      case 'hold':
        return pattern.exhale;
      case 'exhale':
        return pattern.holdAfterExhale || 0;
      case 'holdAfterExhale':
        return pattern.inhale;
      default:
        return pattern.inhale;
    }
  }, [phase, pattern]);

  const completeCycle = useCallback(() => {
    const nextCycle = currentCycle + 1;
    if (nextCycle >= pattern.cycles) {
      setIsActive(false);
      setCurrentCycle(0);
      setPhase('inhale');
      setTimeLeft(pattern.inhale);
      onComplete?.();
    } else {
      setCurrentCycle(nextCycle);
      setPhase('inhale');
    }
  }, [currentCycle, pattern.cycles, pattern.inhale, onComplete]);

  const moveToNextPhase = useCallback(() => {
    switch (phase) {
      case 'inhale':
        setPhase('hold');
        break;
      case 'hold':
        setPhase('exhale');
        break;
      case 'exhale':
        if (pattern.holdAfterExhale && pattern.holdAfterExhale > 0) {
          setPhase('holdAfterExhale');
        } else {
          completeCycle();
        }
        break;
      case 'holdAfterExhale':
        completeCycle();
        break;
    }
  }, [phase, pattern.holdAfterExhale, completeCycle]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          moveToNextPhase();
          return getNextPhaseDuration();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, moveToNextPhase, getNextPhaseDuration]);

  const animatePhase = useCallback(() => {
    const duration = timeLeft * 1000;

    switch (phase) {
      case 'inhale':
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.8,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
        ]).start();
        break;
      case 'hold':
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.9,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]).start();
        break;
      case 'exhale':
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.5,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.3,
            duration,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 2,
            duration,
            useNativeDriver: true,
          }),
        ]).start();
        break;
      case 'holdAfterExhale':
        Animated.parallel([
          Animated.timing(scaleAnim, {
            toValue: 0.5,
            duration: duration / 2,
            useNativeDriver: true,
          }),
          Animated.timing(opacityAnim, {
            toValue: 0.4,
            duration: duration / 2,
            useNativeDriver: true,
          }),
        ]).start();
        break;
    }
  }, [timeLeft, phase, scaleAnim, opacityAnim, rotateAnim]);

  useEffect(() => {
    if (!isActive) return;

    animatePhase();
  }, [phase, isActive, animatePhase]);

  const handleStart = () => {
    setIsActive(true);
    setCurrentCycle(0);
    setPhase('inhale');
    setTimeLeft(pattern.inhale);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentCycle(0);
    setPhase('inhale');
    setTimeLeft(pattern.inhale);
    scaleAnim.setValue(0.5);
    opacityAnim.setValue(0.3);
    rotateAnim.setValue(0);
  };

  const getPhaseText = (): string => {
    switch (phase) {
      case 'inhale':
        return 'Breathe In';
      case 'hold':
        return 'Hold';
      case 'exhale':
        return 'Breathe Out';
      case 'holdAfterExhale':
        return 'Hold';
      default:
        return '';
    }
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1, 2],
    outputRange: ['0deg', '180deg', '360deg'],
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 20,
    },
    cycleContainer: {
      marginBottom: 20,
    },
    cycleText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.textSecondary,
    },
    circleContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      marginVertical: 20,
      position: 'relative' as const,
    },
    circle: {
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    innerCircle: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    pulseRing1: {
      position: 'absolute' as const,
      width: 320,
      height: 320,
      borderRadius: 160,
      borderWidth: 2,
      borderColor: colors.primaryLight,
      opacity: 0.2,
    },
    pulseRing2: {
      position: 'absolute' as const,
      width: 360,
      height: 360,
      borderRadius: 180,
      borderWidth: 1,
      borderColor: colors.primaryLight,
      opacity: 0.1,
    },
    phaseText: {
      fontSize: 24,
      fontWeight: '700' as const,
      color: colors.surface,
      marginBottom: 8,
    },
    timerText: {
      fontSize: 48,
      fontWeight: '800' as const,
      color: colors.surface,
    },
    instructionContainer: {
      paddingHorizontal: 32,
      marginBottom: 20,
      alignItems: 'center',
    },
    instructionText: {
      fontSize: 16,
      color: colors.textSecondary,
      textAlign: 'center' as const,
      lineHeight: 24,
    },
    controls: {
      flexDirection: 'row',
      gap: 16,
      marginBottom: 20,
    },
    controlButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 24,
      paddingVertical: 14,
      borderRadius: 12,
      minWidth: 120,
      justifyContent: 'center',
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
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.surface,
    },
    secondaryButtonText: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.primary,
    },
    patternInfo: {
      flexDirection: 'row',
      gap: 24,
      paddingHorizontal: 32,
    },
    patternInfoRow: {
      alignItems: 'center',
    },
    patternInfoLabel: {
      fontSize: 12,
      color: colors.textLight,
      marginBottom: 4,
    },
    patternInfoValue: {
      fontSize: 16,
      fontWeight: '600' as const,
      color: colors.text,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.cycleContainer}>
        <Text style={styles.cycleText}>
          Cycle {currentCycle + 1} of {pattern.cycles}
        </Text>
      </View>

      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            styles.circle,
            {
              width: circleSize,
              height: circleSize,
              borderRadius: circleSize / 2,
              backgroundColor: pattern.color,
              transform: [{ scale: scaleAnim }, { rotate }],
              opacity: opacityAnim,
            },
          ]}
        >
          <View style={styles.innerCircle}>
            <Text style={styles.phaseText}>{getPhaseText()}</Text>
            <Text style={styles.timerText}>{timeLeft}</Text>
          </View>
        </Animated.View>

        <View style={styles.pulseRing1} />
        <View style={styles.pulseRing2} />
      </View>

      <View style={styles.instructionContainer}>
        <Text style={styles.instructionText}>
          {phase === 'inhale' && 'Slowly breathe in through your nose'}
          {phase === 'hold' && 'Hold your breath gently'}
          {phase === 'exhale' && 'Slowly breathe out through your mouth'}
          {phase === 'holdAfterExhale' && 'Pause before the next breath'}
        </Text>
      </View>

      <View style={styles.controls}>
        {!isActive ? (
          <TouchableOpacity
            style={[styles.controlButton, styles.primaryButton]}
            onPress={handleStart}
          >
            <Play size={24} color={colors.surface} fill={colors.surface} />
            <Text style={styles.primaryButtonText}>Start</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.controlButton, styles.secondaryButton]}
            onPress={handlePause}
          >
            <Pause size={24} color={colors.primary} />
            <Text style={styles.secondaryButtonText}>Pause</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.controlButton, styles.secondaryButton]}
          onPress={handleReset}
        >
          <RotateCcw size={24} color={colors.primary} />
          <Text style={styles.secondaryButtonText}>Reset</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.patternInfo}>
        <View style={styles.patternInfoRow}>
          <Text style={styles.patternInfoLabel}>Inhale:</Text>
          <Text style={styles.patternInfoValue}>{pattern.inhale}s</Text>
        </View>
        {pattern.hold > 0 && (
          <View style={styles.patternInfoRow}>
            <Text style={styles.patternInfoLabel}>Hold:</Text>
            <Text style={styles.patternInfoValue}>{pattern.hold}s</Text>
          </View>
        )}
        <View style={styles.patternInfoRow}>
          <Text style={styles.patternInfoLabel}>Exhale:</Text>
          <Text style={styles.patternInfoValue}>{pattern.exhale}s</Text>
        </View>
        {pattern.holdAfterExhale && pattern.holdAfterExhale > 0 && (
          <View style={styles.patternInfoRow}>
            <Text style={styles.patternInfoLabel}>Hold:</Text>
            <Text style={styles.patternInfoValue}>{pattern.holdAfterExhale}s</Text>
          </View>
        )}
      </View>
    </View>
  );
}
