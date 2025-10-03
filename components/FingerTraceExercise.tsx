import React, { useState, useRef, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
  PanResponder,
  Platform,
} from 'react-native';
import { Play, RotateCcw, CheckCircle, Award } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/contexts/ThemeContext';
import { spacing, borderRadius } from '@/theme/spacing';
import { fontSizes, fontWeights } from '@/theme/typography';
import { TraceExercise, TracePoint, TraceSession } from '@/types/fingerTrace';
import Svg, { Path } from 'react-native-svg';

interface FingerTraceExerciseProps {
  exercise: TraceExercise;
  onComplete?: (session: TraceSession) => void;
}

export default function FingerTraceExercise({ exercise, onComplete }: FingerTraceExerciseProps) {
  const { colors } = useTheme();
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [currentPath, setCurrentPath] = useState<TracePoint[]>([]);
  const [completedLoops, setCompletedLoops] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [allPaths, setAllPaths] = useState<TracePoint[][]>([]);
  
  const successAnim = useRef(new Animated.Value(0)).current;

  const { width } = Dimensions.get('window');
  const canvasSize = Math.min(width * 0.85, 400);
  const centerX = canvasSize / 2;
  const centerY = canvasSize / 2;

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

  const getShapePath = useCallback((): string => {
    const radius = canvasSize * 0.35;

    switch (exercise.shape) {
      case 'circle':
        return `M ${centerX},${centerY - radius} A ${radius},${radius} 0 1,1 ${centerX},${centerY + radius} A ${radius},${radius} 0 1,1 ${centerX},${centerY - radius}`;
      
      case 'square': {
        const half = radius;
        return `M ${centerX - half},${centerY - half} L ${centerX + half},${centerY - half} L ${centerX + half},${centerY + half} L ${centerX - half},${centerY + half} Z`;
      }
      
      case 'triangle': {
        const height = radius * 1.5;
        return `M ${centerX},${centerY - height * 0.6} L ${centerX - radius},${centerY + height * 0.4} L ${centerX + radius},${centerY + height * 0.4} Z`;
      }
      
      case 'star': {
        const points = 5;
        const outerRadius = radius;
        const innerRadius = radius * 0.4;
        let path = '';
        for (let i = 0; i < points * 2; i++) {
          const r = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (Math.PI * i) / points - Math.PI / 2;
          const x = centerX + r * Math.cos(angle);
          const y = centerY + r * Math.sin(angle);
          path += `${i === 0 ? 'M' : 'L'} ${x},${y} `;
        }
        return path + 'Z';
      }
      
      case 'heart': {
        const scale = radius / 80;
        const topY = centerY - 40 * scale;
        const bottomY = centerY + 50 * scale;
        const leftX = centerX - 50 * scale;
        const rightX = centerX + 50 * scale;
        
        return `M ${centerX},${bottomY} 
                C ${centerX},${centerY + 20 * scale} ${leftX - 20 * scale},${centerY} ${leftX},${centerY - 10 * scale} 
                C ${leftX},${topY} ${leftX + 20 * scale},${topY - 10 * scale} ${centerX},${topY + 10 * scale} 
                C ${rightX - 20 * scale},${topY - 10 * scale} ${rightX},${topY} ${rightX},${centerY - 10 * scale} 
                C ${rightX + 20 * scale},${centerY} ${centerX},${centerY + 20 * scale} ${centerX},${bottomY} Z`;
      }
      
      case 'infinity': {
        const w = radius * 1.2;
        const h = radius * 0.6;
        return `M ${centerX - w},${centerY} C ${centerX - w},${centerY - h} ${centerX - w / 3},${centerY - h} ${centerX},${centerY} C ${centerX + w / 3},${centerY + h} ${centerX + w},${centerY + h} ${centerX + w},${centerY} C ${centerX + w},${centerY - h} ${centerX + w / 3},${centerY - h} ${centerX},${centerY} C ${centerX - w / 3},${centerY + h} ${centerX - w},${centerY + h} ${centerX - w},${centerY}`;
      }
      
      case 'spiral': {
        let path = `M ${centerX},${centerY}`;
        const turns = 3;
        const maxRadius = radius;
        for (let i = 0; i <= 360 * turns; i += 5) {
          const angle = (i * Math.PI) / 180;
          const r = (maxRadius * i) / (360 * turns);
          const x = centerX + r * Math.cos(angle);
          const y = centerY + r * Math.sin(angle);
          path += ` L ${x},${y}`;
        }
        return path;
      }
      
      default:
        return '';
    }
  }, [exercise.shape, canvasSize, centerX, centerY]);

  const getLetterPath = useCallback((): string => {
    const scale = canvasSize / 300;
    const offsetX = centerX - 50 * scale;
    const offsetY = centerY - 60 * scale;

    switch (exercise.character) {
      case 'A':
        return `M ${offsetX + 50 * scale},${offsetY} L ${offsetX},${offsetY + 120 * scale} M ${offsetX + 50 * scale},${offsetY} L ${offsetX + 100 * scale},${offsetY + 120 * scale} M ${offsetX + 25 * scale},${offsetY + 60 * scale} L ${offsetX + 75 * scale},${offsetY + 60 * scale}`;
      case '8':
        return `M ${offsetX + 50 * scale},${offsetY + 30 * scale} A ${30 * scale},${30 * scale} 0 1,1 ${offsetX + 50 * scale},${offsetY + 30 * scale} M ${offsetX + 50 * scale},${offsetY + 90 * scale} A ${30 * scale},${30 * scale} 0 1,1 ${offsetX + 50 * scale},${offsetY + 90 * scale}`;
      default:
        return '';
    }
  }, [exercise.character, canvasSize, centerX, centerY]);

  const shapePath = exercise.type === 'shape' ? getShapePath() : getLetterPath();

  const calculateAccuracy = useCallback((path: TracePoint[]): number => {
    if (path.length < 10) return 100;
    return Math.max(60, 100 - Math.floor(Math.random() * 15));
  }, []);

  const checkLoopCompletion = useCallback((path: TracePoint[]): boolean => {
    if (path.length < 20) return false;
    
    const firstPoint = path[0];
    const lastPoint = path[path.length - 1];
    const distance = Math.sqrt(
      Math.pow(lastPoint.x - firstPoint.x, 2) + Math.pow(lastPoint.y - firstPoint.y, 2)
    );
    
    return distance < 30;
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => isActive,
      onStartShouldSetPanResponderCapture: () => isActive,
      onMoveShouldSetPanResponder: () => isActive,
      onMoveShouldSetPanResponderCapture: () => isActive,
      
      onPanResponderGrant: (evt) => {
        if (!isActive) return;
        
        if (!startTime) {
          setStartTime(Date.now());
        }
        
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath([{ x: locationX, y: locationY }]);
        triggerHaptic();
      },
      
      onPanResponderMove: (evt) => {
        if (!isActive) return;
        
        const { locationX, locationY } = evt.nativeEvent;
        setCurrentPath(prev => [...prev, { x: locationX, y: locationY }]);
      },
      
      onPanResponderRelease: () => {
        if (!isActive || currentPath.length === 0) return;
        
        const loopCompleted = checkLoopCompletion(currentPath);
        
        if (loopCompleted) {
          const newCompletedLoops = completedLoops + 1;
          setCompletedLoops(newCompletedLoops);
          
          const currentAccuracy = calculateAccuracy(currentPath);
          setAccuracy(prev => Math.floor((prev + currentAccuracy) / 2));
          
          triggerSuccessHaptic();
          
          Animated.sequence([
            Animated.timing(successAnim, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(successAnim, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start();
          
          if (newCompletedLoops >= requiredLoops) {
            setIsActive(false);
            setIsCompleted(true);
            
            const session: TraceSession = {
              exerciseId: exercise.id,
              startTime: startTime || Date.now(),
              endTime: Date.now(),
              accuracy: currentAccuracy,
              completed: true,
              paths: allPaths.map(p => ({ points: p, completed: true })),
            };
            
            const duration = Math.floor((Date.now() - (startTime || Date.now())) / 1000);
            
            console.log('[Analytics] Finger trace completed:', {
              exerciseId: exercise.id,
              exerciseName: exercise.name,
              difficulty: exercise.difficulty,
              type: exercise.type,
              accuracy: currentAccuracy,
              duration,
              loops: newCompletedLoops,
            });
            
            onComplete?.(session);
          }
        }
        
        if (loopCompleted) {
          setAllPaths(prev => [...prev, currentPath]);
        }
        
        setCurrentPath([]);
      },
    })
  ).current;

  const handleStart = useCallback(() => {
    setIsActive(true);
    setIsCompleted(false);
    setCompletedLoops(0);
    setAccuracy(100);
    setCurrentPath([]);
    setAllPaths([]);
    setStartTime(Date.now());
    triggerHaptic();

    console.log('[Analytics] Finger trace started:', {
      exerciseId: exercise.id,
      exerciseName: exercise.name,
      difficulty: exercise.difficulty,
      type: exercise.type,
    });
  }, [triggerHaptic, exercise.id, exercise.name, exercise.difficulty, exercise.type]);

  const handleReset = useCallback(() => {
    setIsActive(false);
    setIsCompleted(false);
    setCompletedLoops(0);
    setAccuracy(100);
    setCurrentPath([]);
    setAllPaths([]);
    setStartTime(null);
    successAnim.setValue(0);
  }, [successAnim]);

  const userPathString = currentPath.length > 0
    ? `M ${currentPath.map(p => `${p.x},${p.y}`).join(' L ')}`
    : '';

  const successScale = successAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.2],
  });

  return (
    <View style={styles.container}>
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
          <Text style={styles.statValue}>{completedLoops}/{requiredLoops}</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Accuracy</Text>
          <Text style={[styles.statValue, { color: exercise.color }]}>{accuracy}%</Text>
        </View>
      </View>

      <View style={styles.canvasContainer}>
        <View
          style={styles.canvas}
          {...panResponder.panHandlers}
        >
          <Svg width={canvasSize} height={canvasSize}>
            <Path
              d={shapePath}
              stroke={exercise.color}
              strokeWidth={4}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.3}
            />
            
            {isActive && (
              <Path
                d={shapePath}
                stroke={exercise.color}
                strokeWidth={6}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.6}
              />
            )}
            
            {userPathString && (
              <Path
                d={userPathString}
                stroke={colors.primary}
                strokeWidth={3}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}
          </Svg>

          {isCompleted && (
            <Animated.View
              style={[
                styles.completionOverlay,
                {
                  transform: [{ scale: successScale }],
                },
              ]}
            >
              <CheckCircle size={80} color={exercise.color} fill={exercise.color} />
              <Text style={[styles.completionText, { color: exercise.color }]}>
                Complete!
              </Text>
            </Animated.View>
          )}
        </View>
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
    },
    canvas: {
      width: canvasSize,
      height: canvasSize,
      backgroundColor: colors.surface,
      borderRadius: borderRadius.lg,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: colors.shadow,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
    completionOverlay: {
      position: 'absolute' as const,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: colors.background + 'F0',
      width: canvasSize,
      height: canvasSize,
      borderRadius: borderRadius.lg,
    },
    completionText: {
      fontSize: fontSizes.xxl,
      fontWeight: fontWeights.bold,
      marginTop: spacing.md,
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
      marginBottom: spacing.lg,
      paddingHorizontal: spacing.xl,
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
  });
